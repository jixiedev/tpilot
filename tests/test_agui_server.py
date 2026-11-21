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

from tahoepilot.server import app as agui_server  # noqa: E402
from tahoepilot.server.app import AguiRuntime, _stream_events  # noqa: E402
from tests.test_databot_graph import PHASE_PREPARE_SQL, _seed, compiled_graph  # noqa: E402,F401


class _FakeAgent:
    name = "lead"

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


def _runtimes(**builds) -> dict:
    return {
        name: AguiRuntime(_FakeAgent(), build=build) for name, build in builds.items()
    }


def test_health_lists_each_front_agent_endpoint():
    # No ``with`` block: TestClient skips the lifespan, so nothing is built.
    client = TestClient(agui_server.app)
    agents = client.get("/health").json()["agents"]
    assert agents == {"lead": "/agui/lead", "databot": "/agui/databot"}
    assert client.post("/agui/nobody", json={}).status_code in {404, 422}


async def test_databot_actions_patch_its_paused_gate_layer(compiled_graph, monkeypatch):  # noqa: F811
    """Databot is a front agent: /agui/databot/actions patches its own thread."""
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "agui-actions"}, "recursion_limit": 50}
    await graph.ainvoke(
        _seed(PHASE_PREPARE_SQL, approved_cards=[{"name": "o"}],
              draft_sql="SELECT 1", sql_validated=True),
        config=config,
    )
    assert (await graph.aget_state(config)).interrupts  # paused at the SQL gate

    async def build():
        return graph, None

    monkeypatch.setattr(agui_server.app.state, "runtimes", _runtimes(databot=build))
    client = TestClient(agui_server.app)
    resp = client.post(
        "/agui/databot/actions",
        json={"thread_id": "agui-actions", "action": "propose_sql", "sql": "SELECT 2"},
    )
    assert resp.status_code == 200, resp.text
    state = resp.json()["state"]
    # The paused layer (stage prepare_sql) accepted the edit; the outer
    # checkpoint alone would still report the pre-layer values.
    assert state["stage"] == PHASE_PREPARE_SQL
    assert state["draft_sql"] == "SELECT 2"

    unknown = client.post(
        "/agui/databot/actions",
        json={"thread_id": "agui-actions", "action": "drop_table"},
    )
    assert unknown.status_code == 400


# ---------------------------------------------------------------------------
# Lead agent over AG-UI: a delegated specialist's gate pauses and resumes
# ---------------------------------------------------------------------------


async def _run_events(agent, input_data) -> list:
    return [event async for event in agent.clone().run(input_data)]


async def test_lead_over_agui_pauses_at_specialist_gate_and_resumes(tmp_path):
    from ag_ui.core.types import ResumeEntry
    from ag_ui_langgraph import LangGraphAgent
    from langchain_core.messages import AIMessage, SystemMessage, ToolMessage

    from tahoepilot.agent.catalog import AgentCatalog
    from tahoepilot.server.app import LeadGraphView
    from tests.test_lead_agent import GATEBOT, _call, _GateBot, _lead, _ScriptedModel

    async def factory(**kwargs):
        return AgentCatalog._new_agent(_GateBot, **kwargs)

    AgentCatalog.register(GATEBOT, factory, config=AgentCatalog.config("knowledge"))
    try:
        model = _ScriptedModel(
            [
                _call("delegate", {"agent": GATEBOT, "task": "Count orders"}),
                AIMessage(content="There were 42 orders."),
            ]
        )
        lead = await _lead(tmp_path, model)
        view = LeadGraphView(lead)
        agent = LangGraphAgent(
            name="lead",
            graph=view,
            emit_interrupt_outcome=True,
            enable_legacy_on_interrupt_event=False,
        )
        user = {"id": "u1", "role": "user", "content": "how many orders?"}
        first = await _run_events(
            agent,
            RunAgentInput(
                thread_id="web-1", run_id="r1", state={}, messages=[user], tools=[],
                context=[], forwarded_props={},
            ),
        )
        finished = [e for e in first if e.type == EventType.RUN_FINISHED][-1]
        assert finished.outcome is not None and finished.outcome.type == "interrupt"
        [pending] = finished.outcome.interrupts
        assert pending.metadata["langgraph"]["raw"]["id"] == "gatebot-gate"

        # The web turn got the lead persona and roster (AG-UI sends only user messages).
        first_prompt = model.prompts[0]
        assert isinstance(first_prompt[0], SystemMessage)
        assert "Specialists you can delegate to" in first_prompt[0].content

        # Root state shows the paused specialist; the frontend panels read it.
        snapshot = await view.aget_state({"configurable": {"thread_id": "web-1"}})
        assert snapshot.values["active_subagent"] == {"name": GATEBOT, "state": {}, "paused": True}

        second = await _run_events(
            agent,
            RunAgentInput(
                thread_id="web-1", run_id="r2", state={}, messages=[user], tools=[],
                context=[], forwarded_props={},
                resume=[ResumeEntry(interrupt_id=pending.id, status="resolved", payload="approve")],
            ),
        )
        done = [e for e in second if e.type == EventType.RUN_FINISHED][-1]
        assert done.outcome is None or done.outcome.type != "interrupt"
        final = await view.aget_state({"configurable": {"thread_id": "web-1"}})
        messages = final.values["messages"]
        assert messages[-1].content == "There were 42 orders."
        assert any(isinstance(m, ToolMessage) and '"status": "done"' in m.content for m in messages)
        assert final.values["active_subagent"] == {"name": GATEBOT, "state": {"stage": "summary"}}
        assert _GateBot.runs["work"] == 1
    finally:
        AgentCatalog.unregister(GATEBOT)


