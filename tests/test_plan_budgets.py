"""Plan stage budgets, config wiring, and delegated interrupts."""

from __future__ import annotations

import uuid
from typing import Any

import pytest
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langgraph.checkpoint.memory import MemorySaver

from agent.catalog import AgentCatalog, AgentCatalogSettings
from agent.listener import AgentListener
from agent.plan.graph import build_plan_graph
from agent.plan.plan_agent import (
    DEFAULT_MAX_SUBAGENT_ROUNDS,
    DEFAULT_STAGE_MAX_TOOL_CALLS,
    NODE_SUMMARY,
    PlanState,
    PlanTurnMessagePolicy,
)
from agent.plan.stage_tools import SpecialistRunner
from agent.session import session_graph_config
from agent.turn import AgentTurnResult
from config.agent_config import PlanAgentConfig, agent_config_path
from memory.profile_store import FileProfileStore


class _ScriptedModel:
    """Chat model returning scripted AI messages in order (tool-bound or not)."""

    def __init__(self, responses: list[AIMessage]) -> None:
        self._responses = responses
        self.calls = 0

    def bind_tools(self, tools, **kwargs):
        return self

    def invoke(self, _messages, *args, **kwargs):
        response = self._responses[min(self.calls, len(self._responses) - 1)]
        self.calls += 1
        return response


def _call(name: str, args: dict[str, Any]) -> AIMessage:
    return AIMessage(
        content="",
        tool_calls=[{"name": name, "args": args, "id": f"call-{uuid.uuid4().hex[:8]}"}],
    )


def _create(plan_id: str) -> AIMessage:
    return _call("create_plan", {"plan_id": plan_id, "title": "t", "steps": ["[knowledge] a"]})


def _planning_get() -> AIMessage:
    return _call("planning", {"command": "get"})


def _tool_names(state: dict[str, Any]) -> list[str]:
    return [m.name for m in state["messages"] if isinstance(m, ToolMessage)]


def test_plan_baseline_and_turn_policy_reset_react_counters() -> None:
    baseline = PlanState.baseline()
    assert baseline["tool_call_count"] == 0
    assert baseline["idle_reason_rounds"] == 0
    history = PlanTurnMessagePolicy().history_state({"tool_call_count": 5})
    assert history["tool_call_count"] == 0


async def test_each_plan_stage_gets_its_own_tool_budget() -> None:
    plan_id = f"p-{uuid.uuid4().hex[:8]}"
    model = _ScriptedModel(
        [
            _create(plan_id),  # create stage: 1 batch
            # execute stage: fresh budget of 2; the third request is answered without tools
            _planning_get(),
            _planning_get(),
            _planning_get(),
            # adjust stage: again a fresh budget of 2
            _planning_get(),
            _planning_get(),
            _planning_get(),
            AIMessage(content="final answer"),  # summary
        ]
    )
    runner = SpecialistRunner(get_specialist=lambda _name: None)  # type: ignore[arg-type,return-value]
    graph = build_plan_graph(model, runner, checkpointer=MemorySaver(), max_tool_calls=2)
    state = await graph.ainvoke(
        {
            "messages": [HumanMessage(content="q")],
            "session_name": "plan-budget",
            **PlanState.baseline(),
        },
        {**session_graph_config("plan-budget"), "recursion_limit": 60},
    )
    assert _tool_names(state) == ["create_plan"] + ["planning"] * 4
    assert state["messages"][-1].content == "final answer"
    # Each stage at budget ended on a text reply, not on unexecuted tool calls.
    from graph.node import BUDGET_EXHAUSTED_FALLBACK_REPLY

    replies = [
        m.content for m in state["messages"] if isinstance(m, AIMessage) and not m.tool_calls
    ]
    fallback = BUDGET_EXHAUSTED_FALLBACK_REPLY
    assert replies == [fallback, fallback, "final answer"]


