# TahoePilot Project Roadmap

An AI Agent platform for data teams: chatbot, intelligent data retrieval, team knowledge Q&A, data diagnosis, development assistance, and data analysis.

**Current version**: 0.1.0  
**Tech stack**: Python 3.11+ · LangGraph · LangChain · OpenAI · Hive HMS · Trino · MCP · Qdrant

---

## Milestones

| ID | Milestone | Description | Status |
|----|-----------|-------------|--------|
| M0 | Conversational | Multi-turn chat in the CLI; call Hive/Trino/MCP tools to get results | Done — generic ReAct graph + pluggable `--agent`; see the optimization log |
| M1 | Resumable | Conversation state persists; pick up where you left off; long-context management | Done — checkpointed sessions + `--session`; context compression (F4) wired in |
| M2 | Data retrieval | Describe data needs in natural language; Agent finds tables, writes SQL, returns results | Done — glossary-first → metadata/lineage → read-only SQL; the databot specialist v2 staged state machine (fetch → cards gate → SQL gate → execute) + web retrieval panel (CopilotKit v2) |
| M3 | Knowledge Q&A | Ask about Tahoe team knowledge — codebase, Google Docs, Wiki/FAQ, Jira; Agent retrieves and explains | Done (v1) — the knowledge specialist (`--agent knowledge` / Intent knowledge); Jira Qdrant search; DataHub + read-only K8s. Drive zip ingest works; codebase / Wiki / Drive search tools remain follow-ups |
| M4 | Collaborative | Complex tasks split across specialized agents that pass intermediate results | Done (in-process) — the routing orchestrator composite intentions → an execution plan → delegated specialist runs; upstream feeds downstream; ephemeral specialist sessions. Cross-service composition: F16 (A2A) |
| M5 | Diagnostic | Describe data anomalies; Agent runs quality checks, reasons about root cause, produces reports | Not started |
| M6 | Deployable | Move from local CLI to an outward-facing service (UI, API, auth, observability) | In progress (local) — Next.js + CopilotKit v2 + LangGraph AG-UI dev stack (Databot chat, gates, Cards/SQL/Results panel); outward API, auth, production deploy, and observability remain |

## Features

