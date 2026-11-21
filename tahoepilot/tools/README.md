# Tools

The `tahoepilot/tools/` package holds every LangChain tool that TahoePilot agents can call: warehouse metadata and queries (Trino, Hive, S3), the DataHub catalog, read-only Kubernetes inspection, local code execution, web search, planning, and RAG retrieval. It also contains the name registry, the bootstrap that assigns tools to agents, MCP loading, and the structured error model that the ReAct loop uses for recovery.

Related docs:

- [agent/README.md](../agent/README.md): agents, `AgentCatalog`, the ReAct loop.
- [config/README.md](../../config/README.md): every TOML file, including `tools.toml` and `tool_groups.toml`.
- [tahoepilot/agent/specialists/databot/README.md](../agent/specialists/databot/README.md): Databot stages and their stage tools.
- [rag/README.md](../rag/README.md): the ingest side of the Qdrant collections the RAG tools search.
- [memory/README.md](../memory/README.md): context compression and offloading.
- [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md): system overview.

## Basic concepts

| Term | Meaning |
|---|---|
| Tool | A LangChain `BaseTool`, normally built with `@tool` from a typed function. Its docstring and signature become the schema the model sees. |
| Registry key | The string a tool is stored under in `tahoepilot.tools.registry._TOOL_REGISTRY`. Defaults to `tool.name`. Agent configs refer to tools by registry key. |
| Model-facing name | `tool.name`, the name the model calls. Two tools can share it as long as they have different registry keys (`@register_tool(key="family.name")`); no built-in tool does this today. |
| Tool scope | A named bucket of tools inside one agent, addressed as `"agent,scope"` (for example `databot,sql`). Every agent has `default`; some have more (`knowledge,catalog`, `databot,fetch`, `databot,sql`). A graph node asks for the scopes it needs. |
| Tool group | A named list of registry keys in `config/tool_groups.toml`, referenced as `"@group"` inside an agent's `[tools]` table (for example `@trino`, `@k8s`). Pure config shorthand. |
| Static tool | A tool registered at import time with `@register_tool` and bound to scopes from config by `ensure_tools_registered()`. |
| Dynamic (MCP) tool | A tool loaded at runtime from an MCP server in `config/mcp.json`, bound to scopes listed in an agent's `[accepted_mcp]` table. Never in the registry. |
| Alternative tool | A "plan B" peer registered with `@alternative_tool`. When a tool fails, the error payload names its alternative in `fallback_tool` so the model can choose to switch. Nothing is called automatically. |

## Design principles

**Tools do not know their agents.** A tool module only registers the tool by name. Which agents and scopes receive it is declared in `config/agents/<agent>.toml` under `[tools]`. Moving a tool between agents, or giving a stage a narrower set, is a config change. `tests/test_agent_tool_scopes.py` fails if any configured name or group member is not registered.

**Read-only by default.** Tools that touch shared infrastructure only read:

- `tahoepilot/tools/data/sql_guard.py` (`validate_read_only_sql`) accepts a single statement whose first token is `SELECT`, `WITH`, `SHOW`, `DESCRIBE`, `DESC` or `EXPLAIN`, after stripping leading comments. For `EXPLAIN [ANALYZE] [VERBOSE] [(options)]` the wrapped statement must also pass, because `EXPLAIN ANALYZE` executes it. `trino_run_query` and `trino_explain` go through it.
- DataHub: `tahoepilot/tools/external/datahub/client.py` (`_assert_query_only`) rejects any GraphQL document containing `mutation` or `subscription` outside comments. Every DataHub tool goes through `execute_graphql`.
- Kubernetes: only `list`/`read`/`get` calls on `CoreV1Api`, `AppsV1Api` and `CustomObjectsApi`.
- S3: only `list_objects_v2`, `get_object` (byte-capped) and `head_object`.
- Hive: only HMS metadata reads (`get_all_tables`, `get_table`).

The exceptions are deliberate and local: the `@code` tools (`bash`, `python_execute`, `str_replace_editor`) run on, and can write to, the machine running the agent. They are assigned only to `swe`, `knowledge`, `databot` and (for `python_execute`) `data_analysis`.

**Workspace.** The code tools work in `[paths].workspace_dir` of `runtime.toml` (default `<data_dir>/workspace`, see `tahoepilot/tools/code/workspace.py`): `bash` and `python_execute` start there, `str_replace_editor` resolves relative paths against it and refuses any path outside it (symlinks are followed before the check), and their subprocesses get a minimal environment (`PATH`, locale, `TERM`, `TZ`; `HOME` and `TMPDIR` set to the workspace), so secrets loaded into the server never reach a command the model writes. This keeps agents out of the project folder by default; it is a guard rail, not a sandbox, because a shell can still `cd` elsewhere. Real isolation needs a separate container or OS user. Stage tools such as `propose_sql` or `commit_cards` write to graph state, not to external systems.

