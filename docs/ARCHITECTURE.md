# Architecture

TahoePilot is a multi-agent assistant for data teams. A user asks a question in a terminal or a browser; an agent answers it by reasoning with an LLM and calling tools against the team's data platform (Trino, Hive, S3, DataHub, Kubernetes, Airflow via MCP) and its knowledge base (Jira tickets and dbt models indexed in Qdrant). Everything is built on [LangGraph](https://langchain-ai.github.io/langgraph/) and LangChain.

This page is the map. Each subsystem has its own README with the details:

| Subsystem | Doc | What it covers |
|-----------|-----|----------------|
| Agents | [agent/README.md](../agent/README.md) | Agent lifecycle, ReAct loop, intent routing, plan agent, chains, adding a specialist |
| Databot | [agent/specialists/databot/README.md](../agent/specialists/databot/README.md) | The staged, human-gated data-retrieval pipeline |
| Tools | [tools/README.md](../tools/README.md) | Tool registry, per-agent tool sets, MCP, errors and retries, every built-in tool |
| Configuration | [config/README.md](../config/README.md) | Every TOML file, prompt and run-context inheritance, env vars, recipes |
| Memory | [memory/README.md](../memory/README.md) | Context compression, offload store, user profiles, session runtime |
| RAG | [rag/README.md](../rag/README.md) | Ingest (Jira, Drive, dbt) into Qdrant and hybrid retrieval |
| Evals | [evals/README.md](../evals/README.md) | JSON case suites and scoring (`python -m evals`) |
| Web stack | [frontend/README.md](../frontend/README.md) | Next.js + CopilotKit UI, the AG-UI server, `langgraph dev` |

## System at a glance

```
             ┌──────────────┐        ┌───────────────────────────────┐
  terminal ──▶  cli.py      │        │ browser (Next.js, CopilotKit) │
             │  (main.py)   │        └───────────────┬───────────────┘
             └──────┬───────┘                        │ AG-UI over HTTP
                    │                ┌───────────────▼───────────────┐
                    │                │ agui_server.py (FastAPI)      │
                    │                │ mounted inside `langgraph dev`│
                    │                └───────────────┬───────────────┘
                    └───────────────┬────────────────┘
                                    ▼
                    ┌──────────────────────────────┐   config/agents/*.toml
                    │ AgentCatalog  (agent/)       │◀── prompts, budgets,
                    │  intent · databot · knowledge│    tool sets, MCP servers
                    │  diagnostic · data_analysis  │
                    │  swe · plan                  │
                    └──────┬───────────────┬───────┘
          compiled LangGraph│               │tools bound per agent scope
                    ┌──────▼──────┐  ┌─────▼──────────────────────────┐
                    │ graph/      │  │ tools/  Trino · Hive · S3 ·    │
                    │ ReAct loop, │  │ DataHub · K8s · code · web ·   │
                    │ state, error│  │ RAG search · MCP (Airflow, …)  │
                    │ recovery    │  └─────┬──────────────────────────┘
                    └──────┬──────┘        │
                    ┌──────▼──────┐  ┌─────▼──────┐   ┌──────────────┐
                    │ memory/     │  │ rag/       │──▶│ Qdrant       │
                    │ compression,│  │ embeddings,│   └──────────────┘
                    │ profiles    │  │ rerank     │
                    └──────┬──────┘  └────────────┘
                           ▼
                .local/  checkpoints.sqlite · profiles/ · offload store · logs
```

### Entry points

| Entry point | Command | What it starts |
|-------------|---------|----------------|
| `main.py` → `cli.py` | `tahoepilot` or `python main.py` | Multi-turn terminal chat with one agent (`--agent`, default `intent`) |
| `agui_server.py` | `./scripts/dev.sh backend` (via `langgraph dev`) | FastAPI app serving `/agui` (AG-UI stream) and `/agui/actions` (UI edits) for the web UI |
| `langgraph_graphs.py` | loaded by `langgraph.json` | Graphs exposed to `langgraph dev` / LangGraph Studio |
| `evals/__main__.py` | `python -m evals` | Runs JSON eval suites against an agent and scores them |
| `rag/__main__.py` | `python -m rag plan\|run\|download` | Plans and runs resumable ingest jobs; downloads embedding models |

### Packages

