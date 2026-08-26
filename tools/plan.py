"""In-memory planning tool (Janus PlanTool)."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum

from langchain.tools import tool

from tools.errors import ToolErrorType, register_exception

DESCRIPTION = """\
Create and manage plans: create, update, list, get, mark_step, delete.
Steps are short actionable strings; use [agent_name] prefix when multiple agents exist.
plan_id is required for all commands except list.
"""


class PlanToolError(ValueError):
    """Raised when a planning command cannot be applied."""


register_exception(PlanToolError, error_type=ToolErrorType.UNKNOWN, retryable=False)


class StepStatus(Enum):
    NOT_STARTED = ("not_started", "[ ]", True)
    IN_PROGRESS = ("in_progress", "[→]", True)
    COMPLETED = ("completed", "[✓]", False)
    BLOCKED = ("blocked", "[!]", False)

    def __init__(self, status_id: str, symbol: str, active: bool) -> None:
        self.status_id = status_id
        self.symbol = symbol
        self.active = active

    @classmethod
    def from_id(cls, status_id: str | None) -> StepStatus | None:
        if not status_id or not status_id.strip():
            return None
        needle = status_id.strip().lower()
        for status in cls:
            if status.status_id == needle:
                return status
        return None


def parse_steps(steps: list[str] | None) -> list[str]:
    if not steps:
        return []
    if len(steps) == 1 and "," in steps[0]:
        return [part.strip() for part in steps[0].split(",") if part.strip()]
    return [step.strip() for step in steps if step and step.strip()]


@dataclass
class Plan:
    plan_id: str
    title: str
    steps: list[str]
    step_statuses: list[StepStatus] = field(init=False)
    step_notes: list[str] = field(init=False)

    def __post_init__(self) -> None:
        count = len(self.steps)
        self.step_statuses = [StepStatus.NOT_STARTED] * count
        self.step_notes = [""] * count

    def step_count(self) -> int:
        return len(self.steps)

    def completed_step_count(self) -> int:
        return sum(1 for status in self.step_statuses if status is StepStatus.COMPLETED)

    def set_title(self, title: str) -> None:
        self.title = title

    def update_steps(self, new_steps: list[str]) -> None:
        old_statuses = self.step_statuses
        old_notes = self.step_notes
        old_steps = self.steps
        new_statuses: list[StepStatus] = []
        new_notes: list[str] = []
        for i, step in enumerate(new_steps):
            if i < len(old_steps) and step == old_steps[i]:
                new_statuses.append(old_statuses[i])
                new_notes.append(old_notes[i])
            else:
                new_statuses.append(StepStatus.NOT_STARTED)
                new_notes.append("")
        self.steps = list(new_steps)
        self.step_statuses = new_statuses
        self.step_notes = new_notes

    def mark_step(
        self,
        step_index: int,
        status: StepStatus | None,
        notes: str | None,
    ) -> None:
        if status is not None:
            self.step_statuses[step_index] = status
        if notes is not None:
            self.step_notes[step_index] = notes

    def format(self) -> str:
        header = f"Plan: {self.title} (ID: {self.plan_id})"
        lines = [header, "=" * len(header), ""]
        total = self.step_count()
        completed = self.completed_step_count()
        in_progress = sum(1 for s in self.step_statuses if s is StepStatus.IN_PROGRESS)
        blocked = sum(1 for s in self.step_statuses if s is StepStatus.BLOCKED)
        not_started = sum(1 for s in self.step_statuses if s is StepStatus.NOT_STARTED)
        pct = (completed * 100.0 / total) if total else 0.0
        lines.append(f"Progress: {completed}/{total} steps completed ({pct:.1f}%)")
        lines.append(
            f"Status: {completed} completed, {in_progress} in progress, "
            f"{blocked} blocked, {not_started} not started"
        )
        lines.append("")
        lines.append("Steps:")
        for i, step in enumerate(self.steps):
            status = self.step_statuses[i]
            lines.append(f"{i}. {status.symbol} {step}")
            notes = self.step_notes[i]
            if notes:
                lines.append(f"   Notes: {notes}")
        return "\n".join(lines)


_plans: dict[str, Plan] = {}


def clear_plans() -> None:
    _plans.clear()


def _reply(headline: str, plan: Plan) -> str:
    return f"{headline}\n\n{plan.format()}"


def _require_id(plan_id: str | None, command: str) -> str:
    if not plan_id or not plan_id.strip():
        raise PlanToolError(f"`plan_id` required for {command}")
    return plan_id.strip()


def _require_plan(plan_id: str | None, command: str) -> Plan:
    key = _require_id(plan_id, command)
    plan = _plans.get(key)
    if plan is None:
        raise PlanToolError(f"No plan: {plan_id}")
    return plan


def _require_title(title: str | None, command: str) -> str:
    if not title or not title.strip():
        raise PlanToolError(f"`title` required for {command}")
    return title.strip()


def _require_steps(steps: list[str] | None, command: str) -> list[str]:
    parsed = parse_steps(steps)
    if not parsed:
        raise PlanToolError(f"`steps` must be non-empty for {command}")
    return parsed


def run_planning(
    command: str,
    plan_id: str | None = None,
    title: str | None = None,
    steps: list[str] | None = None,
    step_index: int | None = None,
    step_status: str | None = None,
    step_notes: str | None = None,
) -> str:
    name = (command or "").strip().lower()
    if name == "create":
        key = _require_id(plan_id, "create")
        if key in _plans:
            raise PlanToolError(f"Plan '{key}' already exists; use update.")
        plan = Plan(key, _require_title(title, "create"), _require_steps(steps, "create"))
        _plans[key] = plan
        return _reply(f"Plan created (id={plan.plan_id}).", plan)
    if name == "update":
        plan = _require_plan(plan_id, "update")
        if title and title.strip():
            plan.set_title(title)
        if steps:
            plan.update_steps(_require_steps(steps, "update"))
        return _reply("Plan updated.", plan)
    if name == "list":
        if not _plans:
            return "No plans. Use command=create."
        lines = ["Plans:"]
        for key, plan in _plans.items():
            lines.append(
                f"• {key}: {plan.title} ({plan.completed_step_count()}/{plan.step_count()} done)"
            )
        return "\n".join(lines) + "\n"
    if name == "get":
        return _require_plan(plan_id, "get").format()
    if name == "mark_step":
        plan = _require_plan(plan_id, "mark_step")
        if step_index is None:
            raise PlanToolError("`step_index` is required for mark_step")
        if step_index < 0 or step_index >= plan.step_count():
            raise PlanToolError(
                f"Invalid step_index {step_index} (valid: 0..{plan.step_count() - 1})"
            )
        status = None
        if step_status and step_status.strip():
            status = StepStatus.from_id(step_status)
            if status is None:
                raise PlanToolError(f"Invalid step_status: {step_status}")
        plan.mark_step(step_index, status, step_notes)
        return _reply(f"Step {step_index} updated.", plan)
    if name == "delete":
        key = _require_id(plan_id, "delete")
        if _plans.pop(key, None) is None:
            raise PlanToolError(f"No plan: {plan_id}")
        return f"Plan '{key}' deleted."
    raise PlanToolError(f"Unknown command: {command}")


@tool(description=DESCRIPTION)
def planning(
    command: str,
    plan_id: str | None = None,
    title: str | None = None,
    steps: list[str] | None = None,
    step_index: int | None = None,
    step_status: str | None = None,
    step_notes: str | None = None,
) -> str:
    """Create and manage in-memory plans.

    ``command`` is one of: create, update, list, get, mark_step, delete.
    """
    return run_planning(
        command,
        plan_id=plan_id,
        title=title,
        steps=steps,
        step_index=step_index,
        step_status=step_status,
        step_notes=step_notes,
    )


TOOLS = [planning]
