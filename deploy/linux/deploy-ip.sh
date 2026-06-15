#!/usr/bin/env bash
set -euo pipefail

PUBLIC_IP="${PUBLIC_IP:-101.44.160.63}"
ENABLE_ADMIN="${ENABLE_ADMIN:-0}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@kitchen.local}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-123456}"
H5_PORT="${H5_PORT:-8951}"
ADMIN_PORT="${ADMIN_PORT:-8081}"
BACKEND_PORT="${BACKEND_PORT:-3001}"
SERVICE_NAME="${SERVICE_NAME:-mini-kitchen-menu-backend}"
SITE_NAME="${SITE_NAME:-mini-kitchen-menu}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

if [[ ! -f "$APP_DIR/package.json" ]]; then
  echo "package.json not found under $APP_DIR"
  exit 1
fi

detect_run_user() {
  if [[ -n "${RUN_USER:-}" ]]; then
    echo "$RUN_USER"
    return
  fi

  if [[ -n "${SUDO_USER:-}" && "${SUDO_USER}" != "root" ]]; then
    echo "$SUDO_USER"
    return
  fi

  id -un
}

RUN_USER="$(detect_run_user)"
RUN_GROUP="${RUN_GROUP:-$(id -gn "$RUN_USER")}"

BACKEND_ENV_FILE="$APP_DIR/backend/.env"
FRONTEND_ENV_FILE="$APP_DIR/frontend/.env.production"
ADMIN_ENV_FILE="$APP_DIR/admin/.env.production"

is_truthy() {
  case "${1:-}" in
    1|true|TRUE|yes|YES|on|ON) return 0 ;;
    *) return 1 ;;
  esac
}

format_origin() {
  local host="$1"
  local port="$2"

  if [[ "$port" == "80" ]]; then
    printf 'http://%s' "$host"
    return
  fi

  printf 'http://%s:%s' "$host" "$port"
}

run_root() {
  if [[ "${EUID}" -eq 0 ]]; then
    "$@"
  else
    sudo "$@"
  fi
}

backup_if_exists() {
  local file="$1"
  if [[ -f "$file" ]]; then
    cp "$file" "${file}.bak.$(date +%Y%m%d%H%M%S)"
  fi
}

generate_secret() {
  if [[ -n "${JWT_SECRET:-}" ]]; then
    echo "$JWT_SECRET"
    return
  fi

  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
    return
  fi

  if command -v python3 >/dev/null 2>&1; then
    python3 - <<'PY'
import secrets
print(secrets.token_hex(32))
PY
    return
  fi

  head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n'
}

JWT_SECRET_VALUE="$(generate_secret)"

install_base_packages() {
  if ! command -v apt-get >/dev/null 2>&1; then
    echo "This script currently supports Debian/Ubuntu only."
    exit 1
  fi

  echo "Installing system packages..."
  run_root apt-get update
  run_root apt-get install -y nginx curl ca-certificates
}

install_nodejs_if_needed() {
  local node_major=0

  if command -v node >/dev/null 2>&1; then
    node_major="$(node -p "process.versions.node.split('.')[0]")"
  fi

  if (( node_major >= 20 )); then
    echo "Node.js $node_major already installed."
    return
  fi

  echo "Installing Node.js 20..."
  local setup_script
  setup_script="$(mktemp)"
  curl -fsSL https://deb.nodesource.com/setup_20.x -o "$setup_script"
  run_root bash "$setup_script"
  rm -f "$setup_script"
  run_root apt-get install -y nodejs
}