| Package | Responsibility |
|---------|----------------|
| `agent/` | Agent base class, catalog, turn lifecycle, ReAct agents, intent orchestrator, plan agent, chains, specialists (incl. Databot) |
| `graph/` | Generic LangGraph pieces: ReAct graph builder, step nodes, state schemas, message sanitizing, error recovery |
| `tools/` | Tool registry and every tool the agents can call, plus MCP loading |
| `memory/` | Context compression, offloaded payloads, user profiles, per-process session cache |
| `config/` | Loaders for agent TOMLs, tool connections, local paths, logging |
| `models/` | LLM definitions (`models.toml`) and the chat-model factory |
| `rag/` | Document readers, chunking, embeddings, Qdrant access, ingest jobs |
| `evals/` | Eval case types, scoring, eval listeners, CLI |
| `frontend/` | Next.js web UI |

The intended dependency direction is *entry points → `agent` → `graph` / `tools` / `memory` → `config` / `models` / `rag`*. It is not strict: several packages import each other (for example `agent` ↔ `tools` for catalog lookups, `memory` ↔ `graph` for compression nodes), and those cycles are broken with function-local imports. Keep new code on the intended direction.

## Core concepts

| Term | Meaning |
|------|---------|
| **Agent** | An object with a compiled LangGraph graph and a `run()` method that handles one user turn (`agent/agent.py` `BaseAgent`). Created by name through `AgentCatalog`. |
| **Specialist** | An agent that does the work with tools: `databot`, `knowledge`, `diagnostic`, `data_analysis`, `swe`. |
| **Orchestrator** | An agent that only decides who does the work: `intent` (routes one question to one specialist or to `plan`) and `plan` (breaks a task into steps and delegates them). |
| **Agent config** | `config/agents/<name>.toml`: system prompt sections, run context (budgets, step prompts), compression, tool sets, MCP servers, intention label. |
| **Tool scope** | A named tool set of one agent, written `"agent,scope"` (for example `databot,sql`). Filled from the `[tools]` table of the agent's config. |
| **Session / thread** | One conversation. Its id is the LangGraph `thread_id`; all history lives in the checkpoint for that thread. |
| **Turn** | One user message and everything the agent does until it answers. A turn has an *accept* phase (build input messages) and a *commit* phase (persist side effects). |
| **ReAct loop** | `step_reason` (LLM decides) ↔ `step_action` (tools run), until the model answers in plain text, a budget runs out, or a stage-completion check passes. |
| **Interrupt / gate** | A LangGraph `interrupt()` that pauses the graph for human input. Databot uses two gates (table selection, SQL) before any query runs. |
| **Checkpoint** | LangGraph's saved graph state per thread (SQLite in `.local/` for the CLI and web server). It is the source of truth for history. |

## Design philosophy

These principles explain most of the structure. Each subsystem README shows where they appear in code.

1. **Behavior lives in config, mechanics live in code.** Prompts, step prompts, budgets, which tools an agent may use, which MCP servers it accepts and how it is described to the intent router are all in `config/agents/*.toml`, with `extends` for shared text (`base.toml` → `tahoe.toml` → agent). A pure specialist class is a few lines. Changing what an agent does rarely needs a code change. See [config/README.md](../config/README.md).

2. **Tools don't know their agents.** A tool registers itself by name (`@register_tool`); each agent lists the tools it wants in `[tools]`, with shared groups such as `@trino` in `config/tool_groups.toml`. A typo fails a test instead of silently giving an agent nothing. See [tools/README.md](../tools/README.md).

3. **Read-only by default, humans approve anything consequential.** Warehouse, S3, Kubernetes and DataHub tools are read-only; SQL goes through a read-only guard. Databot will not run SQL until a person has approved both the tables and the query. The tools that can change things run on the local machine: `bash` and `str_replace_editor` are in the `swe`, `knowledge` and `databot` default tool sets, and `python_execute` is also given to `data_analysis`. Databot's staged pipeline itself uses only its narrower `fetch`, `sql` and `execute` scopes.

4. **State lives in checkpoints.** Conversation history, ReAct counters and pipeline fields are graph state written by the checkpointer, keyed by `thread_id`. A process restart resumes a session (`--session`). Agent instances hold no per-session data, so one compiled graph serves every session.

5. **Specialists do the work; orchestrators decide who does it.** Intent routing and planning never call data tools themselves. They run each child agent on its own checkpoint thread so child histories don't mix into the parent's messages.

6. **Context is managed in layers, and nothing is lost.** Long tool results are offloaded to disk first, older turns are folded next, and LLM summarization runs last. Everything removed from context is archived and can be read back with `read_offloaded_file`. See [memory/README.md](../memory/README.md).

7. **Errors are information for the model.** Tool exceptions are classified (`tools/errors.py`) and returned as structured messages with a type, a retry hint and an optional alternative tool, so the model can recover. Transient failures are retried at the tool and LLM level.

