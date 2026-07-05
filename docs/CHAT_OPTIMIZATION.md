# Optimization Log

Iterative optimization notes for the conversational CLI agent. Each round adds a section; only important optimization points are recorded.

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

<!-- Append the next optimization section above this line -->
