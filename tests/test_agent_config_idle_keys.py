"""Idle-retry keys are resolved only for loops that can retry (stage contracts)."""

from __future__ import annotations

from config.agent_config import (
    AgentConfig,
    DatabotAgentConfig,
    ReactAgentConfig,
    agent_config_path,
)


def test_pure_react_context_has_no_inert_idle_keys() -> None:
    for name in ("knowledge", "diagnostic", "data_analysis", "swe"):
        ctx = ReactAgentConfig(
            agent_config_path(name),
            run_overrides={"max_idle_reason_rounds": 5, "idle_step": "x"},
        ).run_context
        assert "max_idle_reason_rounds" not in ctx, name
        assert "idle_nudge_prompt" not in ctx, name
        assert "idle_step" not in ctx, name
        assert ctx["max_tool_calls"] == 10


def test_databot_layers_keep_idle_retry_keys_without_idle_step() -> None:
    react = DatabotAgentConfig(agent_config_path("databot")).run_context["react"]
    for stage in ("fetch", "sql"):
        layer = react[stage]
        assert layer["max_idle_reason_rounds"] == 1
        assert layer["idle_nudge_prompt"].strip()
        assert "idle_step" not in layer
        assert AgentConfig.as_int(layer, "max_tool_calls") == 10
