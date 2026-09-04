"""Tests for Databot outer-graph stage prep nodes."""

from __future__ import annotations

from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from agent.specialists.databot._constants import STAGE_GATE_CARDS
from agent.specialists.databot.stage_prep import make_prepare_cards_for_gate_node


class _FakeChatModel:
    def __init__(self, content: str):
        self._content = content
        self.invoke_calls: list = []

    def invoke(self, messages):
        self.invoke_calls.append(messages)
        return AIMessage(content=self._content)


def test_prepare_cards_for_gate_copies_candidates_and_reasons() -> None:
    llm_reasons = (
        '["orders_daily covers yesterday order count — approve to draft SQL.", '
        '"Request changes if you need a different grain or metrics.", '
        '"Halt if the question cannot be answered from these models.", '
        '"Dry-run to preview without saving a profile."]'
    )
    model = _FakeChatModel(llm_reasons)
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
                "selection_notes": "primary fact for daily orders",
            }
        ],
        "metric_conflicts": [],
        "deny_feedback": "stale",
    }
    patch = node(state)  # type: ignore[arg-type]
    assert patch["stage"] == STAGE_GATE_CARDS
    assert patch["deny_feedback"] == ""
    assert patch["review_cards"] == state["committed_cards"]
    assert "orders_daily" in patch["cards_reasons"]["approve"]
    assert "yesterday" in patch["cards_reasons"]["approve"].lower()
    assert "grain" in patch["cards_reasons"]["deny-comments"].lower()
    assert "orders_daily" in patch["cards_selection_summary"]
    assert "primary fact" in patch["cards_selection_summary"]
    assert model.invoke_calls
    human = model.invoke_calls[0][-1]
    assert "orders_daily" in human.content
    assert "how many orders yesterday?" in human.content


def test_prepare_cards_for_gate_ignores_think_dump() -> None:
    dump = (
        "<think>The user wants me to write gate option copy for the reviewer. "
        "I need to write one sentence per option.</think>"
    )
    node = make_prepare_cards_for_gate_node(_FakeChatModel(dump))
    patch = node(
        {
            "messages": [HumanMessage(content="last month GMV by country")],
            "committed_cards": [{"name": "fct_transaction_variations"}],
        }
    )  # type: ignore[arg-type]
    assert "<think>" not in patch["cards_reasons"]["approve"]
    assert "The user wants" not in patch["cards_reasons"]["approve"]
    assert "committed models" in patch["cards_reasons"]["approve"].lower()
