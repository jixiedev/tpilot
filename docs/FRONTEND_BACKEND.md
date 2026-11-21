# Frontend ↔ backend interaction

How a chat turn travels from the browser to the agent graph and back, which
component holds which state, and which of it can be trusted. For what happens
inside the graph when a run pauses, see
[INTERRUPTS_AND_CHECKPOINTS.md](INTERRUPTS_AND_CHECKPOINTS.md).

## Components

```
Browser (CopilotKit React, useAgent)
   │  POST /api/copilotkit/...        (RunAgentInput JSON)      ▲ SSE (AG-UI events)
   ▼                                                            │
Next.js route  frontend/app/api/copilotkit/[...path]/route.ts
   CopilotRuntime + HttpAgent per front agent + InMemoryAgentRunner
   │  POST {AGUI_BACKEND_URL}/lead  or  /databot                ▲ SSE
   ▼                                                            │
FastAPI  tahoepilot/server/app.py  agui_endpoint()
   clone of ag_ui_langgraph.LangGraphAgent  (the "adapter")
   │  graph.astream_events(input, config)                       ▲ LangGraph events
   ▼                                                            │
LangGraph graph (LeadGraphView → lead's compiled graph; DatabotGraphView → databot)
   │  read / write every super-step
   ▼
AsyncSqliteSaver  ([paths].checkpoint_db in runtime.toml)
```

| Component | Holds | Authoritative? | Lifetime |
|---|---|---|---|
| Browser: CopilotKit client agent (`useAgent({agentId: "lead"})`) | `threadId`, a message list, `state` (copy of the agent state), `pendingInterrupts` | No, a copy | Browser tab |
| Next.js: `CopilotRuntime`, `InMemoryAgentRunner` | UI thread metadata only | No | Next.js process |
| FastAPI: `tahoepilot/server/app.py` | The built graph per front agent (`app.state.runtimes`); one shared checkpointer (`CHECKPOINTS`) | No per-thread state | Process |
| Adapter: `LangGraphAgent` clone | Per-run scratch (`active_run`: run id, mode, schema keys, interrupts) | No | One request |
| Checkpointer: `AsyncSqliteSaver` | Full state of every thread, a checkpoint per super-step, nested specialist checkpoints | **Yes** | Disk (EBS in k8s) |

`LeadAgent` holds no per-thread state. It is the code that runs inside the
graph (`turn_start`, the ReAct loop, `delegate`, `turn_finish`).

Two front agents are served, each with its own page, endpoint and threads:

| Page | CopilotKit agent id | Backend endpoint | Graph |
|---|---|---|---|
| `/lead` | `lead` | `POST /agui/lead` | `LeadGraphView(lead)` |
| `/databot` | `databot` | `POST /agui/databot` | `DatabotGraphView(databot)` |

Both use the same SQLite checkpointer. Paths and ports come from
`config/server.toml` (`[agui]`, `[frontend]`).

## The request: `RunAgentInput`

The browser builds the run input; the Next.js `HttpAgent` forwards it unchanged
(it adds no headers from the incoming request).

```json
{
  "threadId": "8f3c…",
  "runId": "r-42",
  "messages": [ {"id": "m1", "role": "user", …}, …, {"id": "m9", "role": "user", "content": "new question"} ],
  "state": { "plan": […], "work_record": […], "active_subagent": {…}, … },
  "tools": [], "context": [], "forwardedProps": {},
  "resume": [ {"interruptId": "…", "value": …} ]
}
```

- `threadId` is owned by CopilotKit (`agent.threadId`; a new chat calls
  `startNewThread()`). It becomes LangGraph's `configurable.thread_id`.
- `messages` is the browser's whole list, not only the new message.
- `state` is the browser's copy: the last `STATE_SNAPSHOT` it received plus any
  `agent.setState()` edits.
- `resume` is present only when answering a paused gate.

FastAPI validates the body into `ag_ui.core.RunAgentInput` (camelCase aliases),
clones the adapter (it keeps per-run state, so a shared instance would break
under concurrency), binds the run's user (next section), and streams
`agent.run(input)`.