def test_plan_config_keeps_budget_overrides() -> None:
    plain = PlanAgentConfig(agent_config_path("plan")).run_context
    assert "max_tool_calls" not in plain  # graph falls back to the code default
    ctx = PlanAgentConfig(
        agent_config_path("plan"),
        run_overrides={"max_tool_calls": 30, "max_subagent_rounds": 3},
    ).run_context
    assert ctx["max_tool_calls"] == 30
    assert ctx["max_subagent_rounds"] == 3


def test_route_after_adjust_uses_configured_round_cap() -> None:
    from agent.plan.graph import make_route_after_adjust

    state = {"adjust_had_tool_calls": True, "subagent_rounds": 2}
    assert make_route_after_adjust(2)(state) == NODE_SUMMARY  # type: ignore[arg-type]
    assert make_route_after_adjust(3)(state) == "increment_subagent_round"  # type: ignore[arg-type]
    assert DEFAULT_MAX_SUBAGENT_ROUNDS == 8 and DEFAULT_STAGE_MAX_TOOL_CALLS == 6


async def _plan_agent(tmp_path, model: Any, **run_overrides: Any):
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            "plan",
            profile_store=FileProfileStore(tmp_path),
            model=model,
            checkpointer=MemorySaver(),
            **run_overrides,
        )
    )
    return await catalog.create("plan", build_graph=False, listener=AgentListener())


async def test_plan_agent_stage_budget_comes_from_run_override(tmp_path) -> None:
    plan_id = f"p-{uuid.uuid4().hex[:8]}"
    model = _ScriptedModel(
        [
            _create(plan_id),
            _planning_get(),
            _planning_get(),
            _planning_get(),  # budget of 2 reached: answered without tools instead
            AIMessage(content="no changes"),
            AIMessage(content="final answer"),
        ]
    )
    agent = await _plan_agent(tmp_path, model, max_tool_calls=2)
    assert agent.run_context["max_tool_calls"] == 2
    result = await agent.run("q", session="plan-override", print_output=False)
    assert _tool_names(result.state) == ["create_plan", "planning", "planning"]


class _GatedSpecialist:
    """Stand-in for databot: pauses for approval like a human gate."""

    def __init__(self) -> None:
        self.questions: list[str] = []

    async def run(self, task, *, session, on_interrupt=None, print_output=True, user_id=None):
        if on_interrupt is None:
            raise RuntimeError("graph interrupted but no on_interrupt handler was provided")
        self.questions.append("Approve SQL?")
        answer = await on_interrupt("Approve SQL?")
        return AgentTurnResult(state={"messages": [AIMessage(content=f"rows ({answer})")]})


async def test_delegated_specialist_uses_plan_on_interrupt(tmp_path) -> None:
    plan_id = f"p-{uuid.uuid4().hex[:8]}"
    model = _ScriptedModel(
        [
            _create(plan_id),
            _call("invoke_agent", {"agent_name": "databot", "task": "GMV"}),
            AIMessage(content="execution round done"),
            AIMessage(content="no changes"),
            AIMessage(content="final answer"),
        ]
    )
    agent = await _plan_agent(tmp_path, model)
    specialist = _GatedSpecialist()

    async def _get(_name: str):
        return specialist

    agent._catalog.get_or_create = _get  # type: ignore[method-assign]
    agent.build_graph()
    asked: list[str] = []

    async def on_interrupt(question: str) -> str:
        asked.append(question)
        return "approve"

    result = await agent.run(
        "q", session="plan-gate", on_interrupt=on_interrupt, print_output=False
    )
    assert asked == ["Approve SQL?"]
    assert result.state["step_results"] == [
        {"agent": "databot", "task": "GMV", "output": "rows (approve)"}
    ]


async def test_delegated_interrupt_without_handler_is_a_clear_error() -> None:
    runner = SpecialistRunner(get_specialist=lambda _name: _async(_GatedSpecialist()))
    with pytest.raises(RuntimeError, match="no interactive handler"):
        await runner.run("databot", "GMV", parent_session="p")


async def _async(value: Any) -> Any:
    return value
