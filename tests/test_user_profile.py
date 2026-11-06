from __future__ import annotations

from pathlib import Path

import pytest

from memory.profile import UserProfile, coerce_user_profile, merge_user_profile, parse_user_profile_update
from memory.profile_store import FileProfileStore, safe_profile_filename
from graph.state import ReactAgentState, SessionAgentState


def test_user_profile_defaults() -> None:
    profile = UserProfile(user_id="alice")

    assert profile.user_id == "alice"
    assert profile.role == ""
    assert profile.allowed_tables == []
    assert profile.favorite_metrics == []
    assert profile.favorite_dimensions == []


def test_coerce_user_profile_none_uses_process_user_id(monkeypatch) -> None:
    import memory.profile_store as store_mod

    monkeypatch.delenv("TAHOEPILOT_USER_ID", raising=False)
    monkeypatch.setattr(store_mod.getpass, "getuser", lambda: "os_user")
    assert coerce_user_profile(None) == UserProfile(user_id="os_user")


def test_coerce_user_profile_from_dict() -> None:
    profile = coerce_user_profile(
        {"user_id": "carol", "role": "SRE", "department": "platform"}
    )
    assert profile.user_id == "carol"
    assert profile.role == "SRE"
    assert profile.department == "platform"


def test_parse_user_profile_update_markdown_fence() -> None:
    payload = """```json
{
  "user_id": "ignored",
  "department": "growth",
  "favorite_metrics": ["gmv"]
}
```"""
    profile = parse_user_profile_update(payload)
    assert profile.department == "growth"
    assert profile.favorite_metrics == ["gmv"]


def test_parse_user_profile_update_embedded_json() -> None:
    payload = 'Here is the profile: {"role": "analyst", "language": "en"}'
    profile = parse_user_profile_update(payload)
    assert profile.role == "analyst"
    assert profile.language == "en"


def test_merge_user_profile_keeps_blanks_and_user_id() -> None:
    current = UserProfile(
        user_id="alice",
        role="analyst",
        favorite_metrics=["gmv"],
        language="zh-CN",
    )
    update = UserProfile(
        user_id="hacked",
        role="",
        department="growth",
        favorite_metrics=["pay_uv"],
        language="",
    )
    merged = merge_user_profile(current, update)
    assert merged.user_id == "alice"
    assert merged.role == "analyst"
    assert merged.department == "growth"
    assert merged.favorite_metrics == ["pay_uv"]
    assert merged.language == "zh-CN"


def test_session_state_uses_user_id_not_profile() -> None:
    assert "user_id" in SessionAgentState.__annotations__
    assert "user_profile" not in SessionAgentState.__annotations__
    assert "tool_call_count" not in SessionAgentState.__annotations__
    assert "tool_call_count" in ReactAgentState.__annotations__


def test_reset_turn_preserves_user_id() -> None:
    state: ReactAgentState = {
        "messages": [],
        "session_name": "s1",
        "user_id": "dave",
        "tool_call_count": 3,
        "idle_reason_rounds": 2,
        "autonomous_compact_requested": False,
        "failed_tools": ["hive_list_tables"],
    }

    ReactAgentState.reset_turn(state)

    assert state["tool_call_count"] == 0
    assert state["idle_reason_rounds"] == 0
    assert state["failed_tools"] == []
    assert state["user_id"] == "dave"


def test_user_profile_roundtrip() -> None:
    profile = UserProfile(
        user_id="bob",
        role="data analyst",
        department="growth",
        region="CN",
        allowed_tables=["hive.ads.gmv_d"],
        forbidden_columns=["phone", "id_card"],
        language="zh-CN",
        timezone="Asia/Shanghai",
        default_time_granularity="day",
        preferred_currency="CNY",
        favorite_metrics=["gmv", "pay_uv"],
        favorite_dimensions=["country", "channel"],
    )

    restored = UserProfile.model_validate(profile.model_dump())
    assert restored == profile


def test_safe_profile_filename() -> None:
    assert safe_profile_filename("alice@corp.com") == "alice@corp.com"
    assert safe_profile_filename("  ") == "anonymous"


def test_file_profile_store_roundtrip(tmp_path: Path) -> None:
    store = FileProfileStore(tmp_path)
    profile = UserProfile(user_id="erin", role="SRE", favorite_metrics=["gmv"])

    store.save("erin", profile)
    loaded = store.load("erin")

    assert loaded == profile
    assert (tmp_path / "erin.json").is_file()


def test_file_profile_store_load_missing_returns_default(tmp_path: Path) -> None:
    store = FileProfileStore(tmp_path)
    assert store.load("new_user") == UserProfile(user_id="new_user")


class _FakeSnapshot:
    def __init__(self, values: dict | None):
        self.values = values


class _FakeGraph:
    def __init__(self, values: dict | None = None):
        self._values = values

    async def aget_state(self, _config):
        return _FakeSnapshot(self._values)


def test_resolve_user_id_prefers_explicit_then_prior_then_env(monkeypatch, tmp_path: Path) -> None:
    import memory.profile_store as store_mod

    monkeypatch.setattr(store_mod.getpass, "getuser", lambda: "os_user")
    monkeypatch.setenv("TAHOEPILOT_USER_ID", "env_user")
    assert store_mod.resolve_user_id("flag_user", prior="checkpoint_user") == "flag_user"
    assert store_mod.resolve_user_id(None, prior="checkpoint_user") == "checkpoint_user"
    assert store_mod.resolve_user_id(None, prior=None, active="active_user") == "active_user"
    assert store_mod.resolve_user_id() == "env_user"
    monkeypatch.delenv("TAHOEPILOT_USER_ID")
    assert store_mod.resolve_user_id("  ") == "os_user"

    store = FileProfileStore(tmp_path)
    assert store.activate_user(prior="erin") == "erin"
    assert store.resolve_user_id() == "erin"
    assert store.load_for_turn({"user_id": "bob"}).user_id == "bob"


