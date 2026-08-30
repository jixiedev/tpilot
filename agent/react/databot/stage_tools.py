"""Databot stage-scoped tools.

These are the small set of tools the per-stage subgraphs expose alongside
the existing RAG / warehouse tools. They are how the LLM writes the
intermediate state the outer state machine needs:

- ``write_gate_reasons``: set the per-option reason strings the human
  gate will surface. Required before a gate fires.
- ``record_metric_conflict``: flag a glossary/dbt-metric disagreement
  (thought 1 line 29). We do NOT auto-fix; we surface the conflict.
- ``propose_sql``: write the drafted SQL to ``draft_sql`` and optionally
  set ``sql_validated`` after an EXPLAIN.
- ``mark_cards_selected``: convenience used when the LLM is done picking
  cards (sets ``selected_cards`` and clears ``deny_feedback``).
"""

from __future__ import annotations

from typing import Any, Literal, Union

from langchain_core.messages import ToolMessage
from langchain_core.tools import tool
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command

from agent.react.databot.state import DatabotState, GateDecision
from agent.react.databot.gates import GATE_OPTIONS


# Keys we write via Command.update. Kept here so the tool docstrings and
# the outer state machine agree on the schema.
STATE_KEYS = {
    "selected_cards": "selected_cards",
    "gate_reasons_cards": "cards_reasons",
    "gate_reasons_sql": "sql_reasons",
    "metric_conflicts": "metric_conflicts",
    "draft_sql": "draft_sql",
    "sql_validated": "sql_validated",
}


def _ok_tool_message(tool_call_id: str, text: str, artifact: Any = None) -> ToolMessage:
    """Build a ToolMessage that matches the AIMessage tool_call.

    LangGraph requires every ``AIMessage.tool_calls`` entry to have a
    sibling ``ToolMessage`` with the same ``tool_call_id``. Tools that
    return ``Command(update=...)`` for state writes must also append a
    matching ToolMessage; otherwise the next LLM call gets the
    "Expected to have a matching ToolMessage" error.

    ``artifact`` is an out-of-band payload that rides on the
    ``ToolMessage.artifact`` field. We use it as a relay to push the
    committed cards out of the fetch_cards subgraph (which uses
    ``SessionAgentState`` and therefore can't reach the outer
    ``DatabotState.selected_cards`` via ``Command(update=...)``). The
    downstream ``gate_cards`` node walks ``state.messages`` in reverse
    and harvests the artifact from the most recent
    ``mark_cards_selected`` ToolMessage.
    """
    kwargs: dict[str, Any] = {"tool_call_id": tool_call_id}
    if artifact is not None:
        kwargs["artifact"] = artifact
    return ToolMessage(content=text, **kwargs)


def _coerce_gate_reasons(
    raw: Union[dict[GateDecision, str], list[str], str, None],
) -> dict[str, str]:
    """Normalize whatever the LLM passes into ``{option: reason}``.

    LLM has been seen to send:
    - ``{"approve": "...", "deny-comments": "..."}`` (ideal dict)
    - ``["approve: ...", "deny-comments: ...", ...]`` (list, one per option)
    - a single string per option (rare; we ignore)

    The dict form is documented as the primary shape; the list form is
    accepted as a fallback and parsed by position into
    ``GATE_OPTIONS``. Anything else falls back to an empty dict so the
    gate can still fire with no per-option reasons.
    """
    cleaned: dict[str, str] = {}
    if isinstance(raw, dict):
        for opt, text in raw.items():
            key = str(opt).strip()
            if key in GATE_OPTIONS and text is not None:
                cleaned[key] = str(text).strip()
        return cleaned
    if isinstance(raw, list):
        # Positional: align with GATE_OPTIONS order
        for index, opt in enumerate(GATE_OPTIONS):
            if index >= len(raw):
                break
            value = raw[index]
            if value is None:
                continue
            text = str(value).strip()
            if not text:
                continue
            # Some LLMs prefix each entry with "approve: " — strip it
            # so the gate shows the clean reason text.
            if ":" in text:
                head, _, tail = text.partition(":")
                if head.strip() in GATE_OPTIONS:
                    text = tail.strip()
            cleaned[opt] = text
    return cleaned


