"""Tests for Databot phase routing."""

from __future__ import annotations

from agent.specialists.databot.graph import (
    NODE_END_WITH_SUMMARY,
    NODE_EXECUTE_SQL,
    NODE_GATE_CARDS,
    NODE_GATE_SQL,
    NODE_GENERATE_SQL,
    PHASE_EXECUTE_SQL,
    PHASE_PREPARE_CARDS,
    PHASE_PREPARE_SQL,
    PHASE_SUMMARY,
)
from agent.specialists.databot.graph import after_generate_sql, node_for_state


def test_node_for_prepare_cards_at_gate() -> None:
    state = {
        "stage": PHASE_PREPARE_CARDS,
        "review_cards": [{"name": "t1"}],
        "cards_reasons": {"approve": "ok"},
    }
    assert node_for_state(state) == NODE_GATE_CARDS


def test_node_for_prepare_sql_and_summary() -> None:
    assert node_for_state({"stage": PHASE_PREPARE_SQL}) == NODE_GENERATE_SQL
    assert node_for_state({"stage": PHASE_EXECUTE_SQL}) == NODE_EXECUTE_SQL
    assert node_for_state({"stage": PHASE_SUMMARY}) == NODE_END_WITH_SUMMARY


def test_route_after_generate_sql_incomplete_draft() -> None:
    node = after_generate_sql(
        {"stage": PHASE_PREPARE_SQL, "draft_sql": "", "sql_reasons": {}}
    )
    assert node == NODE_GATE_SQL
