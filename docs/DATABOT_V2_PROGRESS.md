# Databot v2 — progress snapshot

A running scratchpad for the Databot v2 rebuild and CopilotKit v2 UI.
Kept separate from `CHAT_OPTIMIZATION.md` because the per-round diffs
there are too small to show the moving parts. This file captures the
*current shape* of the system so we can pick the work up without
re-reading every commit.

Last touched: 2026-08-29.

---

## What's done

### Backend — `agent/react/databot/`

- New staged state machine (`graph.py::build_databot_graph`) wrapping two
  per-stage ReAct subgraphs and three human interrupt gates:
  `fetch_cards` → `gate_cards` → `write_cards_artifact` →
  `generate_sql` → `gate_sql` → `write_sql_artifact` → `execute_sql` →
  `chart_question` → end.
- Subgraphs (`subgraphs.py`) reuse the standard `CompletionToolRouter`
  from `agent.router` so the LLM exits each stage by calling
  `chat_completion`; idle rounds / tool budget terminate the subgraph
  instead of looping `step_llm`.
- `state.py` — `DatabotState` TypedDict: stage, candidate / selected /
  approved cards, draft / approved SQL, gate audit, deny feedback, dryrun
  flag, halt reason, cards / sql reasons, metric conflicts, chart
  requested.
- `gates.py` — interrupt nodes. `interrupt({id, reason, message: json.dumps(...)})`
  for AG-UI v2; legacy CLI still works because the rich dict body is in
  `message`. `_parse_resume` accepts bare tokens, JSON objects, and
  freeform text (defaults to `dryrun`).
- `stage_tools.py` — six stage tools:
  - `mark_cards_selected` / `record_metric_conflict` /
    `write_gate_reasons` / `propose_sql` — write state with a sibling
    `ToolMessage` (using `ToolRuntime.tool_call_id`).
  - `update_card_selection` / `request_sql_regenerate` — wire the
    frontend's interactive controls.
  - `write_gate_reasons` accepts `dict | list[str]` and strips
    `"approve: "` prefixes (LLM-friendly).
- `execute.py` — pure node; reads `approved_sql`, runs
  `trino_run_query` once, advances to the `chart` stage even on
  failure.
- `profile_persistence.py` — JSONL sidecar under `agent/profiles/`;
  writes only on `approve` (skipped on `dryrun` / `halt`). Not yet
  folded into `UserProfile`.
- `databot_agent.py` — composes an inner `TahoeAgent` for session
  / turn plumbing; builds the v2 graph itself. Public
  `create` / `run` / `bind` API unchanged.

### Backend — bug fixes (chronological)

1. `_build_stage_tool_lists` used `_filter_tool` which raised
   `KeyError("'search'")` because the dev machine's `mcp.json` has no
   datahub MCP server; replaced with `_find_tool` +
   `_find_tools_by_predicate` that accept both legacy MCP names
   (`search` / `get_entities`) and the native datahub helpers
   (`datahub_list_glossary_terms` / `datahub_graphql_query`).
2. Subgraph `route_after_step` originally returned `step_llm` whenever
   the LLM didn't call a tool; the second `step_llm` call sent a
   repeated AI message to the provider, which then complained
   "tool call result does not follow tool call" (400 from
   `api.minimaxi.com`). Replaced the bespoke router with the base
   `CompletionToolRouter` so idle rounds cap the subgraph instead.
3. Stage tools returned `Command(update={...})` without a sibling
   `ToolMessage`; `minimaxi.com` 400'd on the next LLM call with
   "Expected to have a matching ToolMessage". Fixed by reading
   `ToolRuntime.tool_call_id` (instead of the Pydantic-incompatible
   `InjectedToolCallId`) and appending a `ToolMessage(tool_call_id=...)`
   to the `Command.update["messages"]` list.
4. LLM passed `write_gate_reasons` reasons as a positional list;
   Pydantic 400'd with "Input should be a valid dictionary". Schema
   widened to `Union[dict, list[str]]`; `_coerce_gate_reasons` parses
   the list by position and strips `approve: ` prefixes.

### Frontend — `frontend/app/`

- `app/components/types.ts` — `DatabotAgentState` mirrors the backend
  `DatabotState` (stage pointer, candidate / selected / approved cards,
  draft / approved SQL, execution result, gate decisions,
  cards_reasons / sql_reasons, metric conflicts, dryrun / halt_reason,
  chart_requested, deny_feedback).
- `TableCardList.tsx` — `gate_cards` stage renders candidate vs
  selected cards with a checkbox per card; click-to-expand shows
  description, columns (with dimension / entity tags), metrics (with
  agg / type tags), and the CTE. `metric_conflicts` show as a warning
  block. Score / match-type / table-count / confidence render in a
  meta row.
- `SqlEditor.tsx` — `gate_sql` stage shows a textarea + Save draft +
  Regenerate-with-feedback; non-gate stages show a read-only
  `<pre>` with a `validated` / `approved` / `draft` tag.
- `ExecutionChart.tsx` — auto-shape detection
  (scalar / time-series / grouped), Recharts bar / line / pie / table
  with a chart-type tab at the top; error / no-rows / scalar states
  rendered explicitly.
