# Optimization Log

Iterative optimization notes for the conversational CLI agent. Each round adds a section; only important optimization points are recorded.

---

## 2026-07-05 — Idle nudge toward chat_completion

**Goal**: When the model returns plain text, remind it to call `chat_completion`; cap idle retries at 3.

| Optimization | Before | After |
|--------------|--------|-------|
| Idle handling | Loop back to `step_llm` silently until idle limit | On idle, inject ephemeral system nudge to call `chat_completion` or data tools |
| Idle limit | 5 plain-text retries before forced END | 3 plain-text retries before forced END |

---

## 2026-07-05 — chat_completion turn finalization

**Goal**: In the chatbot graph, force the model to end each turn via `chat_completion(reply=...)` instead of plain text.

| Optimization | Before | After |
|--------------|--------|-------|
| Turn ending | Graph ended when the model returned text without tool calls | Plain text loops back to `step_llm`; turn ends only after `chat_completion` runs in the tool node |
| User reply | Taken from the last AI message content | Taken from the `reply` argument via `chat_completion` ToolMessage |
| Tool scope | N/A | `chat_completion` is registered only in the chatbot graph, not in standalone data tool sets |

---

## 2026-07-05 — Session history boundaries in prompts

**Goal**: Tell the LLM which messages are prior session state vs the current turn request.

| Optimization | Before | After |
|--------------|--------|-------|
| Turn framing | Full message list with no structural hint | `PromptLayout` inserts a turn boundary before each new user message when history exists |
| Prompt guidance | LLM inferred context from flat history | System and step prompts describe session layout and boundary semantics |

---

## 2026-07-05 — Dual prompts and session-scoped history

**Goal**: Separate session-level system prompt from per-step tool guidance; isolate conversation history by session id.

| Optimization | Before | After |
|--------------|--------|-------|
| Prompt roles | Single system prompt covered both role definition and tool-step guidance | `system_prompt` node injects session rules once; `step_llm` receives ephemeral `NEXT_STEP_PROMPT` on each LLM call without polluting history |
| Agent graph | Single `agent` node handled everything | `system_prompt` → `step_llm` ↔ `tools`; step node owns bind_tools and tool-direction turns |
| Session state | REPL held one in-memory state; no lookup by user | `StateStore` + `StateProcessor` load/save history per `--session`; different ids keep separate conversations in-process |

---

## 2026-07-05 — CLI multi-turn chat and tool calling

**Goal**: Multi-turn CLI chat with Hive / Trino / MCP tool calls and natural-language replies.

| Optimization | Before | After |
|--------------|--------|-------|
| Application entry | `main.py` was a mock; the real graph was not wired in and no usable session could be started | Single CLI REPL entry with multi-turn input and optional `-v` tool trace |
| Agent orchestration | Two overlapping LLM nodes; conditional routing conflicted with a direct END edge; tool loop was unreliable | Standard ReAct loop (agent ↔ tools) with predictable routing |
| Tool calling | Model was not bound to tools; `invoke` received the wrong input; the tool chain never ran | `bind_tools` plus messages-based invocation; reasoning and execution form a closed loop |
| Tool registry | Hive and Trino exported conflicting names (`list_tables`, etc.) | Namespaced by data source (`hive_*`, `trino_*`) |
| MCP integration | Missing config or connection failure blocked startup entirely | Optional load; falls back to Hive + Trino on failure |
| Secret configuration | API key stored in plain text in TOML; default model unset | Key from environment variables; TOML holds structure only; default model validated at startup |
| Conversation mode | Single empty `invoke`; no multi-turn history | REPL loop with in-process message history |
| System prompt | Empty content; system message re-appended every turn, wasting tokens | Role and tool rules defined once at session init |

---

## 2026-07-07 — Multi-agent layout decoupling

**Goal**: Separate shared infrastructure from the chatbot application so new agents can plug in without changing `graph/` or `state/`.

| Optimization | Before | After |
|--------------|--------|-------|
| Graph builder | `build_chat_graph` hardcoded Hive/Trino/MCP + chatbot routes and tools | Generic `build_react_graph` accepts tools and route functions; chatbot assembles in `agent/chatbot/graph.py` |
| Routing | Chatbot `chat_completion` rules lived in `graph/edge.py` | Chatbot routes in `agent/chatbot/routes.py`; `graph/edge.py` keeps shared helpers only |
| Prompts & turn tools | `prompt/` at repo root; `chat_completion` in `tools/chat.py` | Per-agent directory `agent/chatbot/` owns prompts, session boundary, and `chat_completion` |
| CLI entry | REPL wired directly to chatbot prompts and graph | `cli.py` at project root; `agent/registry.py` + `--agent`; CLI delegates to `AgentSpec` |
| Session state | `state/` imported chatbot prompt constants | `StateProcessor.begin_turn` accepts optional `turn_boundary` from the agent |

---

## 2026-07-06 — LangGraph checkpointer replaces StateStore

**Goal**: Persist multi-turn conversation state via LangGraph checkpointer instead of a custom in-process store.

| Optimization | Before | After |
|--------------|--------|-------|
| Session persistence | `StateStore` + `StateProcessor` loaded/saved history per `--session` in CLI | LangGraph `checkpointer` with `thread_id`; graph state survives across turns automatically |
| Turn input | `begin_turn` / `finish_turn` merged state through processor | `prepare_turn_input` reads checkpoint for turn boundaries, then `ainvoke` with partial input |
| State module | `SessionAgentState` plus store/processor classes | `SessionAgentState` schema and helpers only |

---

## 2026-07-06 — SQLite checkpointer

**Goal**: Persist conversation checkpoints to disk so sessions survive process restarts.

| Optimization | Before | After |
|--------------|--------|-------|
| Checkpointer backend | In-memory `InMemorySaver` (lost on exit) | `AsyncSqliteSaver` writing to `checkpoints.sqlite` |
| Resume across runs | Same `--session` only worked within one process | Same `-s` + SQLite file resumes history after restart |
| Configuration | Hardcoded on `AgentSpec` | CLI `--checkpoint-db` / `TAHOEPILOT_CHECKPOINT_DB` |

---

## 2026-07-12 — Three-layer context compression

**Goal**: Keep long-running chatbot sessions coherent by offloading and summarizing stale context without discarding recoverable knowledge.

| Optimization | Before | After |
|--------------|--------|-------|
| Large tool results | Full payloads stayed in message history every turn | Oversized tool results offload to disk with preview + `read_offloaded_file` recovery |
| Write-tool arguments | Large ingest/write args remained in `AIMessage.tool_calls` | At high fill (or forced compact), args replace with offload pointers |
| Long history | Unbounded growth until the model window failed | Structured LLM summary of the head; recent tail kept; full archive on disk |
| Compression timing | None | Runs at turn start and after each tool batch; agent can force via `compact_context` |

---

## 2026-07-12 — Prompt cache vs compression (deferred)

**Goal**: Record how the compression pipeline interacts with provider prefix caching; revisit when prompt cache is enabled or F10 monitoring lands.

| Optimization | Before | After |
|--------------|--------|-------|
| Prompt cache | Not configured — `step_llm` sends raw messages with no cache breakpoints | Deferred; no code change yet |
| Layer 1 impact | Runs after every tool batch; replaces large tool-result content in-place | Within-turn prefix changes on each compress; prefix cache would miss if enabled |
| Layer 3 impact | Removes head, inserts summary, re-appends tail | Major prefix rewrite across turns; only `messages[0]` role prompt stays stable |
| Ephemeral step prompts | `NEXT_STEP_PROMPT` appended at tail each LLM call | Does not alter prefix; compress changes to history are the main invalidation source |
| Future options | — | Cache breakpoints on static system/tool schema; defer Layer 1 to turn end; append-only summaries; measure hit rate under F10 |

---

## 2026-07-13 — Structured tool error recovery (F14 initial)

**Goal**: Classify data-tool failures, return actionable TOOL ERROR messages, and retry transient faults without aborting the turn.

| Optimization | Before | After |
|--------------|--------|-------|
| Tool error surface | Generic `repr(exc)` ToolMessage from LangGraph defaults | Structured `=== TOOL ERROR ===` payload with type, hint, optional `fallback_tool`, retryable flag |
| Hive/Trino fallback | Forced `ToolFallbackError` / `error_type=fallback` | Decorator only registers plan B; real error type kept; LLM sees optional `fallback_tool` hint |
| Transient failures | No automatic retry within a tool batch | `wrap_tool_call` retries connection/timeout errors before returning the error ToolMessage |
| Node-level failures | Uncaught `step_tools` exceptions ended the CLI turn | `RetryPolicy` on `step_tools` plus `error_handler` routes back to `step_llm` with a recovery prompt |
| Mutual fallback loops | Hive↔Trino alternatives could oscillate across tool calls | Per-turn `failed_tools` state suppresses `fallback_tool` once the peer already failed |
| Trino SQL failures | Generic `repr(exc)` / keyword guessing | `TrinoUserError` / `TrinoExternalError` mapped to NOT_FOUND, SYNTAX, PERMISSION, CONNECTION with retry flags |
| LLM / turn failures | Generic CLI "Request failed"; no LLM retry | `step_llm` retries transient API errors; CLI prints rate-limit / timeout / connection guidance |

---

## 2026-07-14 — Per-turn task classification hook

**Goal**: Label each user turn before the ReAct loop so later routing can branch on task type without rewriting the graph core.