| ID | Feature | Description | Priority | Status |
|----|---------|-------------|----------|--------|
| F1 | Context Engineering | Dynamic assembly of system prompt, context snippets, and tool descriptions | P0 | Done — layered layered prompt assembly + the user profile injection |
| F2 | Structured Output | Structured output constraints (typed response, JSON schema) | P0 | Done — intent a structured routing decision / plan steps, profile refine |
| F3 | Memory | Cross-session state persistence; user preferences and historical context retrieval | P0 | Done — checkpointer sessions (hydrate once per process) + in-memory in-memory session state + stored profiles / profile refinement |
| F4 | Memory Compression | Auto-compress/summarize long conversations; retain key facts within context window | P0 | Done — three-layer compression pipeline + conversation compression |
| F5 | Planning | Task planning and decomposition; Plan-and-Execute | P1 | Done — Intent ordered an execution plan + specialist chains execution |
| F6 | Human-in-the-Loop | Interrupt at key nodes; wait for user confirmation or input | P1 | Done — Intent low-confidence clarification interrupt + CLI resume; Databot v2 cards/SQL human gates (AG-UI v2 interrupt + CopilotKit Gate / Artifact panel, card selection and SQL editing) |
| F7 | Reflective Reasoning | Self-review and correction before delivery (consistency checks, retry) | P1 | Not started |
| F8 | Parallel Tool Use | Parallel tool invocation and result aggregation | P1 | Not started |
| F9 | Eval Loop | Eval set regression; continuous iteration on prompts and agent behavior | P2 | Done (v1) — evaluation cases case JSON + trace-based scoring scoring (tool order / rounds / answer) + the evaluation runner |
| F10 | Monitoring | Token usage, cache hit rate, tool call latency and error rate | P2 | Not started |
| F11 | Semantic Cache | Semantically similar requests hit cache; avoid redundant reasoning | P2 | Not started |
| F12 | Model Routing | Dynamic model selection by task complexity and cost | P2 | Not started |
| F13 | Procedural Memory | Distill reusable tool-call sequences and workflows from successful interactions | P3 | Not started |
| F14 | Error Handling | Classify, retry, and degrade on LLM/tool failures; friendly errors and recoverable interrupts | P1 | Done — TOOL ERROR, transient retries, Hive↔Trino anti-oscillation, CLI-friendly errors |
| F15 | RAG | Local Qdrant vector store; ingest and semantic search over Jira / Google Drive (and later Wiki) for Knowledge Agent | P1 | Done (Jira + dbt main path) — Docker Qdrant, ingest CLI (Jira CSV / Drive zip / dbt semantic model), related ticket lookup and related model lookup (Databot card candidates). Drive/Wiki search tools and eval still open |
| F16 | A2A Multi-Agent Composition | Compose multiple specialist agents via the [Agent-to-Agent (A2A)](https://google.github.io/A2A/) protocol to solve complex cross-domain problems; standardized task delegation, artifact handoff, status streaming, and Agent Card discovery | P1 | Not started — M4 today is in-process specialist chains; target is A2A endpoints for Databot / Knowledge / future diagnostic agents, orchestrated via A2A tasks |
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
| F9 | [#24](https://github.com/jixiedev/tpilot/issues/24) Observability eval harness with JSON cases, trace-based scoring traces, and CLI scorers |
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
| M2 | Dedicated retrieval eval set; SQL gate request-changes redraft loop; user-facing chat status copy (not inner monologue); chart gate / Superset emit; see the Databot v2 progress notes and the optimization log |
| M2 | Databot runtime refactor (F17): layered graph, embeddable under Plan and other hosts, clear working state after the turn summary; see **F17 Databot runtime** |
| M3 | Drive / Wiki / code search tools and Knowledge prompts; soak Intent composite chains against a real knowledge corpus; see the knowledge base documentation |
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
| F6 | General confirmation gates (writes, costly tools, confirm-before-plan-run); chart gate web UI; fold Databot profile sidecar into the user profile |
| F7–F8, F10–F13 | F7/F8/F10–F13 still not started (reflection, parallel tools, monitoring, semantic cache, model routing, procedural memory); F9 eval — see **F9 Eval Loop** below |
| F16 | Agent Card registration and discovery; map A2A tasks / artifacts to existing handoff structures; align with M6 service deploy (auth, observability, multi-tenant) |
| F17 | See **F17 Databot runtime** below |
| F14 | Failure metrics; broader integration-test coverage |
| F15 | Google Drive / Wiki search tools; incremental refresh and dedupe; retrieval quality eval; multi-collection routing |

### F9 Eval Loop (v1 → next)

**Shipped (v1)** — repo-local JSON cases, trace-based scoring traces, the evaluation runner:

| Case type | Scores |
|-----------|--------|
| ReAct (a tool-call case) | Tool order (subsequence), ReAct round budget, JSON answer fields (shape in case `query`; empty `answer` skips) |
| Intent (a routing case) | Router status, intention labels, specialist route order (without executing the plan) |

**Strengths** — simple, git-versioned, no SaaS; fits ReAct + Intent wiring; deterministic scorers are unit-testable; checks process (tools/router), not just final text.

**Limits** — live LLM + external deps (Qdrant/MCP) are flaky in CI; JSON field equality misses paraphrases; tool args not checked; equal-weight dimensions; shape/answer duplicated in cases; little multi-turn / clarify eval; no trace archive or experiment diff; eval JSON contract may diverge from production UX.

**Mainstream pattern** — dataset rows → run (live / mock / replay) → **multiple scorers** (deterministic + optional LLM judge + environment outcome) → report & gates; platforms (LangSmith, Langfuse, Braintrust, etc.) persist traces and compare runs. Typical CI: L0 scorer unit tests → L1 mock LLM/tools → L2 smoke live → L3 nightly integration → L4 sampled LLM judge.

**Proposed phases**

| Phase | Focus |
|-------|--------|
| **1 — Stabilize CI** | Fast (mock intent routing + scorer tests) vs slow (live integration); weighted or gated scorers; tool-argument checks; case tags (`smoke` / `integration`) |
| **2 — Richer deterministic eval** | Optional JSON Schema; single source for shape + expected fields; multi-turn clarify fixtures; golden trace replay |
| **3 — Traces & experiments** (with F10) | Persist trace-based scoring payloads; run id + git sha; per-case diff between prompt/agent versions |
| **4 — Semantic / RAG eval** (with F15) | Sampled LLM judge; faithfulness / recall on Jira corpus; separate eval vs production prompts where JSON distorts UX |
| **5 — Product eval** (with M6) | Dedicated M2/M3 datasets; online trace sampling; eval API in service |

**Next steps** — case `tags` + CLI filter; mock-LLM intent cases in CI; document env deps per group; scorer weights in case JSON; spike one-run trace JSON export from trace-based scoring.

### F17 Databot runtime

Turn Databot from a tightly coupled state machine on a flat state into an embeddable specialist. The retrieval path stays: find tables, write SQL, execute, and answer. What changes is the graph's layering, where state lives, and whether human confirmation interrupts the host by default.

**Current state**

- The outer graph places table discovery, both human gates, SQL authoring, and execution on one layer. Route maps name each other's nodes, and `stage` is bound to the edges. Adding a path means editing several routers.
- the pipeline state is a flat set of fields. Nodes change it by returning a JSON patch. The code reads as a function handing back a dict, where the step should read as an operation on the Agent.
- The cards and SQL gates sit on the main path. When Plan or another host calls Databot as one step, the interrupt surfaces in the host conversation.
- After a retrieval turn, a new user message resets pipeline artifacts and starts fetch again. Knowledge Q&A is not part of the Databot graph.

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

## Chat optimizations so far

From July to November 2026 the team logged each change to how chat behaves. This section groups those changes by what you notice, not by date. Each bullet says what changed and why it matters to you.

### Conversation and sessions

- **July 2026.** You chat over many turns in the terminal. The assistant calls Hive, Trino and MCP tools and answers in plain language. If an MCP server is unreachable, chat still starts with Hive and Trino.
- **July 2026.** Sessions are saved to a SQLite file. Reuse the same session name and you continue where you left off, even after a restart.
- **August 2026.** At startup, you see which MCP servers are reachable before you ask anything.
- **August 2026.** While you wait, the terminal shows status lines: the model is thinking, the router is choosing, a specialist is running. A long pause no longer looks like a hang.
- **August 2026.** The reply you see always belongs to this turn. Before, a turn that ended without an answer could show the previous answer again.
- **September 2026.** A turn ends when the assistant writes a reply and asks for no more tools. A turn that stalls now ends with an answer instead of looping.

### Context and memory

- **July 2026.** Long sessions stay coherent. Large tool results move to disk and leave a short preview the assistant can reopen. Older history is summarized, recent turns stay as written, and the full record is archived.
- **August 2026.** Earlier turns keep only your question and the answer. Their tool traces are archived, which leaves more room for the current turn.
- **July 2026.** The assistant remembers you. A profile holds your identity, locale, preferences and favorite metrics, and it shapes every answer. After a turn, the assistant may add a lasting preference. The profile is stored per user, so it carries across sessions.
- **November 2026.** Your session and profile load once per process. Later turns do not re-read them from disk, so turns start faster.

### Routing and agents

- **August 2026.** Two specialists arrive: databot for data retrieval and knowledge for team knowledge. You can start one directly or let the router choose.
- **August 2026.** The router reads your question and hands it to a specialist. When it is unsure, it asks you a clarifying question and waits.
- **August 2026.** Specialists stop calling optional extra tools once they have enough evidence. You get the answer sooner.
- **September 2026.** Requests that need several specialists go to the plan specialist, which splits the work. The router stays fast: it hands your original question to exactly one agent.
- **November 2026.** Plan is chosen like any other specialist. The router can now also pick diagnostic, data_analysis and swe. Databot answers concrete data questions; open-ended exploration with Python and charts goes to data_analysis.
- **November 2026.** Each new question gets its own routing decision. Before, a second turn could reuse the first turn's question. When plan hands a step to databot, databot can still ask you to confirm.

### Data retrieval (Databot)

- **July 2026.** Data answers are read-only. Requests to change data are refused. Metric questions start from the DataHub glossary, and answers name the tables, fields and time range they used.
- **August 2026.** Databot works in stages: find candidate tables, write SQL, run it, summarize. Each stage sees only the tools it needs. The query runs only after the SQL is approved.
- **August 2026.** You get two review points: the table cards and the SQL. Approve, request changes with a comment, halt, or choose a dry run. A change request makes databot redraft with your feedback instead of repeating itself.
- **August 2026.** When the glossary and a dbt model disagree on a metric, databot flags the conflict. It does not edit either one.
- **September 2026.** Every finished query ends with a chat summary of the models, SQL, results and conflicts. The summary answers your original question, not your review comments.
- **September 2026.** A follow-up question reruns the full retrieval with the chat history as context. Extending an earlier answer, such as adding a country breakdown, can reuse tables you already approved.
- **October 2026.** If the model search fails or finds nothing, the table step can finish empty instead of getting stuck.
- **November 2026.** Databot checks the tables you approved in earlier questions before it searches again. Each approved turn records the question, tables and SQL.
- **November 2026.** Databot handles retrieval only. Knowledge questions go to the knowledge specialist.
- **November 2026.** A typo or blank review reply now asks again. Before, it counted as a dry run and could run the query. Halted turns save nothing, and the dry-run message matches what happens.

### Knowledge search

- **August 2026.** Knowledge searches Jira tickets in a local Qdrant store. Google Drive exports can be loaded too. Text is embedded on your machine by default, so no paid embedding service is needed.
- **August 2026.** Knowledge reads the DataHub catalog, glossary, lineage, sample queries and schema fields, and has read-only views of Kubernetes. It searches Jira only for past work, not as a default extra step.
- **August 2026.** Your dbt semantic models are indexed, so databot can propose table cards from them.
- **September 2026.** Search combines meaning and keyword matching, then reranks the hits. Long documents split at their headings. A long loading job can stop and resume, and a failed batch is never marked complete.
- **October 2026.** The search models download once, ahead of time. Searches no longer stall on a network fetch.

### Tools and error recovery

- **July 2026.** A failed tool returns a clear error with a hint. Connection and timeout errors retry on their own. If Hive fails, the assistant may try Trino, but it does not bounce between the two. Model rate limits and timeouts come back as plain guidance.
- **August 2026.** General tools arrive: a shell, Python, a file editor, web search, read-only S3 and a planning tool. The Trino query tool rejects anything that changes data.
- **August 2026.** Conversation history is repaired before it is sent to stricter model providers, so an interrupted tool step no longer fails the next request.
- **November 2026.** The read-only guard also checks the statement inside an explain request. Every tool step counts toward the budget, and the last step at the limit answers in text instead of ending silently. Retryable Trino errors now retry.

### The web UI

- **August 2026.** Databot gets a web UI: chat beside a panel with Cards, SQL and Results tabs. You can toggle cards, edit the SQL, ask for a rewrite, and view results as a bar, line or pie chart, or a table.
- **September 2026.** Chat shows short status lines and the answer. The model's planning text and thinking stay hidden.
- **September 2026.** When a review opens, a banner in chat tells you what to do. Checkboxes refine the selection; the review buttons move the work forward. Each button says why you might pick it, and a summary lists the chosen models and metrics.
- **September 2026.** New chat resets cleanly. Chat and the panel no longer squeeze each other, and the look is refreshed.
- **November 2026.** The tabs follow four phases: prepare cards, prepare SQL, run SQL, summary. A new question in the web UI starts a fresh retrieval.

### Speed with local models

- **August 2026.** With a local Qwen model on Ollama, thinking is off, answers are shorter, and the first plain reply ends the turn. Simple turns no longer take minutes.
- **August 2026.** The local context window grows from about 4,000 to about 40,000 tokens, so tool-heavy turns fit. Glossary lookups return five terms at most.
- **August 2026.** Loading Jira with local embeddings uses bounded memory, so the job finishes. **September 2026.** On Apple Silicon, empty keyword weights fall back to another method instead of failing the job.

### Evaluation

- **August 2026.** A regression suite checks each case's tool order, round budget and answer fields. Router cases check which specialist was chosen without running it.
- **August 2026.** A case can name several models, and its score is their average, so results do not depend on one default model.
- **November 2026.** Cases that need no tools can now reach a full score.

### What this summary leaves out

Entries that only reorganized the code, such as renames, merged packages and per-agent settings files, change nothing you see. Fixes to the local development setup are left out too.

---

*Last updated: 2026-10-30*
