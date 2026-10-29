"""Stage-scoped tools for the Plan agent graph."""

from __future__ import annotations

import asyncio
import re
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from typing import Any

from langchain_core.callbacks import adispatch_custom_event
from langchain_core.messages import ToolMessage
from langchain_core.tools import BaseTool, tool
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command

from agent.plan._constants import STAGE_ADJUST, STAGE_EXECUTE
from agent.plan.ui_state import PLAN_STATE_KEYS
from agent.plan.nested_hitl import run_specialist_bubbling_interrupts
from agent.plan.prompt import DELEGATABLE_AGENTS
from agent.session import specialist_session_id
from agent.turn import is_graph_interrupt
from tools.common import bind_tool_to_agent
from tools.plan import (
    Plan,
    PlanToolError,
    StepStatus,
    get_plan,
    mark_step_status,
    run_planning,
    snapshot_for,
)


def _ok_tool_message(tool_call_id: str, text: str) -> ToolMessage:
    return ToolMessage(content=text, tool_call_id=tool_call_id)


async def _publish_plan_progress(
    state: Any,
    snapshot: dict[str, Any] | None,
    **overlay: Any,
) -> None:
    """Push the task tree to the AG-UI stream while a specialist is running.

    A ``Command`` returned from this tool is applied to the subgraph
    checkpoint, but the stream also snapshots the parent checkpoint, which
    still has the status from when the round started. ``manually_emit_state``
    delivers this snapshot immediately. Later parent snapshots are overlaid
    with the same in-memory plan, so the tree does not jump backwards.
    """
    if not snapshot:
        return
    payload: dict[str, Any] = {}
    if isinstance(state, dict):
        for key in PLAN_STATE_KEYS:
            if key in state:
                payload[key] = state[key]
    payload["plan_snapshot"] = snapshot
    payload.update(overlay)
    try:
        await adispatch_custom_event("manually_emit_state", payload)
    except RuntimeError:
        # No parent run (unit tests, or a call outside a streamed graph).
        return


_STEP_OWNER_RE = re.compile(r"^\[([a-z_]+)\]\s*", re.IGNORECASE)


def _step_owner(text: str) -> str:
    """Owner agent of a plan step (``[databot] …`` → ``databot``)."""
    match = _STEP_OWNER_RE.match((text or "").strip())
    return match.group(1).lower() if match else ""


def _target_step_index(plan: Plan, agent_name: str) -> int | None:
    """Pick the plan step a delegation belongs to.

    Preference order: a step owned by ``agent_name`` that has not finished
    yet (claimed or not), then any step that has not started. Returns
    ``None`` when the plan has no candidate left.
    """
    open_statuses = (StepStatus.NOT_STARTED, StepStatus.IN_PROGRESS)
    candidates = [
        i
        for i, status in enumerate(plan.step_statuses)
        if status in open_statuses
    ]
    for i in candidates:
        if _step_owner(plan.steps[i]) == agent_name:
            return i
    for i in candidates:
        if plan.step_statuses[i] is StepStatus.NOT_STARTED:
            return i
    return None


def _step_note(output: str) -> str:
    """Short human-readable note for a completed step."""
    text = (output or "").strip()
    if not text:
        return "completed"
    first_line = text.splitlines()[0].strip()
    if len(first_line) > 160:
        first_line = first_line[:157].rstrip() + "…"
    return first_line


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
            "plan_snapshot": snapshot_for(key),
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
    if cmd in {"create", "update", "mark_step", "delete"}:
        update["plan_snapshot"] = snapshot_for(plan_id or active_plan_id)
    if stage == STAGE_ADJUST and cmd in {"update", "mark_step"}:
        update["adjust_had_tool_calls"] = True
        update["stage"] = STAGE_EXECUTE
    return Command(update=update)


@dataclass
class SpecialistRunner:
    """Run registered specialists from the invoke_agent tool."""

    get_specialist: Callable[[str], Awaitable[Any]]
    parent_session: str = ""

    async def run(
        self,
        agent_name: str,
        task: str,
        *,
        parent_session: str,
        bubble_to_parent: bool = True,
    ) -> str:
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
        if bubble_to_parent:
            try:
                graph = specialist.graph
            except (AttributeError, RuntimeError):
                graph = None
            if graph is not None:
                output = await run_specialist_bubbling_interrupts(
                    specialist, task_text, session
                )
                return output or "(specialist returned no text output)"
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
        Parent-graph ``interrupt()`` is skipped: it is not valid off the
        Plan tool's execution context.
        """

        def _work() -> str:
            return asyncio.run(
                self.run(
                    agent_name,
                    task,
                    parent_session=parent_session,
                    bubble_to_parent=False,
                )
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
        if not session:
            from agent.session import config_thread_id

            session = config_thread_id()

        # Claim the plan step this delegation belongs to. The plan's step
        # statuses are the source of truth for the task tree in the UI, and
        # they must not depend on the model remembering to call
        # ``planning(mark_step)`` — so the execution path owns them.
        plan_id = ""
        if isinstance(full_state, dict):
            plan_id = str(full_state.get("plan_id") or "").strip()
        claimed_index: int | None = None
        plan = get_plan(plan_id)
        if plan is not None:
            claimed_index = _target_step_index(plan, agent_name.strip().lower())
            if claimed_index is not None:
                started = mark_step_status(
                    plan_id, claimed_index, StepStatus.IN_PROGRESS
                )
                await _publish_plan_progress(
                    full_state, started, stage=STAGE_EXECUTE
                )

        try:
            output = await runner.run(
                agent_name,
                task,
                parent_session=session,
            )
        except Exception as exc:
            if is_graph_interrupt(exc):
                # A human gate interrupts the delegation: the step stays
                # claimed so the UI shows it as in progress while the human
                # decides.
                raise
            update: dict[str, Any] = {
                "messages": [
                    _ok_tool_message(
                        tool_call_id,
                        f"invoke_agent failed for {agent_name}: {exc}",
                    ),
                ],
            }
            blocked = mark_step_status(
                plan_id, claimed_index, StepStatus.BLOCKED, str(exc)[:160]
            ) if claimed_index is not None else None
            if blocked is not None:
                update["plan_snapshot"] = blocked
                await _publish_plan_progress(full_state, blocked, stage=STAGE_EXECUTE)
            return Command(update=update)
        prev: list[dict[str, Any]] = []
        if isinstance(full_state, dict):
            prev = list(full_state.get("step_results") or [])
        entry = {
            "agent": agent_name.strip().lower(),
            "task": task.strip(),
            "output": output,
        }
        update = {
            "stage": STAGE_EXECUTE,
            "step_results": prev + [entry],
            "messages": [
                _ok_tool_message(
                    tool_call_id,
                    f"Specialist `{agent_name}` finished.\n\n{output}",
                ),
            ],
        }
        completed = mark_step_status(
            plan_id, claimed_index, StepStatus.COMPLETED, _step_note(output)
        ) if claimed_index is not None else None
        if completed is not None:
            update["plan_snapshot"] = completed
            await _publish_plan_progress(
                full_state,
                completed,
                stage=STAGE_EXECUTE,
                step_results=update["step_results"],
            )
        return Command(update=update)

    return invoke_agent
