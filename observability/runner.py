"""EvalRunner: run one ``EvalCase`` on a bound agent and capture an ``EvalRunResult``."""

from __future__ import annotations

import time
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from typing import Any

from agent.listener import ReactAgentListener
from agent.turn import extract_turn_output
from observability.case import EvalCase
from observability.timing import EvalTimer, TurnTiming


@dataclass
class ToolCall:
    name: str
    args: dict[str, Any] = field(default_factory=dict)


@dataclass
class EvalRunResult:
    """Everything a scorer needs from one (case, model) run."""

    case: EvalCase
    model_name: str
    state: dict[str, Any]
    reply: str
    tool_calls: list[ToolCall] = field(default_factory=list)
    cancelled: bool = False
    timing: TurnTiming = field(default_factory=TurnTiming)

    @property
    def tool_names(self) -> list[str]:
        return [call.name for call in self.tool_calls]


class EvalToolTrace(ReactAgentListener):
    """Secondary listener that records tool calls for one turn."""

    def __init__(self) -> None:
        self.calls: list[ToolCall] = []

    def on_tool_call(self, name: str, args: dict) -> None:
        self.calls.append(ToolCall(name=name, args=args))

    def on_turn_output(self, state: Any) -> None:
        return None


class EvalRunner:
    """Bind one agent per ``(agent_name, model_name)`` and run cases on it."""

    def __init__(self) -> None:
        self._agents: dict[tuple[str, str], Any] = {}

    async def run(self, case: EvalCase, model_name: str) -> EvalRunResult:
        agent = await self.agent_for(case.agent_name, model_name)
        trace = EvalToolTrace()
        timer = EvalTimer()
        run_kwargs = dict(case.run_kwargs)
        if case.gate_reply is not None:
            run_kwargs["on_interrupt"] = self.gate_answerer(case.gate_reply)
        if case.traced:
            agent.register_secondary(trace)
        started = time.perf_counter()
        try:
            with timer.active():
                turn = await agent.run(
                    case.prompt,
                    session=case.session_id(),
                    user_id=case.user_id,
                    print_output=False,
                    **run_kwargs,
                )
        finally:
            if case.traced:
                agent.clear_secondaries()
        return EvalRunResult(
            case=case,
            model_name=model_name,
            state=turn.state,
            reply=extract_turn_output(turn.state),
            tool_calls=trace.calls,
            cancelled=turn.cancelled,
            timing=TurnTiming(wall_seconds=time.perf_counter() - started, calls=timer.calls),
        )

    def gate_answerer(self, reply: str) -> Callable[[str], Awaitable[str]]:
        """``on_interrupt`` handler that answers every gate question with ``reply``."""

        async def answer(question: str) -> str:
            return reply

        return answer

    async def agent_for(self, agent_name: str, model_name: str) -> Any:
        key = (agent_name, model_name)
        if key not in self._agents:
            self._agents[key] = await self.create_agent(agent_name, model_name)
        return self._agents[key]

    async def create_agent(self, agent_name: str, model_name: str) -> Any:
        """Build a registry agent bound to ``model_name`` with an in-memory checkpointer."""
        from langgraph.checkpoint.memory import MemorySaver

        from agent.registry import get_agent
        from agent.runtime.tahoe_runtime_helper import default_profile_store
        from memory import CompressionConfig
        from models.models import get_model_by_name

        model = get_model_by_name(model_name)
        spec = get_agent(agent_name)
        if agent_name == "intent":
            agent = await spec.create_agent()
            await agent.bind(model, MemorySaver())
            return agent

        agent = await spec.create_agent(
            profile_store=default_profile_store(),
            react_listener=ReactAgentListener(),
        )
        await agent.bind(
            model,
            MemorySaver(),
            compression_config=CompressionConfig(enabled=False),
        )
        return agent