## The run's user

`agui_endpoint` resolves one `user_id` per request with the same resolver as
the CLI (`tahoepilot.memory.profile_store.resolve_user_id`).

**Login on** (`[auth].enabled = true` in `server.toml`): the username in the
session token, nothing else. A missing, forged or expired token is HTTP 401
(also on `/agui/databot/actions`); the user header is ignored.

**Login off**:

1. the `[agui].user_header` request header (default `X-Tahoepilot-User`);
2. else the `user_id` in the thread's checkpoint;
3. else `[user].default_id` in `runtime.toml`, else the OS user.

The client's own `state.user_id` is never used. `bind_run_user` then writes
the id into `input_data.state["user_id"]` (overwriting the client's value; used
by the profile, the persona and `delegate`) and into the cloned adapter's
`config` as `configurable.user_id` (used by tools via `run_user_id()`,
inherited by nested specialists, and present on resumes, where client state is
ignored).

### Login page

```
/login (username + password)
  → POST /api/auth/login            (Next.js)
  → POST {AGUI_PATH}/auth/login     (tahoepilot/server/app.py → tahoepilot.server.auth.login)
      LDAP: service account finds the user's DN (user_search_filter), then bind as it
                                     (or user_dn_template); password not stored
      ← token = base64(json{u, exp}) . HMAC-SHA256(TAHOEPILOT_SESSION_SECRET)
  ← Set-Cookie: tp_session=<token>; HttpOnly; SameSite=Lax; Secure on HTTPS; Max-Age = session_hours
later requests:
  browser → Next.js (cookie) → Authorization: Bearer <token> → agui_server verifies → user_id
```

| Piece | File | Job |
|---|---|---|
| Login page | `frontend/app/login/page.tsx` | Form; on success a full load of `?next=` (same-site paths only) |
| Redirect | `frontend/proxy.ts` | Login on and no `tp_session` cookie: pages → `/login?next=…`, `/api/*` → 401. Checks presence only |
| Auth routes | `frontend/app/api/auth/{login,logout,me}/route.ts` | Call the backend, set or clear the httpOnly cookie, report the user |
| Token forwarding | `frontend/app/lib/auth.ts`, the copilotkit and databot actions routes | Cookie → `Authorization: Bearer`. CopilotKit agents are built per request for this; headers set there win over forwarded ones |
| LDAP + token | `tahoepilot/server/auth.py` | Search-then-bind (service account `bind_user` looks up the DN, as Trino's LDAP config does) or a DN template; token issue/verify. Empty passwords and usernames outside `[A-Za-z0-9._@-]` never reach LDAP |
| Endpoints | `tahoepilot/server/app.py` | `POST /agui/auth/login`, `GET /agui/auth/me`; 401 on AG-UI runs and databot actions without a valid token |
| Signed-in user | `frontend/app/components/AppNav.tsx` | "alice · Sign out"; a 401 from `/api/auth/me` sends the visitor back to `/login` |

The login page renders without CopilotKit (`providers.tsx`), so it makes no
agent calls before sign-in. Next.js learns whether login is on from
`TAHOEPILOT_AUTH_ENABLED`, exported from `[auth].enabled` by
`python -m tahoepilot.settings.server_config` (`docker/entrypoint.sh`, `scripts/dev.sh`).

`[auth].skip_password_check = true` (development only, for machines that cannot
reach the directory) skips LDAP and accepts any password; the username is still
validated and kept, and the backend logs a warning at startup and on each
login. Anyone can then sign in as anyone, so it must be false in deployments.

Signing out only drops the cookie; a token stays valid until it expires.
Rotating `TAHOEPILOT_SESSION_SECRET` invalidates every token.

### Auth proxy instead of the login page

With login off, the header is not added by the frontend: CopilotKit's runtime
copies `authorization` and `x-*` headers of the browser request onto each
agent call, so whatever the ingress sets reaches the backend. The ingress (auth
proxy) must set it and drop any copy sent by the browser.

## Inside the adapter: input → graph input

`LangGraphAgent.run` → `prepare_stream`:

1. **Load the checkpoint.** `graph.aget_state({"configurable": {"thread_id": threadId}})`.
   For the lead, `LeadGraphView.aget_state` also overlays a paused specialist's
   live view on `active_subagent` (see below).
2. **Choose the mode.**

   | Condition | What runs |
   |---|---|
   | `resume` entries present | `Command(resume=…)` only; client `state` and `messages` are not merged |
   | Thread is paused at an interrupt and no `resume` | Nothing; the pending interrupt is re-emitted and the run ends |
   | A known user message comes back with different text | Regenerate: fork the thread from the checkpoint before that message |
   | Otherwise | New turn ("start") |

3. **Merge messages.** The checkpoint's messages are the base; only incoming
   messages whose `id` is not in the checkpoint are kept (normally just the new
   user message). `tahoepilot/server/history.py` repairs malformed tool-call arguments in the
   resent history before the adapter parses them.
4. **Merge state.** `state_input = input.state`, with `messages` replaced by the
   delta from step 3, plus the adapter's own `tools`, `ag-ui` and `copilotkit`
   keys. Keys are then filtered to the graph's input schema (`LeadState`
   declares none, so every state key passes).