**Errors the model can act on.** A failing tool produces a `StructuredToolError` (type, retryable flag, hint, optional plan-B tool) serialized into the `ToolMessage`, instead of a bare traceback. Transient failures are retried before the model sees them; everything else comes back with guidance such as "list catalogs before retrying".

**Optional extras degrade gracefully.** `tahoepilot.tools.rag` (needs `qdrant_client`, part of the `rag` extra) is imported inside `try/except ImportError` in `tahoepilot/tools/bootstrap.py`; when it is missing, `bind_configured_tools()` logs `agent ... lists tool ..., which is not registered` and skips those names. `kubernetes` and `boto3` are imported lazily inside the tool call, so the tools register but return an error at call time if the extra is not installed. MCP servers that fail to start are logged and skipped.

## How it works

### 1. Registration

`register_tool` in `tahoepilot/tools/registry.py` stores a tool in the module-level registry:

```python
@register_tool                    # key = tool.name
@tool
def trino_explain(sql: str) -> dict: ...

@register_tool(key="family.planning")   # hypothetical: same model-facing name as tahoepilot.tools.plan.planning
@tool
def planning(...): ...

@register_tool(offload=False)     # result always stays in context, whatever its size
@tool
def trino_desc_table(...): ...
```

`offload=False` is for results the agent needs verbatim (table schemas, catalog lookups). Context compression (`tahoepilot/memory/compress.py`, layer 1) never moves them to a file, so the agent does not have to call `read_offloaded_file` to see them. Today: `trino_desc_table`, `hive_desc_table`, `search_metric_catalog`, `fetch_related_models`, `read_offloaded_file`. Per-agent exclusions still go in `[compression] never_offload_tools`.

Registering a different object under an existing key raises `ValueError`; re-registering the same object is a no-op. Modules that build a `TOOLS` list (`tahoepilot/tools/k8s.py`, `tahoepilot/tools/external/datahub/tools.py`) call `register_tool(t)` in a loop instead of decorating.

`registered_tools()` returns a copy of the key → tool map.

### 2. Bootstrap

`tahoepilot.tools.bootstrap.ensure_tools_registered()` runs once per process (guarded by `_REGISTERED`). It:

1. Imports every tool module so their `@register_tool` decorators run: `tahoepilot.agent.specialists.databot.stage_tools`, `tahoepilot.memory.tools`, `tahoepilot.tools.code`, `tahoepilot.tools.data.hive`, `tahoepilot.tools.data.s3`, `tahoepilot.tools.data.trino`, `tahoepilot.tools.external.datahub`, `tahoepilot.tools.k8s`, `tahoepilot.tools.plan`, `tahoepilot.tools.rag` (optional), `tahoepilot.tools.web.search`.
2. Calls `AgentCatalog.bind_configured_tools()`.
3. Calls `AgentCatalog.capture_tools_snapshot()`.

You rarely call it directly: `AgentCatalog.tools_for`, `tools_for_agent`, `tools_for_scopes`, `register_mcp_tools` and `create` all call it first.

### 3. Binding from config

`AgentCatalog.bind_configured_tools()` (`tahoepilot/agent/catalog.py`) iterates over registered agents and reads each `[tools]` table through `config.agent_config.agent_tool_scopes`, which expands `@group` entries from `config/tool_groups.toml` (an unknown group raises `ValueError`). Each registry key is looked up and appended to the `agent,scope` bucket via `AgentCatalog.register_tool`.

Example from `config/agents/databot.toml`:

```toml
[tools]
default = ["@memory", "@code", "@hive", "@trino", "@s3", "@datahub", "propose_sql", ...]
execute = ["trino_run_query"]
sql = ["hive_desc_table", "propose_sql", "trino_desc_table", "trino_explain", "write_gate_reasons"]
```

Agents read their buckets in one of two ways:

- ReAct specialists set a `tool_ids` tuple on the class (for example `knowledge.TOOL_ID_REACT = ("default", "catalog")`); `AgentCatalog._new_agent` flattens those buckets with `flatten_tools`, which de-duplicates by `tool.name`.
- Multi-stage graphs call `AgentCatalog.tools_for(agent, scope)` per node (Databot `fetch`/`sql`/`execute`).
- The lead agent's `delegate` and `write_plan` (`tahoepilot/agent/lead/tools.py`) are not registered: `LeadAgent` builds them per instance, bound to its specialist catalog, and adds them next to its configured scopes (`@memory`).

`tools_for_scopes(agent, scopes)` returns the de-duplicated union of several buckets.

For tests or one-off wiring, `tahoepilot.tools.registry.register_tool_binding("agent,scope", tool, replace=False)` adds a tool to a bucket at runtime. Static assignments belong in config.

### 4. Snapshot and restore

`capture_tools_snapshot()` copies every bucket right after config binding, before any MCP tools are merged. `restore_tools_snapshot()` puts the buckets back to that state; `AgentCatalog.reset_mcp_tools()` (and `tahoepilot.tools.dynamic.reset_dynamic_tool_bindings()`) restores the snapshot and clears the per-agent "MCP already loaded" set. Tests use this to undo fake bindings and MCP merges.

