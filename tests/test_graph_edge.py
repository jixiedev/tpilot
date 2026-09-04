from __future__ import annotations

from langchain_core.messages import AIMessage

from agent.config import AgentRunContext, RouterConfig
from agent.router import CompletionToolRouter


def _state(
    *,
    tool_call_count: int = 0,
    idle_rounds: int = 0,
    tool_calls: list | None = None,
    **extra,
) -> dict:
    return {
        "messages": [AIMessage(content="", tool_calls=tool_calls or [])],
        "tool_call_count": tool_call_count,
        "idle_rounds": idle_rounds,
        **extra,
    }


def _route(
    *,
    max_tool_steps: int = 10,
    max_idle_rounds: int = 3,
    state_exit_keys: tuple[str, ...] = (),
):
    router = CompletionToolRouter(
        AgentRunContext(max_tool_calls=max_tool_steps, max_idle_rounds=max_idle_rounds),
        RouterConfig(state_exit_keys=state_exit_keys),
    )
    return router.route_after_reason()


def test_budget_exhausted_with_tools_routes_to_end() -> None:
    route = _route(max_tool_steps=10)
    state = _state(
        tool_call_count=10,
        tool_calls=[{"name": "trino_run_query", "args": {"sql": "SELECT 1"}, "id": "1"}],
    )

    assert route(state) == "__end__"


def test_under_budget_with_tools_routes_to_action() -> None:
    route = _route(max_tool_steps=10)
    state = _state(
        tool_call_count=3,
        tool_calls=[{"name": "hive_list_tables", "args": {"database": "default"}, "id": "1"}],
    )

    assert route(state) == "step_action"


def test_empty_tool_calls_ends_react_loop() -> None:
    route = _route(max_tool_steps=10, max_idle_rounds=3)
    state = _state(idle_rounds=0)

    assert route(state) == "__end__"


def test_state_contract_idle_retries_then_ends() -> None:
    route = _route(max_idle_rounds=1, state_exit_keys=("draft_sql",))
    assert route(_state(idle_rounds=0, draft_sql="")) == "step_reason"
    assert route(_state(idle_rounds=1, draft_sql="")) == "__end__"


def test_state_contract_met_ends_immediately() -> None:
    route = _route(state_exit_keys=("draft_sql",))
    state = _state(
        tool_calls=[{"name": "propose_sql", "args": {}, "id": "1"}],
        draft_sql="SELECT 1",
    )
    assert route(state) == "__end__"
