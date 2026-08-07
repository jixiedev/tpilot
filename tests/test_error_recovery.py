"""Tests for structured tool errors and graph recovery helpers."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from langchain_core.messages import ToolMessage
from langgraph.errors import NodeError
from langgraph.prebuilt.tool_node import ToolCallRequest

from graph.error_recovery import (
    format_turn_failure,
    invoke_with_transient_retry,
    make_async_retrying_tool_wrapper,
    make_handle_tool_errors,
    make_retrying_tool_wrapper,
    make_step_tools_error_handler,
    transient_llm_retry_on,
    transient_retry_on,
)
from tools.common import (
    alternative_tool,
    clear_alternative_tools,
    lookup_alternative_tool,
    register_alternative_tool,
)
from tools.errors import StructuredToolError, ToolErrorType


@pytest.fixture(autouse=True)
def _reset_alternative_registry() -> None:
    clear_alternative_tools()
    yield
    clear_alternative_tools()


def test_alternative_tool_registers_plan_b_without_wrapping() -> None:
    @alternative_tool("trino_list_tables")
    def hive_list_tables(database: str) -> list[str]:
        raise ConnectionError("hms down")

    assert lookup_alternative_tool("hive_list_tables") == "trino_list_tables"
    with pytest.raises(ConnectionError, match="hms down"):
        hive_list_tables("analytics")


def test_from_exception_attaches_optional_plan_b() -> None:
    register_alternative_tool("hive_list_tables", "trino_list_tables")

    structured = StructuredToolError.from_exception(
        "hive_list_tables", ConnectionError("hms down")
    )

    assert structured.error_type is ToolErrorType.CONNECTION
    assert structured.fallback_tool == "trino_list_tables"
    assert structured.retryable is True
    assert "Optional plan B" in structured.hint
    assert "trino_list_tables" in structured.hint
    assert "do not call `hive_list_tables`" in structured.hint


def test_to_message_content_uses_json_payload() -> None:
    register_alternative_tool("hive_list_tables", "trino_list_tables")
    structured = StructuredToolError.from_exception(
        "hive_list_tables", ConnectionError("hms down")
    )
    content = structured.to_message_content()

    assert content.startswith(StructuredToolError.MARKER)
    assert '"tool": "hive_list_tables"' in content
    assert '"fallback_tool": "trino_list_tables"' in content
    assert '"error_type": "connection"' in content


def test_from_exception_connection() -> None:
    structured = StructuredToolError.from_exception("trino_run_query", ConnectionError("refused"))

    assert structured.error_type is ToolErrorType.CONNECTION
    assert structured.retryable is True
    assert structured.is_transient is True
    assert structured.fallback_tool is None


def test_trino_user_error_table_not_found() -> None:
    from trino.exceptions import TrinoUserError

    exc = TrinoUserError(
        {
            "errorName": "TABLE_NOT_FOUND",
            "errorType": "USER_ERROR",
            "message": "line 1:15: Table 'hive.analytics.missing' does not exist",
        },
        query_id="q-1",
    )
    structured = StructuredToolError.from_exception("trino_run_query", exc)

    assert structured.error_type is ToolErrorType.NOT_FOUND
    assert structured.retryable is False
    assert "TABLE_NOT_FOUND" in structured.message
    assert structured.is_transient is False


def test_trino_user_error_syntax() -> None:
    from trino.exceptions import TrinoUserError

    exc = TrinoUserError(
        {
            "errorName": "SYNTAX_ERROR",
            "errorType": "USER_ERROR",
            "message": "line 1:8: mismatched input 'FORM'. Expecting: 'FROM'",
        },
        query_id="q-2",
    )
    structured = StructuredToolError.from_exception("trino_run_query", exc)

    assert structured.error_type is ToolErrorType.SYNTAX
    assert structured.retryable is False
    assert "SYNTAX_ERROR" in structured.message


def test_trino_user_error_permission() -> None:
    from trino.exceptions import TrinoUserError

    exc = TrinoUserError(
        {
            "errorName": "PERMISSION_DENIED",
            "errorType": "USER_ERROR",
            "message": "Access Denied: Cannot select from table hive.analytics.secret",
        },
        query_id="q-3",
    )
    structured = StructuredToolError.from_exception("trino_run_query", exc)

    assert structured.error_type is ToolErrorType.PERMISSION
    assert structured.retryable is False


def test_trino_external_error_is_retryable_connection() -> None:
    from trino.exceptions import TrinoExternalError

    exc = TrinoExternalError(
        {
            "errorName": "HIVE_METASTORE_ERROR",
            "errorType": "EXTERNAL",
            "message": "Error communicating with Hive Metastore",
        },
        query_id="q-4",
    )
    structured = StructuredToolError.from_exception("trino_run_query", exc)

    assert structured.error_type is ToolErrorType.CONNECTION
    assert structured.retryable is True
    assert structured.is_transient is True


def test_from_exception_sql_syntax() -> None:
    structured = StructuredToolError.from_exception(
        "trino_run_query",
        RuntimeError("line 1:8: Syntax error at or near SELECT"),
    )

    assert structured.error_type is ToolErrorType.SYNTAX
    assert "SQL" in structured.hint or "table" in structured.hint
    assert structured.is_transient is False


def test_message_content_round_trip() -> None:
    structured = StructuredToolError.from_exception("trino_list_tables", ConnectionError("down"))
    parsed = StructuredToolError.from_message_content(structured.to_message_content())

    assert parsed is not None
    assert parsed == structured


def test_handle_tool_errors_callable_formats_structured_message() -> None:
    register_alternative_tool("hive_desc_table", "trino_desc_table")
    handler = make_handle_tool_errors(tool_name_resolver=lambda _exc: "hive_desc_table")
    content = handler(ConnectionError("boom"))

    parsed = StructuredToolError.from_message_content(content)
    assert parsed is not None
    assert parsed.tool == "hive_desc_table"
    assert parsed.fallback_tool == "trino_desc_table"
    assert parsed.error_type is ToolErrorType.CONNECTION
    assert "Optional plan B" in parsed.hint


def test_retrying_wrapper_retries_transient_tool_message() -> None:
    attempts = {"count": 0}

    def execute(_request: ToolCallRequest) -> ToolMessage:
        attempts["count"] += 1
        if attempts["count"] == 1:
            content = StructuredToolError.from_exception(
                "trino_run_query", ConnectionError("temporary")
            ).to_message_content()
            return ToolMessage(
                content=content, tool_call_id="c1", name="trino_run_query", status="error"
            )
        return ToolMessage(content='{"ok": true}', tool_call_id="c1", name="trino_run_query")

    wrapper = make_retrying_tool_wrapper(max_attempts=2, base_delay=0)
    request = ToolCallRequest(
        tool_call={"name": "trino_run_query", "args": {}, "id": "c1", "type": "tool_call"},
        tool=MagicMock(),
        state={},
        runtime=MagicMock(),
    )

    result = wrapper(request, execute)

    assert attempts["count"] == 2
    assert result.content == '{"ok": true}'


@pytest.mark.asyncio
async def test_async_retrying_wrapper_retries_transient_tool_message() -> None:
    attempts = {"count": 0}

    async def execute(_request: ToolCallRequest) -> ToolMessage:
        attempts["count"] += 1
        if attempts["count"] == 1:
            content = StructuredToolError.from_exception(
                "search", ConnectionError("temporary")
            ).to_message_content()
            return ToolMessage(
                content=content, tool_call_id="c1", name="search", status="error"
            )
        return ToolMessage(content='{"ok": true}', tool_call_id="c1", name="search")

    wrapper = make_async_retrying_tool_wrapper(max_attempts=2, base_delay=0)
    request = ToolCallRequest(
        tool_call={"name": "search", "args": {}, "id": "c1", "type": "tool_call"},
        tool=MagicMock(),
        state={},
        runtime=MagicMock(),
    )

    result = await wrapper(request, execute)

    assert attempts["count"] == 2
    assert result.content == '{"ok": true}'


@pytest.mark.asyncio
async def test_async_retrying_wrapper_does_not_retry_syntax_errors() -> None:
    attempts = {"count": 0}

    async def execute(_request: ToolCallRequest) -> ToolMessage:
        attempts["count"] += 1
        content = StructuredToolError.from_exception(
            "search",
            RuntimeError("Syntax error at or near FROM"),
        ).to_message_content()
        return ToolMessage(
            content=content, tool_call_id="c1", name="search", status="error"
        )

    wrapper = make_async_retrying_tool_wrapper(max_attempts=3, base_delay=0)
    request = ToolCallRequest(
        tool_call={"name": "search", "args": {}, "id": "c1", "type": "tool_call"},
        tool=MagicMock(),
        state={},
        runtime=MagicMock(),
    )

    await wrapper(request, execute)

    assert attempts["count"] == 1


def test_step_tools_node_registers_async_tool_wrapper() -> None:
    from graph.node import StepToolsNode

    node = StepToolsNode([])

    assert node._awrap_tool_call is not None
    assert node._wrap_tool_call is not None


def test_retrying_wrapper_does_not_retry_syntax_errors() -> None:
    attempts = {"count": 0}

    def execute(_request: ToolCallRequest) -> ToolMessage:
        attempts["count"] += 1
        content = StructuredToolError.from_exception(
            "trino_run_query",
            RuntimeError("Syntax error at or near FROM"),
        ).to_message_content()
        return ToolMessage(
            content=content, tool_call_id="c1", name="trino_run_query", status="error"
        )

    wrapper = make_retrying_tool_wrapper(max_attempts=3, base_delay=0)
    request = ToolCallRequest(
        tool_call={"name": "trino_run_query", "args": {}, "id": "c1", "type": "tool_call"},
        tool=MagicMock(),
        state={},
        runtime=MagicMock(),
    )

    wrapper(request, execute)

    assert attempts["count"] == 1


def test_against_prior_failures_suppresses_circular_plan_b() -> None:
    structured = StructuredToolError(
        error_type=ToolErrorType.CONNECTION,
        tool="trino_list_tables",
        message="trino down",
        retryable=True,
        fallback_tool="hive_list_tables",
        hint="Optional plan B: `hive_list_tables`",
    )

    suppressed = structured.against_prior_failures(["hive_list_tables"])

    assert suppressed.fallback_tool is None
    assert "already failed this turn" in suppressed.hint
    assert "chat_completion" in suppressed.hint
    assert structured.against_prior_failures([]).fallback_tool == "hive_list_tables"


def test_retrying_wrapper_suppresses_plan_b_when_peer_already_failed() -> None:
    def execute(_request: ToolCallRequest) -> ToolMessage:
        content = StructuredToolError(
            error_type=ToolErrorType.CONNECTION,
            tool="trino_list_tables",
            message="trino down",
            retryable=False,
            fallback_tool="hive_list_tables",
            hint="Optional plan B",
        ).to_message_content()
        return ToolMessage(
            content=content, tool_call_id="c1", name="trino_list_tables", status="error"
        )

    wrapper = make_retrying_tool_wrapper(max_attempts=1, base_delay=0)
    request = ToolCallRequest(
        tool_call={"name": "trino_list_tables", "args": {}, "id": "c1", "type": "tool_call"},
        tool=MagicMock(),
        state={"failed_tools": ["hive_list_tables"]},
        runtime=MagicMock(),
    )

    result = wrapper(request, execute)
    parsed = StructuredToolError.from_message_content(str(result.content))

    assert parsed is not None
    assert parsed.fallback_tool is None
    assert "already failed this turn" in parsed.hint


def test_step_tools_collects_failed_tools() -> None:
    from graph.node import StepToolsNode

    state = {"failed_tools": ["hive_list_tables"], "tool_call_count": 0}
    error = StructuredToolError.from_exception(
        "trino_list_tables", ConnectionError("down")
    )
    result = {
        "messages": [
            ToolMessage(
                content=error.to_message_content(),
                tool_call_id="c1",
                name="trino_list_tables",
                status="error",
            )
        ]
    }

    failed = StepToolsNode._collect_failed_tools(state, result)

    assert failed == ["hive_list_tables", "trino_list_tables"]


def test_step_tools_error_handler_routes_back_to_llm() -> None:
    handler = make_step_tools_error_handler(goto="step_llm")
    command = handler({"messages": []}, NodeError("step_tools", RuntimeError("boom")))

    assert command.goto == "step_llm"
    assert command.update is not None
    assert "TOOL ERROR" in command.update["messages"][0].content


def test_transient_llm_retry_on_rate_limit_and_timeout() -> None:
    class RateLimitError(Exception):
        status_code = 429

    assert transient_llm_retry_on(RateLimitError("rate limit exceeded")) is True
    assert transient_llm_retry_on(TimeoutError("timed out")) is True
    assert transient_llm_retry_on(ValueError("bad request")) is False


def test_invoke_with_transient_retry_retries_then_succeeds() -> None:
    attempts = {"count": 0}

    def flaky() -> str:
        attempts["count"] += 1
        if attempts["count"] == 1:
            raise TimeoutError("temporary")
        return "ok"

    assert invoke_with_transient_retry(flaky, max_attempts=2, base_delay=0) == "ok"
    assert attempts["count"] == 2


def test_invoke_with_transient_retry_does_not_retry_permanent_errors() -> None:
    attempts = {"count": 0}

    def permanent() -> str:
        attempts["count"] += 1
        raise ValueError("bad schema")

    with pytest.raises(ValueError, match="bad schema"):
        invoke_with_transient_retry(permanent, max_attempts=3, base_delay=0)

    assert attempts["count"] == 1


def test_format_turn_failure_messages() -> None:
    class RateLimitError(Exception):
        status_code = 429

    assert "rate-limited" in format_turn_failure(RateLimitError("too many")).lower()
    assert "timed out" in format_turn_failure(TimeoutError("deadline")).lower()
    assert "model API" in format_turn_failure(ConnectionError("refused"))
    assert "Request failed" in format_turn_failure(ValueError("unexpected boom"))


def test_transient_retry_on_matches_connection_errors() -> None:
    assert transient_retry_on(ConnectionError("down")) is True
    assert transient_retry_on(ValueError("bad sql")) is False
