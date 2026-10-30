# TahoePilot Project Roadmap

> [Chinese (ROADMAP.md)](ROADMAP.md) | English

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
| M6 | Deployable | Move from local CLI to an outward-facing service (UI, API, auth, observability) | In progress (local) — Next.js + CopilotKit v2 + LangGraph AG-UI dev stack (Databot chat, gates, Cards/SQL/Results panel); outward API, auth, production deploy, and observability remain |

## Features

| ID | Feature | Description | Priority | Status |
|----|---------|-------------|----------|--------|
| F1 | Context Engineering | Dynamic assembly of system prompt, context snippets, and tool descriptions | P0 | Done — layered `SystemPromptAssembler` + `UserProfile` injection |
| F2 | Structured Output | Structured output constraints (typed response, JSON schema) | P0 | Done — intent `IntentionResponse` / plan steps, profile refine |
| F3 | Memory | Cross-session state persistence; user preferences and historical context retrieval | P0 | Done — checkpointer sessions + `FileProfileStore` / `refine_user_profile` |
| F4 | Memory Compression | Auto-compress/summarize long conversations; retain key facts within context window | P0 | Done — three-layer compression pipeline + `compact_context` |
| F5 | Planning | Task planning and decomposition; Plan-and-Execute | P1 | Done — Intent ordered `execution_plan` + AgentChain execution |
| F6 | Human-in-the-Loop | Interrupt at key nodes; wait for user confirmation or input | P1 | Done — Intent low-confidence clarification interrupt + CLI resume; Databot v2 cards/SQL human gates (AG-UI v2 interrupt + CopilotKit Gate / Artifact panel, card selection and SQL editing) |
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
| F17 | Databot runtime | Make Databot an embeddable specialist: layered graph, in-process responsibility objects, nodes that advance by operating on the Agent; leveled HITL defaulting to off; a retrieval turn ends with a summary and a cleared working state | P1 | Not started — see **F17 Databot runtime** below |

GitHub issues:

