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
from agent.config import AgentRunContext, RouterConfig, DEFAULT_AGENT_RUN_CONTEXT
from agent.listener import CliReactListener, ReactAgentListener
from agent.plan.stage_tools import SpecialistRunner
from agent.runtime import (
    DEFAULT_PROFILE_DIR,
    TahoeRuntimeHelper,
    default_profile_store,
)
from agent.scoped_tools import RegistryScopedTools
from agent.specialists.databot.graph import (
    DEFAULT_STAGE_MAX_TOOL_CALLS,
    build_databot_graph,
)

from agent.specialists.databot.state import DatabotState
from agent.specialists.databot.prompts.system import DatabotSystemPrompt
from agent.specialists.databot.state import fresh_turn_state_defaults
from agent.specialists.databot.tool_scopes import REGISTRY_NAME, TOOL_ID_DEFAULT
from agent.turn import AgentTurnResult, OnInterrupt, ainvoke_resolving_interrupts
from graph.builder import static_system_prompt
from memory.profile_store import ProfileStore
from state.state import SessionAgentState
from tools.dynamic import register_dynamic_tool_bindings

from agent.specialists.databot.prompts.system import SYSTEM_PROMPT as DATABOT_SYSTEM_PROMPT

class DatabotAgent(BaseAgent, RegistryScopedTools):
    """Data-retrieval specialist with a staged, human-gated pipeline.

    Tools and behavior differ from the generic Tahoe base:
    - RAG and datahub search are exposed and used in parallel during
      the fetch stage.
    - Two human gates pause the turn: after card selection, after SQL draft.
    """

    registry_name = REGISTRY_NAME
    default_profile_dir = DEFAULT_PROFILE_DIR

    def __init__(
        self,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver | None,
        *,
        profile_store: ProfileStore,
        tools: Sequence[BaseTool],
        run_context: AgentRunContext,
        router_config: RouterConfig,
        react_listener: ReactAgentListener | None = None,
        system_prompt: Callable[[SessionAgentState], str] = None,
    ) -> None:
        super().__init__(system_prompt)
        self.tools = list(tools)
        self.run_context = run_context
        self.router_config = router_config
        self.prompt_assembler = DatabotSystemPrompt()
        self.react_listener = react_listener or CliReactListener()
        self._runtime = TahoeRuntimeHelper(
            profile_store=profile_store,
            react_listener=self.react_listener,
            system_prompt=system_prompt,
            prompt_assembler=DatabotSystemPrompt()
        )
        self._graph: CompiledStateGraph | None = None
        self._model = model
        self._checkpointer = checkpointer
        self._specialists: dict[str, BaseAgent] = {}
        self.session_state: Any = None

    @classmethod
    def default_profile_store(cls, root: Path | None = None) -> ProfileStore:
        return default_profile_store(root or cls.default_profile_dir)

    async def _get_specialist(self, agent_name: str) -> BaseAgent:
        from agent.registry import get_agent

        name = agent_name.strip().lower()
        if name in self._specialists:
            return self._specialists[name]
        if self._model is None or self._checkpointer is None:
            raise RuntimeError("DatabotAgent.bind() must be called before specialist delegation")
        spec = get_agent(name)
        specialist = await spec.create_agent(
            profile_store=self._runtime.profile_store,
            max_tool_calls=self.run_context.max_tool_calls,
            max_idle_rounds=self.run_context.max_idle_rounds,
        )
        await specialist.build_graph()
        self._specialists[name] = specialist
        return specialist

    async def build_graph(
        self,
        **kwargs: Any,
    ) -> CompiledStateGraph:
        """Compile the Databot state machine.

        Accepts ``compression_config`` / ``enable_compression`` via ``kwargs``
        for API compatibility with ``BaseAgent.bind``; the staged pipeline does
        not use message compression.
        """
        graph = build_databot_graph(
            self._model,
            checkpointer=self._checkpointer,
            runner=SpecialistRunner(get_specialist=self._get_specialist),
            system_prompt=self.system_prompt,
            max_tool_calls=self.run_context.max_tool_calls,
            profile_dir=self.default_profile_dir,
        )
        self._graph = graph
        return graph

    def on_turn_output(self, state: Any) -> None:
        self._runtime.on_turn_output(state)

    async def prepare_turn_input(
        self,
        graph: CompiledStateGraph,
        session: str,
        user_prompt: str,
        *,
        user_id: str | None = None,
    ) -> DatabotState:
        session_state = await self._runtime.prepare_turn_input(
            graph, session, user_prompt, user_id=user_id
        )
        databot_state = DatabotState.__new__(DatabotState)
        databot_state.__dict__.update(session_state.__dict__)
        for key, value in fresh_turn_state_defaults().items():
            databot_state.setdefault(key, value)
        self.session_state = databot_state
        return databot_state

    async def run(
        self,
        user_prompt: str,
        *,
        session: str,
        user_id: str | None = None,
        on_interrupt: OnInterrupt | None = None,
    ) -> AgentTurnResult:
        """Run one Databot turn."""
        if self._graph is None:
            raise RuntimeError("DatabotAgent.run called before build_graph")
        databot_state = await self.prepare_turn_input(
            self._graph, session, user_prompt, user_id=user_id
        )
        result = await ainvoke_resolving_interrupts(
            self._graph,
            databot_state,
            self.graph_config(session),
            on_interrupt=on_interrupt,
        )
        if result.cancelled:
            return result
        self.on_turn_output(result.state)
        return result

    @classmethod
    async def create(
        cls,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver | None,
        system_prompt: Callable[[SessionAgentState], str] | None,
        *,
        profile_store: ProfileStore | None = None,
        react_listener: ReactAgentListener | None = None,
        run_context: AgentRunContext | None = None,
        router_config: RouterConfig | None = None,
    ) -> DatabotAgent:
        store = profile_store or cls.default_profile_store()
        await register_dynamic_tool_bindings()
        tools = cls.tools_for_scope(TOOL_ID_DEFAULT)
        if not system_prompt:
            system_prompt = static_system_prompt(DATABOT_SYSTEM_PROMPT)
        return cls(
            model,
            checkpointer,
            profile_store=store,
            tools=tools,
            run_context=run_context or DEFAULT_AGENT_RUN_CONTEXT,
            router_config=router_config or RouterConfig(),
            react_listener=react_listener,
            system_prompt=system_prompt,
        )
