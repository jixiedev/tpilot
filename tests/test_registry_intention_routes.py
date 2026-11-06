from __future__ import annotations

import pytest

from agent.catalog import AgentCatalog


def test_specialists_declare_intentions() -> None:
    assert AgentCatalog.config("databot").intention == "DATA"
    assert AgentCatalog.config("knowledge").intention == "KNOWLEDGE"
    assert AgentCatalog.config("diagnostic").intention == "DIAGNOSTIC"
    assert AgentCatalog.config("data_analysis").intention == "ANALYSIS"
    assert AgentCatalog.config("swe").intention == "SWE"
    assert AgentCatalog.config("plan").intention == "PLAN"
    assert AgentCatalog.config("intent").intention is None


def test_intention_routes_map_to_agent_names() -> None:
    routes = AgentCatalog.intention_routes()
    assert routes == {
        "ANALYSIS": "data_analysis",
        "DATA": "databot",
        "DIAGNOSTIC": "diagnostic",
        "KNOWLEDGE": "knowledge",
        "PLAN": "plan",
        "SWE": "swe",
    }
    assert AgentCatalog.routable_intentions() == frozenset(routes)
    # Every registered agent except the router itself is routable.
    assert set(routes.values()) == set(AgentCatalog.names()) - {"intent"}


def test_resolve_route_target() -> None:
    assert AgentCatalog.resolve_route_target("DATA") == "databot"
    assert AgentCatalog.resolve_route_target("knowledge") == "knowledge"
    assert AgentCatalog.resolve_route_target("UNCLEAR") == ""
    assert AgentCatalog.resolve_route_target("") == ""
    assert AgentCatalog.resolve_route_target("PLAN") == "plan"
    assert AgentCatalog.resolve_route_target("DIAGNOSE") == ""


def test_get_agent_for_intention() -> None:
    assert AgentCatalog.agent_for_intention("DATA") == "databot"
    assert AgentCatalog.agent_for_intention("KNOWLEDGE") == "knowledge"
    assert AgentCatalog.agent_for_intention("UNCLEAR") is None


def test_intention_catalog_for_prompts() -> None:
    catalog = AgentCatalog.intention_catalog()
    labels = [label for label, _ in catalog]
    assert labels == ["ANALYSIS", "DATA", "DIAGNOSTIC", "KNOWLEDGE", "PLAN", "SWE"]
    assert all(description for _, description in catalog)
    assert AgentCatalog.is_routable_intention("data")
    assert not AgentCatalog.is_routable_intention("UNCLEAR")


def test_get_routable_agent_requires_intention() -> None:
    assert AgentCatalog.get_routable_agent("databot") == "databot"
    with pytest.raises(SystemExit, match="not a routable specialist"):
        AgentCatalog.get_routable_agent("intent")


def test_published_route_target() -> None:
    assert (
        AgentCatalog.published_route_target(
            {"status": "published", "route_target": "databot", "user_intention": "DATA"}
        )
        == "databot"
    )
    assert (
        AgentCatalog.published_route_target(
            {
                "status": "published",
                "route_target": "plan",
                "user_intention": "KNOWLEDGE → DATA",
            }
        )
        == "plan"
    )
    assert AgentCatalog.published_route_target({"status": "rejected", "route_target": "databot"}) == ""
    assert AgentCatalog.published_route_target({"status": "published", "route_target": ""}) == ""


def test_duplicate_intention_raises() -> None:
    async def _noop(**_kwargs):
        raise AssertionError("should not create")

    AgentCatalog.register(
        "databot-alt",
        _noop,
        config=AgentCatalog.config("databot"),
    )
    try:
        with pytest.raises(ValueError, match="Duplicate intention"):
            AgentCatalog.intention_routes()
    finally:
        AgentCatalog.unregister("databot-alt")