### 5. MCP merge

`AgentCatalog.create(name)` calls `register_mcp_tools(name)` before building the agent. For each `scope = [servers]` entry in the agent's `[accepted_mcp]` table it calls `tahoepilot.tools.dynamic.load_mcp_tools_for_servers`, which:

- expands `"*"` (`config.agent_config.MCP_ALL_SERVERS`) to every server in `mcp.json`;
- loads each server's tools with `tahoepilot.tools.mcp.client.get_tools_for_server` (`MultiServerMCPClient.get_tools(server_name=...)`), so every tool call opens its own session. Tools loaded inside `async with client.session(...)` are bound to a session that closes when the block ends, and every call then fails with `ClosedResourceError`;
- logs and skips a server that fails.

The loaded tools are appended to the scope bucket. If the scope is listed in the agent's `mcp_replace_identifiers` and at least one MCP tool loaded, the bucket is emptied first. `knowledge` uses this: `mcp_replace_identifiers = ["catalog"]` replaces the static `@datahub` tools with the DataHub MCP server's tools when that server is available, and keeps the native tools otherwise.

Current `[accepted_mcp]` tables:

| Agent | Scope → servers |
|---|---|
| `databot` | `default = ["*"]`, `fetch = ["datahub"]` |
| `diagnostic` | `default = ["airflow_tahoe", "airflow_legacy"]` |
| `knowledge` | `default = ["datahub"]`, `catalog = ["datahub"]` (replace) |

MCP loading happens once per agent per process (`_mcp_registered`).

`config/mcp.json` expands `${VAR}` from the environment (`.env`). The two Airflow servers run the local checkout `/Users/jixie/wbox/airflow-mcp-server` (`--directory` in `mcp.json`) and need `AIRFLOW_MCP_AUTH_TOKEN` (Tahoe) and `AIRFLOW_LEGACY_MCP_AUTH_TOKEN` (legacy) in `.env`. Both run with `--safe` (read-only tools only; 41 each). `mcp.json` currently defines only the Airflow servers, so `datahub` entries in `[accepted_mcp]` load nothing and those agents use the native `@datahub` tools.

### 6. Errors, retries and recovery

```
tool raises
  -> ToolNode handle_tool_errors (graph/error_recovery.make_handle_tool_errors)
       StructuredToolError.from_exception(...) -> "=== TOOL ERROR ===\n{json}"  (ToolMessage, status="error")
  -> wrap_tool_call / awrap_tool_call (make_retrying_tool_wrapper / make_async_retrying_tool_wrapper)
       parse payload, .with_failed_tool(name), .against_prior_failures(state["failed_tools"])
       if is_transient: retry (2 attempts total, 0.5 s linear backoff, asyncio.sleep on the async path)
  -> StepActionNode._collect_failed_tools updates state["failed_tools"]
  -> model reads the payload on the next step_reason
```

**Classification.** `tahoepilot.tools.errors.resolve_exception` walks the exception's MRO and uses the first rule registered with `register_exception`. A rule has either a static `error_type` + `retryable`, or a `classifier(exc) -> (ToolErrorType, retryable, message) | None`, or both (classifier wins when it returns a value). Unregistered exceptions map to `UNKNOWN`, not retryable.

**One retry predicate.** `tahoepilot.tools.errors.is_transient_error(error_type, retryable)` is true only for a retryable `CONNECTION` or `TIMEOUT`. `StructuredToolError.is_transient` (tool-call wrapper) and `transient_retry_on` (node `RetryPolicy`) both use it, and `resolve_exception` normalizes `retryable` with it, so a payload never says `retryable: true` for something no layer retries. `register_exception(..., retryable=True)` with any other static `error_type` raises `ValueError`. To make a failure retryable, classify it as `CONNECTION` or `TIMEOUT`.

