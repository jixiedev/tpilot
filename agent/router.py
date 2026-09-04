"""Turn routing for ReAct loops (tools vs final assistant text)."""

from __future__ import annotations

import logging
from collections.abc import Callable

from agent.config import AgentRunContext, RouterConfig, StateLike
from graph.edge import idle_rounds, latest_message, tool_call_count

logger = logging.getLogger(__name__)


class CompletionToolRouter:
    """Route after LLM / tool steps.

    - ``state_exit_keys`` populated → end (staged subgraphs: fetch, SQL, plan).
    - Latest AI message has tool calls and budget remains → ``step_action``.
    - Latest AI message has no tool calls:
      - staged subgraph whose contract is not met → idle retry, then end
      - otherwise → end (assistant text is the user-visible reply)
    """

    def __init__(
        self,
        run_context: AgentRunContext,
        router_config: RouterConfig,
    ) -> None:
        self.run_context = run_context
        self.router_config = router_config

    def tool_budget_exhausted(self, state: StateLike) -> bool:
        return tool_call_count(state) >= int(self.run_context.max_tool_steps or 0)

    def _uses_state_contract(self) -> bool:
        return bool(self.router_config.state_exit_keys)

    def route_after_reason(self) -> Callable[[StateLike], str]:
        max_idle = self.run_context.max_idle_rounds
        idle_outlet = self.router_config.reason_idle_outlet
        action_outlet = self.router_config.reason_action_outlet
        end_outlet = self.router_config.reason_end_outlet

        def route(state: StateLike) -> str:
            if self.state_complete(state):
                return end_outlet
            ai_message = latest_message(state)
            tool_calls = getattr(ai_message, "tool_calls", None) or []
            if tool_calls:
                if self.tool_budget_exhausted(state):
                    logger.warning(
                        "reached maximum tool steps (%s); routing to %s",
                        self.run_context.max_tool_steps,
                        end_outlet,
                    )
                    return end_outlet
                return action_outlet
            if self._uses_state_contract() and idle_rounds(state) < max_idle:
                return idle_outlet
            return end_outlet

        return route

    def route_after_action(self) -> Callable[[StateLike], str]:
        reason_outlet = self.router_config.action_reason_outlet
        end_outlet = self.router_config.action_end_outlet

        def route(state: StateLike) -> str:
            if self.state_complete(state):
                return end_outlet
            return reason_outlet

        return route

    def state_complete(self, state: StateLike) -> bool:
        """True when every name in ``state_exit_keys`` is populated in state."""
        keys = tuple(self.router_config.state_exit_keys or ())
        if not keys:
            return False
        state_dict = state if isinstance(state, dict) else getattr(state, "__dict__", None) or {}
        for key in keys:
            value = state_dict.get(key) if hasattr(state_dict, "get") else None
            if not value:
                return False
        return True
