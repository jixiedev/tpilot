# TahoePilot

An AI agent for data teams: multi-turn CLI chat with Hive, Trino, and optional MCP tools. Built on LangGraph and LangChain.

**Version:** 0.1.0 · **Python:** 3.11+

## Features

- **Multi-turn CLI** — REPL with in-process conversation history
- **ReAct agent** — LangGraph loop: LLM reasoning ↔ tool execution (up to 10 tool steps per turn)
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
main.py → agent/cli.py (REPL)
              ↓
         graph/builder.py (LangGraph ReAct)
              ↓
    ┌─────────┼─────────┐
    ↓         ↓         ↓
  LLM      Hive      Trino      MCP (optional)
 (bind_tools)
```

| Path | Role |
|------|------|
| `agent/cli.py` | Interactive loop, I/O |
| `graph/builder.py` | Compiles the agent ↔ tools graph |
| `graph/edge.py` | Routes to tools or end of turn |
| `graph/node.py` | Tool execution with per-turn call counter |
| `state/agent_state.py` | Message history and tool-call budget |
| `tools/hive.py` | Hive HMS metadata tools |
| `tools/trino.py` | Trino query and metadata tools |
| `tools/mcp/mcp.py` | MCP client and tool loader |
| `models/models.py` | LLM factory from TOML config |
| `config/tools.toml` | Hive / Trino connection settings |

## Project layout

```
tahoepilot/
├── main.py              # Entry point
├── agent/               # CLI and system prompt
├── graph/               # LangGraph builder, nodes, edges
├── state/               # Agent state helpers and session store
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
