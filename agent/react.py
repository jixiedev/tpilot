"""Base ReAct agent abstraction."""

from __future__ import annotations

import getpass
from abc import ABC
from collections.abc import Callable, Sequence
from dataclasses import replace
from pathlib import Path
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph

from agent.agent import BaseAgent
from agent.config import AgentRunContext, RouterConfig, StateLike
from agent.listener import CliReactListener, ListenerHub, ReactAgentListener
from agent.prompt import SystemPromptAssembler
from agent.refine_profile import make_refine_user_profile_node
from agent.router import CompletionToolRouter
from agent.session import SessionTurnBuilder
from agent.turn import completion_tool_reply
from config.local_config import get_local_paths
from graph.builder import build_react_graph
from memory import CompressionConfig, make_compressor
from memory.profile_store import FileProfileStore, ProfileStore
from state.state import SessionAgentState

# Re-export for convenience.
__all__ = [
    "AgentRunContext",
    "BaseReactAgent",
    "ReactAgentListener",
    "RouterConfig",
    "StateLike",
    "make_inject_completion_as_ai_node",
]


def make_inject_completion_as_ai_node(
    *,
    completion_tool_name: str = "chat_completion",
) -> Callable[[SessionAgentState], dict[str, Any]]:
    """Mirror this turn's completion-tool reply as the final AIMessage in state."""

    def inject_completion_as_ai(state: SessionAgentState) -> dict[str, Any]:
        reply = completion_tool_reply(
            state,
            completion_tool_name=completion_tool_name,
        )
        if not reply:
            return {}
        return {"messages": [AIMessage(content=reply)]}

    return inject_completion_as_ai


