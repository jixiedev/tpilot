# Memory

The `memory/` package keeps long sessions inside the model's context window and
carries user preferences across sessions. It has three parts:

| Part | Modules | Purpose |
| --- | --- | --- |
| Context compression | `compress.py`, `config.py`, `tokens.py`, `offload.py`, `tools.py` | Shrink the message history in graduated steps; archive what is removed |
| User profiles | `profile.py`, `profile_store.py`, `agent/refine_profile.py` | Per-user JSON record injected into the system prompt and refined after each turn |
| Session runtime | `session_runtime.py` | Process-local cache of session checkpoints and loaded profiles |

Related docs: [config/README.md](../config/README.md) (how `[compression]` is
resolved from agent files), [agent/README.md](../agent/README.md) (agent turn
lifecycle), [tools/README.md](../tools/README.md) (tool registry),
[docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).

## Concepts

| Term | Meaning |
| --- | --- |
| Context fill | Estimated tokens of all messages in graph state divided by `context_window` (`memory/tokens.py: context_fill`) |
| Offload | Writing a large tool result or tool input to a file under the offload store and leaving a short pointer in the message |
| Archive | A JSON dump of messages removed from state, written to the offload store before removal |
| Summary | A `SystemMessage` produced by an LLM that replaces the older part of the conversation |
| Turn boundary | `SystemMessage` with `--- Session turn boundary ---` inserted before each new user request after the first turn (`agent/agent.py`, `agent/turn_messages.py`) |
| Profile | `UserProfile`: identity, permissions, locale and lasting analysis preferences for one user id |

## Design

- **Cheap first, LLM last.** Offloading costs disk I/O only and runs on every
  pass. Dropping old tool trails is also free. Evicting write-tool inputs runs
  only when the window is filling up. LLM summarization runs only if that is
  still not enough, or when the agent asks for it.
- **Nothing is deleted without a copy.** Every layer writes the original content
  to disk before it shrinks or removes a message. Paths are surfaced in the
  replacement text so the agent can call `read_offloaded_file(path)`.
- **Thresholds live in config.** `CompressionConfig` holds code defaults; each
  agent file's `[compression]` table (inheriting `config/agents/base.toml`)
  overrides them.

## Context compression

### Where it runs

`BaseAgent.__init__` (`agent/agent.py`) builds `self.compressor =
make_compressor(model, agent_config.compression)`. `BaseReactAgent.build_graph`
(`agent/react.py`) passes it to `build_react_graph` (`graph/builder.py`), which
adds the same `ContextCompressor` instance as two nodes:

```
START → [react_turn_init] → compress_on_start → step_reason ⇄ step_action → compress_after_action → router
```

- `compress_on_start` (`COMPRESS_ON_START`) runs once when a turn enters the
  ReAct loop.
- `compress_after_action` (`COMPRESS_AFTER_ACTION`) runs after every tool batch,
  before `CompletionToolRouter.route_after_action()` decides the next node.

Only the `BaseReactAgent` specialists (`knowledge`, `diagnostic`,
`data_analysis`, `swe`) pass a compressor. The databot stage subgraphs
(`agent/specialists/databot/graph.py`) and plan subgraphs
(`agent/plan/graph.py`) call `build_react_graph` without one, so they do not
compress.

With `[compression] enabled = false`, `make_compressor` still returns a
`ContextCompressor` (so graph wiring does not change), but `run` returns no
updates and the node only resets `autonomous_compact_requested`.

As a node, `ContextCompressor.__call__(state)` returns
`{"messages": [...updates], "autonomous_compact_requested": False}`. Updates are
LangGraph message operations: replacements keep the original message `id`,
removals are `RemoveMessage(id=...)`, and new messages are appended by
`add_messages`.

### Pipeline (`ContextCompressor.run`)

| Order | Layer | Method | Runs when | Effect |
| --- | --- | --- | --- | --- |
| 1 | Tool-result offload | `layer1_offload_tool_results` | Every pass | Large `ToolMessage` content → file + preview |
| 1b | Prior-turn Q&A fold | `layer_prior_turns_qa_only` | `prior_turns_qa_only = true` | Remove tool trails of earlier turns |
| 2 | Tool-input eviction | `layer2_offload_tool_inputs` | `fill >= fill_trigger` or forced | Large write-tool arguments → file path |
| 3 | Summarization | `layer3_summarize` | `fill` still `>= fill_trigger`, or forced | Older head → LLM summary |
| – | Autonomous compact | `compact_context` tool | Agent calls the tool | Forces layers 2 and 3 on the next pass |

