# Configuration

TahoePilot keeps agent behavior, connection settings, model definitions, local
paths and the metric catalog in TOML/JSON/CSV files, all in this one directory.
The Python modules that parse them into typed objects live in `tahoepilot/settings/`.
Secrets never live here: they come from a separate secrets file or the
environment (see [Environment, `.env` and secrets](#environment-env-and-secrets)).

This directory holds data only, so a deployment replaces it with a single
mount (for example a k8s ConfigMap at `/tahoepilot/config`). Code finds it
through `tahoepilot/settings/paths.py`: `config_dir()` is `$TAHOEPILOT_CONFIG_DIR`, default
`/tahoepilot/config`. A relative value resolves against the project root, so a
dev checkout puts `TAHOEPILOT_CONFIG_DIR=config` in `.env`.

**Rules.**

- Every non-secret setting (paths, hosts, ports, URLs, models, agents) is read
  from a file here. There are no env-var or CLI overrides for them.
- Secrets live in the secrets file (`$TAHOEPILOT_SECRETS_FILE`, `secrets.env`
  locally, a mounted k8s Secret in a cluster) or real env vars. Config files
  name them with `*_env` keys, e.g. `api_key_env = "MiniMax_API_KEY"`, or
  `${VAR}` in `mcp.json`.
- `TAHOEPILOT_CONFIG_DIR` and `TAHOEPILOT_SECRETS_FILE` are the only
  TahoePilot variables in `.env`; it holds no secrets.
- The semantic models are data, not config: `models_dir` in
  `semantic.toml` points to them (default `semantic_models/`, where a git-sync
  volume is mounted).

Related docs: [tahoepilot/agent/README.md](../tahoepilot/agent/README.md) (catalog, agent classes),
[tahoepilot/tools/README.md](../tahoepilot/tools/README.md) (tool registry, MCP),
[tahoepilot/agent/specialists/databot/README.md](../tahoepilot/agent/specialists/databot/README.md)
(databot pipeline and gates),
[tahoepilot/agent/specialists/warehouse/README.md](../tahoepilot/agent/specialists/warehouse/README.md)
(warehouse SQL review), [tahoepilot/rag/README.md](../tahoepilot/rag/README.md) (RAG ingest and
`rag.toml`), [tahoepilot/memory/README.md](../tahoepilot/memory/README.md) (context compression),
[docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).

## Config sources at a glance

| File | Parsed by | Holds |
| --- | --- | --- |
| `config/agents/<name>.toml` | `tahoepilot/settings/agent_config.py` (`AgentConfig` and subclasses) | Identity, `delegate_when` roster line, system prompt, run context, compression, tool scopes, accepted MCP servers |
| `config/agents/base.toml`, `tahoe.toml`, `stage.toml` | same | Shared parents for `extends`; not registered agents |
| `config/tool_groups.toml` | `tool_groups()` in `tahoepilot/settings/agent_config.py` | Named tool sets referenced as `@group` |
| `config/tools.toml` | `tahoepilot/settings/tool_config.py` (`ToolConfig`) | Hive, Trino, DataHub, Kubernetes, web search, S3 connection settings |
| `config/runtime.toml` | `tahoepilot/settings/runtime_config.py` (`RuntimeConfig` → resolved `RuntimePaths`) | Checkpoint DB, profiles, offload store, log paths; default user id |
| `config/semantic.toml` | `tahoepilot/settings/semantic_config.py` (`SemanticConfig` → resolved `SemanticPaths`) | Semantic model dir and metric catalog files |
| `tahoepilot/settings/logging_config.py` | – | File-only logging setup (`configure_logging`) |
| `config/models.toml` | `tahoepilot/models/llm.py` (`ModelConfig`) | Chat model endpoints and the default model |
| `config/rag.toml` | `tahoepilot/rag/config.py` (`RagConfig`) | Qdrant, embedding and rerank settings |
| `config/mcp.json` | `tahoepilot/tools/mcp/client.py` | MCP server definitions |
| `config/server.toml` | `tahoepilot/settings/server_config.py` (`ServerConfig`) | AG-UI backend host/port/path/stream options; Next.js host/port/backend URL |
| `config/metrics/*.csv`, `*.json` | `tahoepilot/tools/data/metrics.py` | Metric catalog: roots, members, model → metric assignments (paths in `semantic.toml`) |
| `.env` (repo root) | `tahoepilot/settings/paths.py`; `"env"` in `langgraph.json` | Non-secret: `TAHOEPILOT_CONFIG_DIR`, `TAHOEPILOT_SECRETS_FILE`, `HF_*` library flags |
| `secrets.env` (`$TAHOEPILOT_SECRETS_FILE`) | `tahoepilot/settings/paths.py` | API keys, passwords, tokens; template `secrets.env.example` |

## Concepts

**Layered config.** Each agent file can inherit from another file in
`config/agents/` with `extends`. The chain used today is
`base.toml` → `tahoe.toml` → specialist file for system prompts, and
`stage.toml` / `tahoe.toml` as parents for run-context tables. Each table type
(`[system_prompt]`, `[run_context]`, `[compression]`) resolves its own chain;
an `extends` in one table does not affect the others.

**Resolved run context.** `[run_context]` holds loop budgets and step prompts.
After `extends` is merged, the agent's `AgentConfig` subclass fills defaults,
coerces types and applies runtime overrides. The result is a plain mapping
(`ReactRunContext`, `DatabotRunContext`, `StageRunContext`
in `tahoepilot/agent/run_context.py`) read by routers and graph builders.

**Design rules.**

- Prompts and loop behavior live in TOML, not in Python. Code holds only
  fallbacks (`tahoepilot/agent/runtime/prompt.py`) and the merge logic.
- Specialists override only what differs: replace the `role` section, `append`
  bullets to `general_rules`, add sections to `layout`.
- Secrets come from the environment. Each connection setting with a secret has a
  `*_env` key that names the variable; the env value wins over the inline value.

## Agent files: `config/agents/*.toml`

`AgentCatalog.register` (`tahoepilot/agent/catalog.py`) loads `config/agents/<name>.toml`
with the class from `AGENT_CONFIG_TYPES`:

| Agent file | Config class | Run context type |
| --- | --- | --- |
| `databot.toml` | `DatabotAgentConfig` | `DatabotRunContext` |
| `lead.toml` | `LeadAgentConfig` | `ReactRunContext` (plus `max_delegations`) |
| `warehouse.toml` | `WarehouseAgentConfig` | `ReactRunContext` (plus `sql_gate_enabled`, `result_row_limit`) |
| `knowledge.toml`, `diagnostic.toml`, `data_analysis.toml`, `swe.toml` | `ReactAgentConfig` | `ReactRunContext` |
| any other name | `AgentConfig` | untyped mapping |

### Top-level keys

| Key | Type | Meaning |
| --- | --- | --- |
| `name` | string | Agent name; defaults to the file stem |
| `description` | string | Short description (catalog listing; the lead's roster falls back to it) |
| `delegate_when` | string | When the lead should delegate to this agent. `LeadSystemPrompt` (`tahoepilot/agent/lead/prompt.py`) lists every agent that is not a front agent as one roster line with this text |
| `front` | bool (default `false`) | A front agent: the user talks to it directly (own AG-UI endpoint and web page). `delegatable_agents()` leaves it out of the lead's roster and `delegate` refuses it. Set in `lead.toml` and `databot.toml` |
| `mcp_replace_identifiers` | list of strings | Tool scopes whose built-in tools are dropped when MCP tools load for that scope (knowledge uses `["catalog"]`, so DataHub MCP replaces the native `@datahub` tools) |

### `[system_prompt]`

| Key | Meaning |
| --- | --- |
| `extends` | Parent file stem in `config/agents/` (`"tahoe"`, `"base"`) |
| `name` | Optional prompt name; defaults to the agent name |
| `layout` | Ordered list of section ids to render |
| `sections.<id>.title` | Heading; defaults to the id with underscores as spaces, capitalized (`data_answer_requirements` → `Data answer requirements`) |
| `sections.<id>.text` | Section body |
| `sections.<id>.append` | List of strings added as `- ` bullet lines after the inherited text |

Resolution (`_merged_prompt_table`, `_merge_prompt_tables`, `_merge_section_tables`):

1. Read the child's `[system_prompt]`. If it has `extends`, resolve the parent
   file first (recursively). A parent without `[system_prompt]` raises
   `ValueError: ... is missing [system_prompt]`.
2. `layout`: the child's list replaces the parent's whenever the key is present
   (an empty list too). Otherwise the parent layout is kept.
3. Sections merge by id. If both parent and child define the id:
   - child `title` replaces the parent title;
   - child `text` replaces the parent text;
   - each `append` item has its whitespace collapsed to single spaces (a
     multi-line TOML string becomes one line), is prefixed with `- `, and is
     added on a new line after the (possibly replaced) text.
   If only one side defines the id, that table is used as is.
4. Other keys from the child overwrite the parent; `extends` is dropped.
5. `PromptSpec.from_raw` checks that every `layout` id exists in `sections`;
   a missing id raises `ValueError: ... layout references unknown sections`.
   Sections not in `layout` are kept but never rendered.

Cycles are detected per chain: a file that appears twice raises
`ValueError: circular system_prompt extends: a -> b -> a`.

Rendering (`SystemPromptAssembler.build` in `tahoepilot/agent/prompt.py`) emits
`Title:\nbody` blocks separated by blank lines, skips sections with empty text,
and inserts a `User profile` block after the first section when the user
profile has data (see [memory/README.md](../tahoepilot/memory/README.md#user-profiles)).
`LeadSystemPrompt` (`tahoepilot/agent/lead/prompt.py`) appends the specialist roster
(one line per non-front agent, from `delegate_when`) after the rendered `lead.toml` prompt.

Example: the effective Databot `general_rules` is base's text followed by one
bullet from `databot.toml`; its `layout` comes from `databot.toml`, while
`output` text comes from `tahoe.toml` and `session_layout` from `base.toml`.

### `[run_context]`

`[run_context]` is read only when the file has the table. Resolution
(`_merged_run_context_table`, `_resolve_run_context_mapping`):

1. Pop `extends` from the table; if set, resolve that file's top-level
   `[run_context]` and overlay the child keys on top (`{**parent, **child}`,
   shallow).
2. Recurse into every nested table. A nested table may carry its own
   `extends`, which always refers to the parent file's *top-level*
   `[run_context]` (databot's `[run_context.react.fetch] extends = "tahoe"`).
3. Pass the merged mapping and any runtime overrides to the subclass
   `resolve_run_context`, which applies defaults and types.

Cycles raise `ValueError: circular run_context extends: ...`.

Keys and defaults by class:

| Class | Key | Default | Notes |
| --- | --- | --- | --- |
| `ReactAgentConfig` | `max_tool_calls` | 10 | Tool-call batches per turn; at the limit the model answers once more without tools, using `tool_budget_exhausted_prompt` |
| | `next_step` | `NEXT_STEP_PROMPT` | Per-step instruction |
| | `tool_budget_exhausted_prompt` | `TOOL_BUDGET_EXHAUSTED_PROMPT` | |
| | `refine_user_profile_prompt` | `REFINE_USER_PROFILE_PROMPT` | Empty string disables end-of-turn profile refinement |
| `StageReactConfig` (databot layers) | the `ReactAgentConfig` keys, plus: | | |
| | `max_idle_reason_rounds` | 1 | Plain-text replies retried while the stage predicate is unmet (`tahoepilot/agent/router.py`) |
| | `idle_nudge_prompt` | `""` | Sent on those retries |
| | `fetch_instruction`, `sql_instruction` | – | Kept only when present (databot stage openers) |
| `LeadAgentConfig` | the `ReactAgentConfig` keys, plus: | | `lead.toml` sets `max_tool_calls = 12` |
| | `max_delegations` | 6 | Specialist runs (`delegate` calls) per turn; at the limit `delegate` tells the lead to answer with what it has |
| `WarehouseAgentConfig` | the `ReactAgentConfig` keys, plus: | | `warehouse.toml` sets `max_tool_calls = 24` |
| | `gates.sql_enabled` (resolved as `sql_gate_enabled`) | `true` | Human SQL review in `request_sql_approval`; `false` approves automatically, but `run_sql` still runs only SQL that went through it |
| | `result_row_limit` | 200 | Rows one `run_sql` call fetches (the model sees a preview of at most 50) |
| `DatabotAgentConfig` | `max_tool_calls`, `max_idle_reason_rounds` | 10, 1 | Outer pipeline (via `extends = "stage"`) |
| | `react.fetch`, `react.sql` | – | Each resolved with `StageReactConfig.resolve_run_context` |
| | `gates.cards_enabled`, `gates.sql_enabled` | `true` | `false` auto-approves and skips the human pause |
| | `prepare_cards_for_gate_prompt`, `turn_summary_system_prompt` | `""` | One-shot node prompts; `node_prompt_from` raises `KeyError` if still empty |

Pure ReAct specialists end the turn on their first plain-text reply, so
idle-retry keys do nothing for them and `ReactAgentConfig` drops them. Prompt
defaults are in `tahoepilot/agent/runtime/prompt.py`. Gate behavior is described in
[tahoepilot/agent/specialists/databot/README.md](../tahoepilot/agent/specialists/databot/README.md).

**Runtime overrides.** `AgentCatalogSettings.for_agent(..., **run_overrides)`
and `AgentCatalog.create(..., run_context={...})` overlay values after the file
is resolved (`AgentConfig.with_run_overrides`). Only keys the subclass knows are
accepted (for ReAct: the default keys above; for Databot: `max_tool_calls`,
`max_idle_reason_rounds`, nested `react` and `gates` mappings, and the two node
prompts; for the lead: the ReAct keys and `max_delegations`; for warehouse: the
ReAct keys, `sql_gate_enabled` and `result_row_limit`). `None` values are ignored.

### `[compression]`

Thresholds for context compression; the fields are documented in
[memory/README.md](../tahoepilot/memory/README.md#configuration). Resolution
(`_merged_compression_table`):

| Case | Result |
| --- | --- |
| File has no `[compression]` table | Inherit `base.toml`'s table |
| Table with `extends = "<file>"` | Resolve that file (which itself falls back to `base.toml`), then overlay child keys |
| Table without `extends` (not `base.toml`) | Overlay child keys onto `base.toml` |
| `base.toml` | Used as is |

Merging is a flat key overlay; list keys (`write_tools`, `never_offload_tools`)
are replaced, not concatenated. `offload_dir` and the turn-boundary marker are
not file keys. `AgentCatalogSettings.compression_config` (or
`compression_config=` on `AgentCatalog.create`) replaces the file table entirely.

### `[tools]`

Maps a tool scope id to built-in tool names. Read by `agent_tool_scopes(name)`:

- `"@group"` expands to the list in `config/tool_groups.toml`; an unknown group
  raises `ValueError`.
- Duplicates are dropped, keeping the first position.
- `default` is the agent's main scope; other ids (`fetch`, `sql`, `execute`,
  `rag`, `catalog`) are looked up as `"<agent>,<scope>"` by the code that
  builds each subgraph.
- The lead's `delegate` and `write_plan` tools are not listed here: `LeadAgent`
  binds them itself, next to the `[tools]` scopes (`@memory` in `lead.toml`).
- Warehouse's `request_sql_approval` and `run_sql` are bound by
  `WarehouseAgent`; it also drops `trino_run_query` (and any configured tool
  with a gate tool's name) from its scopes, so SQL runs only after review.

How tools register by name is covered in [tahoepilot/tools/README.md](../tahoepilot/tools/README.md).

### `[accepted_mcp]`

Maps a tool scope id to MCP server names from `config/mcp.json`. A string is
treated as a one-element list; `"*"` (`MCP_ALL_SERVERS`) means every configured
server. `AgentCatalog.register_mcp_tools` loads the tools once per agent and adds
them under `"<agent>,<scope>"`. Servers that fail to load are logged and skipped.

## Tool groups: `config/tool_groups.toml`

Top-level keys are group names, values are tool-name lists: `memory`, `code`,
`hive`, `trino`, `s3`, `k8s`, `datahub`. Add a group here and reference it as
`"@name"` from any `[tools]` table.

## Connections: `config/tools.toml`

Loaded once at import of `tahoepilot/settings/tool_config.py` into `tool_config`. The file is
required, and `[hive]` and `[trino]` must be present.

| Table | Keys | Secret env variable (default name) |
| --- | --- | --- |
| `[hive]` | `hms_host`, `hms_port` | – |
| `[trino]` | `host`, `port`, `user`, `user_env`, `password`, `password_env`, `catalog`, `schema_name`, `http_scheme`, `request_timeout_seconds`, `max_attempts` | `TRINO_USER`, `TRINO_PASSWORD` (as set in tools.toml; `trino_user()` / `trino_password()` raise if neither is set) |
| `[datahub]` | `gms_url`, `token`, `token_env`, `timeout_seconds` | `DATAHUB_GMS_TOKEN` |
| `[k8s]` | `config_file`, `default_namespace` | – (empty `config_file` means the client's default discovery) |
| `[web_search]` | `enabled`, `provider`, `max_results`, `tavily_api_key`, `tavily_api_key_env`, `brave_api_key`, `brave_api_key_env` | `TAVILY_API_KEY`, `BRAVE_API_KEY` |
| `[s3]` | `access_key_id(_env)`, `secret_access_key(_env)`, `region`, `endpoint_url`, `path_style_access` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |

Only secrets have an env lookup: the resolvers (`trino_user`, `trino_password`,
`datahub_token`, `web_search_api_key`, `s3_access_key_id`,
`s3_secret_access_key`) read the variable named by the `*_env` key first and
fall back to the inline value; set a `*_env` key to empty to disable it. Every
other key (`gms_url`, `config_file`, `region`, `endpoint_url`, ...) comes from
the file only. The file also has a `[spark]` table that `ToolConfig` does not read.

## Runtime paths: `config/runtime.toml`

`[paths]` keys (`tahoepilot/settings/runtime_config.py`); `runtime.toml` is the only source:

| Key | Default |
| --- | --- |
| `data_dir` | `.local` (in k8s, the PVC mount such as `/data`) |
| `checkpoint_db` | `<data_dir>/checkpoints.sqlite` |
| `profiles_dir` | `<data_dir>/profiles` |
| `offload_dir` | `<data_dir>/offload_store` |
| `logs_dir` | `<data_dir>/logs` |
| `log_file` | `<logs_dir>/tahoepilot.log` |
| `workspace_dir` | `<data_dir>/workspace`: working folder of `bash`, `python_execute`, `str_replace_editor` (see [tahoepilot/tools/README.md](../tahoepilot/tools/README.md)) |
| `run_dir` | `<data_dir>/run`: PID files and logs of `scripts/dev.sh start` (and eval logs) |
| `langgraph_dir` | `<data_dir>/langgraph`: working folder of `langgraph dev` (`scripts/dev.sh`); its store is `<langgraph_dir>/.langgraph_api` |
| `rag_jobs_dir` | `<data_dir>/rag-jobs`: where `python -m tahoepilot.rag plan|run --tasks <bare file name>` writes and reads task lists and checkpoints |

An empty value takes the default. Relative paths resolve against the project
root; `~` is expanded. Results are cached by `get_runtime_paths()`; call
`reset_runtime_paths_cache()` after changing the config dir in tests. `ensure_runtime_dirs()` creates the directories. Without `runtime.toml` the defaults apply.

In a dev checkout everything written at run time lives under `.local/`; the project tree holds only code and config. The dev `runtime.toml` spells out each path above under `.local/`. The local Qdrant is the one runtime folder not read from config: run its binary from `.local/qdrant/` (its `storage/` and `snapshots/` land next to it), and `docker/qdrant/docker-compose.yml` mounts `.local/qdrant/compose_storage`. `.local/` is gitignored and left out of the Docker image.

`[user].default_id` is the profile user id when none is given (`-u` on the
CLI, or the `[agui].user_header` request header on the web) and the thread has
no stored id; empty means the OS user name.

Naming: `RuntimeConfig` / `PathsConfig` / `UserConfig` mirror the file as
written; `RuntimePaths` is the resolved result (absolute paths, defaults filled
in) that callers use.

## Metric catalog: `config/semantic.toml`

Top-level keys, parsed by `get_semantic_config()` and resolved by
`get_semantic_paths()` in `tahoepilot/settings/semantic_config.py`; read by
`tahoepilot/tools/data/metrics.py`. Relative paths resolve against the project root.

| Key | Default |
| --- | --- |
| `models_dir` | `semantic_models` (`<db>/<model>.{yml,sql}`; mount the git-sync volume here) |
| `metric_root` | `config/metrics/final_root.csv` |
| `metric_member` | `config/metrics/root_member.csv` |
| `metric_assign` | `config/metrics/root_member_assign.json` |

The metric catalog caches what it loads per process, so a change needs a
restart.

## Servers: `config/server.toml`

`tahoepilot/settings/server_config.py` (`get_server_config()`):

| Table | Keys | Used by |
| --- | --- | --- |
| `[agui]` | `host`, `port`, `path` (base path, agents at `<path>/<name>`), `subagent_visibility` (`inline` / `hidden` / `attributed`), `emit_raw_events`, `user_header` (request header naming the visitor) | `tahoepilot/server/app.py` (`path` and stream options always; `host`/`port` for the standalone `python -m tahoepilot.server.app`) |
| `[auth]` | `enabled`, `skip_password_check` (development only: accept any password, no LDAP), `ldap_url`, `user_base_dn` + `user_search_filter` + `bind_user` + `bind_password_env` (search-then-bind with a service account; default secret `LDAP_BIND_PASSWORD`) or `user_dn_template` (`{username}` is replaced), `start_tls`, `timeout_seconds`, `session_hours`, `session_secret_env` (default `TAHOEPILOT_SESSION_SECRET`, in the secrets file) | `tahoepilot/server/auth.py` (login page: LDAP bind, signed session token), `tahoepilot/settings/server_config.py` (`TAHOEPILOT_AUTH_ENABLED` for Next.js) |
| `[frontend]` | `host`, `port`, `backend_url` | `docker/entrypoint.sh` exports them as `HOSTNAME`, `PORT`, `AGUI_BACKEND_URL` for Next.js (`python -m tahoepilot.settings.server_config`) |

`langgraph dev` (`scripts/dev.sh`) still picks its own port (8000) and `next
dev` reads `AGUI_BACKEND_URL` from its environment.

## Logging: `tahoepilot/settings/logging_config.py`

`configure_logging(log_file=None, verbose=False)` installs a single file handler
on the root logger (no console output) at `RuntimePaths.log_file`, `INFO` level or
`DEBUG` with `verbose=True` (`-v` on the CLI). MCP stdio server stderr is
redirected to the same file by `tahoepilot/tools/mcp/client.py`.

## Models: `config/models.toml`

| Key | Meaning |
| --- | --- |
| `[basic].default_model_name` | Model used by the CLI, AG-UI server and LangGraph graphs; must exist under `[model.*]` |
| `[model."<name>"]` | One model; `<name>` is passed to `init_chat_model` as the model id |
| `base_url`, `provider` | Required; `provider` is a LangChain provider id (all entries use `openai`-compatible endpoints) |
| `api_key_env` / `api_key` | Env variable checked first, then the inline value |
| `temperature`, `max_tokens`, `timeout_seconds`, `max_retries` | Defaults 0.5, 8192, 120, 3 |
| `[model."<name>".kwargs]` | Extra keyword arguments to `init_chat_model` (e.g. `kwargs.extra_body`) |

API key variables referenced today: `MiniMax_API_KEY`, `GLM_API_KEY`,
`OpenRouter_API_KEY`, `SenseNova_API_KEY`. Local Ollama entries use an inline
placeholder key.

`get_default_model()` builds the model lazily. If the default cannot be built
(for example, its key is missing) it tries every other model in file order and
raises `RuntimeError` listing each failure only if none works.
`get_model_by_name(name)` builds a specific model.

## RAG: `config/rag.toml`

Tables `[qdrant]`, `[embedding]`, `[rerank]`, `[local_models]` (weight cache
`dir`, `hf_endpoint`, and `startup`, the Docker entrypoint's policy when a
model is missing), `[tika]` (`endpoint`), parsed by `get_rag_config()` in
`tahoepilot/rag/config.py`. The only env lookup is the Qdrant API key (`api_key_env`,
default `QDRANT_API_KEY`). Details:
[tahoepilot/rag/README.md](../tahoepilot/rag/README.md).

## MCP servers: `config/mcp.json`

Cursor-style `{"mcpServers": {"<name>": {...}}}` or a flat map, as accepted by
`MultiServerMCPClient`. The file is not tracked (it holds machine-specific paths
and URLs), so create it yourself; a missing file means no MCP tools. A stdio server:

```json
{
  "mcpServers": {
    "example": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"],
      "transport": "stdio"
    }
  }
}
```

`${VAR}` in any string is replaced from the environment at load time (unknown
variables stay literal), so tokens belong in the secrets file. Server names are what
`[accepted_mcp]` refers to.

## Environment, `.env` and secrets

`tahoepilot/settings/paths.py` loads two files on import, so every entry point (CLI,
`tahoepilot/server/app.py`, evals, RAG jobs) sees them before reading any config file.
Real environment variables always win; `scripts/dev.sh` sources both files the
same way, and `langgraph dev` also loads `.env` via `"env": ".env"`.

| File | Holds | Location |
| --- | --- | --- |
| `.env` | Non-secret only: `TAHOEPILOT_CONFIG_DIR` (`config` for a checkout), `TAHOEPILOT_SECRETS_FILE` (`secrets.env` for a checkout), library flags such as `HF_HUB_DISABLE_XET` | `<project root>/.env`; not in the image |
| secrets file | Model API keys (`api_key_env` in `models.toml`), `TRINO_PASSWORD`, `TRINO_USER`, `DATAHUB_GMS_TOKEN`, `TAVILY_API_KEY`, `BRAVE_API_KEY`, AWS keys, `QDRANT_API_KEY`, MCP tokens (`${VAR}` in `mcp.json`), `LANGSMITH_API_KEY` | `$TAHOEPILOT_SECRETS_FILE`, default `/tahoepilot/secrets/secrets.env`; relative values from the project root |

Both are git-ignored; `secrets.env.example` lists every secret name. The
secrets file is optional: in k8s either mount a Secret with a `secrets.env` key
at `/tahoepilot/secrets`, or pass the same names as env vars (`envFrom`).

## Recipes

**Change a prompt section for one agent.** Override the section in the agent
file; keep the rest inherited:

```toml
# config/agents/swe.toml
[system_prompt.sections.output]
title = "Output"
text = """
Reply with a short summary of changed files, then the commands to verify.
"""
```

**Add rules without copying the parent text.** Use `append` on an inherited
section:

```toml
[system_prompt.sections.general_rules]
append = ["Prefer UTC timestamps in answers."]
```

**Add a new section.** Define it and list it in `layout` (the child `layout`
replaces the parent's, so repeat the inherited ids):

```toml
[system_prompt]
extends = "tahoe"
layout = ["role", "general_rules", "glossary", "output", "session_layout"]

[system_prompt.sections.glossary]
text = "- GMV means gross merchandise value."
```

**Raise `max_tool_calls`.** For a ReAct specialist, add
`[run_context] max_tool_calls = 40` to its file. Note that `tahoepilot/cli.py`,
`tahoepilot/server/app.py` and `tahoepilot/server/graphs.py` pass `max_tool_calls=30` as a run
override, which wins over the file; change the call site too. The override
reaches only the agent the entry point creates (the lead by default);
specialists delegated by the lead keep their file budgets. For databot
stages, set `max_tool_calls` under `[run_context.react.fetch]` or
`[run_context.react.sql]` (the override above only reaches the outer value).

**Disable a databot gate.** In `databot.toml`:
`[run_context.gates] sql_enabled = false`. The same key in `warehouse.toml`
turns off warehouse's human SQL review (approval becomes automatic).

**Add a model.** Add a `[model."<id>"]` table with `base_url`, `provider` and
`api_key_env`, put the key in the secrets file, and set `[basic].default_model_name` to
use it everywhere.

**Point at a different Trino.** Edit `host`, `port`, `user`, `catalog`,
`schema_name` and `http_scheme` under `[trino]`; put the password in the
variable named by `password_env`.

**Move runtime data.** Set `[paths].data_dir = "/data/tahoepilot"` in
`runtime.toml`; it moves everything that has no explicit path.

**Check the resolved config.**

```bash
.venv/bin/python -c "
from config.agent_config import agent_config_path, agent_config_type
cfg = agent_config_type('databot')(agent_config_path('databot'))
print(cfg.system_prompt.layout)
print(cfg.run_context['gates'], cfg.compression)
"
.venv/bin/python -m pytest -q tests/test_agent_config.py tests/test_tool_config.py
```

## Pitfalls

- **`append` on a section the parent lacks is ignored.** Without a parent
  section there is nothing to merge, the raw table is used, and
  `PromptSection` reads only `title` and `text`. The section renders empty and
  is skipped.
- **`layout` is all or nothing.** Setting it in a child replaces the parent
  list; forgetting `session_layout` or `output` silently drops them.
- **Multi-line `append` items become one line.** Use `text` when a section
  needs its own line structure.
- **Prompt edits do not reach running sessions.** The system message is written
  into the checkpoint on a session's first turn only. Start a new session
  (`-s` with a new id) to see changes.
- **`[run_context]` is not inherited implicitly.** A specialist without the
  table does not read `tahoe.toml`'s values; it gets code defaults (equal today).
  `[compression]`, by contrast, does inherit `base.toml` implicitly.
- **`extends` merges are shallow.** A child `[run_context]` key that is a table
  replaces the parent table of the same name, except where the class merges
  nested `react`/`gates` overrides itself.
- **Unknown run-context keys are dropped** by the typed subclasses; only
  `AgentConfig` keeps arbitrary keys.
- **Entry points override `max_tool_calls`** to 30 (see recipes).
- **`tools.toml` is read at import.** A missing file or missing `[hive]`/
  `[trino]` table breaks every import of `config.tool_config`.
- **Env wins over TOML** for every `*_env` key, including paths. A stale
  exported variable silently overrides an edited file.
