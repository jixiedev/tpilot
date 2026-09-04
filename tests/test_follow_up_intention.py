"""Unit tests for follow-up intention classification."""

from __future__ import annotations

import pytest

from agent.specialists.databot._constants import (
    FOLLOW_UP_INTENTION_KNOWLEDGE,
    FOLLOW_UP_INTENTION_REQUERY,
)
from agent.specialists.databot.follow_up_intention import (
    coerce_follow_up_intention,
    make_classify_follow_up_node,
)
from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel
from langchain_core.messages import AIMessage, HumanMessage


def test_coerce_follow_up_intention_json():
    parsed = coerce_follow_up_intention(
        '{"intention": "knowledge", "reason": "field definition"}'
    )
    assert parsed.intention == FOLLOW_UP_INTENTION_KNOWLEDGE


def test_coerce_follow_up_intention_loose_text():
    parsed = coerce_follow_up_intention("The user wants knowledge clarification")
    assert parsed.intention == FOLLOW_UP_INTENTION_KNOWLEDGE


def test_classify_follow_up_skips_when_not_follow_up_turn():
    model = FakeMessagesListChatModel(responses=[AIMessage(content="unused")])
    node = make_classify_follow_up_node(model)
    patch = node({"follow_up_turn": False, "messages": []})
    assert patch["follow_up_intention"] == FOLLOW_UP_INTENTION_REQUERY


def test_classify_follow_up_skips_empty_latest_human():
    from agent.specialists.databot.follow_up_intention import make_classify_follow_up_node
    from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel
    from langchain_core.messages import AIMessage, HumanMessage

    model = FakeMessagesListChatModel(responses=[AIMessage(content="unused")])
    node = make_classify_follow_up_node(model)
    patch = node(
        {
            "follow_up_turn": True,
            "messages": [
                HumanMessage(content="first"),
                AIMessage(content="done"),
                HumanMessage(content=""),
            ],
        }
    )
    assert patch.get("follow_up_turn") is False


def test_classify_follow_up_uses_model_for_follow_up_turn():
    model = FakeMessagesListChatModel(
        responses=[AIMessage(content='{"intention": "knowledge", "reason": "definition"}')]
    )
    node = make_classify_follow_up_node(model)
    patch = node(
        {
            "follow_up_turn": True,
            "messages": [
                HumanMessage(content="gmv by region"),
                AIMessage(content="here are the numbers"),
                HumanMessage(content="buyer region 是国家还是地区"),
            ],
        }
    )
    assert patch["follow_up_intention"] == FOLLOW_UP_INTENTION_KNOWLEDGE


def test_classify_requery_keeps_approved_cards_off_staging() -> None:
    model = FakeMessagesListChatModel(
        responses=[AIMessage(content='{"intention": "requery", "reason": "country breakdown"}')]
    )
    node = make_classify_follow_up_node(model)
    sid = "fct_transaction_variations_294663db"
    approved = [
        {
            "staging_id": sid,
            "name": "fct_transaction_variations",
            "selected_metrics": ["gmv"],
        }
    ]
    patch = node(
        {
            "follow_up_turn": True,
            "approved_cards": approved,
            "committed_cards": [{"name": "should_clear"}],
            "messages": [
                HumanMessage(content="wish last month gmv"),
                AIMessage(content="here are the numbers"),
                HumanMessage(content="对不同国家进行分组统计"),
            ],
        }
    )
    assert patch["follow_up_intention"] == FOLLOW_UP_INTENTION_REQUERY
    assert "approved_cards" not in patch
    assert patch["committed_cards"] == []
    assert patch["staging_cards"] == []
