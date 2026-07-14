from __future__ import annotations

from memory.profile import UserProfile, coerce_user_profile, merge_user_profile
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


def test_session_state_includes_user_profile() -> None:
    assert "user_profile" in SessionAgentState.__annotations__


def test_reset_turn_preserves_user_profile() -> None:
    profile = UserProfile(user_id="dave", role="analyst", region="APAC")
    state: SessionAgentState = {
        "messages": [],
        "session_name": "s1",
        "tool_call_count": 3,
        "idle_rounds": 2,
        "autonomous_compact_requested": False,
        "failed_tools": ["hive_list_tables"],
        "turn_task_type": "data_query",
        "user_profile": profile,
    }

    SessionAgentState.reset_turn(state)

    assert state["tool_call_count"] == 0
    assert state["idle_rounds"] == 0
    assert state["failed_tools"] == []
    assert state["turn_task_type"] == "unclear"
    assert state["user_profile"] == profile


def test_user_profile_roundtrip() -> None:
    profile = UserProfile(
        user_id="bob",
        role="data analyst",
        department="growth",
        region="CN",
        allowed_tables=["hive.ads.gmv_d", "trino.dw.user_d"],
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
    assert restored.favorite_metrics == ["gmv", "pay_uv"]
    assert restored.forbidden_columns == ["phone", "id_card"]


class _FakeSnapshot:
    def __init__(self, values: dict | None):
        self.values = values


class _FakeGraph:
    def __init__(self, values: dict | None = None):
        self._values = values

    async def aget_state(self, _config):
        return _FakeSnapshot(self._values)


async def test_prepare_turn_input_defaults_and_preserves_profile(monkeypatch) -> None:
    import memory.profile as profile_mod
    from agent.chatbot.session import prepare_turn_input

    monkeypatch.setattr(profile_mod.getpass, "getuser", lambda: "os_user")

    graph = _FakeGraph()
    first = await prepare_turn_input(graph, "s1", "hello")
    assert first["user_profile"] == UserProfile(user_id="os_user")

    saved = UserProfile(user_id="erin", role="SRE", department="infra")
    graph = _FakeGraph({"messages": [], "user_profile": saved.model_dump()})
    second = await prepare_turn_input(graph, "s1", "next")
    assert second["user_profile"] == saved


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


def test_refine_user_profile_node_merges_without_touching_messages() -> None:
    from langchain_core.messages import HumanMessage, ToolMessage

    from graph.refine_profile import make_refine_user_profile_node

    model = _FakeChatModel(
        UserProfile(department="growth", favorite_metrics=["gmv"], user_id="ignored")
    )
    node = make_refine_user_profile_node("Refine the profile.", model)
    state = {
        "messages": [
            HumanMessage(content="I am on the growth team; track GMV daily."),
            ToolMessage(content="GMV last week was 1.2M CNY.", name="chat_completion", tool_call_id="1"),
        ],
        "user_profile": UserProfile(user_id="alice", role="analyst", language="zh-CN"),
    }

    update = node(state)

    assert "messages" not in update
    profile = update["user_profile"]
    assert profile.user_id == "alice"
    assert profile.role == "analyst"
    assert profile.language == "zh-CN"
    assert profile.department == "growth"
    assert profile.favorite_metrics == ["gmv"]
    assert len(model.structured.invoke_calls) == 1