@tool
def mark_cards_selected(
    cards: list[Any],
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Commit the LLM-picked ``TableCard`` dicts as the current selection.

    Call this after ``fetch_related_models`` (and any datahub glossary
    lookups) returns candidates and you have decided which subset to
    bring to the human for approval. Subsequent calls overwrite the
    selection; if the cards gate returned a ``deny_feedback`` human
    comment, the next selection should reflect that feedback.

    Accepts two call shapes for resilience:
      1. ``cards=[<full TableCard dict from fetch_related_models>, ...]``
         - the LLM echoes the raw dicts it saw on the wire.
      2. ``cards=[]`` - the LLM forgot to pass cards. In that case we
         fall back to the current ``state.candidate_cards`` (whatever
         ``add_card_to_state`` wrote earlier in this stage). This
         keeps the human gate useful when the LLM exits the stage
         without re-listing the raw dicts.
      The committed cards are also stashed in the returned
      ``ToolMessage.artifact`` so the outer graph (which uses a
      different ``DatabotState`` than the inner subgraph's
      ``SessionAgentState``) can recover them via
      ``state.messages`` even when the ``Command(update=...)`` write
      never reaches the outer state.

    When the LLM does pass card names that match entries in
    ``state.candidate_cards``, we hydrate them via
    ``dict_to_table_card`` so downstream consumers see a uniform
    shape. Names that don't match any candidate are dropped with a
    note in the ToolMessage.
    """
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    full_state = runtime.state if runtime is not None else {}
    candidate_cards = (
        list(full_state.get("candidate_cards") or [])
        if isinstance(full_state, dict)
        else []
    )
    by_name = {c.get("name"): c for c in candidate_cards if isinstance(c, dict)}

    if not cards:
        # Fallback path: LLM exited the stage without re-listing the
        # cards. Use whatever the agent pipeline already committed.
        chosen = list(candidate_cards)
        note = (
            f"selected {len(chosen)} card(s) for the human gate "
            f"(auto from state.candidate_cards — LLM did not pass cards)"
        )
    else:
        chosen: list[dict[str, Any]] = []
        missing: list[str] = []
        for c in cards:
            if not isinstance(c, dict):
                # LLM passed a non-dict (e.g. a bare card name string);
                # try to resolve it against candidate_cards by name.
                if isinstance(c, str) and c in by_name:
                    chosen.append(by_name[c])
                else:
                    missing.append(str(c))
                continue
            name = c.get("name")
            if name and name in by_name:
                # Use the hydrated candidate so downstream sees the
                # uniform TableCard shape; the LLM's echoed dict is
                # usually a subset of fields.
                chosen.append(by_name[name])
            else:
                # LLM card not in candidate_cards — accept the dict
                # as-is (add_card_to_state may not have been called
                # first). We don't hydrate here because the fields
                # may be incomplete.
                chosen.append(c)
        note = (
            f"selected {len(chosen)} card(s) for the human gate"
            + (f"; dropped {len(missing)} unmatched" if missing else "")
        )
    import sys
    print(
        f"[DEBUG mark_cards_selected] tool_call_id={tool_call_id!r} "
        f"llm_passed={len(cards)} chosen={len(chosen)} "
        f"candidate_count={len(candidate_cards)}",
        file=sys.stderr,
        flush=True,
    )
    # Stash the chosen cards in the ToolMessage.artifact so the
    # downstream ``gate_cards`` node can recover them via
    # ``state.messages`` reverse-scan (the inner
    # ``SessionAgentState`` has no ``selected_cards`` field, so the
    # ``Command(update=...)`` write above never reaches outer
    # ``DatabotState``).
    return Command(
        update={
            STATE_KEYS["selected_cards"]: chosen,
            "deny_feedback": "",
            "messages": [
                _ok_tool_message(
                    tool_call_id,
                    note,
                    artifact={"event": "mark_cards_selected", "cards": chosen},
                )
            ],
        }
    )


@tool
def record_metric_conflict(
    card_name: str,
    metric: str,
    glossary_term: str,
    reason: str,
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Flag a dbt-model metric that disagrees with a datahub glossary term.

    Per the pipeline's read-only policy, we surface the conflict in the
    final reply and the ``metric_conflicts`` audit field — we do NOT edit
    dbt yml or hive models. Use one call per conflict.
    """
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    payload = {
        "card_name": card_name,
        "metric": metric,
        "glossary_term": glossary_term,
        "reason": reason,
    }
    return Command(
        update={
            STATE_KEYS["metric_conflicts"]: [payload],
            "messages": [
                _ok_tool_message(
                    tool_call_id,
                    f"flagged metric conflict: {metric} vs glossary {glossary_term}",
                )
            ],
        }
    )


@tool
def write_gate_reasons(
    gate: Literal["cards", "sql"],
    reasons: list[str],
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Write the LLM-generated reasons for the four gate options.

    Pass 1–4 strings, positional, aligned with
    ``["approve", "deny-comments", "deny-halt", "dryrun"]``. Each entry
    may be the bare reason or ``"approve: <reason>"`` (we strip the
    prefix). Empty strings are skipped. Required before the gate can
    fire; if you skip this call, the gate runs with empty reasons.

    Why ``list[str]`` only (no dict form): some OpenAI-compatible
    providers (GLM, MiniMax) reject ``Union[dict, list, str]`` arguments
    with a ``Cannot instantiate typing.Union`` schema error. The
    positional list form covers the same LLM intent and round-trips
    cleanly across providers.
    """
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    cleaned = _coerce_gate_reasons(reasons)
    key = (
        STATE_KEYS["gate_reasons_cards"] if gate == "cards" else STATE_KEYS["gate_reasons_sql"]
    )
    return Command(
        update={
            key: cleaned,
            "messages": [
                _ok_tool_message(
                    tool_call_id,
                    f"wrote {len(cleaned)} reason(s) for the {gate} gate",
                )
            ],
        }
    )


@tool
def propose_sql(
    sql: str,
    *,
    validated: bool = False,
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Write the drafted SQL to ``draft_sql``.

    ``validated=True`` if you ran ``trino_run_query`` with ``EXPLAIN`` (or
    equivalent) and the query parsed successfully. The SQL gate uses this
    to skip re-validation on the next pass.
    """
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    cleaned_sql = (sql or "").strip()
    return Command(
        update={
            STATE_KEYS["draft_sql"]: cleaned_sql,
            STATE_KEYS["sql_validated"]: bool(validated),
            "messages": [
                _ok_tool_message(
                    tool_call_id,
                    f"drafted SQL ({len(cleaned_sql)} chars, validated={bool(validated)})",
                )
            ],
        }
    )


@tool
def update_card_selection(
    selected_card_names: list[str],
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Replace the LLM-picked subset with a human-curated subset.

    Called from the human-gate UI when the user wants to add cards the
    LLM skipped, drop cards the LLM over-selected, or rewrite the
    selection entirely. ``selected_card_names`` must be a list of
    ``TableCard.name`` values drawn from the current ``candidate_cards``
    (we re-look-up the full card payloads from state).

    Returns a ``Command`` that updates ``selected_cards`` and resets
    ``deny_feedback`` so the next gate decision does not loop on a
    stale comment.
    """
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    # ``runtime.state`` (ToolRuntime.state) is the LangGraph state at the
    # current node — use it to look up the matching card dicts by name.
    full_state = runtime.state if runtime is not None else {}
    candidates = list(full_state.get("candidate_cards") or []) if isinstance(full_state, dict) else []
    by_name = {c.get("name"): c for c in candidates if isinstance(c, dict)}
    chosen: list[dict[str, Any]] = []
    missing: list[str] = []
    for name in selected_card_names:
        if name in by_name:
            chosen.append(by_name[name])
        else:
            missing.append(name)
    if missing:
        # Surface as a ToolMessage note but still apply the partial set;
        # the human UI already knows what it picked.
        note = (
            f"kept {len(chosen)} card(s); could not find {missing} in "
            f"current candidate_cards — they were dropped or never fetched"
        )
    else:
        note = f"selection updated: {len(chosen)} card(s)"
    return Command(
        update={
            STATE_KEYS["selected_cards"]: chosen,
            "deny_feedback": "",
            "messages": [_ok_tool_message(tool_call_id, note)],
        }
    )


@tool
def request_sql_regenerate(
    feedback: str,
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Ask the SQL-draft subgraph to redraft with a comment from the user.

    The next ``generate_sql`` subgraph turn sees this comment via the
    ``deny_feedback`` state field. The current ``draft_sql`` is cleared
    so the LLM must write a new one.
    """
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    cleaned = (feedback or "").strip()
    return Command(
        update={
            STATE_KEYS["draft_sql"]: "",
            "deny_feedback": cleaned,
            "messages": [
                _ok_tool_message(
                    tool_call_id,
                    f"queued regenerate with feedback ({len(cleaned)} chars)",
                )
            ],
        }
    )


def all_stage_tools() -> list:
    """Return the stage-scoped tools used by fetch and SQL subgraphs."""
    return [
        mark_cards_selected,
        record_metric_conflict,
        write_gate_reasons,
        propose_sql,
        update_card_selection,
        request_sql_regenerate,
    ]


def fetch_stage_tools(
    *,
    fetch_related_models,
    datahub_search,
    datahub_get_entities,
    add_card_to_state,
    chat_completion,
) -> list:
    """Compose the fetch-stage tool list.

    ``datahub_search`` and ``datahub_get_entities`` are lists because
    the same role can be filled by either legacy MCP tools (``search``,
    ``get_entities``) or the native datahub GraphQL helpers
    (``datahub_list_glossary_terms``, ``datahub_graphql_query``). An
    empty list means the role is unavailable this turn; the LLM simply
    does not see the tool.
    """
    out: list = [
        fetch_related_models,
        add_card_to_state,
        mark_cards_selected,
        record_metric_conflict,
        write_gate_reasons,
        chat_completion,
    ]
    out.extend(datahub_search or [])
    out.extend(datahub_get_entities or [])
    return out


def sql_stage_tools(
    *,
    trino_desc_table,
    hive_desc_table,
    trino_explain,
    chat_completion,
) -> list:
    """Compose the SQL-stage tool list. No writes, no RAG re-fetch.

    ``trino_desc_table`` / ``hive_desc_table`` are optional; when both
    are ``None`` the SQL stage has no schema-introspection tool, which
    is fine for offline tests but the LLM should be told in the prompt.
    ``trino_explain`` is required: the SQL stage is expected to validate
    the drafted query via ``EXPLAIN`` before calling ``propose_sql`` with
    ``validated=True``. Without it the LLM has no honest way to set that
    flag, which caused the CopilotKit UI to hang on a half-finished
    ``propose_sql`` + plain-text exit.
    """
    out: list = []
    if trino_desc_table is not None:
        out.append(trino_desc_table)
    if hive_desc_table is not None:
        out.append(hive_desc_table)
    if trino_explain is not None:
        out.append(trino_explain)
    out.extend([propose_sql, write_gate_reasons, chat_completion])
    return out