Fill is recomputed after layers 1/1b and again after layer 2, so layer 3 runs
only if the cheaper layers did not bring fill below `fill_trigger`.

#### Layer 1: tool-result offload

For each `ToolMessage` whose content exceeds `tool_result_offload_threshold`
tokens (default 2,000):

- skipped if the tool name is in `never_offload_tools`, the content contains
  the autonomous-compact marker, the content is already an offload preview
  (starts with `[OFFLOADED — `), or the message has no `id`;
- the full content is written as `tool_<name>_<8 hex>.txt`;
- the message is replaced (same `id`, `tool_call_id`, `name`) by:

```
[OFFLOADED — 12,345 tokens → /…/offload_store/tool_trino_run_query_1a2b3c4d.txt]
Preview (first 10 lines, at most 2,000 chars):
…
Use read_offloaded_file('/…/tool_trino_run_query_1a2b3c4d.txt') to retrieve full content.
```

The preview keeps the first `preview_lines` lines (default 10) and is then cut
to at most `min(2000, 2 × tool_result_offload_threshold)` characters (about half
the threshold in tokens), so a huge single-line payload is shortened too. A
truncated preview ends with `…`.

#### Layer 1b: prior-turn Q&A fold

The current turn starts at the last `HumanMessage`. In everything before it the
layer keeps:

- all `SystemMessage`s (role prompt, turn boundaries, earlier summaries);
- all `HumanMessage`s;
- `AIMessage`s without tool calls (the answers the user saw).

Every other message (AI messages with tool calls and their `ToolMessage`s) is
serialized to `prior_turn_tools_archive_<8 hex>.txt`. The first of them is
replaced in place (same `id`) by a `SystemMessage` note:

```
[PRIOR-TURN TOOL OUTPUT ARCHIVED — 4 messages → /…/prior_turn_tools_archive_1a2b3c4d.txt]
Tool calls and tool results from earlier turns were removed from context. Use read_offloaded_file('…') to retrieve them.
```

and the rest are removed. Being a `SystemMessage`, the note survives later
folds. The current turn is untouched.

#### Layer 2: tool-input eviction

For each `AIMessage` tool call whose name is in `write_tools` and whose
JSON-encoded arguments exceed `tool_input_offload_threshold` tokens (default
500), the arguments are written to `input_<name>_<8 hex>.txt` and replaced with
`{"__offloaded__": "<path>"}`. Calls already offloaded are skipped. Default
`write_tools`: `write_file`, `edit_file`, `create_file`, `save_content`,
`ingest_document`, `ingest_file_path`, `str_replace_editor`. The write has
already happened, so the large payload (file body, document text) is no longer
needed in context.

#### Layer 3: summarization

