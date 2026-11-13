"""EvalTimer / TurnTiming: per-call model and tool timing for eval runs."""

from __future__ import annotations

import time

import pytest
from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END

from graph.builder import STEP_ACTION, build_react_graph, static_system_prompt
from observability.timing import EvalTimer, TimedCall, TurnTiming


@tool
def slow_lookup(key: str) -> str:
    """Look up a key slowly."""
    time.sleep(0.02)
    return key


class _ScriptedModel(FakeMessagesListChatModel):
    def bind_tools(self, tools, **kwargs):  # type: ignore[override]
        return self


def _react_graph():
    model = _ScriptedModel(
        responses=[
            AIMessage(
                content="",
                tool_calls=[
                    {"id": "1", "name": "slow_lookup", "args": {"key": "a"}},
                    {"id": "2", "name": "slow_lookup", "args": {"key": "b"}},
                ],
            ),
            AIMessage(content="done"),
        ]
    )
    return build_react_graph(
        model,
        [slow_lookup],
        checkpointer=MemorySaver(),
        system_prompt=static_system_prompt("sys"),
        next_step_prompt="",
        route_after_reason=lambda state: STEP_ACTION if state["messages"][-1].tool_calls else END,
        route_after_action=lambda state: "step_reason",
    )


async def test_timer_records_model_and_parallel_tool_calls_in_react_graph() -> None:
    timer = EvalTimer()
    with timer.active():
        await _react_graph().ainvoke(
            {"messages": [HumanMessage("hi")]}, {"configurable": {"thread_id": "t"}}
        )

    assert [(call.kind, call.name, call.stage) for call in timer.calls if call.kind == "model"] == [
        ("model", "model", "step_reason"),
        ("model", "model", "step_reason"),
    ]
    tools = [call for call in timer.calls if call.kind == "tool"]
    assert [(call.name, call.stage) for call in tools] == [("slow_lookup", "step_action")] * 2
    assert all(call.seconds >= 0.02 for call in tools)


async def test_timer_records_nothing_when_inactive() -> None:
    timer = EvalTimer()
    with timer.active():
        pass
    await _react_graph().ainvoke(
        {"messages": [HumanMessage("hi")]}, {"configurable": {"thread_id": "t"}}
    )
    assert timer.calls == []


def test_turn_timing_aggregates_and_renders() -> None:
    timing = TurnTiming(
        wall_seconds=10.0,
        calls=[
            TimedCall("model", "model", "fetch_cards", 3.0),
            TimedCall("tool", "trino_explain", "fetch_cards", 1.0),
            TimedCall("tool", "trino_explain", "generate_sql", 2.5),
            TimedCall("tool", "commit_cards", "fetch_cards", 0.5),
            TimedCall("model", "model", "generate_sql", 2.0),
        ],
    )
    assert timing.seconds("model") == pytest.approx(5.0)
    assert timing.count("tool") == 3
    assert timing.by_stage() == {
        "fetch_cards": {"model": 3.0, "tool": 1.5},
        "generate_sql": {"model": 2.0, "tool": 2.5},
    }
    assert list(timing.by_tool()) == ["trino_explain", "commit_cards"]
    assert timing.render() == [
        "  timing: wall=10.0s model=5.0s/2 calls tools=4.0s/3 calls",
        "    by stage: fetch_cards model=3.0s tools=1.5s | generate_sql model=2.0s tools=2.5s",
        "    by tool: trino_explain 2x 3.5s (max 2.5s), commit_cards 1x 0.5s (max 0.5s)",
    ]


def test_turn_timing_renders_one_line_without_tools_or_stages() -> None:
    timing = TurnTiming(wall_seconds=1.0, calls=[TimedCall("model", "model", "step_reason", 0.4)])
    assert timing.render() == ["  timing: wall=1.0s model=0.4s/1 calls tools=0.0s/0 calls"]
