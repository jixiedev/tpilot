#!/bin/sh
# Component dispatcher for the TahoePilot image.
# All settings come from files in $TAHOEPILOT_CONFIG_DIR (default /tahoepilot/config).
set -e

cmd="${1:-backend}"
[ $# -gt 0 ] && shift

run_backend() {
  exec python -m tahoepilot.server.app "$@"
}

# Next.js host/port/backend URL come from [frontend] in <config dir>/server.toml.
frontend_env() {
  eval "$(cd /tahoepilot && python -m tahoepilot.settings.server_config)"
}

run_frontend() {
  frontend_env
  cd /tahoepilot/frontend
  exec node server.js "$@"
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
    python -m tahoepilot.server.app &
    backend_pid=$!
    (frontend_env && cd /tahoepilot/frontend && exec node server.js) &
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
    exec python -m tahoepilot "$@"
    ;;
  shell|sh|bash)
    exec /bin/bash "$@"
    ;;
  help|-h|--help)
    cat <<'EOF'
Usage: <image> COMMAND [args...]

  backend    AG-UI / FastAPI server ([agui] in server.toml)   [default]
  frontend   Next.js UI ([frontend] in server.toml)
  all        backend + frontend in one container
  cli        terminal chat (python -m tahoepilot)
  shell      bash shell
  <other>    run as a raw command, e.g. `python -m evals ...`
EOF
    ;;
  *)
    exec "$cmd" "$@"
    ;;
esac
