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
            IDLE_CHAT_COMPLETION_PROMPT,
            NEXT_STEP_PROMPT,
            REFINE_USER_PROFILE_PROMPT,
            TOOL_BUDGET_EXHAUSTED_PROMPT,
        )

        return cls(
            next_step=NEXT_STEP_PROMPT,
            idle_nudge_prompt=IDLE_CHAT_COMPLETION_PROMPT,
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
    inject_completion_outlet: str = "inject_completion_as_ai"
    # State-based exit: when every name in this tuple maps to a
    # truthy value in the run's state, the router forces
    # ``action_end_outlet`` (or ``reason_end_outlet``) immediately. This
    # replaces the older "wait for chat_completion ToolMessage" exit
    # signal — state itself is the contract, the LLM's job is just to
    # fill it. If a stage only needs ``chat_completion`` for the
    # user-facing one-line summary, it can still be in the tool list;
    # it's just no longer the exit gate.
    state_exit_keys: tuple[str, ...] = ()
