from __future__ import annotations

from langchain_core.messages import AIMessage

from agent.chatbot.routes import chatbot_route_after_step
from agent.chatbot.tools import CHAT_COMPLETION_TOOL_NAME


def _state(
    *,
    tool_call_count: int = 0,
    idle_rounds: int = 0,
    tool_calls: list | None = None,
) -> dict:
    return {
        "messages": [AIMessage(content="", tool_calls=tool_calls or [])],
        "tool_call_count": tool_call_count,
        "idle_rounds": idle_rounds,
    }


def test_budget_exhausted_with_data_tools_routes_to_step_llm() -> None:
    route = chatbot_route_after_step(max_tool_steps=10)
    state = _state(
        tool_call_count=10,
        tool_calls=[{"name": "trino_run_query", "args": {"sql": "SELECT 1"}, "id": "1"}],
    )

    assert route(state) == "step_llm"


def test_budget_exhausted_with_chat_completion_routes_to_tools() -> None:
    route = chatbot_route_after_step(max_tool_steps=10)
    state = _state(
        tool_call_count=10,
        tool_calls=[
            {
                "name": CHAT_COMPLETION_TOOL_NAME,
                "args": {"reply": "done"},
                "id": "1",
            }
        ],
    )

    assert route(state) == "step_tools"


def test_budget_exhausted_without_tools_routes_to_step_llm() -> None:
    route = chatbot_route_after_step(max_tool_steps=10)
    state = _state(tool_call_count=10, idle_rounds=1)

    assert route(state) == "step_llm"


def test_under_budget_with_tools_routes_to_tools() -> None:
    route = chatbot_route_after_step(max_tool_steps=10)
    state = _state(
        tool_call_count=3,
        tool_calls=[{"name": "hive_list_tables", "args": {"database": "default"}, "id": "1"}],
    )

    assert route(state) == "step_tools"


def test_idle_limit_without_budget_routes_to_end() -> None:
    route = chatbot_route_after_step(max_tool_steps=10, max_idle_rounds=3)
    state = _state(idle_rounds=3)

    assert route(state) == "__end__"


def test_idle_limit_with_budget_exhausted_routes_to_end() -> None:
    route = chatbot_route_after_step(max_tool_steps=10, max_idle_rounds=3)
    state = _state(tool_call_count=10, idle_rounds=3)

    assert route(state) == "__end__"
