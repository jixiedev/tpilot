"""Databot stage-machine state and gate decision types.

This is the per-turn scratchpad the Databot v2 state machine writes to. It
extends ``SessionAgentState`` with stage tracking, card lifecycle, the draft
SQL, an audit trail of human-gate decisions, and a flag for any glossary /
dbt-metric conflicts the LLM surfaced (we do not auto-write — see
``graph.build_databot_graph`` for the explicit "flagged gap" behavior).

The fields are added to the LangGraph state via ``DatabotState``, a
``MessagesState`` subclass declared with TypedDict-style annotations so the
outer graph can be compiled without Pydantic.
"""

from __future__ import annotations

import typing

# ``state.py`` is imported very early in the langgraph dev process
# (before our ``agui_server.py`` shim has a chance to run) so we have to
# patch ``typing.TypedDict`` here too. Without this, pydantic 2.13 raises
# ``PydanticUserError: Please use typing_extensions.TypedDict`` when
# LangGraph introspects ``DatabotState`` to build the input/output
# JSON schemas, and the schema introspection falls back to an empty
# key set — which means ``review_cards`` / ``committed_cards`` /
# ``draft_sql`` are *invisible* to the state snapshot, and
# ``Command(update={"review_cards": ...})`` updates are silently
# dropped because the graph doesn't know those fields exist.
if not hasattr(typing, "_tpilot_typed_dict_shim_applied"):
    import typing_extensions

    typing.TypedDict = typing_extensions.TypedDict  # type: ignore[attr-defined]
    typing._tpilot_typed_dict_shim_applied = True  # type: ignore[attr-defined]

from typing import Any, Literal, TypedDict

from langgraph.graph import MessagesState

from agent.specialists.databot._constants import (
    STAGE_DONE,
    STAGE_EXECUTE,
    STAGE_FETCH,
    STAGE_GATE_CARDS,
    STAGE_GATE_SQL,
    STAGE_SQL,
)
from state.state import SessionAgentState