write_env_files() {
  echo "Writing production env files..."
  backup_if_exists "$BACKEND_ENV_FILE"
  backup_if_exists "$FRONTEND_ENV_FILE"
  local cors_origins
  cors_origins="$(format_origin "$PUBLIC_IP" "$H5_PORT")"
  if is_truthy "$ENABLE_ADMIN"; then
    backup_if_exists "$ADMIN_ENV_FILE"
    cors_origins="$cors_origins,$(format_origin "$PUBLIC_IP" "$ADMIN_PORT")"
  fi

  cat >"$BACKEND_ENV_FILE" <<EOF
NODE_ENV=production
DATABASE_URL="file:./dev.db"
JWT_SECRET="$JWT_SECRET_VALUE"
PORT=$BACKEND_PORT
HOST=127.0.0.1
CORS_ORIGINS="$cors_origins"
MAX_UPLOAD_FILE_SIZE_MB=4
ADMIN_EMAILS="$ADMIN_EMAIL"
WECHAT_APP_ID="replace-if-you-still-build-mp-weixin"
WECHAT_APP_SECRET="replace-if-you-still-build-mp-weixin"
EOF

  cat >"$FRONTEND_ENV_FILE" <<'EOF'
VITE_API_BASE="/api"
EOF

  if ! is_truthy "$ENABLE_ADMIN"; then
    return
  fi

  cat >"$ADMIN_ENV_FILE" <<'EOF'
VITE_API_BASE="/api"
EOF
}

install_node_dependencies() {
  echo "Installing npm dependencies..."
  (
    cd "$APP_DIR"
    npm ci --include=dev
  )
}

generate_prisma_client() {
  echo "Generating Prisma client..."
  (
    cd "$APP_DIR"
    npm run prisma:generate
  )
}

build_project() {
  echo "Building project..."
  (
    cd "$APP_DIR"
    npm run build:frontend:h5
    npm run build:backend
    if is_truthy "$ENABLE_ADMIN"; then
      npm run build:admin
    fi
  )
}

ensure_writable_dirs() {
  mkdir -p "$APP_DIR/backend/uploads" "$APP_DIR/backend/prisma"
  run_root chown -R "$RUN_USER:$RUN_GROUP" "$APP_DIR/backend/uploads" "$APP_DIR/backend/prisma" "$APP_DIR/backend/dist"
}

install_systemd_service() {
  echo "Installing systemd service..."
  local temp_service
  temp_service="$(mktemp)"

  cat >"$temp_service" <<EOF
[Unit]
Description=Mini Kitchen Menu Backend
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
EnvironmentFile=$BACKEND_ENV_FILE
ExecStart=/usr/bin/env node backend/dist/server.js
Restart=always
RestartSec=5
User=$RUN_USER
Group=$RUN_GROUP

[Install]
WantedBy=multi-user.target
EOF

  run_root cp "$temp_service" "/etc/systemd/system/$SERVICE_NAME.service"
  rm -f "$temp_service"

  run_root systemctl daemon-reload
  run_root systemctl enable --now "$SERVICE_NAME.service"
  run_root systemctl restart "$SERVICE_NAME.service"
}

