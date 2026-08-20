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
    step_idle_outlet: str = "step_llm"
    step_tools_outlet: str = "step_tools"
    step_end_outlet: str = "__end__"
    tool_step_outlet: str = "step_llm"
    tool_end_outlet: str = "__end__"
