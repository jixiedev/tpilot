# TahoePilot web stack

This directory holds the Next.js UI for TahoePilot. It has a landing page and one page per front agent: `/lead` talks to the `lead` agent (answers, plans and delegates to specialists; warehouse's SQL review appears in the chat), and `/databot` talks to `databot` (the staged pipeline with its cards and SQL gates). Each page has its own agent id, AG-UI endpoint and threads. This README covers the whole browser → Next.js → AG-UI → LangGraph path, including the Python side that serves it (`agui_server.py`, `langgraph_graphs.py`, `langgraph.json`, `scripts/dev.sh`).

Related docs:

| Topic | Doc |
| --- | --- |
| Agent runtime, catalog, lead, specialists | [agent/README.md](../agent/README.md) |
| Warehouse specialist and its SQL review | [agent/specialists/warehouse/README.md](../agent/specialists/warehouse/README.md) |
| Databot pipeline, gates, UI action semantics | [agent/specialists/databot/README.md](../agent/specialists/databot/README.md) |
| Local config, paths, checkpoint DB location | [config/README.md](../config/README.md) |
| System overview | [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) |

## Basic concepts

### Pages and front agents

| Route | Page | CopilotKit agent id | AG-UI endpoint |
| --- | --- | --- | --- |
| `/` | `app/page.tsx`: landing page with one card per front agent | – | – |
| `/lead` | `app/lead/page.tsx` | `lead` (`LEAD_AGENT_ID`, `app/components/leadState.ts`) | `POST /agui/lead` |
| `/databot` | `app/databot/page.tsx` | `databot` (`DATABOT_AGENT_ID`, `app/components/databotAgent.ts`) | `POST /agui/databot`, UI actions `POST /agui/databot/actions` |

`AppNav` switches between the two pages. A front agent is one with `front = true` in its TOML (`lead`, `databot`); `agui_server.FRONT_AGENTS` lists the ones served. Both share one SQLite checkpointer, but threads are separate per page.

### AG-UI events

[AG-UI](https://docs.ag-ui.com) is the event protocol between the agent backend and the UI. Each run is one HTTP POST that streams encoded events back (SSE). The events this stack relies on:

| Event | Meaning here |
| --- | --- |
| `RUN_STARTED` | A run for `thread_id` / `run_id` began. |
| `RUN_FINISHED` | Terminal. With `outcome: {type: "interrupt"}` it means "paused for the user", not "done" (see `emit_interrupt_outcome` below). |
| `RUN_ERROR` | Terminal. Carries `message` and `code` (`AGENT_RUNTIME_ERROR`, `INCOMPLETE_STREAM` are emitted by `agui_server.py`). |
| `STATE_SNAPSHOT` | Full graph state of the page's agent. Lead: `LeadState` (`messages`, `plan`, `work_record`, `active_subagent`, ...). Databot: `DatabotState` at the top level (`stage`, `review_cards`, `draft_sql`, ...). |
| `MESSAGES_SNAPSHOT` | Full chat transcript. |
| `TOOL_CALL_START` / `TOOL_CALL_ARGS` / `TOOL_CALL_END` / `TOOL_CALL_RESULT` | One LangGraph tool call, re-emitted by `ag_ui_langgraph.LangGraphAgent`. Rendered as tool cards in the chat. |

### Interrupts

Both agents pause for the user with LangGraph `interrupt(...)`. The payload is `{id, reason, message}` with `message` a JSON string; `LangGraphAgent` ends the run with `RUN_FINISHED` + interrupt outcome, and on the client the interrupt appears in `agent.pendingInterrupts`.

- **Lead: warehouse's SQL review.** `request_sql_approval` (`agent/specialists/warehouse/tools.py`) interrupts with `id = "warehouse-sql-gate"` and `message = {gate: "warehouse_sql", question, sql, explanation, tables, options: ["approve", "revise", "stop"], default}`. Warehouse runs nested inside the lead's `delegate` call, so the interrupt pauses the lead's run, and resuming the lead's thread resumes the review (see `agent/README.md`). `SqlReviewGate` renders it in the chat (`useInterrupt` with the lead's id) and resumes with `{decision: "approve", sql?}` (with `sql` only when the user edited it) or `{decision: "revise" | "stop", comments}`.
- **Databot: cards and SQL gates.** `gates.py` interrupts with `id` `databot-cards-gate` or `databot-sql-gate` and `message = {question, options, default, gate, ...}`. `GatePanel` parses it with `parseGateInterruptMessage()` and renders the decision buttons; `parse_resume()` on the backend accepts a bare decision string or `{decision, comments}`; an empty or unrecognized reply never continues, the gate asks again with a `note`. The payload's `default` only preselects a button. Gate meaning (approve / deny-comments / deny-halt / dryrun) is documented in the Databot README.

### Threads

A thread is one conversation. CopilotKit owns the thread id (`agent.threadId`); it is sent as `thread_id` in every AG-UI request and UI action, and it is the LangGraph checkpoint key. Conversation state lives in the SQLite checkpoint DB (`get_local_paths().checkpoint_db`, overridable with `TAHOEPILOT_CHECKPOINT_DB` or `AGUI_CHECKPOINT_DB`). The Next.js side uses `InMemoryAgentRunner`, which holds only UI thread metadata and is lost on restart. "+ New chat" (`DatabotNewChatButton`, given the page's `agentId` and reset function) calls `startNewThread()` to mint a new thread id.

### CopilotKit agent ids

`lead` and `databot` are agent ids and must match in every place they appear:

| Location | Usage |
| --- | --- |
| `agui_server.py` | `LEAD_AGENT`, `DATABOT_AGENT` in `FRONT_AGENTS`; the endpoint is `agent_path(name)` = `/agui/<name>` and the `LangGraphAgent` is named after it |
| `app/api/copilotkit/[...path]/route.ts` | keys in `CopilotRuntime({ agents: { lead: new HttpAgent(...), databot: new HttpAgent(...) } })` |
| `app/components/leadState.ts`, `app/components/databotAgent.ts` | `LEAD_AGENT_ID`, `DATABOT_AGENT_ID` |
| pages | `<CopilotChatConfigurationProvider agentId={...}>` |
| components | `useAgent({ agentId })`, `useInterrupt({ agentId })`; lead components use `LEAD_AGENT_ID`, databot components `DATABOT_AGENT_ID` |

`Providers` sets no default agent, so every hook must name its agent.

### Lead state and `active_subagent`

The lead page receives the lead's state. The latest specialist's view is one level down:

```text
{ messages, plan, work_record, ..., active_subagent: { name: "warehouse", state: { tables, sql_review, execution }, paused? } }
```

- After a delegation returns, `active_subagent` holds the specialist's final UI view (`ui_view`; for warehouse its tables, the latest SQL review and the result with up to 200 rows).
- While a specialist is paused at a review, the lead's own state does not have its live values yet. `LeadGraphView` (the graph wrapper the AG-UI adapter uses) overlays `active_subagent` on every root `aget_state` with the paused specialist's live view (`live_subagent_view` in `agent/lead/paused.py`) and sets `paused: true`.
- `leadState.ts` mirrors this: `leadStateOf()`, `warehouseViewOf()` (warehouse's view, or `undefined` when another specialist ran last), `parseDelegateResult()`, `parseSqlReviewInterrupt()`. Keep it in sync with `agent/lead/state.py`, `agent/lead/paused.py` and `WarehouseAgent.ui_view`.

### Databot state

The databot page receives `DatabotState` at the top level. Databot's gates pause inside layer subgraphs, so the root checkpoint still holds pre-layer values while a gate waits; `DatabotGraphView` overlays the paused layer's UI fields (`DatabotAgent.ui_view`, i.e. `databot_state_subset`) onto every root `aget_state`. `databotAgent.ts` provides `databotStateOf()` and `withDatabotPatch()`.

## Design philosophy

- **Single backend process.** `langgraph dev` loads `agui_server.py:app` through the `http.app` field of `langgraph.json` and mounts it beside its own LangGraph API routes. There is no separate AG-UI deployment; port 8000 serves both. `python agui_server.py` exists only as a standalone fallback (uvicorn, `AGUI_HOST` / `AGUI_PORT`).
- **Next.js is a thin proxy.** The browser only talks to Next.js (`/api/copilotkit/*`, `/api/databot/actions`). Both route handlers forward server-side to `AGUI_BACKEND_URL`, so the FastAPI app needs no CORS setup.
- **One graph per front agent, one agent clone per request.** `make_runtimes()` creates one `AguiRuntime` per name in `FRONT_AGENTS` (`app.state.runtimes`). Each builds its compiled graph once (lead wrapped in `LeadGraphView`, databot in `DatabotGraphView`) on the shared `CheckpointStore` (one long-lived `aiosqlite` connection behind `AsyncSqliteSaver`). Each request calls `runtime.agent.clone()`, because `LangGraphAgent` keeps per-run state in `self.active_run` and a shared instance breaks under concurrency.
- **Every stream ends with a terminal event.** `_stream_events()` guarantees the client sees `RUN_FINISHED` or `RUN_ERROR`, so the chat never hangs on a half-closed stream.
- **Reviews happen in the chat on the lead page.** Warehouse's SQL review is an interrupt rendered in place (`SqlReviewGate`); editing the SQL there and approving resumes the run with the edited SQL, which warehouse then must run exactly. No side-channel endpoint is involved.
- **Databot UI edits patch the checkpoint, not the conversation.** Editing card selection or SQL in databot's artifact panel does not send a chat message. `/agui/databot/actions` writes a state patch straight into the paused layer's checkpoint (`DatabotGraphBuilder.aget_active_state()`), after validating the current stage. Patching the outer checkpoint would edit values the gate never sees, so actions work only while a gate is paused on that thread.

## How it works

### Components

| Piece | File | Role |
| --- | --- | --- |
| Root layout | `app/layout.tsx` | Fonts, CopilotKit v2 styles, `databot.css` and `lead.css`, pre-hydration color-scheme script, wraps in `Providers`. |
| Providers | `app/providers.tsx` | `<CopilotKit runtimeUrl="/api/copilotkit" useSingleEndpoint={false}>`, color-scheme context and `ColorSchemeToggle`. |
| Landing page | `app/page.tsx` | Two cards linking to `/lead` and `/databot`. |
| Lead page | `app/lead/page.tsx` | Top bar (`AppNav`, theme, New chat), `CopilotChat` with `LeadMessageView` and a specialist roster on the left, `LeadWorkspace` on the right, `LeadToolRenderers`, `SqlReviewGate`. Styles in `app/lead.css` (teal accent). |
| Databot page | `app/databot/page.tsx` | Top bar (`AppNav`, theme, Debug toggle, New chat), `CopilotChat` on the left, tool renderers, gate + side panels on the right. Styles in `app/databot.css`. |
| CopilotKit route | `app/api/copilotkit/[...path]/route.ts` | `CopilotRuntime` with one `HttpAgent` per agent id (`lead` → `${AGUI_BACKEND_URL}/lead`, `databot` → `${AGUI_BACKEND_URL}/databot`), `createCopilotRuntimeHandler({ basePath: "/api/copilotkit" })`, exports `GET` and `POST`. |
| UI action route | `app/api/databot/actions/route.ts` | `POST` proxy to `${AGUI_BACKEND_URL}/databot/actions`; passes status codes through. |
| AG-UI server | `agui_server.py` | `/agui/{agent}` and `/agui/{agent}/health` for each front agent, `/agui/databot/actions`, `/health`, lifespan. |
| LangGraph entry | `langgraph.json`, `langgraph_graphs.py` | Graphs for `langgraph dev`, `.env` loading, `http.app` mount. |

Shared components in `app/components/`:

| Component | Renders / does |
| --- | --- |
| `AppNav` | Links to `/lead` and `/databot`; marks the current page. |
| `DatabotAssistantMessage` | Assistant message used by both pages: `<think>` blocks fold into a "Thinking" `FoldSection` (open while streaming), long narration next to tool calls folds into "Reasoning"; removes inspector button and toolbar. |
| `FoldSection` | Collapsible chat row: open while `active`, folds when it ends, remembers a manual toggle. |
| `ToolCallCard` / `toolRenderUtils.ts` | Tool card: open while running, folded when done, except `gate`, `answer` and `warning` variants, which stay open. |
| `ExecutionChart` | Result table and chart (Recharts); used by databot's Results tab and the lead's warehouse Results tab. |
| `DatabotNewChatButton` / `DatabotSessionContext` | New chat for the page's `agentId` with its reset function (default databot); bumps `sessionKey` to remount panels. |
| `useAgentRefresh` | Subscribes to agent events to re-render, since the AG-UI client mutates `agent` fields in place. |

Lead components in `app/components/lead/` (plus `leadState.ts`):

| Component | Renders / does |
| --- | --- |
| `LeadMessageView` | Wraps `CopilotChatMessageView` with the shared assistant message and renders the interrupt element (the SQL review) in place in the chat. |
| `LeadToolRenderers` | `useRenderTool` cards for `delegate` ("Delegated to <specialist>", status and summary from the result), `write_plan`, `request_sql_approval` ("SQL review") and `run_sql` ("Query"; refused or failed runs as warnings), plus `useDefaultRenderTool` for the rest. |
| `LeadWorkspace` | Right column, three panels: Plan (this turn's steps), Specialist (the running or latest specialist; for warehouse, tabs Results / SQL / Tables), Work record (every delegation in the thread). |
| `SqlReviewGate` | `useInterrupt` for the lead: shows warehouse's SQL, explanation and tables, lets the user edit the SQL, and resumes with approve / revise / stop. Ignores interrupts that are not `gate: "warehouse_sql"`. |
| `StatusPill` | Status chip for plan steps, work-record rows and delegate cards (`done`, `failed`, `halted` = "Stopped", `paused` = "Waiting for you", ...). |
| `leadClientReset.ts` | `resetLeadAgentView()`: clears messages, `plan`, `work_record`, `active_subagent` and pending interrupts for a new thread. |

Databot components in `app/components/` (plus `databotAgent.ts`):

| Component | Renders / does |
| --- | --- |
| `GatePanel` | `useInterrupt({ renderInChat: false })` gate dock in the right column. `HumanGate` shows title, draft SQL or selected models (live state preferred over interrupt payload), selection summary, the four decision buttons with the backend default marked, and a feedback box; `resolve()` sends `decision` or `{decision, comments}`. Also contains a `ChartGate` variant for `gate === "chart"`. |
| `GateHelpPopover` | Per-gate help text from `gateUserInstructions()` (`databotGateUtils.ts`). |
| `DatabotMessageView` | Wraps `CopilotChatMessageView`: hides reasoning messages, appends `DatabotGateChatBanner` and the interrupt element. |
| `DatabotGateChatNotice` (`DatabotGateChatBanner`) | "Action required" banner in chat while a gate is pending. |
| `DatabotToolRenderers` | `useRenderTool` cards for pipeline tools (`fetch_related_models`, `commit_cards`, `propose_sql`, `trino_explain`, `record_metric_conflict`, DataHub tools, ...) plus `useDefaultRenderTool` for the rest. |
| `DatabotSidePanels` | Right-column container; optional resizable `AgentDebugPanel` plus `DatabotArtifactPanel`. |
| `DatabotArtifactPanel` | "Working state": stage pill, halt/dryrun banners, tabs Cards (`TableCardList`), SQL (`SqlEditor`), Results (`ExecutionChart`), and a gate-decision audit trail. Tab follows `state.stage` unless the user picks one. |
| `TableCardList` / `SqlEditor` | Interactive only in the matching stage (`prepare_cards` with review cards / `prepare_sql`); edits go through `useDatabotActions`. |
| `AgentDebugPanel` | Read-only: thread id, message count, tools in state, pending interrupts, running flag, event tick counter. |
| `useDatabotActions` | Client for UI actions; merges returned `state` with `withDatabotPatch()` and `agent.setState()`. |
| `databotClientReset.ts` | `resetDatabotAgentView()`: clears messages and resets the databot fields (`EMPTY_DATABOT_STATE`). |
| `types.ts` | TypeScript mirror of `DatabotState` (`agent/specialists/databot/state.py`). |

### Chat turn

```text
Browser (CopilotChat)        Next.js /api/copilotkit/*        FastAPI /agui/<agent> (in langgraph dev)   LangGraph graph
        |  user message              |                                 |                                  |
        |--------------------------->|  CopilotRuntime -> HttpAgent    |                                  |
        |                            |-- POST /agui/<agent> ---------->|  ensure_built(); agent.clone()   |
        |                            |   RunAgentInput (thread_id,     |-- agent.run(input) ------------->|
        |                            |   run_id, messages)             |                                  |-- nodes / tools (lead:
        |                            |<===== SSE: RUN_STARTED ========|<---------------------------------|   delegate runs a
        |                            |                                 |                                  |   specialist nested),
        |<===== events forwarded ====|  TOOL_CALL_*, STATE_SNAPSHOT,  |                                  |   checkpoint to SQLite
        |  tool cards, panels update |  MESSAGES_SNAPSHOT, ...        |                                  |
        |<===========================|<===== RUN_FINISHED ===========|  (or RUN_ERROR / INCOMPLETE_STREAM)
```

### SQL review (lead page)

```text
LangGraph (warehouse, inside       /agui/lead stream            Browser
 the lead's delegate)
   request_sql_approval: interrupt({id, reason, message})
        |------------------------->| RUN_FINISHED outcome=interrupt
        |                          |---------------------------->| agent.pendingInterrupts = [...]
        |                          |                             | SqlReviewGate renders the review in the chat
        |                          |                             | user approves (maybe after editing), revises or stops
        |                          |<----- new run with resume --| resolve({decision, sql?, comments?})
        |<-- Command(resume=...) --|                             |   (on the lead's thread)
   delegate re-enters warehouse at the tool; approve records the SQL fingerprint;
   run_sql runs it; warehouse answers, delegate returns its result, the lead answers
```

### Gate decision (databot page)

```text
LangGraph (databot layer)     /agui/databot stream          Browser
   gates.py interrupt({id, reason, message})
        |------------------------->| RUN_FINISHED outcome=interrupt
        |                          |---------------------------->| agent.pendingInterrupts = [...]
        |                          |                             | GatePanel (useInterrupt) renders HumanGate
        |                          |                             | DatabotGateChatBanner in chat
        |                          |                             | user clicks "Approve" (+ optional feedback)
        |                          |<----- new run with resume --| resolve("approve" | {decision, comments})
        |<-- Command(resume=...) --|                             |
   parse_resume() -> (decision, comments); the pipeline continues at the gate
```

`useDatabotActions().regenerateSql()` uses the same mechanism, and only works while the SQL gate is open: it builds a resume array with `buildResumeArray()` resolving each pending interrupt as `{decision: "deny-comments", comments}` and calls `agent.runAgent({ resume })`. Without a pending gate it sets an error instead.

### UI action (databot page)

```text
Browser (TableCardList / SqlEditor)   Next.js /api/databot/actions     FastAPI /agui/databot/actions         LangGraph checkpoint
   useDatabotActions.runPatch()
        |-- POST {thread_id, action, ...} -->|-- POST ${AGUI_BACKEND_URL}/databot/actions -->|
        |                                    |                                       | validate action name (else 400)
        |                                    |                                       | aget_active_state() --> paused layer snapshot
        |                                    |                                       |   none --> 409
        |                                    |                                       | build_ui_action_patch() (stage check, else 409)
        |                                    |                                       | graph.aupdate_state(snapshot.config, patch)
        |                                    |                                       | aget_active_state() again, merge
        |<-- {ok, action, state} ------------|<--------------------------------------|
   agent.setState(withDatabotPatch(agent.state, state))   (no run is started)
```

Supported actions (request body model `DatabotUiActionBody`):

| `action` | Extra fields | Allowed stage | Frontend caller |
| --- | --- | --- | --- |
| `update_card_selection` | `selected_card_names` | `prepare_cards` | `updateCardSelection()` |
| `propose_sql` | `sql`, `validated` | `prepare_sql` | `saveSqlDraft()` |
| `request_sql_regenerate` | `feedback` | `prepare_sql` | Not called by the current UI: `regenerateSql()` resumes the pending SQL gate with `deny-comments` and reports an error when no gate is waiting |

With no databot run on the thread the endpoint returns 409 `no databot run on this thread`; a run that is not in the action's stage gets 409 from the stage check. What each patch writes is defined in `agent/specialists/databot/ui_actions.py` and explained in the Databot README.

### Backend details

- **`AguiRuntime`.** `make_runtimes()` creates one per front agent at import (`app.state.runtimes`, keyed by name), each with `_make_agent(name)` and its builder from `GRAPH_BUILDERS`. The agent starts with a `_DummyCompiledGraph` placeholder because `langgraph dev` imports the module before an event loop exists. `ensure_built()` builds the real graph once under an `asyncio.Lock` (via `AgentCatalog`, with the shared `CHECKPOINTS` saver and `max_tool_calls=30`) and swaps it into the agent. An unknown agent name returns 404.
- **Lifespan.** `_lifespan` runs `ensure_local_dirs()`, builds every graph eagerly so a broken setup fails startup, and closes the runtimes and the checkpoint connection on shutdown. `langgraph dev` only accepts a single `lifespan=` (no `on_startup` handlers). The endpoints also call `ensure_built()`, so a request never runs against the placeholder.
- **`LeadGraphView`.** Wraps the compiled lead graph for the adapter: `aget_state` on the root namespace overlays `active_subagent` with the live view of a specialist paused at a review (best effort; errors are logged and the plain snapshot is returned). Everything else is forwarded to the compiled graph. The lead's turn-start node adds the persona and specialist roster on the first web turn, because AG-UI sends only chat messages.
- **`DatabotGraphView`.** Same idea for databot: on the root namespace (and without `subgraphs`), `aget_state` merges the paused layer's `ui_view` fields over the root snapshot's values.
- **`subagent_visibility`** (`AGUI_SUBAGENT_VISIBILITY`, default `inline`) controls how a delegated specialist's own stream reaches the lead page. `inline` streams its text and tool calls as the lead's work, so warehouse's tool cards render live; the end-of-run messages snapshot keeps only the lead's messages, so the specialist's work then stays visible through the workspace. `hidden` shows only the `delegate` call and its result. `attributed` adds `SUBAGENT_*` events, which `@ag-ui/client` 0.0.57 rejects.
- **`emit_raw_events`** (`AGUI_EMIT_RAW_EVENTS`, default off) attaches the adapter's raw LangGraph events to every AG-UI event; it multiplies the stream size and nothing in the frontend reads it.
- **`emit_interrupt_outcome=True`** attaches the interrupt outcome to `RUN_FINISHED` so CopilotKit v2 treats a paused run as pending, not finished. `enable_legacy_on_interrupt_event=False` drops the v1 `on_interrupt` custom event, which froze the chat panel.
- **Why `ag_ui_langgraph.LangGraphAgent`, not `copilotkit.LangGraphAGUIAgent`.** In the pinned versions the latter's `__init__` breaks `agent.clone()`.
- **Why a hand-rolled endpoint.** `ag_ui_langgraph.add_langgraph_fastapi_endpoint` has no hook for the deferred graph build and its signature changes between versions. `agui_endpoint` (`POST /agui/{agent_name}`) mirrors its body: build, clone, `EventEncoder(accept=...)`, `StreamingResponse`.
- **Terminal-event guarantee (`_stream_events`).** Client disconnect (`CancelledError`) is logged and re-raised with no further output. Any other exception, including `BaseException` from the agent's background tasks, becomes `RUN_ERROR` with code `AGENT_RUNTIME_ERROR`. A stream that ends without a terminal event gets `RUN_ERROR` with code `INCOMPLETE_STREAM`.
- **`langgraph.json` graphs.** `databot`, `knowledge`, `lead` and `warehouse` point at `langgraph_graphs.py` factories, which build the agent through `AgentCatalog` with a `MemorySaver`. They are served by `langgraph dev`'s own API and Studio. The AG-UI endpoints do not use them: they build their own graphs with the SQLite checkpointer. `"env": ".env"` makes `langgraph dev` load the repo `.env`.

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
| `AGUI_BACKEND_URL` | both Next.js route handlers (server-side) | `http://localhost:8000/agui` | AG-UI base URL: runs go to `<base>/lead` and `<base>/databot`, UI actions to `<base>/databot/actions`. |
| `AGUI_AGENT_PATH` | `agui_server.py` | `/agui` | Base path; each front agent is mounted at `<base>/<name>`. Change `AGUI_BACKEND_URL` to match. |
| `AGUI_HOST`, `AGUI_PORT` | `agui_server.py` `main()` only | `127.0.0.1`, `8000` | Bind address for standalone `python agui_server.py`. |
| `TAHOEPILOT_CHECKPOINT_DB`, `AGUI_CHECKPOINT_DB` | `config/local_config.py` | `<data dir>/checkpoints.sqlite` | Checkpoint DB path. |
| `AGUI_SUBAGENT_VISIBILITY` | `agui_server.py` | `inline` | How a delegated specialist's stream reaches the client (`inline`, `hidden`, `attributed`); see Backend details. |
| `AGUI_EMIT_RAW_EVENTS` | `agui_server.py` | off | `1` / `true` / `yes` attaches raw LangGraph events to the stream (debugging only). |

The frontend uses no `NEXT_PUBLIC_*` variables; the browser only calls same-origin `/api/*` routes.

### Run

```bash
# two terminals
./scripts/dev.sh backend    # langgraph dev --no-browser --port 8000 --allow-blocking (also serves /agui/lead, /agui/databot)
./scripts/dev.sh frontend   # npm run dev in frontend/ on :3000

# or one terminal, background
./scripts/dev.sh start      # each in its own process group; PIDs in .run/langgraph.pid, .run/next.pid
./scripts/dev.sh status     # probes :8000, :3000 and POST /agui/lead, /agui/databot
./scripts/dev.sh stop       # stops only the recorded PIDs (+ their process group / children), removes the pid files
```

Open http://localhost:3000 and pick a page (or go straight to http://localhost:3000/lead or /databot). Background logs go to `.run/langgraph.log` and `.run/next.log`.

### Health checks

| Check | Expected |
| --- | --- |
| `curl http://localhost:8000/health` | `{"status": "ok", "agents": {"lead": "/agui/lead", "databot": "/agui/databot"}, "checkpoint_db": "..."}` |
| `curl http://localhost:8000/agui/lead/health` (or `/agui/databot/health`) | `{"status": "ok", "agent": {"name": "lead"}}`; an unknown name returns 404 |
| `curl -X POST -H 'content-type: application/json' -d '{}' http://localhost:8000/agui/lead` | 422 (missing `RunAgentInput` fields), confirming the route is mounted |
| `./scripts/dev.sh status` | Probes :8000, :3000 and `POST /agui/lead` / `POST /agui/databot`; each reports `ALIVE (HTTP 422)` when mounted (an empty body is rejected). |
| Debug toggle on the databot page | `AgentDebugPanel` shows thread id, tool count and pending interrupts. |

Backend tests for this layer: `.venv/bin/python -m pytest tests/test_agui_server.py tests/test_databot_ui_actions.py`.

### Troubleshooting

| Symptom | Likely cause / where to look |
| --- | --- |
| `langgraph dev` fails at startup with a graph/build error | `_lifespan` builds the graph eagerly; check `.run/langgraph.log` for catalog, model or checkpoint errors (missing API key, unwritable data dir). |
| `/agui/lead` or `/agui/databot` returns 404 | `http.app` in `langgraph.json` not loaded, `AGUI_AGENT_PATH` differs from `AGUI_BACKEND_URL`, or the agent name is not in `FRONT_AGENTS`. |
| Chat shows `INCOMPLETE_STREAM` | The agent stream ended without `RUN_FINISHED` / `RUN_ERROR`; look for the run in the backend log. |
| Chat shows `AGENT_RUNTIME_ERROR: <ExceptionType>: ...` | Exception inside the run (often an LLM provider error); full traceback is logged as `agui_endpoint: unhandled exception`. |
| Next.js returns 500 / fetch failed on `/api/copilotkit` or `/api/databot/actions` | Backend not running or `AGUI_BACKEND_URL` wrong. |
| CORS errors in the browser | Something calls `:8000` directly. The FastAPI app has no CORS middleware; go through the Next.js routes. |
| Artifact panel shows `agent not ready` / `no active thread` | `useDatabotActions` was called before CopilotKit synced the agent or before a thread exists; send a message first. |
| UI action returns 409 `no databot run on this thread` | The thread has no databot checkpoint (wrong thread id, or a lead-page thread). |
| UI action returns 409 `action ... is not allowed in stage ...` | Stage check in `build_ui_action_patch()`; the run is not in the stage the action needs (for example the gate already resolved). Also returned for empty `sql` / `feedback`. |
| UI action returns 400 `unknown action` or 422 | Action name not in the endpoint's allow-list, or body fails `DatabotUiActionBody` validation (e.g. empty `thread_id`). |
| Gate panel or SQL review never appears though the run stopped | Interrupt `message` is not valid gate JSON (`parseGateInterruptMessage` / `parseSqlReviewInterrupt` returns `null`), the hook uses the other page's agent id, or `emit_interrupt_outcome` was turned off. |
| A state key is missing in the UI | AG-UI drops keys not in the graph's output schema; enable debug logging for `agui_server` to see `_log_schema_keys` output. |
| Tool calls land in "View in Inspector" instead of the chat | The runtime is not pointed at `/agui/<agent>` through `HttpAgent`; see the comments in `route.ts` and `agui_server.py`. |

## Extension notes

### Exposing another agent to the UI

The lead already reaches every specialist through delegation. A specialist only needs UI wiring if the lead page should render its state: give it a `ui_view` (and `aget_active_snapshot` if it pauses inside subgraphs) so its fields arrive under `active_subagent`, read them with a helper like `warehouseViewOf()`, and add a branch to `LeadWorkspace`'s Specialist panel. If it interrupts, render its payload with a `useInterrupt` for `LEAD_AGENT_ID` that ignores other gates, as `SqlReviewGate` does.

To give an agent its own page and endpoint instead (a new front agent):

1. Set `front = true` in its TOML so the lead does not delegate to it.
2. In `agui_server.py`, add its name to `FRONT_AGENTS` and `AGENT_DESCRIPTIONS`, and a builder to `GRAPH_BUILDERS` (wrap the graph in a view like `DatabotGraphView` if its interrupts pause inside subgraphs). `make_runtimes()` and `POST /agui/{agent_name}` pick it up.
3. In `app/api/copilotkit/[...path]/route.ts`, add an `HttpAgent` keyed by the agent id pointing at `${AGUI_BACKEND_URL}/<name>`.
4. Add a page under `app/<name>/page.tsx` with `CopilotChatConfigurationProvider agentId=...`, pass the id to every `useAgent` / `useInterrupt`, and add the page to `AppNav` and the landing page.
5. Add `useRenderTool` renderers for its tools, or rely on `useDefaultRenderTool`.
6. If the agent should also be visible in Studio, add a factory to `langgraph_graphs.py` and an entry under `graphs` in `langgraph.json`.

### Adding a UI action end to end

1. **Patch logic** — `agent/specialists/databot/ui_actions.py`: add the name to `DatabotUiAction`, its allowed stages to `ACTION_ALLOWED_STAGES`, an `apply_*` function, and a branch in `build_ui_action_patch()`. If it writes a new state key, add it to `DATABOT_STATE_KEYS` so `databot_state_subset()` returns it.
2. **Endpoint** — `agui_server.py`: add the name to the allow-list in `databot_ui_action()` and any new field to `DatabotUiActionBody`. Keep reading and writing the paused layer through `DatabotGraphBuilder.aget_active_state()`.
3. **Proxy** — no change; `app/api/databot/actions/route.ts` forwards the body as-is.
4. **Client** — `useDatabotActions.ts`: extend the `UiAction` union and add a callback that calls `runPatch()`. If the action should make the agent continue, start a run afterwards (as `regenerateSql()` does) or resume the pending interrupt.
5. **UI** — wire the callback in `DatabotArtifactPanel` (or a child), gated on the same stage as `ACTION_ALLOWED_STAGES` so the button is not offered when the backend would answer 409.
6. **Types and tests** — update `types.ts` if state shape changed; add cases to `tests/test_databot_ui_actions.py` and `tests/test_agui_server.py`.

## Pitfalls

- **This Next.js is not the one you know.** `frontend/AGENTS.md` (pulled in by `frontend/CLAUDE.md`) warns that Next.js 16.3 has breaking changes in APIs, conventions and file layout compared with older versions. Read the bundled guides in `node_modules/next/dist/docs/` before writing Next.js code and follow deprecation notices. `next dev` rewrites that block in `AGENTS.md`; do not hand-edit it.
- **CopilotKit v2 imports.** Use `@copilotkit/react-core/v2` and `@copilotkit/runtime/v2`. v1 hooks such as `useCopilotAction` are not used here, and the legacy `on_interrupt` event is disabled on the backend.
- **Agent id drift.** Renaming `lead` or `databot` in one place silently disconnects hooks from the runtime agent. Update every location in the agent-id table.
- **Hooks must name their agent.** `Providers` sets no default agent and both agents live in one runtime; a `useAgent` / `useInterrupt` without the page's `agentId` reads the wrong agent.
- **Reading the wrong checkpoint.** While databot waits at a gate, its outer checkpoint holds pre-layer values; read and patch through `DatabotGraphBuilder.aget_active_state()`. While warehouse waits inside the lead, the lead's `graph.aget_state(config)` holds only the lead's values, and a namespaced `aget_state` for the specialist fails because a graph invoked from a tool is not a declared subgraph; go through `agent/lead/paused.py`.
- **Specialist state is nested on the lead page.** Read warehouse's view with `warehouseViewOf(agent.state)`, not `agent.state` directly. Databot's state is at the top level of its own agent.
- **Shared agent instance.** Never call `runtime.agent.run()` directly from a handler; clone per request.
- **Agent fields mutate in place.** React does not re-render on `agent.state` mutation; subscribe via `useAgentRefresh` (or `agent.subscribe`) in components that read it outside CopilotKit hooks.
- **Two sets of graphs.** Threads created in LangGraph Studio (`langgraph.json` graphs, `MemorySaver`) are not visible to the UI (`/agui/<agent>`, SQLite checkpointer), and vice versa. Lead-page and databot-page threads are separate too.
- **`InMemoryAgentRunner`.** Restarting Next.js loses its thread metadata; the checkpoint still exists under the same `thread_id`.
- **Run `langgraph dev` with `--allow-blocking`.** `langgraph dev` enables a blocking-I/O detector (blockbuster) when its run queue starts, concurrently with the AG-UI lifespan that builds the agent. Agent construction and turns do synchronous file and SQLite work (offload store, profiles, config), so without the flag startup fails at random with `BlockingError: Blocking call to os.mkdir`; the reloader stays up, the AG-UI endpoints do not, and the browser shows `fetch failed` / `INCOMPLETE_STREAM`. `dev.sh` passes the flag; add it yourself if you launch `langgraph dev` by hand.
- **`./scripts/dev.sh stop`** only stops what `start` recorded in `.run/*.pid` (that PID, its process group, and its descendants). Servers started in the foreground with `backend` / `frontend`, or from another checkout, are not touched; stop them with Ctrl-C. If a pid file is lost, find the process with `lsof -i :8000` / `lsof -i :3000`.
