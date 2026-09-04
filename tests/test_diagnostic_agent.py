from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from agent.registry import AGENTS, get_agent_tools
from agent.specialists.diagnostic.diagnostic_agent import DiagnosticAgent
from agent.specialists.diagnostic.prompt import DiagnosticSystemPrompt
from tools.dynamic import register_dynamic_tool_bindings, reset_dynamic_tool_bindings


@pytest.fixture(autouse=True)
def _reset_dynamic_bindings() -> None:
    reset_dynamic_tool_bindings()


def test_diagnostic_agent_registered() -> None:
    spec = AGENTS["diagnostic"]
    assert spec.name == "diagnostic"
    assert spec.accepted_mcp["default"] == ("airflow_tahoe", "airflow_legacy")
    assert spec.intention is None


def test_diagnostic_system_prompt_covers_infra_tools() -> None:
    prompt = DiagnosticSystemPrompt().build()
    assert "Diagnostic" in prompt
    assert "k8s_" in prompt
    assert "s3_" in prompt
    assert "trino_" in prompt
    assert "hive_" in prompt
    assert "Airflow" in prompt


@pytest.mark.asyncio
async def test_diagnostic_tools_include_infra_and_airflow_mcp() -> None:
    tahoe_tool = MagicMock()
    tahoe_tool.name = "get_dag_runs"
    legacy_tool = MagicMock()
    legacy_tool.name = "get_log"

    async def _fake_get_tools(server_name: str) -> list:
        if server_name == "airflow_tahoe":
            return [tahoe_tool]
        if server_name == "airflow_legacy":
            return [legacy_tool]
        return []

    with patch(
        "tools.dynamic.get_tools_for_server",
        side_effect=_fake_get_tools,
    ):
        agent = await DiagnosticAgent.create(enable_compression_tools=False)

    names = {getattr(tool, "name", "") for tool in agent.tools}
    assert "get_dag_runs" in names
    assert "get_log" in names
    assert "k8s_list_pods" in names
    assert "s3_list_objects" in names
    assert "trino_list_tables" in names
    assert "hive_desc_table" in names


@pytest.mark.asyncio
async def test_register_dynamic_bindings_loads_both_airflow_servers() -> None:
    calls: list[str] = []

    async def _fake_get_tools(server_name: str) -> list:
        calls.append(server_name)
        tool = MagicMock()
        tool.name = f"{server_name}_tool"
        return [tool]

    with patch(
        "tools.dynamic.get_tools_for_server",
        side_effect=_fake_get_tools,
    ):
        await register_dynamic_tool_bindings()

    names = [t.name for t in get_agent_tools("diagnostic", "default")]
    assert "airflow_tahoe_tool" in names
    assert "airflow_legacy_tool" in names
    assert "airflow_tahoe" in calls
    assert "airflow_legacy" in calls
