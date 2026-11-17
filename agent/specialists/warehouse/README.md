# Warehouse

Warehouse is the lead's data specialist. It takes one data task from the lead, finds the warehouse tables that answer it, writes one read-only Trino SQL query, has the user review it, runs it and reports the answer with evidence.

It is a single ReAct loop, not a staged pipeline: discovery, schema checks, drafting and answering happen in one message history. The only hard step is the review, and it is enforced by the tools, not the prompt. For the staged alternative with separate card and SQL gates, see [Databot](../databot/README.md), which is a front agent with its own page; the lead delegates data work to warehouse, never to databot.

Related docs: [agent framework, lead and delegation](../../README.md) · [tools](../../../tools/README.md) · [config](../../../config/README.md) · [web UI and AG-UI server](../../../frontend/README.md)

| File | Contents |
|------|----------|
| `warehouse_agent.py` | `WarehouseAgent` (`BaseReactAgent`), `WarehouseState`, `WarehouseSystemPrompt`; `ui_view` and `result_from_state` |
| `tools.py` | The gate tools `request_sql_approval` and `run_sql`, `sql_fingerprint`, `parse_gate_resume`, the interrupt payload |
| `config/agents/warehouse.toml` | Roster line, budgets, gate toggle, prompt, discovery tool list |
| `tools/data/sql_guard.py` | `validate_select_sql`: a single `SELECT` or `WITH` query, no trailing semicolon |

## Tools

| Tool | Source | Use |
|------|--------|-----|
| `fetch_related_models` | `[tools] default` | Candidate dbt models (RAG over Qdrant); hits are kept in `staging_cards` |
| `trino_desc_table`, `trino_list_schemas`, `trino_list_tables` | `[tools] default` | Confirm table names and columns |
| `trino_explain` | `[tools] default` | Check the SQL parses (plan only, never data) |
| `datahub_get_table_docs(table, section, columns)` | `[tools] default` | A table's DataHub documentation: URN, owners, description head and section list, column names and types; `section` reads one section, `columns` adds matching column notes. No glossary terms or tags. |
| `datahub_get_lineage`, `datahub_get_lineage_paths_between` | `[tools] default` | Where a table's data comes from, or how two tables relate (URN from the docs tool) |
| `@memory` | `[tools] default` | `compact_context`, `read_offloaded_file` |
| `request_sql_approval(sql, explanation, tables)` | bound by `WarehouseAgent` | Ask the user to review the final SQL |
| `run_sql(sql)` | bound by `WarehouseAgent` | Run SQL the user approved |

`WarehouseAgent.warehouse_tools()` drops `trino_run_query`, and any configured tool named like a gate tool, before binding: the model has no way to run SQL except `run_sql`.

DataHub is limited to table documentation and lineage. Allowed: `datahub_get_table_docs`, `datahub_get_lineage`, `datahub_get_lineage_paths_between` (`WAREHOUSE_DATAHUB_TOOLS`). There is no `[accepted_mcp]`, and `is_datahub_tool` drops every other DataHub tool a config change adds: glossary and catalog search (`datahub_list_glossary_terms`, `datahub_list_datasets`, ...), raw GraphQL, and all DataHub MCP tools. Warehouse never searches for or compares glossary definitions; a definition comes from the lead's brief (the lead asks `knowledge` for "what does X mean"), else warehouse uses the metric as the chosen dbt model defines it and says so in the review explanation.

`datahub_get_table_docs` is sized for the model: Wish dataset docs run to 35k+ characters of Markdown plus long column notes, so a first call returns the description's first 2,000 characters, the section headings and column names (~7k characters for `bi.order_level`); `section=` returns one section (up to 6,000 characters) and `columns=` adds up to 12 matching column notes (exact name, then name contains, then description contains for keywords of four or more characters).

## The approval invariant

`run_sql` runs only SQL whose fingerprint is in `approved_sql`, and only `request_sql_approval` adds one, after the reviewer approves.

- **Fingerprint.** `sql_fingerprint(sql)`: the SQL trimmed, trailing semicolon removed, whitespace runs collapsed, then SHA-256 (first 20 hex characters). Any other change, including case, is a different query and needs a new approval.
- **Validation.** Both tools pass the SQL through `validate_select_sql`; anything other than one `SELECT` / `WITH` statement is refused before review and before running.
- **One review per step.** `request_sql_approval` refuses to run when the same AI message has other tool calls, so the review is never batched with discovery.
- **Edits by the reviewer.** If the reviewer edits the SQL and approves, the edited SQL is validated and its fingerprint is recorded instead; the tool tells the model to run that version.
- **Refusal.** `run_sql` with unapproved SQL returns `Not run: this exact SQL has not been approved...`; a failing query returns `SQL failed: ...` and the model must fix it and request approval again.

With `sql_enabled = false` the review is automatic (no interrupt, decision `approve`), but the order is the same: `run_sql` still needs a fingerprint from `request_sql_approval`.

