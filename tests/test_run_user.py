"""One user id per run, the same way for the CLI and the web server."""

from __future__ import annotations

from types import SimpleNamespace

import pytest
from langchain_core.runnables import RunnableLambda

from agent.session import SessionUserRequest, session_graph_config, with_run_user
from memory.profile import UserProfile
from memory.profile_store import resolve_user_id, run_user_id


def test_session_graph_config_carries_user():
    config = session_graph_config("s1", "alice")
    assert config["configurable"] == {"thread_id": "s1", "user_id": "alice"}
    assert "user_id" not in session_graph_config("s1")["configurable"]


def test_cli_request_config_has_resolved_user():
    request = SessionUserRequest("s1", "bob", "hi", UserProfile(), {})  # type: ignore[arg-type]
    assert request.graph_config()["configurable"]["user_id"] == "bob"


def test_with_run_user_keeps_other_keys():
    merged = with_run_user({"recursion_limit": 5, "configurable": {"x": 1}}, " carol ")
    assert merged == {"recursion_limit": 5, "configurable": {"x": 1, "user_id": "carol"}}
    assert with_run_user({"a": 1}, "") == {"a": 1}


def test_run_user_id_outside_a_run_is_empty():
    assert run_user_id() == ""


def test_resolver_reads_the_run_config():
    probe = RunnableLambda(lambda _: (run_user_id(), resolve_user_id(prior="stored")))
    assert probe.invoke(None, {"configurable": {"user_id": "dave"}}) == ("dave", "dave")
    # explicit still wins over the run's user (a delegated task names its user)
    explicit = RunnableLambda(lambda _: resolve_user_id("erin", prior="stored"))
    assert explicit.invoke(None, {"configurable": {"user_id": "dave"}}) == "erin"


pytest.importorskip("ag_ui")
from ag_ui.core.types import RunAgentInput  # noqa: E402

import agui_server  # noqa: E402


def _input(state):
    return RunAgentInput(
        thread_id="t", run_id="r", state=state, messages=[], tools=[], context=[],
        forwarded_props={},
    )


def test_bind_run_user_overrides_client_state():
    data, config = agui_server.bind_run_user(
        _input({"user_id": "mallory", "plan": []}), {"recursion_limit": 7}, "alice"
    )
    assert data.state == {"user_id": "alice", "plan": []}
    assert config == {"recursion_limit": 7, "configurable": {"user_id": "alice"}}


class _Graph:
    def __init__(self, values):
        self.values = values
        self.calls = 0

    async def aget_state(self, _config):
        self.calls += 1
        return SimpleNamespace(values=self.values)


def _request(headers):
    return SimpleNamespace(headers=headers)


@pytest.mark.asyncio
async def test_request_user_from_header(monkeypatch):
    graph = _Graph({"user_id": "stored"})
    runtime = SimpleNamespace(graph=graph)
    uid = await agui_server._request_user_id(
        _request({agui_server.USER_HEADER: " alice "}), runtime, "t"
    )
    assert uid == "alice"
    assert graph.calls == 0


@pytest.mark.asyncio
async def test_request_user_falls_back_to_thread_then_default(monkeypatch):
    runtime = SimpleNamespace(graph=_Graph({"user_id": "stored"}))
    assert await agui_server._request_user_id(_request({}), runtime, "t") == "stored"

    monkeypatch.setattr("settings.runtime_config.default_user_id", lambda: "fallback")
    runtime = SimpleNamespace(graph=_Graph({}))
    assert await agui_server._request_user_id(_request({}), runtime, "t") == "fallback"


@pytest.mark.asyncio
async def test_nested_graph_inherits_run_user():
    """A specialist invoked from a parent node (like ``delegate``) sees the run's user."""
    from typing import TypedDict

    from langgraph.graph import END, START, StateGraph

    class S(TypedDict, total=False):
        seen: str

    inner = StateGraph(S)
    inner.add_node("probe", lambda _s: {"seen": run_user_id()})
    inner.add_edge(START, "probe")
    inner.add_edge("probe", END)
    inner_graph = inner.compile()

    async def outer_node(_s):
        result = await inner_graph.ainvoke({}, {"recursion_limit": 10})
        return {"seen": result["seen"]}

    outer = StateGraph(S)
    outer.add_node("delegate", outer_node)
    outer.add_edge(START, "delegate")
    outer.add_edge("delegate", END)
    out = await outer.compile().ainvoke({}, session_graph_config("s", "frank"))
    assert out["seen"] == "frank"
