"""Multi-agent chain orchestration (sequential / planned handoff).

Owns the walk across registered ``BaseAgent`` instances: record each agent's
finished state, decide the next agent id, then ``run`` it. Does not depend on
CLI internals — callers register already-bound agents.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import Any

from agent.agent import BaseAgent
from agent.session import specialist_session_id
from agent.turn import AgentTurnResult, OnInterrupt, extract_turn_output
from state.state import latest_human_text


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
            session=specialist_session_id(session, next_agent_id, kind="chain"),
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
            session=specialist_session_id(session, entry_agent_id, kind="chain"),
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
