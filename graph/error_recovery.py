"""Tool and node error recovery for the ReAct graph."""

from __future__ import annotations

import asyncio
import logging
import time
from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

from langchain_core.messages import SystemMessage, ToolMessage
from langgraph.errors import NodeError
from langgraph.prebuilt.tool_node import ToolCallRequest
from langgraph.types import Command, RetryPolicy

from tools.errors import StructuredToolError, ToolErrorType, register_exception

logger = logging.getLogger(__name__)

DEFAULT_TOOL_RETRY_ATTEMPTS = 2
DEFAULT_TOOL_RETRY_BASE_DELAY = 0.5
DEFAULT_LLM_RETRY_ATTEMPTS = 2
DEFAULT_LLM_RETRY_BASE_DELAY = 0.5

_TOOL_RECOVERY_PROMPT = """\
A tool step failed after automatic retries. Review the latest TOOL ERROR JSON \
(`tool`, `hint`, optional `fallback_tool` as plan B) and either switch tools / fix \
arguments or write a clear explanation for the user with no further tool calls.
"""

T = TypeVar("T")


def _register_langgraph_tool_invocation_errors() -> None:
    """Arg-validation failures from ToolNode are never transient timeouts."""
    try:
        from langgraph.prebuilt.tool_node import ToolInvocationError
    except ImportError:
        return
    register_exception(
        ToolInvocationError,
        error_type=ToolErrorType.SYNTAX,
        retryable=False,
    )


_register_langgraph_tool_invocation_errors()


def _is_graph_interrupt(exc: BaseException) -> bool:
    """True when ``exc`` is LangGraph control-flow, not a tool failure."""
    names = {type(exc).__name__, *(base.__name__ for base in type(exc).__mro__)}
    return bool(names & {"GraphInterrupt", "GraphBubbleUp", "NodeInterrupt"})


def make_handle_tool_errors(
    *,
    tool_name_resolver: Callable[[Exception], str] | None = None,
) -> Callable[[Exception], str]:
    """Build a ToolNode error formatter that returns structured TOOL ERROR content."""

    def handle_tool_errors(exc: Exception) -> str:
        if _is_graph_interrupt(exc):
            raise exc
        tool_name = "unknown"
        if tool_name_resolver is not None:
            tool_name = tool_name_resolver(exc)
        structured = StructuredToolError.from_exception(tool_name, exc)
        logger.warning(
            "tool error type=%s tool=%s retryable=%s",
            structured.error_type,
            structured.tool,
            structured.retryable,
        )
        return structured.to_message_content()

    return handle_tool_errors


def _failed_tools_from_state(state: Any) -> list[str]:
    if isinstance(state, dict):
        return list(state.get("failed_tools") or [])
    return list(getattr(state, "failed_tools", None) or [])


def _enrich_tool_error_message(
    request: ToolCallRequest,
    result: ToolMessage,
    tool_name: str,
) -> tuple[ToolMessage, StructuredToolError | None]:
    structured = StructuredToolError.from_message_content(str(result.content))
    if structured is None:
        return result, None

    structured = structured.with_failed_tool(tool_name).against_prior_failures(
        _failed_tools_from_state(request.state)
    )
    enriched = ToolMessage(
        content=structured.to_message_content(),
        name=result.name or tool_name,
        tool_call_id=result.tool_call_id,
        status="error",
    )
    return enriched, structured


def make_retrying_tool_wrapper(
    *,
    max_attempts: int = DEFAULT_TOOL_RETRY_ATTEMPTS,
    base_delay: float = DEFAULT_TOOL_RETRY_BASE_DELAY,
) -> Callable[
    [ToolCallRequest, Callable[[ToolCallRequest], ToolMessage | Any]],
    ToolMessage | Any,
]:
    """Retry transient tool failures before returning an error ToolMessage."""

    def retrying_tool_wrapper(
        request: ToolCallRequest,
        execute: Callable[[ToolCallRequest], ToolMessage | Any],
    ) -> ToolMessage | Any:
        tool_name = request.tool_call.get("name", "unknown")
        for attempt in range(max_attempts):
            result = execute(request)
            if not isinstance(result, ToolMessage) or result.status != "error":
                return result

            result, structured = _enrich_tool_error_message(request, result, tool_name)
            if structured is None or not structured.is_transient:
                return result

            if attempt >= max_attempts - 1:
                logger.warning(
                    "tool retries exhausted tool=%s type=%s attempts=%s",
                    tool_name,
                    structured.error_type,
                    max_attempts,
                )
                return result

            delay = base_delay * (attempt + 1)
            logger.info(
                "retrying transient tool error tool=%s type=%s attempt=%s delay=%s",
                tool_name,
                structured.error_type,
                attempt + 2,
                delay,
            )
            time.sleep(delay)

        return result

    return retrying_tool_wrapper


