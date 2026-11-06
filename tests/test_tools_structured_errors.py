"""Tool failures reach the structured error path (classification, retries,
failed_tools) instead of being returned as plain text or dicts."""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest
from langchain_core.messages import AIMessage, ToolMessage
from langgraph.graph import START, StateGraph

import importlib

from graph.node import StepActionNode
from graph.state import ReactAgentState
from tools.code.bash import bash, clear_sessions
from tools.code.python_execute import python_execute
from tools.data.trino import trino_explain
from tools.errors import StructuredToolError, ToolErrorType
from tools.web.search import WebSearchError, set_web_search_client, web_search

# ``tools.code`` re-exports the ``bash`` tool, shadowing the submodule attribute.
bash_module = importlib.import_module("tools.code.bash")


def _run(tool, args: dict[str, Any]) -> tuple[ToolMessage, dict[str, Any]]:
    """Run one tool call through the real ``StepActionNode`` inside a graph."""
    builder = StateGraph(ReactAgentState)
    builder.add_node("step_action", StepActionNode([tool]))
    builder.add_edge(START, "step_action")
    result = builder.compile().invoke(
        {
            "messages": [
                AIMessage(
                    content="",
                    tool_calls=[{"name": tool.name, "args": args, "id": "call-1"}],
                )
            ],
            "tool_call_count": 0,
            "failed_tools": [],
        }
    )
    message = result["messages"][-1]
    assert isinstance(message, ToolMessage)
    return message, result


def _structured(message: ToolMessage) -> StructuredToolError:
    assert message.status == "error"
    structured = StructuredToolError.from_message_content(str(message.content))
    assert structured is not None, message.content
    return structured


# --- bash -------------------------------------------------------------------


@pytest.fixture
def _bash_sessions():
    clear_sessions()
    yield
    clear_sessions()


def test_bash_session_timeout_is_structured(_bash_sessions, monkeypatch) -> None:
    monkeypatch.setattr(bash_module, "TIMEOUT_SECONDS", 0.6)
    message, result = _run(bash, {"command": "sleep 3"})

    structured = _structured(message)
    assert structured.error_type is ToolErrorType.TIMEOUT
    assert structured.retryable is False  # shell commands are not auto-retried
    assert "timed out" in structured.message
    assert result["failed_tools"] == ["bash"]


def test_bash_dead_session_message_keeps_restart_hint(_bash_sessions) -> None:
    bash.invoke({"command": "true"})
    holder = bash_module._sessions[bash_module.DEFAULT_SESSION_ID]
    holder.process.kill()
    holder.process.wait()
    # Pin the dead session so ``_session()`` does not replace it.
    with patch.object(bash_module, "_session", return_value=holder):
        message, _ = _run(bash, {"command": "echo hi"})

    structured = _structured(message)
    assert "bash has exited" in structured.message
    assert "tool must be restarted" in structured.message


def test_bash_command_stderr_is_still_plain_output(_bash_sessions) -> None:
    message, result = _run(bash, {"command": "ls /definitely-not-here-tp"})
    assert message.status != "error"
    assert str(message.content).startswith("Error: ")
    assert result["failed_tools"] == []


# --- python_execute ------------------------------------------------------------


def test_python_execute_timeout_is_structured() -> None:
    message, result = _run(
        python_execute, {"code": "import time; time.sleep(5)", "timeout_seconds": 1}
    )
    structured = _structured(message)
    assert structured.error_type is ToolErrorType.TIMEOUT
    assert structured.retryable is False
    assert "Execution timeout after 1 seconds" in structured.message
    assert result["failed_tools"] == ["python_execute"]


def test_python_execute_missing_interpreter_is_structured() -> None:
    with patch("tools.code.python_execute._resolve_python", return_value=None):
        message, _ = _run(python_execute, {"code": "print(1)"})
    structured = _structured(message)
    assert structured.error_type is ToolErrorType.UNKNOWN
    assert "Python interpreter not found" in structured.message


def test_python_execute_nonzero_exit_is_a_result_not_a_tool_error() -> None:
    message, result = _run(python_execute, {"code": "raise SystemExit(3)"})
    assert message.status != "error"
    assert '"success": false' in str(message.content).lower()
    assert result["failed_tools"] == []


# --- web_search --------------------------------------------------------------


class _Failing:
    def __init__(self, exc: Exception) -> None:
        self.exc = exc
        self.calls = 0

    def search(self, query: str, max_results: int):
        self.calls += 1
        raise self.exc


def test_web_search_connection_failure_is_structured_and_retried() -> None:
    client = _Failing(ConnectionError("connection reset"))
    set_web_search_client(client)
    try:
        with patch("graph.error_recovery.time.sleep"):
            message, result = _run(web_search, {"query": "trino release notes"})
    finally:
        set_web_search_client(None)

    structured = _structured(message)
    assert structured.error_type is ToolErrorType.CONNECTION
    assert structured.retryable is True
    assert "Web search failed: connection reset" in structured.message
    assert client.calls == 2  # retried once by the tool-call wrapper
    assert result["failed_tools"] == ["web_search"]


def test_web_search_permission_failure_is_not_retried() -> None:
    from tools.web.search import _http_status_error

    client = _Failing(_http_status_error(401, "bad key"))
    set_web_search_client(client)
    try:
        message, _ = _run(web_search, {"query": "anything"})
    finally:
        set_web_search_client(None)

    structured = _structured(message)
    assert structured.error_type is ToolErrorType.PERMISSION
    assert client.calls == 1
    assert "HTTP 401" in structured.message


def test_web_search_blank_query_raises() -> None:
    with pytest.raises(WebSearchError, match="blank"):
        web_search.invoke({"query": "   "})


# --- trino_explain keeps its dict contract -------------------------------------


def test_trino_explain_failure_stays_an_ok_false_dict() -> None:
    """The databot SQL stage reads ``ok``/``error``; explain must not raise."""
    with patch(
        "tools.data.trino._execute_query", side_effect=RuntimeError("line 1:1: mismatched input")
    ):
        result = trino_explain.invoke({"sql": "select x from"})
    assert result == {"ok": False, "error": "line 1:1: mismatched input", "sql": "select x from"}
