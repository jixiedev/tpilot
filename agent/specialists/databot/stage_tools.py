"""Stage-scoped tools for Databot subgraphs (gate reasons, cards, SQL draft)."""

from __future__ import annotations

from typing import Any, Literal

from langchain_core.messages import ToolMessage
from langchain_core.tools import tool
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command

from agent.specialists.databot.state import PHASE_PREPARE_CARDS, PHASE_PREPARE_SQL
from agent.specialists.databot.gates import coerce_reasons
from agent.specialists.databot.ui_actions import apply_propose_sql, apply_request_sql_regenerate, apply_update_card_selection
from tools.registry import register_tool


# Keys written via Command.update.
STATE_KEYS = {
    "review_cards": "review_cards",
    "gate_reasons_cards": "cards_reasons",
    "gate_reasons_sql": "sql_reasons",
    "metric_conflicts": "metric_conflicts",
    "draft_sql": "draft_sql",
    "sql_validated": "sql_validated",
}


class StageCommands:
    """Shared Command pieces for the stage-scoped tools registered below.

    The ``@tool`` functions stay at module scope because that is how they
    are bound into the agent tool registry. Their behavior lives here.
    """

    @staticmethod
    def tool_message(tool_call_id: str, text: str, artifact: Any = None) -> ToolMessage:
        """ToolMessage matching the assistant ``tool_call_id``."""
        kwargs: dict[str, Any] = {"tool_call_id": tool_call_id}
        if artifact is not None:
            kwargs["artifact"] = artifact
        return ToolMessage(content=text, **kwargs)


@register_tool
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
                StageCommands.tool_message(
                    tool_call_id,
                    f"flagged metric conflict: {metric} vs glossary {glossary_term}",
                )
            ],
        }
    )


@register_tool
@tool
def write_gate_reasons(
    gate: Literal["cards", "sql"],
    reasons: list[str],
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Write persuasive reasons for the four human gate options.

    The human picks exactly one of ``approve``, ``deny-comments``, ``deny-halt``, or
    ``dryrun``. For **each** option, pass one short sentence explaining **why the
    reviewer should choose that option for this turn** — not what the option does in
    the abstract, and not internal planning text (no ``<think>`` tags, no ``Context:``
    bullets, no restating the task).

    Pass 1–4 strings, positional, aligned with
    ``["approve", "deny-comments", "deny-halt", "dryrun"]``. Each entry may be the bare
    reason or ``"approve: <reason>"`` (we strip the prefix). Empty strings are skipped.

    Cards gate reasons are normally filled by the outer ``prepare_cards_for_gate`` node;
    call this from the SQL stage before the SQL gate when drafting is complete.
    """
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    cleaned = coerce_reasons(reasons)
    key = (
        STATE_KEYS["gate_reasons_cards"] if gate == "cards" else STATE_KEYS["gate_reasons_sql"]
    )
    next_stage = PHASE_PREPARE_CARDS if gate == "cards" else PHASE_PREPARE_SQL
    return Command(
        update={
            key: cleaned,
            "stage": next_stage,
            "messages": [
                StageCommands.tool_message(
                    tool_call_id,
                    f"wrote {len(cleaned)} reason(s) for the {gate} gate; stage → {next_stage}",
                )
            ],
        }
    )


@register_tool
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
                StageCommands.tool_message(
                    tool_call_id,
                    f"drafted SQL ({len(cleaned_sql)} chars, validated={bool(validated)})",
                )
            ],
        }
    )


@register_tool
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
            "messages": [StageCommands.tool_message(tool_call_id, note)],
        }
    )


@register_tool
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
                StageCommands.tool_message(
                    tool_call_id,
                    f"queued regenerate with feedback ({len(cleaned)} chars)",
                )
            ],
        }
    )

