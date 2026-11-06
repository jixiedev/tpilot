# Configuration

TahoePilot keeps agent behavior, connection settings, model definitions and local
paths in TOML/JSON files. Python modules next to each file parse it into typed
objects. Secrets never need to live in a file: every credential has an
environment-variable override, and `.env` is loaded at startup.

Related docs: [agent/README.md](../agent/README.md) (catalog, agent classes),
[tools/README.md](../tools/README.md) (tool registry, MCP),
[agent/specialists/databot/README.md](../agent/specialists/databot/README.md)
(databot pipeline and gates), [rag/README.md](../rag/README.md) (RAG ingest and
`rag.toml`), [memory/README.md](../memory/README.md) (context compression),
[docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).

## Config sources at a glance

| File | Parsed by | Holds |
| --- | --- | --- |
| `config/agents/<name>.toml` | `config/agent_config.py` (`AgentConfig` and subclasses) | Identity, intent label, system prompt, run context, compression, tool scopes, accepted MCP servers |
| `config/agents/base.toml`, `tahoe.toml`, `stage.toml` | same | Shared parents for `extends`; not registered agents |
| `config/tool_groups.toml` | `tool_groups()` in `config/agent_config.py` | Named tool sets referenced as `@group` |
| `config/tools.toml` | `config/tool_config.py` (`ToolConfig`) | Hive, Trino, DataHub, Kubernetes, web search, S3 connection settings |
| `config/local.toml` | `config/local_config.py` (`LocalConfig`, `LocalPaths`) | Checkpoint DB, profiles, offload store, log paths |
| `config/logging_config.py` | – | File-only logging setup (`configure_logging`) |
| `models/models.toml` | `models/llm.py` (`ModelConfig`) | Chat model endpoints and the default model |
| `config/rag.toml` | `rag/config.py` (`RagConfig`) | Qdrant, embedding and rerank settings |
| `tools/mcp/mcp.json` | `tools/mcp/client.py` | MCP server definitions |
| `.env` | `python-dotenv` in `main.py` / `cli.py`; `"env"` in `langgraph.json` | Secrets and environment overrides |

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
(`ReactRunContext`, `DatabotRunContext`, `PlanRunContext`, `HandoffRunContext`
in `agent/run_context.py`) read by routers and graph builders.

**Design rules.**

- Prompts and loop behavior live in TOML, not in Python. Code holds only
  fallbacks (`agent/runtime/prompt.py`) and the merge logic.
- Specialists override only what differs: replace the `role` section, `append`
  bullets to `general_rules`, add sections to `layout`.
- Secrets come from the environment. Each connection setting with a secret has a
  `*_env` key that names the variable; the env value wins over the inline value.

## Agent files: `config/agents/*.toml`

`AgentCatalog.register` (`agent/catalog.py`) loads `config/agents/<name>.toml`
with the class from `AGENT_CONFIG_TYPES`:

| Agent file | Config class | Run context type |
| --- | --- | --- |
| `databot.toml` | `DatabotAgentConfig` | `DatabotRunContext` |
| `plan.toml` | `PlanAgentConfig` | `PlanRunContext` |
| `intent.toml` | `IntentAgentConfig` | `HandoffRunContext` |
| `knowledge.toml`, `diagnostic.toml`, `data_analysis.toml`, `swe.toml` | `ReactAgentConfig` | `ReactRunContext` |
| any other name | `AgentConfig` | untyped mapping |

### Top-level keys

| Key | Type | Meaning |
| --- | --- | --- |
| `name` | string | Agent name; defaults to the file stem |
| `description` | string | Short description (catalog listing, intent fallback text) |
| `intention` | string | Intent label routed to this agent (e.g. `DATA`, `KNOWLEDGE`, `PLAN`); the classifier picks exactly one label per request. Upper-cased; two agents with the same label raise `ValueError` in `AgentCatalog.intention_routes` |
| `intention_description` | string | Text shown to the intent classifier for this label; falls back to `description` |
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