| Optimization | Before | After |
|--------------|--------|-------|
| Turn typing | No per-turn task label in state | Optional `classify_task` writes `turn_task_type` after system-prompt inject |
| Classification API | N/A / incomplete boolean flag | Enabled by passing `classify_prompt`; structured output only, no tools |
| History hygiene | Risk of stuffing classify chatter into `messages` | Classification exchange stays out of conversation history |
| Ambiguity | Forced single label even when unsure | Low confidence (or missing user text) maps to `unclear` |

---

## 2026-07-14 — Chatbot system prompt: read-only data contract

**Goal**: Make chatbot answers safely read-only and always evidence-backed for warehouse / metric work.

| Optimization | Before | After |
|--------------|--------|-------|
| Prompt structure | Flat role + mixed rules | Explicit Role, General rules, Data prohibitions / required practices / answer requirements |
| Warehouse safety | Soft "prefer read-only unless user asks otherwise" | Hard ban on mutating SQL and state-changing tools; refuse write requests |
| Metric grounding | Glossary cited when convenient | Must search DataHub glossary terms before answering metric/KPI questions |
| Evidence in replies | "full evidence" encouraged | Final data answers must name tables, fields, and query time range |

---

## 2026-07-14 — Layered system-prompt assemblers

**Goal**: Share a generic system-prompt core and let chatbot / data-retrieval agents add sections by inheritance.

| Optimization | Before | After |
|--------------|--------|-------|
| Prompt authorship | One flat `SYSTEM_PROMPT` string in chatbot | `SystemPromptAssembler` → `ChatbotSystemPrompt` → `DataRetrievalSystemPrompt` |
| Extension model | Copy-paste / rewrite whole prompt | Subclasses append via `extension_blocks()` + content hooks |
| Agent reuse | N/A | `DataRetrievalSystemPrompt` lives beside chatbot prompts and inherits chatbot data rules |

---

## 2026-07-14 — System prompt personalization via UserProfile

**Goal**: Include session user identity and preferences in the system prompt without hard-coding them at import time.

| Optimization | Before | After |
|--------------|--------|-------|
| Profile in prompt | Not used when assembling system text | `SystemPromptAssembler` renders optional `User profile` section |
| Profile schema | username / nested domain preferences | Identity, permissions, locale, long-term prefs, favorite metrics/dimensions |
| Inject timing | Fixed `SYSTEM_PROMPT` string at graph build | Chatbot inject callback rebuilds from `state["user_profile"]` |

---

## 2026-07-14 — End-of-turn user profile refinement

**Goal**: Learn lasting personalization from finished turns without rewriting conversation history.

| Optimization | Before | After |
|--------------|--------|-------|
| Profile updates | Static seed from process user only | Optional `refine_user_profile` after `chat_completion` |
| Update safety | Full-history rewrite risked wiping fields | Lean turn context + merge keeps blanks/`user_id` |
| Inject timing | Fixed `SYSTEM_PROMPT` string at graph build | Chatbot inject callback loads profile from `ProfileStore` via `user_id` |

---

## 2026-07-15 — User profile moved to filesystem ProfileStore

**Goal**: Persist personalization by `user_id` across sessions instead of duplicating profile inside each checkpoint thread.

| Optimization | Before | After |
|--------------|--------|-------|
| Profile storage | `user_profile` in session checkpoint | `FileProfileStore` (`profiles/{user_id}.json`) |
| Session state | Full profile blob per thread | `user_id` only; profile loaded/saved at inject and refine |
| Cross-session prefs | Lost on new `--session` | Same OS user reloads profile from disk |

---

## 2026-07-15 — Best-effort profile refine with GLM JSON tolerance

**Goal**: End-of-turn profile updates must not hide a successful `chat_completion` reply when the model returns markdown-fenced or loose JSON.

| Optimization | Before | After |
|--------------|--------|-------|
| Profile parse | `with_structured_output` only; fenced JSON crashed the turn | `parse_user_profile_update` strips fences and embedded JSON; plain-invoke fallback |
| Turn failure | `refine_user_profile` ValidationError aborted the whole graph | Refine is best-effort: log and skip save; user still sees the assistant reply |
| Provider quirks | Same GLM issue as turn classify | Shared JSON-coercion pattern for profile updates |

---

## 2026-07-15 — MCP server health check at agent startup

**Goal**: Surface MCP connectivity before the first user turn instead of failing mid-conversation on the first tool call.

| Optimization | Before | After |
|--------------|--------|-------|
| MCP visibility | Silent until first tool call; failures easy to misread | CLI probes each configured server and prints ok/unavailable with tool counts |
| Per-server status | Only aggregate `get_mcp_tools()` success/fail | `check_mcp_servers()` reports each entry in `mcp.json` independently |

---

## 2026-07-15 — `search_glossary_term` wrapper and anti-wildcard search rules

**Goal**: Stop metric lookups from degrading into generic `search("*")` after glossary tool errors.

| Optimization | Before | After |
|--------------|--------|-------|
| Glossary search | Model called raw MCP `search` with ad-hoc filters | `search_glossary_term` tries known GLOSSARY_TERM parameter variants |
| Failure handling | Vague "technical issues" and wildcard fallback | Prompt requires quoting tool errors; bans `*` search; stop or `chat_completion` after retries |

---

## 2026-07-16 — Make `search_glossary_term` sync-compatible

**Goal**: Glossary lookup must work under ToolNode's sync `invoke` path.

| Optimization | Before | After |
|--------------|--------|-------|
| Tool arity | Async-only `search_glossary_term` | Sync tool; bridges async MCP `search` when needed |
| Runtime error | `StructuredTool does not support sync invocation` | ToolNode can call `invoke` without failing |

---

---

## 2026-07-16 — Use native DataHub MCP tools for glossary lookup

**Goal**: Rely on MCP-exposed `search` and related tools instead of a TahoePilot wrapper.

| Optimization | Before | After |
|--------------|--------|-------|
| Glossary tool | Custom `search_glossary_term` wrapper around MCP `search` | MCP tools only; prompts document correct `filter` / `/q` arguments |
| Tool surface | Duplicate glossary entry in tool list | `load_data_tools` returns MCP + Hive + Trino unchanged |

---

## 2026-07-16 — ToolNode async wrapper for MCP tools

**Goal**: Native async MCP tools must run via `tool.ainvoke` under `graph.ainvoke`, without per-tool sync adapters.

| Optimization | Before | After |
|--------------|--------|-------|
| Tool execution path | Only sync `wrap_tool_call`; async graph fell back to `tool.invoke` | `awrap_tool_call` keeps async path on `tool.ainvoke` |
| MCP loading | Sync adapter wrapped every MCP tool at load time | `get_mcp_tools` returns native MCP tools unchanged |
| Runtime error | `StructuredTool does not support sync invocation` on MCP search | Async MCP tools execute normally in CLI turns |

---

## 2026-08-08 — OOP ReAct agents and Tahoe / Databot split

**Goal**: Replace chatbot module functions with reusable ReAct agent classes; keep Tahoe as a team base without data-domain coupling.

| Optimization | Before | After |
|--------------|--------|-------|
| Agent shape | Chatbot assembled via module-level graph/route/session helpers | `BaseReactAgent` + collaborators (`CompletionToolRouter`, `SessionTurnBuilder`, `CliReactListener`) |
| Tahoe role | Chatbot / Tahoe owned warehouse rules, glossary prompts, and data tools | `TahoeAgent` is Tahoe-team base: session, `chat_completion`, generic prompts only |
| Data retrieval | Same agent surface mixed general chat with retrieval contract | `DatabotAgent` subclasses Tahoe and owns data tools plus retrieval prompts |
| Extension path | New agents copied chatbot modules | New Tahoe-team agents subclass `TahoeAgent` and override prompts/tools |

---

## 2026-08-09 — Plan Knowledge agent (M3)

**Goal**: Add a Tahoe-team knowledge specialist alongside Databot, covering codebase and internal docs before multi-agent collaboration.

| Optimization | Before | After |
|--------------|--------|-------|
| Product scope | Specialists covered data retrieval only (`databot`) | Roadmap M3 = Knowledge Q&A; prior M3–M5 shift to M4–M6 |
| Agent role | No dedicated knowledge surface | `KnowledgeAgent` subclasses `TahoeAgent` for code learning and doc explanation |
| Knowledge sources | Unscoped team Q&A | Code repos, Google Docs, Wiki/FAQ, Jira (TAHOE / CORE / SQD) |
| Delivery path | N/A | Wire prompts/tools + `--agent knowledge` registry; collaboration (M4) can hand off to Knowledge |

---

## 2026-08-09 — Keep graph/ generic; agent owns product nodes

**Goal**: Confine `graph/` to shared ReAct topology; move product-specific nodes under the ReAct agent package.

| Optimization | Before | After |
|--------------|--------|-------|
| Classify / refine ownership | Lived in `graph/` and were constructed inside the generic builder | `agent/react/classify.py` and `refine_profile.py`; `BaseReactAgent` builds the nodes |
| Builder API | `build_react_graph` took classify/refine prompts and profile store | Builder accepts optional node callables only; no agent product imports |
| Layering | New agents risked editing `graph/` for product behavior | Product behavior extends via agent modules; `graph/` stays reusable |

---

## 2026-08-09 — IntentAgent router; remove ReAct classify_task

