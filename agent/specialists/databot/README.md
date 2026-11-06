# Databot

Databot is TahoePilot's data-retrieval specialist. It turns a natural-language data question into an auditable query workflow: find the dbt models that can answer it, draft read-only SQL against them, run the SQL on Trino after a human approves it, and close the turn with an evidenced answer.

It is not a single LLM call that emits SQL. It is a staged pipeline with two human gates, so the table selection and the SQL can be inspected and corrected before anything runs.

Related docs: [agent framework and ReAct loop](../../README.md) · [tools](../../../tools/README.md) · [config](../../../config/README.md) · [memory](../../../memory/README.md) · [web UI and AG-UI server](../../../frontend/README.md) · [architecture](../../../docs/ARCHITECTURE.md)

| File | Contents |
|------|----------|
| `state.py` | `PHASE_*` constants, `DatabotState`, `DatabotReactState`, ReAct input/output schemas, `GateDecision`, `GateAuditEntry` |
| `graph.py` | Routing functions, `DatabotTopology` (layer subgraphs and nodes), `DatabotGraphBuilder` |
| `gates.py` | Gate nodes (`cards_node`, `sql_node`), interrupt payload, `parse_resume`, reason helpers |
| `stage_tools.py` | Stage-scoped LLM tools: `propose_sql`, `write_gate_reasons`, `record_metric_conflict`, `update_card_selection`, `request_sql_regenerate` |
| `card_staging.py` | Staging ids and `commit_cards` resolution (staging → committed) |
| `ui_actions.py` | Pure state patches for UI actions and gate redrafts; `ACTION_ALLOWED_STAGES` |
| `history.py` | `DataRetrievalRecord`, `DataRetrievalStore` (per-user retrieval history) |
| `databot_agent.py` | `DatabotAgent`, `DatabotTurnMessagePolicy` (per-turn reset and persistence) |
| `tools/rag/dbt_models.py` | `TableCard`, `fetch_related_models`, `commit_cards` |
| `config/agents/databot.toml` | Prompts, gate toggles, tool scopes, budgets |

## Basic concepts

### Table cards

A **table card** is a dict shaped like `TableCard` (`tools/rag/dbt_models.py`): a dbt model's `name`, `model_type`, `physical_tables`, `cte`, `agg_time_dimension`, `columns`, `metrics`, `owner`, `usage`, plus retrieval metadata (`score`, `matched_chunk_type`). Cards move through several state fields within one turn:

| Field | Holds | Written by |
|-------|-------|-----------|
| `staging_cards` | Every hit from `fetch_related_models`, each with a unique `staging_id` (`<model>_<8 hex>`) | `fetch_related_models` |
| `committed_cards` | The subset the LLM proposes, each with `selected_metrics`, `selected_dimensions`, `selection_notes` | `commit_cards` |
| `review_cards` | The cards shown at the cards gate; starts as a copy of `committed_cards` | `prepare_cards_for_gate`; UI `update_card_selection` |
| `approved_cards` | The cards the reviewer accepted; the SQL stage may only use these | cards gate (approve / dry-run) |
| `history_cards` | Cards from this user's earlier approved retrievals, each annotated with `prior_question` and `prior_sql` | `DatabotTurnMessagePolicy` / `DataRetrievalStore` |

`commit_cards` resolves each `staging_id` against this turn's staging cards, then committed cards, then `history_cards` and `approved_cards`; it also accepts a bare model name or a stale id whose model name still matches. The LLM only sees compact refs (`compact_staging_refs`), never full card bodies.

### Metric conflicts

When a dbt metric disagrees with a DataHub glossary term, the fetch stage calls `record_metric_conflict(card_name, metric, glossary_term, reason)`. Conflicts accumulate in `metric_conflicts`, are included in the cards-gate brief and the turn summary, and are never "fixed" — Databot does not edit dbt models.

### Draft vs approved SQL

| Field | Meaning |
|-------|---------|
| `draft_sql` | Current SQL draft, from `propose_sql` or the UI SQL editor |
| `sql_validated` | `True` when the drafter reports that `trino_explain` parsed the draft |
| `sql_reasons` | Reason text for the four SQL-gate options (`write_gate_reasons`) |
| `approved_sql` | Copied from `draft_sql` when the SQL gate approves or dry-runs; the only SQL `execute_sql` will run |
| `execution_result` | `{"ok": True, "sql", "columns", "rows", "row_count", "truncated"}` or `{"ok": False, "error", ...}` |

