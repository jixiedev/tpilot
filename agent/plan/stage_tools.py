"""Stage-scoped tools for the Plan agent graph."""

from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from typing import Any

from langchain_core.messages import ToolMessage
from langchain_core.tools import BaseTool, tool
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command

from agent.plan._constants import STAGE_ADJUST, STAGE_EXECUTE
from agent.plan.prompt import DELEGATABLE_AGENTS
from agent.session import specialist_session_id
from tools.common import bind_tool_to_agent
from tools.plan import PlanToolError, run_planning


def _ok_tool_message(tool_call_id: str, text: str) -> ToolMessage:
    return ToolMessage(content=text, tool_call_id=tool_call_id)


@bind_tool_to_agent("plan,create")
@bind_tool_to_agent("plan,default")
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
                    _ok_tool_message(tool_call_id, f"Plan create failed: {exc}"),
                ],
            }
        )
    key = plan_id.strip()
    return Command(
        update={
            "plan_id": key,
            "stage": STAGE_EXECUTE,
            "messages": [_ok_tool_message(tool_call_id, text)],
        }
    )


@bind_tool_to_agent("plan,subagent")
@bind_tool_to_agent("plan,adjust")
@bind_tool_to_agent("plan,default")
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
                    _ok_tool_message(tool_call_id, f"Planning command failed: {exc}"),
                ],
            }
        )
    update: dict[str, Any] = {
        "messages": [_ok_tool_message(tool_call_id, text)],
    }
    stage = ""
    if isinstance(full_state, dict):
        stage = str(full_state.get("stage") or "")
    cmd = (command or "").strip().lower()
    if stage == STAGE_ADJUST and cmd in {"update", "mark_step"}:
        update["adjust_had_tool_calls"] = True
        update["stage"] = STAGE_EXECUTE
    return Command(update=update)


@dataclass
class SpecialistRunner:
    """Run registered specialists from the invoke_agent tool."""

    get_specialist: Callable[[str], Awaitable[Any]]
    parent_session: str = ""

    async def run(self, agent_name: str, task: str, *, parent_session: str) -> str:
        name = agent_name.strip().lower()
        if name not in DELEGATABLE_AGENTS:
            allowed = ", ".join(sorted(DELEGATABLE_AGENTS))
            raise ValueError(
                f"Unknown specialist {agent_name!r}; available: {allowed}"
            )
        task_text = (task or "").strip()
        if not task_text:
            raise ValueError("`task` must be non-empty")
        specialist = await self.get_specialist(name)
        session = specialist_session_id(parent_session or self.parent_session, name)
        result = await specialist.run(
            task_text,
            session=session,
            print_output=False,
        )
        if result.cancelled:
            raise RuntimeError(f"specialist {name} run was cancelled")
        from agent.turn import extract_turn_output

        output = extract_turn_output(result.state)
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


def make_invoke_agent_tool(runner: SpecialistRunner) -> BaseTool:
    """Build the subagent delegation tool bound to ``runner``."""

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
                        _ok_tool_message(
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
                    _ok_tool_message(
                        tool_call_id,
                        f"Specialist `{agent_name}` finished.\n\n{output}",
                    ),
                ],
            }
        )

    return invoke_agent
