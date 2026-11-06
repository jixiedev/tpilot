"""Plan agent outer graph — create → execute → adjust loop → summary."""

from __future__ import annotations

import json
import logging
from collections.abc import Callable, Mapping
from pathlib import Path
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph

from agent.catalog import AgentCatalog
from agent.listener import ListenerHub
from agent.plan.plan_agent import (
    ADJUST_PLAN_NEXT_STEP,
    CREATE_PLAN_NEXT_STEP,
    DEFAULT_MAX_SUBAGENT_ROUNDS,
    DEFAULT_STAGE_MAX_TOOL_CALLS,
    NODE_ADJUST_PLAN,
    NODE_CREATE_PLAN,
    NODE_PREPARE_TURN,
    NODE_SUB_AGENT_ROUND,
    NODE_SUMMARY,
    REGISTRY_NAME,
    STAGE_ADJUST,
    STAGE_DONE,
    STAGE_EXECUTE,
    SUBAGENT_NEXT_STEP,
    SUMMARY_SYSTEM_PROMPT,
    TOOL_ID_ADJUST,
    TOOL_ID_CREATE,
    TOOL_ID_SUBAGENT,
    PlanState,
)
from agent.plan.stage_tools import SpecialistRunner
from agent.router import CompletionToolRouter, StageCompleteFn
from agent.runtime.prompt import TOOL_BUDGET_EXHAUSTED_PROMPT
from graph.builder import ReactLoopSpec, ReactStateSpec, build_react_graph
from graph.error_recovery import invoke_with_transient_retry
from graph.messages import message_content_to_str
from graph.state import latest_human_text
from tools.registry import find_tool
from tools.plan import run_planning

logger = logging.getLogger(__name__)


# Each stage subgraph starts with a fresh tool budget (``PlanState.stage_start``),
# so create, every execute round and adjust each get ``max_tool_calls`` batches.
_PLAN_STATE = ReactStateSpec(state_class=PlanState, turn_init=PlanState.stage_start)


def _stage_loop(next_step: str, max_tool_calls: int) -> ReactLoopSpec:
    return ReactLoopSpec(
        next_step,
        tool_budget_exhausted_prompt=TOOL_BUDGET_EXHAUSTED_PROMPT,
        max_tool_calls=max_tool_calls,
    )

class PlanSubgraphs:
    """Compile Plan's create / execute / adjust ReAct subgraphs."""

    @staticmethod
    def create_stage_complete(state: Mapping[str, Any]) -> bool:
        return bool(state.get("plan_id"))

    @staticmethod
    def exit_router(
        *,
        max_tool_calls: int,
        max_idle_reason_rounds: int = 1,
        stage_complete: StageCompleteFn | None = None,
    ) -> CompletionToolRouter:
        """Stage router; ``max_idle_reason_rounds`` only matters with ``stage_complete``."""
        return CompletionToolRouter(
            {
                "max_tool_calls": max_tool_calls,
                "max_idle_reason_rounds": max_idle_reason_rounds,
            },
            stage_complete=stage_complete,
        )

    @staticmethod
    def require_tool(tools: list[BaseTool], name: str, scope: str) -> None:
        if find_tool(tools, name) is None:
            raise KeyError(f"plan: {name} missing from identifier {scope!r}")

    @classmethod
    def create_plan(
        cls,
        model: BaseChatModel,
        *,
        checkpointer: Any,
        max_tool_calls: int = DEFAULT_STAGE_MAX_TOOL_CALLS,
        max_idle_reason_rounds: int = 1,
    ) -> CompiledStateGraph:
        """Single-round ReAct: LLM must call ``create_plan`` then exit.

        Plain-text replies before ``plan_id`` is set are retried up to
        ``max_idle_reason_rounds`` times.
        """
        tools = AgentCatalog.tools_for(REGISTRY_NAME, TOOL_ID_CREATE)
        cls.require_tool(tools, "create_plan", TOOL_ID_CREATE)
        router = cls.exit_router(
            max_tool_calls=max_tool_calls,
            max_idle_reason_rounds=max_idle_reason_rounds,
            stage_complete=cls.create_stage_complete,
        )
        return build_react_graph(
            model,
            tools,
            checkpointer=checkpointer,
            router=router,
            loop=_stage_loop(CREATE_PLAN_NEXT_STEP, max_tool_calls),
            state=_PLAN_STATE,
        )

    @classmethod
    def run_subagent(
        cls,
        model: BaseChatModel,
        runner: SpecialistRunner,
        *,
        checkpointer: Any,
        max_tool_calls: int = DEFAULT_STAGE_MAX_TOOL_CALLS,
        listener: ListenerHub | None = None,
    ) -> CompiledStateGraph:
        """ReAct loop: delegate to specialists until plain text or budget ends."""
        tools = list(AgentCatalog.tools_for(REGISTRY_NAME, TOOL_ID_SUBAGENT))
        tools.append(runner.invoke_tool())
        cls.require_tool(tools, "planning", TOOL_ID_SUBAGENT)
        router = cls.exit_router(max_tool_calls=max_tool_calls)
        return build_react_graph(
            model,
            tools,
            checkpointer=checkpointer,
            router=router,
            listener=listener,
            loop=_stage_loop(SUBAGENT_NEXT_STEP, max_tool_calls),
            state=_PLAN_STATE,
        )

    @classmethod
    def adjust_plan(
        cls,
        model: BaseChatModel,
        *,
        checkpointer: Any,
        max_tool_calls: int = DEFAULT_STAGE_MAX_TOOL_CALLS,
    ) -> CompiledStateGraph:
        """Review progress; planning tool calls route back to execution."""
        tools = AgentCatalog.tools_for(REGISTRY_NAME, TOOL_ID_ADJUST)
        cls.require_tool(tools, "planning", TOOL_ID_ADJUST)
        router = cls.exit_router(max_tool_calls=max_tool_calls)
        return build_react_graph(
            model,
            tools,
            checkpointer=checkpointer,
            router=router,
            loop=_stage_loop(ADJUST_PLAN_NEXT_STEP, max_tool_calls),
            state=_PLAN_STATE,
        )


