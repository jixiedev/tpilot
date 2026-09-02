"""Tests for Databot outer-graph stage prep nodes."""

from __future__ import annotations

from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel

from agent.react.databot._constants import STAGE_GATE_CARDS
from agent.react.databot.stage_prep import make_prepare_cards_for_gate_node


def test_prepare_cards_for_gate_copies_candidates_and_reasons() -> None:
    model = FakeMessagesListChatModel(
        responses=[
            AIMessage(
                content='["approve ok", "need changes", "halt", "preview only"]'
            )
        ]
    )
    node = make_prepare_cards_for_gate_node(model)
    state = {
        "messages": [
            HumanMessage(content="how many orders yesterday?"),
            ToolMessage(content="staged 2 models", tool_call_id="1", name="fetch_related_models"),
        ],
        "committed_cards": [
            {
                "name": "orders_daily",
                "staging_id": "orders_abc",
                "selected_metrics": ["order_count"],
            }
        ],
        "metric_conflicts": [],
        "deny_feedback": "stale",
    }
    patch = node(state)  # type: ignore[arg-type]
    assert patch["stage"] == STAGE_GATE_CARDS
    assert patch["deny_feedback"] == ""
    assert patch["review_cards"] == state["committed_cards"]
    assert patch["cards_reasons"]["approve"] == "approve ok"
    assert patch["cards_reasons"]["dryrun"] == "preview only"