| Exception | Registered in | Mapping |
|---|---|---|
| `TimeoutError`, `ConnectionError` | `tahoepilot/tools/errors.py` | `TIMEOUT` / `CONNECTION`, retryable |
| `ToolInvocationError` (bad arguments) | `tahoepilot/agent/graph/error_recovery.py` | `SYNTAX`, not retryable |
| Trino client errors | `tahoepilot/tools/data/trino_errors.py` | connection/HTTP 502-504 → `CONNECTION` retryable; `TrinoUserError` by `error_name`; `TrinoExternalError` → `TIMEOUT`/`CONNECTION` retryable; `TrinoInternalError` by `error_name`: cluster churn (`NO_NODES_AVAILABLE`, `REMOTE_TASK_ERROR`, `REMOTE_HOST_GONE`, `SERVER_SHUTTING_DOWN`, `PAGE_TRANSPORT_ERROR`, ...) → `CONNECTION` retryable, `PAGE_TRANSPORT_TIMEOUT` → `TIMEOUT` retryable, anything else (`GENERIC_INTERNAL_ERROR`, `COMPILER_ERROR`, ...) → `UNKNOWN` not retryable; `TrinoQueryError` by message |
| `S3ToolError` | `tahoepilot/tools/data/s3.py` | classifier on message |
| `K8sToolError` | `tahoepilot/tools/k8s.py` | classifier on message |
| `DataHubGraphQLError` | `tahoepilot/tools/external/datahub/client.py` | `TIMEOUT`/`CONNECTION` retryable, else `UNKNOWN` |
| `BashSessionError` | `tahoepilot/tools/code/bash.py` | timeout → `TIMEOUT`, else `UNKNOWN`; never retryable (commands are not idempotent) |
| `PythonExecuteError` | `tahoepilot/tools/code/python_execute.py` | timeout → `TIMEOUT`, else `UNKNOWN`; never retryable |
| `WebSearchError` | `tahoepilot/tools/web/search.py` | carries its own type: URL timeout / HTTP 408 → `TIMEOUT` retryable; network error / HTTP 502-504 → `CONNECTION` retryable; TLS/certificate → `CONNECTION` not retryable; HTTP 401/403 → `PERMISSION`; other → `UNKNOWN` |
| `EditorError`, `PlanToolError` | `tahoepilot/tools/code/str_replace_editor.py`, `tahoepilot/tools/plan.py` | `UNKNOWN`, not retryable |

**Payload.** `StructuredToolError` fields: `error_type` (`connection`, `timeout`, `syntax`, `not_found`, `permission`, `unknown`), `tool`, `message`, `retryable`, `fallback_tool`, `hint`. `is_transient` is `is_transient_error(error_type, retryable)`.

**Raise, don't return, failures.** Only a raised exception goes through classification, retries and `failed_tools`. `bash` (dead or timed-out session), `python_execute` (timeout, no interpreter, OS error) and `web_search` (provider failure, blank query) raise; the `message` keeps the text they used to return. What they still return is a real result: a bash command's stderr (`"Error: ..."`), a Python snippet that exits non-zero (`{"success": false, "observation": ...}`) and an empty web search (`{"success": false, "error": "No web results ..."}`). `trino_explain` intentionally keeps returning `{"ok": false, "error", "sql"}` because the Databot SQL stage reads that contract to decide whether to redraft; a failed explain is an answer about the draft SQL, not a tool outage. `read_offloaded_file` (`tahoepilot/memory/tools.py`) raises `OffloadReadError` (`not_found` or `permission`, never retried).

**Plan B.** `with_failed_tool` looks up `lookup_alternative_tool(tool_name)` and adds `fallback_tool` plus a hint. `against_prior_failures` drops the suggestion, and tells the model to stop and explain, when the alternative already failed this turn. The current pairs are `hive_list_tables` ↔ `trino_list_tables` and `hive_desc_table` ↔ `trino_desc_table`.

**Node-level retry.** In `tahoepilot/agent/graph/builder.py` the `step_action` node also gets `default_tool_retry_policy()` (LangGraph `RetryPolicy`, 2 attempts, `retry_on=transient_retry_on`) and `make_step_action_error_handler()`. This covers exceptions that escape the `ToolNode` itself (a listener hook, a wrapper bug). Once retries are exhausted the handler answers every unanswered tool call of the latest `AIMessage` with a `status="error"` `=== TOOL ERROR ===` `ToolMessage` whose `hint` carries the recovery guidance, adds those tools to `failed_tools`, and routes back to `step_reason`. It does not write a `SystemMessage`: the guidance travels in the tool result the history needs anyway (strict providers reject dangling tool calls), so nothing extra accumulates in the checkpoint. With no pending tool calls it only routes.

**Sync retries and the event loop.** Agents run graphs with `graph.ainvoke`. LangGraph runs sync (`def`) nodes in an executor thread, so the `time.sleep` backoff in `invoke_with_transient_retry` (used by `step_reason`, the Databot nodes and profile refinement) and in the sync tool wrapper blocks only that worker thread, not the loop (`tests/test_error_recovery_regressions.py::test_sync_node_retry_sleep_runs_off_the_event_loop`). `StepActionNode.ainvoke` uses the async wrapper with `asyncio.sleep`. Code that runs on the loop itself should await `ainvoke_with_transient_retry` instead.

## Built-in tool reference

"Agents" lists `agent` for the `default` scope, or `agent (scopes)` when other scopes are involved. Derived from `config/agents/*.toml` and `config/tool_groups.toml` after `ensure_tools_registered()`.

