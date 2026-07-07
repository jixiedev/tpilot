# TahoePilot

An AI agent platform for data teams: multi-turn CLI chat with Hive, Trino, and optional MCP tools. Built on LangGraph and LangChain.

**Version:** 0.1.0 · **Python:** 3.11+

## Features

- **Multi-turn CLI** — REPL with session-scoped conversation history (`--session`)
- **Pluggable agents** — select an agent application with `--agent` (default: `chatbot`)
- **Dual prompts** — session system rules injected once; per-step tool guidance on each LLM call in the tool loop
- **ReAct agent** — LangGraph loop: `step_llm` ↔ tool execution (configurable tool-step budget per turn)
- **Hive HMS** — `hive_list_tables`, `hive_desc_table` via Hive Metastore
- **Trino** — catalog/schema exploration and read-only SQL (`trino_run_query`, row limit 100 by default)
- **MCP** — optional tools from configured MCP servers; startup degrades gracefully if MCP is unavailable
- **Verbose mode** — `-v` prints tool calls and result previews for debugging

## Quick start

### 1. Install

```bash
# with uv (recommended)
uv sync

# or pip
pip install -e .
```

### 2. Configure the LLM

Set the API key (see `models/models.toml` for provider and model name):

```bash
# Linux / macOS
export GLM_API_KEY="your-key"

# Windows PowerShell
$env:GLM_API_KEY = "your-key"
```

Models are defined in `models/models.toml`. The default model is selected via `[basic].default_model_name`. Secrets are read from environment variables (`api_key_env`), not stored in the repo.

### 3. Configure data tools

Edit `config/tools.toml` for Hive HMS and Trino connectivity:

| Section | Purpose |
|---------|---------|
| `[hive]` | HMS host and port |
| `[trino]` | Trino coordinator, user, catalog, schema, HTTP scheme |

These endpoints must be reachable from your network (e.g. internal Consul / VPN).

### 4. Run

```bash
python main.py
# or
tahoepilot

# select agent application (default: chatbot)
python main.py --agent chatbot

# separate history per user / tenant
python main.py -s alice

# show tool call trace
python main.py -v
```

At the `You>` prompt, ask questions in natural language. Type `quit`, `exit`, `q`, or `:q` to leave.

**Example prompts**

- List tables in a Hive database
- Describe a table schema
- Run a Trino SQL query and summarize the results

## Optional: MCP tools

1. Copy the example config:
   ```bash
   cp tools/mcp/mcp.json.example tools/mcp/mcp.json
   ```
2. Edit `tools/mcp/mcp.json` with your MCP server definitions.
3. Environment variables in the JSON can use `${VAR_NAME}` placeholders.

If `mcp.json` is missing or servers fail to connect, TahoePilot starts with Hive and Trino tools only.

## Architecture

```
main.py → agent/cli.py (REPL, --agent, --session)
              ↓
         agent/registry.py  →  AgentSpec (build_graph, begin_turn, display)
              ↓
         agent/chatbot/     →  prompts, routes, tools, graph assembly
              ↓
         graph/builder.py   →  generic build_react_graph
              ↓
    system_prompt → step_llm ↔ tools
              ↓
    state/StateStore (per-session history)
              ↓
    tools/loader.py → Hive / Trino / MCP (optional)
```

| Path | Role |
|------|------|
| `agent/cli.py` | Interactive loop; dispatches to registered agents |
| `agent/registry.py` | `AgentSpec` registry and `--agent` lookup |
| `agent/chatbot/` | Chatbot app: prompts, `chat_completion`, routes, graph, display |
| `graph/builder.py` | Generic `build_react_graph` (tools and routes injected) |
| `graph/node.py` | Step LLM node and tool execution with per-turn counter |
| `graph/edge.py` | Shared routing helpers (`tool_call_count`, `limited_tools_condition`) |
| `state/state.py` | `AgentState`, `StateStore`, `StateProcessor` |
| `tools/loader.py` | Load shared data tools (Hive, Trino, MCP) |
| `tools/hive.py` | Hive HMS metadata tools |
| `tools/trino.py` | Trino query and metadata tools |
| `tools/mcp/mcp.py` | MCP client and tool loader |
| `models/models.py` | LLM factory from TOML config |
| `config/tools.toml` | Hive / Trino connection settings |

### Adding a new agent

1. Create `agent/<name>/` with app-specific prompts, routes, tools, and `build_<name>_graph`.
2. Register an `AgentSpec` in `agent/registry.py`.
3. Run with `python main.py --agent <name>`.

Shared infrastructure (`graph/`, `state/`, `tools/loader.py`, `models/`, `config/`) stays agent-agnostic.

## Project layout

```
tahoepilot/
├── main.py              # Entry point
├── agent/
│   ├── cli.py           # Generic REPL
│   ├── registry.py      # Agent registry
│   └── chatbot/         # Chatbot agent application
│       ├── prompt.py
│       ├── tools.py     # chat_completion
│       ├── routes.py
│       ├── graph.py
│       ├── session.py
│       └── display.py
├── graph/               # Generic LangGraph builder, nodes, edges
├── state/               # Agent state and session store
├── tools/               # Hive, Trino, MCP integrations
├── models/              # LLM configuration
├── config/              # Tool connection settings
└── docs/
    ├── ROADMAP.md       # Project roadmap (中文)
    ├── ROADMAP.en.md    # Project roadmap (English)
    └── CHAT_OPTIMIZATION.md
```

## Documentation

- [Roadmap (中文)](docs/ROADMAP.md) · [Roadmap (English)](docs/ROADMAP.en.md)
- [Optimization log](docs/CHAT_OPTIMIZATION.md)

## Tech stack

Python 3.11+ · LangGraph · LangChain · OpenAI-compatible LLM APIs · Hive HMS · Trino · MCP

## License

Not specified.