**Goal**: Route turns to DATA vs KNOWLEDGE via a dedicated intent graph; stop doing per-turn task labels inside ReAct.

| Optimization | Before | After |
|--------------|--------|-------|
| Intent routing | ReAct `classify_task` wrote fine-grained `turn_task_type` | `IntentAgent`: detect → review → clarify/publish/reject |
| Clarification | No mid-graph ask for ambiguous intent | Low-confidence interrupt; CLI resumes with `Prompt>` |
| Specialist target | Label unused for routing | Published `route_target` (`databot` / `knowledge`) |
| ReAct surface | Every Tahoe/Databot turn ran classify | Classify node/prompts/state field removed from ReAct |

---

## 2026-08-09 — Extensible intention → agent routes in registry

**Goal**: Declare specialist routing next to agent registration so new agents plug in without editing IntentAgent.

| Optimization | Before | After |
|--------------|--------|-------|
| Route table | Hardcoded `INTENTION_ROUTE_TARGET` in state | `AgentSpec.intention` (+ description); `resolve_route_target` / `intention_routes` |
| Adding specialists | Touch intent/state constants | Register agent with `intention="LABEL"` |
| Prompt labels | Fixed DATA/KNOWLEDGE copy | Built from `intention_catalog()` |

---

## 2026-08-09 — CLI intent → specialist handoff

**Goal**: After IntentAgent publishes a route, actually run the target specialist in the CLI.

| Optimization | Before | After |
|--------------|--------|-------|
| CLI after intent | Printed `Intent>` only | `Route> {agent}` then invoke specialist turn |
| Specialist lifecycle | N/A | Lazy cache per agent; checkpoint thread `{session}:{agent}` |
| Safety | N/A | Only agents with `AgentSpec.intention` accept handoff |

---

## 2026-08-09 — Agent owns bind/run; CLI is a thin REPL

**Goal**: Move graph build, invoke, interrupt resume, and intent handoff into the agent layer.

| Optimization | Before | After |
|--------------|--------|-------|
| Turn execution | CLI orchestrated prepare → ainvoke → print → route | `BaseAgent.bind` + `run`; CLI only reads input and calls `run` |
| Interrupts | CLI-owned resume loop | Shared `ainvoke_resolving_interrupts` via `on_interrupt` callback |
| Intent handoff | CLI special-cased routing | `IntentAgent.run` loads specialist and calls its `run` |

---

## 2026-08-09 — Composite intentions → plan → AgentChain

**Goal**: Treat every request as an ordered list of intentions; Intent plans a specialist chain, passes upstream outputs downstream, and returns the last agent’s result. Session memory stays on Intent; specialists are ephemeral workers.

| Optimization | Before | After |
|--------------|--------|-------|
| Task type shape | Single `user_intention` label | Always `user_intentions[]` (length 1 = simple; length >1 = composite) |
| Routing artifact | One `route_target` | Model-built ordered `execution_plan` (intention + per-step task); materializes as `PlannedAgentChain` |
| Specialist input | Re-sent original user question | Structured handoff: task background, this step’s assignment, upstream output, who/what is downstream |
| Specialist session | Shared `{session}:{agent}` thread (could accumulate history) | Ephemeral `{session}:plan:{run}:{step}` — no inherited conversation; Intent keeps multi-turn memory |
| Workflow result | First specialist reply (single hop) | Last plan step’s output is the turn result |
| Clarify / reject | Based on one label + confidence | Same gates; publish only when every listed intention is routable and plan resolves to agents |

Implementation notes (behavior only): detect emits intentions + plan steps; publish resolves agents and stores the plan; `IntentOrchestrator.run` executes the chain and surfaces the final specialist state.

---

## 2026-08-09 — Rename IntentAgent → IntentOrchestrator

**Goal**: Name the entry agent for planning + chain execution, not classification alone.

| Optimization | Before | After |
|--------------|--------|-------|
| Module / class | `agent/intent/intent.py` · `IntentAgent` | `agent/intent/orchestrator.py` · `IntentOrchestrator` |
| CLI / package | `--agent intent`, `agent/intent/` | Unchanged (still the intention entrypoint) |

---

## 2026-08-10 — Local Qdrant RAG for Jira knowledge

**Goal**: Give Knowledge agent a working Jira retrieval path: local Qdrant, ingest CLI, and a typed search tool.

| Optimization | Before | After |
|--------------|--------|-------|
| Vector store | Stub compose + empty helper | Pinned Qdrant compose with healthcheck; `config/rag.toml` for URL/embeddings |
| Ingest | Assumed non-Jira `title`/`id` columns | Jira CSV export headers; embed summary/description/comments; ensure collection |
| Agent tool | Broken `search` API + string `limit` | `fetch_related_jira_tickets` via `query_points`; wired into `load_knowledge_tools` / KnowledgeAgent |

---

## 2026-08-10 — Google Docs / Drive zip ingest for RAG (F15 / M3)

**Goal**: Index Google Drive folder downloads (Docs and related exports) into Qdrant the same way as Jira, via a directory + collection CLI.

| Optimization | Before | After |
|--------------|--------|-------|
| Google Docs path | M3 listed Google Docs as a knowledge source only | Drive zip downloads under a directory ingest into a named collection (`upload_google_drive`) |
| File handling | N/A | Unzip archives; extract text from Docs-style exports (docx/pdf/html/md/txt/xlsx); chunk long docs; skip media and Drive shortcuts |
| Operator surface | Jira-only ingest story | `python -m rag -t google_drive -p <dir> -c <collection>`; usage in `rag/README.md` |
| Roadmap | M3/F15 Docs still “open” with no ingest | F15 in progress includes Drive ingest; search tool for Drive collections still open |

---

## 2026-08-11 — Local BGE-M3 embeddings for RAG

**Goal**: Run RAG ingest/query without paid OpenAI embedding calls by default.

| Optimization | Before | After |
|--------------|--------|-------|
| Embedding backend | OpenAI-compatible HTTP only (`text-embedding-3-small`, 1536-d) | Default `provider=local` via `sentence-transformers` + `BAAI/bge-m3` (1024-d) |
| Secrets | Required `OPENAI_API_KEY` for any ingest | Local mode needs no embedding API key; `openai` provider still supported |
| Config | Fixed remote defaults in `rag.toml` | `provider` / `device` / env overrides; recreate Qdrant collections after dimension change |

---

## 2026-08-11 — Align DataHub tools with MCP GMS settings

**Goal**: Native DataHub GraphQL tools use the same GMS URL and token as `mcp-server-datahub`.

| Optimization | Before | After |
|--------------|--------|-------|
| Endpoint | Separate `graphql_url` + `DATAHUB_TOKEN` in `tools.toml` | `gms_url` / `DATAHUB_GMS_URL` + `DATAHUB_GMS_TOKEN`, GraphQL = `{gms}/api/graphql` |
| Config drift | MCP and HTTP tools could point at different hosts/tokens | Same env vars as `tools/mcp/mcp.json` datahub server |

---

## 2026-08-11 — Bound local BGE encode memory for Jira ingest

**Goal**: Stop local `BAAI/bge-m3` ingest from allocating multi‑GiB encode buffers on long Jira texts.

| Optimization | Before | After |
|--------------|--------|-------|
| Encode length | `max_chars=16000`, no `max_seq_length` cap | `max_seq_length=512` on the local model; `max_chars=2000` |
| Batch size | Default `batch_size=32` | Default `batch_size=8` for safer CPU/MPS runs |
| Failure mode | Batches fail with `Invalid buffer size: … GiB` | Ingest completes under bounded memory; raise caps only when hardware allows |
| Docs | Limits undocumented | Noted in `rag/README.md` (vector size stays **1024**; 512 is token length, not dimension) |

---

## 2026-08-12 — Faster local Ollama turns (no thinking, one idle)

**Goal**: Cut multi-minute delays on local `qwen3:8b` for simple CLI turns.

| Optimization | Before | After |
|--------------|--------|-------|
| Qwen3 thinking | OpenAI-compatible Ollama left thinking on by default | `extra_body.reasoning_effort=none` for `qwen3:8b` (`/v1` ignores `think`) |
| Plain-text idle | Up to 3 LLM retries when model skipped `chat_completion` | Cap at 1 idle round — first plain-text answer ends the turn |
| Local max tokens | `8192` encouraged long local generations | `2048` for `qwen3:8b` |

---

## 2026-08-12 — Knowledge treats Jira as task/history, not default

**Goal**: Stop Knowledge from searching Jira after routine glossary/catalog answers.

| Optimization | Before | After |
|--------------|--------|-------|
| Jira usage | Easy to treat as default “extra documentation” | Prefer catalog/glossary; Jira only for clear past-work asks or when other clues fail |
| Tool description | Generic incident/ownership wording | Same gate: not a default follow-up for metric/definition questions |

---

## 2026-08-12 — Tahoe next-step biases to reply early

**Goal**: Stop Tahoe-based agents from chaining optional tools after they already have enough to answer.

| Optimization | Before | After |
|--------------|--------|-------|
| Next-step default | Emphasized gathering / what is still missing | Bias to `chat_completion` once evidence is enough; tools only for required gaps |
| Offload / extras | Easy to keep exploring | `read_offloaded_file` only if preview cannot answer; no nice-to-have follow-up tools |

---

## 2026-08-12 — Compact DataHub glossary tool results