| Registry key | Module | What it does | Read-only | Agents |
|---|---|---|---|---|
| `trino_run_query` | `tahoepilot/tools/data/trino.py` | Run one guarded SQL statement; rows capped by `limit` (default 100) with `truncated` flag | Yes (`sql_guard`) | data_analysis; databot (default, execute); diagnostic |
| `trino_explain` | `tahoepilot/tools/data/trino.py` | `EXPLAIN` a draft query; returns `{"ok": ...}` instead of raising | Yes | data_analysis; databot (default, sql); diagnostic; warehouse |
| `trino_list_catalogs` | `tahoepilot/tools/data/trino.py` | `SHOW CATALOGS` | Yes | data_analysis; databot; diagnostic |
| `trino_list_schemas` | `tahoepilot/tools/data/trino.py` | `SHOW SCHEMAS`, catalog defaults to `[trino].catalog` | Yes | data_analysis; databot; diagnostic; warehouse |
| `trino_list_tables` | `tahoepilot/tools/data/trino.py` | `SHOW TABLES`, defaults from `[trino]`; plan B `hive_list_tables` | Yes | data_analysis; databot; diagnostic; warehouse |
| `trino_desc_table` | `tahoepilot/tools/data/trino.py` | `DESCRIBE` a table; plan B `hive_desc_table` | Yes | data_analysis; databot (default, sql); diagnostic; warehouse |
| `hive_list_tables` | `tahoepilot/tools/data/hive.py` | List tables in a database via HMS; plan B `trino_list_tables` | Yes | data_analysis; databot; diagnostic |
| `hive_desc_table` | `tahoepilot/tools/data/hive.py` | Table metadata via HMS; plan B `trino_desc_table` | Yes | data_analysis; databot (default, sql); diagnostic |
| `s3_list_objects` | `tahoepilot/tools/data/s3.py` | List keys under a prefix (max 1000) | Yes | data_analysis; databot; diagnostic; knowledge |
| `s3_get_object` | `tahoepilot/tools/data/s3.py` | Read an object as UTF-8 text (max 256 KiB) | Yes | data_analysis; databot; diagnostic; knowledge |
| `s3_head_object` | `tahoepilot/tools/data/s3.py` | Object metadata without the body | Yes | data_analysis; databot; diagnostic; knowledge |
| `datahub_list_datasets` | `tahoepilot/tools/external/datahub/tools.py` | Search datasets with metadata and lineage | Yes | databot; knowledge (catalog) |
| `datahub_list_data_jobs` | same | Search data jobs with parent flow | Yes | databot; knowledge (catalog) |
| `datahub_list_data_flows` | same | Search pipelines/DAGs with child jobs | Yes | databot; knowledge (catalog) |
| `datahub_list_glossary_terms` | same | Glossary terms, compacted | Yes | none: no agent lists it; metric questions use `search_metric_catalog` / `find_models_metrics` |
| `datahub_list_charts` | same | Charts with ownership, tags, lineage | Yes | databot; knowledge (catalog) |
| `datahub_list_dashboards` | same | Dashboards with ownership, tags, lineage | Yes | databot; knowledge (catalog) |
| `datahub_list_tags` | same | Tags | Yes | databot; knowledge (catalog) |
| `datahub_list_people` | same | Corp users | Yes | databot; knowledge (catalog) |
| `datahub_list_groups` | same | Corp groups and members | Yes | databot; knowledge (catalog) |
| `datahub_get_dataset_queries` | same | SQL queries recorded for a dataset or column | Yes | databot; knowledge (catalog) |
| `datahub_get_lineage` | same | Upstream/downstream lineage, 1-3 hops | Yes | databot; knowledge (catalog); warehouse |
| `datahub_get_lineage_paths_between` | same | Lineage paths between two entities | Yes | databot; knowledge (catalog); warehouse |
| `datahub_list_schema_fields` | same | Schema fields with keyword filter | Yes | databot; knowledge (catalog) |
| `datahub_get_table_docs` | same | A table's documentation only (URN, owners, description head + section list, column names/types; `section` / `columns` for detail); no glossary terms or tags | Yes | warehouse |
| `datahub_graphql_query` | same | Raw GraphQL escape hatch | Yes (mutation guard) | databot (default, fetch); knowledge (catalog) |
| `k8s_list_namespaces` | `tahoepilot/tools/k8s.py` | Namespaces | Yes | diagnostic; knowledge |
| `k8s_list_pods` | `tahoepilot/tools/k8s.py` | Pods in a namespace (compact) | Yes | diagnostic; knowledge |
| `k8s_get_pod` | `tahoepilot/tools/k8s.py` | One pod summary | Yes | diagnostic; knowledge |
| `k8s_describe_pod` | `tahoepilot/tools/k8s.py` | Pod conditions, containers, events | Yes | diagnostic; knowledge |
| `k8s_get_pod_logs` | `tahoepilot/tools/k8s.py` | Tail container logs (capped) | Yes | diagnostic; knowledge |
| `k8s_list_deployments` | `tahoepilot/tools/k8s.py` | Deployments | Yes | diagnostic; knowledge |
| `k8s_list_events` | `tahoepilot/tools/k8s.py` | Namespace events | Yes | diagnostic; knowledge |
| `k8s_list_custom_objects` | `tahoepilot/tools/k8s.py` | List any CRD objects | Yes | diagnostic; knowledge |
| `k8s_get_custom_object` | `tahoepilot/tools/k8s.py` | One CRD object | Yes | diagnostic; knowledge |
| `k8s_list_spark_applications` | `tahoepilot/tools/k8s.py` | `sparkapplications` (`sparkoperator.k8s.io/v1beta2`) | Yes | diagnostic; knowledge |
| `bash` | `tahoepilot/tools/code/bash.py` | Persistent bash session in the workspace, no secrets in its env (120 s per command) | No | databot; knowledge; swe |
| `python_execute` | `tahoepilot/tools/code/python_execute.py` | Run Python in a subprocess in the workspace, no secrets in its env, stdout/stderr only (30 s default, 120 s max) | No | data_analysis; databot; knowledge; swe |
| `str_replace_editor` | `tahoepilot/tools/code/str_replace_editor.py` | View/create/str_replace/insert/undo_edit on paths inside the workspace (relative or absolute) | No | databot; knowledge; swe |
| `web_search` | `tahoepilot/tools/web/search.py` | Public web search (Tavily, Brave or DuckDuckGo) | Yes | databot; knowledge; swe |
| `planning` | `tahoepilot/tools/plan.py` | In-memory plans: create, update, list, get, mark_step, delete | In-memory | data_analysis; databot; knowledge; swe |
| `fetch_related_jira_tickets` | `tahoepilot/tools/rag/jira.py` | Semantic search over Jira collections in Qdrant | Yes | knowledge |
| `fetch_related_models` | `tahoepilot/tools/rag/dbt_models.py` | Semantic search over dbt models; stages hits in `staging_cards`. Databot's fallback after the metric catalog | Graph state | databot (default, fetch, rag) |
| `search_metric_catalog` | `tahoepilot/tools/data/metrics.py` | Regex search over the curated metric roots / members (`lib/final_root.csv`, `lib/root_member.csv`) | No | databot (default, fetch, rag); warehouse; knowledge |
| `find_models_metrics` | `tahoepilot/tools/data/metrics.py` | Stage the dbt models the metric catalog maps to a `root_id` + `member_id`, with `related_ratio` and the matched metrics on each card. Databot's prompt falls back to `fetch_related_models` when the catalog has no fit; warehouse has no fallback | Graph state | databot (default, fetch, rag); warehouse |
| `describe_metric_models` | `tahoepilot/tools/data/metrics.py` | Read-only twin of `find_models_metrics`: the models the metric catalog maps to a `root_id` + `member_id` and how each computes the metric (table, description, time column, dimensions, matched metric agg / description / evidence). Stages nothing, runs no SQL | No | knowledge |
| `commit_cards` | `tahoepilot/tools/rag/dbt_models.py` | Move staged cards to `committed_cards` | Graph state | databot (default, fetch, rag) |
| `compact_context` | `tahoepilot/memory/tools.py` | Ask the compressor to compact context | Yes | data_analysis; databot; diagnostic; knowledge; lead; swe; warehouse |
| `read_offloaded_file` | `tahoepilot/memory/tools.py` | Read an offloaded tool result back | Yes | data_analysis; databot; diagnostic; knowledge; lead; swe; warehouse |
| `propose_sql` | `tahoepilot/agent/specialists/databot/stage_tools.py` | Write `draft_sql` | Graph state | databot (default, sql) |
| `write_gate_reasons` | same | Reasons for the human gate options | Graph state | databot (default, sql) |
| `record_metric_conflict` | same | Flag a dbt metric that disagrees with a glossary term | Graph state | none (glossary lookups were dropped) |
| `update_card_selection` | same | Replace the selected card subset | Graph state | databot |
| `request_sql_approval` | `tahoepilot/agent/specialists/warehouse/tools.py` (bound per agent, not registered) | Ask the user to review one SELECT/WITH query (interrupt); on approval record its fingerprint in `approved_sql` | Graph state | warehouse |
| `run_sql` | same | Run SQL whose fingerprint was approved; refuses anything else | Yes (`validate_select_sql`) | warehouse |
| `request_sql_regenerate` | same | Ask the SQL stage to redraft | Graph state | databot |