- `DatabotArtifactPanel.tsx` — right-hand panel with three tabs
  (Cards / SQL / Results); tab auto-switches from the current
  `stage` (`fetch / gate_cards → Cards`, `sql / gate_sql → SQL`,
  `execute / chart / done → Results`). Header carries a `stage-pill`,
  a halt banner, and a dryrun banner. Bottom: gate-decision audit
  trail.
- `GatePanel.tsx` — reads `agent.pendingInterrupts` (AG-UI v2 standard)
  and renders each one with the rich payload (decoded from
  `message: "<json>"`); four options + LLM reasons on hover +
  comment textarea + resolve / skip.
- `app/databot.css` — hand-rolled CSS for the panel, table cards,
  gate UI; deliberately avoids Tailwind utility classes so it
  doesn't fight CopilotKit's bundled `styles.css`.
- `app/page.tsx` + `app/layout.tsx` rewired: top bar + `CopilotSidebar`
  (chat) on the left, `DatabotArtifactPanel` on the right; gate UI
  renders into the sidebar via the `pendingInterrupts` poll.
- `app/api/copilotkit/[...path]/route.ts` — `LANGGRAPH_DEPLOYMENT_URL`
  default port fixed from `8123` to `8000`.
- `package.json` — added `recharts ^2.13.3`.

### Tests

- `tests/test_databot_gates.py` — 11 unit tests for gate resume
  parsing + 6 schema-coercion tests for `_coerce_gate_reasons`.
- `tests/test_databot_graph.py` — 5 e2e tests driving the graph
  with a stub model: cards gate fires with reasons, approve routes
  to SQL stage, deny-halt routes to refusal, deny-comments loops back
  with `deny_feedback` set, SQL gate approve runs execute.
- Full suite: **311 passed**, 0 regression (the 3 deselected
  `test_user_profile.py` failures are pre-existing, unrelated).

---

## What's still TODO

### 1. Frontend → backend tool dispatch (high priority)

The frontend renders the right controls but the checkbox / regenerate
buttons are **no-ops** — they don't call `update_card_selection` or
`request_sql_regenerate` yet. CopilotKit v2 doesn't expose a
`useFrontendTool`-style API in `@copilotkit/react-core/v2`, so the
cleanest path is one of:

- **Tool dispatch via a side-channel message**: the page listens for
  the checkbox change and calls a small server-side route that POSTs
  to `langgraph dev`'s `/threads/{tid}/runs` endpoint with a
  pre-formed message that drives an LLM turn. The LLM sees the
  message and calls `update_card_selection` itself. Simple but
  round-trips through the LLM.
- **Frontend tool declaration**: declare
  `update_card_selection` and `request_sql_regenerate` as
  `useFrontendTool` (or v2's `ReactFrontendTool`); CopilotKit wires
  the client-side call straight to the agent. Needs a `toolCallId`
  correlation path that's only in v1 docs.

Owner: TBD.

### 2. `UserProfile` schema for databot history

`profile_persistence.py` writes JSONL sidecars because `UserProfile`
doesn't have a `databot_history` field. Add the field, fold the
sidecar reads into `refine_user_profile`, and stop writing the JSONL.

### 3. Partition-freshness `confidence` scoring

Still `"unknown"` for every card. Needs a step-LLM that inspects
each `physical_table`'s latest partition after RAG returns.

### 4. Superset chart emit

`chart_requested` is captured but `emit_to_superset` is a TODO.

### 5. `dryrun` banner when the SQL gate is `dryrun` but execute still
runs

Currently execute always runs after the SQL gate (read-only SQL is
safe). Some users may want a stricter "skip execute when dryrun"
semantics; defer until a user asks for it.

---

## Where things live

```
agent/react/databot/
  __init__.py
  databot_agent.py        # agent wrapper, build_graph -> build_databot_graph
  state.py                # DatabotState TypedDict
  gates.py                # make_cards_gate_node / make_sql_gate_node / make_chart_question_node
  graph.py                # build_databot_graph outer state machine
  subgraphs.py            # build_fetch_cards_subgraph / build_generate_sql_subgraph
  stage_tools.py          # mark_cards_selected, record_metric_conflict, write_gate_reasons,
                          # propose_sql, update_card_selection, request_sql_regenerate
  execute.py              # make_execute_sql_node (post-gate pure node)
  profile_persistence.py  # JSONL sidecar writer
  prompt.py               # existing prompts + new FETCH_CARDS_*/GENERATE_SQL_* stage prompts

frontend/app/
  page.tsx
  layout.tsx
  globals.css             # existing
  databot.css             # new, all the panel / card / gate styles
  api/copilotkit/[...path]/route.ts   # AG-UI v2 runtime, port 8000
  components/
    types.ts              # DatabotAgentState + shared shapes
    TableCardList.tsx     # candidate/selected cards + expand-to-detail
    SqlEditor.tsx         # textarea + Save / Regenerate-with-feedback
    ExecutionChart.tsx    # Recharts auto-shape + bar/line/pie/table tab
    GatePanel.tsx         # reads agent.pendingInterrupts
    DatabotArtifactPanel.tsx  # right-hand panel with 3 tabs

docs/
  CHAT_OPTIMIZATION.md    # per-round micro history (add a row per fix)
  DATABOT_V2_PROGRESS.md  # this file
```
