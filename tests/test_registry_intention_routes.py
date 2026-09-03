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
    published_route_target,
    resolve_route_target,
    routable_intentions,
)


def test_specialists_declare_intentions() -> None:
    assert DATABOT.intention == "DATA"
    assert KNOWLEDGE.intention == "KNOWLEDGE"
    assert AGENTS["databot"].intention == "DATA"
    assert AGENTS["knowledge"].intention == "KNOWLEDGE"
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
        get_routable_agent("plan")


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
                "route_target": "plan",
                "user_intention": "KNOWLEDGE → DATA",
            }
        )
        == "plan"
    )
    assert published_route_target({"status": "rejected", "route_target": "databot"}) == ""
    assert published_route_target({"status": "published", "route_target": ""}) == ""


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

