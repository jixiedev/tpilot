#!/usr/bin/env bash
# Launch the Databot dev stack end-to-end: langgraph dev on :8000 and
# the Next.js CopilotKit frontend on :3000. Both run in the foreground of
# their respective terminals.
#
# The AG-UI endpoint that backs the CopilotKit chat is mounted inside
# ``langgraph dev`` itself (via ``http.app`` in langgraph.json pointing
# at ``agui_server.py:app``), so you only need TWO terminals — not
# three. See ``agui_server.py`` for the AG-UI wiring details.
#
# Usage:
#   1. terminal A:  ./scripts/dev.sh backend
#   2. terminal B:  ./scripts/dev.sh frontend
#   3. open http://localhost:3000
#
# Or run both in the background from one terminal:
#   ./scripts/dev.sh start    # background, prints PIDs
#   ./scripts/dev.sh stop     # kills both
#   ./scripts/dev.sh status   # show ports

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"

# Load .env so API keys reach the python processes.
set -a
[ -f "$ROOT/.env" ] && . "$ROOT/.env"
set +a

cmd="${1:-help}"

start_langgraph_bg() {
  mkdir -p "$ROOT/.run"
  cd "$ROOT"
  # Re-export critical API keys so the nohup'd child of `set -a` keeps
  # them (on macOS nohup's process group can drop those exports).
  export MiniMax_API_KEY GLM_API_KEY OpenRouter_API_KEY SenseNova_API_KEY TAVILY_API_KEY LANGSMITH_API_KEY
  nohup .venv/bin/langgraph dev --no-browser --port 8000 \
    > "$ROOT/.run/langgraph.log" 2>&1 &
  echo $! > "$ROOT/.run/langgraph.pid"
}

start_next_bg() {
  mkdir -p "$ROOT/.run"
  cd "$ROOT/frontend"
  nohup npm run dev > "$ROOT/.run/next.log" 2>&1 &
  echo $! > "$ROOT/.run/next.pid"
}

stop_pidfile() {
  local name="$1"
  local pidfile="$ROOT/.run/${name}.pid"
  if [ -f "$pidfile" ]; then
    local pid
    pid="$(cat "$pidfile")"
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
      echo "stopped $name (pid $pid)"
    fi
    rm -f "$pidfile"
  fi
}

status_check() {
  local port="$1"
  local label="$2"
  local code
  code="$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://127.0.0.1:$port/" 2>/dev/null || echo "000")"
  case "$code" in
    200|404|422) echo "$label  http://127.0.0.1:$port  ALIVE (HTTP $code)" ;;
    *)           echo "$label  http://127.0.0.1:$port  not responding" ;;
  esac
}

case "$cmd" in
  backend)
    # ``langgraph dev`` is the parent for the AG-UI module
    # (``agui_server.py:app`` via ``langgraph.json http.app``). It needs
    # the same LLM API keys we already loaded into this shell above, but
    # nohup'd background invocations do NOT inherit ``set -a`` exports
    # reliably across every process group on macOS — so re-export the
    # keys we know the databot graph actually uses.
    export MiniMax_API_KEY GLM_API_KEY OpenRouter_API_KEY SenseNova_API_KEY TAVILY_API_KEY LANGSMITH_API_KEY
    cd "$ROOT"
    exec .venv/bin/langgraph dev --no-browser --port 8000
    ;;
  frontend)
    cd "$ROOT/frontend"
    exec npm run dev
    ;;
  start)
    start_langgraph_bg
    start_next_bg
    echo "langgraph dev  -> :8000  (pid $(cat "$ROOT/.run/langgraph.pid"))"
    echo "next dev       -> :3000  (pid $(cat "$ROOT/.run/next.pid"))"
    echo "AG-UI endpoint mounted at http://localhost:8000/agui (inside langgraph dev)"
    echo "logs: $ROOT/.run/{langgraph,next}.log"
    ;;
  stop)
    for name in next langgraph; do
      stop_pidfile "$name"
    done
    pkill -f "langgraph dev" 2>/dev/null || true
    pkill -f "next dev"      2>/dev/null || true
    ;;
  status)
    status_check 8000 "langgraph dev  "
    status_check 3000 "next dev       "
    # If the AG-UI endpoint is mounted, /agui POST will be 422 (missing
    # required RunAgentInput fields) — that confirms the route is live.
    agui_code="$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 -X POST -H 'content-type: application/json' -d '{}' "http://127.0.0.1:8000/agui" 2>/dev/null || echo "000")"
    case "$agui_code" in
      200|404|422) echo "AG-UI endpoint  http://127.0.0.1:8000/agui  ALIVE (HTTP $agui_code)" ;;
      *)           echo "AG-UI endpoint  http://127.0.0.1:8000/agui  not mounted (langgraph.json http.app may be wrong / not loaded)" ;;
    esac
    ;;
  help|*)
    cat <<EOF
Usage: $0 <command>

  backend   run langgraph dev on :8000 (foreground) — also serves /agui
  frontend  run next dev on :3000 (foreground)
  start     start both in the background; PIDs in .run/*.pid
  stop      stop both background processes
  status    show whether :8000 and :3000 are alive, and whether /agui is mounted

After 'start', open http://localhost:3000 in your browser.
EOF
    ;;
esac
