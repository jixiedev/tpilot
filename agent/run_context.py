"""Shared types for agent runtime (run context, router, state)."""

from __future__ import annotations

from typing import Any, TypedDict, Union

from langchain_core.messages import AnyMessage
from pydantic import BaseModel

StateLike = Union[list[AnyMessage], dict[str, Any], BaseModel]


class HandoffRunContext(TypedDict, total=False):
    """Intent orchestrator defaults when constructing delegated specialists."""

    max_tool_calls: int
    clarification_threshold: float
    max_clarification_rounds: int


class StageRunContext(TypedDict, total=False):
    """Staged orchestrators (Plan, Databot): per-stage ReAct budgets."""

    max_tool_calls: int
    max_idle_reason_rounds: int
    max_subagent_rounds: int


class ReactRunContext(TypedDict, total=False):
    """ReAct loop limits and step prompts (:class:`BaseReactAgent` and subgraphs)."""

    max_tool_calls: int
    max_idle_reason_rounds: int
    next_step: str
    idle_nudge_prompt: str
    tool_budget_exhausted_prompt: str
    refine_user_profile_prompt: str
    fetch_instruction: str
    sql_instruction: str


class DatabotGatesConfig(TypedDict, total=False):
    """Human gate toggles for the cards and SQL review steps."""

    cards_enabled: bool
    sql_enabled: bool


class DatabotRunContext(TypedDict, total=False):
    """Databot pipeline settings plus nested ReAct contexts per stage."""

    max_tool_calls: int
    max_idle_reason_rounds: int
    react: dict[str, ReactRunContext]
    gates: DatabotGatesConfig
    prepare_cards_for_gate_prompt: str
    turn_summary_system_prompt: str


# Backward-compatible alias.
ReactContext = ReactRunContext

PlanRunContext = StageRunContext
