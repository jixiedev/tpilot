from __future__ import annotations

from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langgraph.prebuilt import ToolNode

from state.state import AgentState


class CounterToolNode(ToolNode):
    """ToolNode that increments ``tool_call_count`` after each execution batch."""

    def __init__(self, tools, count_key: str = "tool_call_count", **kwargs):
        super().__init__(tools, **kwargs)
        self.count_key = count_key

    def _apply_counter(self, state: AgentState, result: dict[str, Any]) -> dict[str, Any]:
        result[self.count_key] = state.get(self.count_key, 0) + 1
        result["idle_rounds"] = 0
        return result

    def invoke(self, state: AgentState, config=None, **kwargs) -> dict[str, Any]:
        result = super().invoke(state, config, **kwargs)
        if isinstance(result, dict):
            return self._apply_counter(state, result)
        return result

    async def ainvoke(self, state: AgentState, config=None, **kwargs) -> dict[str, Any]:
        result = await super().ainvoke(state, config, **kwargs)
        if isinstance(result, dict):
            return self._apply_counter(state, result)
        return result


def make_step_agent_node(
    model: BaseChatModel,
    next_step_prompt: str,
    idle_nudge_prompt: str = "",
    tool_budget_exhausted_prompt: str = "",
    max_tool_calls: int = 10,
):
    """Run the bound model; track idle rounds when the model returns no tool calls."""

    def step_agent(state: AgentState) -> dict[str, Any]:
        messages = list(state["messages"])
        if next_step_prompt.strip():
            messages.append(SystemMessage(content=next_step_prompt))
        if state.get("tool_call_count", 0) >= max_tool_calls and tool_budget_exhausted_prompt.strip():
            messages.append(SystemMessage(content=tool_budget_exhausted_prompt))
        elif state.get("idle_rounds", 0) > 0 and idle_nudge_prompt.strip():
            messages.append(SystemMessage(content=idle_nudge_prompt))
        response = model.invoke(messages)
        update: dict[str, Any] = {"messages": [response]}
        if response.tool_calls:
            update["idle_rounds"] = 0
        else:
            update["idle_rounds"] = state.get("idle_rounds", 0) + 1
        return update

    return step_agent