# ---------------------------------------------------------------------------
# Compile the Plan create → execute → adjust → summary state machine.
# ---------------------------------------------------------------------------

def increment_subagent_round(state: PlanState) -> dict[str, Any]:
    rounds = int(state.get("subagent_rounds") or 0) + 1
    return {"subagent_rounds": rounds, "stage": STAGE_EXECUTE, "adjust_had_tool_calls": False}

def prep_adjust(state: PlanState) -> dict[str, Any]:
    return {"stage": STAGE_ADJUST, "adjust_had_tool_calls": False}

def route_after_create(state: PlanState) -> str:
    if (state.get("plan_id") or "").strip():
        return "increment_subagent_round"
    return NODE_SUMMARY

def make_route_after_adjust(
    max_subagent_rounds: int = DEFAULT_MAX_SUBAGENT_ROUNDS,
) -> Callable[[PlanState], str]:
    def route_after_adjust(state: PlanState) -> str:
        rounds = int(state.get("subagent_rounds") or 0)
        if state.get("adjust_had_tool_calls") and rounds < max_subagent_rounds:
            return "increment_subagent_round"
        return NODE_SUMMARY

    return route_after_adjust


route_after_adjust = make_route_after_adjust()

def snapshot(state: PlanState) -> str:
    plan_id = (state.get("plan_id") or "").strip()
    if not plan_id:
        return "(no plan created)"
    try:
        return run_planning("get", plan_id=plan_id)
    except Exception as exc:
        return f"(plan snapshot unavailable: {exc})"

def summary_node(model: BaseChatModel) -> Callable[[PlanState], dict[str, Any]]:
    def summary(state: PlanState) -> dict[str, Any]:
        question = (state.get("user_question") or "").strip() or latest_human_text(state) or ""
        payload = {
            "plan": snapshot(state),
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

def entry(state: PlanState) -> dict[str, Any]:
    patch: dict[str, Any] = {}
    question = latest_human_text(state) or ""
    if question:
        patch["user_question"] = question
    stage = state.get("stage") or ""
    if stage == STAGE_DONE and question:
        patch.update(PlanState.baseline())
        patch["user_question"] = question
    return patch

def build_plan_graph(
    model: BaseChatModel,
    runner: SpecialistRunner,
    *,
    checkpointer: BaseCheckpointSaver,
    max_tool_calls: int = DEFAULT_STAGE_MAX_TOOL_CALLS,
    max_subagent_rounds: int = DEFAULT_MAX_SUBAGENT_ROUNDS,
    max_idle_reason_rounds: int = 1,
    profile_dir: Path | None = None,
    listener: ListenerHub | None = None,
) -> CompiledStateGraph:
    """Compile the plan graph.

    ``max_tool_calls`` is the tool-batch budget of each stage run (create, each
    execute round, adjust); ``max_subagent_rounds`` caps execute/adjust cycles
    per turn; ``max_idle_reason_rounds`` applies to the create stage.
    ``PlanAgent`` passes its resolved ``run_context`` values.
    """
    del profile_dir  # reserved for future artifact persistence

    create_subgraph = PlanSubgraphs.create_plan(
        model,
        checkpointer=checkpointer,
        max_tool_calls=max_tool_calls,
        max_idle_reason_rounds=max_idle_reason_rounds,
    )
    subagent_subgraph = PlanSubgraphs.run_subagent(
        model,
        runner,
        checkpointer=checkpointer,
        max_tool_calls=max_tool_calls,
        listener=listener,
    )
    adjust_subgraph = PlanSubgraphs.adjust_plan(
        model,
        checkpointer=checkpointer,
        max_tool_calls=max_tool_calls,
    )

    graph = StateGraph(PlanState)
    graph.add_node(NODE_PREPARE_TURN, entry)
    graph.add_node(NODE_CREATE_PLAN, create_subgraph)
    graph.add_node("increment_subagent_round", increment_subagent_round)
    graph.add_node(NODE_SUB_AGENT_ROUND, subagent_subgraph)
    graph.add_node("prep_adjust", prep_adjust)
    graph.add_node(NODE_ADJUST_PLAN, adjust_subgraph)
    graph.add_node(NODE_SUMMARY, summary_node(model))

    graph.add_edge(START, NODE_PREPARE_TURN)
    graph.add_edge(NODE_PREPARE_TURN, NODE_CREATE_PLAN)
    graph.add_conditional_edges(
        NODE_CREATE_PLAN,
        route_after_create,
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
        make_route_after_adjust(max_subagent_rounds),
        {
            "increment_subagent_round": "increment_subagent_round",
            NODE_SUMMARY: NODE_SUMMARY,
        },
    )
    graph.add_edge(NODE_SUMMARY, END)

    return graph.compile(checkpointer=checkpointer)
