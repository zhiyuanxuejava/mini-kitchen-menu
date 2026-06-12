#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$ROOT_DIR/.logs"
STATE_FILE="$LOG_DIR/dev-services.linux.json"
PORTS=(3001 5173 5174)

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

if command -v lsof >/dev/null 2>&1; then
  for port in "${PORTS[@]}"; do
    pids="$(lsof -ti tcp:"$port" || true)"
    if [[ -n "$pids" ]]; then
      while read -r pid; do
        [[ -n "$pid" ]] && stop_pid_tree "$pid"
      done <<< "$pids"
    fi
  done
fi

rm -f "$STATE_FILE"

echo "Stopped backend/admin/frontend-h5 services if they were running."
