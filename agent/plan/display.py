"""User-facing status text for the Plan agent CLI / UI hooks."""

from __future__ import annotations

INVOKE_AGENT_TOOL_NAME = "invoke_agent"

_MAX_TASK_PREVIEW_CHARS = 120


def format_plan_step_status(agent_name: str, task: str) -> str:
    """One-line status before delegating a plan step to a specialist."""
    agent = (agent_name or "").strip() or "specialist"
    text = " ".join((task or "").split())
    if len(text) > _MAX_TASK_PREVIEW_CHARS:
        text = text[: _MAX_TASK_PREVIEW_CHARS - 1].rstrip() + "…"
    if text:
        return f"Running {agent}: {text}"
    return f"Running {agent}"
