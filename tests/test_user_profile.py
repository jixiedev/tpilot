from __future__ import annotations

from pathlib import Path

import pytest

from memory.profile import UserProfile, coerce_user_profile, merge_user_profile, parse_user_profile_update
from memory.profile_store import FileProfileStore, safe_profile_filename
from state.state import SessionAgentState


def test_user_profile_defaults() -> None:
    profile = UserProfile(user_id="alice")

    assert profile.user_id == "alice"
    assert profile.role == ""
    assert profile.allowed_tables == []
    assert profile.favorite_metrics == []
    assert profile.favorite_dimensions == []


def test_coerce_user_profile_none_uses_process_user_id(monkeypatch) -> None:
    import memory.profile as profile_mod

    monkeypatch.setattr(profile_mod.getpass, "getuser", lambda: "os_user")
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


def test_reset_turn_preserves_user_id() -> None:
    state: SessionAgentState = {
        "messages": [],
        "session_name": "s1",
        "user_id": "dave",
        "tool_call_count": 3,
        "idle_rounds": 2,
        "autonomous_compact_requested": False,
        "failed_tools": ["hive_list_tables"],
        "turn_task_type": "data_query",
    }

    SessionAgentState.reset_turn(state)

    assert state["tool_call_count"] == 0
    assert state["idle_rounds"] == 0
    assert state["failed_tools"] == []
    assert state["turn_task_type"] == "unclear"
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


async def test_prepare_turn_input_sets_user_id_only(monkeypatch) -> None:
    import memory.profile as profile_mod
    from agent.tahoe.tahoe_agent import TahoeAgent

    monkeypatch.setattr(profile_mod.getpass, "getuser", lambda: "os_user")
    monkeypatch.setattr("agent.session.getpass.getuser", lambda: "os_user")

    agent = TahoeAgent(profile_store=TahoeAgent.default_profile_store(), tools=[])
    graph = _FakeGraph()
    first = await agent.prepare_turn_input(graph, "s1", "hello")
    assert first["user_id"] == "os_user"
    assert "user_profile" not in first

    graph = _FakeGraph({"messages": [], "user_id": "erin"})
    second = await agent.prepare_turn_input(graph, "s1", "next")
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
    from langchain_core.messages import HumanMessage, ToolMessage

    from graph.refine_profile import make_refine_user_profile_node

    store = FileProfileStore(tmp_path)
    store.save("alice", UserProfile(user_id="alice", role="analyst", language="zh-CN"))

    model = _FakeChatModel(
        UserProfile(department="growth", favorite_metrics=["gmv"], user_id="ignored")
    )
    node = make_refine_user_profile_node("Refine the profile.", model, store)
    state = {
        "user_id": "alice",
        "messages": [
            HumanMessage(content="I am on the growth team; track GMV daily."),
            ToolMessage(content="GMV last week was 1.2M CNY.", name="chat_completion", tool_call_id="1"),
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
    from langchain_core.messages import HumanMessage, ToolMessage

    from graph.refine_profile import make_refine_user_profile_node

    store = FileProfileStore(tmp_path)
    store.save("alice", UserProfile(user_id="alice", role="analyst"))

    node = make_refine_user_profile_node("Refine the profile.", _LooseFenceProfileModel(), store)
    state = {
        "user_id": "alice",
        "messages": [
            HumanMessage(content="GMV for wish last month?"),
            ToolMessage(content="GMV was 1M.", name="chat_completion", tool_call_id="1"),
        ],
    }

    update = node(state)

    assert update == {}
    saved = store.load("alice")
    assert saved.role == "analyst"
    assert saved.department == "checkout"
    assert saved.favorite_metrics == ["gmv"]


def test_refine_user_profile_node_skips_without_failing_turn(tmp_path: Path) -> None:
    from langchain_core.messages import HumanMessage, ToolMessage

    from graph.refine_profile import make_refine_user_profile_node

    store = FileProfileStore(tmp_path)
    store.save("alice", UserProfile(user_id="alice", role="analyst", language="zh-CN"))

    class _UnparseableModel:
        def with_structured_output(self, _schema):
            return _BrokenStructuredModel()

        def invoke(self, _messages):
            return "not json at all"

    node = make_refine_user_profile_node("Refine the profile.", _UnparseableModel(), store)
    state = {
        "user_id": "alice",
        "messages": [
            HumanMessage(content="hello"),
            ToolMessage(content="hi", name="chat_completion", tool_call_id="1"),
        ],
    }

    update = node(state)

    assert update == {}
    assert store.load("alice") == UserProfile(user_id="alice", role="analyst", language="zh-CN")


def test_profile_store_save_requires_user_id(tmp_path: Path) -> None:
    store = FileProfileStore(tmp_path)
    with pytest.raises(ValueError):
        store.save("", UserProfile(user_id="alice"))