### Gate decisions and the audit trail

Both gates offer the same four options (`GATE_OPTIONS`):

| Decision | Cards gate | SQL gate |
|----------|-----------|----------|
| `approve` | `approved_cards ← review_cards`, `stage → prepare_sql`, `dryrun = False` | `approved_sql ← draft_sql`, `stage → execute_sql`, `dryrun = False` |
| `dryrun` | Same as approve, with `dryrun = True` | Same as approve, with `dryrun = True` |
| `deny-comments` | Clears staging/committed/review cards and card reasons, stores the comment in `deny_feedback`, appends a "Cards gate review — redraft…" `HumanMessage`, stays in `prepare_cards` | Clears `draft_sql`, `sql_reasons`, `sql_validated`, stores `deny_feedback`, appends an "SQL gate review — redraft…" `HumanMessage`, stays in `prepare_sql` |
| `deny-halt` | `stage → summary`, `halt_reason ← comments` (or a default) | Same |

Every verdict appends a `GateAuditEntry` (`gate`, `decision`, `comments`, `reasons`) to `gate_decisions`. The redraft `HumanMessage`s are recognized by `is_gate_redraft_message`, so `user_question_from_messages` still returns the user's original question.

### Dry-run semantics

`dryrun` is a flag, not a different path. A dry-run at either gate continues the pipeline exactly like approve — including running the query after a SQL-gate dry-run. Its effects are:

- the turn is not written to retrieval history (`DataRetrievalRecord.from_state` returns `None` when `dryrun` is set);
- the option copy says so: the default reasons (`DEFAULT_*_GATE_REASONS["dryrun"]`) and the web gate panel describe dry-run as "continue / run the query like approve, but do not save this retrieval to history";
- the summary node receives `dryrun_preview_only: true` and the fallback summary says nothing was saved.

The flag reflects the most recent gate: a cards-gate dry-run followed by a SQL-gate approve leaves `dryrun = False`.

### Retrieval history

After a turn commits, `DatabotTurnMessagePolicy.commit_turn_state` calls `DataRetrievalStore.persist_from_state`. A record (question, approved cards, approved SQL, timestamp, session) is appended when the turn is not a dry-run, did not halt (`halt_reason` empty — a cards approve followed by a SQL `deny-halt` writes nothing), at least one gate row is `approve`, and there are approved cards or SQL. Records are stored as JSONL at `<filesystem_root>/<user>.databot_turns.jsonl`; the last 30 are loaded. `history_cards` keeps the latest card per model name. On the next turn, `inject_history_briefing` prepends a one-time system message ("Prior retrieval cards for this user…") so the fetch stage can commit known models before searching.

## Design philosophy

**Staged pipeline with human gates.** Choosing the source table and running SQL are the two decisions where a wrong guess silently produces a wrong number. The pipeline stops before each and shows the evidence (cards with selected metrics/dimensions, then the SQL) so a person can approve, correct, or stop. The system prompt also forbids inferring a table's meaning from its name alone.

**Outer state machine, inner ReAct per layer.** The outer graph is deterministic: the `stage` field plus a few snapshot fields decide which layer runs next. Open-ended work (searching for models, drafting SQL) happens in a bounded ReAct loop inside a layer, with its own tool scope, tool budget, and exit predicate (`stage_complete`). This keeps the search stage from running queries and the SQL stage from searching for new tables, and it makes each stage's end condition testable.

**Gates are interrupts.** `gate_cards` and `gate_sql` call `langgraph.types.interrupt`. The run pauses with the gate payload checkpointed; resuming with `Command(resume=...)` continues from that node, so completed stages are not re-run. The same mechanism works for the CLI (blocking prompt) and the web UI (AG-UI interrupt events), and the UI can patch state while the run is paused.

**Read-only SQL.** The system prompt forbids writes, and the tools enforce it: `trino_run_query` and `trino_explain` pass SQL through `validate_read_only_sql` (`tools/data/sql_guard.py`), which accepts a single statement whose first token is `SELECT`, `WITH`, `SHOW`, `DESCRIBE`, `DESC` or `EXPLAIN`; for `EXPLAIN` (including `EXPLAIN ANALYZE`, which executes the statement) the wrapped statement must itself be read-only.

