"""Tests for Databot UI action state patches."""

from __future__ import annotations

import pytest

from langchain_core.messages import HumanMessage

from agent.specialists.databot.ui_actions import (
    apply_cards_gate_redraft,
    apply_propose_sql,
    apply_request_sql_regenerate,
    apply_sql_gate_redraft,
    apply_update_card_selection,
    build_ui_action_patch,
    is_gate_redraft_message,
    user_question_from_messages,
)


def test_apply_update_card_selection_resolves_candidates() -> None:
    state = {
        "committed_cards": [
            {"name": "fct_orders", "description": "orders"},
            {"name": "dim_users", "description": "users"},
        ],
        "review_cards": [{"name": "fct_orders"}],
    }
    patch = apply_update_card_selection(state, ["dim_users", "missing"])
    assert [c["name"] for c in patch["review_cards"]] == ["dim_users"]
    assert patch["deny_feedback"] == ""


def test_apply_propose_sql_sets_validated_flag() -> None:
    patch = apply_propose_sql("SELECT 1", validated=True)
    assert patch["draft_sql"] == "SELECT 1"
    assert patch["sql_validated"] is True


def test_apply_request_sql_regenerate_clears_sql_contract() -> None:
    patch = apply_request_sql_regenerate("use commission_revenue, not gmv")
    assert patch["draft_sql"] == ""
    assert patch["sql_reasons"] == {}
    assert patch["sql_validated"] is False
    assert patch["deny_feedback"] == "use commission_revenue, not gmv"


def test_apply_cards_gate_redraft_clears_card_pipeline() -> None:
    patch = apply_cards_gate_redraft("need another model")
    assert patch["stage"] == "fetch"
    assert patch["staging_cards"] == []
    assert patch["committed_cards"] == []
    assert patch["review_cards"] == []
    assert patch["deny_feedback"] == "need another model"


def test_apply_sql_gate_redraft_resets_stage() -> None:
    patch = apply_sql_gate_redraft("wrong metric")
    assert patch["stage"] == "sql"
    assert patch["draft_sql"] == ""
    assert patch["sql_reasons"] == {}
    assert patch["tool_call_count"] == 0
    assert patch["idle_rounds"] == 0
    assert patch["deny_feedback"] == "wrong metric"
    assert patch["messages"][0].content.startswith("SQL gate review")


def test_build_ui_action_patch_rejects_wrong_stage() -> None:
    with pytest.raises(ValueError, match="not allowed"):
        build_ui_action_patch(
            "update_card_selection",
            {"stage": "sql"},
            selected_card_names=["fct_orders"],
        )


def test_build_ui_action_patch_allows_gate_cards_selection() -> None:
    state = {
        "stage": "gate_cards",
        "committed_cards": [{"name": "fct_orders"}],
    }
    patch = build_ui_action_patch(
        "update_card_selection",
        state,
        selected_card_names=["fct_orders"],
    )
    assert patch["review_cards"][0]["name"] == "fct_orders"


def test_is_gate_redraft_message() -> None:
    assert is_gate_redraft_message(
        "SQL gate review — redraft and address this feedback:\n日期错了"
    )
    assert not is_gate_redraft_message("上个月各国 GMV")


def test_user_question_from_messages_skips_gate_redrafts() -> None:
    messages = [
        HumanMessage(content="上个月各国 GMV"),
        HumanMessage(
            content=(
                "SQL gate review — redraft and address this feedback:\n日期错了"
            )
        ),
        HumanMessage(
            content=(
                "SQL gate review — redraft and address this feedback:\n"
                "现在是2026.09.03"
            )
        ),
    ]
    assert user_question_from_messages(messages) == "上个月各国 GMV"
