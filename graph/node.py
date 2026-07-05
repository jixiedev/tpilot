from __future__ import annotations

from typing import Any

from langgraph.prebuilt import ToolNode

from state.agent_state import AgentState


class CounterToolNode(ToolNode):
    """ToolNode that increments ``tool_call_count`` after each execution batch."""

    def __init__(self, tools, count_key: str = "tool_call_count", **kwargs):
        super().__init__(tools, **kwargs)
        self.count_key = count_key

    def invoke(self, state: AgentState, config=None, **kwargs) -> dict[str, Any]:
        result = super().invoke(state, config, **kwargs)
        if isinstance(result, dict):
            result[self.count_key] = state.get(self.count_key, 0) + 1
        return result