**Retrieval only.** The Databot graph does not delegate to other specialists. Glossary and definition lookups happen inside the fetch stage through DataHub tools.

## How it works

### Phases and layers

`stage` holds one of four phases (`state.py`). Each phase maps to one compiled layer subgraph; the gates are nodes inside layers, not phases.

| `stage` | Layer | Nodes inside the layer | Tool scope |
|---------|-------|------------------------|-----------|
| `PHASE_PREPARE_CARDS` = `prepare_cards` | `layer_prepare_cards` | `inject_stage_instruction`, `fetch_cards` (ReAct), `prepare_cards_for_gate`, `gate_cards` | `databot,fetch` |
| `PHASE_PREPARE_SQL` = `prepare_sql` | `layer_prepare_sql` | `inject_stage_instruction`, `generate_sql` (ReAct), `gate_sql` | `databot,sql` |
| `PHASE_EXECUTE_SQL` = `execute_sql` | `layer_execute_sql` | `execute_sql` | `databot,execute` (`trino_run_query`) |
| `PHASE_SUMMARY` = `summary` | `layer_summary` | `end_with_summary` or `end_with_refusal` | none |

`LAYER_SUBGRAPH_IDENTIFIER` maps each layer to its tool-scope identifier. Every layer is compiled with the same checkpointer as the outer graph.

### Phase flow

```
        START ─▶ start_turn ─▶ to_next_layer (and after each layer)
                          │
                          ▼
  ┌──────────── layer_prepare_cards ─────────────┐
  │ inject_stage_instruction                      │
  │   │ prepare_cards_entry                       │
  │   ├──────────────▶ fetch_cards (ReAct)        │
  │   │                    │                      │
  │   │                    ▼                      │
  │   │           prepare_cards_for_gate          │
  │   │                    │                      │
  │   └──────────────▶ gate_cards ◀─ interrupt    │
  └────────────────────────┬──────────────────────┘
          approve / dryrun │            deny-halt ──────────────┐
                           ▼                                    │
  ┌──────────── layer_prepare_sql ───────────────┐              │
  │ inject_stage_instruction                      │              │
  │   │ prepare_sql_entry                         │              │
  │   ├──────────────▶ generate_sql (ReAct)       │              │
  │   │                    │ after_generate_sql   │              │
  │   └──────────────▶ gate_sql ◀─ interrupt      │              │
  └────────────────────────┬──────────────────────┘              │
          approve / dryrun │            deny-halt ──────────────┤
                           ▼                                    │
                 layer_execute_sql (execute_sql)                │
                           │                                    │
                           ▼                                    ▼
              layer_summary: end_with_summary         end_with_refusal
                           │                                    │
                           └──────────────▶ END ◀───────────────┘
```

### Gate loops

```
  gate_cards ── deny-comments ──▶ inject_stage_instruction ──▶ fetch_cards ──▶ prepare_cards_for_gate ──▶ gate_cards
     (cards and reasons cleared, so prepare_cards_entry picks fetch_cards)

  gate_sql ── deny-comments ──▶ inject_stage_instruction ──▶ generate_sql ──▶ … ──▶ gate_sql
     (draft_sql and sql_reasons cleared; deny_feedback carries the comment)
```

### Routing functions

