"""Per-stage subgraphs for the Plan agent."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.graph.state import CompiledStateGraph

from agent.config import AgentRunContext, RouterConfig
from agent.plan._constants import DEFAULT_STAGE_MAX_TOOL_CALLS
from agent.plan.prompt import (
    ADJUST_PLAN_NEXT_STEP,
    ADJUST_PLAN_SYSTEM_PROMPT,
    CREATE_PLAN_NEXT_STEP,
    CREATE_PLAN_SYSTEM_PROMPT,
    SUBAGENT_NEXT_STEP,
    SUBAGENT_SYSTEM_PROMPT,
)
from agent.plan.stage_tools import SpecialistRunner, make_invoke_agent_tool
from agent.plan.state import PlanState
from agent.plan.tool_scopes import (
    TOOL_ID_ADJUST,
    TOOL_ID_CREATE,
    TOOL_ID_SUBAGENT,
    plan_tools,
)
from agent.router import CompletionToolRouter
from graph.builder import build_react_graph, static_system_prompt
from tools.common import find_tool


def _stage_state_exit_router(
    *,
    max_tool_calls: int,
    max_idle_rounds: int,
    state_exit_keys: tuple[str, ...] = (),
) -> tuple[Callable[[Any], str], Callable[[Any], str]]:
    run_context = AgentRunContext(
        max_tool_calls=max_tool_calls,
        max_idle_rounds=max_idle_rounds,
    )
    router_config = RouterConfig(
        action_end_outlet="__end__",
        state_exit_keys=state_exit_keys,
    )
    router = CompletionToolRouter(
        run_context,
        router_config,
        completion_tool_name=None,
    )
    return router.route_after_reason(), router.route_after_action()


def _require_tool(tools: list[BaseTool], name: str, scope: str) -> None:
    if find_tool(tools, name) is None:
        raise KeyError(f"plan: {name} missing from identifier {scope!r}")


def build_create_plan_subgraph(
    model: BaseChatModel,
    *,
    checkpointer: Any,
    max_tool_calls: int = DEFAULT_STAGE_MAX_TOOL_CALLS,
) -> CompiledStateGraph:
    """Single-round ReAct: LLM must call ``create_plan`` then exit."""
    tools = plan_tools(TOOL_ID_CREATE)
    _require_tool(tools, "create_plan", TOOL_ID_CREATE)
    route_reason, route_action = _stage_state_exit_router(
        max_tool_calls=max_tool_calls,
        max_idle_rounds=1,
        state_exit_keys=("plan_id",),
    )
    return build_react_graph(
        model,
        tools,
        checkpointer=checkpointer,
        system_prompt=static_system_prompt(CREATE_PLAN_SYSTEM_PROMPT),
        next_step_prompt=CREATE_PLAN_NEXT_STEP,
        route_after_reason=route_reason,
        route_after_action=route_action,
        max_tool_calls=max_tool_calls,
        state_class=PlanState,
    )


def build_run_subagent_subgraph(
    model: BaseChatModel,
    runner: SpecialistRunner,
    *,
    checkpointer: Any,
    max_tool_calls: int = DEFAULT_STAGE_MAX_TOOL_CALLS,
    max_idle_rounds: int = 1,
    on_tool_call: Callable[[str, dict[str, Any]], None] | None = None,
    on_tool_result: Callable[[str, Any], None] | None = None,
) -> CompiledStateGraph:
    """ReAct loop: delegate to specialists until plain text or budget ends."""
    tools = list(plan_tools(TOOL_ID_SUBAGENT))
    invoke_tool = make_invoke_agent_tool(runner)
    tools.append(invoke_tool)
    _require_tool(tools, "planning", TOOL_ID_SUBAGENT)
    route_reason, route_action = _stage_state_exit_router(
        max_tool_calls=max_tool_calls,
        max_idle_rounds=max_idle_rounds,
    )
    return build_react_graph(
        model,
        tools,
        checkpointer=checkpointer,
        system_prompt=static_system_prompt(SUBAGENT_SYSTEM_PROMPT),
        next_step_prompt=SUBAGENT_NEXT_STEP,
        route_after_reason=route_reason,
        route_after_action=route_action,
        max_tool_calls=max_tool_calls,
        on_tool_call=on_tool_call,
        on_tool_result=on_tool_result,
        state_class=PlanState,
    )


def build_adjust_plan_subgraph(
    model: BaseChatModel,
    *,
    checkpointer: Any,
    max_tool_calls: int = DEFAULT_STAGE_MAX_TOOL_CALLS,
) -> CompiledStateGraph:
    """Review progress; planning tool calls route back to execution."""
    tools = plan_tools(TOOL_ID_ADJUST)
    _require_tool(tools, "planning", TOOL_ID_ADJUST)
    route_reason, route_action = _stage_state_exit_router(
        max_tool_calls=max_tool_calls,
        max_idle_rounds=1,
    )
    return build_react_graph(
        model,
        tools,
        checkpointer=checkpointer,
        system_prompt=static_system_prompt(ADJUST_PLAN_SYSTEM_PROMPT),
        next_step_prompt=ADJUST_PLAN_NEXT_STEP,
        route_after_reason=route_reason,
        route_after_action=route_action,
        max_tool_calls=max_tool_calls,
        state_class=PlanState,
    )
