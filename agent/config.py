"""Shared types for ReAct agent runtime."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Union

from langchain_core.messages import AnyMessage
from pydantic import BaseModel

StateLike = Union[list[AnyMessage], dict[str, Any], BaseModel]


@dataclass
class AgentRunContext:
    """Per-run prompts and loop limits for a ReAct agent."""

    next_step: str = ""
    idle_nudge_prompt: str = ""
    tool_budget_exhausted_prompt: str = ""
    refine_user_profile_prompt: str = ""
    idle_step: str = ""
    max_tool_calls: int = 10
    max_idle_rounds: int = 1
    max_tool_steps: int | None = None

    def __post_init__(self) -> None:
        if self.max_tool_steps is None:
            self.max_tool_steps = self.max_tool_calls
        if not self.idle_step:
            self.idle_step = self.idle_nudge_prompt

    @classmethod
    def default(cls) -> AgentRunContext:
        from agent.runtime.prompt import (
            NEXT_STEP_PROMPT,
            REFINE_USER_PROFILE_PROMPT,
            TOOL_BUDGET_EXHAUSTED_PROMPT,
        )

        return cls(
            next_step=NEXT_STEP_PROMPT,
            idle_nudge_prompt="",
            tool_budget_exhausted_prompt=TOOL_BUDGET_EXHAUSTED_PROMPT,
            refine_user_profile_prompt=REFINE_USER_PROFILE_PROMPT,
        )


@dataclass
class RouterConfig:
    reason_idle_outlet: str = "step_reason"
    reason_action_outlet: str = "step_action"
    reason_end_outlet: str = "__end__"
    action_reason_outlet: str = "step_reason"
    action_end_outlet: str = "__end__"
    refine_user_profile_outlet: str = "refine_user_profile"
    # State-based exit: when every name in this tuple maps to a
    # truthy value in the run's state, the router ends immediately.
    # Used by staged subgraphs (fetch, SQL, plan). ReAct loops leave
    # this empty and end when the latest assistant message has no tool calls.
    state_exit_keys: tuple[str, ...] = ()
