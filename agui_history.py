"""Repair assistant tool-call arguments before a follow-up run parses them.

On a later turn the browser resends the thread. ``ag_ui_langgraph`` parses each
assistant tool call's ``arguments`` with ``json.loads``. A streamed call is
sometimes stored as more than one JSON value in that string: a ``null``
placeholder in front of the real object (``null{"agent":"warehouse",...}``,
``Extra data`` at column 5), or the next call's object appended to this one
(``{"a":"b"}{"sql":"select 1"}``, ``Extra data`` at column 10). Either one ends
the run with ``JSONDecodeError: Extra data`` before the graph starts.

:class:`AguiHistoryRepair` reduces each arguments string to one JSON object
before that parse. The first object is the call's own arguments; a leading
non-object (``null``, ``true``, a string) is skipped.
"""

from __future__ import annotations

import json
import logging
from collections.abc import Sequence
from dataclasses import dataclass
from typing import Any

logger = logging.getLogger("agui_server")

_REPAIR_FLAG = "_agui_history_repair"


@dataclass(frozen=True)
class ToolCallArguments:
    """One tool call's ``arguments`` text, which may hold more than one JSON value."""

    raw: str

    def single_json(self) -> str | None:
        """Replacement arguments text, or ``None`` when ``raw`` is already one JSON value.

        An empty string is left alone: the adapter already treats it as ``{}``.
        Unparseable text becomes ``{}`` so the follow-up still starts.
        """
        text = self.raw.strip()
        if not text:
            return None
        try:
            json.loads(text)
        except json.JSONDecodeError:
            return json.dumps(self._first_object(text), ensure_ascii=False)
        return None

    def _first_object(self, text: str) -> dict[str, Any]:
        decoder = json.JSONDecoder()
        index = 0
        length = len(text)
        while index < length:
            while index < length and text[index].isspace():
                index += 1
            if index >= length:
                break
            try:
                value, end = decoder.raw_decode(text, index)
            except json.JSONDecodeError:
                break
            if isinstance(value, dict):
                return value
            index = end
        return {}


class AguiHistoryRepair:
    """Rewrites concatenated tool-call arguments on the messages a follow-up sends."""

    def messages(self, messages: Sequence[Any]) -> list[Any]:
        """Copy of ``messages`` whose assistant tool-call arguments are one JSON object."""
        return [self._message(message) for message in messages]

    def install(self) -> None:
        """Wrap ``agui_messages_to_langchain`` so every follow-up is repaired first.

        The adapter calls the function it imported into ``ag_ui_langgraph.agent``,
        so the wrap is installed on that module as well as on ``utils``. A second
        call does not wrap again.
        """
        import ag_ui_langgraph.agent as agent_mod
        import ag_ui_langgraph.utils as utils_mod

        current = utils_mod.agui_messages_to_langchain
        if getattr(current, _REPAIR_FLAG, False):
            agent_mod.agui_messages_to_langchain = current
            return

        def wrapped(messages: Sequence[Any]) -> list[Any]:
            return current(self.messages(messages))

        setattr(wrapped, _REPAIR_FLAG, True)
        utils_mod.agui_messages_to_langchain = wrapped
        agent_mod.agui_messages_to_langchain = wrapped

    def _message(self, message: Any) -> Any:
        if getattr(message, "role", None) != "assistant":
            return message
        tool_calls = getattr(message, "tool_calls", None)
        if not tool_calls:
            return message
        repaired = [self._tool_call(call) for call in tool_calls]
        if repaired == list(tool_calls) or not hasattr(message, "model_copy"):
            return message
        return message.model_copy(update={"tool_calls": repaired})

    def _tool_call(self, call: Any) -> Any:
        function = getattr(call, "function", None)
        raw = getattr(function, "arguments", None) if function is not None else None
        if not isinstance(raw, str) or not hasattr(call, "model_copy") or not hasattr(function, "model_copy"):
            return call
        replacement = ToolCallArguments(raw).single_json()
        if replacement is None:
            return call
        logger.warning(
            "Repaired tool-call arguments before follow-up parse (tool=%s): %s",
            getattr(function, "name", ""),
            raw[:160],
        )
        return call.model_copy(update={"function": function.model_copy(update={"arguments": replacement})})
