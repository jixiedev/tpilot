#!/bin/sh
# Component dispatcher for the TahoePilot image.
# All settings come from files in $TAHOEPILOT_CONFIG_DIR (default /tahoepilot/config).
set -e

cmd="${1:-backend}"
[ $# -gt 0 ] && shift

# Retrieval models (embedding + rerank) for knowledge search. They live in
# [local_models].dir of rag.toml (or at [embedding]/[rerank].model when that is
# a directory). Only models missing there are downloaded, so a baked-in copy or
# a mounted volume that already holds them starts at once. The policy is
# [local_models].startup: "download" (default; if the download fails the server
# starts anyway and only knowledge search fails), "require" (exit instead), or
# "off" (no check).
prepare_rag_models() {
  # Prints "<state> <policy>"; details go to stderr.
  set -- $(python -m tahoepilot.rag check)
  state="${1:-error}"
  policy="${2:-download}"
  case "$state" in
    ready|off)
      return 0
      ;;
    missing)
      echo "entrypoint: downloading missing RAG models" >&2
      if python -m tahoepilot.rag download; then
        return 0
      fi
      echo "entrypoint: RAG model download failed" >&2
      ;;
    no-library)
      echo "entrypoint: RAG libraries are not installed; knowledge search is unavailable" >&2
      ;;
    *)
      echo "entrypoint: could not check the RAG models" >&2
      ;;
  esac
  if [ "$policy" = "require" ]; then
    echo "entrypoint: [local_models].startup = \"require\"; exiting" >&2
    exit 1
  fi
  echo "entrypoint: starting without knowledge search" >&2
}

run_backend() {
  prepare_rag_models
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
    prepare_rag_models
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
    prepare_rag_models
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
