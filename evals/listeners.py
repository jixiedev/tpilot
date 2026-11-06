"""Eval listeners and scoring types for evals."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from langchain_core.messages import AIMessage

from agent.listener import AgentListener
from graph.state import SessionAgentState


@dataclass
class ToolCallRecord:
    name: str
    args: dict[str, Any]


@dataclass
class ToolResultRecord:
    name: str
    content: Any


class EvalReactListener(AgentListener):
    """Records reason steps and tool traffic for a single eval turn."""

    def __init__(self) -> None:
        self.tool_calls: list[ToolCallRecord] = []
        self.tool_results: list[ToolResultRecord] = []
        self.reason_steps: list[AIMessage] = []
        self.turn_output: str | None = None

    def reset(self) -> None:
        self.tool_calls.clear()
        self.tool_results.clear()
        self.reason_steps.clear()
        self.turn_output = None

    def on_tool_call(self, name: str, args: dict) -> None:
        self.tool_calls.append(ToolCallRecord(name=name, args=dict(args or {})))

    def on_tool_result(self, name: str, content: Any) -> None:
        self.tool_results.append(ToolResultRecord(name=name, content=content))

    def on_reason_step(self, message: AIMessage) -> None:
        self.reason_steps.append(message)

    def on_turn_output(self, state: SessionAgentState) -> None:
        return None

    def tool_names(self) -> list[str]:
        return [record.name for record in self.tool_calls]

    @property
    def reason_round_count(self) -> int:
        """Count reason steps that issued at least one tool call.

        The final answer step (no tool calls) is not a round, so a turn that
        answers directly has 0 rounds; ``ToolCallCase`` scores that 1.0 when the
        case budgets ``total_rounds: 0``.
        """
        count = 0
        for message in self.reason_steps:
            if getattr(message, "tool_calls", None):
                count += 1
        return count


@dataclass
class CaseScore:
    """Per-dimension scores in ``[0, 1]`` plus an equal-weight total."""

    tool_score: float
    round_score: float
    answer_score: float
    details: dict[str, Any] = field(default_factory=dict)

    @property
    def total(self) -> float:
        return (self.tool_score + self.round_score + self.answer_score) / 3.0
