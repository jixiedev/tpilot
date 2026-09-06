"""Tests for nested specialist delegation."""

from __future__ import annotations

import json
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from langchain_core.messages import AIMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.errors import GraphInterrupt
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt
from typing_extensions import TypedDict

from agent.plan.nested_hitl import applied_hitl_rounds, as_parent_interrupt
from agent.plan.stage_tools import SpecialistRunner, make_invoke_agent_tool
from graph.node import StepActionNode
from agent.turn import (
    AgentTurnResult,
    interrupt_question,
    interrupt_values,
    interrupt_values_from_snapshot,
    is_graph_interrupt,
)
from tests.test_plan_stage_tools import _runtime


@pytest.mark.asyncio
async def test_run_isolated_delegates_in_worker_thread() -> None:
    runner = SpecialistRunner(get_specialist=AsyncMock())
    with patch(
        "agent.plan.stage_tools.asyncio.to_thread",
        new_callable=AsyncMock,
    ) as to_thread:
        to_thread.return_value = "nested output"
        output = await runner.run_isolated(
            "knowledge",
            "what is shipping_country",
            parent_session="parent",
        )
    assert output == "nested output"
    to_thread.assert_awaited_once()
    work = to_thread.await_args.args[0]
    assert callable(work)


def test_interrupt_question_unwraps_agui_message() -> None:
    payload = {
        "question": "Review 1 model(s) for this question: orders_daily.",
        "options": [],
        "default": "dryrun",
        "gate": "cards",
    }
    result = {
        "__interrupt__": (
            {
                "id": "databot-cards-gate",
                "reason": "Review 1 model",
                "message": json.dumps(payload),
            },
        )
    }
    assert interrupt_question(result) == payload["question"]


def test_is_graph_interrupt_detects_langgraph_control_flow() -> None:
    assert is_graph_interrupt(GraphInterrupt())
    assert not is_graph_interrupt(RuntimeError("graph interrupted but no handler"))


def test_applied_hitl_rounds_reads_counter() -> None:
    assert applied_hitl_rounds({}) == 0
    assert applied_hitl_rounds({"parent_hitl_applied": 2}) == 2


def test_as_parent_interrupt_passthrough_agui_shape() -> None:
    value = {"id": "databot-sql-gate", "reason": "sql", "message": "{}"}
    assert as_parent_interrupt(value)["id"] == "databot-sql-gate"


def test_interrupt_values_from_snapshot_reads_tasks() -> None:
    class _Task:
        interrupts = ({"id": "g1", "reason": "cards", "message": "{}"},)

    class _Snap:
        tasks = (_Task(),)
        interrupts = ()
        values = {}

    pending = interrupt_values_from_snapshot(_Snap())
    assert pending[0]["id"] == "g1"


class _ToolParentState(TypedDict):
    messages: list
    tool_call_count: int
    idle_rounds: int
    failed_tools: list
    session_name: str


@pytest.mark.asyncio
async def test_invoke_agent_bubbles_interrupt_through_step_action_node() -> None:
    checkpointer = MemorySaver()

    def nested_node(state: _NestedState) -> dict[str, Any]:
        interrupt(
            {
                "id": "databot-cards-gate",
                "reason": "cards",
                "message": json.dumps(
                    {
                        "question": "cards?",
                        "options": [],
                        "default": "dryrun",
                        "gate": "cards",
                    }
                ),
            }
        )
        return {"value": "done"}

    nested_builder = StateGraph(_NestedState)
    nested_builder.add_node("n", nested_node)
    nested_builder.add_edge(START, "n")
    nested_builder.add_edge("n", END)
    nested_graph = nested_builder.compile(checkpointer=checkpointer)

    class _Spec:
        graph = nested_graph

        def graph_config(self, session: str) -> dict[str, Any]:
            return {"configurable": {"thread_id": session}}

        async def prepare_turn_input(
            self,
            graph: Any,
            session: str,
            user_prompt: str,
            *,
            user_id: str | None = None,
        ) -> dict[str, Any]:
            return {"messages": [], "value": "", "parent_hitl_applied": 0}

    async def get_spec(_name: str) -> _Spec:
        return _Spec()

    runner = SpecialistRunner(get_specialist=get_spec)
    invoke_tool = make_invoke_agent_tool(runner)

    def parent_reason(state: _ToolParentState) -> dict[str, Any]:
        return {
            "messages": [
                AIMessage(
                    content="",
                    tool_calls=[
                        {
                            "name": "invoke_agent",
                            "args": {"agent_name": "databot", "task": "do it"},
                            "id": "call1",
                            "type": "tool_call",
                        }
                    ],
                )
            ]
        }

    parent_builder = StateGraph(_ToolParentState)
    parent_builder.add_node("reason", parent_reason)
    parent_builder.add_node("action", StepActionNode([invoke_tool]))
    parent_builder.add_edge(START, "reason")
    parent_builder.add_edge("reason", "action")
    parent_builder.add_edge("action", END)
    parent_graph = parent_builder.compile(checkpointer=checkpointer)

    result = await parent_graph.ainvoke(
        {
            "messages": [],
            "tool_call_count": 0,
            "idle_rounds": 0,
            "failed_tools": [],
            "session_name": "plan-tool-hitl",
        },
        {"configurable": {"thread_id": "plan-tool-hitl"}},
    )
    assert interrupt_values(result)
    assert interrupt_question(result) == "cards?"


