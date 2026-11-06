"""Agent tool assignment via ``[tools]`` config and the name registry."""

from __future__ import annotations

from pathlib import Path

import pytest
from langchain_core.tools import tool

from agent.catalog import AgentCatalog
from config.agent_config import agent_tool_scopes, tool_groups
from tools.bootstrap import ensure_tools_registered
from tools.registry import register_tool, registered_tools


def test_every_configured_tool_is_registered():
    """A typo in any agent's [tools] table, or a group, fails here."""
    ensure_tools_registered()
    registry = registered_tools()
    missing = [
        (agent, scope, name)
        for agent in AgentCatalog.names()
        for scope, names in agent_tool_scopes(agent).items()
        for name in names
        if name not in registry
    ]
    assert missing == []


def test_every_group_member_is_registered():
    ensure_tools_registered()
    registry = registered_tools()
    assert [
        (group, name)
        for group, names in tool_groups().items()
        for name in names
        if name not in registry
    ] == []


def test_scopes_follow_config():
    ensure_tools_registered()
    # Other tests rebind scopes with fakes; compare against the bootstrap state.
    AgentCatalog.restore_tools_snapshot()
    for agent in AgentCatalog.names():
        for scope, names in agent_tool_scopes(agent).items():
            bound = {t.name for t in AgentCatalog.tools_for(agent, scope)}
            expected = {registered_tools()[n].name for n in names}
            assert expected <= bound, (agent, scope)


def test_plan_agent_gets_its_own_planning_tool():
    import agent.plan.stage_tools as stage
    import tools.plan as generic

    ensure_tools_registered()
    plan_tools = AgentCatalog.tools_for("plan", "subagent")
    assert any(t is stage.planning for t in plan_tools)
    swe_tools = AgentCatalog.tools_for("swe", "default")
    assert any(t is generic.planning for t in swe_tools)


def _write(path: Path, text: str) -> Path:
    path.write_text(text)
    return path


def test_group_expansion_dedupes_in_order(tmp_path, monkeypatch):
    agents = tmp_path / "agents"
    agents.mkdir()
    _write(agents / "demo.toml", '[tools]\ndefault = ["a", "@g", "b"]\n')
    monkeypatch.setattr("config.agent_config._DEFAULT_AGENTS_DIR", agents)
    assert agent_tool_scopes("demo", groups={"g": ["b", "c"]}) == {"default": ["a", "b", "c"]}


def test_unknown_group_is_an_error(tmp_path, monkeypatch):
    agents = tmp_path / "agents"
    agents.mkdir()
    _write(agents / "demo.toml", '[tools]\ndefault = ["@nope"]\n')
    monkeypatch.setattr("config.agent_config._DEFAULT_AGENTS_DIR", agents)
    with pytest.raises(ValueError, match="unknown tool group"):
        agent_tool_scopes("demo", groups={})


def test_duplicate_registry_key_is_an_error():
    @tool
    def unique_probe_tool_x() -> str:
        """probe"""
        return ""

    @tool("unique_probe_tool_x")
    def other() -> str:
        """probe"""
        return ""

    register_tool(unique_probe_tool_x)
    register_tool(unique_probe_tool_x)  # same object: idempotent
    with pytest.raises(ValueError, match="already registered"):
        register_tool(other)
    register_tool(other, key="probe.other")  # explicit key disambiguates
    assert registered_tools()["probe.other"] is other
