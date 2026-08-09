"""Multi-agent chain orchestration (sequential / planned handoff).

Owns the walk across registered ``BaseAgent`` instances: record each agent's
finished state, decide the next agent id, then ``run`` it. Does not depend on
CLI internals — callers register already-bound agents.
"""

from __future__ import annotations

import uuid
from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from typing import Any

from agent.agent import BaseAgent
from agent.turn import AgentTurnResult, OnInterrupt, extract_turn_output
from state.state import latest_human_text


@dataclass(frozen=True)
class PlanStep:
    """One specialist step in an Intent-produced execution plan."""

    agent_name: str
    intention: str
    task: str
    step_index: int = 0

    @classmethod
    def from_mapping(cls, raw: Mapping[str, Any], *, step_index: int = 0) -> PlanStep:
        agent = str(raw.get("agent") or raw.get("agent_name") or "").strip()
        intention = str(raw.get("intention") or "").strip().upper()
        task = str(raw.get("task") or "").strip()
        if not agent:
            raise ValueError(f"plan step {step_index} missing agent name")
        if not task:
            task = f"Handle the {intention or agent} portion of the user request."
        idx = int(raw.get("step_index", step_index))
        return cls(
            agent_name=agent,
            intention=intention or agent.upper(),
            task=task,
            step_index=idx,
        )


@dataclass
class ChainStepResult:
    """One completed (or cancelled) step in a chain walk."""

    agent_id: int
    result: AgentTurnResult
    agent_name: str = ""


@dataclass
class ChainRunResult:
    """Full chain execution outcome."""

    steps: list[ChainStepResult] = field(default_factory=list)
    cancelled: bool = False

    @property
    def ok(self) -> bool:
        return not self.cancelled

    @property
    def last_state(self) -> dict[str, Any]:
        if not self.steps:
            return {}
        return self.steps[-1].result.state

    @property
    def last_output(self) -> str:
        return extract_turn_output(self.last_state)


