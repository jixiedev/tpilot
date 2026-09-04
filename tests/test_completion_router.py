"""Tests for ReAct turn routing (empty tool calls vs tools vs state contract)."""

from __future__ import annotations

from langchain_core.messages import AIMessage, HumanMessage

from agent.config import AgentRunContext, RouterConfig
from agent.router import CompletionToolRouter
from agent.turn import last_user_visible_reply


def _react_router() -> CompletionToolRouter:
    return CompletionToolRouter(
        AgentRunContext(max_tool_calls=10, max_idle_rounds=1),
        RouterConfig(),
    )


def test_route_after_reason_ends_on_plain_assistant_text() -> None:
    router = _react_router()
    route = router.route_after_reason()
    state = {
        "messages": [
            HumanMessage(content="what is GMV?"),
            AIMessage(content="GMV is gross merchandise value."),
        ],
        "tool_call_count": 0,
        "idle_rounds": 1,
    }
    assert route(state) == "__end__"


def test_last_user_visible_reply_ignores_prior_turn() -> None:
    state = {
        "messages": [
            HumanMessage(content="gmv by country"),
            AIMessage(content="main answer"),
            HumanMessage(content="shipping_country 是什么意思"),
        ],
    }
    assert last_user_visible_reply(state) is None


def test_last_user_visible_reply_uses_current_turn_text() -> None:
    state = {
        "messages": [
            HumanMessage(content="gmv by country"),
            AIMessage(content="old"),
            HumanMessage(content="shipping_country 是什么意思"),
            AIMessage(
                content="",
                tool_calls=[{"name": "search", "args": {}, "id": "1"}],
            ),
            AIMessage(content="buyer country"),
        ],
    }
    assert last_user_visible_reply(state) == "buyer country"
