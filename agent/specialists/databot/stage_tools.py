"""Stage-scoped tools for Databot subgraphs (gate reasons, cards, SQL draft)."""

from __future__ import annotations

from typing import Any, Literal, Union

from langchain_core.messages import ToolMessage
from langchain_core.tools import tool
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command

from agent.specialists.databot._constants import STAGE_GATE_CARDS, STAGE_GATE_SQL
from agent.specialists.databot.gates import GATE_OPTIONS
from agent.specialists.databot.state import GateDecision
from agent.specialists.databot.ui_actions import (
    apply_propose_sql,
    apply_request_sql_regenerate,
    apply_update_card_selection,
)
from tools.common import bind_tool_to_agent


# Keys written via Command.update.
STATE_KEYS = {
    "review_cards": "review_cards",
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

    ``artifact`` is optional out-of-band payload on the ToolMessage.
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


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("databot,fetch")
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
    full_state = runtime.state if runtime is not None else {}
    prev = (
        list(full_state.get("metric_conflicts") or [])
        if isinstance(full_state, dict)
        else []
    )
    return Command(
        update={
            STATE_KEYS["metric_conflicts"]: prev + [payload],
            "messages": [
                _ok_tool_message(
                    tool_call_id,
                    f"flagged metric conflict: {metric} vs glossary {glossary_term}",
                )
            ],
        }
    )


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("databot,sql")
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
    next_stage = STAGE_GATE_CARDS if gate == "cards" else STAGE_GATE_SQL
    return Command(
        update={
            key: cleaned,
            "stage": next_stage,
            "messages": [
                _ok_tool_message(
                    tool_call_id,
                    f"wrote {len(cleaned)} reason(s) for the {gate} gate; stage → {next_stage}",
                )
            ],
        }
    )


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("databot,sql")
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
    patch = apply_propose_sql(sql, validated=validated)
    cleaned_sql = patch["draft_sql"]
    return Command(
        update={
            **patch,
            "messages": [
                _ok_tool_message(
                    tool_call_id,
                    f"drafted SQL ({len(cleaned_sql)} chars, validated={bool(validated)})",
                )
            ],
        }
    )


@bind_tool_to_agent("databot,default")
@tool
def update_card_selection(
    selected_card_names: list[str],
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Replace the LLM-picked subset with a human-curated subset.

    Called from the human-gate UI when the user wants to add cards the
    LLM skipped, drop cards the LLM over-selected, or rewrite the
    selection entirely. ``selected_card_names`` must be a list of
    ``TableCard.name`` values drawn from the current ``committed_cards``
    (we re-look-up the full card payloads from state).

    Returns a ``Command`` that updates ``review_cards`` and resets
    ``deny_feedback`` so the next gate decision does not loop on a
    stale comment.
    """
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    full_state = runtime.state if runtime is not None else {}
    if not isinstance(full_state, dict):
        full_state = {}
    patch = apply_update_card_selection(full_state, selected_card_names)
    chosen = patch["review_cards"]
    requested = len(selected_card_names)
    if len(chosen) < requested:
        note = (
            f"kept {len(chosen)} card(s); could not find "
            f"{requested - len(chosen)} name(s) in current committed_cards"
        )
    else:
        note = f"selection updated: {len(chosen)} card(s)"
    return Command(
        update={
            **patch,
            "messages": [_ok_tool_message(tool_call_id, note)],
        }
    )


@bind_tool_to_agent("databot,default")
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
    patch = apply_request_sql_regenerate(feedback)
    cleaned = patch["deny_feedback"]
    return Command(
        update={
            **patch,
            "messages": [
                _ok_tool_message(
                    tool_call_id,
                    f"queued regenerate with feedback ({len(cleaned)} chars)",
                )
            ],
        }
    )

