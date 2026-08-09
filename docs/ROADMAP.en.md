# TahoePilot Project Roadmap

> [中文](ROADMAP.md) | English

An AI Agent platform for data teams: chatbot, intelligent data retrieval, team knowledge Q&A, data diagnosis, development assistance, and data analysis.

**Current version**: 0.1.0  
**Tech stack**: Python 3.11+ · LangGraph · LangChain · OpenAI · Hive HMS · Trino · MCP

---

## Milestones

| ID | Milestone | Description | Status |
|----|-----------|-------------|--------|
| M0 | Conversational | Multi-turn chat in the CLI; call Hive/Trino/MCP tools to get results | Done — generic ReAct graph + pluggable `--agent`; see [CHAT_OPTIMIZATION.md](CHAT_OPTIMIZATION.md) |
| M1 | Resumable | Conversation state persists; pick up where you left off; long-context management | Done — `AsyncSqliteSaver` + `--session`; context compression (F4) wired in |
| M2 | Data retrieval | Describe data needs in natural language; Agent finds tables, writes SQL, returns results | Done — glossary-first → metadata/lineage → read-only SQL; `DatabotAgent` / retrieval prompt contract |
| M3 | Knowledge Q&A | Ask about Tahoe team knowledge — codebase, Google Docs, Wiki/FAQ, Jira; Agent retrieves and explains | Not started — `KnowledgeAgent` skeleton registered; knowledge sources and dedicated tools still open |
| M4 | Collaborative | Complex tasks split across specialized agents that pass intermediate results | Done — `IntentOrchestrator` composite intentions → `execution_plan` → `PlannedAgentChain`; upstream feeds downstream; ephemeral specialist sessions |
| M5 | Diagnostic | Describe data anomalies; Agent runs quality checks, reasons about root cause, produces reports | Not started |
| M6 | Deployable | Move from local CLI to an outward-facing service (UI, API, auth, observability) | Not started |

## Features

| ID | Feature | Description | Priority | Status |
|----|---------|-------------|----------|--------|
| F1 | Context Engineering | Dynamic assembly of system prompt, context snippets, and tool descriptions | P0 | Done — layered `SystemPromptAssembler` + `UserProfile` injection |
| F2 | Structured Output | Structured output constraints (typed response, JSON schema) | P0 | Done — intent `IntentionResponse` / plan steps, profile refine |
| F3 | Memory | Cross-session state persistence; user preferences and historical context retrieval | P0 | Done — checkpointer sessions + `FileProfileStore` / `refine_user_profile` |
| F4 | Memory Compression | Auto-compress/summarize long conversations; retain key facts within context window | P0 | Done — three-layer compression pipeline + `compact_context` |
| F5 | Planning | Task planning and decomposition; Plan-and-Execute | P1 | Done — Intent ordered `execution_plan` + AgentChain execution |
| F6 | Human-in-the-Loop | Interrupt at key nodes; wait for user confirmation or input | P1 | Done — Intent low-confidence clarification interrupt + CLI resume |
| F7 | Reflective Reasoning | Self-review and correction before delivery (consistency checks, retry) | P1 | Not started |
| F8 | Parallel Tool Use | Parallel tool invocation and result aggregation | P1 | Not started |
| F9 | Eval Loop | Eval set regression; continuous iteration on prompts and agent behavior | P2 | Not started |
| F10 | Monitoring | Token usage, cache hit rate, tool call latency and error rate | P2 | Not started |
| F11 | Semantic Cache | Semantically similar requests hit cache; avoid redundant reasoning | P2 | Not started |
| F12 | Model Routing | Dynamic model selection by task complexity and cost | P2 | Not started |
| F13 | Procedural Memory | Distill reusable tool-call sequences and workflows from successful interactions | P3 | Not started |
| F14 | Error Handling | Classify, retry, and degrade on LLM/tool failures; friendly errors and recoverable interrupts | P1 | Done — TOOL ERROR, transient retries, Hive↔Trino anti-oscillation, CLI-friendly errors |

---

## Future optimization opportunities

Items marked **Done** mean the main path works. The list below is optional deepening and does not block closing those milestones/features.

### Milestone-related

| Related | Possible follow-ups |
|---------|---------------------|
| M2 | Dedicated retrieval eval set; stronger table-selection / SQL repair loops |
| M3 | Wire knowledge sources (code, Docs, Wiki, Jira) and dedicated prompts/tools; registry/routing already in place |
| M4 | End-to-end composite chains once Knowledge is productized; plan-confirmation HITL; richer structured handoff payloads |
| M5 / M6 | Still tracked as not started (diagnostic agent; service UI/API/auth/observability) |

### Feature-related

| Related | Possible follow-ups |
|---------|---------------------|
| F1 | Dynamic per-turn / per-intention tool-description assembly |
| F2 | Typed / JSON schema for user-facing replies |
| F3 | Cross-session semantic recall (beyond profile + checkpointer) |
| F5 | Generic Plan node (not only Intent orchestration); plan revise / replan |
| F6 | General confirmation gates (writes, costly tools, confirm-before-plan-run) |
| F7–F13 | Still tracked as not started (reflection, parallel tools, eval, monitoring, semantic cache, model routing, procedural memory) |
| F14 | Failure metrics; broader integration-test coverage |

---

*Last updated: 2026-08-09*
