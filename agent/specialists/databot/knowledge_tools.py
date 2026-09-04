"""Tools for the knowledge follow-up ReAct subgraph."""

from __future__ import annotations

from typing import Any

from langchain_core.messages import ToolMessage
from langchain_core.tools import BaseTool, tool
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command

from agent.plan.stage_tools import SpecialistRunner


def _ok_tool_message(tool_call_id: str, text: str) -> ToolMessage:
    return ToolMessage(content=text, tool_call_id=tool_call_id)


def make_invoke_knowledge_tool(runner: SpecialistRunner) -> BaseTool:
    """Build a tool that delegates one clarification task to the Knowledge agent."""

    @tool
    async def invoke_knowledge(
        task: str,
        runtime: ToolRuntime = None,  # type: ignore[assignment]
    ) -> Command:
        """Ask the Knowledge specialist to clarify definitions, docs, or catalog context.

        ``task`` must be self-contained: include the user's question and any field or
        metric names from the conversation.
        """
        tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
        full_state = runtime.state if runtime is not None else {}
        session = ""
        if isinstance(full_state, dict):
            session = str(full_state.get("session_name") or "").strip()
        try:
            output = await runner.run_isolated(
                "knowledge",
                task,
                parent_session=session,
            )
        except Exception as exc:
            return Command(
                update={
                    "messages": [
                        _ok_tool_message(
                            tool_call_id,
                            f"invoke_knowledge failed: {exc}",
                        ),
                    ],
                }
            )
        return Command(
            update={
                "messages": [
                    _ok_tool_message(
                        tool_call_id,
                        f"Knowledge specialist finished.\n\n{output}",
                    ),
                ],
            }
        )

    return invoke_knowledge