async def test_agui_stream_stays_small_for_a_heavy_nested_specialist(tmp_path, monkeypatch):
    """Raw LangGraph event copies once streamed ~95 MB for a dozen nested steps."""
    from langchain_core.messages import AIMessage

    from tahoepilot.agent.catalog import AgentCatalog
    from tahoepilot.server.app import LeadGraphView
    from tests.test_lead_agent import _call, _lead, _make_loopbot, _ScriptedModel

    loopbot = _make_loopbot(rounds=12, state_bytes=700_000)

    async def factory(**kwargs):
        return AgentCatalog._new_agent(loopbot, **kwargs)

    AgentCatalog.register("heavybot", factory, config=AgentCatalog.config("knowledge"))
    try:
        model = _ScriptedModel(
            [_call("delegate", {"agent": "heavybot", "task": "go"}), AIMessage(content="done")]
        )
        lead = await _lead(tmp_path, model)
        agent = agui_server._make_agent()
        agent.graph = LeadGraphView(lead)
        encoder = EventEncoder()
        events = [
            event
            async for event in agent.clone().run(
                RunAgentInput(
                    thread_id="heavy-1", run_id="r1", state={},
                    messages=[{"id": "u1", "role": "user", "content": "go"}],
                    tools=[], context=[], forwarded_props={},
                )
            )
        ]
        total = sum(len(encoder.encode(event)) for event in events)
        assert not [e for e in events if e.type == EventType.RAW]
        assert total < 2 * 1024 * 1024, f"streamed {total / 1048576:.1f} MB"
        assert [e for e in events if e.type == EventType.RUN_FINISHED]
    finally:
        AgentCatalog.unregister("heavybot")


async def test_databot_view_overlays_the_paused_layer(compiled_graph):  # noqa: F811
    """While databot waits at a gate, the root snapshot shows the layer's fields."""
    from types import SimpleNamespace

    from tahoepilot.agent.specialists.databot.databot_agent import DatabotAgent
    from tahoepilot.server.app import DatabotGraphView

    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "view-1"}, "recursion_limit": 50}
    await graph.ainvoke(
        _seed(PHASE_PREPARE_SQL, approved_cards=[{"name": "o"}],
              draft_sql="SELECT 1", sql_validated=True),
        config=config,
    )
    agent = SimpleNamespace(build_graph=lambda: graph)
    agent.ui_view = lambda state: DatabotAgent.ui_view(agent, state)
    agent.aget_active_snapshot = lambda cfg: DatabotAgent.aget_active_snapshot(agent, cfg)
    view = DatabotGraphView(agent)

    root = await graph.aget_state({"configurable": {"thread_id": "view-1"}})
    shown = await view.aget_state({"configurable": {"thread_id": "view-1"}})
    layer = await DatabotAgent.aget_active_snapshot(agent, {"configurable": {"thread_id": "view-1"}})
    assert layer.values["draft_sql"] == "SELECT 1"
    assert shown.values["draft_sql"] == layer.values["draft_sql"]
    assert shown.values["stage"] == layer.values["stage"]
    assert shown.values.get("messages") == root.values.get("messages")