**Goal**: Keep glossary answers in-context so agents stop wandering after a successful GMV lookup.

| Optimization | Before | After |
|--------------|--------|-------|
| Glossary payload | Full hydration (owners, domains, broad relationships) → huge offload | Compact definition fields only (name, description, aggregation, source table, key URNs) |
| Agent behavior | Truncation/offload → extra dataset searches / retries | Model can read calculation text and reply |

---

## 2026-08-12 — Raise local Qwen Ollama context window

**Goal**: Stop tool-heavy Knowledge turns from running in Ollama’s default 4k context.

| Optimization | Before | After |
|--------------|--------|-------|
| Runtime `num_ctx` | Ollama loaded `qwen3:8b` at **4096** (model max ~40k unused) | Derived `qwen3-ctx40k` with `PARAMETER num_ctx 40960` (default); 16k tag kept optional |
| Glossary page size | Default `count=10` still bulky for small local models | Default/cap **5** compact terms |

---

## 2026-08-12 — Native DataHub query, lineage, and schema tools

**Goal**: Give agents sample SQL, multi-hop lineage, and paginated schema fields without relying only on MCP.

| Optimization | Before | After |
|--------------|--------|-------|
| Sample queries | No native access to real SQL usage | `datahub_get_dataset_queries` via `listQueries` |
| Lineage depth | 1-hop snippets inside list hydration | `datahub_get_lineage` / `datahub_get_lineage_paths_between` via `searchAcrossLineage` |
| Large schemas | Full field lists inside dataset hydration | `datahub_list_schema_fields` with keyword filter and pagination |

---

## 2026-08-13 — Knowledge agent uses DataHub MCP

**Goal**: Give Knowledge the same DataHub MCP catalog tools as Databot (`search`, lineage, entities).

| Optimization | Before | After |
|--------------|--------|-------|
| Catalog tools | Native `datahub_list_*` GraphQL only | Prefer configured `datahub` MCP server; fall back to native if MCP missing |
| Prompt | Generic “prefer DataHub” | Explicit MCP `search` / URN / lineage usage rules for glossary and asset traces |

---

## 2026-08-13 — Cross-turn history keeps Q&A only

**Goal**: Free context for the current tool loop by dropping prior-turn tool trajectories.

| Optimization | Before | After |
|--------------|--------|-------|
| Prior turns | Full AI/tool traces stayed until Layer-3 LLM summary | Keep Human + `chat_completion` (plus role/boundary/summary system messages); archive discarded tools |
| Current turn | Same | Unchanged — full tool trail retained after the latest Human message |

---

## 2026-08-13 — Read-only Kubernetes tools for Knowledge

**Goal**: Let Knowledge inspect Tahoe cluster namespaces without importing a live kube client at startup.

| Optimization | Before | After |
|--------------|--------|-------|
| Tool surface | Raw helper methods, import-time kubeconfig, huge API objects | LangChain `k8s_*` tools with compact pod/deploy/event/CR summaries |
| Safety | Could delete unusable kubeconfig on failure | Lazy load; errors become `K8sToolError`; no file deletion |
| Wiring | Not in agent tool loaders | Included in Knowledge tools + prompt guidance for platform namespaces |

---

## 2026-08-19 — Janus-aligned general tools

**Goal**: Give TahoePilot the same local coding, web, S3, and planning tools Janus exposes, without duplicating warehouse/K8s work already in this repo.

| Optimization | Before | After |
|--------------|--------|-------|
| Local coding | Only `chat_completion` on the Tahoe base | Persistent `bash`, `python_execute`, and `str_replace_editor` (view/create/replace/insert/undo) |
| Public search / object storage | No web search; no S3 | `web_search` (Tavily/Brave with DuckDuckGo fallback) and read-only `s3_list_objects` / `s3_head_object` / `s3_get_object` |
| Planning / warehouse safety | Prompt-only SQL rules; no plan tool | In-memory `planning`; `trino_run_query` rejects mutating SQL; `k8s_describe_pod` for crash debugging |

---

## 2026-08-24 — Eval loop (observability cases)

**Goal**: Give prompt/agent changes a fixed regression harness with tool-order, round-budget, and answer checks.

| Optimization | Before | After |
|--------------|--------|-------|
| Eval surface | Empty `observability/` stubs; F9 not started | Case JSON suites, `Observer` recording, equal-weight scoring, `python -m observability` CLI |
| Turn hooks | Single CLI listener baked into the graph | `ListenerHub` fans out to registerable observers without rebinding |
| Score signal | No structured case outcomes | Per-case tools / rounds / answer scores plus average and optional `--fail-under` |

---

## 2026-08-24 — Observability cases hardening

**Goal**: Make the eval harness runnable, testable, and aligned with agent-specific case groups.

| Optimization | Before | After |
|--------------|--------|-------|
| CLI entrypoint | Library only; docs referenced missing `python -m observability` | `observability/__main__.py` with `--agent`, `--groups`, `--fail-under`, `--list-groups` |
| Case fixtures | Two minimal files; awkward `knowledge_case` name | `general`, `tahoe`, `databot`, `knowledge` groups; alias keeps `knowledge_case` working |
| Regression safety | No tests for scoring or JSON loading | Unit tests cover tool order, round budget, answer matching, and fixture validation |

---

## 2026-08-24 — Intent router eval cases

**Goal**: Regression-test whether IntentOrchestrator publishes the right specialist route for representative queries.

| Optimization | Before | After |
|--------------|--------|-------|
| Intent eval | No routing cases; intent agent excluded from observability | `intent.json` router cases score status / intentions / route order |
| Eval scope | Full intent turn always executed specialists | `execute_plan=False` stops after publish/reject/clarify for routing-only eval |
| CLI | `--agent` limited to ReAct agents | `--agent intent` runs intent router cases via `python -m observability` |

---

## 2026-08-24 — Unified JSON answer scoring

**Goal**: One answer contract for all tool-call eval cases — model returns JSON, scorer compares fields to `answer`.

| Optimization | Before | After |
|--------------|--------|-------|
| Answer contract | Non-empty `answer` auto-appends required JSON shape to the query | JSON shape lives in each case `query`; scorer only parses and compares to `answer` |
| Comparison | Keyword hit anywhere in reply | Parse JSON object and compare each expected field; empty `answer` skips |
| Case authoring | Prompt authors hand-write format hints | Case JSON only lists expected fields and values |

---

## 2026-08-25 — CLI progress Status lines

**Goal**: Show what the agent is waiting on so long LLM / routing pauses do not look like a hang.

| Optimization | Before | After |
|--------------|--------|-------|
| LLM wait | Silent until the model returned (or tools printed) | `Status> LLM thinking (tools=…/…, idle=…)` before each `step_llm` call |
| Intent routing | Blank until `Intent>` after detect finished | `Status> Intent routing…` before the router model call (including clarify re-detect) |
| Specialist handoff | Only `Plan>` step lines | `Status> Running specialist: …` immediately before each specialist turn |

---

## 2026-08-25 — Scope Assistant reply to current turn

**Goal**: Stop reprinting the previous turn's answer when this turn ends without `chat_completion`.

| Optimization | Before | After |
|--------------|--------|-------|
| Reply lookup | Latest `chat_completion` anywhere in session history | Only after the latest human message |
| Idle / plain-text end | Quietly showed prior-turn `Assistant>` | Falls back to this turn's AI text, or an explicit no-reply message |
| Chain handoff | Same global lookup via `extract_turn_output` | Same current-turn scoping |

---

## 2026-08-26 — Per-tool exception → ToolErrorType registry

**Goal**: Stop centralizing product-specific error classification (especially Trino) inside `from_exception`.

| Optimization | Before | After |
|--------------|--------|-------|
| Classification ownership | `tools/errors.py` hard-coded Trino SDK types and message substrings | Each tool module registers exception → `ToolErrorType` / `retryable` via `register_exception` |
| Lookup path | Nested if/else in `from_exception` | `resolve_exception` walks exception MRO against the registry |
| False timeout retries | `ToolInvocationError` text containing the word “timeout” was treated as transient | LangGraph arg-validation errors register as non-retryable `syntax` |

---

## 2026-08-26 — Eval cases pin models and average across them

**Goal**: Make eval scores less tied to whichever default LLM is currently configured.

| Optimization | Before | After |
|--------------|--------|-------|
| Model choice | Always `default_model` from `models.toml` | Case/file `models` list (names from `models.toml`) |
| Aggregation | One run per case | Per-model runs → case average → suite average |
| CLI | No model listing | `--list-models`; output shows `model=` and `case avg` |

---

## 2026-08-28 — CopilotKit runtime endpoint fix (M2 databot UI)

**Goal**: Make the CopilotKit browser runtime reach the `databot` agent.

| Optimization | Before | After |
|--------------|--------|-------|
| App Router placement | `app/api/copilotkit/route.ts` only matched the bare path; `/info` and `/agent/<id>/run` 404'd in Next.js | Catch-all `app/api/copilotkit/[...path]/route.ts` |
| Runtime mode | `intelligence: new CopilotKitIntelligence(...)` + `identifyUser` returning `anonymous` → managed service tried Clerk → `401 CLERK_TOKEN_INVALID` | Dropped `intelligence`; runtime defaults to SSE mode + `InMemoryAgentRunner` (LangGraph keeps its own thread state in `checkpoints.sqlite`) |

---

## 2026-08-28 — dbt semantic model RAG ingest (F15)

