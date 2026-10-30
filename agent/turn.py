"""Shared turn runtime helpers for agents (invoke + interrupt resume)."""

from __future__ import annotations

from collections.abc import Awaitable, Callable, Mapping, Sequence
from dataclasses import dataclass, field
from typing import Any

from langchain_core.messages import BaseMessage
from langgraph.types import Command

from state.state import last_ai_message, message_text

OnInterrupt = Callable[[str], Awaitable[str | None]]


@dataclass
class AgentTurnResult:
    """Outcome of one ``BaseAgent.run`` call."""

    state: dict[str, Any] = field(default_factory=dict)
    cancelled: bool = False

    @property
    def ok(self) -> bool:
        return not self.cancelled


def current_turn_messages(
    state: Mapping[str, Any] | Sequence[BaseMessage] | None,
) -> list[Any]:
    """Messages after the latest human turn (exclusive of that human message).

    Used so reply lookup cannot leak a prior turn's answer.
    """
    if state is None:
        return []
    if isinstance(state, Mapping):
        messages = list(state.get("messages") or [])
    else:
        messages = list(state)
    for index in range(len(messages) - 1, -1, -1):
        if getattr(messages[index], "type", None) == "human":
            return messages[index + 1 :]
    return messages


def last_user_visible_reply(state: Mapping[str, Any] | None) -> str | None:
    """Latest assistant text in this turn that is not a tool-call step."""
    from langchain_core.messages import AIMessage

    for message in reversed(current_turn_messages(state)):
        if not (getattr(message, "type", None) == "ai" or isinstance(message, AIMessage)):
            continue
        if getattr(message, "tool_calls", None):
            continue
        text = message_text(getattr(message, "content", None))
        if text:
            return text
    return None


def extract_turn_output(
    state: Mapping[str, Any] | None,
) -> str:
    """Best-effort user-visible output from a finished agent state.

    Prefers this turn's last assistant message without tool calls, then any
    AI text, then common scalar fields used by lightweight stubs.
    """
    if not state:
        return ""
    reply = last_user_visible_reply(state)
    if reply:
        return reply
    ai = last_ai_message(current_turn_messages(state))
    if ai is not None:
        text = message_text(getattr(ai, "content", None))
        if text:
            return text
    for key in ("value", "reply", "answer", "user_question"):
        raw = state.get(key)
        if isinstance(raw, str) and raw.strip():
            return raw.strip()
    return ""


def interrupt_values(result: Any) -> list[Any]:
    if not isinstance(result, dict):
        return []
    values: list[Any] = []
    for item in result.get("__interrupt__") or ():
        values.append(getattr(item, "value", item))
    return values


def interrupt_question(result: Any) -> str | None:
    for value in interrupt_values(result):
        if isinstance(value, dict):
            question = value.get("question")
            if question is not None and str(question).strip():
                return str(question).strip()
            continue
        if value is not None and str(value).strip():
            return str(value).strip()
    return None


async def ainvoke_resolving_interrupts(
    graph: Any,
    state: Any,
    config: dict[str, Any],
    *,
    on_interrupt: OnInterrupt | None = None,
) -> AgentTurnResult:
    """Invoke a compiled graph, resuming interrupts via ``on_interrupt`` until done."""
    state = await graph.ainvoke(state, config)
    while interrupt_values(state):
        if on_interrupt is None:
            raise RuntimeError(
                "graph interrupted but no on_interrupt handler was provided"
            )
        question = interrupt_question(state) or (
            "Please provide the information needed to continue."
        )
        reply = await on_interrupt(question)
        if reply is None:
            return AgentTurnResult(state=state if isinstance(state, dict) else {}, cancelled=True)
        state = await graph.ainvoke(Command(resume=reply), config)
    return AgentTurnResult(
        state=state if isinstance(state, dict) else {"value": state},
        cancelled=False,
    )
