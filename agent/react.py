"""Base ReAct agent abstraction."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph

from agent.agent import BaseAgent
from agent.run_context import ReactContext
from config.agent_config import AgentConfig
from agent.listener import AgentListener, CliListener, ListenerHub
from agent.prompt import SystemPromptAssembler
from agent.turn_messages import TurnMessagePolicy
from graph.state import ReactAgentState
from agent.refine_profile import UserProfileRefiner
from agent.router import CompletionToolRouter
from graph.builder import ReactLoopSpec, build_react_graph
from memory.session_runtime import SessionRuntime

__all__ = [
    "ReactContext",
    "BaseReactAgent",
    "ReactTurnMessagePolicy",
    "StateLike",
]


class ReactTurnMessagePolicy(TurnMessagePolicy):
    """ReAct turn commit: optional end-of-turn user profile refinement."""

    def __init__(
        self,
        *,
        model: BaseChatModel,
        run_context: ReactContext,
        session_runtime: SessionRuntime,
    ) -> None:
        self._model = model
        self._run_context = run_context
        self._session_runtime = session_runtime

    def history_state(self, prior: Mapping[str, Any] | None = None) -> dict[str, Any]:
        return dict(ReactAgentState.fresh_turn_defaults())

    def commit_turn_state(self, state: ReactAgentState) -> dict[str, Any]:
        refine_prompt = AgentConfig.as_str(
            self._run_context, "refine_user_profile_prompt"
        ).strip()
        if refine_prompt:
            UserProfileRefiner(
                refine_prompt,
                self._model,
                self._session_runtime,
            ).run(state)
        return dict(state)


class BaseReactAgent(BaseAgent[ReactAgentState]):
    """Shared ReAct wiring: graph build, tools, and step routing.

    Subclasses set ``prompt_factory`` and ``tool_ids``. The constructor takes
    the same runtime arguments as every other agent, plus ``tools``.
    """

    prompt_factory: type[SystemPromptAssembler] = SystemPromptAssembler
    tool_ids: tuple[str, ...] = ()

    def __init__(
        self,
        *,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        session_runtime: SessionRuntime,
        agent_config: AgentConfig,
        tools: Sequence[BaseTool],
        listener: AgentListener | ListenerHub | None = None,
    ) -> None:
        super().__init__(
            model=model,
            checkpointer=checkpointer,
            session_runtime=session_runtime,
            prompt_assembler=type(self).prompt_factory(agent_config),
            turn_message_policy=ReactTurnMessagePolicy(
                model=model,
                run_context=agent_config.run_context,  # type: ignore[arg-type]
                session_runtime=session_runtime,
            ),
            agent_config=agent_config,
            listener=listener or CliListener(),
        )
        self.tools = list(tools)
        self.router = CompletionToolRouter(self.run_context)

    def build_graph(self, **kwargs: Any) -> CompiledStateGraph:
        if self.graph is not None:
            return self.graph
        compiled = build_react_graph(
            self.model,
            self.tools,
            checkpointer=self.checkpointer,
            router=self.router,
            listener=self.listener,
            compressor=self.compressor,
            loop=ReactLoopSpec.from_run_context(self.agent_config.run_context),
        )
        self.graph = compiled
        return compiled