async def test_accept_user_request_sets_user_id_only(monkeypatch, tmp_path: Path) -> None:
    import memory.profile_store as store_mod
    from agent.turn_messages import DefaultTurnMessagePolicy
    from agent.runtime import TahoeSystemPrompt
    from config.agent_config import AgentConfig, agent_config_path

    from agent.agent import BaseAgent
    from agent.listener import AgentListener
    from langgraph.checkpoint.memory import MemorySaver
    from memory.session_runtime import SessionRuntime
    from tests.minimal_chat_model import MinimalChatModel

    monkeypatch.delenv("TAHOEPILOT_USER_ID", raising=False)
    monkeypatch.setattr(store_mod.getpass, "getuser", lambda: "os_user")

    class _StubAgent(BaseAgent):
        def build_graph(self, **kwargs):
            if self.graph is not None:
                return self.graph
            raise NotImplementedError

    store = FileProfileStore(tmp_path)
    model = MinimalChatModel()
    checkpointer = MemorySaver()
    agent = _StubAgent(
        model=model,
        checkpointer=checkpointer,
        session_runtime=SessionRuntime(store),
        prompt_assembler=TahoeSystemPrompt(),
        turn_message_policy=DefaultTurnMessagePolicy(),
        agent_config=AgentConfig(agent_config_path("tahoe")),
        listener=AgentListener(),
    )
    agent.graph = _FakeGraph({"messages": [], "user_id": "erin"})
    first = (await agent.accept_user_request("hello", "s1")).state
    assert first["user_id"] == "erin"
    assert "user_profile" not in first

    agent.graph = _FakeGraph({"messages": [], "user_id": "other"})
    second = (await agent.accept_user_request("next", "s1")).state
    assert second["user_id"] == "erin"
    assert "user_profile" not in second


class _FakeStructuredModel:
    def __init__(self, result: UserProfile):
        self._result = result
        self.invoke_calls: list = []

    def invoke(self, messages):
        self.invoke_calls.append(messages)
        return self._result


class _FakeChatModel:
    def __init__(self, result: UserProfile):
        self.structured = _FakeStructuredModel(result)

    def with_structured_output(self, _schema):
        return self.structured


def test_refine_user_profile_node_persists_to_store(tmp_path: Path) -> None:
    from langchain_core.messages import HumanMessage, AIMessage

    from agent.refine_profile import UserProfileRefiner

    store = FileProfileStore(tmp_path)
    store.save("alice", UserProfile(user_id="alice", role="analyst", language="zh-CN"))

    model = _FakeChatModel(
        UserProfile(department="growth", favorite_metrics=["gmv"], user_id="ignored")
    )
    node = UserProfileRefiner("Refine the profile.", model, store).as_node()
    state = {
        "user_id": "alice",
        "messages": [
            HumanMessage(content="I am on the growth team; track GMV daily."),
            AIMessage(content="GMV last week was 1.2M CNY."),
        ],
    }

    update = node(state)

    assert update == {}
    saved = store.load("alice")
    assert saved.user_id == "alice"
    assert saved.role == "analyst"
    assert saved.language == "zh-CN"
    assert saved.department == "growth"
    assert saved.favorite_metrics == ["gmv"]


class _BrokenStructuredModel:
    def invoke(self, _messages):
        raise ValueError("Invalid JSON: expected value at line 1 column 1")


class _LooseFenceProfileModel:
    def with_structured_output(self, _schema):
        return _BrokenStructuredModel()

    def invoke(self, _messages):
        return """```json
{
  "department": "checkout",
  "favorite_metrics": ["gmv"]
}
```"""


def test_refine_user_profile_node_falls_back_to_fenced_json(tmp_path: Path) -> None:
    from langchain_core.messages import HumanMessage, AIMessage

    from agent.refine_profile import UserProfileRefiner

    store = FileProfileStore(tmp_path)
    store.save("alice", UserProfile(user_id="alice", role="analyst"))

    node = UserProfileRefiner("Refine the profile.", _LooseFenceProfileModel(), store).as_node()
    state = {
        "user_id": "alice",
        "messages": [
            HumanMessage(content="GMV for wish last month?"),
            AIMessage(content="GMV was 1M."),
        ],
    }

    update = node(state)

    assert update == {}
    saved = store.load("alice")
    assert saved.role == "analyst"
    assert saved.department == "checkout"
    assert saved.favorite_metrics == ["gmv"]


def test_refine_user_profile_node_skips_without_failing_turn(tmp_path: Path) -> None:
    from langchain_core.messages import HumanMessage, AIMessage

    from agent.refine_profile import UserProfileRefiner

    store = FileProfileStore(tmp_path)
    store.save("alice", UserProfile(user_id="alice", role="analyst", language="zh-CN"))

    class _UnparseableModel:
        def with_structured_output(self, _schema):
            return _BrokenStructuredModel()

        def invoke(self, _messages):
            return "not json at all"

    node = UserProfileRefiner("Refine the profile.", _UnparseableModel(), store).as_node()
    state = {
        "user_id": "alice",
        "messages": [
            HumanMessage(content="hello"),
            AIMessage(content="hi"),
        ],
    }

    update = node(state)

    assert update == {}
    assert store.load("alice") == UserProfile(user_id="alice", role="analyst", language="zh-CN")


def test_profile_store_save_requires_user_id(tmp_path: Path) -> None:
    store = FileProfileStore(tmp_path)
    with pytest.raises(ValueError):
        store.save("", UserProfile(user_id="alice"))
