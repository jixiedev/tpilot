"""Subagent contract: how the lead agent hands a task to a specialist and reads the result.

A specialist runs as a *nested* graph inside the lead's ``delegate`` tool call.
LangGraph then gives it a checkpoint namespace under the lead's thread
(``step_action:<task id>``), so:

- an ``interrupt(...)`` inside the specialist (databot's human gates) pauses the
  lead's run with the specialist's payload, for the CLI and AG-UI alike;
- ``Command(resume=...)`` on the lead's thread resumes the specialist at the
  paused node; nodes that already finished are not run again.

Each delegation starts the specialist from a fresh state. The lead's written
brief (:meth:`SubagentTask.prompt`) carries whatever earlier context the task
needs; specialists never read each other's histories.
"""

from __future__ import annotations

import json
from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import Any, Literal

from langchain_core.runnables import RunnableConfig

SubagentStatus = Literal["done", "halted", "failed"]

#: Plan step statuses. ``delegate`` sets done / blocked / failed; the turn end
#: marks steps still pending as skipped.
STEP_PENDING = "pending"
STEP_DONE = "done"
STEP_BLOCKED = "blocked"
STEP_FAILED = "failed"
STEP_SKIPPED = "skipped"

STATUS_TO_STEP: dict[str, str] = {
    "done": STEP_DONE,
    "halted": STEP_BLOCKED,
    "failed": STEP_FAILED,
}

_MAX_SUMMARY_CHARS = 4000


@dataclass(frozen=True)
class SubagentTask:
    """One delegation: the brief the lead wrote plus the user's own words."""

    agent: str
    task: str
    context: str = ""
    user_question: str = ""
    session: str = ""
    user_id: str = ""

    def prompt(self) -> str:
        """The specialist's human message: standalone, so no earlier turns are needed."""
        task = self.task.strip()
        parts: list[str] = []
        question = self.user_question.strip()
        if question and question != task:
            parts.append(f"The user asked:\n{question}")
        parts.append(f"Your task:\n{task}")
        context = self.context.strip()
        if context:
            parts.append(f"Context from earlier work in this conversation:\n{context}")
        return "\n\n".join(parts)

    def child_session(self) -> str:
        """``session_name`` inside the specialist (offload paths, logging)."""
        return f"{self.session}:agent:{self.agent}" if self.session else f"agent:{self.agent}"


@dataclass
class SubagentResult:
    """What a specialist hands back: a short summary plus structured artifacts."""

    agent: str
    status: SubagentStatus
    summary: str
    artifacts: dict[str, Any] = field(default_factory=dict)
    #: UI view of the specialist's final state (databot: the artifact-panel fields).
    ui_state: dict[str, Any] = field(default_factory=dict)

    def tool_text(self) -> str:
        """ToolMessage content the lead reads."""
        payload: dict[str, Any] = {
            "agent": self.agent,
            "status": self.status,
            "summary": self.summary[:_MAX_SUMMARY_CHARS],
        }
        if self.artifacts:
            payload["artifacts"] = self.artifacts
        return json.dumps(payload, ensure_ascii=False, default=str)

    def record_entry(self, task: SubagentTask, *, step: int | None, turn: int) -> dict[str, Any]:
        """One work-record row (kept across turns in the lead's state)."""
        return {
            "agent": self.agent,
            "task": task.task,
            "status": self.status,
            "summary": self.summary[:_MAX_SUMMARY_CHARS],
            "artifacts": dict(self.artifacts),
            "step": step,
            "turn": turn,
        }


def leading_rows(rows: Any, *, max_rows: int = 20, max_chars: int = 4000) -> list[Any]:
    """The first result rows, bounded by count and JSON size.

    Data specialists put these in ``artifacts`` so the lead can answer from the
    values; without them a weak summary left the lead nothing to answer from.
    """
    if not isinstance(rows, list):
        return []
    kept: list[Any] = []
    used = 0
    for row in rows[:max_rows]:
        size = len(json.dumps(row, ensure_ascii=False, default=str))
        if kept and used + size > max_chars:
            break
        kept.append(row)
        used += size
    return kept


def nested_run_config() -> RunnableConfig | None:
    """The enclosing graph's config when called from inside a node or tool, else ``None``."""
    from langgraph.config import get_config

    try:
        return get_config()
    except RuntimeError:
        return None


def standalone_config(task: SubagentTask) -> RunnableConfig:
    """Config for running a specialist outside any parent graph (tests, scripts)."""
    import uuid

    return {"configurable": {"thread_id": f"{task.child_session()}:{uuid.uuid4().hex[:8]}"}}


def compact_work_record(
    record: list[Mapping[str, Any]],
    *,
    keep: int = 20,
    keep_full: int = 5,
    short_chars: int = 240,
) -> list[dict[str, Any]]:
    """Bound the work record: last ``keep`` rows, artifacts only on the newest ``keep_full``."""
    rows = [dict(row) for row in record if isinstance(row, Mapping)][-keep:]
    cutoff = len(rows) - keep_full
    for index, row in enumerate(rows):
        if index >= cutoff:
            continue
        row["artifacts"] = {}
        summary = str(row.get("summary") or "")
        if len(summary) > short_chars:
            row["summary"] = summary[: short_chars - 1].rstrip() + "…"
    return rows