5. **Run.** `graph.astream_events(input, config, version="v2")`. The adapter's
   `config` (`recursion_limit`, plus `thread_id`) is applied to every run; its
   `configurable` is also passed as LangGraph `context`.

The checkpointer then applies the input through the state reducers:
`messages` appends, every other key **replaces** the stored value.

## Inside the graph

- **`turn_start`** resets per-turn fields (`user_question`, `turn_index`, `plan`,
  `turn_delegations`, loop counters) and, via `framed_messages`, inserts the
  persona system message (from the user's profile) and the turn boundary when
  they are missing.
- **ReAct loop** (`step_reason` ↔ `step_action`): a checkpoint is written after
  every super-step.
- **`delegate`** runs a specialist nested in the lead's `step_action`. Its input
  comes from `subagent_input()` (brief, persona, `user_id`, `session_name =
  "<session>:agent:<name>"`). Its checkpoints live in the lead's thread under
  `step_action:<task id>`. Only a `SubagentResult` returns: a summary into
  `work_record` and `ui_state` into `active_subagent`.
- **`turn_finish`** marks unfinished plan steps skipped; the final checkpoint is
  written.

## The response: AG-UI events over SSE

| Event | Carries | Browser effect |
|---|---|---|
| `RUN_STARTED` | thread and run id | run starts |
| `TEXT_MESSAGE_START / CONTENT / END` | streamed assistant tokens | live text |
| `TOOL_CALL_START / ARGS / END / RESULT` | tool calls (`delegate`; specialist tools when `subagent_visibility = "inline"`) | tool cards |
| `STEP_STARTED / FINISHED` | node changes | progress |
| `STATE_SNAPSHOT` | graph state, **filtered to the output schema** | replaces the client's `state` |
| `MESSAGES_SNAPSHOT` | checkpoint messages | replaces the client's messages |
| `RUN_FINISHED` | end of run; `outcome: {type: "interrupt", …}` when paused | spinner stops or gate renders |
| `RUN_ERROR` | error | error shown |

`_stream_events` encodes each event for SSE and appends a `RUN_ERROR` if the
stream ends without a terminal event. Next.js relays the stream unchanged.
After the run the browser's `state` and `messages` mirror the latest
checkpoint; that copy is what it sends on the next turn. A state key missing
from the output schema never reaches the browser (`_log_schema_keys` logs the
schema keys per thread to help spot this).

Adapter options set in `_make_agent`: `emit_interrupt_outcome=True` (a paused
run finishes with an interrupt outcome, not as done) and
`enable_legacy_on_interrupt_event=False` (the v1 custom event froze the chat
panel).

## Answering a gate

The gate UI is rendered from the interrupt payload and replies with a resume:

| Page | Gate | Frontend | Reply payload | Parsed by |
|---|---|---|---|---|
| `/lead` | warehouse SQL review | `SqlReviewGate.tsx` (`useInterrupt`, `resolve(payload)`) | `{decision: "approve" \| "revise" \| "stop", sql?, comments?}` | `parse_gate_resume` (warehouse/tools.py) |
| `/databot` | cards gate, SQL gate | `GatePanel.tsx`, `useDatabotActions.ts` (`buildResumeArray` → `agent.runAgent({resume})`) | `{decision, comments}` | `parse_resume` (databot/gates.py) |

The resume run goes through the same path as a turn; the adapter turns it into
`Command(resume=…)` and the graph continues at the paused `interrupt(...)`.

## Databot panel actions (no graph run)

`POST /agui/databot/actions` with `{thread_id, action, selected_card_names | sql, validated, feedback}`:

- Works on **databot threads** (the `/databot` page). It finds the paused layer
  with `DatabotGraphBuilder.aget_active_state` and patches that layer's
  checkpoint with `aupdate_state`.
- Returns the merged state; the client applies it with `agent.setState()`.
- The next resume reads the patched checkpoint.

A specialist paused inside a **lead** run can be shown (`LeadGraphView`) but not
patched from the UI yet: `tahoepilot/agent/lead/paused.py` has `patch_paused_state`, but no
endpoint calls it.

## The CLI path, for comparison

No CopilotKit, Next.js or FastAPI. `tahoepilot/cli.py` opens an `AsyncSqliteSaver` on the
same database and calls `agent.run(prompt, session, user_id, on_interrupt)`:

1. `accept_user_request` resolves `user_id` (`-u`, else `[user].default_id`,
   else the OS user), loads the profile and builds the full turn input
   (persona, boundary, user message, `session_name`, `user_id`).
2. `AgentTurnResult.ainvoke` runs the graph with
   `session_graph_config(session, user_id)` (`thread_id` plus
   `configurable.user_id`, as on the web) and loops on interrupts by asking
   `on_interrupt` (a terminal prompt).
3. `commit_turn` runs `commit_turn_state` (profile refinement, domain records)
   and writes it back with `aupdate_state`.

`turn_start` finds the framing already present and adds nothing. Step 3 does
not run on the web path, which does not call `agent.run`.

## Trust boundaries

| Data | Comes from | Can the browser change it? |
|---|---|---|
| Message history | Checkpoint | No. New messages are appended; an edited user message forks the thread |
| `user_id` | `agui_endpoint`: login token, or (login off) header, else checkpoint, else default; into state and config | Login on: no (needs LDAP credentials). Login off: through the user header |
| Other state keys (`plan`, `active_subagent`, …) | `RunAgentInput.state` on every new turn | **Yes**, any input-schema key |
| Gate answers | `resume` | Yes, by design; validated by `parse_resume` / `parse_gate_resume` |
| Databot gate state | Actions endpoint | Yes, by design (card selection, SQL draft) |
| Run config (`thread_id`, `recursion_limit`, `user_id`) | Adapter (`tahoepilot/server/app.py`) | Only `threadId` (and the user header) |

Consequences:

- With login on, the id is the LDAP-verified username in a token only the
  backend can sign. With login off, the user header is only as trustworthy as
  whatever sets it: put an auth proxy at the ingress that sets
  `X-Tahoepilot-User` and strips the browser's copy, or any visitor can claim
  any id.
- Serve the site over HTTPS when login is on: the password crosses the
  browser → Next.js hop, and the cookie is marked `Secure` only on HTTPS
  (`X-Forwarded-Proto` from the ingress counts).
- The backend Service should be reachable only from the Next.js server, not
  through the public ingress, or the header can be sent to it directly.
- A thread is not bound to a user: a visitor who knows another thread's id can
  open it (the run then uses the visitor's own id).