# Outer state machine stages. Each human gate lives between two stages and
# ``stage`` is what the next conditional edge uses to pick the next node.
DatabotStage = Literal[
    STAGE_FETCH,        # fetch_cards_subgraph: parallel RAG + MCP, then LLM picks cards
    STAGE_GATE_CARDS,   # human approves the card selection
    STAGE_SQL,          # generate_sql_subgraph: draft SQL from approved cards
    STAGE_GATE_SQL,     # human approves the SQL
    STAGE_EXECUTE,      # execute_sql_node: run approved_sql via trino_run_query
    STAGE_DONE,         # terminal
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
    """Per-turn state for the Databot v2 staged pipeline.

    Extends ``SessionAgentState`` to inherit session id, ReAct
    bookkeeping (``tool_call_count``, ``idle_rounds``, ``failed_tools``),
    and ``messages``. The databot fields below are only read and
    written by nodes in ``agent/react/databot/graph.py`` and the
    per-stage subgraph builders. Using the same class for the outer
    graph and the inner subgraphs lets the LLM's
    ``Command(update=...)`` writes land directly — no more silently
    dropped keys, no more bridge nodes to recover lost data.
    """

    # Outer stage-machine pointer.
    stage: DatabotStage

    # fetch stage ------------------------------------------------------------
    # Every ``fetch_related_models`` hit, each with a unique ``staging_id``.
    # The LLM references these ids in ``commit_cards``; unstaged rows
    # stay here until committed or the turn resets.
    staging_cards: list[dict[str, Any]]
    # LLM-committed cards (dims/metrics annotated) via ``commit_cards``.
    committed_cards: list[dict[str, Any]]
    # Cards shown at the human cards gate (copied from ``committed_cards`` by
    # ``prepare_cards_for_gate``; UI may edit via ``update_card_selection``).
    review_cards: list[dict[str, Any]]
    # Cards the human approved. Hydrated to ``TableCard`` objects; downstream
    # SQL generation reads this set as the "working schema" for the query.
    approved_cards: list[dict[str, Any]]
    # Glossary / dbt-metric conflicts the LLM surfaced but did NOT fix.
    # Each entry: {"card_name": str, "metric": str, "glossary_term": str,
    # "reason": str}. Surfaced in the final reply so the user can decide.
    metric_conflicts: list[dict[str, str]]

    # sql stage --------------------------------------------------------------
    draft_sql: str
    approved_sql: str
    # ``True`` if the SQL was successfully compiled (EXPLAIN) before the gate.
    sql_validated: bool

    # execute stage ----------------------------------------------------------
    execution_result: dict[str, Any]

    # Audit trail ------------------------------------------------------------
    gate_decisions: list[GateAuditEntry]
    # LLM-generated per-option reason strings the human gates surface. The
    # LLM is required to populate the right map (``cards_reasons`` or
    # ``sql_reasons``) before its stage exits; the gate node reads from
    # here when building the interrupt prompt.
    cards_reasons: dict[str, str]
    sql_reasons: dict[str, str]
    # Per-turn flags written by the gate / persistence nodes.
    dryrun: bool
    halt_reason: str
    chart_requested: bool
    deny_feedback: str

    # follow-up routing ------------------------------------------------------
    # Set when a web/CLI follow-up arrives after ``stage`` was ``done``.
    follow_up_turn: bool
    # ``knowledge`` (clarify prior answer) vs ``requery`` (new fetch pipeline).
    follow_up_intention: str


# Per-turn databot fields reset at the start of each new question (CLI
# ``prepare_turn_input`` and web entry-node follow-ups). ``messages`` and
# session-scoped fields are intentionally omitted.
FRESH_TURN_STATE_DEFAULTS: dict[str, Any] = {
    "stage": STAGE_FETCH,
    "staging_cards": [],
    "committed_cards": [],
    "review_cards": [],
    "approved_cards": [],
    "metric_conflicts": [],
    "draft_sql": "",
    "approved_sql": "",
    "sql_validated": False,
    "execution_result": {},
    "gate_decisions": [],
    "cards_reasons": {},
    "sql_reasons": {},
    "dryrun": False,
    "halt_reason": "",
    "chart_requested": False,
    "deny_feedback": "",
    "follow_up_turn": False,
    "follow_up_intention": "",
    "tool_call_count": 0,
    "idle_rounds": 0,
    "failed_tools": [],
}


def fresh_turn_state_defaults() -> dict[str, Any]:
    """Return per-turn reset defaults with fresh list/dict instances."""
    fresh: dict[str, Any] = {}
    for key, value in FRESH_TURN_STATE_DEFAULTS.items():
        if isinstance(value, list):
            fresh[key] = []
        elif isinstance(value, dict):
            fresh[key] = {}
        else:
            fresh[key] = value
    return fresh


# Pipeline fields cleared when a **new data-retrieval query** starts (requery
# after follow-up classification, or CLI ``prepare_turn_input``). Not cleared
# on knowledge follow-ups — cards / SQL / results stay visible in the UI.
FRESH_PIPELINE_STATE_KEYS: tuple[str, ...] = (
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
    "tool_call_count",
    "idle_rounds",
    "failed_tools",
)


def fresh_pipeline_state_defaults(*, stage: str = STAGE_FETCH) -> dict[str, Any]:
    """Reset staged pipeline artifacts for a new warehouse query."""
    full = fresh_turn_state_defaults()
    patch = {key: full[key] for key in FRESH_PIPELINE_STATE_KEYS if key in full}
    patch["stage"] = stage
    return patch


def fresh_follow_up_entry_defaults() -> dict[str, Any]:
    """Bookkeeping reset when a follow-up message arrives; keeps pipeline artifacts."""
    return {
        "follow_up_turn": True,
        "follow_up_intention": "",
        "tool_call_count": 0,
        "idle_rounds": 0,
        "failed_tools": [],
    }
