"""Databot v2 — staged pipeline (state machine between stages, ReAct inside).

Public API is unchanged from v1: ``DatabotAgent.create(...)`` returns an
agent whose ``run(...)`` accepts a user prompt. The internal graph is
now a state machine driven by ``agent.react.databot.graph.build_databot_graph``
rather than the generic ``build_react_graph`` Tahoe base uses.

Why we no longer extend ``TahoeAgent``: the new graph has its own
``DatabotState`` schema and its own conditional edges; piggybacking on
the Tahoe ``BaseReactAgent.build_graph`` would mean fighting it on every
field. We still inherit the session/turn/profile-store plumbing and the
``run`` / ``register_observer`` / ``print_turn_output`` contract via a
light composition (an inner ``TahoeAgent`` is created for its
side-effects-free helpers, but the actual graph comes from
``build_databot_graph``).
"""

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
from agent.react.databot.graph import (
    DEFAULT_STAGE_MAX_TOOL_CALLS,
    build_databot_graph,
)
from agent.react.databot.prompt import (
    IDLE_CHAT_COMPLETION_PROMPT,
    NEXT_STEP_PROMPT,
    REFINE_USER_PROFILE_PROMPT,
    TOOL_BUDGET_EXHAUSTED_PROMPT,
    SYSTEM_PROMPT as DATABOT_SYSTEM_PROMPT,
    DatabotSystemPrompt,
)
from agent.react.tahoe.tahoe_agent import (
    DEFAULT_MAX_IDLE_ROUNDS,
    DEFAULT_MAX_TOOL_CALLS,
    TahoeAgent,
)
from agent.session import SessionTurnBuilder
from agent.turn import AgentTurnResult, OnInterrupt, ainvoke_resolving_interrupts
from graph.builder import SystemPromptSpec
from memory import CompressionConfig
from memory.profile_store import ProfileStore
from tools.loader import load_data_tools

DEFAULT_PROFILE_DIR = Path(__file__).resolve().parents[2] / "profiles"


