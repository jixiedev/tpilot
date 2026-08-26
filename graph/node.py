from __future__ import annotations

from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, SystemMessage, ToolMessage
from langgraph.prebuilt import ToolNode

from graph.error_recovery import (
    invoke_with_transient_retry,
    make_async_retrying_tool_wrapper,
    make_handle_tool_errors,
    make_retrying_tool_wrapper,
)
from state.state import SessionAgentState
from tools.errors import StructuredToolError

ToolCallListener = Callable[[str, dict[str, Any]], None]
ToolResultListener = Callable[[str, Any], None]
LlmStepListener = Callable[[AIMessage], None]
# tool_call_count, max_tool_calls, idle_rounds — emitted before the model call.
LlmStartListener = Callable[[int, int, int], None]

DEFAULT_HANDLE_TOOL_ERRORS = make_handle_tool_errors()
DEFAULT_WRAP_TOOL_CALL = make_retrying_tool_wrapper()
DEFAULT_AWRAP_TOOL_CALL = make_async_retrying_tool_wrapper()


class StepToolsNode(ToolNode):
    """ToolNode that increments ``tool_call_count`` after each execution batch."""

    def __init__(
        self,
        tools,
        count_key: str = "tool_call_count",
        on_tool_call: ToolCallListener | None = None,
        on_tool_result: ToolResultListener | None = None,
        *,
        handle_tool_errors=DEFAULT_HANDLE_TOOL_ERRORS,
        wrap_tool_call=DEFAULT_WRAP_TOOL_CALL,
        awrap_tool_call=DEFAULT_AWRAP_TOOL_CALL,
        **kwargs,
    ):
        super().__init__(
            tools,
            handle_tool_errors=handle_tool_errors,
            wrap_tool_call=wrap_tool_call,
            awrap_tool_call=awrap_tool_call,
            **kwargs,
        )
        self.count_key = count_key
        self.on_tool_call = on_tool_call
        self.on_tool_result = on_tool_result

    def _emit_tool_calls(self, state: SessionAgentState) -> None:
        if not self.on_tool_call:
            return
        messages = state.get("messages", [])
        if not messages:
            return
        last = messages[-1]
        tool_calls = getattr(last, "tool_calls", None) or []
        for call in tool_calls:
            self.on_tool_call(call.get("name", "?"), call.get("args", {}))

    def _emit_tool_results(self, result: dict[str, Any]) -> None:
        if not self.on_tool_result:
            return
        for message in result.get("messages") or []:
            if not isinstance(message, ToolMessage):
                continue
            self.on_tool_result(message.name or "?", message.content)

    @staticmethod
    def _collect_failed_tools(state: SessionAgentState, result: dict[str, Any]) -> list[str]:
        """Accumulate failures this turn; drop a tool name again after a successful call."""
        failed = list(state.get("failed_tools") or [])
        for message in result.get("messages") or []:
            if not isinstance(message, ToolMessage):
                continue
            name = message.name
            if getattr(message, "status", None) == "error":
                structured = StructuredToolError.from_message_content(str(message.content))
                name = (structured.tool if structured else None) or name
                if name and name not in failed:
                    failed.append(name)
                continue
            if name and name in failed:
                failed.remove(name)
        return failed

    def _apply_counter(self, state: SessionAgentState, result: dict[str, Any]) -> dict[str, Any]:
        result[self.count_key] = state.get(self.count_key, 0) + 1
        result["idle_rounds"] = 0
        result["failed_tools"] = self._collect_failed_tools(state, result)
        return result

    def invoke(self, state: SessionAgentState, config=None, **kwargs) -> dict[str, Any]:
        self._emit_tool_calls(state)
        result = super().invoke(state, config, **kwargs)
        if isinstance(result, dict):
            self._emit_tool_results(result)
            return self._apply_counter(state, result)
        return result

    async def ainvoke(self, state: SessionAgentState, config=None, **kwargs) -> dict[str, Any]:
        self._emit_tool_calls(state)
        result = await super().ainvoke(state, config, **kwargs)
        if isinstance(result, dict):
            self._emit_tool_results(result)
            return self._apply_counter(state, result)
        return result


def make_step_llm_node(
    model: BaseChatModel,
    next_step_prompt: str,
    idle_nudge_prompt: str = "",
    tool_budget_exhausted_prompt: str = "",
    max_tool_calls: int = 10,
    on_llm_start: LlmStartListener | None = None,
    on_llm_step: LlmStepListener | None = None,
):
    """Build the ReAct ``step_llm`` node: one model call, then update idle state.

    Ephemeral system prompts (not written back to checkpoint history):
    - Always append ``next_step_prompt`` when non-empty (per-step tool guidance).
    - If ``tool_call_count >= max_tool_calls``, append ``tool_budget_exhausted_prompt``.
    - Else if ``idle_rounds > 0``, append ``idle_nudge_prompt``.

    ``on_llm_start`` runs immediately before the model call so the CLI can show
    progress while waiting on the provider. After the model responds, append the
    AI message to history. Reset ``idle_rounds`` when there are tool calls;
    otherwise increment it. Downstream ``route_after_step`` uses tool calls,
    idle rounds, and budget to choose ``step_tools``, another ``step_llm``, or end.
    """

    def step_llm(state: SessionAgentState) -> dict[str, Any]:
        # Local copy only: ephemeral SystemMessages below are not returned in the
        # update, so they never enter checkpoint / session history.
        messages = list(state["messages"])
        if next_step_prompt.strip():
            messages.append(SystemMessage(content=next_step_prompt))

        # Prefer budget guidance over idle nudge when both could apply.
        if state.get("tool_call_count", 0) >= max_tool_calls and tool_budget_exhausted_prompt.strip():
            messages.append(SystemMessage(content=tool_budget_exhausted_prompt))
        elif state.get("idle_rounds", 0) > 0 and idle_nudge_prompt.strip():
            messages.append(SystemMessage(content=idle_nudge_prompt))

        if on_llm_start is not None:
            on_llm_start(
                state.get("tool_call_count", 0),
                max_tool_calls,
                state.get("idle_rounds", 0),
            )

        response = invoke_with_transient_retry(lambda: model.invoke(messages))
        if on_llm_step is not None and isinstance(response, AIMessage):
            on_llm_step(response)

        # MessagesState.add_messages appends `response`; it does not replace history.
        update: dict[str, Any] = {"messages": [response]}
        if response.tool_calls:
            update["idle_rounds"] = 0
        else:
            # Plain text: count as an idle round for route_after_step / nudge logic.
            update["idle_rounds"] = state.get("idle_rounds", 0) + 1
        return update

    return step_llm
