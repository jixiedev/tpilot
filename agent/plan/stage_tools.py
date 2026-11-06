"""Stage-scoped tools for the Plan agent graph."""

from __future__ import annotations

import asyncio
import contextlib
import contextvars
from collections.abc import Awaitable, Callable, Iterator
from dataclasses import dataclass
from typing import Any

from langchain_core.messages import AIMessage, ToolMessage
from langchain_core.tools import BaseTool, tool
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command

from agent.listener import AgentListener, ListenerHub
from agent.plan.plan_agent import (
    DELEGATABLE_AGENTS,
    INVOKE_AGENT_TOOL_NAME,
    STAGE_ADJUST,
    STAGE_EXECUTE,
    PlanStepStatus,
)
from agent.session import SpecialistSession
from agent.turn import OnInterrupt
from graph.state import SessionAgentState
from tools.registry import register_tool
from tools.plan import PlanToolError, run_planning


class PlanCommands:
    """Shared ToolMessage construction for Plan stage tools."""

    @staticmethod
    def tool_message(tool_call_id: str, text: str) -> ToolMessage:
        return ToolMessage(content=text, tool_call_id=tool_call_id)


# LangChain ``@tool`` + catalog binding requires module-level decorated callables.
@register_tool
@tool
def create_plan(
    plan_id: str,
    title: str,
    steps: list[str],
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Create the turn plan and store ``plan_id`` in graph state.

    ``steps`` are short actionable strings; prefix with ``[agent_name]`` when
    delegating to a specialist (e.g. ``[databot] Find GMV definition``).
    """
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    try:
        text = run_planning(
            "create",
            plan_id=plan_id,
            title=title,
            steps=steps,
        )
    except PlanToolError as exc:
        return Command(
            update={
                "messages": [
                    PlanCommands.tool_message(tool_call_id, f"Plan create failed: {exc}"),
                ],
            }
        )
    key = plan_id.strip()
    return Command(
        update={
            "plan_id": key,
            "stage": STAGE_EXECUTE,
            "messages": [PlanCommands.tool_message(tool_call_id, text)],
        }
    )


@register_tool(key="plan.planning")
@tool
def planning(
    command: str,
    plan_id: str | None = None,
    title: str | None = None,
    steps: list[str] | None = None,
    step_index: int | None = None,
    step_status: str | None = None,
    step_notes: str | None = None,
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Adjust or inspect the in-memory plan (update, mark_step, get, list)."""
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    full_state = runtime.state if runtime is not None else {}
    active_plan_id = ""
    if isinstance(full_state, dict):
        active_plan_id = str(full_state.get("plan_id") or "").strip()
    if not plan_id and active_plan_id:
        plan_id = active_plan_id
    try:
        text = run_planning(
            command,
            plan_id=plan_id,
            title=title,
            steps=steps,
            step_index=step_index,
            step_status=step_status,
            step_notes=step_notes,
        )
    except PlanToolError as exc:
        return Command(
            update={
                "messages": [
                    PlanCommands.tool_message(tool_call_id, f"Planning command failed: {exc}"),
                ],
            }
        )
    update: dict[str, Any] = {
        "messages": [PlanCommands.tool_message(tool_call_id, text)],
    }
    stage = ""
    if isinstance(full_state, dict):
        stage = str(full_state.get("stage") or "")
    cmd = (command or "").strip().lower()
    if stage == STAGE_ADJUST and cmd in {"update", "mark_step"}:
        update["adjust_had_tool_calls"] = True
        update["stage"] = STAGE_EXECUTE
    return Command(update=update)


# The plan run's human-in-the-loop callback. ``PlanAgent.run`` sets it for the
# duration of a turn; the compiled plan graph is shared across sessions, so the
# callback cannot live on the runner instance.
_PLAN_ON_INTERRUPT: contextvars.ContextVar[OnInterrupt | None] = contextvars.ContextVar(
    "plan_on_interrupt", default=None
)


class SpecialistNeedsInputError(RuntimeError):
    """A delegated specialist paused for human input and no handler is available."""


@dataclass
class SpecialistRunner:
    """Run registered specialists from the invoke_agent tool."""

    get_specialist: Callable[[str], Awaitable[Any]]
    parent_session: str = ""

    @staticmethod
    @contextlib.contextmanager
    def interrupt_handler(on_interrupt: OnInterrupt | None) -> Iterator[None]:
        """Make ``on_interrupt`` available to specialists delegated in this context."""
        token = _PLAN_ON_INTERRUPT.set(on_interrupt)
        try:
            yield
        finally:
            _PLAN_ON_INTERRUPT.reset(token)

    @staticmethod
    def _no_handler(agent_name: str) -> OnInterrupt:
        async def refuse(question: str) -> str | None:
            raise SpecialistNeedsInputError(
                f"specialist {agent_name} paused for human input ({question!r}), "
                "but this plan run has no interactive handler, so the step cannot "
                "continue. Do not retry this step; report what is missing in the "
                "final answer or choose a step that needs no human approval."
            )

        return refuse

    async def run(
        self,
        agent_name: str,
        task: str,
        *,
        parent_session: str,
        on_interrupt: OnInterrupt | None = None,
    ) -> str:
        """Run one delegated step.

        Interrupts inside the specialist (for example databot gates) go to
        ``on_interrupt``, else to the plan run's handler (``interrupt_handler``).
        Without either, :class:`SpecialistNeedsInputError` explains the problem.
        """
        name = agent_name.strip().lower()
        if name not in DELEGATABLE_AGENTS:
            allowed = ", ".join(sorted(DELEGATABLE_AGENTS))
            raise ValueError(
                f"Unknown specialist {agent_name!r}; available: {allowed}"
            )
        task_text = (task or "").strip()
        if not task_text:
            raise ValueError("`task` must be non-empty")
        handler = on_interrupt or _PLAN_ON_INTERRUPT.get() or self._no_handler(name)
        specialist = await self.get_specialist(name)
        session = SpecialistSession.id(parent_session or self.parent_session, name)
        result = await specialist.run(
            task_text,
            session=session,
            on_interrupt=handler,
            print_output=False,
        )
        if result.cancelled:
            raise RuntimeError(f"specialist {name} run was cancelled")
        from agent.turn import AgentTurnResult

        output = AgentTurnResult.extract_output(result.state)
        return output or "(specialist returned no text output)"

    async def run_isolated(
        self,
        agent_name: str,
        task: str,
        *,
        parent_session: str,
    ) -> str:
        """Run a nested specialist in a worker thread.

        ``langgraph dev`` blocks synchronous work inside async tool handlers;
        isolating the nested graph in its own event loop avoids that.
        """

        def _work() -> str:
            return asyncio.run(
                self.run(agent_name, task, parent_session=parent_session)
            )

        return await asyncio.to_thread(_work)

    def invoke_tool(self) -> BaseTool:
        """Build the subagent delegation tool bound to this runner."""
        runner = self

        @tool
        async def invoke_agent(
            agent_name: str,
            task: str,
            runtime: ToolRuntime = None,  # type: ignore[assignment]
        ) -> Command:
            """Delegate one plan step to a specialist agent.

            ``agent_name`` must be one of the catalogued specialists (e.g. databot, swe).
            ``task`` is the full instruction for that agent for this step.
            """
            tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
            full_state = runtime.state if runtime is not None else {}
            session = ""
            if isinstance(full_state, dict):
                session = str(full_state.get("session_name") or "").strip()
            try:
                output = await runner.run(
                    agent_name,
                    task,
                    parent_session=session,
                )
            except Exception as exc:
                return Command(
                    update={
                        "messages": [
                            PlanCommands.tool_message(
                                tool_call_id,
                                f"invoke_agent failed for {agent_name}: {exc}",
                            ),
                        ],
                    }
                )
            prev: list[dict[str, Any]] = []
            if isinstance(full_state, dict):
                prev = list(full_state.get("step_results") or [])
            entry = {
                "agent": agent_name.strip().lower(),
                "task": task.strip(),
                "output": output,
            }
            return Command(
                update={
                    "stage": STAGE_EXECUTE,
                    "step_results": prev + [entry],
                    "messages": [
                        PlanCommands.tool_message(
                            tool_call_id,
                            f"Specialist `{agent_name}` finished.\n\n{output}",
                        ),
                    ],
                }
            )

        return invoke_agent


class PlanSubagentListener(AgentListener):
    """Execute-stage tool hooks for ``invoke_agent`` status and result filtering."""

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
        if name == INVOKE_AGENT_TOOL_NAME:
            self._delegate.on_status(
                PlanStepStatus.format(
                    str(args.get("agent_name") or ""),
                    str(args.get("task") or ""),
                )
            )
            return
        self._delegate.on_tool_call(name, args)

    def on_tool_result(self, name: str, content: Any) -> None:
        if name == INVOKE_AGENT_TOOL_NAME:
            return
        self._delegate.on_tool_result(name, content)

    def on_reason_step(self, message: AIMessage) -> None:
        self._delegate.on_reason_step(message)

    def on_turn_output(self, state: SessionAgentState) -> None:
        self._delegate.on_turn_output(state)

    @classmethod
    def hub(cls, hub: ListenerHub) -> ListenerHub:
        """Listener hub for the subagent execute subgraph."""
        return ListenerHub(cls(hub))

    def tool_call_callback(self) -> Callable[[str, dict[str, Any]], None]:
        """Emit a short user-facing status before ``invoke_agent`` runs a plan step."""

        def on_tool_call(name: str, args: dict[str, Any]) -> None:
            self.on_tool_call(name, args)

        return on_tool_call