| ID | Issue |
|----|--------|
| F1 | [#15](https://github.com/jixiedev/tpilot/issues/15) Dynamic per-agent system prompt assembly with user profile injection |
| F2 | [#16](https://github.com/jixiedev/tpilot/issues/16) Schema-validated intent detection, execution plans, and profile refinement |
| F3 | [#12](https://github.com/jixiedev/tpilot/issues/12) SQLite-backed LangGraph checkpoints and file-backed user profiles |
| F4 | [#13](https://github.com/jixiedev/tpilot/issues/13) Three-layer conversation compression with tool result offload to disk |
| F5 | [#21](https://github.com/jixiedev/tpilot/issues/21) Multi-step intent orchestration with ephemeral specialist agent chains |
| F6 | [#20](https://github.com/jixiedev/tpilot/issues/20) AG-UI human gates for intent clarification and Databot card and SQL approval |
| F7 | [#22](https://github.com/jixiedev/tpilot/issues/22) Pre-delivery self-check and retry against tool evidence before final reply |
| F8 | [#23](https://github.com/jixiedev/tpilot/issues/23) Safe parallel tool execution within a ReAct turn and stage subgraphs |
| F9 | [#24](https://github.com/jixiedev/tpilot/issues/24) Observability eval harness with JSON cases, Observer traces, and CLI scorers |
| F10 | [#25](https://github.com/jixiedev/tpilot/issues/25) Production metrics for LLM tokens, tool latency, cache hits, and error rates |
| F11 | [#26](https://github.com/jixiedev/tpilot/issues/26) Embedding-based semantic request cache with version-aware invalidation |
| F12 | [#27](https://github.com/jixiedev/tpilot/issues/27) Configurable LLM tier selection by task complexity and cost budget |
| F13 | [#28](https://github.com/jixiedev/tpilot/issues/28) Learn and suggest proven multi-tool workflows from successful agent turns |
| F14 | [#14](https://github.com/jixiedev/tpilot/issues/14) Structured tool errors, transient retries, and Hive–Trino fallback guardrails |
| F15 | [#17](https://github.com/jixiedev/tpilot/issues/17) Qdrant RAG ingest, hybrid retrieval, and search tools for specialists |
| F16 | [#29](https://github.com/jixiedev/tpilot/issues/29) Cross-service specialist orchestration via the Agent-to-Agent (A2A) protocol |
| F17 | [#18](https://github.com/jixiedev/tpilot/issues/18) Layered Databot graph · [#19](https://github.com/jixiedev/tpilot/issues/19) In-process Databot state |
| M5 | [#30](https://github.com/jixiedev/tpilot/issues/30) Data diagnostic specialist for anomaly checks and root-cause reports |
| M6 | [#31](https://github.com/jixiedev/tpilot/issues/31) Production deploy with public API, auth, multi-tenant ops, and full intent web UI |

---

## Future optimization opportunities

Items marked **Done** mean the main path works. The list below is optional deepening and does not block closing those milestones/features.

### Milestone-related

| Related | Possible follow-ups |
|---------|---------------------|
| M2 | Dedicated retrieval eval set; SQL gate request-changes redraft loop; user-facing chat status copy (not inner monologue); chart gate / Superset emit; see [DATABOT_V2_PROGRESS.md](DATABOT_V2_PROGRESS.md) and [CHAT_OPTIMIZATION.md](CHAT_OPTIMIZATION.md) |
| M2 | Databot runtime refactor (F17): layered graph, embeddable under Plan and other hosts, clear working state after the turn summary; see **F17 Databot runtime** |
| M3 | Drive / Wiki / code search tools and Knowledge prompts; soak Intent composite chains against a real knowledge corpus; see [rag/README.md](../rag/README.md) |
| M4 | Plan-confirmation HITL; richer structured handoff payloads |
| M4 | A2A cross-service orchestration (F16): expose specialists as A2A endpoints + Agent Cards; Intent / orchestrator composes databot, knowledge, future diagnostic via A2A tasks + artifacts; remote auth, timeouts, and degradation |
| M5 | Still tracked as not started (diagnostic agent) |
| M6 | Production deploy, auth, multi-tenant, observability (F10); checkpoint / thread management; full Intent web UI (Databot specialist UI is the current focus) |

### Feature-related

| Related | Possible follow-ups |
|---------|---------------------|
| F1 | Dynamic per-turn / per-intention tool-description assembly |
| F2 | Typed / JSON schema for user-facing replies |
| F3 | Cross-session semantic recall (beyond profile + checkpointer) |
| F5 | Generic Plan node (not only Intent orchestration); plan revise / replan; cross-agent task decomposition when combined with F16 A2A |
| F6 | General confirmation gates (writes, costly tools, confirm-before-plan-run); chart gate web UI; fold Databot profile sidecar into `UserProfile` |
| F7–F8, F10–F13 | F7/F8/F10–F13 still not started (reflection, parallel tools, monitoring, semantic cache, model routing, procedural memory); F9 eval — see **F9 Eval Loop** below |
| F16 | Agent Card registration and discovery; map A2A tasks / artifacts to existing handoff structures; align with M6 service deploy (auth, observability, multi-tenant) |
| F17 | See **F17 Databot runtime** below |
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

### F17 Databot runtime

Turn Databot from a tightly coupled state machine on a flat state into an embeddable specialist. The retrieval path stays: find tables, write SQL, execute, and answer. What changes is the graph's layering, where state lives, and whether human confirmation interrupts the host by default.

**Current state**

- The outer graph places table discovery, both human gates, SQL authoring, execution, follow-up classification, and knowledge follow-up on one layer. Route maps name each other's nodes, and `stage` is bound to the edges. Adding a path means editing several routers.
- `DatabotState` is a flat set of fields. Nodes change it by returning a JSON patch. The code reads as a function handing back a dict, where the step should read as an operation on the Agent.
- The cards and SQL gates sit on the main path. When Plan or another host calls Databot as one step, the interrupt surfaces in the host conversation.
- After a retrieval turn, pipeline fields stay in state. The next user message first runs follow-up classification (knowledge question vs new query), then either a knowledge subgraph or the full pipeline. That is an extra model call and a more tangled graph.

**Direction**

F17 is two pieces of work, built and accepted separately. They meet at one contract: the graph decides how a turn finishes (it ends after the summary); state clears this turn's working objects once that summary is in the conversation.

### Graph

| Point | Approach |
|-------|----------|
| Layering | The outer layer orchestrates one retrieval turn: prepare → retrieve → summarize and finish. Card selection, SQL, and execution live in inner layers. An inner router sees only the next step in its own layer, and does not name every outer node. |
| HITL levels, default off | Human confirmation is a configurable level, defaulting to disable. It is not a required edge on the main path. Embedded in a Plan agent, Databot runs as an ordinary step. The caller turns on card review, SQL review, or both. Platform-level confirmation stays with F6. |
| The turn ends at the summary | The end of a retrieval turn is a summary written into the conversation, and then the graph finishes. The next user message is a new turn. Context continues through that summary and existing conversation compression (F4). |

This piece removes follow-up intention classification and the graph path that continues from the previous result. Clarifications and revised asks are new turns, with the previous summary as context.

### Agent state

| Point | Approach |
|-------|----------|
| Nodes operate on the Agent | Business nodes advance the turn by calling operations on the Agent. Returning a state JSON is not their interface. LangGraph still requires a node to submit a state update to the runtime. That translation sits in an adapter, so checkpoints and the graph engine stay compatible. |
| In-process responsibility objects | Inside the Agent, split objects by responsibility (cards, SQL, execution result, turn summary) in place of one flat dict. The objects live in the process. The checkpoint keeps only the minimum snapshot required to resume a pause, and does not promote every intermediate structure to a graph-state field. |
| Clear after the summary | Once the summary is in the conversation, clear this turn's working objects. The next turn starts from an empty working state. |

LangGraph stays the engine. Nodes still submit a checkpointable update; that conversion stays in the adapter.

**Related**: structure of the M2 retrieval path. When embedded in F5 Plan / M4 in-process orchestration, Databot does not take HITL by default. The graph refactor uses the "nodes advance through operations" interface, so the objects and the adapter land first.

---

*Last updated: 2026-10-30*