The memory tools are described in [memory/README.md](../memory/README.md); the Databot stage tools in its README. The lead's `delegate` and `write_plan` (bound by `LeadAgent`, not registered) are described in [agent/README.md](../agent/README.md).

### Family notes

- **Trino** keeps DB-API connections per thread and query user (`get_connection`, at most 32 per thread). The service account always authenticates (basic auth, `trino_user()` / `trino_password()`). With `[trino].user_identity = "impersonate"` in `tools.toml` the session user is the run's user (`run_user_id()`: web login username or CLI `-u`), so queries run with that user's Trino permissions; Trino must allow the service user to impersonate. Outside a run, or with `"service"`, queries run as the service user. `source` (default `tahoepilot`) labels the queries in Trino's history.
- **Hive** keeps one `HMSClient` per thread; it has no exception mapping, so HMS failures surface as `unknown`.
- **DataHub** is a package: `client` (HTTP, bearer auth, mutation guard, `DataHubGraphQLError`), `queries` (GraphQL documents), `parsing` (count limits, URN helpers, compaction), `operations` (reads built on `execute_graphql`), `tools` (the `@tool` wrappers, registered on import). In tests, patch `tahoepilot.tools.external.datahub.operations.execute_graphql`.
- **Kubernetes** loads kubeconfig once (`_api_bundle` is `lru_cache`d) on the first call, not at import. Every API error is wrapped in `K8sToolError`.
- **S3** builds one boto3 client (`_s3_client`, `lru_cache`d; `reset_s3_client()` clears it).
- **Web search** picks the provider from `[web_search].provider`, falling back to DuckDuckGo when the Tavily or Brave key is missing. Provider failures raise `WebSearchError` (message `Web search failed: ...`); an empty result set is still returned as `{"success": false, "error": "No web results ...", "results": []}`. Tests can inject a client with `set_web_search_client`.
- **Code execution.** `bash` raises `BashSessionError` when the session died or a command passed 120 s (the session is then replaced on the next call); command stderr is returned as `Error: ...` output. `python_execute` / `run_python` raise `PythonExecuteError` on timeout, missing interpreter or OS error, and return `{"observation", "success"}` otherwise. Neither is auto-retried.
- **`trino_explain`** never raises: it returns `{"ok": false, "error", "sql"}` on guard or Trino errors, which the Databot SQL stage relies on. Use `trino_run_query` for classified, retryable failures.
- **`tahoepilot/tools/loader.py`** holds two older helpers, `load_general_tools()` and `load_knowledge_tools()`, that read from `AgentCatalog`. Only tests use them; new code should call `AgentCatalog` directly.

