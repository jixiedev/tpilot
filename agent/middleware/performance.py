from collections import defaultdict
from typing import Any, Callable

from codetiming import Timer
from langchain.agents.middleware import AgentMiddleware
from langchain_core.messages import ToolMessage
from langgraph.prebuilt.tool_node import ToolCallRequest
from langgraph.runtime import Runtime
from langgraph.types import Command
from langgraph.typing import ContextT

from state.state import SessionAgentState


class PerformanceMiddleware(AgentMiddleware[SessionAgentState]):
    def __init__(self):
        self.session_timer = defaultdict(Timer)
        super().__init__()

    def before_model(self, state: SessionAgentState, runtime: Runtime[ContextT]) -> dict[str, Any] | None:
        session_name = state["session_name"]
        timer = self.session_timer[session_name]
        timer.start()
        return None

    def after_model(self, state: SessionAgentState, runtime: Runtime[ContextT]) -> dict[str, Any] | None:
        session_name = state["session_name"]
        timer = self.session_timer[session_name]
        elapsed = timer.stop()
        return {"model_call_duration_millis": elapsed}

    def wrap_tool_call(
            self,
            request: ToolCallRequest,
            handler: Callable[[ToolCallRequest], ToolMessage | Command],
    ) -> ToolMessage | Command:
        with Timer(logger=None, name=request.state["session_name"]) as timer:
            result = handler(request)

        elapsed = timer.last
        return Command(
            update={
                "tool_call_duration_millis": elapsed,
                "messages": [result]
            }
        )
