"""Process-local session state and user profile cache."""

from __future__ import annotations

import json
from pathlib import Path
from types import SimpleNamespace

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from agent.agent import BaseAgent
from agent.listener import AgentListener
from agent.prompt import SystemPromptAssembler
from agent.turn_messages import DefaultTurnMessagePolicy, TurnMessagePolicy
from config.agent_config import AgentConfig, agent_config_path
from agent.runtime.prompt import SESSION_TURN_BOUNDARY
from langgraph.checkpoint.memory import MemorySaver
from memory.profile import UserProfile
from memory.profile_store import FileProfileStore
from memory.session_runtime import SessionRuntime
from tests.minimal_chat_model import MinimalChatModel

_TURN_BOUNDARY = SESSION_TURN_BOUNDARY.strip()
_BASE_CONFIG = AgentConfig(agent_config_path("base"))


class _StubAgent(BaseAgent):
    def build_graph(self, **kwargs):
        if self.graph is not None:
            return self.graph
        raise NotImplementedError


class _CountingGraph:
    def __init__(self, values: dict | None = None) -> None:
        self.values = dict(values or {})
        self.gets = 0
        self.updates: list[dict] = []

    async def aget_state(self, _config):
        self.gets += 1
        return SimpleNamespace(values=dict(self.values))

    async def aupdate_state(self, _config, patch):
        self.updates.append(dict(patch))
        self.values.update(patch)


def _stub_runtime() -> tuple[MinimalChatModel, MemorySaver]:
    return MinimalChatModel(), MemorySaver()


def _agent(tmp_path: Path, graph: _CountingGraph | None = None) -> BaseAgent:
    model, checkpointer = _stub_runtime()
    agent = _StubAgent(
        model=model,
        checkpointer=checkpointer,
        session_runtime=SessionRuntime(FileProfileStore(tmp_path)),
        prompt_assembler=SystemPromptAssembler(_BASE_CONFIG),
        turn_message_policy=DefaultTurnMessagePolicy(),
        agent_config=_BASE_CONFIG,
        listener=AgentListener(),
    )
    agent.graph = graph or _CountingGraph()  # type: ignore[assignment]
    return agent


def test_session_runtime_loads_profile_from_disk_once(tmp_path: Path) -> None:
    disk = FileProfileStore(tmp_path)
    disk.save("erin", UserProfile(user_id="erin", role="SRE"))
    runtime = SessionRuntime(disk)

    first = runtime.load("erin")
    (tmp_path / "erin.json").write_text(
        json.dumps({"user_id": "erin", "role": "changed"}),
        encoding="utf-8",
    )
    second = runtime.load("erin")

    assert first.role == "SRE"
    assert second.role == "SRE"

    runtime.save("erin", UserProfile(user_id="erin", role="lead"))
    assert runtime.load("erin").role == "lead"
    saved = json.loads((tmp_path / "erin.json").read_text(encoding="utf-8"))
    assert saved["role"] == "lead"


def test_session_runtime_open_reuses_values_without_prior(tmp_path: Path) -> None:
    runtime = SessionRuntime(FileProfileStore(tmp_path))
    first = runtime.open("s1", user_id="erin", prior={"user_id": "erin", "stage": "fetch"})
    second = runtime.open("s1", user_id=None, prior={"user_id": "other", "stage": "sql"})

    assert first is second
    assert second.user_id == "erin"
    assert second.values["stage"] == "fetch"


def test_session_runtime_remember_replaces_values(tmp_path: Path) -> None:
    runtime = SessionRuntime(FileProfileStore(tmp_path))
    runtime.open("s1", user_id="erin", prior={"messages": []})
    remembered = runtime.remember("s1", {"messages": [HumanMessage(content="hi")], "user_id": "erin"})
    assert runtime.session("s1") is remembered
    assert remembered.values["messages"][0].content == "hi"


async def test_accept_user_request_hydrates_checkpoint_once(
    tmp_path: Path, monkeypatch
) -> None:
    import memory.profile_store as store_mod

    monkeypatch.delenv("TAHOEPILOT_USER_ID", raising=False)
    monkeypatch.setattr(store_mod.getpass, "getuser", lambda: "os_user")

    graph = _CountingGraph({"messages": [], "user_id": "erin"})
    agent = _agent(tmp_path, graph)

    first = (await agent.accept_user_request("hello", "s1")).state
    graph.values = {"messages": [], "user_id": "other"}
    second = (await agent.accept_user_request("next", "s1")).state

    assert graph.gets == 1
    assert first["user_id"] == "erin"
    assert second["user_id"] == "erin"
    assert "user_profile" not in first
    assert "user_profile" not in second


