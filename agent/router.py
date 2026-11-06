"""Turn routing for ReAct loops (tools vs final assistant text)."""

from __future__ import annotations

import logging
from collections.abc import Callable

from agent.run_context import ReactContext, StateLike
from config.agent_config import AgentConfig
from graph.state import idle_reason_rounds, latest_message, tool_call_count

logger = logging.getLogger(__name__)

STEP_REASON = "step_reason"
STEP_ACTION = "step_action"
GRAPH_END = "__end__"

StageCompleteFn = Callable[[StateLike], bool]


class CompletionToolRouter:
    """Route after LLM / tool steps.

    - ``stage_complete(state)`` true → end (staged subgraphs: fetch, SQL, plan create).
    - Latest AI message has tool calls and budget remains → ``step_action``.
    - Latest AI message has tool calls at budget → end. This is a guard only:
      ``step_reason`` at budget calls the model without tools and strips tool calls,
      so a loop built by ``build_react_graph`` ends on a text reply.
    - Latest AI message has no tool calls:
      - staged subgraph whose contract is not met → idle retry (up to
        ``max_idle_reason_rounds``), then end
      - otherwise → end (assistant text is the user-visible reply);
        ``max_idle_reason_rounds`` is not read without ``stage_complete``
    """

    def __init__(
        self,
        run_context: ReactContext,
        *,
        stage_complete: StageCompleteFn | None = None,
    ) -> None:
        self.run_context = run_context
        self._stage_complete = stage_complete

    def tool_budget_exhausted(self, state: StateLike) -> bool:
        limit = AgentConfig.as_int(self.run_context, "max_tool_calls", 10)
        return tool_call_count(state) >= limit

    def _uses_stage_contract(self) -> bool:
        return self._stage_complete is not None

    def route_after_reason(self) -> Callable[[StateLike], str]:
        max_idle = AgentConfig.as_int(self.run_context, "max_idle_reason_rounds", 1)
        tool_call_limit = AgentConfig.as_int(self.run_context, "max_tool_calls", 10)

        def route(state: StateLike) -> str:
            if self.state_complete(state):
                return GRAPH_END
            ai_message = latest_message(state)
            tool_calls = getattr(ai_message, "tool_calls", None) or []
            if tool_calls:
                if self.tool_budget_exhausted(state):
                    logger.warning(
                        "reached maximum tool calls (%s); routing to %s",
                        tool_call_limit,
                        GRAPH_END,
                    )
                    return GRAPH_END
                return STEP_ACTION
            if self._uses_stage_contract() and idle_reason_rounds(state) < max_idle:
                return STEP_REASON
            return GRAPH_END

        return route

    def route_after_action(self) -> Callable[[StateLike], str]:
        def route(state: StateLike) -> str:
            if self.state_complete(state):
                return GRAPH_END
            return STEP_REASON

        return route

    def state_complete(self, state: StateLike) -> bool:
        """True when the staged subgraph exit predicate passes."""
        if self._stage_complete is None:
            return False
        return self._stage_complete(state)
