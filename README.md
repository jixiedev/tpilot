# TahoePilot

An AI agent platform for data teams. Ask questions in a terminal or a browser; a lead agent answers it or hands the work to specialist agents that reason with an LLM and call read-only tools against your data platform (Trino, Hive, S3, DataHub, Kubernetes, Airflow via MCP) and your team's knowledge (Jira tickets and dbt models in Qdrant). Built on LangGraph and LangChain.

**Version** 0.1.0 · **Python** 3.11+

## What it does

- **One lead agent, many specialists.** The default `lead` agent answers from the conversation, asks a clarifying question, or delegates to the right specialist with a written brief; when a request needs several specialists it writes a plan and runs them step by step.
- **Answers data questions with human approval.** The lead's `warehouse` specialist finds tables, drafts one read-only SQL query and runs it on Trino only after you approve it. Databot, a separate front agent with its own page, runs the same job as a staged pipeline with two gates: you approve the tables, then the SQL.
- **Keeps long conversations.** Sessions are checkpointed in SQLite, so `--session` resumes after a restart; long histories are compressed without losing anything.
- **Is configured, not coded.** Each agent's prompt, budgets, tool set and MCP servers live in `config/agents/<name>.toml`.

| Agent | Kind | Use it for |
|-------|------|-----------|
| `lead` (default) | Front agent (web page `/lead`) | Any question; answers, plans and delegates to the specialists below |
| `databot` | Front agent (web page `/databot`) | Data retrieval as a staged pipeline: tables → approval → SQL → approval → results |
| `warehouse` | Specialist | Data retrieval: tables → SQL → approval → results, in one ReAct loop |
| `knowledge` | Specialist | Team knowledge: Jira, DataHub, dbt models, docs, code |
| `diagnostic` | Specialist | Production triage: Kubernetes, S3, Trino, Airflow (MCP) |
| `data_analysis` | Specialist | Exploratory analysis with SQL and Python |
| `swe` | Specialist | Editing files, running shell commands and scripts |

## Quick start

### Install

```bash
uv sync
```

Or with pip, including the extras you need:

```bash
pip install -e '.[web,k8s,rag]'
```

| Extra | Adds |
|-------|------|
| `web` | The AG-UI server for the web UI (FastAPI, CopilotKit) |
| `k8s` | Kubernetes read-only tools |
| `rag` | Qdrant retrieval, embeddings, ingest, S3 client |
| `dev` | pytest |
| `docs` | MkDocs Material for the GitHub Pages documentation site |

### Configure

1. **LLM.** Models are defined in `config/models.toml`; the default is `MiniMax-M3`, which reads its key from `MiniMax_API_KEY`. Secrets go in a separate `secrets.env` (git-ignored; copy `secrets.env.example`), and `.env` (also git-ignored) only says where config and secrets live. Both are loaded automatically:

   ```bash
   # .env
   TAHOEPILOT_CONFIG_DIR=config
   TAHOEPILOT_SECRETS_FILE=secrets.env
   # secrets.env
   MiniMax_API_KEY=your-key
   ```

2. **Data connections.** Set Hive, Trino, DataHub, S3, Kubernetes and web-search settings in `config/tools.toml`; secrets go in `secrets.env` under the names the `*_env` keys give.
3. **MCP servers (optional).** Copy `config/mcp.json.example` to `config/mcp.json` and fill in the servers. If it is missing or a server is down, those tools are skipped with a warning.
4. **Knowledge base (optional).** Start Qdrant and ingest Jira / dbt data as described in [tahoepilot/rag/README.md](tahoepilot/rag/README.md).

See [config/README.md](config/README.md) for every setting.

### Run the CLI

```bash
python -m tahoepilot
```

Type at the `You>` prompt; `quit` exits. Useful flags:

```bash
python -m tahoepilot --agent databot     # talk to databot (or any specialist) directly
python -m tahoepilot -s alice            # named session, resumable across restarts
python -m tahoepilot -u alice            # user id for the stored profile
python -m tahoepilot -v                  # also print checkpoint and profile paths
```

### Run the web UI

Install the frontend once (`cd frontend && npm install`), download the retrieval models once (`python -m tahoepilot.rag download`), then start both servers:

```bash
./scripts/dev.sh start     # langgraph dev on :8000 (with /agui/lead, /agui/databot) and Next.js on :3000
```

