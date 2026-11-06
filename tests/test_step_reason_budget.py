"""step_reason at the tool budget answers in text; step_action counts Command tools."""

from __future__ import annotations

from typing import Any

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command

from agent.router import CompletionToolRouter
from agent.turn import AgentTurnResult
from graph.builder import ReactLoopSpec, build_react_graph
from graph.node import make_step_reason_node


@tool
def echo(text: str) -> str:
    """Echo ``text``."""
    return text


@tool
def echo_command(text: str, runtime: ToolRuntime = None) -> Command:  # type: ignore[assignment]
    """Echo ``text`` through a state Command."""
    return Command(
        update={"messages": [ToolMessage(content=text, tool_call_id=runtime.tool_call_id)]}
    )


def _tool_call(name: str, n: int) -> AIMessage:
    return AIMessage(
        content="checking",
        tool_calls=[{"name": name, "args": {"text": "x"}, "id": f"c{n}"}],
    )


class _Model:
    """Tool-bound calls always want another tool; unbound calls answer in text."""

    def __init__(self, tool_name: str = "echo") -> None:
        self.tool_name = tool_name
        self.bound_calls = 0
        self.plain_calls: list[list[Any]] = []

    def bind_tools(self, tools, **kwargs):
        return _Bound(self)

    def invoke(self, messages, *args, **kwargs):
        self.plain_calls.append(list(messages))
        return AIMessage(content="final answer from what I have")


class _Bound:
    def __init__(self, owner: _Model) -> None:
        self.owner = owner

    def invoke(self, messages, *args, **kwargs):
        self.owner.bound_calls += 1
        return _tool_call(self.owner.tool_name, self.owner.bound_calls)


def _graph(model: _Model, tools: list, max_tool_calls: int):
    return build_react_graph(
        model,  # type: ignore[arg-type]
        tools,
        router=CompletionToolRouter({"max_tool_calls": max_tool_calls}),
        loop=ReactLoopSpec(
            "next", tool_budget_exhausted_prompt="budget reached", max_tool_calls=max_tool_calls
        ),
        checkpointer=MemorySaver(),
    )


async def test_turn_at_tool_budget_ends_with_text_reply() -> None:
    model = _Model()
    graph = _graph(model, [echo], max_tool_calls=2)
    state = await graph.ainvoke(
        {"messages": [HumanMessage(content="q")]},
        {"configurable": {"thread_id": "budget"}},
    )
    last = state["messages"][-1]
    assert isinstance(last, AIMessage)
    assert not last.tool_calls
    assert AgentTurnResult.extract_output(state) == "final answer from what I have"
    assert model.bound_calls == 2
    assert len(model.plain_calls) == 1
    assert any(
        isinstance(m, SystemMessage) and m.content == "budget reached"
        for m in model.plain_calls[0]
    )
    # Every tool call in history was executed (nothing left for the next turn to repair).
    call_ids = {
        c["id"] for m in state["messages"] if isinstance(m, AIMessage) for c in m.tool_calls
    }
    result_ids = {m.tool_call_id for m in state["messages"] if isinstance(m, ToolMessage)}
    assert call_ids == result_ids


def test_step_reason_strips_tool_calls_at_budget_without_final_model() -> None:
    from graph.node import BUDGET_EXHAUSTED_FALLBACK_REPLY

    node = make_step_reason_node(
        _Bound(_Model()),  # type: ignore[arg-type]
        "next",
        tool_budget_exhausted_prompt="budget reached",
        max_tool_calls=1,
    )
    update = node({"messages": [HumanMessage(content="q")], "tool_call_count": 1})
    reply = update["messages"][0]
    assert not reply.tool_calls
    assert reply.content == "checking"

    empty = make_step_reason_node(
        _EmptyToolCaller(),  # type: ignore[arg-type]
        "next",
        max_tool_calls=1,
    )
    reply = empty({"messages": [HumanMessage(content="q")], "tool_call_count": 1})["messages"][0]
    assert not reply.tool_calls
    assert reply.content == BUDGET_EXHAUSTED_FALLBACK_REPLY


class _EmptyToolCaller:
    def invoke(self, messages, *args, **kwargs):
        return AIMessage(content="", tool_calls=[{"name": "echo", "args": {}, "id": "z"}])


async def test_command_tools_count_against_the_budget() -> None:
    model = _Model("echo_command")
    graph = _graph(model, [echo_command], max_tool_calls=2)
    state = await graph.ainvoke(
        {"messages": [HumanMessage(content="q")]},
        # Without Command counting the loop never hits the budget; fail fast.
        {"configurable": {"thread_id": "command-budget"}, "recursion_limit": 20},
    )
    assert state["tool_call_count"] == 2
    assert model.bound_calls == 2
    assert AgentTurnResult.extract_output(state) == "final answer from what I have"
