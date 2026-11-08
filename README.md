# TahoePilot

An AI agent platform for data teams. Ask questions in a terminal or a browser; TahoePilot routes each question to a specialist agent that reasons with an LLM and calls read-only tools against your data platform (Trino, Hive, S3, DataHub, Kubernetes, Airflow via MCP) and your team's knowledge (Jira tickets and dbt models in Qdrant). Built on LangGraph and LangChain.

**Version** 0.1.0 · **Python** 3.11+

## What it does

- **Routes questions to the right specialist.** The default `intent` agent classifies a question and hands it to one specialist, or to the `plan` agent when it needs several.
- **Answers data questions with human approval.** Databot finds candidate tables, drafts SQL, and runs it on Trino only after you approve both the tables and the query.
- **Keeps long conversations.** Sessions are checkpointed in SQLite, so `--session` resumes after a restart; long histories are compressed without losing anything.
- **Is configured, not coded.** Each agent's prompt, budgets, tool set and MCP servers live in `config/agents/<name>.toml`.

| Agent | Kind | Use it for |
|-------|------|-----------|
| `intent` (default) | Orchestrator | Any question; routes to the agents below |
| `databot` | Specialist | Data retrieval: tables → SQL → approval → results |
| `knowledge` | Specialist | Team knowledge: Jira, DataHub, dbt models, docs, code |
| `diagnostic` | Specialist | Production triage: Kubernetes, S3, Trino, Airflow (MCP) |
| `data_analysis` | Specialist | Exploratory analysis with SQL and Python |
| `swe` | Specialist | Editing files, running shell commands and scripts |
| `plan` | Orchestrator | Multi-step tasks split across specialists |

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

1. **LLM.** Models are defined in `models/models.toml`; the default is `MiniMax-M3`, which reads its key from `MiniMax_API_KEY`. Put keys in a `.env` file at the repo root (it is git-ignored and loaded automatically):

   ```bash
   MiniMax_API_KEY=your-key
   ```

2. **Data connections.** Set Hive, Trino, DataHub, S3, Kubernetes and web-search settings in `config/tools.toml`; secrets can come from env vars instead.
3. **MCP servers (optional).** Copy `tools/mcp/mcp.json.example` to `tools/mcp/mcp.json` and fill in the servers. If it is missing or a server is down, those tools are skipped with a warning.
4. **Knowledge base (optional).** Start Qdrant and ingest Jira / dbt data as described in [rag/README.md](rag/README.md).

See [config/README.md](config/README.md) for every setting.

### Run the CLI

```bash
python main.py
```

Type at the `You>` prompt; `quit` exits. Useful flags:

```bash
python main.py --agent databot     # talk to one specialist directly
python main.py -s alice            # named session, resumable across restarts
python main.py -u alice            # user id for the stored profile
python main.py -v                  # also print checkpoint and profile paths
```

### Run the web UI

Install the frontend once (`cd frontend && npm install`), download the retrieval models once (`python -m rag download`), then start both servers:

```bash
./scripts/dev.sh start     # langgraph dev on :8000 (with /agui) and Next.js on :3000
```

Open http://localhost:3000. `./scripts/dev.sh status` and `./scripts/dev.sh stop` check and stop them; logs are in `.run/`. Details in [frontend/README.md](frontend/README.md).

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
| [agent/README.md](agent/README.md) | Learn how agents run a turn, route, plan, and how to add one |
| [agent/specialists/databot/README.md](agent/specialists/databot/README.md) | Understand Databot's staged pipeline and human gates |
| [docs/databot-graph.html](docs/databot-graph.html) | The Databot state machine in full: every stage, gate and transition |
| [tools/README.md](tools/README.md) | See every tool, how agents get them, and how to add one |
| [config/README.md](config/README.md) | Configure agents, prompts, connections, models and paths |
| [memory/README.md](memory/README.md) | Understand context compression and user profiles |
| [rag/README.md](rag/README.md) | Ingest Jira / Drive / dbt data and tune retrieval |
| [evals/README.md](evals/README.md) | Write and run eval cases |
| [frontend/README.md](frontend/README.md) | Run and extend the web UI and AG-UI server |
| [docs/ROADMAP.en.md](docs/ROADMAP.en.md) | Project roadmap ([中文](docs/ROADMAP.md)) |
| [docs/CHAT_OPTIMIZATION.md](docs/CHAT_OPTIMIZATION.md) | Log of notable changes |
| [docs_site/README.md](docs_site/README.md) | How the GitHub Pages documentation site is built |

## Repository layout

```
agent/        agents: base class, catalog, turn lifecycle, intent, plan, specialists (incl. databot/)
graph/        LangGraph building blocks: ReAct builder, nodes, state, error recovery
tools/        tool registry and tools (data/, external/datahub/, code/, rag/, mcp/, web/, k8s, plan)
memory/       context compression, offload store, user profiles, session runtime
config/       config loaders; agents/*.toml, tool_groups.toml, tools.toml, local.toml, rag.toml
models/       models.toml and the LLM factory
rag/          ingest pipeline and Qdrant retrieval helpers
evals/        eval case types, scoring, cases/*.json
frontend/     Next.js + CopilotKit web UI
docs_site/    GitHub Pages site (MkDocs Material; sources the READMEs above)
cli.py        terminal chat           agui_server.py      AG-UI server for the web UI
main.py       `tahoepilot` entry      langgraph_graphs.py graphs for `langgraph dev`
```

## Tech stack

Python 3.11+ · LangGraph · LangChain · Hive Metastore · Trino · MCP · Qdrant (BGE-M3 + BGE reranker) · FastAPI · AG-UI · Next.js · CopilotKit