| Function | Where | Returns |
|----------|-------|---------|
| `phase_of(state)` | module | `stage`, or `prepare_cards` if missing or unknown |
| `latest_gate(state)` | module | `(gate, decision)` from the last `gate_decisions` row |
| `node_for_state(state)` | module | In-layer node for the snapshot: refusal if `halt_reason` is set in a prepare phase; `gate_cards` if `review_cards` and `cards_reasons` exist; `gate_sql` once `draft_sql` and `sql_reasons` both exist, else `generate_sql` (a SQL deny-comments clears both, so a redraft goes back to `generate_sql`); `execute_sql`; summary or refusal |
| `starts_new_turn(state)` | module | `True` when `stage = summary` and the last message is a non-empty, non-replayed, non-redraft `HumanMessage` (a new question in a finished thread) |
| `layer_for_state` / `to_next_layer` | outer graph | The layer that owns `node_for_state(state)`; used after `start_turn` and after the first three layers |
| `prepare_cards_entry` | cards layer | `gate_cards` when review cards and reasons are already staged, otherwise `fetch_cards` |
| `after_gate_cards` | cards layer | `inject_stage_instruction` on deny-comments; `END` when `stage` moved to `prepare_sql` or `summary` |
| `prepare_sql_entry` | SQL layer | `gate_sql` when `draft_sql` and `sql_reasons` exist; otherwise `generate_sql` |
| `after_generate_sql` (module) | SQL layer | `gate_sql` when the draft is still incomplete (the gate opens anyway so a human can edit or halt); otherwise `node_for_state` |
| `DatabotTopology.after_generate_sql` | SQL layer | Maps the above: `generate_sql` → `inject_stage_instruction`, `gate_sql` → `gate_sql`, anything else → `END` |
| `after_gate_sql` | SQL layer | `END` on halt or when `stage` moved to `execute_sql`/`summary`; `inject_stage_instruction` on deny-comments |
| `summary_entry` | summary layer | `end_with_refusal` when `halt_reason` is set, else `end_with_summary` |

Routing reads the last `gate_decisions` row, so a new gate kind or decision must be handled in these functions as well as in `gates.py`.

### Nodes

- **`start_turn`** (outer graph, first node after `START`) applies the per-turn baseline (`DatabotTurnMessagePolicy.baseline_fields()`, keeping `history_cards`) when `starts_new_turn` holds; otherwise it is a no-op. This is what resets web (`/agui`) turns; CLI turns arrive already reset, so it does nothing there.
- **`inject_stage_instruction`** appends the layer's opening system message (`fetch_instruction` or `sql_instruction`) unless an identical system message already appears in the current turn, i.e. after the latest real user question (gate redraft messages do not start a turn). A redraft loop therefore does not repeat it, and every new turn gets it again.
- **`fetch_cards`** runs the fetch ReAct loop. It exits when `committed_cards` is non-empty, when the tool budget is spent, or after the idle-retry allowance. The next node runs regardless, so an exhausted fetch can reach the gate with zero cards.
- **`prepare_cards_for_gate`** copies `committed_cards` to `review_cards`, asks the model (with `prepare_cards_for_gate_prompt`) for the four option reasons as a JSON array, normalizes them with `coerce_reasons`/`merge_reasons` (falling back to `DEFAULT_CARDS_GATE_REASONS`), and writes `cards_selection_summary`.
- **`gate_cards` / `gate_sql`** call `gates.ask_gate`, which builds the payload with `gates.prompt`, calls `interrupt`, and parses the resume with `parse_resume`. A reply that names no valid option interrupts again with the same gate payload plus a `note` (also prepended to `question`) saying the reply was not understood and listing the options; nothing is applied or audited until a valid reply arrives. Then the node applies the decision. With the gate disabled in config they auto-approve and still write an audit row.
- **`generate_sql`** runs the SQL ReAct loop. It exits when `sql_react_complete` holds (`draft_sql` and `sql_reasons` both set), or on budget/idle exhaustion.
- **`execute_sql`** invokes `trino_run_query` with `approved_sql` and a row limit of `DEFAULT_ROW_LIMIT` (100), stores `execution_result`, and always sets `stage → summary`, even on error.
- **`end_with_summary`** (`turn_summary`) asks the model (with `turn_summary_system_prompt`) for one user-facing message from the question and a JSON context (approved models, conflicts, SQL, first five result rows, gate decisions). If the reply is empty or looks like internal narration, it writes a deterministic fallback in Chinese or English depending on the question.
- **`end_with_refusal`** writes a fixed "turn halted" message with the halt reason.

### The inner ReAct layer

`DatabotTopology._compile_react_layer` builds a ReAct graph with `build_react_graph` (see [agent/README.md](../../README.md)) using `CompletionToolRouter(run_context, stage_complete=...)` and `DatabotReactState`. `react_layer_node` wraps it as a single outer node:

```
outer DatabotState ──build_input──▶ ReAct subgraph ──merge_output──▶ patch onto DatabotState
```

