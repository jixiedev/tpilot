"""Plan agent — create a plan, delegate steps to specialists, summarize."""

from __future__ import annotations

from collections.abc import Sequence
from pathlib import Path
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph

from agent.agent import BaseAgent
from agent.config import AgentPromptConfig, AgentRunConfig, RouterConfig
from agent.listener import CliReactListener, ReactAgentListener
from agent.react.plan.graph import build_plan_graph
from agent.react.plan.prompt import PlanSystemPrompt
from agent.react.plan.stage_tools import SpecialistRunner
from agent.react.plan.state import fresh_turn_state_defaults
from agent.react.plan.tool_scopes import TOOL_ID_DEFAULT
from agent.react.tahoe.tahoe_agent import DEFAULT_MAX_IDLE_ROUNDS, DEFAULT_MAX_TOOL_CALLS, TahoeAgent
from agent.scoped_tools import RegistryScopedTools
from agent.turn import AgentTurnResult, OnInterrupt, ainvoke_resolving_interrupts
from graph.builder import SystemPromptSpec
from memory.profile_store import ProfileStore
from tools.dynamic import register_dynamic_tool_bindings

DEFAULT_PROFILE_DIR = Path(__file__).resolve().parents[2] / "profiles"


class PlanAgent(BaseAgent, RegistryScopedTools):
    """Plan-and-execute orchestrator: plan → specialist rounds → adjust → summary."""

    registry_name = "plan"
    completion_tool_name = "chat_completion"
    default_profile_dir = DEFAULT_PROFILE_DIR

    def __init__(
        self,
        *,
        profile_store: ProfileStore,
        tools: Sequence[BaseTool],
        agent_run_config: AgentRunConfig | None = None,
        agent_prompt_config: AgentPromptConfig | None = None,
        router_config: RouterConfig | None = None,
        react_listener: ReactAgentListener | None = None,
        system_prompt: str | SystemPromptSpec | None = None,
        prompt_assembler: PlanSystemPrompt | None = None,
    ) -> None:
        super().__init__(system_prompt=None)
        self.profile_store = profile_store
        self.tools = list(tools)
        self.agent_run_config = agent_run_config or AgentRunConfig(
            max_tool_calls=DEFAULT_MAX_TOOL_CALLS,
            max_idle_rounds=DEFAULT_MAX_IDLE_ROUNDS,
        )
        self.agent_prompt_config = agent_prompt_config or AgentPromptConfig.default_prompt_config()
        self.router_config = router_config or RouterConfig()
        self.prompt_assembler = prompt_assembler or PlanSystemPrompt()
        self.completion_tool_name = type(self).completion_tool_name
        self.react_listener = react_listener or CliReactListener(
            completion_tool_name=self.completion_tool_name
        )
        self._tahoe = TahoeAgent(
            profile_store=profile_store,
            tools=tools,
            agent_run_config=self.agent_run_config,
            agent_prompt_config=self.agent_prompt_config,
            router_config=self.router_config,
            react_listener=self.react_listener,
            system_prompt=system_prompt,
            prompt_assembler=self.prompt_assembler,
        )
        self.system_prompt = self._tahoe.system_prompt
        self.session = self._tahoe.session
        self._graph: CompiledStateGraph | None = None
        self._model: BaseChatModel | None = None
        self._checkpointer: BaseCheckpointSaver | None = None
        self._bind_kwargs: dict[str, Any] = {}
        self._specialists: dict[str, BaseAgent] = {}
        self.session_state: Any = None

    @classmethod
    def default_profile_store(cls, root: Path | None = None) -> ProfileStore:
        from memory.profile_store import FileProfileStore

        return FileProfileStore(root or cls.default_profile_dir)

    async def _get_specialist(self, agent_name: str) -> BaseAgent:
        from agent.registry import get_agent

        name = agent_name.strip().lower()
        if name in self._specialists:
            return self._specialists[name]
        if self._model is None or self._checkpointer is None:
            raise RuntimeError("PlanAgent.bind() must be called before specialist delegation")
        spec = get_agent(name)
        specialist = await spec.create_agent(
            profile_store=self.profile_store,
            max_tool_calls=self.agent_run_config.max_tool_calls,
            max_idle_rounds=self.agent_run_config.max_idle_rounds,
        )
        await specialist.bind(self._model, self._checkpointer, **self._bind_kwargs)
        self._specialists[name] = specialist
        return specialist

    async def bind(
        self,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        **build_kwargs: Any,
    ) -> PlanAgent:
        self._model = model
        self._checkpointer = checkpointer
        self._bind_kwargs = dict(build_kwargs)
        self._specialists.clear()
        return await super().bind(model, checkpointer, **build_kwargs)

    async def build_graph(
        self,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        **kwargs: Any,
    ) -> CompiledStateGraph:
        runner = SpecialistRunner(get_specialist=self._get_specialist)
        graph = build_plan_graph(
            model,
            runner,
            checkpointer=checkpointer,
            system_prompt=self.system_prompt,
            max_tool_calls=self.agent_run_config.max_tool_calls,
            profile_dir=self.default_profile_dir,
        )
        self._graph = graph
        return graph

    def print_turn_output(self, state: Any) -> None:
        self._tahoe.print_turn_output(state)

    def render_system_prompt(self, state: Any) -> str:
        return self._tahoe.render_system_prompt(state)

    def register_observer(self, observer: ReactAgentListener) -> None:
        self._tahoe.register_observer(observer)

    def clear_observers(self) -> None:
        self._tahoe.clear_observers()

    async def prepare_turn_input(
        self,
        graph: CompiledStateGraph,
        session: str,
        user_prompt: str,
        *,
        user_id: str | None = None,
    ) -> Any:
        turn_input = await self._tahoe.prepare_turn_input(
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
        if self._graph is None:
            raise RuntimeError("PlanAgent.run called before build_graph")
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
            self.print_turn_output(result.state)
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
        system_prompt: str | SystemPromptSpec | None = None,
        agent_prompt_config: AgentPromptConfig | None = None,
        router_config: RouterConfig | None = None,
    ) -> PlanAgent:
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
            agent_run_config=AgentRunConfig(
                max_tool_calls=max_tool_calls,
                max_idle_rounds=max_idle_rounds,
            ),
            agent_prompt_config=agent_prompt_config,
            router_config=router_config,
            react_listener=react_listener,
            system_prompt=system_prompt,
        )
