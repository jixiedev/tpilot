# Architecture

TahoePilot is a multi-agent assistant for data teams. A user asks a question in a terminal or a browser; an agent answers it by reasoning with an LLM and calling tools against the team's data platform (Trino, Hive, S3, DataHub, Kubernetes, Airflow via MCP) and its knowledge base (Jira tickets and dbt models indexed in Qdrant). Everything is built on [LangGraph](https://langchain-ai.github.io/langgraph/) and LangChain.

This page is the map. Each subsystem has its own README with the details:

| Subsystem | Doc | What it covers |
|-----------|-----|----------------|
| Agents | [tahoepilot/agent/README.md](../tahoepilot/agent/README.md) | Agent lifecycle, ReAct loop, the lead agent, delegation and plans, adding a specialist |
| Warehouse | [tahoepilot/agent/specialists/warehouse/README.md](../tahoepilot/agent/specialists/warehouse/README.md) | The lead's data specialist: one ReAct loop with a tool-enforced SQL review |
| Databot | [tahoepilot/agent/specialists/databot/README.md](../tahoepilot/agent/specialists/databot/README.md) | The staged, human-gated data-retrieval pipeline (a front agent with its own page) |
| Tools | [tahoepilot/tools/README.md](../tahoepilot/tools/README.md) | Tool registry, per-agent tool sets, MCP, errors and retries, every built-in tool |
| Configuration | [config/README.md](../config/README.md) | Every TOML file, prompt and run-context inheritance, env vars, recipes |
| Memory | [tahoepilot/memory/README.md](../tahoepilot/memory/README.md) | Context compression, offload store, user profiles, session runtime |
| RAG | [tahoepilot/rag/README.md](../tahoepilot/rag/README.md) | Ingest (Jira, Drive, dbt) into Qdrant and hybrid retrieval |
| Evals | [evals/README.md](../evals/README.md) | JSON case suites and scoring (`python -m evals`) |
| Web stack | [frontend/README.md](../frontend/README.md) | Next.js + CopilotKit UI, the AG-UI server, `langgraph dev` |
| Docs site | [docs_site/README.md](../docs_site/README.md) | GitHub Pages build from these READMEs |

## System at a glance

Code paths in the diagram are inside the `tahoepilot/` package.

