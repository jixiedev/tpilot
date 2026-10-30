"""Shared types for ReAct agent runtime."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Union

from langchain_core.messages import AnyMessage
from pydantic import BaseModel
from agent.runtime.prompt import (
            NEXT_STEP_PROMPT,
            REFINE_USER_PROFILE_PROMPT,
            TOOL_BUDGET_EXHAUSTED_PROMPT,
        )

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

    def __init__(self,
                 next_step: str = NEXT_STEP_PROMPT,
                 idle_nudge_prompt: str = "",
                 tool_budget_exhausted_prompt: str = TOOL_BUDGET_EXHAUSTED_PROMPT,
                 refine_user_profile_prompt: str = REFINE_USER_PROFILE_PROMPT,
                 idle_step: str = "",
                 max_tool_calls: int = 10,
                 max_idle_rounds: int = 1,
                 max_tool_steps: int | None = None
    ):
        self.next_step = next_step
        self.idle_nudge_prompt = idle_nudge_prompt
        self.tool_budget_exhausted_prompt = tool_budget_exhausted_prompt
        self.refine_user_profile_prompt = refine_user_profile_prompt
        self.idle_step = idle_step or self.idle_nudge_prompt
        self.max_tool_calls = max_tool_calls
        self.max_idle_rounds = max_idle_rounds
        self.max_tool_steps = max_tool_steps or self.max_tool_calls


DEFAULT_AGENT_RUN_CONTEXT = AgentRunContext()

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
