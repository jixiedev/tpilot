# TahoePilot Project Roadmap

> [中文](ROADMAP.md) | English

An AI Agent platform for data teams: chatbot, intelligent data retrieval, team knowledge Q&A, data diagnosis, development assistance, and data analysis.

**Current version**: 0.1.0  
**Tech stack**: Python 3.11+ · LangGraph · LangChain · OpenAI · Hive HMS · Trino · MCP · Qdrant

---

## Milestones

| ID | Milestone | Description | Status |
|----|-----------|-------------|--------|
| M0 | Conversational | Multi-turn chat in the CLI; call Hive/Trino/MCP tools to get results | Done — generic ReAct graph + pluggable `--agent`; see [CHAT_OPTIMIZATION.md](CHAT_OPTIMIZATION.md) |
| M1 | Resumable | Conversation state persists; pick up where you left off; long-context management | Done — `AsyncSqliteSaver` + `--session`; context compression (F4) wired in |
| M2 | Data retrieval | Describe data needs in natural language; Agent finds tables, writes SQL, returns results | Done — glossary-first → metadata/lineage → read-only SQL; `DatabotAgent` / retrieval prompt contract |
| M3 | Knowledge Q&A | Ask about Tahoe team knowledge — codebase, Google Docs, Wiki/FAQ, Jira; Agent retrieves and explains | Done (v1) — `KnowledgeAgent` (`--agent knowledge` / Intent `KNOWLEDGE`); Jira Qdrant search; DataHub + read-only K8s. Drive zip ingest works; codebase / Wiki / Drive search tools remain follow-ups |
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
| F9 | Eval Loop | Eval set regression; continuous iteration on prompts and agent behavior | P2 | Done (v1) — `observability` case JSON + Observer scoring (tool order / rounds / answer) + `python -m observability` |
| F10 | Monitoring | Token usage, cache hit rate, tool call latency and error rate | P2 | Not started |
| F11 | Semantic Cache | Semantically similar requests hit cache; avoid redundant reasoning | P2 | Not started |
| F12 | Model Routing | Dynamic model selection by task complexity and cost | P2 | Not started |
| F13 | Procedural Memory | Distill reusable tool-call sequences and workflows from successful interactions | P3 | Not started |
| F14 | Error Handling | Classify, retry, and degrade on LLM/tool failures; friendly errors and recoverable interrupts | P1 | Done — TOOL ERROR, transient retries, Hive↔Trino anti-oscillation, CLI-friendly errors |
| F15 | RAG | Local Qdrant vector store; ingest and semantic search over Jira / Google Drive (and later Wiki) for Knowledge Agent | P1 | Done (Jira main path) — Docker Qdrant, ingest CLI (Jira CSV / Drive zip), `fetch_related_jira_tickets`. Drive/Wiki search tools and eval still open |

---

## Future optimization opportunities

Items marked **Done** mean the main path works. The list below is optional deepening and does not block closing those milestones/features.

### Milestone-related

| Related | Possible follow-ups |
|---------|---------------------|
| M2 | Dedicated retrieval eval set; stronger table-selection / SQL repair loops; bind the DataHub glossary term (name/URN) for the turn: store `related_glossary_term` in state as a program anchor (gates, citation checks, AgentChain handoff) and inject it into messages/system (models do not see bare state)—do not rely on state alone for attention |
| M3 | Drive / Wiki / code search tools and Knowledge prompts; soak Intent composite chains against a real knowledge corpus; see [rag/README.md](../rag/README.md) |
| M4 | Plan-confirmation HITL; richer structured handoff payloads |
| M5 / M6 | Still tracked as not started (diagnostic agent; service UI/API/auth/observability) |

### Feature-related

| Related | Possible follow-ups |
|---------|---------------------|
| F1 | Dynamic per-turn / per-intention tool-description assembly |
| F2 | Typed / JSON schema for user-facing replies |
| F3 | Cross-session semantic recall (beyond profile + checkpointer) |
| F5 | Generic Plan node (not only Intent orchestration); plan revise / replan |
| F6 | General confirmation gates (writes, costly tools, confirm-before-plan-run) |
| F7–F13 | F7/F8/F10–F13 still not started (reflection, parallel tools, monitoring, semantic cache, model routing, procedural memory); F9 eval — see **F9 Eval Loop** below |
| F14 | Failure metrics; broader integration-test coverage |
| F15 | Google Drive / Wiki search tools; incremental refresh and dedupe; retrieval quality eval; multi-collection routing |

### F9 Eval Loop (v1 → next)

**Shipped (v1)** — repo-local JSON cases, `Observer` traces, `python -m observability`:

| Case type | Scores |
|-----------|--------|
| ReAct (`ToolCallCase`) | Tool order (subsequence), ReAct round budget, JSON answer fields (shape in case `query`; empty `answer` skips) |
| Intent (`IntentRouterCase`) | Router status, intention labels, specialist route order (`execute_plan=False`) |

**Strengths** — simple, git-versioned, no SaaS; fits ReAct + Intent wiring; deterministic scorers are unit-testable; checks process (tools/router), not just final text.

**Limits** — live LLM + external deps (Qdrant/MCP) are flaky in CI; JSON field equality misses paraphrases; tool args not checked; equal-weight dimensions; shape/answer duplicated in cases; little multi-turn / clarify eval; no trace archive or experiment diff; eval JSON contract may diverge from production UX.

**Mainstream pattern** — dataset rows → run (live / mock / replay) → **multiple scorers** (deterministic + optional LLM judge + environment outcome) → report & gates; platforms (LangSmith, Langfuse, Braintrust, etc.) persist traces and compare runs. Typical CI: L0 scorer unit tests → L1 mock LLM/tools → L2 smoke live → L3 nightly integration → L4 sampled LLM judge.

**Proposed phases**

| Phase | Focus |
|-------|--------|
| **1 — Stabilize CI** | Fast (mock intent routing + scorer tests) vs slow (live integration); weighted or gated scorers; tool-argument checks; case tags (`smoke` / `integration`) |
| **2 — Richer deterministic eval** | Optional JSON Schema; single source for shape + expected fields; multi-turn clarify fixtures; golden trace replay |
| **3 — Traces & experiments** (with F10) | Persist Observer payloads; run id + git sha; per-case diff between prompt/agent versions |
| **4 — Semantic / RAG eval** (with F15) | Sampled LLM judge; faithfulness / recall on Jira corpus; separate eval vs production prompts where JSON distorts UX |
| **5 — Product eval** (with M6) | Dedicated M2/M3 datasets; online trace sampling; eval API in service |

**Next steps** — case `tags` + CLI filter; mock-LLM intent cases in CI; document env deps per group; scorer weights in case JSON; spike one-run trace JSON export from `Observer`.

---

*Last updated: 2026-08-24*