8. **Optional parts degrade gracefully.** RAG, Kubernetes and the web UI are pip extras. A missing extra or an unreachable MCP server removes those tools with a warning; the rest keeps working.

## How a turn flows

### Terminal

```
cli.py
  └─ AgentCatalog(settings).create(name)          build agent, bind its tool scopes, compile graph once
  └─ loop: agent.run(text, session, user_id, on_interrupt)
        accept_user_request    restore prior state (first time per process), add system prompt
                               on the first turn or a turn-boundary marker on later turns
        AgentTurnResult.ainvoke  invoke graph with thread_id=session; on interrupt, call
                                 on_interrupt (the CLI asks you) and resume with the answer
        commit_turn            policy side effects (profile refinement, Databot retrieval history)
        on_turn_output         print / emit the final answer
```

The graph that runs depends on the agent:

- **ReAct specialists** (`knowledge`, `diagnostic`, `data_analysis`, `swe`): one ReAct loop over the agent's `default` tool scope, with context compression around it.
- **Databot**: an outer state machine of four phase layers (find tables → write SQL → execute → summarize), each with its own ReAct loop and tool scope, and two human gates. See [agent/specialists/databot/README.md](../agent/specialists/databot/README.md).
- **Intent**: classify the question against every agent's `intention` label, ask a clarifying question if needed, then hand the question to the one agent whose label it picked. `plan` declares the `PLAN` label and is chosen like a specialist when the question needs several specialists.
- **Plan**: create a plan, delegate steps to specialists, adjust, summarize.

### Browser

```
browser ─▶ Next.js /api/copilotkit ─▶ POST /agui (agui_server.py) ─▶ LangGraphAgent.run ─▶ Databot graph
   ▲                                        │ AG-UI events: RUN_STARTED, TOOL_CALL_*, STATE_SNAPSHOT,
   └────────────────────────────────────────┘ RUN_FINISHED (with interrupt outcome at a gate) / RUN_ERROR
browser ─▶ Next.js /api/databot/actions ─▶ POST /agui/actions ─▶ patch the paused layer's checkpoint
```

The web stack serves Databot. Gate decisions resume the graph through a new `/agui` request; card and SQL edits patch the checkpoint directly. See [frontend/README.md](../frontend/README.md).

## Persistence

| Data | Where | Written by |
|------|-------|-----------|
| Conversation and graph state | `.local/checkpoints.sqlite` (`TAHOEPILOT_CHECKPOINT_DB`) | LangGraph checkpointer (CLI, AG-UI server) |
| User profiles | `.local/profiles/<user>.json` (`TAHOEPILOT_PROFILE_DIR`) | End-of-turn profile refinement |
| Offloaded tool output and conversation archives | `.local/offload_store/` (`TAHOEPILOT_OFFLOAD_DIR`) | Context compression |
| Databot retrieval history | `.local/profiles/<user>.databot_turns.jsonl` | Databot turn commit |
| Logs | `.local/logs/tahoepilot.log` (`TAHOEPILOT_LOGS_DIR`, `TAHOEPILOT_LOG_FILE`) | `config/logging_config.py` |
| Knowledge base | Qdrant collections (`aug_jira_*`, `aug_dbt_models`) | `python -m rag run` |

All local paths come from `config/local.toml` with the env overrides shown; the whole tree moves with `TAHOEPILOT_LOCAL_DIR`. `.local/` is git-ignored.

## Quality

- **Unit tests:** `python -m pytest` runs the suite in `tests/` in a few seconds with stub models; no LLM, warehouse or Qdrant is needed.
- **Evals:** `python -m evals --agent <name>` runs real agent turns against JSON cases and scores tool order, reasoning rounds, answers and intent routing. Use `--fail-under` to gate CI. See [evals/README.md](../evals/README.md).

## Where to start reading code

| To understand… | Start at |
|----------------|----------|
| How a turn runs | `agent/agent.py` `BaseAgent.run`, then `agent/turn.py` |
| How agents are built and get tools | `agent/catalog.py` `AgentCatalog` |
| The ReAct loop | `graph/builder.py` `build_react_graph`, `graph/node.py`, `agent/router.py` |
| Databot's pipeline | `agent/specialists/databot/graph.py` `DatabotGraphBuilder` |
| Prompt and config merging | `config/agent_config.py` |
| Tool registration | `tools/registry.py`, `tools/bootstrap.py` |
| Context compression | `memory/compress.py` `ContextCompressor` |
