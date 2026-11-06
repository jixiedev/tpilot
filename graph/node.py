from __future__ import annotations

from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, SystemMessage, ToolMessage
from langgraph.prebuilt import ToolNode
from langgraph.types import Command

from agent.listener import ListenerHub

from graph.error_recovery import (
    invoke_with_transient_retry,
    make_async_retrying_tool_wrapper,
    make_handle_tool_errors,
    make_retrying_tool_wrapper,
)
from graph.messages import sanitize_messages_for_strict_tool_providers
from graph.state import ReactAgentState, message_text
from tools.errors import StructuredToolError

DEFAULT_HANDLE_TOOL_ERRORS = make_handle_tool_errors()
DEFAULT_WRAP_TOOL_CALL = make_retrying_tool_wrapper()
DEFAULT_AWRAP_TOOL_CALL = make_async_retrying_tool_wrapper()


class StepActionNode(ToolNode):
    """Action step: run bound tools and increment ``tool_call_count``."""

    def __init__(
        self,
        tools,
        count_key: str = "tool_call_count",
        listener: ListenerHub | None = None,
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
        self.listener = listener

    def _emit_tool_calls(self, state: ReactAgentState) -> None:
        if self.listener is None:
            return
        messages = state.get("messages", [])
        if not messages:
            return
        last = messages[-1]
        tool_calls = getattr(last, "tool_calls", None) or []
        for call in tool_calls:
            self.listener.on_tool_call(call.get("name", "?"), call.get("args", {}))

    def _emit_tool_results(self, result: dict[str, Any]) -> None:
        if self.listener is None:
            return
        for message in result.get("messages") or []:
            if not isinstance(message, ToolMessage):
                continue
            self.listener.on_tool_result(message.name or "?", message.content)

    @classmethod
    def _collect_failed_tools(cls, state: ReactAgentState, result: Any) -> list[str]:
        """Accumulate failures this turn; drop a tool name again after a successful call."""
        failed = list(state.get("failed_tools") or [])
        for message in cls._result_messages(result):
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

    @staticmethod
    def _result_messages(result: Any) -> list[Any]:
        """Tool messages of a ToolNode result: a dict, or a list mixing dicts and Commands."""
        if isinstance(result, dict):
            return list(result.get("messages") or [])
        messages: list[Any] = []
        for item in result if isinstance(result, list) else ():
            update = item.update if isinstance(item, Command) else item
            if isinstance(update, dict):
                messages.extend(update.get("messages") or [])
        return messages

    def _counter_update(self, state: ReactAgentState, result: Any) -> dict[str, Any]:
        return {
            self.count_key: state.get(self.count_key, 0) + 1,
            "idle_reason_rounds": 0,
            "failed_tools": self._collect_failed_tools(state, result),
        }

    def _apply_counter(self, state: ReactAgentState, result: Any) -> Any:
        """Count one action batch, also when tools return ``Command`` updates.

        ToolNode returns a dict for plain tool results and a list (Commands plus
        message dicts) once any tool returns a ``Command``; the counter update is
        merged into the dict or appended to the list.
        """
        if isinstance(result, dict):
            result.update(self._counter_update(state, result))
            return result
        if isinstance(result, list):
            return [*result, self._counter_update(state, result)]
        return result

    def invoke(self, state: ReactAgentState, config=None, **kwargs) -> Any:
        self._emit_tool_calls(state)
        result = super().invoke(state, config, **kwargs)
        if isinstance(result, dict):
            self._emit_tool_results(result)
        return self._apply_counter(state, result)

    async def ainvoke(self, state: ReactAgentState, config=None, **kwargs) -> Any:
        self._emit_tool_calls(state)
        result = await super().ainvoke(state, config, **kwargs)
        if isinstance(result, dict):
            self._emit_tool_results(result)
        return self._apply_counter(state, result)


BUDGET_EXHAUSTED_FALLBACK_REPLY = (
    "I reached the tool-call limit for this turn before I could finish. "
    "Ask me to continue, or narrow the request."
)


def make_step_reason_node(
    model: BaseChatModel,
    next_step_prompt: str,
    idle_nudge_prompt: str = "",
    tool_budget_exhausted_prompt: str = "",
    max_tool_calls: int = 10,
    listener: ListenerHub | None = None,
    *,
    final_model: BaseChatModel | None = None,
):
    """Build the ReAct ``step_reason`` node: one model call, then update idle state.

    Ephemeral system prompts (not written back to checkpoint history):
    - Always append ``next_step_prompt`` (per-step tool guidance).
    - If ``tool_call_count >= max_tool_calls``, append ``tool_budget_exhausted_prompt``.
    - Else if ``idle_reason_rounds > 0``, append ``idle_nudge_prompt``.

    ``model`` is the tool-bound model. Once the budget is reached the node calls
    ``final_model`` (the same model without tools) instead, and drops any tool
    calls the reply still carries, so the step always ends on a text answer
    rather than on tool calls that will never run. When ``final_model`` is not
    given, ``model`` is used and only the tool-call stripping applies.

    ``listener`` receives reason-start and reason-step hooks when set.

    After the model responds, append the
    AI message to history. Reset ``idle_reason_rounds`` when there are tool calls;
    otherwise increment it. Downstream ``route_after_reason`` uses tool calls,
    idle rounds, and budget to choose ``step_action``, another ``step_reason``, or end.
    """

    def step_reason(state: ReactAgentState) -> dict[str, Any]:
        # Local copy only: ephemeral SystemMessages below are not returned in the
        # update, so they never enter checkpoint / session history.
        messages = list(state["messages"])
        messages.append(SystemMessage(content=next_step_prompt))

        # Prefer budget guidance over idle nudge when both could apply.
        budget_exhausted = state.get("tool_call_count", 0) >= max_tool_calls
        if budget_exhausted:
            messages.append(SystemMessage(content=tool_budget_exhausted_prompt))
        elif state.get("idle_reason_rounds", 0) > 0:
            messages.append(SystemMessage(content=idle_nudge_prompt))

        messages = sanitize_messages_for_strict_tool_providers(messages)

        if listener is not None:
            listener.on_reason_start(
                state.get("tool_call_count", 0),
                max_tool_calls,
                state.get("idle_reason_rounds", 0),
            )

        call_model = (final_model or model) if budget_exhausted else model
        response = invoke_with_transient_retry(lambda: call_model.invoke(messages))
        if budget_exhausted:
            response = _final_text_reply(response)
        if listener is not None and isinstance(response, AIMessage):
            listener.on_reason_step(response)

        # MessagesState.add_messages appends `response`; it does not replace history.
        update: dict[str, Any] = {}
        if isinstance(response, AIMessage):
            update["messages"] = [response]
        tool_calls = getattr(response, "tool_calls", None) or []
        if tool_calls:
            update["idle_reason_rounds"] = 0
        else:
            # Plain text: count as an idle round for route_after_reason / nudge logic.
            update["idle_reason_rounds"] = state.get("idle_reason_rounds", 0) + 1
        return update

    return step_reason


def _final_text_reply(response: Any) -> AIMessage:
    """Turn a budget-exhausted reply into a plain-text AI message without tool calls."""
    if isinstance(response, AIMessage) and not response.tool_calls:
        if message_text(response.content):
            return response
    content = getattr(response, "content", response)
    text = message_text(content)
    return AIMessage(content=text or BUDGET_EXHAUSTED_FALLBACK_REPLY)
