from __future__ import annotations

import pytest

from agent.registry import AGENTS, get_agent_tools
from agent.specialists.data_analysis.data_analysis_agent import DataAnalysisAgent
from agent.specialists.data_analysis.prompt import DataAnalysisSystemPrompt
from agent.specialists.swe.prompt import SWESystemPrompt
from agent.specialists.swe.swe_agent import SWEAgent


def test_data_analysis_agent_registered() -> None:
    spec = AGENTS["data_analysis"]
    assert spec.name == "data_analysis"
    assert spec.intention is None


def test_swe_agent_registered() -> None:
    spec = AGENTS["swe"]
    assert spec.name == "swe"
    assert spec.intention is None


def test_data_analysis_prompt_covers_sql_and_python() -> None:
    prompt = DataAnalysisSystemPrompt().build()
    assert "Data Analysis" in prompt
    assert "trino_run_query" in prompt
    assert "python_execute" in prompt
    assert "savefig" in prompt


def test_swe_prompt_covers_editor_and_shell() -> None:
    prompt = SWESystemPrompt().build()
    assert "SWE" in prompt
    assert "str_replace_editor" in prompt
    assert "bash" in prompt


@pytest.mark.asyncio
async def test_data_analysis_tools() -> None:
    agent = await DataAnalysisAgent.create(enable_compression_tools=False)
    names = {getattr(tool, "name", "") for tool in agent.tools}
    assert "chat_completion" in names
    assert "trino_run_query" in names
    assert "python_execute" in names
    assert "s3_list_objects" in names
    assert "planning" in names
    assert "bash" not in names


@pytest.mark.asyncio
async def test_swe_tools() -> None:
    agent = await SWEAgent.create(enable_compression_tools=False)
    names = {getattr(tool, "name", "") for tool in agent.tools}
    assert "chat_completion" in names
    assert "bash" in names
    assert "str_replace_editor" in names
    assert "python_execute" in names
    assert "planning" in names
    assert "web_search" in names
    assert "trino_run_query" not in names


def test_static_tool_bindings_present() -> None:
    analysis_names = {t.name for t in get_agent_tools("data_analysis", "default")}
    swe_names = {t.name for t in get_agent_tools("swe", "default")}
    assert "hive_desc_table" in analysis_names
    assert "str_replace_editor" in swe_names
