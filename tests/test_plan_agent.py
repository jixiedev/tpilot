from __future__ import annotations

import pytest

from agent.registry import AGENTS, get_agent_tools
from agent.react.plan.plan_agent import PlanAgent
from agent.react.plan.prompt import PlanSystemPrompt, render_agent_cards
from agent.react.plan.tool_scopes import (
    TOOL_ID_ADJUST,
    TOOL_ID_CREATE,
    TOOL_ID_DEFAULT,
    TOOL_ID_SUBAGENT,
)


def test_plan_agent_registered() -> None:
    spec = AGENTS["plan"]
    assert spec.name == "plan"
    assert spec.intention is None


def test_plan_system_prompt_lists_specialists() -> None:
    prompt = PlanSystemPrompt().build()
    assert "Plan" in prompt
    assert "invoke_agent" in prompt
    cards = render_agent_cards()
    assert "databot" in cards
    assert "swe" in cards


def test_plan_tool_scopes_registered() -> None:
    create_names = {t.name for t in get_agent_tools("plan", TOOL_ID_CREATE)}
    assert "create_plan" in create_names

    subagent_names = {t.name for t in get_agent_tools("plan", TOOL_ID_SUBAGENT)}
    assert "planning" in subagent_names

    adjust_names = {t.name for t in get_agent_tools("plan", TOOL_ID_ADJUST)}
    assert "planning" in adjust_names

    default_names = {t.name for t in get_agent_tools("plan", TOOL_ID_DEFAULT)}
    assert "create_plan" in default_names
    assert "planning" in default_names
    assert "chat_completion" in default_names


@pytest.mark.asyncio
async def test_plan_agent_create_loads_default_tools() -> None:
    agent = await PlanAgent.create(enable_compression_tools=False)
    names = {getattr(tool, "name", "") for tool in agent.tools}
    assert "create_plan" in names
    assert "planning" in names
    assert "chat_completion" in names
