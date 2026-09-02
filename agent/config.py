"""Shared configuration types for ReAct agents."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Union

from langchain_core.messages import AnyMessage
from pydantic import BaseModel

StateLike = Union[list[AnyMessage], dict[str, Any], BaseModel]


@dataclass
class AgentRunConfig:
    max_tool_calls: int = 10
    max_idle_rounds: int = 1
    max_tool_steps: int | None = None

    def __post_init__(self) -> None:
        if self.max_tool_steps is None:
            self.max_tool_steps = self.max_tool_calls


@dataclass
class AgentPromptConfig:
    next_step: str
    idle_nudge_prompt: str
    tool_budget_exhausted_prompt: str
    refine_user_profile_prompt: str
    idle_step: str = ""

    def __post_init__(self) -> None:
        if not self.idle_step:
            self.idle_step = self.idle_nudge_prompt


@dataclass
class RouterConfig:
    reason_idle_outlet: str = "step_llm"
    reason_action_outlet: str = "step_tools"
    reason_end_outlet: str = "__end__"
    action_reason_outlet: str = "step_llm"
    action_end_outlet: str = "__end__"
    # State-based exit: when every name in this tuple maps to a
    # truthy value in the run's state, the router forces
    # ``action_end_outlet`` (or ``reason_end_outlet``) immediately. This
    # replaces the older "wait for chat_completion ToolMessage" exit
    # signal — state itself is the contract, the LLM's job is just to
    # fill it. If a stage only needs ``chat_completion`` for the
    # user-facing one-line summary, it can still be in the tool list;
    # it's just no longer the exit gate.
    state_exit_keys: tuple[str, ...] = ()
