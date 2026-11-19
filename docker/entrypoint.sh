#!/bin/sh
# Component dispatcher for the TahoePilot image.
set -e

cmd="${1:-backend}"
[ $# -gt 0 ] && shift

run_backend() {
  exec python /app/agui_server.py "$@"
}

run_frontend() {
  cd /app/frontend
  HOSTNAME=0.0.0.0 PORT="${FRONTEND_PORT:-3000}" exec node server.js "$@"
}

case "$cmd" in
  backend)
    run_backend "$@"
    ;;
  frontend)
    run_frontend "$@"
    ;;
  all)
    # Backend + frontend in one container; exit when either one stops.
    python /app/agui_server.py &
    backend_pid=$!
    (cd /app/frontend && HOSTNAME=0.0.0.0 PORT="${FRONTEND_PORT:-3000}" node server.js) &
    frontend_pid=$!
    trap 'kill -TERM $backend_pid $frontend_pid 2>/dev/null' TERM INT
    while kill -0 $backend_pid 2>/dev/null && kill -0 $frontend_pid 2>/dev/null; do
      sleep 2
    done
    kill -TERM $backend_pid $frontend_pid 2>/dev/null || true
    wait
    exit 1
    ;;
  cli)
    exec python /app/main.py "$@"
    ;;
  shell|sh|bash)
    exec /bin/bash "$@"
    ;;
  help|-h|--help)
    cat <<'EOF'
Usage: <image> COMMAND [args...]

  backend    AG-UI / FastAPI server on $AGUI_PORT (default 8000)   [default]
  frontend   Next.js UI on $FRONTEND_PORT (default 3000); set AGUI_BACKEND_URL
  all        backend + frontend in one container
  cli        terminal chat (python main.py)
  shell      bash shell
  <other>    run as a raw command, e.g. `python -m evals ...`
EOF
    ;;
  *)
    exec "$cmd" "$@"
    ;;
esac
