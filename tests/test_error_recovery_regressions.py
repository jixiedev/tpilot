"""Regression tests for retry classification, the step_action recovery path and
where sync retry sleeps run."""

from __future__ import annotations

import asyncio
import threading
import time
from typing import Any

import pytest
from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langgraph.prebuilt.tool_node import ToolCallRequest

import tools.data.trino_errors  # noqa: F401  (registers Trino mappings)
from agent.router import CompletionToolRouter
from graph.builder import ReactLoopSpec, build_react_graph
from graph.error_recovery import (
    ainvoke_with_transient_retry,
    invoke_with_transient_retry,
    make_retrying_tool_wrapper,
    transient_retry_on,
)
from tools.errors import (
    StructuredToolError,
    ToolErrorType,
    register_exception,
    resolve_exception,
)


def _internal(error_name: str):
    from trino.exceptions import TrinoInternalError

    return TrinoInternalError(
        {"errorName": error_name, "errorType": "INTERNAL_ERROR", "message": "boom"},
        query_id="q-int",
    )


# --- Bug 1: classification and retry predicate agree -------------------------


def test_trino_generic_internal_error_is_not_advertised_as_retryable() -> None:
    structured = StructuredToolError.from_exception(
        "trino_run_query", _internal("GENERIC_INTERNAL_ERROR")
    )
    assert structured.error_type is ToolErrorType.UNKNOWN
    # Before the fix this said retryable=True although nothing retried it.
    assert structured.retryable is False
    assert structured.is_transient is False
    assert transient_retry_on(_internal("GENERIC_INTERNAL_ERROR")) is False


@pytest.mark.parametrize(
    ("error_name", "error_type"),
    [
        ("NO_NODES_AVAILABLE", ToolErrorType.CONNECTION),
        ("REMOTE_TASK_ERROR", ToolErrorType.CONNECTION),
        ("PAGE_TRANSPORT_TIMEOUT", ToolErrorType.TIMEOUT),
    ],
)
def test_trino_cluster_churn_internal_errors_are_transient(
    error_name: str, error_type: ToolErrorType
) -> None:
    exc = _internal(error_name)
    structured = StructuredToolError.from_exception("trino_run_query", exc)
    assert structured.error_type is error_type
    assert structured.retryable is True
    assert structured.is_transient is True
    assert transient_retry_on(exc) is True


def test_tool_wrapper_retries_transient_trino_internal_error() -> None:
    calls = {"n": 0}

    def execute(request: ToolCallRequest) -> ToolMessage:
        calls["n"] += 1
        structured = StructuredToolError.from_exception(
            "trino_run_query", _internal("NO_NODES_AVAILABLE")
        )
        return ToolMessage(
            content=structured.to_message_content(),
            tool_call_id="c1",
            name="trino_run_query",
            status="error",
        )

    request = ToolCallRequest(
        tool_call={"name": "trino_run_query", "args": {}, "id": "c1"},
        tool=None,
        state={"messages": []},
        runtime=None,
    )
    make_retrying_tool_wrapper(max_attempts=2, base_delay=0)(request, execute)
    assert calls["n"] == 2


def test_wrapper_and_node_retry_agree_for_every_resolution() -> None:
    class _OddError(Exception):
        pass

    # A classifier returning a non-transient type with retryable=True is
    # normalized, so the payload, the wrapper and the node policy agree.
    register_exception(_OddError, classifier=lambda e: (ToolErrorType.UNKNOWN, True, str(e)))
    exc = _OddError("x")
    _type, retryable, _msg = resolve_exception(exc)
    structured = StructuredToolError.from_exception("t", exc)
    assert retryable is False
    assert structured.retryable is structured.is_transient is transient_retry_on(exc) is False


def test_register_rejects_retryable_non_transient_type() -> None:
    class _Bad(Exception):
        pass

    with pytest.raises(ValueError, match="CONNECTION or TIMEOUT"):
        register_exception(_Bad, error_type=ToolErrorType.UNKNOWN, retryable=True)


# --- Bug 2: recovery guidance is not a checkpointed SystemMessage ------------


class _RecordingModel(FakeMessagesListChatModel):
    seen: list[list[Any]] = []

    def bind_tools(self, tools, **kwargs):  # type: ignore[override]
        return self

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):  # type: ignore[override]
        type(self).seen.append(list(messages))
        return super()._generate(messages, stop=stop, run_manager=run_manager, **kwargs)


class _ExplodingListener:
    """Fails inside StepActionNode (outside ToolNode error handling)."""

    def on_reason_start(self, *args: Any) -> None:
        pass

    def on_reason_step(self, message: AIMessage) -> None:
        pass

    def on_tool_call(self, name: str, args: dict) -> None:
        raise RuntimeError("listener exploded")

    def on_tool_result(self, name: str, content: Any) -> None:
        pass


