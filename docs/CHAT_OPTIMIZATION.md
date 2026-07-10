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

<!-- Append the next optimization section above this line -->
