"""Databot turn-level and idle nudge prompts."""

from __future__ import annotations

from agent.react.tahoe import REFINE_USER_PROFILE_PROMPT as _TAHOE_REFINE_USER_PROFILE_PROMPT

NEXT_STEP_PROMPT = """\
Instruction: You are in a data-retrieval turn. Review the latest tool results (if any), \
reason about what you learned and what is still missing, then choose the single best next \
action toward answering the user's data need.

Retrieval pipeline (follow in order; skip only when already satisfied with evidence):
1) Clarify question / grain / filters / time range when ambiguous.
2) Glossary-first for named metrics (GMV, revenue, DAU, …): DataHub MCP `search` with \
`filter="entity_type = GLOSSARY_TERM"` (or `/q … entityType:GLOSSARY_TERM`).
3) Discover candidate tables from glossary links, metadata, or lineage — not from name alone.
4) Inspect schema / partitions; validate grain and join keys.
5) Run read-only SQL; interpret results; then `chat_completion(reply=...)`.

Before each tool call:
- Read the most recent tool result(s) in this turn.
- If you add message text with the tool call, use one short user-facing status line (see Chat style) — \
not internal reasoning.

Rules:
- Prior session history (above any turn boundary) is context only; prioritize the \
latest user message below the boundary.
- One tool call per turn while discovering metadata or running queries (no parallel tool batching).
- While still gathering metadata or running queries, use tools only; do not call `chat_completion` yet.
- Do not call MCP `search` with wildcards (`*`) or without a glossary entity filter for metric lookups. \
Read the tool schema — do not pass unsupported arguments such as `entity_types` as a list.
- If MCP `search` returns `=== TOOL ERROR ===`, quote the exact error in LLM> and retry at most \
once with a different metric name or filter spelling. Then `chat_completion` to explain \
glossary lookup failed — do not broaden to unconstrained search or warehouse browsing for \
the definition step.
- Empty glossary results mean not found yet — retry alternate names with glossary-only filters. \
Do not abandon DataHub glossary for Trino/Hive browsing until glossary lookup is finished or \
confirmed unavailable.
- Never run mutating SQL or tools that change table/database state; this session is read-only.
- If the correct table is still unclear after evidence gathering, stop and tell the user, or list \
candidate tables with why each might or might not fit — do not run aggregating SQL on a guess.
- Put the complete final reply in `chat_completion(reply=...)` only once, when done. \
Include tables, fields, time range, SQL, and key result excerpts.
- Do not repeat a tool call with identical arguments unless the prior result failed.
- If a tool result was offloaded, use `read_offloaded_file` only when the preview is insufficient.
- If a tool returns `=== TOOL ERROR ===` JSON, read `tool`, `hint`, and optional `fallback_tool`. \
Prefer fixing arguments for syntax/not_found; consider `fallback_tool` when the primary tool is \
unavailable. If both alternatives failed, `chat_completion` instead of retrying either tool.
- Prefer `compact_context` at natural task boundaries before starting a large new tool sequence.
"""

IDLE_CHAT_COMPLETION_PROMPT = """\
You returned plain text without calling a tool during a retrieval turn. Review the latest tool \
results, then either:
- call tools if you still need glossary terms, table/schema evidence, or query results, or
- call `chat_completion(reply=...)` now with the complete retrieval answer \
(tables, fields, time range, SQL, and key excerpts).
If you add message text with a tool call, use one short user-facing status line only (see Chat style).
"""

TOOL_BUDGET_EXHAUSTED_PROMPT = """\
You have reached the maximum number of tool calls for this retrieval turn. Do not call any \
more data or MCP tools. Summarize what you have learned so far with full evidence \
(candidate tables, fields, time range, SQL if any, assumptions and gaps) and call \
`chat_completion(reply=...)` now. If the correct table is still unclear, say so explicitly \
instead of inventing a source.
"""

REFINE_USER_PROFILE_PROMPT = f"""\
{_TAHOE_REFINE_USER_PROFILE_PROMPT.strip()}

Databot additions:
- Capture lasting data preferences when clearly stated: preferred currency/time grain, favorite \
metrics/dimensions, allowed tables, forbidden columns.
- Favorite metrics/dimensions should be canonical names when known; avoid raw SQL fragments.
- allowed_tables / forbidden_columns are lasting access preferences, not every table touched this turn.
- Do not copy one-off query filters into the profile unless the user states a lasting preference.
"""

IDLE_NUDGE_PROMPT = """\
You returned plain text without calling a tool. Emit ONLY a tool call — no narration. \
Either call a tool to make progress in this Databot stage, or, if the state contract is \
already met (``committed_cards`` populated via ``commit_cards`` in fetch, or ``draft_sql`` + \
``sql_reasons`` in SQL), the router will end the subgraph automatically. In fetch, \
``chat_completion`` alone does NOT satisfy the contract — you must call ``commit_cards`` first. \
Do not respond with plain text alone.
"""
