"""Databot staged pipeline: outer state machine with ReAct subgraphs per stage."""

from __future__ import annotations

from collections.abc import Callable, Sequence
from pathlib import Path
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph

from agent.agent import BaseAgent
from agent.config import AgentRunContext, RouterConfig
from agent.listener import CliReactListener, ReactAgentListener
from agent.specialists.databot.tool_scopes import REGISTRY_NAME, TOOL_ID_DEFAULT
from agent.scoped_tools import RegistryScopedTools
from agent.specialists.databot.graph import (
    DEFAULT_STAGE_MAX_TOOL_CALLS,
    build_databot_graph,
)
from agent.specialists.databot.state import fresh_turn_state_defaults
from agent.specialists.databot.prompts.system import DatabotSystemPrompt
from agent.runtime import (
    DEFAULT_MAX_IDLE_ROUNDS,
    DEFAULT_MAX_TOOL_CALLS,
    DEFAULT_PROFILE_DIR,
    TahoeRuntimeHelper,
    default_profile_store,
    tahoe_run_context,
)
from agent.turn import AgentTurnResult, OnInterrupt, ainvoke_resolving_interrupts
from memory.profile_store import ProfileStore
from state.state import SessionAgentState
from tools.dynamic import register_dynamic_tool_bindings


class DatabotAgent(BaseAgent, RegistryScopedTools):
    """Data-retrieval specialist with a staged, human-gated pipeline.

    Tools and behavior differ from the generic Tahoe base:
    - RAG and datahub search are exposed and used in parallel during
      the fetch stage.
    - Two human gates pause the turn: after card selection, after SQL draft.
    """

    registry_name = REGISTRY_NAME
    completion_tool_name = "chat_completion"
    default_profile_dir = DEFAULT_PROFILE_DIR

    def __init__(
        self,
        *,
        profile_store: ProfileStore,
        tools: Sequence[BaseTool],
        run_context: AgentRunContext | None = None,
        router_config: RouterConfig | None = None,
        react_listener: ReactAgentListener | None = None,
        system_prompt: Callable[[SessionAgentState], str] | None = None,
        prompt_assembler: DatabotSystemPrompt | None = None,
    ) -> None:
        super().__init__(system_prompt=None)
        self.profile_store = profile_store
        self.tools = list(tools)
        self.run_context = run_context or tahoe_run_context()
        self.router_config = router_config or RouterConfig()
        self.prompt_assembler = prompt_assembler or DatabotSystemPrompt()
        self.completion_tool_name = type(self).completion_tool_name
        self.react_listener = react_listener or CliReactListener(
            completion_tool_name=self.completion_tool_name
        )
        self._runtime = TahoeRuntimeHelper(
            profile_store=profile_store,
            react_listener=self.react_listener,
            system_prompt=system_prompt,
            prompt_assembler=self.prompt_assembler,
        )
        self.system_prompt = self._runtime.system_prompt
        self.session = self._runtime.session
        self._graph: CompiledStateGraph | None = None
        self.session_state: Any = None

    @classmethod
    def default_profile_store(cls, root: Path | None = None) -> ProfileStore:
        return default_profile_store(root or cls.default_profile_dir)

    async def build_graph(
        self,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        **kwargs: Any,
    ) -> CompiledStateGraph:
        """Compile the Databot state machine.

        Accepts ``compression_config`` / ``enable_compression`` via ``kwargs``
        for API compatibility with ``BaseAgent.bind``; the staged pipeline does
        not use message compression.
        """
        graph = build_databot_graph(
            model,
            checkpointer=checkpointer,
            system_prompt=self.system_prompt,
            max_tool_calls=self.run_context.max_tool_calls or DEFAULT_STAGE_MAX_TOOL_CALLS,
            profile_dir=self.default_profile_dir,
        )
        self._graph = graph
        return graph

    def on_turn_output(self, state: Any) -> None:
        self._runtime.on_turn_output(state)

    def render_system_prompt(self, state: Any) -> str:
        return self._runtime.render_system_prompt(state)

    def register_secondary(self, listener: ReactAgentListener) -> None:
        self._runtime.register_secondary(listener)

    def clear_secondaries(self) -> None:
        self._runtime.clear_secondaries()

    async def prepare_turn_input(
        self,
        graph: CompiledStateGraph,
        session: str,
        user_prompt: str,
        *,
        user_id: str | None = None,
    ) -> Any:
        turn_input = await self._runtime.prepare_turn_input(
            graph, session, user_prompt, user_id=user_id
        )
        if not isinstance(turn_input, dict):
            return turn_input
        for key, value in fresh_turn_state_defaults().items():
            turn_input.setdefault(key, value)
        self.session_state = turn_input
        return turn_input

    async def run(
        self,
        user_prompt: str,
        *,
        session: str,
        user_id: str | None = None,
        on_interrupt: OnInterrupt | None = None,
        print_output: bool = True,
    ) -> AgentTurnResult:
        """Run one Databot turn."""
        if self._graph is None:
            raise RuntimeError("DatabotAgent.run called before build_graph")
        turn_input = await self.prepare_turn_input(
            self._graph, session, user_prompt, user_id=user_id
        )
        result = await ainvoke_resolving_interrupts(
            self._graph,
            turn_input,
            self.graph_config(session),
            on_interrupt=on_interrupt,
        )
        if result.cancelled:
            return result
        if print_output:
            self.on_turn_output(result.state)
        return result

    @classmethod
    async def create(
        cls,
        *,
        profile_store: ProfileStore | None = None,
        max_tool_calls: int = DEFAULT_MAX_TOOL_CALLS,
        max_idle_rounds: int = DEFAULT_MAX_IDLE_ROUNDS,
        enable_compression_tools: bool = True,
        react_listener: ReactAgentListener | None = None,
        system_prompt: Callable[[SessionAgentState], str] | None = None,
        run_context: AgentRunContext | None = None,
        router_config: RouterConfig | None = None,
    ) -> DatabotAgent:
        store = profile_store or cls.default_profile_store()
        await register_dynamic_tool_bindings()
        tools = cls.tools_for_scope(TOOL_ID_DEFAULT)
        if not enable_compression_tools:
            from memory.tools import COMPACT_CONTEXT_TOOL_NAME, READ_OFFLOADED_FILE_TOOL_NAME

            skip = {COMPACT_CONTEXT_TOOL_NAME, READ_OFFLOADED_FILE_TOOL_NAME}
            tools = [tool for tool in tools if getattr(tool, "name", "") not in skip]
        return cls(
            profile_store=store,
            tools=tools,
            run_context=run_context
            or tahoe_run_context(
                max_tool_calls=max_tool_calls,
                max_idle_rounds=max_idle_rounds,
            ),
            router_config=router_config,
            react_listener=react_listener,
            system_prompt=system_prompt,
        )
