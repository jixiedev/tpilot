from __future__ import annotations

from types import SimpleNamespace

from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from agent.listener import CliListener, AgentListener
from agent.react import BaseReactAgent
from agent.runtime.prompt import SESSION_TURN_BOUNDARY
from config.agent_config import ReactAgentConfig, agent_config_path
from langgraph.checkpoint.memory import MemorySaver
from memory.profile_store import FileProfileStore
from memory.session_runtime import SessionRuntime
from tests.minimal_chat_model import MinimalChatModel


class _FakeGraph:
    def __init__(self, values: dict | None = None) -> None:
        self.values = values or {}

    async def aget_state(self, _config):
        return SimpleNamespace(values=self.values)


class _RecordingListener(AgentListener):
    def __init__(self) -> None:
        self.outputs: list = []

    def on_turn_output(self, state) -> None:
        self.outputs.append(state)


def _agent(tmp_path, listener: AgentListener | None = None) -> BaseReactAgent:
    agent_config = ReactAgentConfig(agent_config_path("tahoe"))
    session_runtime = SessionRuntime(FileProfileStore(tmp_path))
    model = MinimalChatModel()
    checkpointer = MemorySaver()
    return BaseReactAgent(
        session_runtime=session_runtime,
        tools=[],
        agent_config=agent_config,
        listener=listener or CliListener(),
        model=model,
        checkpointer=checkpointer,
    )


async def test_accept_user_request_sets_session_state(tmp_path, monkeypatch) -> None:
    import memory.profile_store as store_mod

    monkeypatch.delenv("TAHOEPILOT_USER_ID", raising=False)
    monkeypatch.setattr(store_mod.getpass, "getuser", lambda: "os_user")

    agent = _agent(tmp_path)
    agent.graph = _FakeGraph()  # type: ignore[assignment]
    request = await agent.accept_user_request("hello", "s1")
    assert request.session_id == "s1"
    assert request.user_id == "os_user"
    assert request.user_prompt == "hello"
    assert request.state["session_name"] == "s1"
    assert request.state["user_id"] == "os_user"
    assert request.state["tool_call_count"] == 0
    assert request.state["idle_reason_rounds"] == 0
    assert request.state["failed_tools"] == []
    messages = request.state["messages"]
    assert len(messages) == 2
    assert isinstance(messages[0], SystemMessage)
    assert isinstance(messages[1], HumanMessage)
    assert messages[1].content == "hello"
    assert "Role:" in str(messages[0].content)


async def test_accept_user_request_follow_up_turn_uses_boundary_and_human(tmp_path, monkeypatch) -> None:
    import memory.profile_store as store_mod

    monkeypatch.delenv("TAHOEPILOT_USER_ID", raising=False)
    monkeypatch.setattr(store_mod.getpass, "getuser", lambda: "os_user")

    agent = _agent(tmp_path)
    agent.graph = _FakeGraph(  # type: ignore[assignment]
        {
            "messages": [
                SystemMessage(content="Role:\nTahoe"),
                HumanMessage(content="first"),
                AIMessage(content="done"),
            ]
        }
    )
    request = await agent.accept_user_request("second", "s1")
    messages = request.state["messages"]
    assert len(messages) == 2
    assert isinstance(messages[0], SystemMessage)
    assert SESSION_TURN_BOUNDARY.strip() in str(messages[0].content)
    assert isinstance(messages[1], HumanMessage)
    assert messages[1].content == "second"


async def test_accept_user_request_reuses_profile_store(tmp_path, monkeypatch) -> None:
    import memory.profile_store as store_mod

    monkeypatch.delenv("TAHOEPILOT_USER_ID", raising=False)
    monkeypatch.setattr(store_mod.getpass, "getuser", lambda: "os_user")

    agent = _agent(tmp_path)
    agent.graph = _FakeGraph({"user_id": "erin"})  # type: ignore[assignment]
    request = await agent.accept_user_request("next", "s1", user_id=None)
    assert request.state["user_id"] == "erin"


async def test_on_turn_output_uses_base_listener(tmp_path) -> None:
    listener = _RecordingListener()
    agent = _agent(tmp_path, listener)
    payload = {"messages": [], "user_id": "u1"}
    agent.on_turn_output(payload)  # type: ignore[arg-type]
    assert listener.outputs == [payload]


class _ReplyModel(FakeMessagesListChatModel):
    """Answers every step with plain text, so a ReAct turn ends after one step."""

    def bind_tools(self, tools, **kwargs):  # type: ignore[override]
        return self


async def test_run_accepts_print_output_and_gates_turn_output(tmp_path) -> None:
    """cli.py passes print_output=True; plan delegation and evals pass False."""
    listener = _RecordingListener()
    agent = _agent(tmp_path, listener=listener)
    agent.model = _ReplyModel(responses=[AIMessage(content="hi")] * 20)
    await agent.run("hello", session="p1", user_id="u", print_output=True)
    assert len(listener.outputs) == 1
    await agent.run("again", session="p2", user_id="u", print_output=False)
    assert len(listener.outputs) == 1
    await agent.run("default", session="p3", user_id="u")
    assert len(listener.outputs) == 2


async def test_commit_turn_policy_runs_off_the_event_loop(tmp_path) -> None:
    """Profile refinement calls the model synchronously; it must not block the loop."""
    import asyncio
    import time

    agent = _agent(tmp_path)
    agent.model = _ReplyModel(responses=[AIMessage(content="hi")] * 20)
    policy = agent.session_turn_processor.turn_message_policy

    def slow_commit(state):
        time.sleep(0.4)
        return dict(state)

    policy.commit_turn_state = slow_commit  # type: ignore[method-assign]
    ticks = 0

    async def ticker() -> None:
        nonlocal ticks
        while True:
            await asyncio.sleep(0.05)
            ticks += 1

    task = asyncio.create_task(ticker())
    try:
        await agent.run("hello", session="loop", user_id="u", print_output=False)
    finally:
        task.cancel()
    assert ticks >= 4, f"event loop was blocked during commit (ticks={ticks})"