@tool
def echo_tool(text: str) -> str:
    """Echo."""
    return text


def test_step_action_recovery_guidance_is_not_persisted_as_system_message() -> None:
    _RecordingModel.seen = []
    model = _RecordingModel(
        responses=[
            AIMessage(
                content="",
                tool_calls=[{"name": "echo_tool", "args": {"text": "hi"}, "id": "call-1"}],
            ),
            AIMessage(content="sorry, the tool failed"),
        ]
    )
    graph = build_react_graph(
        model,
        [echo_tool],
        router=CompletionToolRouter({}),
        loop=ReactLoopSpec("next step"),
        checkpointer=InMemorySaver(),
        listener=_ExplodingListener(),  # type: ignore[arg-type]
    )
    config = {"configurable": {"thread_id": "t-recovery"}}
    graph.invoke(
        {
            "messages": [HumanMessage(content="go")],
            "tool_call_count": 0,
            "idle_reason_rounds": 0,
            "failed_tools": [],
        },
        config,
    )

    history = graph.get_state(config).values["messages"]
    assert not [
        m for m in history if isinstance(m, SystemMessage) and "TOOL ERROR" in str(m.content)
    ]
    tool_messages = [m for m in history if isinstance(m, ToolMessage)]
    assert len(tool_messages) == 1
    assert tool_messages[0].tool_call_id == "call-1"
    assert tool_messages[0].status == "error"
    structured = StructuredToolError.from_message_content(str(tool_messages[0].content))
    assert structured is not None
    assert structured.tool == "echo_tool"
    assert "failed after automatic retries" in structured.hint
    assert graph.get_state(config).values["failed_tools"] == ["echo_tool"]

    # The model still saw the guidance on the next step.
    second_call = _RecordingModel.seen[1]
    assert any("failed after automatic retries" in str(m.content) for m in second_call)


# --- Bug 3: sync retry sleep in graph nodes does not block the event loop ----


def test_sync_node_retry_sleep_runs_off_the_event_loop() -> None:
    """Graphs run via ``ainvoke``; sync nodes (step_reason and the other
    ``invoke_with_transient_retry`` callers) execute in an executor thread, so
    ``time.sleep`` in the retry backoff does not stall the loop."""
    node_threads: list[int] = []

    def node(state: MessagesState) -> dict[str, Any]:
        node_threads.append(threading.get_ident())
        attempts = {"n": 0}

        def flaky() -> str:
            attempts["n"] += 1
            if attempts["n"] == 1:
                raise ConnectionError("blip")
            return "ok"

        invoke_with_transient_retry(flaky, max_attempts=2, base_delay=0.4)
        return {"messages": [AIMessage(content="done")]}

    builder = StateGraph(MessagesState)
    builder.add_node("n", node)
    builder.add_edge(START, "n")
    graph = builder.compile()

    async def main() -> tuple[int, int]:
        ticks = 0
        loop_thread = threading.get_ident()

        async def ticker() -> None:
            nonlocal ticks
            while True:
                await asyncio.sleep(0.02)
                ticks += 1

        task = asyncio.create_task(ticker())
        started = time.monotonic()
        await graph.ainvoke({"messages": [HumanMessage(content="hi")]})
        elapsed = time.monotonic() - started
        task.cancel()
        assert elapsed >= 0.4
        return ticks, loop_thread

    ticks, loop_thread = asyncio.run(main())
    assert node_threads and node_threads[0] != loop_thread
    # ~20 ticks expected during the 0.4 s backoff; a blocked loop yields ~0-1.
    assert ticks >= 8


def test_async_retry_helper_retries_without_blocking() -> None:
    attempts = {"n": 0}

    async def flaky() -> str:
        attempts["n"] += 1
        if attempts["n"] == 1:
            raise ConnectionError("blip")
        return "ok"

    async def main() -> tuple[str, int]:
        ticks = 0

        async def ticker() -> None:
            nonlocal ticks
            while True:
                await asyncio.sleep(0.02)
                ticks += 1

        task = asyncio.create_task(ticker())
        result = await ainvoke_with_transient_retry(flaky, max_attempts=2, base_delay=0.3)
        task.cancel()
        return result, ticks

    result, ticks = asyncio.run(main())
    assert result == "ok"
    assert attempts["n"] == 2
    assert ticks >= 5

    async def permanent() -> str:
        raise ValueError("bad request")

    with pytest.raises(ValueError):
        asyncio.run(ainvoke_with_transient_retry(permanent, max_attempts=3, base_delay=0))
