"""Lead agent: one conversational ReAct loop that answers, plans and delegates.

It replaces the intent router and the Plan pipeline. Specialists run nested
inside its ``delegate`` tool (see :mod:`tahoepilot.agent.subagent`), so their human gates
pause and resume through the lead's own thread in the CLI and over AG-UI.

Example checkpoint ``messages``::

    Turn 1::

        [SYS]   lead persona + specialist roster
        [HUMAN] user question
        [AI]    delegate(agent="warehouse", task=...)   (or write_plan first)
        [TOOL]  {"agent": "warehouse", "status": "done", "summary": ..., "artifacts": ...}
        [AI]    answer

    Turn 2 adds a turn boundary, the next question and its steps. ``plan`` is
    reset each turn; ``work_record`` keeps every delegation across turns.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    RemoveMessage,
    SystemMessage,
)
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.graph.state import CompiledStateGraph

from tahoepilot.agent.catalog import AgentCatalog, AgentCatalogSettings
from tahoepilot.agent.lead.prompt import LeadSystemPrompt, delegatable_agents, lead_step_prompt
from tahoepilot.agent.lead.state import LeadState, turn_finish, turn_start
from tahoepilot.agent.lead.tools import DELEGATE_TOOL_NAME, make_delegate_tool, make_write_plan_tool
from tahoepilot.agent.listener import AgentListener, CliListener, ListenerHub
from tahoepilot.agent.react import BaseReactAgent
from tahoepilot.settings.agent_config import AgentConfig, LeadAgentConfig
from tahoepilot.agent.graph.builder import ReactLoopSpec, ReactStateSpec, build_react_graph
from tahoepilot.memory.session_runtime import SessionRuntime

_MAX_TASK_PREVIEW_CHARS = 120


def delegate_status(agent_name: str, task: str) -> str:
    """One-line status shown before a delegation runs."""
    agent = (agent_name or "").strip() or "specialist"
    text = " ".join((task or "").split())
    if len(text) > _MAX_TASK_PREVIEW_CHARS:
        text = text[: _MAX_TASK_PREVIEW_CHARS - 1].rstrip() + "…"
    return f"Running {agent}: {text}" if text else f"Running {agent}"


class DelegateListener(AgentListener):
    """Shows ``delegate`` as a status line instead of a raw tool call and result."""

    def __init__(self, delegate: AgentListener) -> None:
        self._delegate = delegate

    def on_status(self, message: str) -> None:
        self._delegate.on_status(message)

    def on_reason_start(
        self,
        tool_call_count: int = 0,
        max_tool_calls: int = 0,
        idle_reason_rounds: int = 0,
    ) -> None:
        self._delegate.on_reason_start(
            tool_call_count=tool_call_count,
            max_tool_calls=max_tool_calls,
            idle_reason_rounds=idle_reason_rounds,
        )

    def on_tool_call(self, name: str, args: dict[str, Any]) -> None:
        if name == DELEGATE_TOOL_NAME:
            self._delegate.on_status(
                delegate_status(str(args.get("agent") or ""), str(args.get("task") or ""))
            )
            return
        self._delegate.on_tool_call(name, args)

    def on_tool_result(self, name: str, content: Any) -> None:
        if name == DELEGATE_TOOL_NAME:
            return
        self._delegate.on_tool_result(name, content)

    def on_reason_step(self, message: AIMessage) -> None:
        self._delegate.on_reason_step(message)

    def on_turn_output(self, state: Any) -> None:
        self._delegate.on_turn_output(state)


class LeadAgent(BaseReactAgent):
    """Front agent. Tools: ``delegate``, ``write_plan`` and the ``@memory`` tools."""

    prompt_factory = LeadSystemPrompt
    tool_ids = ("default",)

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
            agent_config=agent_config,
            tools=tools,
            listener=listener or CliListener(),
        )
        self.specialists = AgentCatalog(
            AgentCatalogSettings(
                profile_store=session_runtime,
                model=model,
                checkpointer=checkpointer,
            )
        )

    @property
    def max_delegations(self) -> int:
        return AgentConfig.as_int(
            self.run_context, "max_delegations", LeadAgentConfig.DEFAULT_MAX_DELEGATIONS
        )

    async def get_specialist(self, name: str) -> Any:
        """Specialist instance for ``delegate`` (looked up per call, so it can be swapped)."""
        return await self.specialists.get_or_create(name)

    def lead_tools(self) -> list[BaseTool]:
        """Configured tools plus the two lead tools bound to this instance."""
        bound = [
            make_delegate_tool(
                self.get_specialist,
                agents=delegatable_agents,
                max_delegations=self.max_delegations,
            ),
            make_write_plan_tool(agents=delegatable_agents),
        ]
        names = {tool.name for tool in bound}
        return [*bound, *(tool for tool in self.tools if tool.name not in names)]

    def turn_start(self, state: Mapping[str, Any]) -> dict[str, Any]:
        """Per-turn reset, plus persona and turn boundary when the input lacks them.

        The CLI adds both in ``accept_user_request``. AG-UI drives the graph
        directly with only the chat messages, so the first web turn would run
        without the persona and specialist roster, and later turns without a
        boundary; this inserts them (rewriting the list only when needed).
        """
        update = turn_start(state)
        framed = self.framed_messages(state)
        if framed is not None:
            update["messages"] = [RemoveMessage(id=REMOVE_ALL_MESSAGES), *framed]
        return update

    def framed_messages(self, state: Mapping[str, Any]) -> list[BaseMessage] | None:
        messages = list(state.get("messages") or [])
        if not messages:
            return None
        changed = False
        if not isinstance(messages[0], SystemMessage):
            profile = self.session_runtime.load_for_turn(state)
            persona = self.session_turn_processor.system_prompt_assembler.build(profile)
            messages = [SystemMessage(content=persona), *messages]
            changed = True
        humans = [i for i, m in enumerate(messages) if isinstance(m, HumanMessage)]
        marker = type(self).turn_boundary.strip()
        if marker and len(humans) >= 2:
            last = humans[-1]
            before = messages[last - 1]
            if not (isinstance(before, SystemMessage) and marker in str(before.content)):
                messages = [*messages[:last], SystemMessage(content=marker), *messages[last:]]
                changed = True
        return messages if changed else None

    def build_graph(self, **kwargs: Any) -> CompiledStateGraph:
        if self.graph is not None:
            return self.graph
        base_loop = ReactLoopSpec.from_run_context(self.run_context)
        compiled = build_react_graph(
            self.model,
            self.lead_tools(),
            checkpointer=self.checkpointer,
            router=self.router,
            listener=ListenerHub(DelegateListener(self.listener)),
            compressor=self.compressor,
            loop=ReactLoopSpec(
                next_step_prompt=lead_step_prompt,
                tool_budget_exhausted_prompt=base_loop.tool_budget_exhausted_prompt,
                max_tool_calls=base_loop.max_tool_calls,
            ),
            state=ReactStateSpec(
                state_class=LeadState,
                turn_init=self.turn_start,
                turn_finish=turn_finish,
            ),
        )
        self.graph = compiled
        return compiled
