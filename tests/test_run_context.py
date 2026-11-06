"""Run context resolution on AgentConfig subclasses."""

from __future__ import annotations

from config.agent_config import (
    DatabotAgentConfig,
    IntentAgentConfig,
    PlanAgentConfig,
    ReactAgentConfig,
    agent_config_path,
)


def test_handoff_context_is_narrow() -> None:
    ctx = IntentAgentConfig(agent_config_path("intent")).run_context
    assert ctx["max_tool_calls"] == 30
    assert ctx["clarification_threshold"] == 0.85
    assert ctx["max_clarification_rounds"] == 2


def test_plan_context_has_no_tool_budget() -> None:
    ctx = PlanAgentConfig(agent_config_path("plan")).run_context
    assert "max_tool_calls" not in ctx
    assert ctx["max_idle_reason_rounds"] == 1
    assert "next_step" not in ctx


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


def test_react_context_merges_catalog_handoff() -> None:
    handoff = IntentAgentConfig(
        agent_config_path("intent"),
        run_overrides={"max_tool_calls": 99},
    ).run_context
    merged = ReactAgentConfig(
        agent_config_path("knowledge"),
        run_overrides=handoff,
    ).run_context
    knowledge = ReactAgentConfig(agent_config_path("knowledge")).run_context
    assert merged["max_tool_calls"] == 99
    assert knowledge["next_step"] in merged["next_step"] or merged["next_step"]
