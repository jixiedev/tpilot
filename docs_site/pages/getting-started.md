---
title: Getting started
description: Install TahoePilot, connect your data, and ask your first question.
---

# Getting started

TahoePilot answers questions about your data. You ask in plain language, a specialist
works out what to look up, and you approve anything that touches your warehouse.

This page takes you from nothing to a first answer.

## What you need

| You need | For |
|---|---|
| Python 3.11 or newer | Running the platform |
| A model API key | The LLM that reasons over your data |
| Credentials for your warehouse or catalog | Answering questions against real data |

The knowledge base is optional. Without it, the platform still answers questions against
your warehouse, cluster and tickets.

## Install

```bash
uv sync
```

Or with pip, picking the extras for what you plan to use:

```bash
pip install -e '.[web,k8s,rag]'
```

| Extra | Adds |
|---|---|
| `web` | The server behind the browser UI |
| `k8s` | Read-only Kubernetes tools |
| `rag` | Knowledge base retrieval, embeddings, ingest |

## Connect what you want to ask about

**The model.** TahoePilot reads its model configuration from the project and its key from
the environment. Put the key in a `.env` file at the project root; it is loaded
automatically and never committed.

```bash
MINIMAX_API_KEY=your-key
```

**Your data platform.** Hive, Trino, DataHub, S3 and Kubernetes credentials go into the
connection configuration. Secrets can come from environment variables instead of the
file, which keeps them out of the repository entirely.

**Other tools.** If your team runs tools through MCP, list the servers you want to
connect. A server that is missing or unreachable is skipped with a warning rather than
breaking the run.

**Your knowledge base.** Start Qdrant and ingest your Jira tickets, dbt models and
documents if you want answers grounded in your team's own words. See
[Knowledge](knowledge.md).

Every setting, and where it lives, is described in [Configuration](configuration.md).

## Ask your first question

```bash
tahoepilot
```

Type a question at the prompt. `quit` leaves.

```bash
tahoepilot --agent databot     # talk to one specialist directly
tahoepilot -s alice            # a named session, resumable across restarts
tahoepilot -u alice            # answer as a known user, with their profile applied
tahoepilot -v                  # also print where the session and profile are stored
```

A typical first question:

> How many orders did we ship last week, and which warehouse shipped them?

The answer comes back with the query that produced it, so you can check the reasoning
rather than trust it.

## What waits for you

Nothing consequential runs without your approval. The gates are:

- **Which tables to use.** Before a query is written, you see the candidate tables and
  approve or correct the choice.
- **Which query to run.** You see the drafted SQL and approve it before it executes.
- **Anything that would write.** The default is read-only; a write needs an explicit
  gate.

Rejection is not a dead end. Your comments go back to the same stage, which tries again
with them. See [Databot](databot.md).

## Use the browser instead

```bash
cd frontend && npm install
./scripts/dev.sh start
```

Open http://localhost:3000. The browser shows the same platform as the terminal, with
tool calls arriving as cards while the agent works, and the same approval gates. See
[Web UI](web-ui.md).

## Where to go next

| Page | Read it to… |
|---|---|
| [Architecture](architecture.md) | Understand the components and how a request flows |
| [The seven agents](agents.md) | Know which specialist handles your question |
| [Databot](databot.md) | Follow a data question from question to answer |
| [Tools](tools.md) | See everything the platform can read |
| [Configuration](configuration.md) | Change prompts, budgets, tool sets and connections |
| [Memory](memory.md) | Understand what the platform remembers |
| [Knowledge](knowledge.md) | Ground answers in your tickets and models |
| [Evaluation](evals.md) | Check that a change did not make answers worse |
