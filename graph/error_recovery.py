"""Tool and node error recovery for the ReAct graph."""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import replace
from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

from langchain_core.messages import AIMessage, ToolMessage
from langgraph.errors import NodeError
from langgraph.prebuilt.tool_node import ToolCallRequest
from langgraph.types import Command, RetryPolicy

from tools.errors import (
    StructuredToolError,
    ToolErrorType,
    is_transient_error,
    register_exception,
    resolve_exception,
)

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


def make_handle_tool_errors(
    *,
    tool_name_resolver: Callable[[Exception], str] | None = None,
) -> Callable[[Exception], str]:
    """Build a ToolNode error formatter that returns structured TOOL ERROR content."""

    def handle_tool_errors(exc: Exception) -> str:
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
    """Retry node execution only for infrastructure-level transient failures.

    Uses the same predicate as ``StructuredToolError.is_transient`` (the
    tool-call wrapper), so both retry layers agree on what is transient.
    """
    error_type, retryable, _message = resolve_exception(exc)
    return is_transient_error(error_type, retryable)


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


async def ainvoke_with_transient_retry(
    call: Callable[[], Awaitable[T]],
    *,
    max_attempts: int = DEFAULT_LLM_RETRY_ATTEMPTS,
    base_delay: float = DEFAULT_LLM_RETRY_BASE_DELAY,
    is_transient: Callable[[BaseException], bool] = transient_llm_retry_on,
) -> T:
    """Async ``invoke_with_transient_retry`` for code running on the event loop.

    Sync graph nodes run in executor threads under ``graph.ainvoke`` and can use
    the sync variant; code that runs on the loop itself (``async def`` nodes,
    post-turn hooks awaited by ``Agent.run``) should use this one.
    """
    for attempt in range(max_attempts):
        try:
            return await call()
        except Exception as exc:
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
            await asyncio.sleep(delay)
    raise RuntimeError("unreachable: max_attempts must be >= 1")


def default_tool_retry_policy() -> RetryPolicy:
    return RetryPolicy(max_attempts=2, initial_interval=0.5, retry_on=transient_retry_on)


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


def _unanswered_tool_calls(messages: list[Any]) -> list[dict[str, Any]]:
    """Tool calls of the latest AIMessage that have no ToolMessage yet."""
    for index in range(len(messages) - 1, -1, -1):
        message = messages[index]
        if not isinstance(message, AIMessage):
            continue
        answered = {
            str(m.tool_call_id)
            for m in messages[index + 1 :]
            if isinstance(m, ToolMessage)
        }
        return [
            call
            for call in (message.tool_calls or [])
            if call.get("id") and str(call["id"]) not in answered
        ]
    return []


def make_step_action_error_handler(
    *,
    recovery_prompt: str = _TOOL_RECOVERY_PROMPT,
    goto: str = "step_reason",
) -> Callable[[dict[str, Any], NodeError], Command]:
    """Recover when the action step fails after retries are exhausted.

    The node failed, so the latest AIMessage's tool calls have no results.
    Instead of appending a standalone ``SystemMessage`` (which would be
    checkpointed and accumulate across failures and turns), answer each
    unanswered call with a structured ``=== TOOL ERROR ===`` ToolMessage whose
    ``hint`` carries the recovery guidance. That is the tool result the
    history needs anyway (strict providers reject dangling tool calls), the
    model sees the guidance on the next ``step_reason``, and
    ``failed_tools`` is updated like a normal tool failure.
    """

    def step_action_error_handler(state: dict[str, Any], error: NodeError) -> Command:
        logger.exception(
            "step_action node failed after retries node=%s",
            error.node,
            exc_info=error.error,
        )
        messages = list((state or {}).get("messages") or [])
        failed = _failed_tools_from_state(state)
        cause = error.error if isinstance(error.error, Exception) else RuntimeError(str(error))
        guidance = " ".join(recovery_prompt.split())

        tool_messages: list[ToolMessage] = []
        for call in _unanswered_tool_calls(messages):
            name = str(call.get("name") or "unknown")
            structured = StructuredToolError.from_exception(name, cause).against_prior_failures(
                failed
            )
            structured = replace(
                structured,
                retryable=False,
                hint=f"{structured.hint} {guidance}".strip(),
            )
            tool_messages.append(
                ToolMessage(
                    content=structured.to_message_content(),
                    name=name,
                    tool_call_id=str(call["id"]),
                    status="error",
                )
            )
            if name not in failed:
                failed.append(name)

        if not tool_messages:
            return Command(goto=goto)
        return Command(
            update={"messages": tool_messages, "failed_tools": failed},
            goto=goto,
        )

    return step_action_error_handler