class BaseReactAgent(BaseAgent):
    """Shared ReAct wiring: graph build, session turns, completion-tool routing.

    Subclasses supply product-specific prompts, tools, and defaults.
    Collaborators:
    - ``CompletionToolRouter`` — step/tool conditional edges
    - ``SessionTurnBuilder`` — checkpoint-aware turn input
    - ``ReactAgentListener`` — UI callbacks
    - ``SystemPromptAssembler`` — optional profile-aware system prompt
    """

    completion_tool_name: str = "chat_completion"
    turn_boundary: str = ""
    default_profile_dir: Path = get_local_paths().profiles_dir
    prompt_assembler_cls: type[SystemPromptAssembler] = SystemPromptAssembler

    def __init__(
        self,
        system_prompt: Callable[[SessionAgentState], str] | None = None,
        *,
        run_context: AgentRunContext,
        router_config: RouterConfig | None = None,
        profile_store: ProfileStore,
        tools: Sequence[BaseTool],
        react_listener: ReactAgentListener | None = None,
        prompt_assembler: SystemPromptAssembler | None = None,
        turn_boundary: str | None = None,
        completion_tool_name: str | None = None,
    ) -> None:
        super().__init__(system_prompt=None)
        self.run_context = run_context
        self.router_config = router_config or RouterConfig()
        self.profile_store = profile_store
        self.tools = list(tools)
        self.completion_tool_name = completion_tool_name or type(self).completion_tool_name
        self.turn_boundary = (
            type(self).turn_boundary if turn_boundary is None else turn_boundary
        )
        self.prompt_assembler = prompt_assembler or self.prompt_assembler_cls()
        primary = react_listener or CliReactListener(
            completion_tool_name=self.completion_tool_name
        )
        self.react_listener: ListenerHub = (
            primary if isinstance(primary, ListenerHub) else ListenerHub(primary)
        )
        self.session = SessionTurnBuilder(self.turn_boundary)
        self.router = CompletionToolRouter(
            self.run_context,
            self.router_config,
            completion_tool_name=self.completion_tool_name,
        )
        self.system_prompt = (
            system_prompt if system_prompt is not None else self.render_system_prompt
        )
        self.session_state = None

    @classmethod
    def default_profile_store(cls, root: Path | None = None) -> FileProfileStore:
        return FileProfileStore(root or cls.default_profile_dir)

    def render_system_prompt(self, state: SessionAgentState) -> str:
        user_id = state.get("user_id", "")
        if not isinstance(user_id, str) or not user_id.strip():
            user_id = getpass.getuser()
        profile = self.profile_store.load(user_id)
        return self.prompt_assembler.with_profile(profile).build()

    def route_after_reason(self) -> Callable[[StateLike], str]:
        """Conditional edge after ``step_reason``; see ``CompletionToolRouter.route_after_reason``."""
        return self.router.route_after_reason()

    def route_after_action(self) -> Callable[[StateLike], str]:
        """Conditional edge after tools; see ``CompletionToolRouter.route_after_action``."""
        return self.router.route_after_action()

    @staticmethod
    def graph_config(session: str) -> dict:
        return SessionTurnBuilder.graph_config(session)

    @staticmethod
    def resolve_user_id(prior_user_id: object | None, *, explicit: str | None = None) -> str:
        return SessionTurnBuilder.resolve_user_id(prior_user_id, explicit=explicit)

    async def prepare_turn_input(
        self,
        graph: CompiledStateGraph,
        session: str,
        user_prompt: str,
        *,
        user_id: str | None = None,
    ) -> SessionAgentState:
        turn_input = await self.session.prepare_turn_input(
            graph,
            session,
            user_prompt,
            user_id=user_id,
        )
        self.session_state = turn_input
        return turn_input

    def on_turn_output(self, state: SessionAgentState) -> None:
        self.react_listener.on_turn_output(state)

    def register_secondary(self, listener: ReactAgentListener) -> None:
        """Attach a secondary listener (eval, UI, logging) for subsequent turns."""
        self.react_listener.register_secondary(listener)

    def clear_secondaries(self) -> None:
        """Drop all secondary listeners (primary CLI/UI listener stays)."""
        self.react_listener.clear_secondaries()

    @staticmethod
    def resolve_compression_config(
        compression_config: CompressionConfig | None = None,
        *,
        enable_compression: bool | None = None,
    ) -> CompressionConfig:
        if compression_config is None:
            return CompressionConfig(
                enabled=True if enable_compression is None else enable_compression
            )
        if enable_compression is None:
            return compression_config
        return replace(compression_config, enabled=enable_compression)

    async def build_graph(
        self,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        compression_config: CompressionConfig | None = None,
        enable_compression: bool | None = None,
        **kwargs,
    ) -> CompiledStateGraph:
        config = self.resolve_compression_config(
            compression_config,
            enable_compression=enable_compression,
        )
        compressor = make_compressor(model, config) if config.enabled else None

        refine_prompt = self.run_context.refine_user_profile_prompt.strip()
        refine_user_profile_node = (
            make_refine_user_profile_node(
                refine_prompt,
                model,
                self.profile_store,
                completion_tool_name=self.completion_tool_name,
            )
            if refine_prompt
            else None
        )
        inject_completion_node = make_inject_completion_as_ai_node(
            completion_tool_name=self.completion_tool_name,
        )

        return build_react_graph(
            model,
            self.tools,
            checkpointer=checkpointer,
            system_prompt=self.system_prompt,
            next_step_prompt=self.run_context.next_step,
            route_after_reason=self.route_after_reason(),
            route_after_action=self.route_after_action(),
            compressor=compressor,
            include_profile_refinement=refine_user_profile_node is not None,
            refine_user_profile_node=refine_user_profile_node,
            inject_completion_node=inject_completion_node,
            idle_nudge_prompt=self.run_context.idle_nudge_prompt,
            tool_budget_exhausted_prompt=self.run_context.tool_budget_exhausted_prompt,
            max_tool_calls=self.run_context.max_tool_calls,
            on_tool_call=self.react_listener.on_tool_call,
            on_tool_result=self.react_listener.on_tool_result,
            on_reason_start=self.react_listener.on_reason_start,
            on_reason_step=self.react_listener.on_reason_step,
        )
