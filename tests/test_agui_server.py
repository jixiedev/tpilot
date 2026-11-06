"""AG-UI server: runtime lifecycle, stream terminal events, and /actions."""

from __future__ import annotations

import json

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("ag_ui")

from ag_ui.core import EventType, RunFinishedEvent  # noqa: E402
from ag_ui.core.types import RunAgentInput  # noqa: E402
from ag_ui.encoder import EventEncoder  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from langgraph.types import Command  # noqa: E402

import agui_server  # noqa: E402
from agui_server import AguiRuntime, _stream_events  # noqa: E402
from tests.test_databot_graph import PHASE_PREPARE_SQL, _seed, compiled_graph  # noqa: E402,F401


class _FakeAgent:
    name = "databot"

    def __init__(self, events=(), exc: BaseException | None = None):
        self._events = list(events)
        self._exc = exc
        self.graph = None

    async def run(self, _input):
        for event in self._events:
            yield event
        if self._exc is not None:
            raise self._exc


def _input() -> RunAgentInput:
    return RunAgentInput(
        thread_id="t", run_id="r", state={}, messages=[], tools=[], context=[],
        forwarded_props={},
    )


async def _collect(agent) -> list[dict]:
    out = []
    async for chunk in _stream_events(agent, _input(), EventEncoder()):
        out.append(json.loads(chunk.removeprefix("data: ").strip()))
    return out


async def test_stream_passes_through_terminal_event():
    finished = RunFinishedEvent(type=EventType.RUN_FINISHED, thread_id="t", run_id="r")
    events = await _collect(_FakeAgent([finished]))
    assert [e["type"] for e in events] == ["RUN_FINISHED"]


async def test_stream_converts_exception_to_run_error():
    events = await _collect(_FakeAgent(exc=ValueError("boom")))
    assert events[-1]["type"] == "RUN_ERROR"
    assert events[-1]["code"] == "AGENT_RUNTIME_ERROR"
    assert "boom" in events[-1]["message"]
    assert len(events) == 1


async def test_stream_without_terminal_event_reports_incomplete():
    events = await _collect(_FakeAgent())
    assert events[-1]["code"] == "INCOMPLETE_STREAM"


async def test_runtime_builds_once_and_closes_connection():
    calls = []

    class _Conn:
        closed = False

        async def close(self):
            self.closed = True

    conn = _Conn()

    async def build():
        calls.append(1)
        return "graph", conn

    agent = _FakeAgent()
    runtime = AguiRuntime(agent, build=build)
    assert await runtime.ensure_built() == "graph"
    assert await runtime.ensure_built() == "graph"
    assert calls == [1]
    assert agent.graph == "graph"
    await runtime.close()
    assert conn.closed


def test_health_reads_runtime_from_app_state(monkeypatch):
    monkeypatch.setattr(agui_server.app.state, "runtime", AguiRuntime(_FakeAgent()))
    # No ``with`` block: TestClient skips the lifespan, so nothing is built.
    client = TestClient(agui_server.app)
    assert client.get("/health").json()["agent"]["name"] == "databot"


async def test_actions_patch_the_paused_gate_layer(compiled_graph, monkeypatch):  # noqa: F811
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "agui-actions"}, "recursion_limit": 50}
    await graph.ainvoke(
        _seed(PHASE_PREPARE_SQL, approved_cards=[{"name": "o"}],
              draft_sql="SELECT 1", sql_validated=True),
        config=config,
    )
    await graph.ainvoke(
        Command(resume='{"decision":"deny-comments","comments":"fix join"}'),
        config=config,
    )

    async def build():
        return graph, None

    monkeypatch.setattr(agui_server.app.state, "runtime", AguiRuntime(_FakeAgent(), build=build))
    client = TestClient(agui_server.app)
    resp = client.post(
        "/agui/actions",
        json={"thread_id": "agui-actions", "action": "propose_sql", "sql": "SELECT 2"},
    )
    assert resp.status_code == 200, resp.text
    state = resp.json()["state"]
    # The paused layer (stage prepare_sql) accepted the edit; the outer
    # checkpoint alone would still report the pre-layer values.
    assert state["stage"] == PHASE_PREPARE_SQL
    assert state["draft_sql"] == "SELECT 2"
    assert state["deny_feedback"] == "fix join"