async def test_accept_user_request_loads_profile_from_disk_once(
    tmp_path: Path, monkeypatch
) -> None:
    import memory.profile_store as store_mod

    monkeypatch.delenv("TAHOEPILOT_USER_ID", raising=False)
    loads: list[str] = []
    original = FileProfileStore.load

    def _counting_load(self, user_id: str) -> UserProfile:
        loads.append(user_id)
        return original(self, user_id)

    monkeypatch.setattr(FileProfileStore, "load", _counting_load)

    store = FileProfileStore(tmp_path)
    store.save("erin", UserProfile(user_id="erin", role="SRE"))
    model, checkpointer = _stub_runtime()
    agent = _StubAgent(
        model=model,
        checkpointer=checkpointer,
        session_runtime=SessionRuntime(store),
        prompt_assembler=SystemPromptAssembler(_BASE_CONFIG),
        turn_message_policy=DefaultTurnMessagePolicy(),
        agent_config=_BASE_CONFIG,
        listener=AgentListener(),
    )
    agent.graph = _CountingGraph({"user_id": "erin"})  # type: ignore[assignment]

    await agent.accept_user_request("hello", "s1")
    await agent.accept_user_request("next", "s1")
    await agent.accept_user_request("third", "s2", user_id="erin")

    assert loads == ["erin"]


async def test_second_turn_uses_remembered_messages(tmp_path: Path, monkeypatch) -> None:
    import memory.profile_store as store_mod

    monkeypatch.delenv("TAHOEPILOT_USER_ID", raising=False)
    monkeypatch.setattr(store_mod.getpass, "getuser", lambda: "os_user")

    graph = _CountingGraph()
    agent = _agent(tmp_path, graph)
    await agent.accept_user_request("hello", "s1")
    agent.session_runtime.remember(
        "s1",
        {
            "messages": [
                SystemMessage(content="Role:\nTahoe"),
                HumanMessage(content="hello"),
                AIMessage(content="done"),
            ],
            "user_id": "os_user",
        },
    )
    request = await agent.accept_user_request("second", "s1")
    messages = request.state["messages"]

    assert graph.gets == 1
    assert isinstance(messages[0], SystemMessage)
    assert _TURN_BOUNDARY in str(messages[0].content)
    assert isinstance(messages[1], HumanMessage)
    assert messages[1].content == "second"


async def test_commit_turn_remembers_without_rereading(
    tmp_path: Path, monkeypatch
) -> None:
    import memory.profile_store as store_mod

    monkeypatch.delenv("TAHOEPILOT_USER_ID", raising=False)
    monkeypatch.setattr(store_mod.getpass, "getuser", lambda: "os_user")

    class _HaltTurnPolicy(TurnMessagePolicy):
        def commit_turn_state(self, state):
            merged = dict(state)
            merged["halt_reason"] = "saved"
            return merged

    class _PatchingAgent(_StubAgent):
        pass

    graph = _CountingGraph({"user_id": "os_user"})
    model, checkpointer = _stub_runtime()
    agent = _PatchingAgent(
        model=model,
        checkpointer=checkpointer,
        session_runtime=SessionRuntime(FileProfileStore(tmp_path)),
        prompt_assembler=SystemPromptAssembler(_BASE_CONFIG),
        turn_message_policy=_HaltTurnPolicy(),
        agent_config=_BASE_CONFIG,
        listener=AgentListener(),
    )
    agent.graph = graph  # type: ignore[assignment]

    await agent.accept_user_request("hello", "s1")
    committed = await agent.commit_turn(
        "s1",
        {
            "messages": [HumanMessage(content="hello"), AIMessage(content="ok")],
            "user_id": "os_user",
            "session_name": "s1",
        },
    )
    request = await agent.accept_user_request("second", "s1")

    assert graph.gets == 1
    assert len(graph.updates) == 1
    assert graph.updates[0]["halt_reason"] == "saved"
    assert committed["halt_reason"] == "saved"
    assert agent.session_runtime.session("s1").values["halt_reason"] == "saved"
    assert _TURN_BOUNDARY in str(request.state["messages"][0].content)
