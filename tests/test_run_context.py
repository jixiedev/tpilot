"""Run context resolution on AgentConfig subclasses."""

from __future__ import annotations

from tahoepilot.settings.agent_config import (
    DatabotAgentConfig,
    LeadAgentConfig,
    ReactAgentConfig,
    agent_config_path,
)


def test_lead_context_adds_delegation_budget() -> None:
    ctx = LeadAgentConfig(agent_config_path("lead")).run_context
    assert ctx["max_tool_calls"] == 12
    assert ctx["max_delegations"] == 6
    overridden = LeadAgentConfig(
        agent_config_path("lead"), run_overrides={"max_delegations": 2}
    ).run_context
    assert overridden["max_delegations"] == 2


def test_databot_context_nests_react_stages() -> None:
    ctx = DatabotAgentConfig(agent_config_path("databot")).run_context
    assert ctx["max_tool_calls"] == 10
    react = ctx.get("react") or {}
    assert "fetch" in react and "sql" in react
    assert react["fetch"]["next_step"].strip()
    assert react["fetch"]["fetch_instruction"].strip()
    assert react["sql"]["sql_instruction"].strip()
    gates = ctx.get("gates") or {}
    assert gates.get("cards_enabled") is True
    assert gates.get("sql_enabled") is True


def test_databot_gates_can_be_disabled_via_override() -> None:
    ctx = DatabotAgentConfig(
        agent_config_path("databot"),
        run_overrides={"gates": {"cards_enabled": False, "sql_enabled": False}},
    ).run_context
    assert ctx["gates"]["cards_enabled"] is False
    assert ctx["gates"]["sql_enabled"] is False


def test_react_context_applies_catalog_overrides() -> None:
    merged = ReactAgentConfig(
        agent_config_path("knowledge"),
        run_overrides={"max_tool_calls": 99},
    ).run_context
    assert merged["max_tool_calls"] == 99
    assert merged["next_step"].strip()
