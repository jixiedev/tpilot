"""Router regressions for Databot subgraph exit behavior."""

from __future__ import annotations

from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from agent.config import AgentRunConfig, RouterConfig
from agent.router import CompletionToolRouter


def _router() -> CompletionToolRouter:
    return CompletionToolRouter(
        AgentRunConfig(max_tool_calls=20, max_idle_rounds=1),
        RouterConfig(state_exit_keys=("draft_sql", "sql_reasons")),
        completion_tool_name=None,
    )


def test_completion_stall_exceeded_after_repeated_chat_completion() -> None:
    router = _router()
    state = {
        "messages": [
            HumanMessage(content="orders and revenue"),
            AIMessage(
                content="thinking",
                tool_calls=[
                    {"name": "chat_completion", "args": {"reply": "a"}, "id": "1"},
                ],
            ),
            ToolMessage(content="ok", tool_call_id="1", name="chat_completion"),
            AIMessage(
                content="still thinking",
                tool_calls=[
                    {"name": "chat_completion", "args": {"reply": "b"}, "id": "2"},
                ],
            ),
            ToolMessage(content="ok", tool_call_id="2", name="chat_completion"),
        ],
        "draft_sql": "",
        "sql_reasons": {},
    }
    assert router.completion_stall_exceeded(state) is True


def test_completion_stall_not_triggered_when_state_contract_met() -> None:
    router = _router()
    state = {
        "messages": [
            ToolMessage(content="ok", tool_call_id="1", name="chat_completion"),
            ToolMessage(content="ok", tool_call_id="2", name="chat_completion"),
        ],
        "draft_sql": "SELECT 1",
        "sql_reasons": {"approve": "ok"},
    }
    assert router.completion_stall_exceeded(state) is False