**Goal**: Index dbt semantic layer yml + sibling sql into Qdrant for the Knowledge agent to retrieve the right `TableCard` (per `tools/rag/semantic.py`).

| Optimization | Before | After |
|--------------|--------|-------|
| Ingest path | No dbt coverage under `rag/` | `python -m rag -t model -p <dbt-dir> -c <collection>` walks yml + sql |
| Chunk design | Per-column / per-metric chunks (popularity bias in top-K) or single chunk per model (description truncated to fit BGE's 512-token cap) | **Two points per model**: `model+columns` + `model+metrics`; each chunk focused, descriptions fit without aggressive pre-truncation |
| Payload | — | Every point's payload carries the full structured model so the LLM can render a `TableCard` from a single retrieved point |

---

## 2026-08-28 — `fetch_related_models` tool wired (F15 / M3)

**Goal**: Let the Knowledge agent retrieve candidate dbt models from the indexed collection.

| Optimization | Before | After |
|--------------|--------|-------|
| Retrieval tool | `tools/rag/semantic.py` `fetch_related_models` was a stub (`pass`) returning `list[Card]` | Real implementation: Qdrant `query_points` with `chunk_type` payload filter, dedup by `model_name` (each model has 2 points), returns `TableCard`-shaped dicts + score + matched chunk type |
| `rag.store.search` | No filter support | Added `query_filter` kwarg passing through to `query_points` |
| `add_card_to_state` typing | `list[TableCard]`; LLM would need to re-construct objects | `dict_to_table_card` helper hydrates tool output back to `TableCard` before `add_card_to_state` |
| Tool loader wiring | Only `load_knowledge_tools()` (via `tools/rag/__init__.py`) — `TableCard` workflow was actually Databot's but ended up on Knowledge | `load_data_tools()` also includes `*rag_tools`; Knowledge keeps it; `fetch_related_models` and `add_card_to_state` now on both Databot and Knowledge |

---

## 2026-08-29 — Databot v2 staged pipeline (state machine + per-stage ReAct)

**Goal**: Implement `tools/rag/semantic.py` thought 1 — parallel RAG+MCP fetch, LLM card selection, two human gates (cards, SQL), per-stage execution, optional Superset chart — instead of one free-form ReAct loop.

| Optimization | Before | After |
|--------------|--------|-------|
| Top-level topology | Single `build_react_graph` ReAct loop shared with Tahoe | Explicit state machine `agent/react/databot/graph.py`: fetch_cards → gate_cards → write_cards_artifact → generate_sql → gate_sql → write_sql_artifact → execute_sql → chart_question → end |
| Subgraph scope | All databot tools bound to the LLM at once | Per-stage tool scoping: fetch stage sees RAG + MCP datahub only; SQL stage sees `trino_desc_table` / `hive_desc_table` only; `trino_run_query` only runs in the post-gate `execute_sql` node |
| Human gates | None | `langgraph.types.interrupt` nodes for cards and SQL; options `approve` / `deny-comments` / `deny-halt` / `dryrun`; default `dryrun`; `deny-comments` loops back with feedback, `deny-halt` routes to refusal, approve writes a sidecar artifact |
| Profile persistence | Static `UserProfile` only | `approved_cards` / `approved_sql` / gate audit appended to `profiles/<user>.databot_turns.jsonl` on approve (skipped on dryrun / halt); `UserProfile` schema unchanged for now |
| Glossary / dbt-metric conflict | (no handling) | `record_metric_conflict` tool surfaces the disagreement into `metric_conflicts`; we flag, do not auto-edit dbt yml / hive models |
| Confidence scoring | (no scoring) | `confidence` still `"unknown"`; partition-freshness step-LLM deferred to a follow-up |
| State schema | `SessionAgentState` shared with Tahoe | New `DatabotState` (subclass of `MessagesState`) with stage pointer, candidate / selected / approved cards, draft / approved SQL, gate audit, deny feedback, dryrun flag, halt reason |
| DatabotAgent wiring | `DatabotAgent(TahoeAgent)` reused Tahoe's `build_graph` | `DatabotAgent` composes an inner `TahoeAgent` for session/turn plumbing but builds the v2 graph itself; public `create` / `run` / `bind` API unchanged |

---

## 2026-08-29 — Databot stage tool lookup is name-flexible

**Goal**: Stop `bind()` from crashing on machines where datahub is exposed via the native GraphQL helpers instead of legacy MCP `search` / `get_entities` tools.

| Optimization | Before | After |
|--------------|--------|-------|
| Tool resolution | `_filter_tool(all_tools, "search" / "get_entities")` raised `KeyError` when those exact names were absent (e.g. when only `datahub_list_glossary_terms` / `datahub_graphql_query` are loaded) | `_find_tool` (silent miss) + `_find_tools_by_predicate` (accepts MCP and native names, plus `datahub_list_glossary*` and `datahub_graphql_query` prefixes) |
| `trino_run_query` availability | Graph build required it | Optional; `execute_sql` node records a "not available this turn" error and still advances to `chart` stage |
| `chat_completion` requirement | Implicit (assumed present) | Explicitly required; raises only if missing — same as the v1 Tahoe base |
| Stage list construction | `*tool if tool else []` for a single tool object | `if tool is not None: out.append(tool)`; previous form unpacked `StructuredTool.__iter__` and produced tuples instead of tools |

---

## 2026-08-29 — `tools/mcp/mcp.py` lazy-opens the stderr sink

**Goal**: Stop `langgraph dev` from logging `Blocking call to os.mkdir` (and refusing the graph) every time the frontend hits a thread-state endpoint. The block came from `_redirect_stdio_server_stderr` doing `log_file.parent.mkdir(...)` + `log_file.open("a")` synchronously inside an async load path that ``blockbuster`` (the ASGI blocking-call detector inside ``langgraph dev``) flags.

| Optimization | Before | After |
|--------------|--------|-------|
| `_redirect_stdio_server_stderr` | Synchronously `mkdir` + `open` on first MCP client construction | Just swaps `mcp_stdio.stdio_client`; the file is opened lazily inside the wrapped `stdio_client` context manager on the first MCP call |
| First MCP call latency | ~5–20 s per request (blockbuster retry loop) | ms; sink open is `O(1)` once per process |
| Symptom in `langgraph dev` logs | `BlockingError: Blocking call to os.mkdir ... would degrade performance ...` repeating per request, then `Failed to load MCP tools; continuing with Hive/Trino only` | No BlockingError; MCP tools still gracefully absent because the dev config has no `datahub` server, but the dev server no longer chokes |
| `GET /threads/{tid}/state` | 20.9 s timeout (also caused by Node 18+ IPv6 lookup, fixed separately) | 8 ms |

---

## 2026-08-29 — `LANGGRAPH_DEPLOYMENT_URL` must use `127.0.0.1`, not `localhost`

**Goal**: Stop the CopilotKit v2 frontend from hanging on `POST /api/copilotkit/agent/databot/run` for 20+ seconds with "Unable to connect to LangGraph server".

| Optimization | Before | After |
|--------------|--------|-------|
| `LANGGRAPH_DEPLOYMENT_URL` value | `http://localhost:8000` (the default in `route.ts`) | `http://127.0.0.1:8000` in `frontend/.env.local` |
| `langgraph dev` bind address | IPv4 `127.0.0.1:8000` only (does not bind to `[::1]`) | unchanged |
| Node 18+ fetch dual-stack | Tries `[::1]:8000` first → `ECONNREFUSED` after ~20s → falls back to IPv4 | Skips the IPv6 attempt because the hostname is already a literal IPv4 |
| `frontend/.env.local` | did not exist | New file: `LANGGRAPH_DEPLOYMENT_URL`, `LANGSMITH_TRACING=false`, `COPILOTKIT_TELEMETRY_DISABLED=true` |
| Symptoms in browser | "Failed to retrieve assistant: Unable to connect to LangGraph server" after 20s; POST returns 200 because the error is wrapped in a `RUN_ERROR` event | First POST resolves in a few hundred ms; interrupts fire as designed |

---

## 2026-08-29 — CopilotKit v2 frontend for Databot staged pipeline

**Goal**: Surface `TableCard` / SQL / execution results in the CopilotKit UI with interactive cards (toggleable selection), editable SQL with a regenerate path, and Recharts-rendered results — instead of the default sidebar showing only chat.

| Optimization | Before | After |
|--------------|--------|-------|
| Frontend layout | Single `<CopilotSidebar />` with chat only | `Sidebar` (chat) + right `DatabotArtifactPanel` (3 tabs: Cards / SQL / Results) |
| `TableCard` rendering | Free-form text inside chat | `TableCardList` component: candidate / selected badges, score, match type, `confidence`, metric conflicts, expand-to-show columns / metrics / CTE |
| Card interactivity | None — LLM selection is final | `gate_cards` stage shows checkboxes; user can drop / add cards before approving the SQL draft |
| SQL editor | Plain assistant text | `SqlEditor`: textarea (interactive in `gate_sql` stage) + Save draft + Regenerate-with-feedback |
| Result visualization | None | `ExecutionChart` (Recharts) with auto-shape detection (scalar / time-series / grouped) and a chart-type tab (bar / line / pie / table) |
| Stage indicator | None | `stage-pill` in the artifact header; tab auto-switches based on `stage` |
| Human gate UI | `useInterrupt` v1 legacy custom-event shape | AG-UI v2 standard `Interrupt` (id / reason / message); backend serializes the rich prompt into `message` as JSON; frontend reads `agent.pendingInterrupts` and calls `agent.resumeInterrupt(...)` |
| Backend gate payload | `interrupt({question, options, ...})` (raw dict) | `interrupt({id, reason, message: json.dumps(...)})` — AG-UI v2 standard shape; legacy CLI path still works because the dict body lives in `message` |
| Card-edit wiring | N/A | New backend tool `update_card_selection(selected_card_names)`; UI calls it on checkbox change |
| SQL-regenerate wiring | N/A | New backend tool `request_sql_regenerate(feedback)`; UI collects feedback text and dispatches |
| Default port for `LANGGRAPH_DEPLOYMENT_URL` | `:8123` (typo) | `:8000` (matches `langgraph dev`'s actual default) |
| Frontend deps | `@copilotkit/*` + `next` + `react` only | + `recharts ^2.13.3` for visualization |

---

## 2026-08-29 — `write_gate_reasons` accepts dict OR positional list

**Goal**: Stop `write_gate_reasons` from failing with "Input should be a valid dictionary" when the LLM passes reasons as a positional list of strings (observed on the second real CLI run).

| Optimization | Before | After |
|--------------|--------|-------|
| Schema | `reasons: dict[GateDecision, str]` — Pydantic 400'd on list payloads | `reasons: Union[dict[GateDecision, str], list[str]]` |
| Parser | dict-only | `_coerce_gate_reasons`: dict form keeps keys verbatim; list form maps to `GATE_OPTIONS` by position and strips `approve: ` style prefixes |
| Tool description | "one short string per option" (ambiguous) | Explicit dict example + note that list form is tolerated fallback |
| Test coverage | 0 schema-coercion tests | 6 new tests in `tests/test_databot_gates.py` cover dict / list / short-list / unknown keys / None / mixed-prefix inputs |

---

## 2026-08-29 — Stage tools must append a matching ToolMessage

**Goal**: Make Databot v2's stage tools (`mark_cards_selected`, `record_metric_conflict`, `write_gate_reasons`, `propose_sql`) actually persist their state writes without breaking the AIMessage ↔ ToolMessage contract that providers enforce.

| Optimization | Before | After |
|--------------|--------|-------|
| Tool return shape | `Command(update={some_state_field: value})` only — no `messages` entry | `Command(update={some_state_field: value, "messages": [ToolMessage(content, tool_call_id)]})` — sibling ToolMessage matches the AIMessage `tool_call_id` |
| `tool_call_id` source | None (ToolMessage could not be built) | `runtime: ToolRuntime` parameter; `runtime.tool_call_id` injected by LangGraph at tool execution time |
| First CLI dry run | "Expected to have a matching ToolMessage in Command.update" 400 from `api.minimaxi.com`; second `step_llm` call hit the provider contract violation | Stage tool calls round-trip cleanly; ToolMessages appear in the message history; LLM sees the success content and continues |
| Why not `InjectedToolCallId` | Tried first; Pydantic 2 cannot generate a JSON schema for `IsInstanceSchema(InjectedToolCallId)`, so `model.bind_tools(...)` raised `PydanticInvalidForJsonSchema` | `ToolRuntime` is not exposed in the args schema (LangGraph injects it under the hood), so JSON schema generation works |

---

## 2026-08-30 — `models.models` is lazy; missing API keys no longer kill `langgraph dev`

**Goal**: Stop `langgraph dev` from hanging silently when any single registered chat model has a missing API key. The previous behaviour eagerly instantiated every model in `models/models.toml` at import time, so a single missing `MiniMax_API_KEY` (the `default_model_name`) raised `ValueError` before the dev server could `bind()` a socket.

| Optimization | Before | After |
|--------------|--------|-------|
| `default_model` | Eager `BaseChatModel` instance, built at module import | `None`; `get_default_model()` builds it on first call |
| `_load_registry` | Loop over `config["model"]` and call `get_model(...)` for each (which calls `_resolve_api_key`) | Loop over `config["model"]` and stash `ModelConfig` objects only — no model is constructed at import time |
| Missing key behaviour | Whole registry import fails; `langgraph dev` exits; `default_model_name` never resolves | `get_default_model()` tries the configured default, then walks every other registered model until one constructs; surfaces the aggregate error only if **every** model is unusable |
| Callers | `ui.py`, `cli.py`, `observability/__main__.py` import `default_model` directly | Same callers now import `get_default_model()` / `_model_configs` / `get_model_by_name` |
| Symptom in dev | Background `langgraph dev` process `S+` for >1 min, no `LISTEN` on `:8000`, browser shows `Failed to retrieve assistant: fetch failed` | `langgraph dev` boots in ~1s and binds `:8000` even if some API keys are missing; users with a valid key for any model can run the app |

---

## 2026-08-31 — SQL gate redraft and chat_completion stall exit

**Goal**: Stop the SQL-stage ReAct loop when the user rejects GMV for revenue (or any gate redraft) and the model keeps calling `chat_completion` without updating SQL.

| Optimization | Before | After |
|--------------|--------|-------|
| SQL gate `deny-comments` | Only set `deny_feedback`; stale `draft_sql` + `sql_reasons` made the subgraph think it was done | Clear SQL contract fields so `generate_sql` must redraft with gate feedback in the system prompt |
| Cards gate `deny-comments` | Only set `deny_feedback` | Clear `cards_reasons` so fetch must re-fill the gate reason map |
| Subgraph exit on stall | `chat_completion` did not end state-based subgraphs; model could loop with inner monologue | Force subgraph END after two consecutive `chat_completion` tools without the stage contract |
| Incomplete subgraph exit | Outer graph could spin `write_cards_artifact` ↔ `generate_sql` forever | Route to the human gate when the stage contract is still empty after the subgraph ends |

---

## 2026-08-31 — Post-done follow-up always restarts pipeline, history for context

**Goal**: After `done`, every new user message reruns fetch → gates → sql → execute, while the LLM uses chat history to interpret corrections and follow-ups.

| Optimization | Before | After |
|--------------|--------|-------|
| `done` + follow-up chat | Sometimes short-circuited to SQL-only on correction-shaped text | Always reset turn fields to `fetch`; preserve `messages` for context |
| Fetch / SQL prompts | No guidance on multi-turn threads | Instruct models to read prior messages for intent but still run stage tools |

---

## 2026-08-31 — MiniMax tool-call chain repair before LLM invoke

**Goal**: Stop HTTP 400 / error 2013 (`tool call result does not follow tool call`) when Databot replays checkpoint history to MiniMax after parallel or interrupted tool batches.

| Optimization | Before | After |
|--------------|--------|-------|
| History sent to the model | Raw checkpoint messages, including assistant planning text + partial parallel tool results | Sanitize before every `step_llm`: strip assistant content on tool-call turns, synthesize missing `ToolMessage`s in call order |
| Fetch-stage prompt | Encouraged parallel RAG + glossary tool calls in one step | One tool call per model step (provider-safe) |

---

## 2026-08-31 — `fetch_related_models` provider-safe tool schema

**Goal**: Stop `fetch_related_models` from failing with `Cannot instantiate typing.Union` on strict OpenAI-compatible providers (GLM, MiniMax).

| Optimization | Before | After |
|--------------|--------|-------|
| `Command` import | `langchain_protocol.Command` (a `typing.Union` alias — `Command(...)` raised at runtime) | `langgraph.types.Command` (real LangGraph command object) |
| Return type | `Command \| list[dict]` union confused Pydantic schema generation | Always returns `Command` with staged refs in the tool message |
| `layer` / `chunk_type` args | `Literal` types → JSON Schema `const` / `enum` | Plain `str` with in-body validation |
| Tool schema build | `create_schema_from_function` could fail on the union return | Schema builds cleanly; no `const`/`enum` traps in the bound tool spec |

---

## 2026-08-31 — Databot chat: hide inspector/thinking; gate action hints

**Goal**: Cleaner CopilotKit chat (no dev Inspector link or ReAct planning prose) and clear user instructions when a human gate opens.

| Optimization | Before | After |
|--------------|--------|-------|
| Chat assistant rows | Empty tool-only turns showed “View in Inspector (local only)”; LLM planning text appeared between tool calls | Custom assistant renderer hides narration and disables the inspector toolbar |
| Reasoning rows | Model “thinking” blocks could appear in the sidebar | Reasoning message slot suppressed in the Databot message view |
| Gate instructions | Gate UI only in the right column; checkbox vs Approve distinction unclear | Chat banner + gate panel “how to” steps; Cards/SQL tabs explain refine vs workflow buttons |
| Gate interrupt copy | Generic “approve or halt?” question | Interrupt payload lists numbered steps (Cards tab → gate panel decision) |

---

## 2026-09-01 — Databot right panel: cards, gate, and tool cards

**Goal**: Clearer artifact panel during fetch/gate stages and fix false-empty semantic search in chat.

| Optimization | Before | After |
|--------------|--------|-------|
| Artifact lists | Separate “Staged” / “Committed candidates” sections confused users | Single card list: `committed_cards` when present, else `staging_cards` |
| Card / gate chrome | Plain list rows | Accent bars, relevance score bars, chip grids; compact gate tiles with colored decision buttons |
| Semantic search tool card | Parsed tool JSON as a bare array → “No matching models” while hits existed | `parseFetchRelatedModelsResult` reads `staged` / `staging_total`; shows “Found N models…” |
| Gate payload | Full column/metric blobs in interrupt JSON | Slim `review_cards` summary; full schema stays in Cards tab |
| Cards vs gate actions | Unclear why checkboxes and Approve both exist | Hint copy: checkboxes refine selection; gate buttons advance the workflow |

---

## 2026-09-01 — Databot chat sidebar: user messages, gates, and New chat

**Goal**: Chat shows user-facing prose (not inner monologue) alongside tool cards; gates and session reset behave predictably.

| Optimization | Before | After |
|--------------|--------|-------|
| Assistant + tool turns | Planning text or empty body; or all prose hidden when tools present | Show short user-facing status when present; hide third-person / tool-name monologue; `chat_completion` renders as an assistant reply bubble |
| Reasoning / Inspector | Thinking rows and “View in Inspector (local only)” on tool-only turns | Reasoning slot suppressed; custom assistant message disables inspector toolbar |
| Gate chat notice | Banner never appeared (`pendingInterrupts` unused; banner outside scroll) | Detect `gate_cards` / `gate_sql` from agent state + subscribe; banner at end of message list |
| SQL gate feedback | Regenerate in SQL tab duplicated gate “Request changes” | Hide Regenerate while `gate_sql` is open; gate panel owns LLM rewrite feedback |
| New chat | Empty `execution_result: {}` read as failure; `stage` stuck on Results | Reset `stage` to `fetch`, clear result; Results tab shows “No execution result yet.” |
| Chat style prompt | “Emit ONLY tool calls” → no user-visible status | Allow one short user-facing line per turn; forbid “The user wants me to…” and tool return values in prose |

---

## 2026-09-02 — Databot cards gate, turn completion, and graph cleanup

**Goal**: Simplify the cards gate path, end turns with a user-visible summary, and drop unused graph stages.

| Optimization | Before | After |
|--------------|--------|-------|
| Turn completion | `end_with_summary` only set `stage=done` with no reply | LLM synthesizes models, SQL, results, and conflicts into a final assistant message |
| Fetch-stage commit tool | `add_card_to_state` (ambiguous vs `staging_cards`) | `commit_cards` (staging → `committed_cards`) |
| Cards gate prep | LLM called `mark_cards_selected` / `write_gate_reasons` inside fetch subgraph; two prep nodes with JSON-only reasons | Single outer `prepare_cards_for_gate`; `model.invoke` on full `state.messages` plus an ephemeral instruction |
| Cards state naming | `candidate_cards` / `selected_cards` | `committed_cards` (LLM commit) / `review_cards` (human gate) |
| Post-execute flow | `execute_sql` → `chart_question` → `end_with_summary` | `execute_sql` → `end_with_summary`; `execute` stage sets `done` |

---

## 2026-09-02 — Databot prompts and routing constants

**Goal**: Keep stage-specific prompt text and graph wiring maintainable as Databot v2 grows.

| Optimization | Before | After |
|--------------|--------|-------|
| Prompt layout | One 450+ line `prompt.py` mixed system, idle, fetch, SQL, gate-prep, and turn-summary text | `prompts/` package with `system.py`, `idle.py`, `fetch.py`, `sql.py`, `gate_prep.py`, `turn_summary.py`; `prompt.py` re-exports for compatibility |
| Node / stage names | Bare strings repeated across routing dicts and `add_node` calls | `agent/react/databot/_constants.py` with `NODE_*`, `STAGE_*`, and shared route maps |

---

## 2026-09-02 — Agent-scoped tool registry (`bind_tool_to_agent`)

**Goal**: Declare which agent (and subgraph identifier) owns each tool; agents resolve tools from the registry instead of ad-hoc loaders.

| Optimization | Before | After |
|--------------|--------|-------|
| Tool ownership | `tools/loader.py` assembled per-agent lists by hand | `@bind_tool_to_agent("agent,identifier")` registers tools on `AgentSpec.register_tools` at import |
| Agent startup | Databot/Knowledge called `load_data_tools` / `load_knowledge_tools` | `register_dynamic_tool_bindings()` for MCP, then `get_agent_tools` / `get_all_registered_tools` |
| Databot stages | `graph._build_stage_tool_lists` filtered a flat tool bag by name | Fetch / SQL / execute stages read identifiers `fetch`, `sql`, `execute` directly |
| Knowledge catalog | Loader chose MCP DataHub or native GraphQL inline | Native tools bind to `knowledge,catalog`; MCP replaces that bucket when the DataHub MCP server is up |
| Agent tool scopes | `get_all_registered_tools` / manual merges | `tool_scopes.py` + `RegistryScopedTools.tools_for_scope`; not on `BaseAgent` / `BaseReactAgent` |

---

## 2026-09-03 — Lean installs and unified local runtime paths

**Goal**: Slim the default install and consolidate machine-local state (checkpoints, profiles, logs, offload) under one configurable tree.

| Optimization | Before | After |
|--------------|--------|-------|
| Default `pip install` | Pulled torch, Qdrant client, K8s client, CopilotKit stack, and ingest parsers | Core CLI + Hive/Trino/MCP only; opt-in `tahoepilot[web]`, `[k8s]`, `[rag]` |
| Local Qdrant binary | Unclear whether `docker/qdrant/bin/` ships with the package | Documented as dev-only; PyPI wheel excludes it; Docker Compose is the supported path |
| Local data layout | `checkpoints.sqlite`, `profiles/`, `logs/`, `offload_store/` at repo root | Single `.local/` tree; paths in `config/local.toml` `[paths]` with `TAHOEPILOT_*` / `AGUI_CHECKPOINT_DB` env overrides |
| Path resolution | Scattered per entry point; CLI used repo-root `profiles/` while some agents used `agent/profiles/` | `config/local_config.py` builds one `LocalPaths` snapshot for CLI, AG-UI, agents, and compression |

---

## 2026-09-03 — Intent router: single handoff; composite → Plan

**Goal**: Stop Intent from duplicating Plan's multi-step orchestration; keep Intent as a fast classifier and router.

| Optimization | Before | After |
|--------------|--------|-------|
| Intent role | Classify, build per-step plan, run `PlannedAgentChain` | Classify, publish one `route_target`, hand off with the original user question |
| Composite requests | Ordered specialist chain inside Intent | Route to `plan`; Plan owns decomposition and delegation |
| State / prompt | `execution_plan`, `plan_draft`, per-step tasks | `route_target` only; prompt asks for intention labels, not step instructions |
| Agent chain | `PlannedAgentChain` in Intent path | Removed; `StatusRoutedAgentChain` / `StaticAgentChain` remain for other callers |

---

## 2026-09-04 — Knowledge follow-up delegation and UI reply

**Goal**: Make knowledge follow-ups delegate reliably under `langgraph dev` and show only the final `chat_completion` answer in the Web UI.

| Optimization | Before | After |
|--------------|--------|-------|
| `invoke_knowledge` under async tools | Nested Knowledge agent ran in the same event loop and hit blockbuster blocking errors | Specialist runs in a worker thread with its own event loop |
| Knowledge subgraph exit | `chat_completion` ended the subgraph without mirroring reply to an AIMessage | Same `inject_completion_as_ai` wiring as top-level ReAct agents |
| Web UI chat bubble | ReAct planning prose leaked when the message also had tool calls | Internal narration is hidden whenever heuristics match, even with tool calls |
| Follow-up prompt | Required `invoke_knowledge` before answering from thread evidence | Prefer thread/cards evidence; call `chat_completion` directly when sufficient |

## 2026-09-04 — Cards gate vs artifact panel on follow-up

**Goal**: Keep the Cards tab, gate panel, and chat tool trace showing the same model set during follow-up requery and cards-gate review.

| Optimization | Before | After |
|--------------|--------|-------|
| Cards tab data source | Only `committed_cards`; could lag behind `review_cards` in AG-UI snapshots | At `gate_cards`, merge `committed_cards` + `review_cards` |
| Selected rows missing from pool | `review_cards` entries absent from `committed_cards` were invisible in the grid | Orphan selected cards render as extra tiles |
| Gate redraft | `deny-comments` kept old committed/review cards while fetch re-ran | Clear staging, committed, and review card lists on cards-gate redraft |
| Chat `commit_cards` card | Showed requested count from tool args even when fewer landed in state | Show committed model names from tool result; warn on request/commit mismatch |

## 2026-09-04 — Cards gate copy without LLM thinking

**Goal**: Replace meaningless gate “reasons” (parsed LLM monologue) with deterministic selection summaries humans can act on.

| Optimization | Before | After |
|--------------|--------|-------|
| `prepare_cards_for_gate` | Extra LLM call; line-split thinking leaked into per-option “LLM:” hover text | Build reasons from `selection_notes` / metrics / dims on committed cards |
| Gate subtitle | Long workflow boilerplate repeated under the title | Short line: model count + names |
| Approve button hover | “LLM: …” planning text | Static button hints only; card summary shown once in **Selection summary** |

## 2026-09-04 — Card gate per-option persuasion reasons

**Goal**: Each cards/SQL gate button shows why the reviewer should pick that option for this turn, separate from the factual model selection summary.

| Optimization | Before | After |
|--------------|--------|-------|
| `cards_reasons` / option `reason` | Deterministic card metadata in `approve`; static hints on every button | LLM writes one persuasive sentence per gate option |
| Selection summary | Mixed into `approve` reason | `cards_selection_summary` and interrupt `selection_summary` show model/metric facts only |
| Tool/prompt contract | `write_gate_reasons` as a generic reason map | Docstring + `PREPARE_CARDS_FOR_GATE_PROMPT` define per-option persuasion for the reviewer |

## 2026-09-04 — Stop SQL redraft monologue in chat

**Goal**: Gate feedback re-runs must not dump long DATE/SQL reasoning into the chat sidebar.

| Optimization | Before | After |
|--------------|--------|-------|
| Fetch / SQL subgraphs | `persist_plain_text=True`; tool-call turns still saved full assistant prose | `persist_plain_text=False`; strip message body when persisting tool-call turns |
| `step_reason` checkpoint | Any `AIMessage` with `tool_calls` kept planning text for the UI | Drop internal/long prose before append; tool trace carries the turn |
| Chat sidebar (fallback) | Long text beside tool calls still rendered | Hide narration and >200-char bodies when tool calls are present |

## 2026-09-04 — Gate option copy and closing summary

**Goal**: Gate buttons show why to pick each option, and a finished query always gets a chat summary.

| Optimization | Before | After |
|--------------|--------|-------|
| Cards gate reasons | Thinking / `Context:` lines were split into the four buttons | Isolated JSON-only prompt; reject think dumps; fall back to defaults |
| Closing chat line | Summary LLM `<think>` was treated as the answer (then hidden) or skipped | Strip think; if unusable, write a deterministic result summary |

## 2026-09-04 — Closing summary uses chat_completion

**Goal**: After SQL execution, the chat sidebar shows the same user-facing reply channel as the rest of Databot.

| Optimization | Before | After |
|--------------|--------|-------|
| Turn close | `end_with_summary` wrote a bare `AIMessage`; thinking models put the text in reasoning, which the sidebar hides | Emit `chat_completion(reply=…)` so CopilotKit renders `DatabotAssistantReply` |
| Follow-up detector | Skipped all `tool` messages, so a completed `chat_completion` still counted as unanswered | A `chat_completion` tool result counts as the reply to that human turn |

## 2026-09-04 — End the turn on empty tool calls

**Goal**: Remove the `chat_completion` tool; a user-visible reply is assistant text with no tool calls.

| Optimization | Before | After |
|--------------|--------|-------|
| Turn end | ReAct loops ended only after a `chat_completion` tool ran | Latest assistant message with no tool calls ends the loop |
| User-visible reply | Taken from the completion-tool `reply` argument | Taken from assistant message text (CLI, memory fold, Web markdown) |
| Staged subgraphs | Completion stall plus state keys | Unchanged state-contract exit; idle then end if keys stay empty |

## 2026-09-04 — Turn summary frames the original question

**Goal**: After SQL/cards gate redrafts, the closing summary should answer the user's data question, not the gate feedback thread.

| Optimization | Before | After |
|--------------|--------|-------|
| Question resolution | Turn summary used the latest human message, which after gate redrafts was synthetic feedback like "现在是2026.09.03" | Skip gate redraft messages and frame the summary on the original user question |
| Revision context | Gate comments were indistinguishable from the question | Gate revision comments are attached as secondary context; the prompt says to mention material changes briefly only |

## 2026-09-04 — Commit-cards failures on follow-up requery

**Goal**: When a follow-up requery resets pipeline state, card commit should not silently reuse stale staging ids from chat history.

| Optimization | Before | After |
|--------------|--------|-------|
| Fetch prompt | Follow-up note mentioned reset state but not stale ``staging_id`` | Explicitly re-fetch all models (fact + new dims) and never reuse ids from prior turns |
| Commit UI | "Only X of Y committed" with no reason | Surfaces backend issues such as ``unknown staging_id`` under the commit card |

## 2026-09-04 — Follow-up requery can re-commit prior models

**Goal**: Extending a prior answer (e.g. add a country breakdown) must still be able to commit the previous fact table.

| Optimization | Before | After |
|--------------|--------|-------|
| Requery staging | Pipeline wipe dropped approved cards; LLM reused dead ``staging_id``s | Requery keeps ``approved_cards`` for commit lookup; ``staging_cards`` stays this-turn fetch only |
| Commit lookup | Unknown id failed even when the same model was still approved | Resolves last approved ids / model names; this-turn staging wins if re-fetched |

## 2026-09-04 — Fix chat vs artifact layout squeeze

**Goal**: Stop the fixed Copilot sidebar and the artifact column from fighting for the same horizontal space.

| Optimization | Before | After |
|--------------|--------|-------|
| Chat shell | ``CopilotSidebar`` (fixed overlay on the right) inside a 2-column grid | Embedded ``CopilotChat`` in a dedicated left column (~34vw) |
| Working state | Artifact panel consumed most of the width; chat was a thin strip on the edge | Artifact + gate use the remaining flex space; gate dock sits above Cards/SQL/Results |

## 2026-09-04 — Databot UI visual refresh

**Goal**: Replace the default-template look with a current product UI so chat and working state feel like one workspace.

| Optimization | Before | After |
|--------------|--------|-------|
| Visual system | Arial, flat white panes, hard gray borders, native checkbox | Plus Jakarta type, lake-blue tokens, rounded panes, switch + pill actions |
| Workspace chrome | Header and columns sat on a blank page with 1990s form controls | Soft canvas, glass topbar, card columns, Copilot input restyled to match |

## 2026-09-06 — Plan nested specialist HITL

**Goal**: When Plan delegates to Databot, cards/SQL gates pause the Plan chat so the user can choose in a modal, instead of the tool failing.

| Optimization | Before | After |
|--------------|--------|-------|
| Nested Databot gates | `invoke_agent` had no HITL handler; the gate raised and became a tool error | Child interrupt is re-emitted on the Plan graph; `/plan` shows a modal and `resolve`s the same gate payload |
| Tool replay | N/A (run failed) | On resume, skip `prepare_turn_input` when the child thread is still at a gate; an in-process resume count keeps cards → SQL interrupt order aligned |
| SQL gate payload | Snippet only inside the question text | Full `draft_sql` in the interrupt JSON so Plan can render without Databot live state |
| Plan chat monologue | Execute/adjust plain text and reasoning rows appeared in the sidebar | ReAct subgraphs use `persist_plain_text=False`; `/plan` reuses Databot message filtering and hides reasoning rows |
| Plan UI parity | No tool cards, no gate banner, no client reset; tools showed “View in Inspector” | `PlanToolRenderers`, `PlanGateChatBanner`, `planClientReset`, debug toggle; patterns documented in `docs/FRONTEND_AGENTS_UI.md` |

**Why this is not “Databot as a Plan subgraph node”**

Plan still picks the specialist at runtime with `invoke_agent(agent_name=...)`. A compiled subgraph node (`add_node("databot", databot_graph)`) would bubble interrupts automatically and resume from the child checkpoint without Python scratchpad alignment — but it needs a static node (or a new router node) per specialist, and it would replace the current ReAct execute loop. The parent node would still re-enter on resume either way. Nested `ainvoke` on a child `thread_id` keeps dynamic delegation; the extra cost is replay-safe `SpecialistRunner` plus a Plan-page modal. Revisit a subgraph node if execute is rewritten away from tools.

## 2026-09-06 — Plan gate interrupt through StepActionNode

**Goal**: Let nested Databot cards/SQL gates pause the Plan run so `/plan` can show the gate modal instead of a tool-error chat loop.

| Optimization | Before | After |
|--------------|--------|-------|
| `invoke_agent` + human gate | `StepActionNode` treated `GraphInterrupt` as a tool failure; Plan finished the turn and the LLM asked for approve/dryrun in chat | Tool error handler re-raises LangGraph control-flow interrupts; Plan `RUN_FINISHED` carries `outcome: interrupt` and `PlanInterruptDialog` opens |

## 2026-09-06 — Agent UI & AG-UI event documentation

**Goal**: Document how Databot and Plan UIs consume AG-UI events end-to-end, with shared vs per-agent handling.

| Optimization | Before | After |
|--------------|--------|-------|
| UI architecture doc | Feature parity checklist only | `docs/FRONTEND_AGENTS_UI.md` — event catalog, SSE pipeline, per-agent consumers, side channels |

## 2026-09-07 — Plan SQL gate dialog vs stale Action-required banner

**Goal**: After approving model cards, show the SQL confirmation dialog instead of a leftover Action-required banner over a nested tool-call stream.

| Optimization | Before | After |
|--------------|--------|-------|
| Plan gate banner | Any parseable `pendingInterrupts[0]`, including the cards payload kept during the SQL-draft run | Hide while the Plan run is in progress; skip nested-HITL replay placeholders |
| Plan confirmation dialog | `useInterrupt` rendered `interrupts[0]` only after `onRunFinalized` | Prefer the cards/sql/chart payload in the open interrupt list; if the hook never mounts, resume from `pendingInterrupts` once the run is idle |

## 2026-09-07 — Stop run must not open the SQL gate dialog

**Goal**: CopilotKit “stop” should end the turn, not surface a leftover draft-SQL confirmation.

| Optimization | Before | After |
|--------------|--------|-------|
| Stop / abort | `isRunning` went false while `pendingInterrupts` still held the SQL (or cards) gate, so the idle fallback opened the modal | Abort clears pending gates and ignores them until the next run |

<!-- Append the next optimization section above this line -->

