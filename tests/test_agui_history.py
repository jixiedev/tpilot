"""Follow-up tool-call arguments that contain more than one JSON value."""

from __future__ import annotations

import json

import pytest

pytest.importorskip("ag_ui")

from ag_ui.core.types import AssistantMessage, FunctionCall, ToolCall, UserMessage  # noqa: E402

from tahoepilot.server.history import AguiHistoryRepair, ToolCallArguments  # noqa: E402


def _extra_data(raw: str) -> str:
    with pytest.raises(json.JSONDecodeError) as exc:
        json.loads(raw)
    return str(exc.value)


def test_single_json_object_is_left_alone() -> None:
    raw = '{"agent": "warehouse", "task": "show gmv"}'
    assert ToolCallArguments(raw).single_json() is None
    assert ToolCallArguments("").single_json() is None
    assert ToolCallArguments("   ").single_json() is None


def test_null_prefix_keeps_the_object_after_it() -> None:
    raw = 'null{"agent":"warehouse","task":"show gmv"}'
    assert "char 4" in _extra_data(raw)
    assert json.loads(ToolCallArguments(raw).single_json() or "") == {
        "agent": "warehouse",
        "task": "show gmv",
    }


def test_concatenated_objects_keep_the_first() -> None:
    raw = '{"a":"b"}{"agent":"warehouse","task":"show gmv"}'
    assert "char 9" in _extra_data(raw)
    assert json.loads(ToolCallArguments(raw).single_json() or "") == {"a": "b"}


def test_unparseable_arguments_become_an_empty_object() -> None:
    assert ToolCallArguments("not json").single_json() == "{}"


def test_follow_up_conversion_accepts_concatenated_arguments() -> None:
    import ag_ui_langgraph.agent as agent_mod

    AguiHistoryRepair().install()
    messages = [
        UserMessage(id="u1", content="and by country?"),
        AssistantMessage(
            id="a1",
            content="",
            tool_calls=[
                ToolCall(
                    id="c1",
                    function=FunctionCall(
                        name="search",
                        arguments='{"a":"b"}{"agent":"warehouse","task":"show gmv"}',
                    ),
                )
            ],
        ),
    ]
    converted = agent_mod.agui_messages_to_langchain(messages)
    assert converted[1].tool_calls[0]["args"] == {"a": "b"}
    assert messages[1].tool_calls[0].function.arguments.startswith('{"a":"b"}{')
