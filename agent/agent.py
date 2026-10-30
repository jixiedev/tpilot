"""Base agent: owns graph build, turn prepare, invoke, and output."""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph

from agent.turn import AgentTurnResult, OnInterrupt, ainvoke_resolving_interrupts
from state.state import SessionAgentState


class BaseAgent(ABC):
    """Application agent that owns graph lifecycle and turn execution.

    Typical CLI usage::

        agent = await spec.create_agent(...)
        await agent.bind(model, checkpointer, compression_config=...)
        result = await agent.run(user_text, session=..., user_id=..., on_interrupt=...)
    """

    def __init__(
        self,
        system_prompt: Callable[[SessionAgentState], str],
        *args: Any,
        **kwargs: Any,
    ) -> None:
        self.system_prompt = system_prompt
        self.session_state: Any = None
        self._model: BaseChatModel | None = None
        self._checkpointer: BaseCheckpointSaver | None = None
        self._graph: CompiledStateGraph | None = None
        self._bind_kwargs: dict[str, Any] = {}

    @classmethod
    async def create(cls, *args: Any, **kwargs: Any) -> BaseAgent:
        raise NotImplementedError

    @property
    def graph(self) -> CompiledStateGraph:
        if self._graph is None:
            raise RuntimeError(f"{type(self).__name__}.bind() must be called before use")
        return self._graph

    @property
    def is_bound(self) -> bool:
        return self._graph is not None

    @abstractmethod
    async def build_graph(
        self,
        *args: Any,
        **kwargs: Any,
    ) -> CompiledStateGraph:
        raise NotImplementedError

    @staticmethod
    def graph_config(session: str) -> dict[str, Any]:
        return {"configurable": {"thread_id": session}}

    @abstractmethod
    async def prepare_turn_input(
        self,
        graph: CompiledStateGraph,
        session: str,
        user_prompt: str,
        *,
        user_id: str | None,
    ) -> Any:
        raise NotImplementedError

    def on_turn_output(self, state: Any) -> None:
        return None

    def render_system_prompt(self, state: Any) -> str:
        return ""

    async def run(
        self,
        user_prompt: str,
        *,
        session: str,
        user_id: str | None = None,
        on_interrupt: OnInterrupt | None = None,
    ) -> AgentTurnResult:
        """Prepare one turn, invoke the graph (with interrupt resume), print output."""
        turn_input = await self.prepare_turn_input(
            self.graph,
            session,
            user_prompt,
            user_id=user_id,
        )
        result = await ainvoke_resolving_interrupts(
            self.graph,
            turn_input,
            self.graph_config(session),
            on_interrupt=on_interrupt,
        )
        if result.cancelled:
            return result
        self.on_turn_output(result.state)
        return result
