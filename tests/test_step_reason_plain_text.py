"""Tests for step_reason plain-text checkpoint behavior."""

from __future__ import annotations

from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.outputs import ChatGeneration, ChatResult
from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel

from graph.messages import is_internal_assistant_narration
from graph.node import make_step_reason_node


class _PlainTextModel(FakeMessagesListChatModel):
    def __init__(self) -> None:
        super().__init__(responses=[])

    def bind_tools(self, tools, **kwargs):  # type: ignore[override]
        return self

    def _generate(self, messages, stop=None, **kwargs):
        return ChatResult(
            generations=[
                ChatGeneration(
                    message=AIMessage(content="internal planning that must not leak")
                )
            ]
        )


class _ToolCallWithMonologueModel(FakeMessagesListChatModel):
    def __init__(self, content: str) -> None:
        super().__init__(responses=[])
        self._content = content

    def bind_tools(self, tools, **kwargs):  # type: ignore[override]
        return self

    def _generate(self, messages, stop=None, **kwargs):
        return ChatResult(
            generations=[
                ChatGeneration(
                    message=AIMessage(
                        content=self._content,
                        tool_calls=[
                            {
                                "id": "call-1",
                                "name": "propose_sql",
                                "args": {"sql": "SELECT 1"},
                            }
                        ],
                    )
                )
            ]
        )


def test_step_reason_can_drop_plain_text_from_checkpoint() -> None:
    node = make_step_reason_node(_PlainTextModel(), "next", persist_plain_text=False)
    patch = node(
        {
            "messages": [HumanMessage(content="what is shipping_country")],
            "tool_call_count": 0,
            "idle_rounds": 0,
        }
    )
    assert "messages" not in patch
    assert patch["idle_rounds"] == 1


def test_step_reason_strips_monologue_when_tool_calls_and_no_plain_text_persist() -> None:
    monologue = (
        "Actually DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1' MONTH) ... [blocked]"
    )
    node = make_step_reason_node(
        _ToolCallWithMonologueModel(monologue),
        "next",
        persist_plain_text=False,
    )
    patch = node(
        {
            "messages": [HumanMessage(content="日期错了")],
            "tool_call_count": 0,
            "idle_rounds": 0,
        }
    )
    assert patch["idle_rounds"] == 0
    messages = patch.get("messages") or []
    assert len(messages) == 1
    assert messages[0].content in ("", [])
    assert messages[0].tool_calls


def test_is_internal_assistant_narration_detects_sql_date_reasoning() -> None:
    text = (
        "Actually DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1' MONTH) - if "
        "CURRENT_DATE is say 2026-03-15, then ... [blocked]"
    )
    assert is_internal_assistant_narration(text)