class AgentChain(ABC):
    """Coordinate a sequence of agents by integer ids.

    Lifecycle for one user request::

        chain.register_agent(0, intent_agent)
        chain.register_agent(1, databot_agent)
        result = await chain.run(0, user_prompt, session=..., user_id=...)
    """

    def __init__(self) -> None:
        self.agent_map: dict[int, BaseAgent] = {}
        # Last observed graph state keyed by agent id (after a successful step).
        self.agent_status: dict[int, dict[str, Any]] = {}

    def register_agent(self, agent_id: int, agent: BaseAgent) -> None:
        """Attach a bound (or bindable) agent under ``agent_id``."""
        if agent_id in self.agent_map:
            raise ValueError(f"agent id {agent_id} is already registered")
        self.agent_map[agent_id] = agent

    def get_agent(self, agent_id: int) -> BaseAgent:
        try:
            return self.agent_map[agent_id]
        except KeyError as exc:
            raise KeyError(f"unknown agent id {agent_id}") from exc

    def receive_agent_status(
        self,
        last_agent_id: int,
        last_agent_state: Mapping[str, Any],
    ) -> None:
        """Persist the status reported by the last agent."""
        self.agent_status[last_agent_id] = dict(last_agent_state)

    @abstractmethod
    def determine_next_agent(self, last_agent_id: int) -> int | None:
        """Return the next agent id, or ``None`` to stop the chain."""

    def build_next_user_prompt(
        self,
        last_agent_id: int,
        last_agent_state: Mapping[str, Any],
    ) -> str:
        """Derive the user prompt for the next agent from the previous state.

        Default priority: extracted turn output → ``user_question`` → latest human.
        Subclasses may override to pass richer handoff context.
        """
        output = extract_turn_output(last_agent_state)
        if output:
            return output
        question = last_agent_state.get("user_question")
        if isinstance(question, str) and question.strip():
            return question.strip()
        text = latest_human_text(last_agent_state)  # type: ignore[arg-type]
        if text:
            return text
        raise ValueError(
            f"cannot build handoff prompt from agent {last_agent_id}: "
            "no output, user_question, or human message in state"
        )

    def chain_session_id(self, session: str, agent_id: int) -> str:
        """Isolate checkpoints per chain node (same idea as specialist sessions)."""
        return f"{session}:chain:{agent_id}"

    async def call_next_agent(
        self,
        last_agent_id: int,
        next_agent_id: int,
        *,
        session: str,
        user_id: str | None = None,
        on_interrupt: OnInterrupt | None = None,
        print_output: bool = True,
        user_prompt: str | None = None,
    ) -> AgentTurnResult:
        """Run ``next_agent_id`` using handoff context from ``last_agent_id``.

        If ``user_prompt`` is omitted, it is built from the last agent's status
        via ``build_next_user_prompt``.
        """
        if last_agent_id not in self.agent_status and user_prompt is None:
            raise ValueError(
                f"no status for agent {last_agent_id}; "
                "call receive_agent_status first or pass user_prompt"
            )
        last_state = self.agent_status.get(last_agent_id) or {}
        prompt = (
            user_prompt
            if user_prompt is not None
            else self.build_next_user_prompt(last_agent_id, last_state)
        )
        agent = self.get_agent(next_agent_id)
        result = await agent.run(
            prompt,
            session=self.chain_session_id(session, next_agent_id),
            user_id=user_id,
            on_interrupt=on_interrupt,
            print_output=print_output,
        )
        if not result.cancelled:
            self.receive_agent_status(next_agent_id, result.state)
        return result

    async def run(
        self,
        entry_agent_id: int,
        user_prompt: str,
        *,
        session: str,
        user_id: str | None = None,
        on_interrupt: OnInterrupt | None = None,
        print_output: bool = True,
        max_steps: int = 8,
    ) -> ChainRunResult:
        """Execute from ``entry_agent_id``, following ``determine_next_agent`` until stop."""
        if max_steps < 1:
            raise ValueError("max_steps must be >= 1")

        entry = self.get_agent(entry_agent_id)
        first = await entry.run(
            user_prompt,
            session=self.chain_session_id(session, entry_agent_id),
            user_id=user_id,
            on_interrupt=on_interrupt,
            print_output=print_output,
        )
        steps = [ChainStepResult(agent_id=entry_agent_id, result=first)]
        if first.cancelled:
            return ChainRunResult(steps=steps, cancelled=True)
        self.receive_agent_status(entry_agent_id, first.state)

        current_id = entry_agent_id
        for _ in range(max_steps - 1):
            next_id = self.determine_next_agent(current_id)
            if next_id is None:
                return ChainRunResult(steps=steps, cancelled=False)
            if next_id not in self.agent_map:
                raise KeyError(
                    f"determine_next_agent returned unknown agent id {next_id}"
                )
            step_result = await self.call_next_agent(
                current_id,
                next_id,
                session=session,
                user_id=user_id,
                on_interrupt=on_interrupt,
                print_output=print_output,
            )
            steps.append(ChainStepResult(agent_id=next_id, result=step_result))
            if step_result.cancelled:
                return ChainRunResult(steps=steps, cancelled=True)
            current_id = next_id

        # Hit max_steps with a possible further edge — stop safely.
        return ChainRunResult(steps=steps, cancelled=False)


class StaticAgentChain(AgentChain):
    """Fixed next-agent table: ``{last_agent_id: next_agent_id}``."""

    def __init__(self, agent_chain: Mapping[int, int]) -> None:
        super().__init__()
        self.agent_chain: dict[int, int] = dict(agent_chain)

    def determine_next_agent(self, last_agent_id: int) -> int | None:
        return self.agent_chain.get(last_agent_id)


class StatusRoutedAgentChain(AgentChain):
    """Choose the next agent from a field on the last agent's status.

    Example (intent publish → specialist)::

        StatusRoutedAgentChain(
            targets={"databot": 1, "knowledge": 2},
            route_field="route_target",
            require_status="published",
        )
    """

    def __init__(
        self,
        targets: Mapping[str, int],
        *,
        route_field: str = "route_target",
        require_status: str | None = "published",
    ) -> None:
        super().__init__()
        self.targets: dict[str, int] = {
            str(key).strip(): value for key, value in targets.items() if str(key).strip()
        }
        self.route_field = route_field
        self.require_status = require_status

    def determine_next_agent(self, last_agent_id: int) -> int | None:
        status = self.agent_status.get(last_agent_id) or {}
        if self.require_status is not None:
            current = str(status.get("status") or "").strip().lower()
            if current != self.require_status.strip().lower():
                return None
        raw = status.get(self.route_field)
        if raw is None:
            return None
        key = str(raw).strip()
        if not key:
            return None
        return self.targets.get(key)