class DatabotAgent(BaseAgent):
    """Data-retrieval specialist with a staged, human-gated pipeline.

    Tools and behavior differ from the generic Tahoe base:
    - RAG and datahub search are exposed and used in parallel during
      the fetch stage.
    - Two human gates pause the turn: after card selection, after SQL draft.
    - A final chart-emit question is optional (Superset integration TODO).
    """

    prompt_assembler_cls = DatabotSystemPrompt
    completion_tool_name = "chat_completion"
    default_profile_dir = DEFAULT_PROFILE_DIR

    def __init__(
        self,
        *,
        profile_store: ProfileStore,
        tools: Sequence[BaseTool],
        rag_tools: Sequence[BaseTool] | None = None,
        agent_run_config: AgentRunConfig | None = None,
        agent_prompt_config: AgentPromptConfig | None = None,
        router_config: RouterConfig | None = None,
        react_listener: ReactAgentListener | None = None,
        system_prompt: str | SystemPromptSpec | None = None,
        prompt_assembler: DatabotSystemPrompt | None = None,
    ) -> None:
        # ``BaseAgent.__init__`` only takes ``system_prompt``; pass None and
        # assign our own below so we can hold a dynamic renderer.
        super().__init__(system_prompt=None)
        self.profile_store = profile_store
        self.tools = list(tools)
        # Default the RAG subset to those tools whose name starts with
        # ``fetch_related_models`` or ``add_card_to_state``; callers that
        # need finer control can pass ``rag_tools`` explicitly.
        if rag_tools is None:
            self.rag_tools = [
                tool for tool in self.tools
                if getattr(tool, "name", "") in {"fetch_related_models", "add_card_to_state"}
            ]
        else:
            self.rag_tools = list(rag_tools)
        self.agent_run_config = agent_run_config or AgentRunConfig(
            max_tool_calls=DEFAULT_MAX_TOOL_CALLS,
            max_idle_rounds=DEFAULT_MAX_IDLE_ROUNDS,
        )
        self.agent_prompt_config = agent_prompt_config or self.default_prompt_config()
        self.router_config = router_config or RouterConfig()
        self.prompt_assembler = prompt_assembler or self.prompt_assembler_cls()
        self.completion_tool_name = type(self).completion_tool_name
        self.react_listener = react_listener or CliReactListener(
            completion_tool_name=self.completion_tool_name
        )
        # Reuse the Tahoe base for session / turn / route helpers. We do
        # NOT call its ``build_graph``; see ``build_graph`` below.
        self._tahoe = TahoeAgent(
            profile_store=profile_store,
            tools=tools,
            agent_run_config=self.agent_run_config,
            agent_prompt_config=self.agent_prompt_config,
            router_config=self.router_config,
            react_listener=self.react_listener,
            system_prompt=system_prompt or DATABOT_SYSTEM_PROMPT,
            prompt_assembler=self.prompt_assembler,
        )
        self.system_prompt = system_prompt or self._tahoe.render_system_prompt
        self.session = self._tahoe.session
        # ``self.graph`` is a property on BaseAgent backed by ``self._graph``;
        # we set the underlying attribute so the inherited property works.
        self._graph: CompiledStateGraph | None = None
        self.session_state: Any = None

    @classmethod
    def default_prompt_config(cls) -> AgentPromptConfig:
        return AgentPromptConfig(
            next_step=NEXT_STEP_PROMPT,
            idle_nudge_prompt=IDLE_CHAT_COMPLETION_PROMPT,
            tool_budget_exhausted_prompt=TOOL_BUDGET_EXHAUSTED_PROMPT,
            refine_user_profile_prompt=REFINE_USER_PROFILE_PROMPT,
        )

    @classmethod
    def default_profile_store(cls, root: Path | None = None) -> ProfileStore:
        from memory.profile_store import FileProfileStore

        return FileProfileStore(root or cls.default_profile_dir)

    # ------------------------------------------------------------------
    # Graph build
    # ------------------------------------------------------------------

    async def build_graph(
        self,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        compression_config: CompressionConfig | None = None,
        enable_compression: bool | None = None,
        **kwargs: Any,
    ) -> CompiledStateGraph:
        """Compile the Databot v2 state machine.

        The ``compression_config`` / ``enable_compression`` kwargs are
        accepted for API parity with ``BaseReactAgent.build_graph`` but
        the new graph does not embed a compressor — the per-stage
        subgraphs already keep their own short, scoped message history.
        """
        _ = (compression_config, enable_compression)  # accepted but unused
        graph = build_databot_graph(
            model,
            self.tools,
            self.rag_tools,
            checkpointer=checkpointer,
            system_prompt=self._tahoe.render_system_prompt,
            max_tool_calls=self.agent_run_config.max_tool_calls or DEFAULT_STAGE_MAX_TOOL_CALLS,
            profile_dir=self.default_profile_dir,
        )
        self._graph = graph
        return graph

    # ------------------------------------------------------------------
    # Turn entry points (delegate to Tahoe base for session plumbing)
    # ------------------------------------------------------------------

    def route_after_step(self):  # pragma: no cover - delegated
        return self._tahoe.route_after_step()

    def route_after_tools(self):  # pragma: no cover - delegated
        return self._tahoe.route_after_tools()

    def print_turn_output(self, state: Any) -> None:
        self._tahoe.print_turn_output(state)

    def render_system_prompt(self, state: Any) -> str:
        # Delegate to the embedded Tahoe base so the profile-aware prompt
        # is identical to the v1 databot and to the tests' expectation.
        return self._tahoe.render_system_prompt(state)

    def register_observer(self, observer: ReactAgentListener) -> None:
        self._tahoe.register_observer(observer)

    def clear_observers(self) -> None:
        self._tahoe.clear_observers()

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
    ) -> Any:
        turn_input = await self._tahoe.prepare_turn_input(
            graph, session, user_prompt, user_id=user_id
        )
        if not isinstance(turn_input, dict):
            return turn_input
        # Initialize stage-machine fields if this is a fresh thread.
        defaults: dict[str, Any] = {
            "stage": "fetch",
            "candidate_cards": [],
            "selected_cards": [],
            "approved_cards": [],
            "metric_conflicts": [],
            "draft_sql": "",
            "approved_sql": "",
            "sql_validated": False,
            "execution_result": {},
            "gate_decisions": [],
            "cards_reasons": {},
            "sql_reasons": {},
            "dryrun": False,
            "halt_reason": "",
            "chart_requested": False,
            "deny_feedback": "",
        }
        for key, value in defaults.items():
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
        """Run one Databot v2 turn. Mirrors ``BaseReactAgent.run`` semantics."""
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
            self.print_turn_output(result.state)
        return result

    # ------------------------------------------------------------------
    # Factory
    # ------------------------------------------------------------------

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
    ) -> DatabotAgent:
        store = profile_store or cls.default_profile_store()
        data_tools = await load_data_tools()
        from tools.rag import TOOLS as rag_tools
        from agent.react.tahoe.tools import TOOLS as tahoe_tools

        # The full databot tool set. RAG tools are part of it, but we
        # also pass them separately so ``build_databot_graph`` can find
        # them by name even if tool filtering is later restricted.
        tools: list[BaseTool] = [
            *data_tools,
            *tahoe_tools,
            *TahoeAgent.base_tools(enable_compression_tools=enable_compression_tools),
        ]
        # ``base_tools`` already includes the tahoe general tools + completion
        # tool; de-dup by tool name to avoid double-binding.
        seen: set[str] = set()
        deduped: list[BaseTool] = []
        for tool in tools:
            name = getattr(tool, "name", "")
            if name in seen:
                continue
            seen.add(name)
            deduped.append(tool)
        return cls(
            profile_store=store,
            tools=deduped,
            rag_tools=list(rag_tools),
            agent_run_config=AgentRunConfig(
                max_tool_calls=max_tool_calls,
                max_idle_rounds=max_idle_rounds,
            ),
            agent_prompt_config=agent_prompt_config,
            router_config=router_config,
            react_listener=react_listener,
            system_prompt=system_prompt,
        )
