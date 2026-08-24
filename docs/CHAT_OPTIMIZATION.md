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

<!-- Append the next optimization section above this line -->






