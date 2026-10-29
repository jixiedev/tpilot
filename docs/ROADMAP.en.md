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
| M2 | Data retrieval | Describe data needs in natural language; Agent finds tables, writes SQL, returns results | Done — glossary-first → metadata/lineage → read-only SQL; `DatabotAgent` v2 staged state machine (fetch → cards gate → SQL gate → execute) + web retrieval panel (CopilotKit v2) |
| M3 | Knowledge Q&A | Ask about Tahoe team knowledge — codebase, Google Docs, Wiki/FAQ, Jira; Agent retrieves and explains | Done (v1) — `KnowledgeAgent` (`--agent knowledge` / Intent `KNOWLEDGE`); Jira Qdrant search; DataHub + read-only K8s. Drive zip ingest works; codebase / Wiki / Drive search tools remain follow-ups |
| M4 | Collaborative | Complex tasks split across specialized agents that pass intermediate results | Done (in-process) — `IntentOrchestrator` composite intentions → `execution_plan` → `PlannedAgentChain`; upstream feeds downstream; ephemeral specialist sessions. Cross-service composition: F16 (A2A) |
| M5 | Diagnostic | Describe data anomalies; Agent runs quality checks, reasons about root cause, produces reports | Not started |
| M6 | Deployable | Move from local CLI to an outward-facing service (UI, API, auth, observability) | In progress (local) — Next.js + CopilotKit v2 + LangGraph AG-UI dev stack (Databot chat, gates, Cards/SQL/Results panel; Plan chat, task tree, nested specialist gate modal); outward API, auth, production deploy, and observability remain |

## Features

| ID | Feature | Description | Priority | Status |
|----|---------|-------------|----------|--------|
| F1 | Context Engineering | Dynamic assembly of system prompt, context snippets, and tool descriptions | P0 | Done — layered `SystemPromptAssembler` + `UserProfile` injection |
| F2 | Structured Output | Structured output constraints (typed response, JSON schema) | P0 | Done — intent `IntentionResponse` / plan steps, profile refine |
| F3 | Memory | Cross-session state persistence; user preferences and historical context retrieval | P0 | Done — checkpointer sessions + `FileProfileStore` / `refine_user_profile` |
| F4 | Memory Compression | Auto-compress/summarize long conversations; retain key facts within context window | P0 | Done — three-layer compression pipeline + `compact_context` |
| F5 | Planning | Task planning and decomposition; Plan-and-Execute | P1 | Done — Intent ordered `execution_plan` + AgentChain execution |
| F6 | Human-in-the-Loop | Interrupt at key nodes; wait for user confirmation or input | P1 | Done — Intent low-confidence clarification interrupt + CLI resume; Databot v2 cards/SQL human gates (AG-UI v2 interrupt + CopilotKit Gate / Artifact panel, card selection and SQL editing); Plan nested specialist gates (parent-graph interrupt + `/plan` modal) |
| F7 | Reflective Reasoning | Self-review and correction before delivery (consistency checks, retry) | P1 | Not started |
| F8 | Parallel Tool Use | Parallel tool invocation and result aggregation | P1 | Not started |
| F9 | Eval Loop | Eval set regression; continuous iteration on prompts and agent behavior | P2 | Done (v1) — `observability` case JSON + Observer scoring (tool order / rounds / answer) + `python -m observability` |
| F10 | Monitoring | Token usage, cache hit rate, tool call latency and error rate | P2 | Not started |
| F11 | Semantic Cache | Semantically similar requests hit cache; avoid redundant reasoning | P2 | Not started |
| F12 | Model Routing | Dynamic model selection by task complexity and cost | P2 | Not started |
| F13 | Procedural Memory | Distill reusable tool-call sequences and workflows from successful interactions | P3 | Not started |
| F14 | Error Handling | Classify, retry, and degrade on LLM/tool failures; friendly errors and recoverable interrupts | P1 | Done — TOOL ERROR, transient retries, Hive↔Trino anti-oscillation, CLI-friendly errors |
| F15 | RAG | Local Qdrant vector store; ingest and semantic search over Jira / Google Drive (and later Wiki) for Knowledge Agent | P1 | Done (Jira + dbt main path) — Docker Qdrant, ingest CLI (Jira CSV / Drive zip / dbt semantic model), `fetch_related_jira_tickets` and `fetch_related_models` (Databot card candidates). Drive/Wiki search tools and eval still open |
| F16 | A2A Multi-Agent Composition | Compose multiple specialist agents via the [Agent-to-Agent (A2A)](https://google.github.io/A2A/) protocol to solve complex cross-domain problems; standardized task delegation, artifact handoff, status streaming, and Agent Card discovery | P1 | Not started — M4 today is in-process `AgentChain`; target is A2A endpoints for Databot / Knowledge / future diagnostic agents, orchestrated via A2A tasks |

---

## Future optimization opportunities

Items marked **Done** mean the main path works. The list below is optional deepening and does not block closing those milestones/features.

### Milestone-related

| Related | Possible follow-ups |
|---------|---------------------|
| M2 | Dedicated retrieval eval set; SQL gate request-changes redraft loop; user-facing chat status copy (not inner monologue); chart gate / Superset emit; see [DATABOT_V2_PROGRESS.md](DATABOT_V2_PROGRESS.md) and [CHAT_OPTIMIZATION.md](CHAT_OPTIMIZATION.md) |
| M3 | Drive / Wiki / code search tools and Knowledge prompts; soak Intent composite chains against a real knowledge corpus; see [rag/README.md](../rag/README.md) |
| M4 | Plan-confirmation HITL; richer structured handoff payloads |
| M4 | A2A cross-service orchestration (F16): expose specialists as A2A endpoints + Agent Cards; Intent / orchestrator composes databot, knowledge, future diagnostic via A2A tasks + artifacts; remote auth, timeouts, and degradation |
| M5 | Still tracked as not started (diagnostic agent) |
| M6 | Production deploy, auth, multi-tenant, observability (F10); checkpoint / thread management; full Intent web UI (Databot specialist UI is the current focus); Plan-page gate modal is decision-only (no Cards checkboxes / SQL editor) |

### Feature-related

| Related | Possible follow-ups |
|---------|---------------------|
| F1 | Dynamic per-turn / per-intention tool-description assembly |
| F2 | Typed / JSON schema for user-facing replies |
| F3 | Cross-session semantic recall (beyond profile + checkpointer) |
| F5 | Generic Plan node (not only Intent orchestration); plan revise / replan; cross-agent task decomposition when combined with F16 A2A |
| F6 | General confirmation gates (writes, costly tools, confirm-before-plan-run); chart gate web UI; fold Databot profile sidecar into `UserProfile`; Plan gate modal is decision-only (no Cards checkboxes / SQL editor) |
| F7–F8, F10–F13 | F7/F8/F10–F13 still not started (reflection, parallel tools, monitoring, semantic cache, model routing, procedural memory); F9 eval — see **F9 Eval Loop** below |
| F16 | Agent Card registration and discovery; map A2A tasks / artifacts to existing handoff structures; align with M6 service deploy (auth, observability, multi-tenant) |
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

*Last updated: 2026-09-01*