install_nginx_config() {
  echo "Installing nginx config..."
  local temp_nginx
  temp_nginx="$(mktemp)"

  cat >"$temp_nginx" <<EOF
server {
    listen $H5_PORT default_server;
    server_name $PUBLIC_IP _;

    root $APP_DIR/frontend/dist/build/h5;
    index index.html;

    client_max_body_size 8m;

    location /api/ {
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_pass http://127.0.0.1:$BACKEND_PORT/;
    }

    location /assets/ {
        try_files \$uri =404;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    location /static/ {
        try_files \$uri =404;
        expires 7d;
        add_header Cache-Control "public";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

  if is_truthy "$ENABLE_ADMIN"; then
    cat >>"$temp_nginx" <<EOF

server {
    listen $ADMIN_PORT;
    server_name $PUBLIC_IP _;

    root $APP_DIR/admin/dist;
    index index.html;

    client_max_body_size 8m;

    location /api/ {
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_pass http://127.0.0.1:$BACKEND_PORT/;
    }

    location /assets/ {
        try_files \$uri =404;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
  fi

  run_root cp "$temp_nginx" "/etc/nginx/sites-available/$SITE_NAME"
  rm -f "$temp_nginx"

  run_root ln -sf "/etc/nginx/sites-available/$SITE_NAME" "/etc/nginx/sites-enabled/$SITE_NAME"
  run_root rm -f /etc/nginx/sites-enabled/default
  run_root nginx -t
  run_root systemctl enable nginx
  run_root systemctl restart nginx
}

wait_for_url() {
  local url="$1"
  local label="$2"
  local attempts="${3:-30}"
  local sleep_seconds="${4:-2}"

  for ((i = 1; i <= attempts; i++)); do
    if curl --fail --silent "$url" >/dev/null; then
      echo "$label is ready."
      return 0
    fi
    sleep "$sleep_seconds"
  done

  echo "$label did not become ready in time: $url"
  return 1
}

verify_services() {
  echo "Verifying backend health..."
  wait_for_url "http://127.0.0.1:$BACKEND_PORT/health" "Backend health"
  wait_for_url "http://127.0.0.1:$H5_PORT/" "H5 site"
  if is_truthy "$ENABLE_ADMIN"; then
    wait_for_url "http://127.0.0.1:$ADMIN_PORT/" "Admin site"
  fi
}

verify_media_access() {
  echo "Verifying imported dish images..."
  wait_for_url "http://127.0.0.1:$H5_PORT/api/static/assets/dishes/real/hongshaorou.jpg" "Imported dish image"

  echo "Verifying uploaded file access route..."
  local probe_file="deploy-upload-probe.txt"
  printf 'ok\n' >"$APP_DIR/backend/uploads/$probe_file"
  wait_for_url "http://127.0.0.1:$H5_PORT/api/uploads/$probe_file" "Upload media route"
  rm -f "$APP_DIR/backend/uploads/$probe_file"
}

seed_admin_user() {
  if ! is_truthy "$ENABLE_ADMIN"; then
    return
  fi

  echo "Ensuring admin account..."

  local payload
  payload="$(printf '{"email":"%s","password":"%s"}' "$ADMIN_EMAIL" "$ADMIN_PASSWORD")"

  local tmp_body
  tmp_body="$(mktemp)"

  local status
  status="$(
    curl --silent --show-error --output "$tmp_body" --write-out "%{http_code}" \
      -H "Content-Type: application/json" \
      -d "$payload" \
      "http://127.0.0.1:$BACKEND_PORT/auth/login/email" || true
  )"

  if [[ "$status" == "200" ]]; then
    echo "Admin account is ready."
    rm -f "$tmp_body"
    return 0
  fi

  if [[ "$status" == "401" ]]; then
    echo "Admin account already exists with a different password. Keeping existing password."
    rm -f "$tmp_body"
    return 0
  fi

  echo "Failed to initialize admin account. HTTP status: $status"
  cat "$tmp_body"
  rm -f "$tmp_body"
  return 1
}

print_summary() {
  cat <<EOF

Deployment completed.

Public URLs:
- H5: $(format_origin "$PUBLIC_IP" "$H5_PORT")/
- Health: $(format_origin "$PUBLIC_IP" "$H5_PORT")/api/health

Backend service:
- systemctl status $SERVICE_NAME.service

Generated files:
- $BACKEND_ENV_FILE
- $FRONTEND_ENV_FILE

Notes:
- Imported dish images are served through: $(format_origin "$PUBLIC_IP" "$H5_PORT")/api/static/...
- Uploaded user files are served through: $(format_origin "$PUBLIC_IP" "$H5_PORT")/api/uploads/...
- Make sure your cloud security group allows TCP $H5_PORT
- Database file is under: $APP_DIR/backend/prisma/dev.db
- Uploaded files are under: $APP_DIR/backend/uploads
EOF

  if is_truthy "$ENABLE_ADMIN"; then
    cat <<EOF
- Admin: $(format_origin "$PUBLIC_IP" "$ADMIN_PORT")/
- $ADMIN_ENV_FILE
- Admin email: $ADMIN_EMAIL
- If this is a fresh database, the script initialized admin password as: $ADMIN_PASSWORD
- If this database already had the admin account, its original password was kept
- If admin is enabled, also allow TCP $ADMIN_PORT
EOF
  fi
}

echo "App directory: $APP_DIR"
echo "Run user: $RUN_USER"
echo "Public IP: $PUBLIC_IP"
echo "H5 port: $H5_PORT"
echo "Admin enabled: $ENABLE_ADMIN"
if is_truthy "$ENABLE_ADMIN"; then
  echo "Admin port: $ADMIN_PORT"
fi

install_base_packages
install_nodejs_if_needed
write_env_files
install_node_dependencies
generate_prisma_client
build_project
ensure_writable_dirs
install_systemd_service
install_nginx_config
verify_services
verify_media_access
seed_admin_user
print_summary
