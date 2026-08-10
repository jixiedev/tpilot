from __future__ import annotations

import pytest

from agent.registry import (
    AGENTS,
    DATABOT,
    KNOWLEDGE,
    get_agent_for_intention,
    get_routable_agent,
    intention_catalog,
    intention_routes,
    is_routable_intention,
    published_execution_plan,
    published_route_target,
    resolve_route_target,
    routable_intentions,
    specialist_session_id,
)


def test_specialists_declare_intentions() -> None:
    assert DATABOT.intention == "DATA"
    assert KNOWLEDGE.intention == "KNOWLEDGE"
    assert AGENTS["databot"].intention == "DATA"
    assert AGENTS["knowledge"].intention == "KNOWLEDGE"
    assert AGENTS["tahoe"].intention is None
    assert AGENTS["intent"].intention is None


def test_intention_routes_map_to_agent_names() -> None:
    routes = intention_routes()
    assert set(routes) == {"DATA", "KNOWLEDGE"}
    assert routes["DATA"].name == "databot"
    assert routes["KNOWLEDGE"].name == "knowledge"
    assert routable_intentions() == frozenset({"DATA", "KNOWLEDGE"})


def test_resolve_route_target() -> None:
    assert resolve_route_target("DATA") == "databot"
    assert resolve_route_target("knowledge") == "knowledge"
    assert resolve_route_target("UNCLEAR") == ""
    assert resolve_route_target("") == ""
    assert resolve_route_target("DIAGNOSE") == ""


def test_get_agent_for_intention() -> None:
    assert get_agent_for_intention("DATA") is DATABOT
    assert get_agent_for_intention("KNOWLEDGE") is KNOWLEDGE
    assert get_agent_for_intention("UNCLEAR") is None


def test_intention_catalog_for_prompts() -> None:
    catalog = intention_catalog()
    labels = [label for label, _ in catalog]
    assert labels == ["DATA", "KNOWLEDGE"]
    assert all(description for _, description in catalog)
    assert is_routable_intention("data")
    assert not is_routable_intention("UNCLEAR")


def test_get_routable_agent_requires_intention() -> None:
    assert get_routable_agent("databot") is DATABOT
    with pytest.raises(SystemExit, match="not a routable specialist"):
        get_routable_agent("tahoe")


def test_published_route_target() -> None:
    assert (
        published_route_target(
            {"status": "published", "route_target": "databot", "user_intention": "DATA"}
        )
        == "databot"
    )
    assert (
        published_route_target(
            {
                "status": "published",
                "route_targets": ["knowledge", "databot"],
                "route_target": "knowledge",
            }
        )
        == "knowledge"
    )
    assert published_route_target({"status": "rejected", "route_target": "databot"}) == ""
    assert published_route_target({"status": "published", "route_target": ""}) == ""


def test_published_execution_plan() -> None:
    plan = [
        {"step_index": 0, "intention": "KNOWLEDGE", "agent": "knowledge", "task": "a"},
        {"step_index": 1, "intention": "DATA", "agent": "databot", "task": "b"},
    ]
    assert published_execution_plan({"status": "published", "execution_plan": plan}) == plan
    fallback = published_execution_plan(
        {
            "status": "published",
            "route_target": "databot",
            "user_intention": "DATA",
            "user_question": "gmv?",
        }
    )
    assert fallback[0]["agent"] == "databot"
    assert fallback[0]["task"] == "gmv?"
    assert published_execution_plan({"status": "rejected", "execution_plan": plan}) == []


def test_duplicate_intention_raises(monkeypatch: pytest.MonkeyPatch) -> None:
    from agent import registry as registry_mod
    from agent.registry import AgentSpec

    async def _noop(**_kwargs):
        raise AssertionError("should not create")

    duplicate = AgentSpec(
        name="databot-alt",
        description="dup",
        create_agent=_noop,
        intention="DATA",
    )
    monkeypatch.setitem(
        registry_mod.AGENTS,
        "databot-alt",
        duplicate,
    )
    with pytest.raises(ValueError, match="Duplicate intention"):
        intention_routes()


def test_specialist_session_id() -> None:
    assert specialist_session_id("abc", "databot") == "abc:databot"