| Layer | `build_input` / input schema | `merge_output` / output schema (keys copied back) | `stage_complete` |
|-------|------------------------------|---------------------------------------------------|------------------|
| fetch | `fetch_react_input` / `FetchReactInput` | `merge_fetch_react_output` / `FetchReactOutput`: `staging_cards`, `committed_cards`, `metric_conflicts`, `messages` | `bool(committed_cards)` |
| sql | `sql_react_input` / `SqlReactInput` | `merge_sql_react_output` / `SqlReactOutput`: `draft_sql`, `sql_validated`, `sql_reasons`, `messages` | `sql_react_complete` |

`react_turn_init` resets the loop counters (`tool_call_count`, `idle_reason_rounds`, …) each time a layer is entered, so a redraft gets a fresh budget. Every tool batch counts toward the layer's `max_tool_calls`, including stage tools that return `Command` updates (`commit_cards`, `fetch_related_models`, `propose_sql`, `write_gate_reasons`). Tools write state through `Command(update=...)`; only the keys in the output schema reach the outer state. A tool that writes any other key (for example `write_gate_reasons` setting `stage`) has no effect outside the ReAct subgraph.

### Per-turn reset and what persists

On the CLI path, `DatabotAgent` accepts each user message as a new retrieval question. `DatabotTurnMessagePolicy.history_state` starts the turn from `baseline_fields()`, which resets every pipeline field to its default (`stage = prepare_cards`, empty cards, SQL, reasons, audit, result, `dryrun = False`). Then it fills `history_cards` from the prior checkpoint or, if empty, from `DataRetrievalStore`.

