from __future__ import annotations

import pytest
from langgraph.checkpoint.memory import MemorySaver

from agent.catalog import AgentCatalog, AgentCatalogSettings
from agent.plan.plan_agent import (
    TOOL_ID_ADJUST,
    TOOL_ID_CREATE,
    TOOL_ID_DEFAULT,
    TOOL_ID_SUBAGENT,
    PlanSystemPrompt,
)
from memory.profile_store import FileProfileStore
from tests.minimal_chat_model import MinimalChatModel


def test_plan_agent_registered() -> None:
    config = AgentCatalog.config("plan")
    assert config.name == "plan"
    assert config.intention == "PLAN"


def test_plan_system_prompt_lists_specialists() -> None:
    prompt = PlanSystemPrompt().build()
    assert "Plan" in prompt
    assert "invoke_agent" in prompt
    cards = PlanSystemPrompt.agent_cards()
    assert "databot" in cards
    assert "swe" in cards


def test_plan_tool_scopes_registered() -> None:
    create_names = {t.name for t in AgentCatalog.tools_for("plan", TOOL_ID_CREATE)}
    assert "create_plan" in create_names

    subagent_names = {t.name for t in AgentCatalog.tools_for("plan", TOOL_ID_SUBAGENT)}
    assert "planning" in subagent_names

    adjust_names = {t.name for t in AgentCatalog.tools_for("plan", TOOL_ID_ADJUST)}
    assert "planning" in adjust_names

    default_names = {t.name for t in AgentCatalog.tools_for("plan", TOOL_ID_DEFAULT)}
    assert "create_plan" in default_names
    assert "planning" in default_names


@pytest.mark.asyncio
async def test_plan_agent_builds_graph(tmp_path) -> None:
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            "plan",
            profile_store=FileProfileStore(tmp_path),
            model=MinimalChatModel(),
            checkpointer=MemorySaver(),
        )
    )
    agent = await catalog.create("plan")
    assert agent.graph is not None
