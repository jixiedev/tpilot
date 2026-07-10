# TahoePilot Project Roadmap

> [中文](ROADMAP.md) | English

An AI Agent platform for data teams: chatbot, intelligent data retrieval, data diagnosis, development assistance, and data analysis.

**Current version**: 0.1.0  
**Tech stack**: Python 3.11+ · LangGraph · LangChain · OpenAI · Hive HMS · Trino · MCP

---

## Milestones

| ID | Milestone | Description | Status |
|----|-----------|-------------|--------|
| M0 | Conversational | Multi-turn chat in the CLI; call Hive/Trino/MCP tools to get results | Done — generic ReAct graph + pluggable `--agent` (default `chatbot`); see [CHAT_OPTIMIZATION.md](CHAT_OPTIMIZATION.md) |
| M1 | Resumable | Conversation state persists; pick up where you left off; long-context management | In progress — LangGraph `AsyncSqliteSaver` + `--session` resume across restarts; long-context compression (F4) not done |
| M2 | Data retrieval | Describe data needs in natural language; Agent finds tables, writes SQL, returns results | Not started |
| M3 | Collaborative | Complex tasks split across specialized agents that pass intermediate results | Not started |
| M4 | Diagnostic | Describe data anomalies; Agent runs quality checks, reasons about root cause, produces reports | Not started |
| M5 | Deployable | Move from local CLI to an outward-facing service (UI, API, auth, observability) | Not started |

## Features

| ID | Feature | Description | Priority | Status |
|----|---------|-------------|----------|--------|
| F1 | Context Engineering | Dynamic assembly of system prompt, context snippets, and tool descriptions | P0 | Not started |
| F2 | Structured Output | Structured output constraints (typed response, JSON schema) | P0 | Not started |
| F3 | Memory | Cross-session state persistence; user preferences and historical context retrieval | P0 | In progress — `--session` + SQLite checkpointer persist turns; preferences / cross-session recall not done |
| F4 | Memory Compression | Auto-compress/summarize long conversations; retain key facts within context window | P0 | Not started |
| F5 | Planning | Task planning and decomposition; Plan-and-Execute | P1 | Not started |
| F6 | Human-in-the-Loop | Interrupt at key nodes; wait for user confirmation or input | P1 | Not started |
| F7 | Reflective Reasoning | Self-review and correction before delivery (consistency checks, retry) | P1 | Not started |
| F8 | Parallel Tool Use | Parallel tool invocation and result aggregation | P1 | Not started |
| F9 | Eval Loop | Eval set regression; continuous iteration on prompts and agent behavior | P2 | Not started |
| F10 | Monitoring | Token usage, cache hit rate, tool call latency and error rate | P2 | Not started |
| F11 | Semantic Cache | Semantically similar requests hit cache; avoid redundant reasoning | P2 | Not started |
| F12 | Model Routing | Dynamic model selection by task complexity and cost | P2 | Not started |
| F13 | Procedural Memory | Distill reusable tool-call sequences and workflows from successful interactions | P3 | Not started |
| F14 | Error Handling | Classify, retry, and degrade on LLM/tool failures; user-friendly errors at graph and CLI layers; recoverable interrupts instead of silent turn failure | P1 | Not started |

---

*Last updated: 2026-07-10*
