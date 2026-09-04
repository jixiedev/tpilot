"""Router regressions for Databot subgraph exit behavior."""

from __future__ import annotations

from langchain_core.messages import AIMessage, HumanMessage

from agent.config import AgentRunContext, RouterConfig
from agent.router import CompletionToolRouter


def _router() -> CompletionToolRouter:
    return CompletionToolRouter(
        AgentRunContext(max_tool_calls=20, max_idle_rounds=1),
        RouterConfig(state_exit_keys=("draft_sql", "sql_reasons")),
    )


def test_unmet_contract_plain_text_retries_then_ends() -> None:
    router = _router()
    route = router.route_after_reason()
    unmet = {
        "messages": [HumanMessage(content="orders"), AIMessage(content="thinking")],
        "draft_sql": "",
        "sql_reasons": {},
        "idle_rounds": 0,
        "tool_call_count": 0,
    }
    assert route(unmet) == "step_reason"
    unmet["idle_rounds"] = 1
    assert route(unmet) == "__end__"


def test_state_contract_met_ends_even_with_tool_calls() -> None:
    router = _router()
    route = router.route_after_reason()
    state = {
        "messages": [
            AIMessage(
                content="",
                tool_calls=[{"name": "propose_sql", "args": {}, "id": "1"}],
            )
        ],
        "draft_sql": "SELECT 1",
        "sql_reasons": {"approve": "ok"},
        "idle_rounds": 0,
        "tool_call_count": 1,
    }
    assert route(state) == "__end__"
    assert router.state_complete(state) is True