Open http://localhost:3000 and pick the lead (`/lead`) or Databot (`/databot`) page. `./scripts/dev.sh status` and `./scripts/dev.sh stop` check and stop them; logs are in `.local/run/`. Details in [frontend/README.md](frontend/README.md).

### Test

```bash
python -m pytest           # unit tests, stub models, no external services
python -m evals --help     # agent eval suites against real models
```

## Documentation

Reader-facing documentation is published at [jixiedev.github.io/tpilot](https://jixiedev.github.io/tpilot/). The documents in this repository are the developer view; the published site is written for data-team users and deliberately contains no code. Preview the site locally with `./scripts/docs.sh serve`.

| Doc | Read it to… |
|-----|-------------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Understand the system, core concepts and design principles |
| [docs/FRONTEND_BACKEND.md](docs/FRONTEND_BACKEND.md) | Follow a chat turn from the browser through Next.js, the AG-UI server and the graph, and see which state each part holds |
| [docs/INTERRUPTS_AND_CHECKPOINTS.md](docs/INTERRUPTS_AND_CHECKPOINTS.md) | Understand checkpoint storage, how human gates pause a run (also inside a delegated specialist) and how resume continues it |
| [tahoepilot/agent/README.md](tahoepilot/agent/README.md) | Learn how agents run a turn, how the lead plans and delegates, and how to add one |
| [tahoepilot/agent/specialists/databot/README.md](tahoepilot/agent/specialists/databot/README.md) | Understand Databot's staged pipeline and human gates |
| [tahoepilot/agent/specialists/warehouse/README.md](tahoepilot/agent/specialists/warehouse/README.md) | Understand the warehouse specialist and its SQL review |
| [docs/databot-graph.html](docs/databot-graph.html) | The Databot state machine in full: every stage, gate and transition |
| [tahoepilot/tools/README.md](tahoepilot/tools/README.md) | See every tool, how agents get them, and how to add one |
| [config/README.md](config/README.md) | Configure agents, prompts, connections, models and paths |
| [tahoepilot/memory/README.md](tahoepilot/memory/README.md) | Understand context compression and user profiles |
| [tahoepilot/rag/README.md](tahoepilot/rag/README.md) | Ingest Jira / Drive / dbt data and tune retrieval |
| [evals/README.md](evals/README.md) | Write and run eval cases |
| [frontend/README.md](frontend/README.md) | Run and extend the web UI and AG-UI server |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Project roadmap |
| [docs/CHAT_OPTIMIZATION.md](docs/CHAT_OPTIMIZATION.md) | Log of notable changes |
| [docs_site/README.md](docs_site/README.md) | How the GitHub Pages documentation site is built |

## Repository layout

```
tahoepilot/             the Python package (`python -m tahoepilot`, or the `tahoepilot` command)
  agent/                agents: base class, catalog, turn lifecycle, lead/, subagent contract, specialists (databot/, warehouse/, …)
    graph/              LangGraph building blocks: ReAct builder, nodes, state, error recovery
  tools/                tool registry and tools (data/, external/datahub/, code/, rag/, mcp/, web/, k8s, plan)
  memory/               context compression, offload store, user profiles, session runtime
  settings/             loaders that parse config/ into typed objects; config_dir() in paths.py
  models/               the LLM factory (reads config/models.toml)
  rag/                  ingest pipeline and Qdrant retrieval helpers (`python -m tahoepilot.rag`)
  server/               AG-UI server for the web UI (app.py), login (auth.py), graphs for `langgraph dev` (graphs.py)
  cli.py                terminal chat
config/                 all configuration files (mountable as one volume): agents/*.toml, tools.toml, runtime.toml, models.toml, rag.toml, mcp.json, metrics/
semantic_models/        dbt semantic models <db>/<model>.{yml,sql} (git-sync mount point in k8s)
evals/                  eval case types, scoring, cases/*.json (`python -m evals`)
tests/                  unit tests (`python -m pytest`)
frontend/               Next.js + CopilotKit web UI
docs_site/              GitHub Pages site (MkDocs Material; sources the READMEs above)
docker/                 one image for every component (Dockerfile, entrypoint.sh)
.local/                 runtime state (checkpoints, logs, Qdrant data); not tracked
```

## Tech stack

Python 3.11+ · LangGraph · LangChain · Hive Metastore · Trino · MCP · Qdrant (BGE-M3 + BGE reranker) · FastAPI · AG-UI · Next.js · CopilotKit
