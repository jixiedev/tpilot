"""Base ReAct agent abstraction."""

from __future__ import annotations

import getpass
from abc import ABC
from collections.abc import Callable, Sequence
from dataclasses import replace
from pathlib import Path

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph

from agent.config import AgentPromptConfig, AgentRunConfig, RouterConfig, StateLike
from agent.listener import CliReactListener, ReactAgentListener
from agent.prompt import SystemPromptAssembler
from agent.router import CompletionToolRouter
from agent.session import SessionTurnBuilder
from graph.builder import SystemPromptSpec, build_react_graph
from memory import CompressionConfig, make_compressor
from memory.profile_store import FileProfileStore, ProfileStore
from state.state import SessionAgentState

# Re-export for convenience.
__all__ = [
    "AgentPromptConfig",
    "AgentRunConfig",
    "BaseReactAgent",
    "ReactAgentListener",
    "RouterConfig",
    "StateLike",
]


class BaseReactAgent(ABC):
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
    default_profile_dir: Path = Path("profiles")
    prompt_assembler_cls: type[SystemPromptAssembler] = SystemPromptAssembler

    def __init__(
        self,
        *,
        system_prompt: str | SystemPromptSpec | None = None,
        agent_prompt_config: AgentPromptConfig,
        agent_run_config: AgentRunConfig,
        router_config: RouterConfig | None = None,
        profile_store: ProfileStore,
        tools: Sequence[BaseTool],
        react_listener: ReactAgentListener | None = None,
        prompt_assembler: SystemPromptAssembler | None = None,
        turn_boundary: str | None = None,
        completion_tool_name: str | None = None,
    ) -> None:
        self.agent_prompt = agent_prompt_config
        self.agent_run_config = agent_run_config
        self.router_config = router_config or RouterConfig()
        self.profile_store = profile_store
        self.tools = list(tools)
        self.completion_tool_name = completion_tool_name or type(self).completion_tool_name
        self.turn_boundary = (
            type(self).turn_boundary if turn_boundary is None else turn_boundary
        )
        self.prompt_assembler = prompt_assembler or self.prompt_assembler_cls()
        self.react_listener = react_listener or CliReactListener(
            completion_tool_name=self.completion_tool_name
        )
        self.session = SessionTurnBuilder(self.turn_boundary)
        self.router = CompletionToolRouter(
            self.agent_run_config,
            self.router_config,
            completion_tool_name=self.completion_tool_name,
        )
        self.system_prompt: str | SystemPromptSpec = (
            system_prompt if system_prompt is not None else self.render_system_prompt
        )
        self.session_state: SessionAgentState | None = None

    @classmethod
    def default_profile_store(cls, root: Path | None = None) -> FileProfileStore:
        return FileProfileStore(root or cls.default_profile_dir)

    def render_system_prompt(self, state: SessionAgentState) -> str:
        user_id = state.get("user_id", "")
        if not isinstance(user_id, str) or not user_id.strip():
            user_id = getpass.getuser()
        profile = self.profile_store.load(user_id)
        return self.prompt_assembler.with_profile(profile).build()

    def route_after_step(self) -> Callable[[StateLike], str]:
        """Conditional edge after ``step_llm``; see ``CompletionToolRouter.route_after_step``."""
        return self.router.route_after_step()

    def route_after_tools(self) -> Callable[[StateLike], str]:
        """Conditional edge after tools; see ``CompletionToolRouter.route_after_tools``."""
        return self.router.route_after_tools()

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

    def print_turn_output(self, state: SessionAgentState) -> None:
        self.react_listener.print_turn_output(state)

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
        *,
        checkpointer: BaseCheckpointSaver,
        compression_config: CompressionConfig | None = None,
        enable_compression: bool | None = None,
    ) -> CompiledStateGraph:
        config = self.resolve_compression_config(
            compression_config,
            enable_compression=enable_compression,
        )
        compressor = make_compressor(model, config) if config.enabled else None
        refine_prompt = self.agent_prompt.refine_user_profile_prompt.strip()
        return build_react_graph(
            model,
            self.tools,
            checkpointer=checkpointer,
            system_prompt=self.system_prompt,
            next_step_prompt=self.agent_prompt.next_step,
            route_after_step=self.route_after_step(),
            route_after_tools=self.route_after_tools(),
            compressor=compressor,
            refine_user_profile_prompt=refine_prompt or None,
            profile_store=self.profile_store,
            classify_prompt=self.agent_prompt.classify_task_prompt,
            idle_nudge_prompt=self.agent_prompt.idle_nudge_prompt,
            tool_budget_exhausted_prompt=self.agent_prompt.tool_budget_exhausted_prompt,
            max_tool_calls=self.agent_run_config.max_tool_calls,
            on_tool_call=self.react_listener.print_tool_call,
            on_classify=self.react_listener.print_classify_task,
            on_llm_step=self.react_listener.print_llm_step,
        )