On the web path the graph is invoked directly, so the outer `start_turn` node applies the same `baseline_fields()` (keeping the checkpoint's `history_cards`) when a new question arrives in a thread whose `stage` is `summary`. The history briefing and retrieval persistence still run only on the CLI path.

| Persists across turns | Reset every turn |
|-----------------------|------------------|
| `messages` (full chat history, including traces from earlier turns) | `staging_cards`, `committed_cards`, `review_cards`, `approved_cards` |
| `history_cards` (refreshed after each approved, non-dry-run turn) | `draft_sql`, `approved_sql`, `sql_validated`, `sql_reasons`, `cards_reasons`, `cards_selection_summary` |
| On-disk `*.databot_turns.jsonl` records | `gate_decisions`, `dryrun`, `halt_reason`, `deny_feedback`, `execution_result`, `metric_conflicts` |

Cards from earlier turns are reused through `history_cards`, not `approved_cards`.

### Reading state while a gate is paused

Gates run inside layer subgraphs. While one is waiting, the newest values (`stage`, `review_cards`, `deny_feedback`, `draft_sql`, …) exist only in that layer's checkpoint; the outer checkpoint still holds the values from before the layer started. Use the helper to find the innermost paused snapshot:

```python
snapshot = await DatabotGraphBuilder.aget_active_state(graph, config)
state = snapshot.values
await graph.aupdate_state(snapshot.config, patch)   # patch the paused layer, not the outer graph
```

It falls back to the outer snapshot when no layer is in flight. `graph.aget_state(config)` alone will show stale gate state.

## Usage

### CLI

```bash
.venv/bin/python main.py --agent databot            # -s SESSION, -u USER_ID, -v also available
```

Each line you type is a new question. When a gate pauses, the CLI prints a `Prompt>` line and reads your answer from `You>`; typing `quit`, `exit`, `q` or `:q` cancels the turn. The gate's question, option reasons and card list are in the interrupt's JSON `message` field; the CLI's `AgentTurnResult.interrupt_question` looks for a top-level `question` key, so for Databot gates it currently prints the generic "Please provide the information needed to continue." Answer with any form `gates.parse_resume` accepts:

| You type | Parsed as |
|----------|-----------|
| `approve`, `dryrun`, `deny-comments`, `deny-halt` (any case) | That decision, no comments |
| `{"decision": "deny-comments", "comments": "use daily_orders instead"}` | That decision with comments |
| `{"decision": "<unknown>", "comments": "x"}` | Not understood — the gate asks again |
| Empty line | Asks again (never continues) |
| Any other text, e.g. `use commission_revenue not gmv` | Not understood — the gate asks again |

To send the pipeline back with feedback you must use the JSON form with `"decision": "deny-comments"`; free text alone is rejected and the gate re-asks (nothing runs). The CLI has no way to edit the card selection or SQL — use the web UI for that.

### Web UI

`./scripts/dev.sh backend` starts `langgraph dev` on `:8000`, which mounts `agui_server.py:app`; `./scripts/dev.sh frontend` starts the Next.js app on `:3000`. See [frontend/README.md](../../../frontend/README.md) for the server and UI details.

- **`POST /agui`** streams AG-UI events for the compiled Databot graph. Gate interrupts arrive as `{id, reason, message}` (`id` is `databot-cards-gate` or `databot-sql-gate`; `message` is the JSON payload with `question`, `options`, `default`, `gate`, and for the cards gate `review_cards` and `selection_summary`). The gate panel resumes the run with the chosen decision and comments.
- **`POST /agui/actions`** applies a direct state patch to the paused layer checkpoint without an LLM round trip. The body is `{thread_id, action, selected_card_names?, sql?, validated?, feedback?}`; the response is `{ok, action, state}` with the fields in `DATABOT_STATE_KEYS`.

| Action | Allowed `stage` (`ACTION_ALLOWED_STAGES`) | Effect | Required field |
|--------|------------------------------------------|--------|----------------|
| `update_card_selection` | `prepare_cards` | `review_cards ←` the named cards from `committed_cards` (unknown names dropped); clears `deny_feedback` | `selected_card_names` |
| `propose_sql` | `prepare_sql` | `draft_sql ← sql`, `sql_validated ← validated` | non-empty `sql` |
| `request_sql_regenerate` | `prepare_sql` | Clears `draft_sql`, `sql_reasons`, `sql_validated`; sets `deny_feedback` | non-empty `feedback` |

An unknown action returns 400; a wrong stage or missing field returns 409. Patches take effect when the gate resumes: approve copies the current `review_cards` / `draft_sql`.

The `/agui` path drives the compiled graph directly, not `DatabotAgent.run`, so `DatabotTurnMessagePolicy` (history briefing, retrieval persistence) does not run there. The per-turn reset does: the graph's `start_turn` node starts a fresh pipeline when a new question arrives after a finished turn.

### Configuration (`config/agents/databot.toml`)

See [config/README.md](../../../config/README.md) for `extends`, prompt layout and tool groups.

| Key | Purpose |
|-----|---------|
| `[run_context] extends = "stage"` | Outer defaults (`max_tool_calls`, `max_idle_reason_rounds`); the staged graph itself uses the per-layer budgets below |
| `prepare_cards_for_gate_prompt` | System prompt for the cards-gate reason writer (must return a JSON array of four strings) |
| `turn_summary_system_prompt` | System prompt for `end_with_summary` |
| `[run_context.gates] cards_enabled`, `sql_enabled` | `false` auto-approves that gate (no pause; audit row still written) |
| `[run_context.react.fetch]` / `[run_context.react.sql]` | Per-layer ReAct settings; both `extends = "tahoe"`, so `max_tool_calls = 10`, `max_idle_reason_rounds = 1` unless overridden |
| `fetch_instruction`, `sql_instruction` | Opening system message for each layer |
| `next_step`, `tool_budget_exhausted_prompt`, `idle_nudge_prompt` | Per-layer ReAct prompts |
| `[tools] fetch` | `commit_cards`, `datahub_graphql_query`, `datahub_list_glossary_terms`, `fetch_related_models`, `record_metric_conflict` |
| `[tools] sql` | `hive_desc_table`, `propose_sql`, `trino_desc_table`, `trino_explain`, `write_gate_reasons` |
| `[tools] execute` | `trino_run_query` |
| `[tools] default`, `rag` | Scopes not used by the staged graph's layers |
| `[accepted_mcp] fetch = ["datahub"]` | DataHub MCP tools added to the fetch scope |
| `[system_prompt]` | Databot persona and data rules (read-only, glossary-first, answer requirements) |

## Extension notes

### Adding a stage tool

1. Define it with `@register_tool` and `@tool` (in `stage_tools.py` for Databot-only tools). Take `runtime: ToolRuntime = None` to read state, and return `Command(update={...})` including a `ToolMessage` with the matching `tool_call_id` (`StageCommands.tool_message`).
2. Add its name to the `[tools]` scope of the stage that should see it (`fetch`, `sql`) in `config/agents/databot.toml`.
3. If it writes a state key, add the key to `DatabotReactState`, to the layer's output schema (`FetchReactOutput` / `SqlReactOutput`) and its `merge_*_react_output`, and to `DatabotState`. Without this the write never leaves the ReAct subgraph.
4. If the key must reset per turn, add it to `_DATABOT_FIELD_DEFAULTS` in `databot_agent.py`; if the UI should see it, add it to `DATABOT_STATE_KEYS`.
5. If the tool changes when the stage is done, update the `stage_complete` predicate and the layer prompts.

### Changing gate behavior

- Option copy defaults: `DEFAULT_CARDS_GATE_REASONS` / `DEFAULT_SQL_GATE_REASONS`.
- Decision effects: `_cards_gate_update` / `_sql_gate_update`; redraft resets live in `apply_cards_gate_redraft` / `apply_sql_gate_redraft`.
- Routing after a decision: `after_gate_cards`, `after_gate_sql`, `prepare_*_entry`, `node_for_state`.
- Turning a gate off: config only (`[run_context.gates]`).
- Adding a decision value means updating `GateDecision`, `GATE_OPTIONS`, both default-reason dicts, `parse_resume`, the routing functions, `DataRetrievalRecord.from_state`, and the frontend gate panel.

### Adding a UI action

1. Write a pure patch function in `ui_actions.py`, add the name to `DatabotUiAction` and `ACTION_ALLOWED_STAGES`, and dispatch it in `build_ui_action_patch`.
2. Add the name to the allow-list in `databot_ui_action` in `agui_server.py`, and any new body fields to `DatabotUiActionBody`.
3. Call it from the frontend (`frontend/app/components/useDatabotActions.ts` posts to `/api/databot/actions`, which proxies to `/agui/actions`).
4. If the LLM should have the same capability, wrap the patch function in a stage tool, as `update_card_selection` and `request_sql_regenerate` do.

### Tests

`tests/test_databot_graph.py` (end-to-end wiring with a stub model and `MemorySaver`), `test_databot_gates.py` (resume parsing, reasons), `test_databot_stage.py` (routing), `test_databot_router.py` (ReAct exit contract), `test_databot_ui_actions.py` (patches and stage checks), `test_databot_frontend_contract.py` (frontend reset state and TS types match the backend phases and `DATABOT_STATE_KEYS`).

```bash
.venv/bin/python -m pytest tests/test_databot_*.py
```

## Pitfalls

- **Stale state at a gate.** Reading `graph.aget_state(config)` while paused returns the pre-layer values. Use `DatabotGraphBuilder.aget_active_state` and patch `snapshot.config`.
- **Dry-run is not a preview.** A SQL-gate `dryrun` runs the query; it only skips retrieval history. Keep LLM-written option reasons (`prepare_cards_for_gate_prompt`, `write_gate_reasons`) from describing it as "no execution".
- **SQL-layer routing follows the draft, not the audit trail.** After a SQL `deny-comments` the last audit row stays `sql/deny-comments` until the gate runs again, so routing must not key on it; `node_for_state` and `prepare_sql_entry` use `sql_react_complete` only (`tests/test_databot_graph.py::test_sql_redraft_pauses_at_gate_again`).
- **Fetch can reach the gate empty.** If the fetch budget runs out before a non-empty `commit_cards`, `prepare_cards_for_gate` still runs and the gate shows zero cards. `commit_cards` with `selections=[]` does not satisfy the exit predicate.
- **Tool writes outside the output schema are dropped**, e.g. `write_gate_reasons`' `stage` update.
- **Web turn reset keys on the last message.** `start_turn` resets only when the trailing message is a fresh `HumanMessage` and `stage = summary`. A message sent while a gate is paused is not a new turn; answer or halt the gate first.
- **Web UI does not persist retrieval history.** `/agui` bypasses `DatabotTurnMessagePolicy.commit_turn_state`, so approved web turns are not written to `*.databot_turns.jsonl`.
- **The SQL guard is keyword-based, not a parser.** It checks the leading keyword (and the statement inside `EXPLAIN`) and rejects multiple statements; it does not parse SQL. Use a read-only Trino user for defense in depth.
- **Row limit is fixed.** `execute_sql` fetches at most `DEFAULT_ROW_LIMIT` (100) rows; `execution_result.truncated` marks a cut.
