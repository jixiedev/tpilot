"""Turn routing for ReAct agents that end a turn via a completion tool."""

from __future__ import annotations

import logging
from collections.abc import Callable

from langchain_core.messages import ToolMessage

from agent.config import AgentRunConfig, RouterConfig, StateLike
from graph.edge import idle_rounds, latest_message, tool_call_count

logger = logging.getLogger(__name__)


class CompletionToolRouter:
    """Route after LLM / tool steps when a named tool delivers the user-visible reply.

    Plain assistant text cannot end the turn; only executing ``completion_tool_name``
    (then optionally refining profile) ends the turn.
    """

    def __init__(
        self,
        run_config: AgentRunConfig,
        router_config: RouterConfig,
        *,
        completion_tool_name: str,
    ) -> None:
        self.run_config = run_config
        self.router_config = router_config
        self.completion_tool_name = completion_tool_name

    def tool_calls_are_completion_only(self, tool_calls: list) -> bool:
        return bool(tool_calls) and all(
            call.get("name") == self.completion_tool_name for call in tool_calls
        )

    def tool_budget_exhausted(self, state: StateLike) -> bool:
        return tool_call_count(state) >= int(self.run_config.max_tool_steps or 0)

    def completion_executed(self, state: StateLike) -> bool:
        messages = state["messages"] if isinstance(state, dict) else getattr(state, "messages", [])
        index = len(messages) - 1
        while index >= 0:
            message = messages[index]
            if isinstance(message, ToolMessage):
                if message.name == self.completion_tool_name:
                    return True
                index -= 1
                continue
            if message.type == "ai":
                return False
            index -= 1
        return False

    def route_after_step(self) -> Callable[[StateLike], str]:
        """Return the conditional edge used after ``step_llm``.

        Inspects the latest AI message and chooses the next node:
        - Has tool calls and budget remains → ``step_tools`` (run tools).
        - Budget exhausted but calls are only ``completion_tool_name`` → ``step_tools``
          (allow the final user-visible reply).
        - Budget exhausted with other tools → ``step_llm`` (nudge toward completion).
        - Plain text (no tool calls) → ``step_llm`` (idle retry with nudge).
        - Plain text and idle rounds hit the cap → ``__end__`` (stop the loop).

        Plain assistant text alone never ends a normal turn; completion must go
        through the completion tool (then ``route_after_tools``).
        """
        max_idle = self.run_config.max_idle_rounds
        idle_outlet = self.router_config.step_idle_outlet
        tools_outlet = self.router_config.step_tools_outlet
        end_outlet = self.router_config.step_end_outlet

        def route(state: StateLike) -> str:
            ai_message = latest_message(state)
            tool_calls = getattr(ai_message, "tool_calls", None) or []
            budget_exhausted = self.tool_budget_exhausted(state)
            idle_capped = idle_rounds(state) >= max_idle

            # No tools: idle retry, or force-end when idle cap is hit.
            if not tool_calls:
                if idle_capped:
                    reason = (
                        "tool budget exhausted and reached maximum idle steps"
                        if budget_exhausted
                        else "reached maximum idle steps"
                    )
                    logger.warning("%s (%s); routing to %s", reason, max_idle, end_outlet)
                    return end_outlet
                return idle_outlet

            # Over budget: only the completion tool may still run.
            if budget_exhausted and not self.tool_calls_are_completion_only(tool_calls):
                logger.warning(
                    "reached maximum tool steps (%s); routing to %s for %s",
                    self.run_config.max_tool_steps,
                    idle_outlet,
                    self.completion_tool_name,
                )
                return idle_outlet

            return tools_outlet

        return route

    def route_after_tools(self) -> Callable[[StateLike], str]:
        """Return the conditional edge used after tool execution.

        - Completion tool already ran → ``tool_end_outlet`` (``refine_user_profile``
          or ``__end__``).
        - Otherwise → ``step_llm`` for another ReAct iteration.
        """
        step_outlet = self.router_config.tool_step_outlet
        end_outlet = self.router_config.tool_end_outlet

        def route(state: StateLike) -> str:
            if self.completion_executed(state):
                return end_outlet
            return step_outlet

        return route