```
             ┌──────────────┐        ┌───────────────────────────────┐
  terminal ──▶  cli.py      │        │ browser (Next.js, CopilotKit) │
             │  __main__.py │        └───────────────┬───────────────┘
             └──────┬───────┘                        │ AG-UI over HTTP
                    │                ┌───────────────▼───────────────┐
                    │                │ server/app.py (FastAPI)       │
                    │                │ mounted inside `langgraph dev`│
                    │                └───────────────┬───────────────┘
                    └───────────────┬────────────────┘
                                    ▼
                    ┌──────────────────────────────┐   config/agents/*.toml
                    │ AgentCatalog  (agent/)       │◀── prompts, budgets,
                    │ front: lead · databot        │    tool sets, MCP servers
                    │  lead ─▶ warehouse·knowledge │
                    │  diagnostic·data_analysis·swe│
                    └──────┬───────────────┬───────┘
          compiled LangGraph│               │tools bound per agent scope
                    ┌──────▼──────┐  ┌─────▼──────────────────────────┐
                    │ agent/graph/│  │ tools/  Trino · Hive · S3 ·    │
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
| `tahoepilot/__main__.py` → `tahoepilot/cli.py` | `tahoepilot` or `python -m tahoepilot` | Multi-turn terminal chat with one agent (`--agent`, default `lead`) |
| `tahoepilot/server/app.py` | `./scripts/dev.sh backend` (via `langgraph dev`) | FastAPI app serving the two front agents as AG-UI streams: `lead` on `/agui/lead`, `databot` on `/agui/databot` (plus `/agui/databot/actions` for UI edits) |
| `tahoepilot/server/graphs.py` | loaded by `langgraph.json` | Graphs exposed to `langgraph dev` / LangGraph Studio |
| `evals/__main__.py` | `python -m evals` | Runs JSON eval suites against an agent and scores them |
| `tahoepilot/rag/__main__.py` | `python -m tahoepilot.rag plan\|run\|download` | Plans and runs resumable ingest jobs; downloads embedding models |

### Packages

| Package | Responsibility |
|---------|----------------|
| `tahoepilot/agent/` | Agent base class, catalog, turn lifecycle, ReAct agents, the lead agent and subagent contract, specialists (incl. warehouse), Databot |
| `tahoepilot/agent/graph/` | Generic LangGraph pieces: ReAct graph builder, step nodes, state schemas, message sanitizing, error recovery |
| `tahoepilot/tools/` | Tool registry and every tool the agents can call, plus MCP loading |
| `tahoepilot/memory/` | Context compression, offloaded payloads, user profiles, per-process session cache |
| `config/` | Every configuration file (agent TOMLs, tool connections, local paths, models, RAG, MCP, metric catalog); data only, mountable as one volume |
| `tahoepilot/settings/` | Loaders that parse `config/` into typed objects; `paths.config_dir()` locates it |
| `semantic_models/` | dbt semantic models read by the metric catalog (git-sync mount point in k8s) |
| `tahoepilot/models/` | The chat-model factory (definitions in `config/models.toml`) |
| `tahoepilot/rag/` | Document readers, chunking, embeddings, Qdrant access, ingest jobs |
| `evals/` | Eval case types, scoring, eval listeners, CLI |
| `frontend/` | Next.js web UI |

The intended dependency direction is *entry points → `agent` → `graph` / `tools` / `memory` → `config` / `models` / `rag`*. It is not strict: several packages import each other (for example `agent` ↔ `tools` for catalog lookups, `memory` ↔ `graph` for compression nodes), and those cycles are broken with function-local imports. Keep new code on the intended direction.

## Core concepts

| Term | Meaning |
|------|---------|
| **Agent** | An object with a compiled LangGraph graph and a `run()` method that handles one user turn (`tahoepilot/agent/agent.py` `BaseAgent`). Created by name through `AgentCatalog`. |
| **Front agent** | An agent the user talks to directly, with its own AG-UI endpoint and web page: `lead` and `databot` (`front = true` in their TOML). The lead never delegates to a front agent. |
| **Specialist** | An agent the lead delegates to, which does the work with tools: `warehouse`, `knowledge`, `diagnostic`, `data_analysis`, `swe`. |
| **Lead agent** | `lead`, the default front agent. It owns the conversation: answers from what is already known, asks a clarifying question, or delegates to specialists, writing a plan when a request needs several. It has no data tools. |
| **Subagent / delegation** | A specialist run by the lead through its `delegate` tool, with a written standalone brief. It runs nested inside the lead's graph, starts from a fresh state, and returns a short summary plus structured artifacts (`tahoepilot/agent/subagent.py`). |
| **Agent config** | `config/agents/<name>.toml`: system prompt sections, run context (budgets, step prompts), compression, tool sets, MCP servers, `delegate_when` (the line the lead reads to choose a specialist) and `front`. |
| **Tool scope** | A named tool set of one agent, written `"agent,scope"` (for example `databot,sql`). Filled from the `[tools]` table of the agent's config. |
| **Session / thread** | One conversation. Its id is the LangGraph `thread_id`; all history lives in the checkpoint for that thread. |
| **Turn** | One user message and everything the agent does until it answers. A turn has an *accept* phase (build input messages) and a *commit* phase (persist side effects). |
| **ReAct loop** | `step_reason` (LLM decides) ↔ `step_action` (tools run), until the model answers in plain text, a budget runs out, or a stage-completion check passes. |
| **Interrupt / gate** | A LangGraph `interrupt()` that pauses the graph for human input. Warehouse asks for one SQL review (`request_sql_approval`) before `run_sql` runs anything; it runs under the lead, so the review pauses the lead's run and resuming the lead resumes it. Databot uses two gates (table selection, SQL) before any query runs. |
| **Checkpoint** | LangGraph's saved graph state per thread (SQLite in `.local/` for the CLI and web server). It is the source of truth for history. |

## Design philosophy

These principles explain most of the structure. Each subsystem README shows where they appear in code.

1. **Behavior lives in config, mechanics live in code.** Prompts, step prompts, budgets, which tools an agent may use, which MCP servers it accepts and how it is described to the lead are all in `config/agents/*.toml`, with `extends` for shared text (`base.toml` → `tahoe.toml` → agent). A pure specialist class is a few lines. Changing what an agent does rarely needs a code change. See [config/README.md](../config/README.md).

2. **Tools don't know their agents.** A tool registers itself by name (`@register_tool`); each agent lists the tools it wants in `[tools]`, with shared groups such as `@trino` in `config/tool_groups.toml`. A typo fails a test instead of silently giving an agent nothing. See [tahoepilot/tools/README.md](../tahoepilot/tools/README.md).

3. **Read-only by default, humans approve anything consequential.** Warehouse, S3, Kubernetes and DataHub tools are read-only; SQL goes through a read-only guard. Warehouse runs only SQL whose exact text a person approved (`run_sql` checks a fingerprint recorded at approval; it has no raw query tool), and Databot will not run SQL until a person has approved both the tables and the query. The tools that can change things run on the local machine: `bash` and `str_replace_editor` are in the `swe`, `knowledge` and `databot` default tool sets, and `python_execute` is also given to `data_analysis`. Databot's staged pipeline itself uses only its narrower `fetch`, `sql` and `execute` scopes.

4. **State lives in checkpoints.** Conversation history, ReAct counters and pipeline fields are graph state written by the checkpointer, keyed by `thread_id`. A process restart resumes a session (`--session`). Agent instances hold no per-session data, so one compiled graph serves every session.

5. **Specialists do the work; the lead decides who does it.** The lead never calls data tools and must not state facts no specialist returned. It hands each specialist a written brief and gets back results, not process: the specialist's tool calls stay in its own nested run, and specialists never read each other's histories. A work record of results in the lead's state carries context between specialists and across turns.

6. **Context is managed in layers, and nothing is lost.** Long tool results are offloaded to disk first, older turns are folded next, and LLM summarization runs last. Everything removed from context is archived and can be read back with `read_offloaded_file`. See [tahoepilot/memory/README.md](../tahoepilot/memory/README.md).

7. **Errors are information for the model.** Tool exceptions are classified (`tahoepilot/tools/errors.py`) and returned as structured messages with a type, a retry hint and an optional alternative tool, so the model can recover. Transient failures are retried at the tool and LLM level (LLM calls: 4 attempts with linear backoff; provider overload such as HTTP 529 counts as transient).

8. **Optional parts degrade gracefully.** RAG, Kubernetes and the web UI are pip extras. A missing extra or an unreachable MCP server removes those tools with a warning; the rest keeps working.

## How a turn flows

### Terminal

```
tahoepilot/cli.py
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
- **Warehouse**: the same ReAct loop plus two gate tools, `request_sql_approval` (interrupt for the user's review) and `run_sql` (runs only approved SQL). See [tahoepilot/agent/specialists/warehouse/README.md](../tahoepilot/agent/specialists/warehouse/README.md).
- **Databot** (front agent): an outer state machine of four phase layers (find tables → write SQL → execute → summarize), each with its own ReAct loop and tool scope, and two human gates. See [tahoepilot/agent/specialists/databot/README.md](../tahoepilot/agent/specialists/databot/README.md).
- **Lead** (default): one ReAct loop whose tools are `delegate`, `write_plan` and the memory tools. It answers directly, asks one clarifying question, delegates once when one specialist covers the request, or writes a plan and delegates step by step when it needs several. Each delegated specialist runs nested inside the `delegate` call, so its interrupts (warehouse's SQL review) pause and resume through the lead's run. The lead does not delegate to databot. See [tahoepilot/agent/README.md](../tahoepilot/agent/README.md).

### Browser

```
/lead    ─▶ Next.js /api/copilotkit ─▶ POST /agui/lead    ─▶ LangGraphAgent.run ─▶ lead graph (specialists nested)
/databot ─▶ Next.js /api/copilotkit ─▶ POST /agui/databot ─▶ LangGraphAgent.run ─▶ databot graph
   ▲                                        │ AG-UI events: RUN_STARTED, TOOL_CALL_*, STATE_SNAPSHOT,
   └────────────────────────────────────────┘ RUN_FINISHED (with interrupt outcome at a gate) / RUN_ERROR
/databot ─▶ Next.js /api/databot/actions ─▶ POST /agui/databot/actions ─▶ patch the paused databot layer
```

The web UI has one page per front agent (`/lead`, `/databot`), each with its own CopilotKit agent id, endpoint and threads; both endpoints share one SQLite checkpointer. On the lead page, the latest specialist's state reaches the workspace under `active_subagent` (overlaid live while it is paused), and warehouse's SQL review renders in the chat; the user's decision resumes the lead's graph through a new `/agui/lead` request. On the databot page, gate decisions resume databot's graph, and card and SQL edits patch the paused layer's checkpoint directly, only while a gate is waiting. See [frontend/README.md](../frontend/README.md).

## Persistence

| Data | Where | Written by |
|------|-------|-----------|
| Conversation and graph state | `.local/checkpoints.sqlite` (`checkpoint_db`) | LangGraph checkpointer (CLI, AG-UI server) |
| User profiles | `.local/profiles/<user>.json` (`profiles_dir`) | End-of-turn profile refinement (user-facing turns only; skipped for delegated specialist runs) |
| Offloaded tool output and conversation archives | `.local/offload_store/` (`offload_dir`) | Context compression |
| Databot retrieval history | `.local/profiles/<user>.databot_turns.jsonl` | Databot turn commit (CLI turns; the web page drives the graph directly and does not write it) |
| Logs | `.local/logs/tahoepilot.log` (`logs_dir`, `log_file`) | `tahoepilot/settings/logging_config.py` |
| Knowledge base | Qdrant collections (`aug_jira_*`, `aug_dbt_models`) | `python -m tahoepilot.rag run` |

All local paths come from `[paths]` in `config/runtime.toml` (keys shown); the whole tree moves with `data_dir`. `.local/` is git-ignored.

## Quality

- **Unit tests:** `python -m pytest` runs the suite in `tests/` in a few seconds with stub models; no LLM, warehouse or Qdrant is needed.
- **Evals:** `python -m evals --agent <name>` runs real agent turns against JSON cases and scores tool order, reasoning rounds, answers, and the lead's routing decisions (with stubbed specialists). Use `--fail-under` to gate CI. See [evals/README.md](../evals/README.md).

## Where to start reading code

| To understand… | Start at |
|----------------|----------|
| How a turn runs | `tahoepilot/agent/agent.py` `BaseAgent.run`, then `tahoepilot/agent/turn.py` |
| How agents are built and get tools | `tahoepilot/agent/catalog.py` `AgentCatalog` |
| The ReAct loop | `tahoepilot/agent/graph/builder.py` `build_react_graph`, `tahoepilot/agent/graph/node.py`, `tahoepilot/agent/router.py` |
| The lead and delegation | `tahoepilot/agent/lead/lead_agent.py`, `tahoepilot/agent/lead/tools.py`, `tahoepilot/agent/subagent.py` |
| Warehouse's SQL review | `tahoepilot/agent/specialists/warehouse/tools.py` |
| Databot's pipeline | `tahoepilot/agent/specialists/databot/graph.py` `DatabotGraphBuilder` |
| Prompt and config merging | `tahoepilot/settings/agent_config.py` |
| Tool registration | `tahoepilot/tools/registry.py`, `tahoepilot/tools/bootstrap.py` |
| Context compression | `tahoepilot/memory/compress.py` `ContextCompressor` |
