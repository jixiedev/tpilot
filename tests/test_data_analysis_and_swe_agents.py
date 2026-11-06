from __future__ import annotations

import pytest
from langgraph.checkpoint.memory import MemorySaver

from agent.catalog import AgentCatalog, AgentCatalogSettings
from agent.specialists.data_analysis import DataAnalysisSystemPrompt
from agent.specialists.swe import SWESystemPrompt
from memory.profile_store import FileProfileStore
from tests.minimal_chat_model import MinimalChatModel


def test_data_analysis_agent_registered() -> None:
    config = AgentCatalog.config("data_analysis")
    assert config.name == "data_analysis"
    assert config.intention == "ANALYSIS"


def test_swe_agent_registered() -> None:
    config = AgentCatalog.config("swe")
    assert config.name == "swe"
    assert config.intention == "SWE"


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
async def test_data_analysis_tools(tmp_path) -> None:
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            "data_analysis",
            profile_store=FileProfileStore(tmp_path),
            model=MinimalChatModel(),
            checkpointer=MemorySaver(),
        )
    )
    agent = await catalog.create("data_analysis")
    names = {getattr(tool, "name", "") for tool in agent.tools}
    assert "trino_run_query" in names
    assert "python_execute" in names
    assert "s3_list_objects" in names
    assert "planning" in names
    assert "bash" not in names


@pytest.mark.asyncio
async def test_swe_tools(tmp_path) -> None:
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            "swe",
            profile_store=FileProfileStore(tmp_path),
            model=MinimalChatModel(),
            checkpointer=MemorySaver(),
        )
    )
    agent = await catalog.create("swe")
    names = {getattr(tool, "name", "") for tool in agent.tools}
    assert "bash" in names
    assert "str_replace_editor" in names
    assert "python_execute" in names
    assert "planning" in names
    assert "web_search" in names
    assert "trino_run_query" not in names


def test_static_tool_bindings_present() -> None:
    analysis_names = {t.name for t in AgentCatalog.tools_for("data_analysis", "default")}
    swe_names = {t.name for t in AgentCatalog.tools_for("swe", "default")}
    assert "hive_desc_table" in analysis_names
    assert "str_replace_editor" in swe_names