@pytest.mark.asyncio
async def test_invoke_agent_propagates_graph_interrupt() -> None:
    runner = SpecialistRunner(get_specialist=AsyncMock())
    runner.run = AsyncMock(side_effect=GraphInterrupt())  # type: ignore[method-assign]
    tool = make_invoke_agent_tool(runner)
    with pytest.raises(GraphInterrupt):
        await tool.ainvoke(
            {
                "agent_name": "databot",
                "task": "find gmv",
                "runtime": _runtime(),
            }
        )


class _NestedState(TypedDict):
    messages: list
    value: str
    gate_decisions: list
    starts: int
    parent_hitl_applied: int


class _ParentState(TypedDict):
    output: str
    session_name: str


@pytest.mark.asyncio
async def test_nested_hitl_skips_prepare_on_parent_resume() -> None:
    checkpointer = MemorySaver()
    prepares = {"n": 0}

    def nested_node(state: _NestedState) -> dict[str, Any]:
        starts = int(state.get("starts") or 0) + 1
        audit = list(state.get("gate_decisions") or [])
        first = interrupt(
            {
                "id": "g1",
                "reason": "cards",
                "message": json.dumps(
                    {
                        "question": "cards?",
                        "options": [],
                        "default": "approve",
                        "gate": "cards",
                    }
                ),
            }
        )
        audit = audit + [{"gate": "cards", "decision": str(first)}]
        second = interrupt(
            {
                "id": "g2",
                "reason": "sql",
                "message": json.dumps(
                    {
                        "question": "sql?",
                        "options": [],
                        "default": "approve",
                        "gate": "sql",
                    }
                ),
            }
        )
        audit = audit + [{"gate": "sql", "decision": str(second)}]
        return {
            "value": f"{first}|{second}",
            "gate_decisions": audit,
            "starts": starts,
        }

    nested_builder = StateGraph(_NestedState)
    nested_builder.add_node("n", nested_node)
    nested_builder.add_edge(START, "n")
    nested_builder.add_edge("n", END)
    nested_graph = nested_builder.compile(checkpointer=checkpointer)

    class _Spec:
        graph = nested_graph

        def graph_config(self, session: str) -> dict[str, Any]:
            return {"configurable": {"thread_id": session}}

        async def prepare_turn_input(
            self,
            graph: Any,
            session: str,
            user_prompt: str,
            *,
            user_id: str | None = None,
        ) -> dict[str, Any]:
            prepares["n"] += 1
            return {
                "messages": [],
                "value": "",
                "gate_decisions": [],
                "starts": 0,
                "parent_hitl_applied": 0,
            }

        async def run(self, *args: Any, **kwargs: Any) -> AgentTurnResult:
            raise AssertionError("fallback specialist.run should not run")

    async def get_spec(_name: str) -> _Spec:
        return _Spec()

    runner = SpecialistRunner(get_specialist=get_spec)

    async def parent_node(state: _ParentState) -> dict[str, Any]:
        output = await runner.run(
            "databot",
            "do it",
            parent_session=state["session_name"],
        )
        return {"output": output}

    parent_builder = StateGraph(_ParentState)
    parent_builder.add_node("p", parent_node)
    parent_builder.add_edge(START, "p")
    parent_builder.add_edge("p", END)
    parent_graph = parent_builder.compile(checkpointer=checkpointer)

    pconfig = {"configurable": {"thread_id": "plan-1"}}
    first = await parent_graph.ainvoke(
        {"output": "", "session_name": "plan-1"},
        pconfig,
    )
    assert interrupt_values(first)
    assert interrupt_question(first) == "cards?"
    assert prepares["n"] == 1

    second = await parent_graph.ainvoke(Command(resume="approve"), pconfig)
    assert interrupt_values(second)
    assert interrupt_question(second) == "sql?"
    assert prepares["n"] == 1

    done = await parent_graph.ainvoke(Command(resume="dryrun"), pconfig)
    assert not interrupt_values(done)
    assert done["output"] == "approve|dryrun"
    assert prepares["n"] == 1