class PlannedAgentChain(AgentChain):
    """Execute an ordered Intent plan: upstream output feeds the next specialist.

    Specialists do not share the Intent conversation thread. Each step uses an
    ephemeral checkpoint id under the parent session prefix so workers stay
    stateless across turns; Intent retains multi-turn memory.
    """

    def __init__(
        self,
        plan: Sequence[PlanStep | Mapping[str, Any]],
        *,
        user_question: str,
    ) -> None:
        super().__init__()
        steps: list[PlanStep] = []
        for index, item in enumerate(plan):
            if isinstance(item, PlanStep):
                steps.append(
                    PlanStep(
                        agent_name=item.agent_name,
                        intention=item.intention,
                        task=item.task,
                        step_index=index,
                    )
                )
            else:
                steps.append(PlanStep.from_mapping(item, step_index=index))
        if not steps:
            raise ValueError("execution plan is empty")
        self.plan_steps: list[PlanStep] = steps
        self.user_question = (user_question or "").strip()
        self._run_id: str = ""

    @classmethod
    def from_execution_plan(
        cls,
        execution_plan: Sequence[Mapping[str, Any]],
        *,
        user_question: str,
    ) -> PlannedAgentChain:
        return cls(execution_plan, user_question=user_question)

    def determine_next_agent(self, last_agent_id: int) -> int | None:
        nxt = last_agent_id + 1
        if nxt < len(self.plan_steps):
            return nxt
        return None

    def chain_session_id(self, session: str, agent_id: int) -> str:
        run = self._run_id or "pending"
        return f"{session}:plan:{run}:step:{agent_id}"

    def build_step_prompt(
        self,
        step_index: int,
        *,
        upstream_output: str = "",
    ) -> str:
        """Tell the specialist background, assignment, upstream result, and downstream."""
        step = self.plan_steps[step_index]
        background = self.user_question or "(no user question recorded)"
        upstream = (upstream_output or "").strip() or (
            "(none — you are the first step in the plan)"
        )
        if step_index + 1 < len(self.plan_steps):
            nxt = self.plan_steps[step_index + 1]
            downstream = (
                f"Next agent: {nxt.agent_name} ({nxt.intention}). "
                f"It will use your output to: {nxt.task} "
                "Produce intermediate findings that agent can consume; "
                "do not assume you are answering the end user alone."
            )
        else:
            downstream = (
                "You are the last step in the plan. "
                "Produce the complete final answer for the end user."
            )
        return (
            "## Task background\n"
            f"{background}\n\n"
            "## Your assignment\n"
            f"{step.task}\n\n"
            "## Upstream result\n"
            f"{upstream}\n\n"
            "## Downstream\n"
            f"{downstream}"
        )

    def build_next_user_prompt(
        self,
        last_agent_id: int,
        last_agent_state: Mapping[str, Any],
    ) -> str:
        next_id = self.determine_next_agent(last_agent_id)
        if next_id is None:
            raise ValueError(f"no next step after agent id {last_agent_id}")
        return self.build_step_prompt(
            next_id,
            upstream_output=extract_turn_output(last_agent_state),
        )

    async def execute(
        self,
        *,
        session: str,
        user_id: str | None = None,
        on_interrupt: OnInterrupt | None = None,
        print_output: bool = True,
    ) -> ChainRunResult:
        """Run every plan step in order; workflow result is the last step's output."""
        missing = [i for i in range(len(self.plan_steps)) if i not in self.agent_map]
        if missing:
            raise KeyError(
                "plan agents not registered for step ids: "
                + ", ".join(str(i) for i in missing)
            )

        self._run_id = uuid.uuid4().hex[:12]
        self.agent_status.clear()
        steps: list[ChainStepResult] = []
        upstream = ""

        for index, plan_step in enumerate(self.plan_steps):
            prompt = self.build_step_prompt(index, upstream_output=upstream)
            agent = self.get_agent(index)
            if print_output:
                print(
                    f"Plan> step {index + 1}/{len(self.plan_steps)} "
                    f"→ {plan_step.agent_name} ({plan_step.intention})"
                )
            result = await agent.run(
                prompt,
                session=self.chain_session_id(session, index),
                user_id=user_id,
                on_interrupt=on_interrupt,
                print_output=print_output,
            )
            steps.append(
                ChainStepResult(
                    agent_id=index,
                    result=result,
                    agent_name=plan_step.agent_name,
                )
            )
            if result.cancelled:
                return ChainRunResult(steps=steps, cancelled=True)
            self.receive_agent_status(index, result.state)
            upstream = extract_turn_output(result.state)

        return ChainRunResult(steps=steps, cancelled=False)