Rendering (`SystemPromptAssembler.build` in `agent/prompt.py`) emits
`Title:\nbody` blocks separated by blank lines, skips sections with empty text,
and inserts a `User profile` block after the first section when the user
profile has data (see [memory/README.md](../memory/README.md#user-profiles)).
`IntentSystemPrompt` (`agent/intent/prompt.py`) also substitutes `{intentions}`,
`{prefer}`, `{labels}`, `{choices}` and `{threshold}` in `intent.toml` text.

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
| | `max_idle_reason_rounds` | 1 | Plain-text replies retried while the stage predicate is unmet (`agent/router.py`) |
| | `idle_nudge_prompt` | `""` | Sent on those retries |
| | `fetch_instruction`, `sql_instruction` | – | Kept only when present (databot stage openers) |
| `PlanAgentConfig` | `max_tool_calls` | – (code fallback 6) | Tool-call batches per stage run (create, each execute round, adjust); kept only when set |
| | `max_subagent_rounds` | – (code fallback 8) | Execute/adjust cycles per turn; kept only when set |
| | `max_idle_reason_rounds` | 1 | Idle retries of the create stage |
| `DatabotAgentConfig` | `max_tool_calls`, `max_idle_reason_rounds` | 10, 1 | Outer pipeline (via `extends = "stage"`) |
| | `react.fetch`, `react.sql` | – | Each resolved with `StageReactConfig.resolve_run_context` |
| | `gates.cards_enabled`, `gates.sql_enabled` | `true` | `false` auto-approves and skips the human pause |
| | `prepare_cards_for_gate_prompt`, `turn_summary_system_prompt` | `""` | One-shot node prompts; `node_prompt_from` raises `KeyError` if still empty |
| `IntentAgentConfig` | `max_tool_calls` | 30 | Budget handed to delegated specialists |
| | `clarification_threshold` | 0.85 | Below this confidence the router asks a question |
| | `max_clarification_rounds` | 2 | |

Pure ReAct specialists end the turn on their first plain-text reply, so
idle-retry keys do nothing for them and `ReactAgentConfig` drops them. Prompt
defaults are in `agent/runtime/prompt.py`. Gate behavior is described in
[agent/specialists/databot/README.md](../agent/specialists/databot/README.md).

**Runtime overrides.** `AgentCatalogSettings.for_agent(..., **run_overrides)`
and `AgentCatalog.create(..., run_context={...})` overlay values after the file
is resolved (`AgentConfig.with_run_overrides`). Only keys the subclass knows are
accepted (for ReAct: the default keys above; for Databot: `max_tool_calls`,
`max_idle_reason_rounds`, nested `react` and `gates` mappings, and the two node
prompts; for Plan: `max_tool_calls`, `max_subagent_rounds`,
`max_idle_reason_rounds`). `None` values are ignored.

### `[compression]`

Thresholds for context compression; the fields are documented in
[memory/README.md](../memory/README.md#configuration). Resolution
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
  `rag`, `create`, `adjust`, `subagent`, `catalog`) are looked up as
  `"<agent>,<scope>"` by the code that builds each subgraph.

How tools register by name is covered in [tools/README.md](../tools/README.md).

### `[accepted_mcp]`

Maps a tool scope id to MCP server names from `tools/mcp/mcp.json`. A string is
treated as a one-element list; `"*"` (`MCP_ALL_SERVERS`) means every configured
server. `AgentCatalog.register_mcp_tools` loads the tools once per agent and adds
them under `"<agent>,<scope>"`. Servers that fail to load are logged and skipped.

## Tool groups: `config/tool_groups.toml`

Top-level keys are group names, values are tool-name lists: `memory`, `code`,
`hive`, `trino`, `s3`, `k8s`, `datahub`. Add a group here and reference it as
`"@name"` from any `[tools]` table.

## Connections: `config/tools.toml`

Loaded once at import of `config/tool_config.py` into `tool_config`. The file is
required, and `[hive]` and `[trino]` must be present.

| Table | Keys | Env override (default variable) |
| --- | --- | --- |
| `[hive]` | `hms_host`, `hms_port` | – |
| `[trino]` | `host`, `port`, `user`, `password`, `password_env`, `catalog`, `schema_name`, `http_scheme` | `password_env` (no default; `trino_password()` raises if neither is set) |
| `[datahub]` | `gms_url`, `gms_url_env`, `token`, `token_env`, `timeout_seconds` | `DATAHUB_GMS_URL`, `DATAHUB_GMS_TOKEN` |
| `[k8s]` | `config_file`, `config_file_env`, `default_namespace` | `KUBECONFIG` (empty means default kubeconfig discovery) |
| `[web_search]` | `enabled`, `provider`, `max_results`, `tavily_api_key`, `tavily_api_key_env`, `brave_api_key`, `brave_api_key_env` | `TAVILY_API_KEY`, `BRAVE_API_KEY` |
| `[s3]` | `access_key_id`, `secret_access_key`, `region`, `endpoint_url` and their `*_env` keys, `path_style_access` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (then `AWS_DEFAULT_REGION`), `AWS_ENDPOINT_URL` |

The resolver functions (`trino_password`, `datahub_gms_url`, `datahub_token`,
`k8s_config_file`, `web_search_api_key`, `s3_*`) read the env variable first and
fall back to the inline value. Set a `*_env` key to empty to disable the env
lookup. The file also has a `[spark]` table that `ToolConfig` does not read.

## Local paths: `config/local.toml`

`[paths]` keys and their env overrides (`config/local_config.py`):

| Key | Env variable | Default |
| --- | --- | --- |
| `data_dir` | `TAHOEPILOT_LOCAL_DIR` | `.local` |
| `checkpoint_db` | `TAHOEPILOT_CHECKPOINT_DB`, then `AGUI_CHECKPOINT_DB` | `<data_dir>/checkpoints.sqlite` |
| `profiles_dir` | `TAHOEPILOT_PROFILE_DIR` | `<data_dir>/profiles` |
| `offload_dir` | `TAHOEPILOT_OFFLOAD_DIR` | `<data_dir>/offload_store` |
| `logs_dir` | `TAHOEPILOT_LOGS_DIR` | `<data_dir>/logs` |
| `log_file` | `TAHOEPILOT_LOG_FILE` | `<logs_dir>/tahoepilot.log` |

Order per path: env variable, then the TOML value, then the default under
`data_dir`. Relative paths resolve against the project root; `~` is expanded.
The `*_env` keys rename the variables. Results are cached by
`get_local_paths()`; call `reset_local_paths_cache()` after changing env in
tests. `ensure_local_dirs()` creates the directories. Without `local.toml` the
defaults apply.

## Logging: `config/logging_config.py`

`configure_logging(log_file=None, verbose=False)` installs a single file handler
on the root logger (no console output) at `LocalPaths.log_file`, `INFO` level or
`DEBUG` with `verbose=True` (`-v` on the CLI). MCP stdio server stderr is
redirected to the same file by `tools/mcp/client.py`.

## Models: `models/models.toml`

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

Tables `[qdrant]`, `[embedding]`, `[rerank]`, parsed by `get_rag_config()` in
`rag/config.py`. Env overrides: `QDRANT_URL`, `QDRANT_API_KEY` (via
`api_key_env`), `EMBEDDING_MODEL`, `EMBEDDING_VECTOR_SIZE`, `EMBEDDING_DEVICE`.
`EMBEDDING_PROVIDER` set to anything other than `local` raises `ValueError`. Details:
[rag/README.md](../rag/README.md).

## MCP servers: `tools/mcp/mcp.json`

Cursor-style `{"mcpServers": {"<name>": {...}}}` or a flat map, as accepted by
`MultiServerMCPClient`. `tools/mcp/mcp.json.example` shows a stdio server.
`${VAR}` in any string is replaced from the environment at load time (unknown
variables stay literal), so tokens belong in `.env`. Server names are what
`[accepted_mcp]` refers to.

## Environment and `.env`

| Entry point | How `.env` is loaded |
| --- | --- |
| `main.py`, `cli.py` | `load_dotenv(<repo>/.env)` before other imports |
| `langgraph dev` | `"env": ".env"` in `langgraph.json` |
| `evals/__main__.py` | `load_dotenv` |
| `agui_server.py` | Not loaded; export variables in the shell |

Other variables: `TAHOEPILOT_USER_ID` (default user id, see
[memory/README.md](../memory/README.md#user-profiles)), `AGUI_HOST`,
`AGUI_PORT`, `AGUI_AGENT_PATH`.

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
`[run_context] max_tool_calls = 40` to its file. Note that `cli.py`,
`agui_server.py` and `langgraph_graphs.py` pass `max_tool_calls=30` as a run
override, which wins over the file; change the call site too. The same override
reaches `plan` (as its per-stage budget) and, through `intent`'s
`max_tool_calls`, every agent intent hands off to; specialists delegated by
`plan` keep their file budgets. For databot
stages, set `max_tool_calls` under `[run_context.react.fetch]` or
`[run_context.react.sql]` (the override above only reaches the outer value).

**Disable a databot gate.** In `databot.toml`:
`[run_context.gates] sql_enabled = false`.

**Add a model.** Add a `[model."<id>"]` table with `base_url`, `provider` and
`api_key_env`, put the key in `.env`, and set `[basic].default_model_name` to
use it everywhere.

**Point at a different Trino.** Edit `host`, `port`, `user`, `catalog`,
`schema_name` and `http_scheme` under `[trino]`; put the password in the
variable named by `password_env`.

**Move runtime data.** `export TAHOEPILOT_LOCAL_DIR=/data/tahoepilot` moves
everything that has no explicit path.

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
