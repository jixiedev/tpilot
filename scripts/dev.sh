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
#   ./scripts/dev.sh stop     # stops only the PIDs recorded in .run/*.pid
#   ./scripts/dev.sh status   # show ports

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"

# Load .env so API keys reach the python processes.
set -a
[ -f "$ROOT/.env" ] && . "$ROOT/.env"
set +a

cmd="${1:-help}"

# --allow-blocking: langgraph dev enables blockbuster once its run queue
# starts, concurrently with the AG-UI lifespan that builds the agent. Agent
# construction and turns do synchronous file and SQLite I/O (offload store,
# profiles, config), so without the flag startup fails at random with
# "BlockingError: Blocking call to os.mkdir" and /agui never comes up.
LANGGRAPH_DEV_ARGS=(--no-browser --port 8000 --allow-blocking)

start_langgraph_bg() {
  mkdir -p "$ROOT/.run"
  cd "$ROOT"
  # Re-export critical API keys so the nohup'd child of `set -a` keeps
  # them (on macOS nohup's process group can drop those exports).
  export MiniMax_API_KEY GLM_API_KEY OpenRouter_API_KEY SenseNova_API_KEY TAVILY_API_KEY LANGSMITH_API_KEY
  # set -m: run the job in its own process group (pgid == pid) so `stop`
  # can signal exactly that group.
  set -m
  nohup .venv/bin/langgraph dev "${LANGGRAPH_DEV_ARGS[@]}" \
    > "$ROOT/.run/langgraph.log" 2>&1 &
  set +m
  echo $! > "$ROOT/.run/langgraph.pid"
}

start_next_bg() {
  mkdir -p "$ROOT/.run"
  cd "$ROOT/frontend"
  set -m
  nohup npm run dev > "$ROOT/.run/next.log" 2>&1 &
  set +m
  echo $! > "$ROOT/.run/next.pid"
}

# Signal ``pid`` and all of its descendants (children first). ``npm run dev``
# runs ``next dev`` as a grandchild, so killing only the recorded PID would
# orphan the real server.
kill_tree() {
  local pid="$1" sig="$2" child
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do
    kill_tree "$child" "$sig"
  done
  kill "-$sig" "$pid" 2>/dev/null || true
}

# Stop only the process recorded in .run/<name>.pid, plus its process group
# (``start`` puts each background job in its own group) and descendants.
# Never matches by command line, so unrelated ``langgraph dev`` / ``next dev``
# processes on the machine are left alone.
stop_pidfile() {
  local name="$1"
  local pidfile="$ROOT/.run/${name}.pid"
  [ -f "$pidfile" ] || return 0
  local pid pgid i
  pid="$(tr -d '[:space:]' < "$pidfile")"
  case "$pid" in
    ''|*[!0-9]*)
      echo "ignoring $pidfile: not a pid ('$pid')"
      rm -f "$pidfile"
      return 0
      ;;
  esac
  if kill -0 "$pid" 2>/dev/null; then
    pgid="$(ps -o pgid= -p "$pid" 2>/dev/null | tr -d '[:space:]' || true)"
    kill_tree "$pid" TERM
    # Only signal the group when the recorded process leads it, i.e. the
    # group was created for this job and is not our own shell's group.
    if [ -n "$pgid" ] && [ "$pgid" = "$pid" ]; then
      kill -TERM -- "-$pgid" 2>/dev/null || true
    fi
    for i in 1 2 3 4 5 6 7 8 9 10; do
      kill -0 "$pid" 2>/dev/null || break
      sleep 0.5
    done
    if kill -0 "$pid" 2>/dev/null; then
      kill_tree "$pid" KILL
      if [ -n "$pgid" ] && [ "$pgid" = "$pid" ]; then
        kill -KILL -- "-$pgid" 2>/dev/null || true
      fi
    fi
    echo "stopped $name (pid $pid)"
  else
    echo "$name (pid $pid) not running; removing stale pid file"
  fi
  rm -f "$pidfile"
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
    exec .venv/bin/langgraph dev "${LANGGRAPH_DEV_ARGS[@]}"
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
    ;;
  status)
    status_check 8000 "langgraph dev  "
    status_check 3000 "next dev       "
    # If the AG-UI endpoint is mounted, /agui POST will be 422 (missing
    # required RunAgentInput fields) — that confirms the route is live.
    # 404 means langgraph dev answered but the route is NOT mounted.
    agui_code="$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 -X POST -H 'content-type: application/json' -d '{}' "http://127.0.0.1:8000/agui" 2>/dev/null || true)"
    agui_code="${agui_code:-000}"
    case "$agui_code" in
      200|422) echo "AG-UI endpoint  http://127.0.0.1:8000/agui  ALIVE (HTTP $agui_code)" ;;
      000)     echo "AG-UI endpoint  http://127.0.0.1:8000/agui  not responding (is langgraph dev running?)" ;;
      *)       echo "AG-UI endpoint  http://127.0.0.1:8000/agui  not mounted (HTTP $agui_code; langgraph.json http.app may be wrong / not loaded)" ;;
    esac
    ;;
  help|*)
    cat <<EOF
Usage: $0 <command>

  backend   run langgraph dev on :8000 (foreground) — also serves /agui
  frontend  run next dev on :3000 (foreground)
  start     start both in the background; PIDs in .run/*.pid
  stop      stop the background processes recorded in .run/*.pid (and their children)
  status    show whether :8000 and :3000 are alive, and whether /agui is mounted

After 'start', open http://localhost:3000 in your browser.
EOF
    ;;
esac
