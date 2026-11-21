"""Lead tools: ``delegate`` (run a specialist) and ``write_plan`` (replace the turn plan)."""

from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from typing import Any

from langchain_core.messages import AIMessage, ToolMessage
from langchain_core.tools import BaseTool, tool
from langgraph.errors import GraphBubbleUp
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command
from pydantic import BaseModel, Field

from tahoepilot.agent.lead.state import mark_step, normalize_steps, render_plan
from tahoepilot.agent.subagent import SubagentResult, SubagentTask

logger = logging.getLogger(__name__)

DELEGATE_TOOL_NAME = "delegate"
WRITE_PLAN_TOOL_NAME = "write_plan"

GetSpecialist = Callable[[str], Awaitable[Any]]


def _reply(tool_call_id: str, text: str, *, name: str, **update: Any) -> Command:
    message = ToolMessage(content=text, tool_call_id=tool_call_id, name=name)
    return Command(update={"messages": [message], **update})


def _state(runtime: ToolRuntime | None) -> dict[str, Any]:
    state = runtime.state if runtime is not None else {}
    return state if isinstance(state, dict) else {}


def _batch_calls(state: dict[str, Any]) -> list[dict[str, Any]]:
    """Tool calls of the latest AI message (the batch this tool call belongs to)."""
    for message in reversed(list(state.get("messages") or [])):
        if isinstance(message, AIMessage):
            return list(message.tool_calls or [])
    return []


def _first_of(calls: list[dict[str, Any]], name: str, tool_call_id: str) -> bool:
    ids = [c.get("id") for c in calls if c.get("name") == name]
    return not ids or ids[0] == tool_call_id


def _delegate_batch_problem(state: dict[str, Any], tool_call_id: str) -> str:
    """Why this ``delegate`` call cannot run in its batch, or ``""``.

    Both rules come from one-write-per-step state: ``plan``, ``work_record`` and
    the nested specialist's checkpoint namespace each take one update per step.
    """
    calls = _batch_calls(state)
    if any(c.get("name") == WRITE_PLAN_TOOL_NAME for c in calls):
        return (
            "`write_plan` is in the same step. The plan is saved first; call "
            "`delegate` again in your next step."
        )
    if not _first_of(calls, DELEGATE_TOOL_NAME, tool_call_id):
        return (
            "Only one delegation runs per step. Call `delegate` again for this "
            "task after the current one returns."
        )
    return ""


def make_delegate_tool(
    get_specialist: GetSpecialist,
    *,
    agents: Callable[[], frozenset[str]],
    max_delegations: int,
) -> BaseTool:
    """Build ``delegate`` bound to the lead's specialist factory."""

    @tool(DELEGATE_TOOL_NAME)
    async def delegate(
        agent: str,
        task: str,
        context: str = "",
        step: int | None = None,
        runtime: ToolRuntime = None,  # type: ignore[assignment]
    ) -> Command:
        """Hand one task to a specialist agent and get its result back.

        ``agent``: a specialist name from the system prompt.
        ``task``: a standalone instruction — resolve "that", "same", relative
        dates and earlier clarifications; never add metrics or filters the
        user did not ask for.
        ``context``: only the earlier results this task needs (table names,
        SQL, definitions from the work record).
        ``step``: the plan step this runs (1-based), when a plan exists.
        """
        tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
        state = _state(runtime)
        name = (agent or "").strip().lower()
        allowed = agents()
        if name not in allowed:
            return _reply(
                tool_call_id,
                f"Unknown agent {agent!r}; choose one of: {', '.join(sorted(allowed))}",
                name=DELEGATE_TOOL_NAME,
            )
        if not (task or "").strip():
            return _reply(
                tool_call_id, "`task` must be a non-empty instruction.", name=DELEGATE_TOOL_NAME
            )
        problem = _delegate_batch_problem(state, tool_call_id)
        if problem:
            return _reply(tool_call_id, problem, name=DELEGATE_TOOL_NAME)
        used = int(state.get("turn_delegations") or 0)
        if used >= max_delegations:
            return _reply(
                tool_call_id,
                f"Delegation budget for this turn is used up ({max_delegations}). "
                "Answer with what you have and say what is left.",
                name=DELEGATE_TOOL_NAME,
            )

        subtask = SubagentTask(
            agent=name,
            task=task.strip(),
            context=context or "",
            user_question=str(state.get("user_question") or ""),
            session=str(state.get("session_name") or ""),
            user_id=str(state.get("user_id") or ""),
        )
        try:
            specialist = await get_specialist(name)
            result: SubagentResult = await specialist.run_as_subagent(subtask)
        except GraphBubbleUp:
            # Interrupts (human gates) must pause the lead's run, not end the step.
            raise
        except Exception as exc:  # noqa: BLE001 - reported to the lead as a failed step
            logger.exception("delegate to %s failed", name)
            result = SubagentResult(agent=name, status="failed", summary=f"{type(exc).__name__}: {exc}")

        plan, step_no = mark_step(
            state.get("plan") or [],
            step=step,
            agent=name,
            task=subtask.task,
            result_status=result.status,
        )
        entry = result.record_entry(subtask, step=step_no, turn=int(state.get("turn_index") or 0))
        update: dict[str, Any] = {
            "plan": plan,
            "work_record": [*(state.get("work_record") or []), entry],
            "turn_delegations": used + 1,
        }
        if result.ui_state:
            update["active_subagent"] = {"name": name, "state": result.ui_state}
        return _reply(tool_call_id, result.tool_text(), name=DELEGATE_TOOL_NAME, **update)

    return delegate


class PlanStepInput(BaseModel):
    """One plan step for ``write_plan``."""

    text: str = Field(description="Short actionable step")
    agent: str = Field(default="", description="Specialist that runs it, if any")
    status: str = Field(default="pending", description="pending, done, blocked, failed or skipped")


def make_write_plan_tool(*, agents: Callable[[], frozenset[str]]) -> BaseTool:
    """Build ``write_plan``: replaces the whole plan, so there is no create/update split."""

    @tool(WRITE_PLAN_TOOL_NAME)
    def write_plan(
        steps: list[PlanStepInput],
        runtime: ToolRuntime = None,  # type: ignore[assignment]
    ) -> Command:
        """Write or rewrite this turn's plan. Send the full list every time.

        Use it when a request needs several steps or specialists. Steps that
        already ran keep their status (``delegate`` sets it); rewrite pending
        steps when a result changes what should happen next.
        """
        tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
        if not _first_of(_batch_calls(_state(runtime)), WRITE_PLAN_TOOL_NAME, tool_call_id):
            return _reply(
                tool_call_id,
                "Plan not saved: only one `write_plan` per step; the first one was used.",
                name=WRITE_PLAN_TOOL_NAME,
            )
        raw = [s.model_dump() if isinstance(s, BaseModel) else dict(s) for s in steps or []]
        try:
            plan = normalize_steps(raw, known_agents=agents())
        except ValueError as exc:
            return _reply(tool_call_id, f"Plan not saved: {exc}", name=WRITE_PLAN_TOOL_NAME)
        return _reply(
            tool_call_id, f"Plan saved:\n{render_plan(plan)}", name=WRITE_PLAN_TOOL_NAME, plan=plan
        )

    return write_plan
