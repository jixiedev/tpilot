"""Plan-specific tool listener wrappers for subgraph ReAct loops."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from agent.listener import ReactAgentListener
from agent.plan.display import INVOKE_AGENT_TOOL_NAME, format_plan_step_status


def make_plan_tool_call_listener(
    listener: ReactAgentListener,
) -> Callable[[str, dict[str, Any]], None]:
    """Emit a short user-facing status before ``invoke_agent`` runs a plan step."""

    def on_tool_call(name: str, args: dict[str, Any]) -> None:
        if name == INVOKE_AGENT_TOOL_NAME:
            listener.on_status(
                format_plan_step_status(
                    str(args.get("agent_name") or ""),
                    str(args.get("task") or ""),
                )
            )
            return
        listener.on_tool_call(name, args)

    return on_tool_call


def make_plan_tool_result_listener(
    listener: ReactAgentListener,
) -> Callable[[str, Any], None]:
    """Forward tool results; suppress verbose specialist dumps for ``invoke_agent``."""

    def on_tool_result(name: str, content: Any) -> None:
        if name == INVOKE_AGENT_TOOL_NAME:
            return
        listener.on_tool_result(name, content)

    return on_tool_result
