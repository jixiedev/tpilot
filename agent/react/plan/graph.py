"""Plan agent outer graph — create → execute → adjust loop → summary."""

from __future__ import annotations

import json
import logging
from collections.abc import Callable
from pathlib import Path
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph

from agent.react.plan._constants import (
    DEFAULT_MAX_SUBAGENT_ROUNDS,
    DEFAULT_STAGE_MAX_TOOL_CALLS,
    NODE_ADJUST_PLAN,
    NODE_CREATE_PLAN,
    NODE_INJECT_SYSTEM_PROMPT,
    NODE_SUB_AGENT_ROUND,
    NODE_SUMMARY,
    STAGE_ADJUST,
    STAGE_DONE,
    STAGE_EXECUTE,
)
from agent.react.plan.prompt import PlanSystemPrompt, SUMMARY_SYSTEM_PROMPT
from agent.react.plan.stage_tools import SpecialistRunner
from agent.react.plan.state import PlanState, fresh_turn_state_defaults
from agent.react.plan.subgraphs import (
    build_adjust_plan_subgraph,
    build_create_plan_subgraph,
    build_run_subagent_subgraph,
)
from graph.builder import SystemPromptSpec, make_inject_system_prompt_node
from graph.error_recovery import invoke_with_transient_retry
from graph.messages import message_content_to_str
from state.state import latest_human_text
from tools.plan import run_planning

logger = logging.getLogger(__name__)


def make_increment_subagent_round_node() -> Callable[[PlanState], dict[str, Any]]:
    def increment_round(state: PlanState) -> dict[str, Any]:
        rounds = int(state.get("subagent_rounds") or 0) + 1
        return {"subagent_rounds": rounds, "stage": STAGE_EXECUTE, "adjust_had_tool_calls": False}

    return increment_round


def make_prep_adjust_node() -> Callable[[PlanState], dict[str, Any]]:
    def prep_adjust(state: PlanState) -> dict[str, Any]:
        return {"stage": STAGE_ADJUST, "adjust_had_tool_calls": False}

    return prep_adjust


def _route_after_create(state: PlanState) -> str:
    if (state.get("plan_id") or "").strip():
        return "increment_subagent_round"
    return NODE_SUMMARY


def _route_after_adjust(state: PlanState) -> str:
    rounds = int(state.get("subagent_rounds") or 0)
    if state.get("adjust_had_tool_calls") and rounds < DEFAULT_MAX_SUBAGENT_ROUNDS:
        return "increment_subagent_round"
    return NODE_SUMMARY


def _plan_snapshot(state: PlanState) -> str:
    plan_id = (state.get("plan_id") or "").strip()
    if not plan_id:
        return "(no plan created)"
    try:
        return run_planning("get", plan_id=plan_id)
    except Exception as exc:
        return f"(plan snapshot unavailable: {exc})"


def make_summary_node(model: BaseChatModel) -> Callable[[PlanState], dict[str, Any]]:
    def summary(state: PlanState) -> dict[str, Any]:
        question = (state.get("user_question") or "").strip() or latest_human_text(state) or ""
        payload = {
            "plan": _plan_snapshot(state),
            "step_results": state.get("step_results") or [],
            "subagent_rounds": state.get("subagent_rounds") or 0,
        }
        prompt_messages = [
            SystemMessage(content=SUMMARY_SYSTEM_PROMPT),
            HumanMessage(
                content=(
                    f"User question:\n{question or '(not found)'}\n\n"
                    f"Pipeline artifacts (JSON):\n"
                    f"{json.dumps(payload, ensure_ascii=False, indent=2)}"
                )
            ),
        ]
        try:
            response = invoke_with_transient_retry(lambda: model.invoke(prompt_messages))
            text = message_content_to_str(getattr(response, "content", response))
        except Exception as exc:
            logger.warning("plan summary LLM call failed: %s", exc)
            text = ""
        if not text and payload["step_results"]:
            last = payload["step_results"][-1]
            text = str(last.get("output") or "").strip()
        if not text:
            text = "Plan turn finished but no summary was produced."
        return {"messages": [AIMessage(content=text)], "stage": STAGE_DONE}

    return summary


def make_plan_entry_node(
    system_prompt: SystemPromptSpec,
) -> Callable[[PlanState], dict[str, Any]]:
    inject = make_inject_system_prompt_node(system_prompt)

    def entry(state: PlanState) -> dict[str, Any]:
        patch: dict[str, Any] = dict(inject(state) or {})
        question = latest_human_text(state) or ""
        if question:
            patch["user_question"] = question
        stage = state.get("stage") or ""
        if stage == STAGE_DONE and question:
            patch.update(fresh_turn_state_defaults())
            patch["user_question"] = question
        return patch

    return entry


def build_plan_graph(
    model: BaseChatModel,
    runner: SpecialistRunner,
    *,
    checkpointer: BaseCheckpointSaver,
    system_prompt: str | SystemPromptSpec = PlanSystemPrompt,
    max_tool_calls: int = DEFAULT_STAGE_MAX_TOOL_CALLS,
    profile_dir: Path | None = None,
) -> CompiledStateGraph:
    """Compile the Plan create → execute → adjust → summary state machine."""
    del profile_dir  # reserved for future artifact persistence

    create_subgraph = build_create_plan_subgraph(
        model,
        checkpointer=checkpointer,
        max_tool_calls=max_tool_calls,
    )
    subagent_subgraph = build_run_subagent_subgraph(
        model,
        runner,
        checkpointer=checkpointer,
        max_tool_calls=max_tool_calls,
    )
    adjust_subgraph = build_adjust_plan_subgraph(
        model,
        checkpointer=checkpointer,
        max_tool_calls=max_tool_calls,
    )

    graph = StateGraph(PlanState)
    graph.add_node(NODE_INJECT_SYSTEM_PROMPT, make_plan_entry_node(system_prompt))
    graph.add_node(NODE_CREATE_PLAN, create_subgraph)
    graph.add_node("increment_subagent_round", make_increment_subagent_round_node())
    graph.add_node(NODE_SUB_AGENT_ROUND, subagent_subgraph)
    graph.add_node("prep_adjust", make_prep_adjust_node())
    graph.add_node(NODE_ADJUST_PLAN, adjust_subgraph)
    graph.add_node(NODE_SUMMARY, make_summary_node(model))

    graph.add_edge(START, NODE_INJECT_SYSTEM_PROMPT)
    graph.add_edge(NODE_INJECT_SYSTEM_PROMPT, NODE_CREATE_PLAN)
    graph.add_conditional_edges(
        NODE_CREATE_PLAN,
        _route_after_create,
        {
            "increment_subagent_round": "increment_subagent_round",
            NODE_SUMMARY: NODE_SUMMARY,
        },
    )
    graph.add_edge("increment_subagent_round", NODE_SUB_AGENT_ROUND)
    graph.add_edge(NODE_SUB_AGENT_ROUND, "prep_adjust")
    graph.add_edge("prep_adjust", NODE_ADJUST_PLAN)
    graph.add_conditional_edges(
        NODE_ADJUST_PLAN,
        _route_after_adjust,
        {
            "increment_subagent_round": "increment_subagent_round",
            NODE_SUMMARY: NODE_SUMMARY,
        },
    )
    graph.add_edge(NODE_SUMMARY, END)

    return graph.compile(checkpointer=checkpointer)