Requires an LLM (`make_compressor` binds the agent's model) and at least two
messages.

1. `_split_for_summary` splits messages into:
   - **preserved**: `messages[0]` if it is a `SystemMessage` (the role prompt);
   - **tail**: the longest suffix whose tokens fit in
     `context_window * recent_messages_keep` (default 12,800), always at least
     one message;
   - **head**: everything in between.
2. If the head is empty, nothing happens.
3. All messages (preserved + head + tail) are archived to
   `conversation_archive_<8 hex>.txt`.
4. The head is sent to the model with `_SUMMARIZATION_PROMPT`, which asks for
   JSON with `session_intent`, `progress_so_far`, `key_facts`,
   `artifacts_created`, `next_steps`, `open_questions`.
5. The result becomes a `SystemMessage` with id `compression-summary-<8 hex>`
   that starts with `=== CONTEXT COMPRESSED (Layer 3 Summarization) ===` and
   includes the archive path. Non-JSON output is embedded verbatim.
6. Head and tail are removed and summary + tail are re-appended, giving
   `[role prompt, summary, ...tail]`.

If the LLM call fails, the error is logged and the layer is skipped (the archive
file is still written).

The split is by tokens, not by turn: a turn boundary or a previous summary is
treated like any other message and can land in the head.

#### Autonomous compact

`compact_context(reason)` (`memory/tools.py`) returns a string containing
`AUTONOMOUS COMPACT REQUESTED`. On the next pass, `_detect_autonomous_compact`
finds that marker in a `ToolMessage` after the latest `AIMessage` (or the state
flag `autonomous_compact_requested` is set), and `run(force=True)` executes
layers 2 and 3 regardless of fill. The base prompt (`general_rules` in
`config/agents/base.toml`) tells the model when to call it.

### Recovery tools (`memory/tools.py`)

| Tool | Behavior |
| --- | --- |
| `read_offloaded_file(path)` | Reads a file from whichever registered `OffloadStore` contains it; raises `OffloadReadError` (classified `not_found` for a missing or pruned file, `permission` for a path outside every store root) |
| `compact_context(reason="")` | Returns the marker plus a UTC timestamp and reason |

Both are registered with `register_tool` and exported as `COMPRESSION_TOOLS`.
Agents get them through the `@memory` group in `config/tool_groups.toml`.
`ContextCompressor.__init__` calls `configure_offload_tools(store)`, which
registers the store (keyed by resolved root) alongside the default
`LocalPaths.offload_dir` store. Registration is additive, so agents with
different `offload_dir` values in one process can all read their own files.

### Offload store (`memory/offload.py`)

`OffloadStore(root)` creates `root` and writes `<label>_<8 hex>.txt` files
(labels are sanitized to `[A-Za-z0-9_-]`, max 64 chars). `read` resolves the path
and rejects anything outside `root`. The default root is
`LocalPaths.offload_dir` (`.local/offload_store`, override with
`TAHOEPILOT_OFFLOAD_DIR`; see [config/README.md](../config/README.md#local-paths-configlocaltoml)).

Retention: `OffloadStore(root, max_age_days=N)` prunes on creation. The
compressor (and `make_compressor`) passes `offload_max_age_days` (default 30),
so stale files are removed once per agent construction. Only regular files
directly under `root` whose names match the store's own
`<label>_<8 hex>.txt` pattern and whose mtime is older than N days are deleted;
symlinks, subdirectories and other files are left alone. `0` (or negative)
disables pruning. A store passed explicitly to `ContextCompressor(store=...)`
is not pruned unless it was built with `max_age_days`.

### Token counting (`memory/tokens.py`)

`count_tokens` uses tiktoken `cl100k_base` when importable, otherwise
`len(text) // 4`. `message_tokens` counts content plus JSON-encoded tool calls
(AI messages) or the tool name (tool messages). Counts are estimates for the
configured model; tool schemas bound to the model are not counted.

### Configuration

`CompressionConfig` (`memory/config.py`) fields. All except the last two can be
set in an agent file's `[compression]` table:

| Key | Default | Used by |
| --- | --- | --- |
| `enabled` | `true` | `false` makes `run` a no-op (no offload, fold or summary) |
| `context_window` | 128000 | Fill denominator, tail budget |
| `tool_result_offload_threshold` | 2000 tokens | Layer 1 |
| `tool_input_offload_threshold` | 500 tokens | Layer 2 |
| `fill_trigger` | 0.85 | Layers 2 and 3 |
| `recent_messages_keep` | 0.10 | Layer 3 tail budget (fraction of `context_window`) |
| `preview_lines` | 10 | Layer 1 preview (also capped by characters, see layer 1) |
| `offload_max_age_days` | 30 | Prune offload files older than this when the store is created; `0` disables |
| `prior_turns_qa_only` | `true` | Layer 1b on/off |
| `write_tools` | see layer 2 | Layer 2 |
| `never_offload_tools` | `[]` | Layer 1 exclusions |
| `offload_dir` | `LocalPaths.offload_dir` | Code only |
| `turn_boundary_marker` | `--- Session turn boundary ---` | Code only (layer 1b) |

`CompressionConfig.from_mapping` overlays known keys and ignores invalid values
(falls back to the default). Example override for a model with a small window:

```toml
# config/agents/swe.toml
[compression]
context_window = 40960
fill_trigger = 0.8
never_offload_tools = ["planning"]
```

`AgentCatalogSettings(compression_config=CompressionConfig(...))` replaces the
file table for every agent the catalog creates.

To exercise the pipeline directly:

```python
from pathlib import Path
from memory import CompressionConfig, ContextCompressor

cfg = CompressionConfig(offload_dir=Path("/tmp/offload"), context_window=8000)
updates = ContextCompressor(cfg).run(messages)          # layers 1, 1b, 2
updates = ContextCompressor(cfg, llm=model).run(messages, force=True)  # + layer 3
```

Tests: `.venv/bin/python -m pytest -q tests/test_memory_compress.py tests/test_memory_compression_fixes.py`.

## User profiles

### Model (`memory/profile.py`)

`UserProfile` (Pydantic) fields: `user_id`, `role`, `department`, `region`,
`allowed_tables`, `forbidden_columns`, `language`, `timezone`,
`default_time_granularity`, `preferred_currency`, `favorite_metrics`,
`favorite_dimensions`.

- `prompt_section_body()` renders non-empty fields as `- Label: value` lines.
  `SystemPromptAssembler.build` inserts them as a `User profile` section after
  the first prompt section.
- `parse_user_profile_update(raw)` accepts a `UserProfile`, dict, message with
  `.content`, JSON string, or JSON inside a fenced code block.
- `merge_user_profile(current, update)`: empty strings and empty lists in the
  update keep the current value; non-empty lists replace; `user_id` is set only
  if the current one is empty.

### Storage (`memory/profile_store.py`)

`FileProfileStore(root)` stores one `<user_id>.json` per user (characters
outside `[\w.\-@+]` become `_`; an empty id becomes `anonymous`). `load` returns
an empty profile with the id filled when no file exists. The root is
`LocalPaths.profiles_dir` (`.local/profiles`, `TAHOEPILOT_PROFILE_DIR`, or
`--profile-dir` on the CLI).

User id resolution (`resolve_user_id`): explicit value (`-u/--user-id`), then
the `user_id` stored in the session checkpoint, then the store's active user,
then `TAHOEPILOT_USER_ID`, then the OS login (`getpass.getuser()`).

### Refinement (`agent/refine_profile.py`)

After each ReAct turn, `ReactTurnMessagePolicy.commit_turn_state`
(`agent/react.py`) runs `UserProfileRefiner` when
`refine_user_profile_prompt` in the run context is non-empty (default
`REFINE_USER_PROFILE_PROMPT` in `agent/runtime/prompt.py`). The refiner sends
the current profile JSON, the latest user request and the final reply to the
model, asks for a `UserProfile` via structured output (falling back to plain
JSON parsing), merges the result and saves it. Failures are logged and ignored.
Set `refine_user_profile_prompt = ""` under `[run_context]` to turn it off for
an agent.

## Session runtime (`memory/session_runtime.py`)

`SessionRuntime` wraps a `ProfileStore` and caches, per process:

- `SessionRecord(session_id, user_id, values)` for each session seen;
- loaded `UserProfile`s by user id.

`open(session_id, user_id=..., prior=...)` creates the record from checkpoint
values on first sight and re-resolves the user on later calls. `remember` stores
the post-turn values (`BaseAgent.commit_turn`). `save` writes through to disk
and updates the cache, so a new process can hydrate from the checkpoint and the
profile files. `ensure_session_runtime` wraps a plain store; the catalog uses it
when constructing agents.

## Pitfalls

- **`enabled = false` keeps the nodes.** The compressor is still built and
  wired into the graph and `compact_context` / `read_offloaded_file` stay
  available; the node simply returns no message updates.
- **Match `context_window` to the model.** The default is 128,000. With a
  smaller model (for example the 40k Ollama entries in `models/models.toml`)
  the request overflows before `fill_trigger` is reached.
- **Retention deletes archives referenced by old sessions.** A checkpoint
  resumed after `offload_max_age_days` may point at pruned files;
  `read_offloaded_file` then raises a `not_found` error. Raise the value or
  set `0` if sessions are resumed after long gaps.
- **Previews are cut mid-token.** The character cap can split a JSON value or
  a multi-byte sequence boundary in the preview; the file on disk is complete.
- **The profile is injected only on a session's first turn.** Later turns add a
  turn-boundary message instead of a new system prompt, so profile updates made
  by the refiner show up in the next session.
- **`read_offloaded_file` reads any registered store.** Any agent in the
  process can read files under any other agent's `offload_dir` (still only
  inside registered roots).
- **Databot and plan subgraphs do not compress.** Long stage loops rely on their
  tool budgets instead.