## Interrupt payload and resume

`request_sql_approval` calls LangGraph `interrupt(...)` with:

```text
{ id: "warehouse-sql-gate", reason: "Review the SQL before it runs", message: <JSON string> }

message = { gate: "warehouse_sql", question: "Run this SQL against the warehouse?",
            sql, explanation, tables: [...], options: ["approve", "revise", "stop"], default: "approve" }
```

Resume with `Command(resume=...)`; `parse_gate_resume` accepts:

| Resume value | Read as |
|--------------|---------|
| `{"decision": "approve"}` | Approve the SQL as proposed |
| `{"decision": "approve", "sql": "<edited>"}` | Approve the reviewer's version (validated first) |
| `{"decision": "revise", "comments": "..."}` | The model revises and asks again |
| `{"decision": "stop", "comments": "..."}` | No SQL runs; the model reports what it prepared and stops |
| `"approve"`, `"revise"`, `"stop"` | The bare decision |
| any other string | `revise`, with the text as comments |
| anything else, or an unknown decision | `revise` |

Under the lead, warehouse runs nested inside `delegate`, so the interrupt pauses the lead's run with this payload and resuming the lead's thread resumes the tool (see [agent/README.md](../../README.md#nested-runs-and-gate-interrupts)). The `/lead` page renders it in the chat with `SqlReviewGate`; the CLI prints a `Prompt>` line and reads the answer (any form in the table above).

## State and results

`WarehouseState` adds to `ReactAgentState`:

| Field | Meaning |
|-------|---------|
| `staging_cards` | Models found by `fetch_related_models` |
| `approved_sql` | Fingerprints of approved SQL |
| `sql_review` | Latest review: `status` (`approved`, `revise`, `stopped`), `sql`, `explanation`, `tables`, `comments`, `edited` |
| `execution` | Latest `run_sql` result: `sql`, `columns`, `rows`, `row_count`, `truncated`, or `sql` and `error` |

`run_sql` fetches at most `result_row_limit` rows; the model sees a preview of at most 50 rows and 8,000 characters, the UI gets every fetched row.

`result_from_state` builds the `SubagentResult` the lead reads:

| Part | Content |
|------|---------|
| `summary` | The final answer text (`<think>` blocks stripped). If there is no text but the query returned rows, a note pointing at `artifacts.execution.leading_rows`, with status `done` |
| `artifacts.tables` | Tables named in the review |
| `artifacts.sql` | The SQL that ran, else the SQL under review |
| `artifacts.execution` | `columns`, `row_count`, `truncated`, `error`, and `leading_rows` (first rows, at most 20 and 4,000 characters of JSON) |
| `artifacts.halt_reason` | The reviewer's comment when stopped |
| `status` | `halted` when the reviewer stopped the query (the lead must not retry); `failed` when the last query failed (the lead may re-delegate once); otherwise the base status |
| `ui_state` | `ui_view`: unique `tables` (name, short description), `sql_review`, `execution` with the first 200 rows; shown in the `/lead` page's Specialist panel |

## Configuration (`config/agents/warehouse.toml`)

Loaded by `WarehouseAgentConfig` (a `ReactAgentConfig`).

| Key | Default | Meaning |
|-----|---------|---------|
| `delegate_when` | – | The lead's roster line: data retrieval with reviewed, read-only SQL; not metric definitions |
| `[run_context] max_tool_calls` | 24 in the file | Discovery, one review, one run, room for a revision |
| `[run_context] result_row_limit` | 200 | Rows one `run_sql` call fetches |
| `[run_context.gates] sql_enabled` | `true` | Human review on; resolved as `sql_gate_enabled`, which a run override can also set |
| `[system_prompt]` | extends `tahoe` | Role, workflow (find tables, check columns, optional explain, request approval alone, run exactly the approved SQL, answer), data prohibitions, answer requirements |
| `[tools] default` | see Tools | Discovery tools; the gate tools are not listed; no `[accepted_mcp]` |

## Tests

`tests/test_warehouse_agent.py` (gate tools, fingerprint check, resume parsing, results and UI view with a fake query runner), `tests/test_agent_config.py` (roster line, not a front agent), `tests/test_evals_routing_cases.py` (routing to warehouse).

## Pitfalls

- **Any edit needs a new approval.** The model must pass `run_sql` exactly the approved text (whitespace aside); a "small fix" after approval is refused.
- **Turning the review off does not remove the order.** `sql_enabled = false` skips the interrupt only; a model that calls `run_sql` first is still refused.
- **Halted is final for the turn.** A `stop` makes the result `halted`; the lead reports it and asks the user how to continue instead of re-delegating.
- **The guard is keyword-based.** `validate_select_sql` checks one statement and its leading keyword; it does not parse SQL. Use a read-only Trino user for defense in depth.
