"""Pure state patches for Databot UI controls (cards / SQL editor).

The AG-UI frontend calls these via ``agui_server.databot_ui_action`` instead
of round-tripping through the LLM. ``stage_tools`` reuses the same helpers
where the LLM-owned tools mirror the UI behavior.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any, Literal

from langchain_core.messages import HumanMessage

from agent.specialists.databot._constants import (
    STAGE_FETCH,
    STAGE_GATE_CARDS,
    STAGE_GATE_SQL,
    STAGE_SQL,
)

DatabotUiAction = Literal[
    "update_card_selection",
    "propose_sql",
    "request_sql_regenerate",
]

ACTION_ALLOWED_STAGES: dict[DatabotUiAction, frozenset[str]] = {
    "update_card_selection": frozenset({STAGE_GATE_CARDS}),
    "propose_sql": frozenset({STAGE_SQL, STAGE_GATE_SQL}),
    "request_sql_regenerate": frozenset({STAGE_SQL}),
}

DATABOT_STATE_KEYS: tuple[str, ...] = (
    "stage",
    "staging_cards",
    "committed_cards",
    "review_cards",
    "approved_cards",
    "metric_conflicts",
    "draft_sql",
    "approved_sql",
    "sql_validated",
    "execution_result",
    "gate_decisions",
    "cards_reasons",
    "sql_reasons",
    "dryrun",
    "halt_reason",
    "chart_requested",
    "deny_feedback",
)


def databot_state_subset(state: Mapping[str, Any]) -> dict[str, Any]:
    """Return databot fields from a LangGraph state dict for the frontend."""
    return {key: state[key] for key in DATABOT_STATE_KEYS if key in state}


def apply_update_card_selection(
    state: Mapping[str, Any],
    selected_card_names: list[str],
) -> dict[str, Any]:
    """Replace ``review_cards`` with a human-curated subset."""
    candidates = list(state.get("committed_cards") or [])
    by_name = {
        c.get("name"): c for c in candidates if isinstance(c, dict) and c.get("name")
    }
    chosen: list[dict[str, Any]] = []
    for name in selected_card_names:
        card = by_name.get(name)
        if card is not None:
            chosen.append(card)
    return {
        "review_cards": chosen,
        "deny_feedback": "",
    }


def apply_propose_sql(sql: str, *, validated: bool = False) -> dict[str, Any]:
    """Write a human-edited SQL draft."""
    cleaned_sql = (sql or "").strip()
    return {
        "draft_sql": cleaned_sql,
        "sql_validated": bool(validated),
    }


def apply_request_sql_regenerate(feedback: str) -> dict[str, Any]:
    """Queue SQL redraft feedback for the next ``generate_sql`` entry."""
    cleaned = (feedback or "").strip()
    return {
        "draft_sql": "",
        "sql_reasons": {},
        "sql_validated": False,
        "deny_feedback": cleaned,
    }


def _subgraph_redraft_counters() -> dict[str, Any]:
    """Reset per-subgraph ReAct bookkeeping so a gate redraft gets a fresh budget."""
    return {
        "tool_call_count": 0,
        "idle_rounds": 0,
        "failed_tools": [],
    }


def _feedback_human_message(feedback: str, *, gate: str) -> dict[str, Any]:
    cleaned = (feedback or "").strip()
    if not cleaned:
        return {}
    return {
        "messages": [
            HumanMessage(
                content=(
                    f"{gate} gate review — redraft and address this feedback:\n{cleaned}"
                ),
            ),
        ],
    }


def apply_cards_gate_redraft(feedback: str) -> dict[str, Any]:
    """Reset card-gate outputs so the fetch subgraph must re-run."""
    cleaned = (feedback or "").strip()
    return {
        "stage": STAGE_FETCH,
        "deny_feedback": cleaned,
        "cards_reasons": {},
        **_subgraph_redraft_counters(),
        **_feedback_human_message(cleaned, gate="Cards"),
    }


def apply_sql_gate_redraft(feedback: str) -> dict[str, Any]:
    """Reset SQL-gate outputs so the generate_sql subgraph must re-run."""
    cleaned = (feedback or "").strip()
    return {
        "stage": STAGE_SQL,
        **apply_request_sql_regenerate(cleaned),
        **_subgraph_redraft_counters(),
        **_feedback_human_message(cleaned, gate="SQL"),
    }


def build_ui_action_patch(
    action: DatabotUiAction,
    state: Mapping[str, Any],
    *,
    selected_card_names: list[str] | None = None,
    sql: str | None = None,
    validated: bool = False,
    feedback: str | None = None,
) -> dict[str, Any]:
    """Validate stage and return the LangGraph state patch for ``action``."""
    stage = str(state.get("stage") or "")
    allowed = ACTION_ALLOWED_STAGES[action]
    if stage not in allowed:
        raise ValueError(
            f"action {action!r} is not allowed in stage {stage!r} "
            f"(allowed: {sorted(allowed)})"
        )

    if action == "update_card_selection":
        return apply_update_card_selection(state, list(selected_card_names or []))
    if action == "propose_sql":
        if not (sql or "").strip():
            raise ValueError("sql must not be empty")
        return apply_propose_sql(sql or "", validated=validated)
    if action == "request_sql_regenerate":
        if not (feedback or "").strip():
            raise ValueError("feedback must not be empty")
        return apply_request_sql_regenerate(feedback or "")
    raise ValueError(f"unknown action: {action}")
