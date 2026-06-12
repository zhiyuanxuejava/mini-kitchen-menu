#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$ROOT_DIR/.logs"
STATE_FILE="$LOG_DIR/dev-services.linux.json"

mkdir -p "$LOG_DIR"

SERVICES=(
  "backend|3001|http://127.0.0.1:3001/health|npm run dev:backend"
  "admin|5174|http://127.0.0.1:5174|npm run dev:admin"
  "frontend-h5|5173|http://127.0.0.1:5173|npm run dev:frontend:h5:lan"
)

stop_pid_tree() {
  local pid="${1:-}"
  if [[ -z "$pid" ]]; then
    return 0
  fi

  if kill -0 "$pid" 2>/dev/null; then
    kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
    sleep 1
    kill -KILL -- "-$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null || true
  fi
}

stop_port() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    local pids
    pids="$(lsof -ti tcp:"$port" || true)"
    if [[ -n "$pids" ]]; then
      while read -r pid; do
        [[ -n "$pid" ]] && stop_pid_tree "$pid"
      done <<< "$pids"
    fi
  fi
}

if [[ -f "$STATE_FILE" ]]; then
  while IFS='|' read -r name pid _; do
    [[ -n "${pid:-}" ]] && stop_pid_tree "$pid"
  done < <(python - <<'PY' "$STATE_FILE"
import json, sys
path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)
for name, item in data.items():
    print(f"{name}|{item.get('pid','')}|")
PY
)
fi

for service in "${SERVICES[@]}"; do
  IFS='|' read -r _name port _url _cmd <<< "$service"
  stop_port "$port"
done

wait_for_url() {
  local url="$1"
  local deadline=$((SECONDS + 30))
  while (( SECONDS < deadline )); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}

declare -A PIDS
declare -A URLS
declare -A OUTS
declare -A ERRS
declare -A PORTS

for service in "${SERVICES[@]}"; do
  IFS='|' read -r name port url cmd <<< "$service"
  out="$LOG_DIR/$name.out.log"
  err="$LOG_DIR/$name.err.log"
  rm -f "$out" "$err"
  (
    cd "$ROOT_DIR"
    exec setsid bash -lc "$cmd" >"$out" 2>"$err" < /dev/null
  ) &
  pid=$!
  PIDS["$name"]="$pid"
  URLS["$name"]="$url"
  OUTS["$name"]="$out"
  ERRS["$name"]="$err"
  PORTS["$name"]="$port"
done

for service in "${SERVICES[@]}"; do
  IFS='|' read -r name _port url _cmd <<< "$service"
  if ! wait_for_url "$url"; then
    echo "FAILED: $name did not become ready. Check logs:"
    echo "  ${OUTS[$name]}"
    echo "  ${ERRS[$name]}"
    exit 1
  fi
done

python - <<'PY' "$STATE_FILE" "${PIDS[backend]}" "${PIDS[admin]}" "${PIDS[frontend-h5]}" "${OUTS[backend]}" "${OUTS[admin]}" "${OUTS[frontend-h5]}" "${ERRS[backend]}" "${ERRS[admin]}" "${ERRS[frontend-h5]}"
import json, sys
state_file = sys.argv[1]
data = {
    "backend": {"pid": int(sys.argv[2]), "port": 3001, "url": "http://127.0.0.1:3001/health", "out": sys.argv[5], "err": sys.argv[8]},
    "admin": {"pid": int(sys.argv[3]), "port": 5174, "url": "http://127.0.0.1:5174", "out": sys.argv[6], "err": sys.argv[9]},
    "frontend-h5": {"pid": int(sys.argv[4]), "port": 5173, "url": "http://127.0.0.1:5173", "out": sys.argv[7], "err": sys.argv[10]},
}
with open(state_file, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
PY

echo "All services are running in background."
echo "backend      pid=${PIDS[backend]}      url=http://127.0.0.1:3001/health"
echo "admin        pid=${PIDS[admin]}      url=http://127.0.0.1:5174"
echo "frontend-h5  pid=${PIDS[frontend-h5]}      url=http://127.0.0.1:5173"
echo
echo "LAN URLs:"
echo "  backend  http://192.168.3.36:3001/health"
echo "  admin    http://192.168.3.36:5174"
echo "  h5       http://192.168.3.36:5173"
echo
echo "State file: $STATE_FILE"
