# TahoePilot web stack

This directory holds the Next.js UI for Databot. This README covers the whole browser → Next.js → AG-UI → LangGraph path, including the Python side that serves it (`agui_server.py`, `langgraph_graphs.py`, `langgraph.json`, `scripts/dev.sh`).

Related docs:

| Topic | Doc |
| --- | --- |
| Agent runtime, catalog, specialists | [agent/README.md](../agent/README.md) |
| Databot pipeline, gates, UI action semantics | [agent/specialists/databot/README.md](../agent/specialists/databot/README.md) |
| Local config, paths, checkpoint DB location | [config/README.md](../config/README.md) |
| System overview | [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) |

## Basic concepts

### AG-UI events

[AG-UI](https://docs.ag-ui.com) is the event protocol between the agent backend and the UI. Each run is one HTTP POST that streams encoded events back (SSE). The events this stack relies on:

| Event | Meaning here |
| --- | --- |
| `RUN_STARTED` | A run for `thread_id` / `run_id` began. |
| `RUN_FINISHED` | Terminal. With `outcome: {type: "interrupt"}` it means "paused at a gate", not "done" (see `emit_interrupt_outcome` below). |
| `RUN_ERROR` | Terminal. Carries `message` and `code` (`AGENT_RUNTIME_ERROR`, `INCOMPLETE_STREAM` are emitted by `agui_server.py`). |
| `STATE_SNAPSHOT` | Full graph state (the `DatabotState` keys present in the output schema). Drives the artifact panel. |
| `MESSAGES_SNAPSHOT` | Full chat transcript. |
| `TOOL_CALL_START` / `TOOL_CALL_ARGS` / `TOOL_CALL_END` / `TOOL_CALL_RESULT` | One LangGraph tool call, re-emitted by `ag_ui_langgraph.LangGraphAgent`. Rendered as tool cards in the chat. |

### Interrupts and gates

Databot pauses at human gates by calling LangGraph `interrupt(...)` in `agent/specialists/databot/gates.py`. The payload built by `interrupt_kwargs()` has the shape `{id, reason, message}`, where `id` is `databot-cards-gate` or `databot-sql-gate` and `message` is a JSON string `{question, options, default, gate, ...}`.

`LangGraphAgent` ends the run with `RUN_FINISHED` + interrupt outcome. On the client the interrupt appears in `agent.pendingInterrupts`; `GatePanel` parses `message` with `parseGateInterruptMessage()` and renders the decision buttons. Choosing a decision resumes the graph; `parse_resume()` on the backend accepts either a bare decision string or `{decision, comments}`; an empty or unrecognized reply never continues, the gate asks again with a `note`. The payload's `default` only preselects a button in the UI. Gate meaning (approve / deny-comments / deny-halt / dryrun) is documented in the Databot README.

### Threads

A thread is one conversation. CopilotKit owns the thread id (`agent.threadId`); it is sent as `thread_id` in every AG-UI request and UI action, and it is the LangGraph checkpoint key. Conversation state lives in the SQLite checkpoint DB (`get_local_paths().checkpoint_db`, overridable with `TAHOEPILOT_CHECKPOINT_DB` or `AGUI_CHECKPOINT_DB`). The Next.js side uses `InMemoryAgentRunner`, which holds only UI thread metadata and is lost on restart. "+ New chat" (`DatabotNewChatButton`) calls `startNewThread()` to mint a new thread id.

### CopilotKit agent ids

The string `databot` is the agent id and must match in every place it appears:

| Location | Usage |
| --- | --- |
| `agui_server.py` | `AGENT_NAME = "databot"` (name of the `LangGraphAgent`) |
| `app/api/copilotkit/[...path]/route.ts` | key in `CopilotRuntime({ agents: { databot: new HttpAgent(...) } })` |
| `app/providers.tsx` | `<CopilotKit agent="databot">` |
| `app/page.tsx` | `<CopilotChatConfigurationProvider agentId="databot">` |
| components | `useAgent({ agentId: "databot" })`, `useInterrupt({ agentId: "databot" })` |

## Design philosophy

- **Single backend process.** `langgraph dev` loads `agui_server.py:app` through the `http.app` field of `langgraph.json` and mounts it beside its own LangGraph API routes. There is no separate AG-UI deployment; port 8000 serves both. `python agui_server.py` exists only as a standalone fallback (uvicorn, `AGUI_HOST` / `AGUI_PORT`).
- **Next.js is a thin proxy.** The browser only talks to Next.js (`/api/copilotkit/*`, `/api/databot/actions`). Both route handlers forward server-side to `AGUI_BACKEND_URL`, so the FastAPI app needs no CORS setup.
- **One shared graph, one agent clone per request.** `AguiRuntime` (on `app.state.runtime`) builds the compiled Databot graph once, with a long-lived `aiosqlite` connection behind `AsyncSqliteSaver`. Each `/agui` request calls `runtime.agent.clone()`, because `LangGraphAgent` keeps per-run state in `self.active_run` and a shared instance breaks under concurrency.
- **Every stream ends with a terminal event.** `_stream_events()` guarantees the client sees `RUN_FINISHED` or `RUN_ERROR`, so the chat never hangs on a half-closed stream.
- **UI edits patch the checkpoint, not the conversation.** Editing card selection or SQL in the artifact panel does not send a chat message. `/agui/actions` writes a state patch straight into the checkpoint with `graph.aupdate_state(...)`, after validating the current stage. Because gates pause inside layer subgraphs, the patch must target the paused subgraph's checkpoint: the endpoint reads it with `DatabotGraphBuilder.aget_active_state()` and updates using that snapshot's `config`. Patching the outer checkpoint would edit pre-layer values the gate never sees.

## How it works

### Components

| Piece | File | Role |
| --- | --- | --- |
| Root layout | `app/layout.tsx` | Fonts, CopilotKit v2 styles, pre-hydration color-scheme script, wraps in `Providers`. |
| Providers | `app/providers.tsx` | `<CopilotKit runtimeUrl="/api/copilotkit" agent="databot" useSingleEndpoint={false}>`, color-scheme context and `ColorSchemeToggle`. |
| Page | `app/page.tsx` | Top bar (theme, Debug toggle, New chat), `CopilotChat` on the left, tool renderers, gate + side panels on the right. |
| CopilotKit route | `app/api/copilotkit/[...path]/route.ts` | `CopilotRuntime` with one `HttpAgent` per agent id, `createCopilotRuntimeHandler({ basePath: "/api/copilotkit" })`, exports `GET` and `POST`. |
| UI action route | `app/api/databot/actions/route.ts` | `POST` proxy to `${AGUI_BACKEND_URL}/actions`; passes status codes through. |
| AG-UI server | `agui_server.py` | `/agui`, `/agui/actions`, `/agui/health`, `/health`, lifespan. |
| LangGraph entry | `langgraph.json`, `langgraph_graphs.py` | Graphs for `langgraph dev`, `.env` loading, `http.app` mount. |

Frontend components in `app/components/`:

| Component | Renders / does |
| --- | --- |
| `GatePanel` | `useInterrupt({ renderInChat: false })` gate dock in the right column. `HumanGate` shows title, draft SQL or selected models (live state preferred over interrupt payload), selection summary, the four decision buttons with the backend default marked, and a feedback box; `resolve()` sends `decision` or `{decision, comments}`. Also contains a `ChartGate` variant for `gate === "chart"`. |
| `GateHelpPopover` | Per-gate help text from `gateUserInstructions()` (`databotGateUtils.ts`). |
| `DatabotMessageView` | Wraps `CopilotChatMessageView`: hides reasoning messages, appends `DatabotGateChatBanner` and the interrupt element. |
| `DatabotAssistantMessage` | Hides `<think>` blocks and internal narration, removes inspector button and toolbar. |
| `DatabotGateChatNotice` (`DatabotGateChatBanner`) | "Action required" banner in chat while a gate is pending. |
| `DatabotToolRenderers` | `useRenderTool` cards for pipeline tools (`fetch_related_models`, `commit_cards`, `propose_sql`, `trino_explain`, `record_metric_conflict`, DataHub tools, ...) plus `useDefaultRenderTool` for the rest. Uses `ToolCallCard` and `toolRenderUtils.ts`. |
| `DatabotSidePanels` | Right-column container; optional resizable `AgentDebugPanel` plus `DatabotArtifactPanel`. |
| `DatabotArtifactPanel` | "Working state": stage pill, halt/dryrun banners, tabs Cards (`TableCardList`), SQL (`SqlEditor`), Results (`ExecutionChart`, Recharts), and a gate-decision audit trail. Tab follows `state.stage` unless the user picks one. |
| `TableCardList` / `SqlEditor` | Interactive only in the matching stage (`prepare_cards` with review cards / `prepare_sql`); edits go through `useDatabotActions`. |
| `AgentDebugPanel` | Read-only: thread id, message count, tools in state, pending interrupts, running flag, event tick counter. |
| `DatabotNewChatButton` | Disabled while running; `startNewThread()`, `resetDatabotAgentView()` (`databotClientReset.ts`), bump `sessionKey` to remount panels. |
| `DatabotSessionContext` | `sessionKey` used as React `key` for gate and side panels. |
| `useDatabotActions` | Client for UI actions; merges returned `state` into `agent.setState()`. |
| `useAgentRefresh` | Subscribes to agent events to re-render, since the AG-UI client mutates `agent` fields in place. |
| `types.ts` | TypeScript mirror of `DatabotState` (`agent/specialists/databot/state.py`). |

### Chat turn

```text
Browser (CopilotChat)        Next.js /api/copilotkit/*        FastAPI /agui (in langgraph dev)     LangGraph graph
        |  user message              |                                 |                                  |
        |--------------------------->|  CopilotRuntime -> HttpAgent    |                                  |
        |                            |-- POST /agui RunAgentInput ---->|  ensure_built(); agent.clone()   |
        |                            |   (thread_id, run_id, messages) |-- agent.run(input) ------------->|
        |                            |                                 |                                  |-- nodes / tools,
        |                            |<===== SSE: RUN_STARTED ========|<---------------------------------|   checkpoint to SQLite
        |<===== events forwarded ====|  TOOL_CALL_*, STATE_SNAPSHOT,  |                                  |
        |  tool cards, panels update |  MESSAGES_SNAPSHOT, ...        |                                  |
        |<===========================|<===== RUN_FINISHED ===========|  (or RUN_ERROR / INCOMPLETE_STREAM)
```

### Gate decision

```text
LangGraph (layer subgraph)     /agui stream                 Browser
   gates.py interrupt({id, reason, message})
        |------------------------->| RUN_FINISHED outcome=interrupt
        |                          |---------------------------->| agent.pendingInterrupts = [...]
        |                          |                             | GatePanel (useInterrupt) renders HumanGate
        |                          |                             | DatabotGateChatBanner in chat
        |                          |                             | user clicks "Approve" (+ optional feedback)
        |                          |<----- new run with resume --| resolve("approve" | {decision, comments})
        |<-- Command(resume=...) --|                             |
   parse_resume() -> (decision, comments); graph continues, streams events as in a chat turn
```

`useDatabotActions().regenerateSql()` uses the same mechanism when an SQL gate is open: it builds a resume array with `buildResumeArray()` resolving each pending interrupt as `{decision: "deny-comments", comments}` and calls `agent.runAgent({ resume })`.

### UI action

```text
Browser (TableCardList / SqlEditor)   Next.js /api/databot/actions     FastAPI /agui/actions                 LangGraph checkpoint
   useDatabotActions.runPatch()
        |-- POST {thread_id, action, ...} -->|-- POST ${AGUI_BACKEND_URL}/actions -->|
        |                                    |                                       | validate action name (else 400)
        |                                    |                                       | aget_active_state(graph, config) --> paused layer snapshot
        |                                    |                                       | build_ui_action_patch() (stage check, else 409)
        |                                    |                                       | aupdate_state(snapshot.config, patch) --> write
        |                                    |                                       | aget_active_state() again, merge
        |<-- {ok, action, state} ------------|<--------------------------------------|
   agent.setState({...agent.state, ...state})   (no run is started)
```

Supported actions (request body model `DatabotUiActionBody`):

| `action` | Extra fields | Allowed stage | Frontend caller |
| --- | --- | --- | --- |
| `update_card_selection` | `selected_card_names` | `prepare_cards` | `updateCardSelection()` |
| `propose_sql` | `sql`, `validated` | `prepare_sql` | `saveSqlDraft()` |
| `request_sql_regenerate` | `feedback` | `prepare_sql` | `regenerateSql()` when no gate is pending; then `agent.runAgent({})` if idle |

What each patch writes is defined in `agent/specialists/databot/ui_actions.py` and explained in the Databot README.

### Backend details

- **`AguiRuntime`.** Created at import as `app.state.runtime = AguiRuntime(_make_agent())`. The agent starts with a `_DummyCompiledGraph` placeholder because `langgraph dev` imports the module before an event loop exists. `ensure_built()` builds the real graph once under an `asyncio.Lock` (via `AgentCatalog` with `AsyncSqliteSaver`) and swaps it into the agent. `close()` closes the SQLite connection.
- **Lifespan.** `_lifespan` runs `ensure_local_dirs()`, builds the graph eagerly so a broken setup fails startup, and closes the runtime on shutdown. `langgraph dev` only accepts a single `lifespan=` (no `on_startup` handlers). `/agui` and `/agui/actions` also call `ensure_built()`, so a request never runs against the placeholder.
- **`emit_interrupt_outcome=True`** attaches the interrupt outcome to `RUN_FINISHED` so CopilotKit v2 treats a paused gate as pending, not finished. `enable_legacy_on_interrupt_event=False` drops the v1 `on_interrupt` custom event, which froze the chat panel.
- **Why `ag_ui_langgraph.LangGraphAgent`, not `copilotkit.LangGraphAGUIAgent`.** In the pinned versions the latter's `__init__` breaks `agent.clone()`.
- **Why a hand-rolled `/agui` endpoint.** `ag_ui_langgraph.add_langgraph_fastapi_endpoint` has no hook for the deferred graph build and its signature changes between versions. `agui_endpoint` mirrors its body: build, clone, `EventEncoder(accept=...)`, `StreamingResponse`.
- **Terminal-event guarantee (`_stream_events`).** Client disconnect (`CancelledError`) is logged and re-raised with no further output. Any other exception, including `BaseException` from the agent's background tasks, becomes `RUN_ERROR` with code `AGENT_RUNTIME_ERROR`. A stream that ends without a terminal event gets `RUN_ERROR` with code `INCOMPLETE_STREAM`.
- **`langgraph.json` graphs.** `databot`, `knowledge` and `intent` point at `langgraph_graphs.py` factories (`databot_ui_agent`, `knowledge_ui_agent`, `intent_ui_agent`), which build the agent through `AgentCatalog` with a `MemorySaver`. They are served by `langgraph dev`'s own API and Studio. The `/agui` endpoint does not use them: it builds its own Databot graph with the SQLite checkpointer. `"env": ".env"` makes `langgraph dev` load the repo `.env`.

## Usage

### Prerequisites

- Python 3.11 virtualenv at `.venv` with project dependencies (including `langgraph-cli`, which provides `.venv/bin/langgraph`).
- Node.js and npm for the frontend; dependencies installed in `frontend/` (`npm install`, using `package-lock.json`).
- Model and tool credentials in the repo-root `.env`.

Key frontend dependencies: `next` 16.3.3, `react` 19.2.8, `@copilotkit/react-core` and `@copilotkit/runtime` (v2 APIs imported from `/v2` subpaths), `@ag-ui/client` (`HttpAgent`, `buildResumeArray`), `recharts`. Scripts in `package.json`: `dev`, `build`, `start`, `lint`.

### Environment

Root `.env` (names only; loaded by `scripts/dev.sh` and by `langgraph dev`):

| Group | Keys |
| --- | --- |
| LLM providers | `MiniMax_API_KEY`, `GLM_API_KEY`, `OpenRouter_API_KEY`, `SenseNova_API_KEY`, `INTELLIGENCE_API_KEY` |
| Tools | `TAVILY_API_KEY`, `DATAHUB_GMS_TOKEN`, `TRINO_PASSWORD`, `AIRFLOW_MCP_AUTH_TOKEN`, `AIRFLOW_LEGACY_MCP_AUTH_TOKEN` |
| Tracing | `LANGSMITH_API_KEY` |
| Hugging Face | `HF_ENDPOINT`, `HF_HUB_DISABLE_XET` |

`scripts/dev.sh` re-exports `MiniMax_API_KEY GLM_API_KEY OpenRouter_API_KEY SenseNova_API_KEY TAVILY_API_KEY LANGSMITH_API_KEY` before starting `langgraph dev`, because background (`nohup`) children on macOS do not reliably inherit `set -a` exports.

Web-stack variables (all optional):

| Variable | Read by | Default | Purpose |
| --- | --- | --- | --- |
| `AGUI_BACKEND_URL` | both Next.js route handlers (server-side) | `http://localhost:8000/agui` | Where Next.js forwards AG-UI runs and UI actions. |
| `AGUI_AGENT_PATH` | `agui_server.py` | `/agui` | Mount path of the AG-UI endpoints. Change `AGUI_BACKEND_URL` to match. |
| `AGUI_HOST`, `AGUI_PORT` | `agui_server.py` `main()` only | `127.0.0.1`, `8000` | Bind address for standalone `python agui_server.py`. |
| `TAHOEPILOT_CHECKPOINT_DB`, `AGUI_CHECKPOINT_DB` | `config/local_config.py` | `<data dir>/checkpoints.sqlite` | Checkpoint DB path. |

The frontend uses no `NEXT_PUBLIC_*` variables; the browser only calls same-origin `/api/*` routes.

### Run

```bash
# two terminals
./scripts/dev.sh backend    # langgraph dev --no-browser --port 8000 --allow-blocking (also serves /agui)
./scripts/dev.sh frontend   # npm run dev in frontend/ on :3000

# or one terminal, background
./scripts/dev.sh start      # each in its own process group; PIDs in .run/langgraph.pid, .run/next.pid
./scripts/dev.sh status     # probes :8000, :3000 and POST /agui (404 = route not mounted)
./scripts/dev.sh stop       # stops only the recorded PIDs (+ their process group / children), removes the pid files
```

Open http://localhost:3000. Background logs go to `.run/langgraph.log` and `.run/next.log`.

### Health checks

| Check | Expected |
| --- | --- |
| `curl http://localhost:8000/health` | `{"status": "ok", "agent": {"name": "databot", "path": "/agui"}, "checkpoint_db": "..."}` |
| `curl http://localhost:8000/agui/health` | `{"status": "ok", "agent": {"name": "databot"}}` |
| `./scripts/dev.sh status` | `POST /agui` with `{}` returns 422 (missing `RunAgentInput` fields), confirming the route is mounted. A 404 is reported as `not mounted (HTTP 404 ...)`; no answer at all as `not responding`. |
| Debug toggle in the UI | `AgentDebugPanel` shows thread id, tool count and pending interrupts. |

Backend tests for this layer: `.venv/bin/python -m pytest tests/test_agui_server.py tests/test_databot_ui_actions.py`.

### Troubleshooting

| Symptom | Likely cause / where to look |
| --- | --- |
| `langgraph dev` fails at startup with a graph/build error | `_lifespan` builds the graph eagerly; check `.run/langgraph.log` for catalog, model or checkpoint errors (missing API key, unwritable data dir). |
| `/agui` returns 404 | `http.app` in `langgraph.json` not loaded, or `AGUI_AGENT_PATH` differs from `AGUI_BACKEND_URL`. |
| Chat shows `INCOMPLETE_STREAM` | The agent stream ended without `RUN_FINISHED` / `RUN_ERROR`; look for the run in the backend log. |
| Chat shows `AGENT_RUNTIME_ERROR: <ExceptionType>: ...` | Exception inside the run (often an LLM provider error); full traceback is logged as `agui_endpoint: unhandled exception`. |
| Next.js returns 500 / fetch failed on `/api/copilotkit` or `/api/databot/actions` | Backend not running or `AGUI_BACKEND_URL` wrong. |
| CORS errors in the browser | Something calls `:8000` directly. The FastAPI app has no CORS middleware; go through the Next.js routes. |
| Artifact panel shows `agent not ready` / `no active thread` | `useDatabotActions` was called before CopilotKit synced the agent or before a thread exists; send a message first. |
| UI action returns 409 `action ... is not allowed in stage ...` | Stage check in `build_ui_action_patch()`; the paused layer is not in the stage the action needs. Also returned for empty `sql` / `feedback`. |
| UI action returns 400 `unknown action` or 422 | Action name not in the endpoint's allow-list, or body fails `DatabotUiActionBody` validation (e.g. empty `thread_id`). |
| Gate panel never appears though the run stopped | Interrupt `message` is not valid gate JSON (`parseGateInterruptMessage` returns `null`), or `emit_interrupt_outcome` was turned off. |
| A state key is missing in the UI | AG-UI drops keys not in the graph's output schema; enable debug logging for `agui_server` to see `_log_schema_keys` output. |
| Tool calls land in "View in Inspector" instead of the chat | The runtime is not pointed at `/agui` through `HttpAgent`; see the comments in `route.ts` and `agui_server.py`. |

## Extension notes

### Exposing another agent to the UI

Today `/agui` serves one agent (`AGENT_NAME = "databot"`). To expose another one (for example `knowledge`, already in the catalog and `langgraph.json`):

1. In `agui_server.py`, build a second graph and `LangGraphAgent` (its own `AguiRuntime`, or generalize `_build_graph()` / `_make_agent()` over an agent name) and mount it on its own path, e.g. a second `@app.post(...)` that clones that agent per request and reuses `_stream_events()` so the terminal-event guarantee holds.
2. In `app/api/copilotkit/[...path]/route.ts`, add an entry to `agents` keyed by the new agent id with an `HttpAgent` pointing at the new path.
3. In the UI, use that id in `useAgent` / `useInterrupt` / `CopilotChatConfigurationProvider`. `Providers` sets `agent="databot"` as the default; components for the new agent must pass their id explicitly.
4. Add `useRenderTool` renderers for its tools, or rely on `useDefaultRenderTool`.
5. If the agent should also be visible in Studio, add a factory to `langgraph_graphs.py` and an entry under `graphs` in `langgraph.json`.

### Adding a UI action end to end

1. **Patch logic** — `agent/specialists/databot/ui_actions.py`: add the name to `DatabotUiAction`, its allowed stages to `ACTION_ALLOWED_STAGES`, an `apply_*` function, and a branch in `build_ui_action_patch()`. If it writes a new state key, add it to `DATABOT_STATE_KEYS` so `databot_state_subset()` returns it.
2. **Endpoint** — `agui_server.py`: add the name to the allow-list in `databot_ui_action()` and any new field to `DatabotUiActionBody`. Keep using `aget_active_state()` and `snapshot.config`.
3. **Proxy** — no change; `app/api/databot/actions/route.ts` forwards the body as-is.
4. **Client** — `useDatabotActions.ts`: extend the `UiAction` union and add a callback that calls `runPatch()`. If the action should make the agent continue, start a run afterwards (as `regenerateSql()` does) or resume the pending interrupt.
5. **UI** — wire the callback in `DatabotArtifactPanel` (or a child), gated on the same stage as `ACTION_ALLOWED_STAGES` so the button is not offered when the backend would answer 409.
6. **Types and tests** — update `types.ts` if state shape changed; add cases to `tests/test_databot_ui_actions.py` and `tests/test_agui_server.py`.

## Pitfalls

- **This Next.js is not the one you know.** `frontend/AGENTS.md` (pulled in by `frontend/CLAUDE.md`) warns that Next.js 16.3 has breaking changes in APIs, conventions and file layout compared with older versions. Read the bundled guides in `node_modules/next/dist/docs/` before writing Next.js code and follow deprecation notices. `next dev` rewrites that block in `AGENTS.md`; do not hand-edit it.
- **CopilotKit v2 imports.** Use `@copilotkit/react-core/v2` and `@copilotkit/runtime/v2`. v1 hooks such as `useCopilotAction` are not used here, and the legacy `on_interrupt` event is disabled on the backend.
- **Agent id drift.** Renaming `databot` in one place silently disconnects hooks from the runtime agent. Update every location in the agent-id table.
- **Patching the outer checkpoint.** `graph.aget_state(config)` returns pre-layer values while a gate is pending. Always go through `DatabotGraphBuilder.aget_active_state()` and update with the returned snapshot's `config`.
- **Shared agent instance.** Never call `runtime.agent.run()` directly from a handler; clone per request.
- **Agent fields mutate in place.** React does not re-render on `agent.state` mutation; subscribe via `useAgentRefresh` (or `agent.subscribe`) in components that read it outside CopilotKit hooks.
- **Two Databot graphs.** Threads created in LangGraph Studio (`langgraph.json` graphs, `MemorySaver`) are not visible to the UI (`/agui`, SQLite checkpointer), and vice versa.
- **`InMemoryAgentRunner`.** Restarting Next.js loses its thread metadata; the checkpoint still exists under the same `thread_id`.
- **Run `langgraph dev` with `--allow-blocking`.** `langgraph dev` enables a blocking-I/O detector (blockbuster) when its run queue starts, concurrently with the AG-UI lifespan that builds the agent. Agent construction and turns do synchronous file and SQLite work (offload store, profiles, config), so without the flag startup fails at random with `BlockingError: Blocking call to os.mkdir`; the reloader stays up, `/agui` does not, and the browser shows `fetch failed` / `INCOMPLETE_STREAM`. `dev.sh` passes the flag; add it yourself if you launch `langgraph dev` by hand.
- **`./scripts/dev.sh stop`** only stops what `start` recorded in `.run/*.pid` (that PID, its process group, and its descendants). Servers started in the foreground with `backend` / `frontend`, or from another checkout, are not touched; stop them with Ctrl-C. If a pid file is lost, find the process with `lsof -i :8000` / `lsof -i :3000`.
