"""Databot stage-machine state and gate decision types.

Design (snapshot-first):

- **Snapshot fields** describe *what exists now*: ``stage``, ``staging_cards``,
  ``committed_cards``, ``draft_sql``, ``execution_result``, ``halt_reason``,
  gate audit rows, etc. At most one of staging vs committed should be populated
  per domain (cards / SQL) before human review completes.
- **``stage``** is the outer state-machine pointer (``prepare_cards``,
  ``prepare_sql``, ``execute_sql``, ``summary``). Gate nodes write the next
  phase; ``graph.node_for_state`` picks the graph node inside a phase.
- ReAct loop fields (``tool_call_count``, etc.) live only on
  :class:`DatabotReactState` inside fetch/SQL subgraphs.
"""

from __future__ import annotations

from typing import Any, Literal

from langchain_core.messages import BaseMessage
from typing_extensions import TypedDict

from graph.state import ReactAgentState, SessionAgentState

PHASE_PREPARE_CARDS = "prepare_cards"
PHASE_PREPARE_SQL = "prepare_sql"
PHASE_EXECUTE_SQL = "execute_sql"
PHASE_SUMMARY = "summary"

# Pipeline phase stored in ``stage`` (four phases).
DatabotPhaseName = Literal[
    PHASE_PREPARE_CARDS,
    PHASE_PREPARE_SQL,
    PHASE_EXECUTE_SQL,
    PHASE_SUMMARY,
]

# Human gate verdicts.
GateDecision = Literal["approve", "deny-comments", "deny-halt", "dryrun"]


class GateAuditEntry(TypedDict):
    """One row of the per-turn gate audit trail."""

    gate: Literal["cards", "sql"]
    decision: GateDecision
    comments: str
    # The four LLM-generated reason strings the gate prompt asked for.
    reasons: dict[str, str]


class DatabotState(SessionAgentState):
    """Outer Databot pipeline state (session messages + staged snapshots)."""

    history_cards: list[dict[str, Any]]
    stage: DatabotPhaseName
    staging_cards: list[dict[str, Any]]
    committed_cards: list[dict[str, Any]]
    metric_conflicts: list[dict[str, Any]]
    review_cards: list[dict[str, Any]]
    cards_reasons: dict[str, str]
    cards_selection_summary: str
    approved_cards: list[dict[str, Any]]
    draft_sql: str
    sql_validated: bool
    sql_reasons: dict[str, str]
    approved_sql: str
    gate_decisions: list[GateAuditEntry]
    dryrun: bool
    halt_reason: str
    deny_feedback: str
    execution_result: dict[str, Any]


def fetch_react_input(state: dict[str, Any]) -> FetchReactInput:
    """Clone session messages and copy fetch-stage pipeline fields for ReAct."""
    return {
        "messages": list(state.get("messages") or []),
        "session_name": str(state.get("session_name") or ""),
        "user_id": str(state.get("user_id") or ""),
        "history_cards": list(state.get("history_cards") or []),
        "staging_cards": list(state.get("staging_cards") or []),
        "committed_cards": list(state.get("committed_cards") or []),
        "approved_cards": list(state.get("approved_cards") or []),
        "metric_conflicts": list(state.get("metric_conflicts") or []),
        "deny_feedback": str(state.get("deny_feedback") or ""),
    }

def merge_fetch_react_output(output: dict[str, Any]) -> dict[str, Any]:
    """LangGraph node update from fetch ReAct ``output_schema``."""
    patch: dict[str, Any] = {}
    for key in ("staging_cards", "committed_cards", "metric_conflicts", "messages"):
        if key in output and output[key] is not None:
            patch[key] = output[key]
    return patch

def sql_react_input(state: dict[str, Any]) -> SqlReactInput:
    """Clone session messages and copy SQL-stage pipeline fields for ReAct."""
    return {
        "messages": list(state.get("messages") or []),
        "session_name": str(state.get("session_name") or ""),
        "user_id": str(state.get("user_id") or ""),
        "approved_cards": list(state.get("approved_cards") or []),
        "draft_sql": str(state.get("draft_sql") or ""),
        "sql_validated": bool(state.get("sql_validated")),
        "sql_reasons": dict(state.get("sql_reasons") or {}),
        "deny_feedback": str(state.get("deny_feedback") or ""),
    }

def merge_sql_react_output(output: dict[str, Any]) -> dict[str, Any]:
    patch: dict[str, Any] = {}
    for key in ("draft_sql", "sql_validated", "sql_reasons", "messages"):
        if key in output and output[key] is not None:
            patch[key] = output[key]
    return patch

def react_turn_init(_state: FetchReactInput | SqlReactInput) -> dict[str, Any]:
    """Reset per-layer ReAct counters at subgraph entry."""
    return dict(ReactAgentState.fresh_turn_defaults())


class DatabotReactState(ReactAgentState):
    """Inner ReAct loop state (tools + counters + pipeline fields tools may write)."""

    history_cards: list[dict[str, Any]]
    staging_cards: list[dict[str, Any]]
    committed_cards: list[dict[str, Any]]
    approved_cards: list[dict[str, Any]]
    metric_conflicts: list[dict[str, Any]]
    deny_feedback: str
    draft_sql: str
    sql_validated: bool
    sql_reasons: dict[str, str]
    approved_sql: str
    stage: str


class FetchReactInput(TypedDict):
    """Input to the fetch-cards ReAct subgraph (built from :class:`DatabotState`)."""

    messages: list[BaseMessage]
    session_name: str
    user_id: str
    history_cards: list[dict[str, Any]]
    staging_cards: list[dict[str, Any]]
    committed_cards: list[dict[str, Any]]
    approved_cards: list[dict[str, Any]]
    metric_conflicts: list[dict[str, Any]]
    deny_feedback: str


class FetchReactOutput(TypedDict, total=False):
    """Patch merged back onto :class:`DatabotState` after fetch ReAct."""

    messages: list[BaseMessage]
    staging_cards: list[dict[str, Any]]
    committed_cards: list[dict[str, Any]]
    metric_conflicts: list[dict[str, Any]]


class SqlReactInput(TypedDict):
    """Input to the generate-sql ReAct subgraph."""

    messages: list[BaseMessage]
    session_name: str
    user_id: str
    approved_cards: list[dict[str, Any]]
    draft_sql: str
    sql_validated: bool
    sql_reasons: dict[str, str]
    deny_feedback: str


class SqlReactOutput(TypedDict, total=False):
    """Patch merged back onto :class:`DatabotState` after SQL ReAct."""

    messages: list[BaseMessage]
    draft_sql: str
    sql_validated: bool
    sql_reasons: dict[str, str]


__all__ = [
    "DatabotPhaseName",
    "DatabotReactState",
    "FetchReactInput",
    "FetchReactOutput",
    "GateAuditEntry",
    "GateDecision",
    "PHASE_EXECUTE_SQL",
    "PHASE_PREPARE_CARDS",
    "PHASE_PREPARE_SQL",
    "PHASE_SUMMARY",
    "SqlReactInput",
    "SqlReactOutput",
]
