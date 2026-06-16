#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="${BASE_DIR:-/h5}"
APP_NAME="${APP_NAME:-mini-kitchen-menu}"
ARCHIVE_PATH="${1:-}"

usage() {
  cat <<EOF
Usage:
  bash upgrade-upload-bundle.sh /h5/mini-kitchen-menu-linux-upload-xxxxxx.tar.gz

Optional env:
  BASE_DIR=/h5
  APP_NAME=mini-kitchen-menu

What it does:
  1. backup current database and uploads
  2. extract the upload archive
  3. replace the old app directory
  4. restore database and uploads
  5. run deploy/linux/deploy-ip.sh in the new directory
EOF
}

log() {
  printf '[upgrade] %s\n' "$1"
}

fail() {
  printf '[upgrade] ERROR: %s\n' "$1" >&2
  exit 1
}

require_dir() {
  local dir="$1"
  [[ -d "$dir" ]] || fail "directory not found: $dir"
}

require_file() {
  local file="$1"
  [[ -f "$file" ]] || fail "file not found: $file"
}

if [[ -z "$ARCHIVE_PATH" ]]; then
  usage
  exit 1
fi

if [[ "$ARCHIVE_PATH" != /* ]]; then
  ARCHIVE_PATH="$(cd "$(dirname "$ARCHIVE_PATH")" && pwd)/$(basename "$ARCHIVE_PATH")"
fi

require_file "$ARCHIVE_PATH"
require_dir "$BASE_DIR"

APP_DIR="$BASE_DIR/$APP_NAME"
DB_PATH="$APP_DIR/backend/prisma/dev.db"
UPLOADS_DIR="$APP_DIR/backend/uploads"
DB_BACKUP="$BASE_DIR/dev.db.bak"
UPLOADS_BACKUP="$BASE_DIR/uploads.bak"
EXTRACTED_DIR="$BASE_DIR/mini-kitchen-menu-linux-upload"
DEPLOY_SCRIPT_REL="deploy/linux/deploy-ip.sh"

archive_name="$(basename "$ARCHIVE_PATH")"
if [[ "$archive_name" != *.tar.gz ]]; then
  fail "archive must be a .tar.gz file: $archive_name"
fi

log "base dir: $BASE_DIR"
log "app dir: $APP_DIR"
log "archive: $ARCHIVE_PATH"

if [[ -d "$APP_DIR" ]]; then
  log "backing up database and uploads from current app"

  if [[ -f "$DB_PATH" ]]; then
    cp "$DB_PATH" "$DB_BACKUP"
    log "database backup saved to $DB_BACKUP"
  else
    log "database file not found, skipping database backup"
  fi

  rm -rf "$UPLOADS_BACKUP"
  mkdir -p "$UPLOADS_BACKUP"
  if [[ -d "$UPLOADS_DIR" ]]; then
    cp -a "$UPLOADS_DIR/." "$UPLOADS_BACKUP/" 2>/dev/null || true
    log "uploads backup saved to $UPLOADS_BACKUP"
  else
    log "uploads directory not found, skipping uploads backup"
  fi
else
  log "current app directory does not exist, skipping backup step"
fi

if [[ -d "$EXTRACTED_DIR" ]]; then
  log "removing old extracted temp directory $EXTRACTED_DIR"
  rm -rf "$EXTRACTED_DIR"
fi

log "extracting archive"
(
  cd "$BASE_DIR"
  tar -xzf "$ARCHIVE_PATH"
)

require_dir "$EXTRACTED_DIR"
require_file "$EXTRACTED_DIR/package.json"

log "replacing app directory"
rm -rf "$APP_DIR"
mv "$EXTRACTED_DIR" "$APP_DIR"

mkdir -p "$APP_DIR/backend/prisma" "$APP_DIR/backend/uploads"

if [[ -f "$DB_BACKUP" ]]; then
  log "restoring database backup"
  cp "$DB_BACKUP" "$APP_DIR/backend/prisma/dev.db"
else
  log "database backup not found, skipping restore"
fi

if [[ -d "$UPLOADS_BACKUP" ]] && [[ -n "$(find "$UPLOADS_BACKUP" -mindepth 1 -maxdepth 1 2>/dev/null)" ]]; then
  log "restoring uploads backup"
  cp -a "$UPLOADS_BACKUP/." "$APP_DIR/backend/uploads/"
else
  log "uploads backup is empty or missing, skipping restore"
fi

DEPLOY_SCRIPT="$APP_DIR/$DEPLOY_SCRIPT_REL"
require_file "$DEPLOY_SCRIPT"

log "running deploy script"
(
  cd "$APP_DIR"
  bash "./$DEPLOY_SCRIPT_REL"
)

log "upgrade completed"
