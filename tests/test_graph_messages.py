"""Tests for strict-provider message sanitization."""

from __future__ import annotations

from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from graph.messages import sanitize_messages_for_strict_tool_providers


def test_strips_assistant_content_when_tool_calls_present() -> None:
    messages = [
        AIMessage(
            content="planning text",
            tool_calls=[
                {"name": "fetch_related_models", "args": {"query": "orders"}, "id": "c1"},
            ],
        ),
        ToolMessage(content="ok", tool_call_id="c1", name="fetch_related_models"),
    ]
    out = sanitize_messages_for_strict_tool_providers(messages)
    assert isinstance(out[0], AIMessage)
    assert out[0].content == ""
    assert out[1].tool_call_id == "c1"


def test_synthesizes_missing_tool_result_for_parallel_batch() -> None:
    messages = [
        AIMessage(
            content="",
            tool_calls=[
                {"name": "fetch_related_models", "args": {}, "id": "c1"},
                {"name": "datahub_list_glossary_terms", "args": {}, "id": "c2"},
            ],
        ),
        ToolMessage(content="rag ok", tool_call_id="c1", name="fetch_related_models"),
    ]
    out = sanitize_messages_for_strict_tool_providers(messages)
    assert len(out) == 3
    assert out[1].tool_call_id == "c1"
    assert out[2].tool_call_id == "c2"
    assert out[2].status == "error"


def test_preserves_messages_after_tool_batch() -> None:
    messages = [
        HumanMessage(content="hi"),
        AIMessage(
            content="",
            tool_calls=[{"name": "chat_completion", "args": {}, "id": "c1"}],
        ),
        ToolMessage(content="done", tool_call_id="c1", name="chat_completion"),
        AIMessage(content="visible answer"),
    ]
    out = sanitize_messages_for_strict_tool_providers(messages)
    assert len(out) == 4
    assert out[-1].content == "visible answer"
