"""Turn routing for ReAct agents that end a turn via a completion tool."""

from __future__ import annotations

import logging
from collections.abc import Callable

from langchain_core.messages import AIMessage, ToolMessage

from agent.config import AgentRunConfig, RouterConfig, StateLike
from graph.edge import idle_rounds, latest_message, tool_call_count

logger = logging.getLogger(__name__)

# When subgraphs use state-based exit (``completion_tool_name=None``),
# models may still call ``chat_completion`` as if it ends the turn.
# Cap consecutive stall-only completions so the subgraph cannot loop forever.
_COMPLETION_STALL_TOOL = "chat_completion"
_COMPLETION_STALL_LIMIT = 2


class CompletionToolRouter:
    """Route after LLM / tool steps when a named tool delivers the user-visible reply.

    Plain assistant text cannot end the turn; only executing ``completion_tool_name``
    (then optionally refining profile) ends the turn.

    The ``completion_tool_name`` argument is optional. When ``None`` (or
    empty) the router becomes a pure state-based router: the only
    short-circuit is ``state_complete(state)``. This is what the
    databot subgraphs use — they have a well-defined state contract
    (``review_cards`` / ``cards_reasons`` etc.) and no longer want
    the LLM to remember to call ``chat_completion`` to exit.
    """

    def __init__(
        self,
        run_config: AgentRunConfig,
        router_config: RouterConfig,
        *,
        completion_tool_name: str | None = "chat_completion",
    ) -> None:
        self.run_config = run_config
        self.router_config = router_config
        self.completion_tool_name = (completion_tool_name or "").strip() or None

    def tool_calls_are_completion_only(self, tool_calls: list) -> bool:
        if not self.completion_tool_name:
            return False
        return bool(tool_calls) and all(
            call.get("name") == self.completion_tool_name for call in tool_calls
        )

    def tool_budget_exhausted(self, state: StateLike) -> bool:
        return tool_call_count(state) >= int(self.run_config.max_tool_steps or 0)

    def completion_executed(self, state: StateLike) -> bool:
        """Return True if the completion tool fired in the most recent round.

        When ``completion_tool_name`` is ``None`` (state-only router
        mode), this always returns False — there is no completion
        tool to look for. The state check is the only exit signal.

        Walks ``messages`` in reverse and only considers ``ToolMessage``
        entries — ``AIMessage`` between the tool call and the tool
        result is normal (e.g. the LLM emits a final answer alongside
        the tool result) and must NOT short-circuit the check. Without
        this guard, every chat_completion call is followed by a fresh
        ``AIMessage`` (the final-answer chunk), which the previous
        implementation treated as "no completion yet" and routed back
        to ``step_llm`` — an infinite loop where the LLM keeps
        re-asserting "I should call chat_completion next" forever and
        the subgraph never advances.
        """
        if not self.completion_tool_name:
            return False
        messages = state["messages"] if isinstance(state, dict) else getattr(state, "messages", [])
        index = len(messages) - 1
        # Walk back to the most recent AIMessage (the call site). If a
        # chat_completion ToolMessage appears after that AIMessage,
        # we're done.
        last_ai_index = None
        for i in range(index, -1, -1):
            message = messages[i]
            if getattr(message, "type", None) == "ai" or isinstance(message, AIMessage):
                last_ai_index = i
                break
            if isinstance(message, ToolMessage):
                if getattr(message, "name", "") == self.completion_tool_name:
                    return True
        # No AIMessage at all -> the only messages we've seen are
        # tools, which is a degenerate case; fall back to a
        # straight scan.
        for message in messages:
            if isinstance(message, ToolMessage) and getattr(message, "name", "") == self.completion_tool_name:
                return True
        return False

    def completion_stall_exceeded(self, state: StateLike) -> bool:
        """True when ``chat_completion`` fired repeatedly without filling state."""
        if self.completion_tool_name is not None or self.state_complete(state):
            return False
        messages = state["messages"] if isinstance(state, dict) else getattr(state, "messages", [])
        stall = 0
        for message in reversed(messages):
            if isinstance(message, ToolMessage):
                if getattr(message, "name", "") == _COMPLETION_STALL_TOOL:
                    stall += 1
                    continue
                break
        return stall >= _COMPLETION_STALL_LIMIT

    def route_after_reason(self) -> Callable[[StateLike], str]:
        """Return the conditional edge used after ``step_llm`` (reason).

        Inspects the latest AI message and chooses the next node:
        - State-based exit keys all populated → ``reason_end_outlet`` (state contract met).
        - Completion tool already ran → ``reason_end_outlet`` (legacy exit signal).
        - Has tool calls and budget remains → ``step_tools`` (run tools / action).
        - Budget exhausted but calls are only ``completion_tool_name`` → ``step_tools``
          (allow the final user-visible reply).
        - Budget exhausted with other tools → ``step_llm`` (nudge toward completion).
        - Plain text (no tool calls) → ``step_llm`` (idle retry with nudge).
        - Plain text and idle rounds hit the cap → ``__end__`` (last-resort stop).

        Plain assistant text alone never ends a normal turn; completion must go
        through the completion tool (then ``route_after_action``).
        """
        max_idle = self.run_config.max_idle_rounds
        idle_outlet = self.router_config.reason_idle_outlet
        action_outlet = self.router_config.reason_action_outlet
        end_outlet = self.router_config.reason_end_outlet

        def route(state: StateLike) -> str:
            if self.state_complete(state):
                return end_outlet
            if self.completion_executed(state):
                return end_outlet
            if self.completion_stall_exceeded(state):
                logger.warning(
                    "chat_completion stall (%s) without state contract; routing to %s",
                    _COMPLETION_STALL_LIMIT,
                    end_outlet,
                )
                return end_outlet
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

            return action_outlet

        return route

    def route_after_action(self) -> Callable[[StateLike], str]:
        """Return the conditional edge used after tool execution (action).

        - State-based exit keys all populated → ``action_end_outlet`` (state contract met).
        - Completion tool already ran → ``action_end_outlet`` (legacy exit signal).
        - Otherwise → ``step_llm`` for another ReAct iteration.
        """
        reason_outlet = self.router_config.action_reason_outlet
        end_outlet = self.router_config.action_end_outlet

        def route(state: StateLike) -> str:
            if self.state_complete(state):
                return end_outlet
            if self.completion_executed(state):
                return end_outlet
            if self.completion_stall_exceeded(state):
                logger.warning(
                    "chat_completion stall (%s) without state contract; routing to %s",
                    _COMPLETION_STALL_LIMIT,
                    end_outlet,
                )
                return end_outlet
            return reason_outlet

        return route

    def state_complete(self, state: StateLike) -> bool:
        """True when every name in ``state_exit_keys`` is populated in state.

        Each key is checked with a "truthy and not empty" predicate:
        ``None`` / empty list / empty dict / empty string count as
        missing. This is the state-based exit: the subgraph is "done"
        when its required outputs are in place, regardless of whether
        the LLM remembered to call ``chat_completion``.
        """
        keys = tuple(self.router_config.state_exit_keys or ())
        if not keys:
            return False
        state_dict = state if isinstance(state, dict) else getattr(state, "__dict__", None) or {}
        for key in keys:
            value = state_dict.get(key) if hasattr(state_dict, "get") else None
            if not value:
                return False
        return True
