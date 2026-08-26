"""Turn observers for eval and monitoring."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from langchain_core.messages import AIMessage

from agent.listener import ReactAgentListener
from state.state import SessionAgentState


@dataclass
class ToolCallRecord:
    name: str
    args: dict[str, Any]


@dataclass
class ToolResultRecord:
    name: str
    content: Any


class Observer(ReactAgentListener):
    """Records LLM steps and tool traffic for a single eval turn."""

    def __init__(
        self,
        *,
        completion_tool_name: str = "chat_completion",
    ) -> None:
        self.completion_tool_name = completion_tool_name
        self.tool_calls: list[ToolCallRecord] = []
        self.tool_results: list[ToolResultRecord] = []
        self.llm_steps: list[AIMessage] = []
        self.turn_output: str | None = None

    def reset(self) -> None:
        self.tool_calls.clear()
        self.tool_results.clear()
        self.llm_steps.clear()
        self.turn_output = None

    def on_llm_request(self, llm_request: Any, **kwargs: Any) -> None:
        """Optional hook for request-level monitoring (unused by the graph today)."""
        return None

    def on_llm_respond(self, llm_response: AIMessage, **kwargs: Any) -> None:
        self.llm_steps.append(llm_response)

    def on_tool_invoke(self, tool_name: str, tool_params: dict[str, Any], **kwargs: Any) -> None:
        self.tool_calls.append(ToolCallRecord(name=tool_name, args=dict(tool_params or {})))

    def on_tool_completion(self, tool_name: str, tool_result: Any, **kwargs: Any) -> None:
        self.tool_results.append(ToolResultRecord(name=tool_name, content=tool_result))

    def print_tool_call(self, name: str, args: dict) -> None:
        self.on_tool_invoke(name, args)

    def print_tool_result(self, name: str, content: Any) -> None:
        self.on_tool_completion(name, content)

    def print_llm_step(self, message: AIMessage) -> None:
        self.on_llm_respond(message)

    def print_turn_output(self, state: SessionAgentState) -> None:
        return None

    def tool_names(self, *, include_completion: bool = False) -> list[str]:
        names: list[str] = []
        for record in self.tool_calls:
            if not include_completion and record.name == self.completion_tool_name:
                continue
            names.append(record.name)
        return names

    @property
    def llm_round_count(self) -> int:
        """Count model steps that issued at least one tool call."""
        count = 0
        for message in self.llm_steps:
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
