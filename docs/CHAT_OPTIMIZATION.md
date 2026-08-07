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

<!-- Append the next optimization section above this line -->