## Usage

### Connections

Settings live in `config/tools.toml`, validated by `tahoepilot/settings/tool_config.py` (`ToolConfig`). For every credential there is an `*_env` key naming an environment variable; a non-empty environment variable wins over the inline value. `tahoepilot/cli.py` and `tahoepilot/__main__.py` load `.env` from the repo root with `python-dotenv`, so secrets belong in `.env`, not in `tools.toml`.

| Table | Keys | Env vars (defaults) |
|---|---|---|
| `[hive]` | `hms_host`, `hms_port` | none |
| `[trino]` | `host`, `port`, `user`, `user_env`, `password`, `password_env`, `catalog`, `schema_name`, `http_scheme` | values of `user_env` / `password_env` (`TRINO_USER` / `TRINO_PASSWORD` in the shipped file) |
| `[datahub]` | `gms_url`, `token`, `token_env`, `timeout_seconds` | `DATAHUB_GMS_TOKEN` |
| `[k8s]` | `config_file`, `default_namespace` | – (empty `config_file` means the client's default discovery) |
| `[web_search]` | `enabled`, `provider`, `max_results`, `tavily_api_key(_env)`, `brave_api_key(_env)` | `TAVILY_API_KEY`, `BRAVE_API_KEY` |
| `[s3]` | `access_key_id(_env)`, `secret_access_key(_env)`, `region`, `endpoint_url`, `path_style_access` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |

`[hive]` and `[trino]` are required; the other tables have defaults. `tool_config` is loaded once at import of `config.tool_config`. See [config/README.md](../../config/README.md) for the full file reference.

Optional dependencies: `pip install -e '.[k8s]'` for the Kubernetes tools, `pip install -e '.[rag]'` for S3 (`boto3`) and the RAG tools (`qdrant-client`).

### Enabling MCP servers

1. Copy the example and add servers. Both Cursor-style `{"mcpServers": {...}}` and a flat map are accepted; `${VAR}` in any string is expanded from the environment.

   ```bash
   cp config/mcp.json.example config/mcp.json
   ```

   ```json
   {
     "mcpServers": {
       "datahub": {
         "command": "uvx",
         "args": ["mcp-server-datahub"],
         "transport": "stdio",
         "env": {"DATAHUB_GMS_URL": "${DATAHUB_GMS_URL}", "DATAHUB_GMS_TOKEN": "${DATAHUB_GMS_TOKEN}"}
       }
     }
   }
   ```

2. Give an agent scope access in `config/agents/<agent>.toml`:

   ```toml
   [accepted_mcp]
   default = ["datahub"]     # or ["*"] for every server in mcp.json
   ```

   Add `mcp_replace_identifiers = ["<scope>"]` (top level) if the MCP tools should replace that scope's static tools when they load.

3. Start the CLI. `tahoepilot/cli.py` runs `check_mcp_servers()` and prints `format_mcp_startup_lines(...)`, for example `datahub: ok (12 tools)` or `datahub: unavailable (...)`. Stdio server stderr goes to the log file from `config.runtime_config.get_runtime_paths()`, not the terminal.

The config path is fixed: `tahoepilot.tools.mcp.client.mcp_config_path()` returns `config/mcp.json`. If the file is missing, MCP is skipped.

## Adding a tool

1. **Write it** in the right family module (or a new module). Keep the docstring short and model-oriented; it becomes the tool description. Prefer plain `str`/`int` parameters (see pitfalls). Raise a domain exception for failures.

   ```python
   # tahoepilot/tools/data/airflow.py
   from langchain.tools import tool

   from tahoepilot.tools.errors import ToolErrorType, register_exception
   from tahoepilot.tools.registry import register_tool


   class AirflowToolError(RuntimeError):
       """Raised when an Airflow API call fails."""


   def _classify(exc: BaseException):
       text = str(exc).lower()
       if "timed out" in text:
           return ToolErrorType.TIMEOUT, True, str(exc)
       if "404" in text:
           return ToolErrorType.NOT_FOUND, False, str(exc)
       return None  # fall through to UNKNOWN


   register_exception(AirflowToolError, classifier=_classify)


   @register_tool
   @tool
   def airflow_get_dag_run(dag_id: str, run_id: str) -> dict:
       """Read one Airflow DAG run's state and timing (read-only)."""
       ...
   ```

   If the name collides with an existing tool's model-facing name, use `@register_tool(key="family.name")`. To suggest a peer on failure, add `@alternative_tool("peer_tool_name")` directly above `def` (below `@tool`).

2. **Import it in the bootstrap.** Add `import tahoepilot.tools.data.airflow  # noqa: F401` to `ensure_tools_registered()` in `tahoepilot/tools/bootstrap.py`. Wrap it in `try/except ImportError` if it depends on an optional extra.

3. **Assign it** by registry key in `config/agents/<agent>.toml`:

   ```toml
   [tools]
   default = ["@memory", "@k8s", "airflow_get_dag_run"]
   ```

4. **Optionally add a group** in `config/tool_groups.toml` when several agents share a set, then reference it as `"@airflow"`.

5. **Configuration.** If it needs connection settings, add a pydantic model and field to `ToolConfig` in `tahoepilot/settings/tool_config.py`, an `*_env` key for each secret, and a table in `config/tools.toml`.

6. **Test.** Add `tests/test_tools_<family>.py` that calls the tool with the client patched, plus an error-mapping test (`StructuredToolError.from_exception("airflow_get_dag_run", AirflowToolError("timed out"))`). Run:

   ```bash
   .venv/bin/python -m pytest tests/test_agent_tool_scopes.py tests/test_tools_airflow.py
   ```

   `test_agent_tool_scopes.py` catches a missing bootstrap import or a typo in `[tools]`.

## Pitfalls

- **Forgetting the bootstrap import.** `@register_tool` only runs when the module is imported. A configured but unimported tool is skipped with a warning at bind time, not an error.
- **Silent de-duplication by model-facing name.** `AgentCatalog.register_tool` skips a tool whose `name` is already in the bucket, and `flatten_tools` keeps the first tool per name across scopes. Two registry keys with the same model-facing name in one scope keep only the first. An MCP tool with the same name as a static tool in the target scope is dropped unless the scope is in `mcp_replace_identifiers`.
- **`@alternative_tool` is keyed by the Python function name** (`func.__name__`), not `tool.name`. Apply it below `@tool`, and keep the function name equal to the tool name.
- **Errors only become structured when the tool raises.** A tool that catches its own failure and returns text or a dict skips classification, retries and `failed_tools`. Raise a registered exception instead. The one exception on purpose is `trino_explain` (its `{"ok": false}` contract feeds the Databot SQL stage).
- **Retries need a retryable `CONNECTION` or `TIMEOUT`.** `retryable=True` on any other type is normalized to `False` (and rejected for static registrations). Do not classify non-idempotent work (shell, Python snippets) as retryable: the wrapper would run it again.
- **Do not `time.sleep` in `async def` code.** Sync nodes are fine (they run in executor threads under `ainvoke`); on the event loop use `ainvoke_with_transient_retry` / `asyncio.sleep`.
- **MCP loads once per agent per process.** A server that was down when the agent was first created stays missing until restart (or `reset_mcp_tools()` in tests).
- **Runtime bindings after the snapshot are temporary.** `register_tool_binding` changes are wiped by `restore_tools_snapshot()`.
- **Cached clients.** The Kubernetes API bundle and S3 client are built once; the Trino connection and HMS client are cached per thread. Changing `tools.toml` or the AWS key variables after first use has no effect.
- **Strict providers and schemas.** Some OpenAI-compatible providers reject `Literal`/`Union` parameter schemas; `fetch_related_models` takes plain strings and validates in the body for that reason.
- **The SQL guard is keyword-based, not a parser.** It checks the leading keyword (and the statement inside `EXPLAIN`) and blocks multi-statement input and DML/DDL, but treat it as a guard against mistakes, not a security boundary; rely on Trino user permissions for enforcement.
