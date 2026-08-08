from __future__ import annotations

from agent.tahoe.tools import CHAT_COMPLETION_TOOL_NAME, chat_completion


def test_chat_completion_returns_reply() -> None:
    assert chat_completion.invoke({"reply": "Hello!"}) == "Hello!"


def test_chat_completion_tool_name() -> None:
    assert chat_completion.name == CHAT_COMPLETION_TOOL_NAME