def make_async_retrying_tool_wrapper(
    *,
    max_attempts: int = DEFAULT_TOOL_RETRY_ATTEMPTS,
    base_delay: float = DEFAULT_TOOL_RETRY_BASE_DELAY,
) -> Callable[
    [ToolCallRequest, Callable[[ToolCallRequest], Awaitable[ToolMessage | Any]]],
    Awaitable[ToolMessage | Any],
]:
    """Async variant of ``make_retrying_tool_wrapper`` for ToolNode ``awrap_tool_call``."""

    async def async_retrying_tool_wrapper(
        request: ToolCallRequest,
        execute: Callable[[ToolCallRequest], Awaitable[ToolMessage | Any]],
    ) -> ToolMessage | Any:
        tool_name = request.tool_call.get("name", "unknown")
        for attempt in range(max_attempts):
            result = await execute(request)
            if not isinstance(result, ToolMessage) or result.status != "error":
                return result

            result, structured = _enrich_tool_error_message(request, result, tool_name)
            if structured is None or not structured.is_transient:
                return result

            if attempt >= max_attempts - 1:
                logger.warning(
                    "tool retries exhausted tool=%s type=%s attempts=%s",
                    tool_name,
                    structured.error_type,
                    max_attempts,
                )
                return result

            delay = base_delay * (attempt + 1)
            logger.info(
                "retrying transient tool error tool=%s type=%s attempt=%s delay=%s",
                tool_name,
                structured.error_type,
                attempt + 2,
                delay,
            )
            await asyncio.sleep(delay)

        return result

    return async_retrying_tool_wrapper


def transient_retry_on(exc: BaseException) -> bool:
    """Retry node execution only for infrastructure-level transient failures."""
    from tools.errors import resolve_exception

    _error_type, retryable, _message = resolve_exception(exc)
    return retryable

def transient_llm_retry_on(exc: BaseException) -> bool:
    """Whether an LLM / API failure is worth retrying."""
    if transient_retry_on(exc):
        return True

    status = getattr(exc, "status_code", None)
    if status in {408, 409, 429, 500, 502, 503, 504}:
        return True

    name = type(exc).__name__.lower()
    if any(
        token in name
        for token in (
            "timeout",
            "ratelimit",
            "rate_limit",
            "apiconnection",
            "apitimeout",
            "internalserver",
            "serviceunavailable",
            "connecterror",
            "readtimeout",
        )
    ):
        return True

    message = str(exc).lower()
    return any(
        token in message
        for token in (
            "rate limit",
            "timed out",
            "timeout",
            "connection reset",
            "connection refused",
            "temporarily unavailable",
            " 429",
            " 502",
            " 503",
            " 504",
        )
    )


def invoke_with_transient_retry(
    call: Callable[[], T],
    *,
    max_attempts: int = DEFAULT_LLM_RETRY_ATTEMPTS,
    base_delay: float = DEFAULT_LLM_RETRY_BASE_DELAY,
    is_transient: Callable[[BaseException], bool] = transient_llm_retry_on,
) -> T:
    """Call ``call``; retry transient failures with linear backoff."""
    last_error: BaseException | None = None
    for attempt in range(max_attempts):
        try:
            return call()
        except Exception as exc:
            last_error = exc
            if not is_transient(exc) or attempt >= max_attempts - 1:
                raise
            delay = base_delay * (attempt + 1)
            logger.warning(
                "transient LLM/API error; retrying attempt=%s/%s delay=%ss error=%s",
                attempt + 2,
                max_attempts,
                delay,
                exc,
            )
            time.sleep(delay)
    assert last_error is not None
    raise last_error


def default_tool_retry_policy() -> RetryPolicy:
    return RetryPolicy(max_attempts=2, initial_interval=0.5, retry_on=transient_retry_on)


def default_llm_retry_policy() -> RetryPolicy:
    return RetryPolicy(max_attempts=2, initial_interval=0.5, retry_on=transient_llm_retry_on)


def format_turn_failure(exc: BaseException) -> str:
    """User-facing one-line explanation when a graph turn fails."""
    name = type(exc).__name__
    message = str(exc).strip() or name
    short = message if len(message) <= 160 else message[:157] + "..."

    if transient_llm_retry_on(exc):
        status = getattr(exc, "status_code", None)
        lowered = f"{name} {message}".lower()
        if status == 429 or "rate limit" in lowered or "ratelimit" in name.lower():
            return (
                "The model API is rate-limited. Wait a moment and try again. "
                f"({name})"
            )
        if status in {408, 504} or "timeout" in lowered:
            return (
                "The model request timed out. Try again, or simplify the question. "
                f"({name})"
            )
        if status in {502, 503} or "unavailable" in lowered or "connection" in lowered:
            return (
                "Could not reach the model API. Check network and API settings, then retry. "
                f"({name})"
            )
        return f"A temporary API error occurred; please retry. ({name}: {short})"

    if "sqlite" in name.lower() or "checkpoint" in short.lower():
        return (
            "Session checkpoint storage failed. Check the checkpoint DB path and disk permissions. "
            f"({name}: {short})"
        )

    return f"Request failed ({name}: {short}). See logs for details."


def make_step_action_error_handler(
    *,
    recovery_prompt: str = _TOOL_RECOVERY_PROMPT,
    goto: str = "step_reason",
) -> Callable[[dict[str, Any], NodeError], Command]:
    """Recover when the action step fails after retries are exhausted."""

    def step_action_error_handler(state: dict[str, Any], error: NodeError) -> Command:
        logger.exception(
            "step_action node failed after retries node=%s",
            error.node,
            exc_info=error.error,
        )
        return Command(
            update={"messages": [SystemMessage(content=recovery_prompt)]},
            goto=goto,
        )

    return step_action_error_handler
