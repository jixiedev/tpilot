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
# key set — which means ``selected_cards`` / ``candidate_cards`` /
# ``draft_sql`` are *invisible* to the state snapshot, and
# ``Command(update={"selected_cards": ...})`` updates are silently
# dropped because the graph doesn't know those fields exist.
if not hasattr(typing, "_tpilot_typed_dict_shim_applied"):
    import typing_extensions

    typing.TypedDict = typing_extensions.TypedDict  # type: ignore[attr-defined]
    typing._tpilot_typed_dict_shim_applied = True  # type: ignore[attr-defined]

from typing import Any, Literal, TypedDict

from langgraph.graph import MessagesState

# Outer state machine stages. Each human gate lives between two stages and
# ``stage`` is what the next conditional edge uses to pick the next node.
DatabotStage = Literal[
    "fetch",        # fetch_cards_subgraph: parallel RAG + MCP, then LLM picks cards
    "gate_cards",   # human approves the card selection
    "sql",          # generate_sql_subgraph: draft SQL from approved cards
    "gate_sql",     # human approves the SQL
    "execute",      # execute_sql_node: run approved_sql via trino_run_query
    "chart",        # chart_question_node: ask whether to emit a chart
    "done",         # terminal
]

# Human gate verdicts. Matches thought 1 from tools/rag/semantic.py.
GateDecision = Literal["approve", "deny-comments", "deny-halt", "dryrun"]


class GateAuditEntry(TypedDict):
    """One row of the per-turn gate audit trail."""

    gate: Literal["cards", "sql"]
    decision: GateDecision
    comments: str
    # The four LLM-generated reason strings the gate prompt asked for.
    reasons: dict[str, str]


class DatabotState(MessagesState):
    """Per-turn state for the Databot v2 staged pipeline.

    Inherits ``messages`` and ReAct bookkeeping (``tool_call_count``,
    ``idle_rounds``, ``failed_tools``) from ``MessagesState`` / the runtime
    contract used by the rest of the codebase. The keys below are only read
    and written by nodes in ``agent/react/databot/graph.py`` and the
    per-stage subgraph builders.
    """

    # Outer stage-machine pointer.
    stage: DatabotStage

    # fetch stage ------------------------------------------------------------
    # Raw RAG / MCP hits the parallel fetch produced. Each entry is the
    # ``TableCard``-shaped dict that ``fetch_related_models`` and the MCP
    # datahub search return (no hydration yet).
    candidate_cards: list[dict[str, Any]]
    # The subset of candidate_cards the LLM picked. The LLM must always write
    # here before the cards gate fires; ``selected_cards`` is what the human
    # actually reviews.
    selected_cards: list[dict[str, Any]]
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
