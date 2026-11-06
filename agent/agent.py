"""Base agent: owns graph build, turn prepare, invoke, and output."""

from __future__ import annotations

import asyncio
from abc import ABC
from collections.abc import Mapping
from typing import Any, Generic, TypeVar

from langchain_core.language_models import BaseChatModel
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph

from agent.listener import AgentListener, ListenerHub
from agent.prompt import SystemPromptAssembler
from agent.turn_messages import DefaultTurnMessagePolicy, TurnMessagePolicy, SessionTurnProcessor
from agent.turn import AgentTurnResult, OnInterrupt
from config.agent_config import AgentConfig
from memory import CompressionConfig, ContextCompressor, make_compressor
from memory.session_runtime import SessionRuntime
from agent.session import SessionUserRequest, session_graph_config
from graph.state import SessionAgentState

S = TypeVar("S", bound=SessionAgentState)


_DEFAULT_TURN_BOUNDARY = """\
--- Session turn boundary ---
Messages above this line are prior session history (context only).
Messages below this line are the current user request for this turn.
Use history for reference; focus tool calls and your reply on the current request.
"""


class BaseAgent(ABC, Generic[S]):
    """Application agent that owns graph lifecycle and turn execution.

    Typical CLI usage::

        agent = await catalog.create("databot")
        result = await agent.run(user_text, session=..., user_id=..., on_interrupt=...)

    Subclasses may override ``turn_boundary`` (empty string disables the marker).

    Example checkpoint ``messages`` layout (``add_messages``; not exhaustive)::

        Turn 1 accept::

            [SYS]   agent persona (once per session)
            [HUMAN] user question

        Turn 1 after graph::

            [SYS]   agent persona
            [HUMAN] user question
            [AI/TOOL …] this turn

        Turn 2 accept on prior checkpoint::

            ┌─ Turn 1 ────────────────────────────────────────────
            │ [SYS]   agent persona
            │ [HUMAN] q1
            │ [AI/TOOL …] turn 1 output
            ├─ Turn 2 ────────────────────────────────────────────
            │ [SYS]   session turn boundary
            │ [HUMAN] q2
            └─ [AI/TOOL …] turn 2 appends below q2

        ``step_reason`` next_step prompts are ephemeral (not checkpointed).
    """

    turn_boundary: str = _DEFAULT_TURN_BOUNDARY

    def __init__(
        self,
        *,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        session_runtime: SessionRuntime,
        prompt_assembler: SystemPromptAssembler,
        turn_message_policy: TurnMessagePolicy,
        agent_config: AgentConfig,
        listener: AgentListener | ListenerHub | None = None,
    ) -> None:
        self.model = model
        self.checkpointer = checkpointer
        self.session_runtime = session_runtime
        self.agent_config = agent_config
        self.listener: ListenerHub = ListenerHub.from_listener(listener)
        self.graph: CompiledStateGraph | None = None
        self.compressor = make_compressor(model, agent_config.compression)
        self.session_turn_processor = SessionTurnProcessor(
            prompt_assembler, turn_message_policy
        )

    @property
    def compression_config(self) -> CompressionConfig:
        """Compression thresholds from this agent's file, after any overlay."""
        return self.agent_config.compression

    @property
    def run_context(self) -> Mapping[str, Any]:
        """Typed run context from this agent's ``AgentConfig`` subclass."""
        return self.agent_config.run_context

    def build_graph(self, **kwargs: Any) -> CompiledStateGraph:
        """Compile and cache the graph when ``self.graph`` is unset."""
        if self.graph is not None:
            return self.graph
        raise NotImplementedError(f"{type(self).__name__} must implement build_graph")

    async def commit_turn(self, session: str, state: S) -> S:
        """Persist post-turn checkpoint state from the turn policy.

        The policy is synchronous and may call the model (profile refinement)
        or write files, so it runs in a worker thread to keep the event loop free.
        """
        committed_state = await asyncio.to_thread(
            self.session_turn_processor.commit_turn_state, state
        )
        await self.build_graph().aupdate_state(session_graph_config(session), committed_state)
        self.session_runtime.remember(session, committed_state)
        return committed_state

    async def accept_user_request(
        self,
        user_prompt: str,
        session: str,
        user_id: str | None = None,
    ) -> SessionUserRequest:
        runtime = self.session_runtime
        if runtime.known_session(session):
            record = runtime.open(session, user_id=user_id)
        else:
            snapshot = await self.build_graph().aget_state(session_graph_config(session))
            record = runtime.open(
                session, user_id=user_id, prior=snapshot.values or {}
            )
        profile = runtime.load(record.user_id)
        session_state = self.session_turn_processor.new_turn_state_with_messages(
            session=session,
            user_id=record.user_id,
            user_prompt=user_prompt,
            user_profile=profile,
            prior=record.values,
            turn_boundary=type(self).turn_boundary,
        )
        return SessionUserRequest(
            session,
            record.user_id,
            user_prompt,
            profile,
            session_state,
        )

    def register_secondary(self, listener: AgentListener) -> None:
        """Attach a secondary listener (eval, UI) without rebuilding the graph."""
        self.listener.register_secondary(listener)

    def clear_secondaries(self) -> None:
        """Drop secondary listeners; the primary listener is unchanged."""
        self.listener.clear_secondaries()

    def on_turn_output(self, state: S) -> None:
        self.listener.on_turn_output(state)

    async def run(
        self,
        user_prompt: str,
        session: str,
        user_id: str | None = None,
        on_interrupt: OnInterrupt | None = None,
        print_output: bool = True,
    ) -> AgentTurnResult:
        """Accept one user request, invoke the graph (with interrupt resume).

        ``print_output=False`` skips ``on_turn_output`` (the listener's final
        answer hook); orchestrators use it when they consume a child's reply.
        """
        user_request = await self.accept_user_request(user_prompt, session, user_id)
        result = await AgentTurnResult.ainvoke(
            self.build_graph(),
            user_request,
            on_interrupt=on_interrupt,
        )
        if result.cancelled:
            self.session_runtime.remember(session, result.state)
            return result
        committed = await self.commit_turn(session, result.state)
        if print_output:
            self.on_turn_output(committed)
        return AgentTurnResult(state=committed, cancelled=False)


SESSION_TURN_BOUNDARY = BaseAgent.turn_boundary