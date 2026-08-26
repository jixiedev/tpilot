"""CLI-oriented ReAct listener (formatting + stdout)."""

from __future__ import annotations

import json
import re
from typing import Any

from langchain_core.messages import AIMessage

from agent.turn import completion_tool_reply, current_turn_messages
from state.state import SessionAgentState, last_ai_message, message_text

_DEFAULT_RESULT_PREVIEW_CHARS = 2000
_WRAPPED_COMPLETION_RE = re.compile(
    r"""^\s*chat_completion\s*\(\s*reply\s*=\s*(?P<q>["'])(?P<body>.*)(?P=q)\s*\)\s*$""",
    re.DOTALL | re.IGNORECASE,
)


class ReactAgentListener:
    """Hooks for CLI / UI feedback during a ReAct turn."""

    def print_status(self, message: str) -> None:
        return None

    def print_llm_start(
        self,
        tool_call_count: int = 0,
        max_tool_calls: int = 0,
        idle_rounds: int = 0,
    ) -> None:
        return None

    def print_tool_call(self, name: str, args: dict) -> None:
        return None

    def print_tool_result(self, name: str, content: Any) -> None:
        return None

    def print_llm_step(self, message: AIMessage) -> None:
        return None

    def print_turn_output(self, state: SessionAgentState) -> None:
        return None


class ListenerHub(ReactAgentListener):
    """Fan-out listener: primary UI hooks plus optional eval/monitoring observers.

    Graph callbacks close over this instance at bind time, so observers can be
    registered or cleared between turns without rebuilding the graph.
    """

    def __init__(self, primary: ReactAgentListener | None = None) -> None:
        self.primary = primary or ReactAgentListener()
        self._observers: list[ReactAgentListener] = []

    def register(self, listener: ReactAgentListener) -> None:
        if listener is self or listener is self.primary:
            return
        if listener not in self._observers:
            self._observers.append(listener)

    def unregister(self, listener: ReactAgentListener) -> None:
        self._observers = [item for item in self._observers if item is not listener]

    def clear_observers(self) -> None:
        self._observers.clear()

    def _fan_out(self, method: str, *args: Any, **kwargs: Any) -> None:
        getattr(self.primary, method)(*args, **kwargs)
        for observer in list(self._observers):
            getattr(observer, method)(*args, **kwargs)

    def print_status(self, message: str) -> None:
        self._fan_out("print_status", message)

    def print_llm_start(
        self,
        tool_call_count: int = 0,
        max_tool_calls: int = 0,
        idle_rounds: int = 0,
    ) -> None:
        self._fan_out(
            "print_llm_start",
            tool_call_count,
            max_tool_calls,
            idle_rounds,
        )

    def print_tool_call(self, name: str, args: dict) -> None:
        self._fan_out("print_tool_call", name, args)

    def print_tool_result(self, name: str, content: Any) -> None:
        self._fan_out("print_tool_result", name, content)

    def print_llm_step(self, message: AIMessage) -> None:
        self._fan_out("print_llm_step", message)

    def print_turn_output(self, state: SessionAgentState) -> None:
        self._fan_out("print_turn_output", state)


class CliReactListener(ReactAgentListener):
    """Print tool / LLM / turn output for a CLI ReAct loop."""

    def __init__(
        self,
        *,
        completion_tool_name: str,
        silent_tool_names: frozenset[str] | None = None,
        result_preview_chars: int = _DEFAULT_RESULT_PREVIEW_CHARS,
    ) -> None:
        self.completion_tool_name = completion_tool_name
        self.silent_tool_names = silent_tool_names or frozenset({completion_tool_name})
        self.result_preview_chars = max(1, int(result_preview_chars))

    @staticmethod
    def message_text_content(content: Any) -> str:
        """User/assistant visible text (excludes thinking / reasoning blocks)."""
        if isinstance(content, list):
            parts: list[str] = []
            for block in content:
                if isinstance(block, str) and block.strip():
                    parts.append(block.strip())
                    continue
                if not isinstance(block, dict):
                    continue
                block_type = block.get("type")
                if block_type in {"thinking", "reasoning"}:
                    continue
                if block_type == "text" and block.get("text"):
                    parts.append(str(block["text"]).strip())
            return "\n".join(part for part in parts if part)
        return message_text(content)

    @staticmethod
    def message_reasoning(message: AIMessage) -> str:
        """Extract model reasoning / thinking when present alongside tool calls."""
        parts: list[str] = []
        kwargs = getattr(message, "additional_kwargs", None) or {}
        for key in ("reasoning_content", "reasoning", "thinking"):
            value = kwargs.get(key)
            if isinstance(value, str) and value.strip():
                parts.append(value.strip())

        meta = getattr(message, "response_metadata", None) or {}
        for key in ("reasoning_content", "reasoning", "thinking"):
            value = meta.get(key)
            if isinstance(value, str) and value.strip() and value.strip() not in parts:
                parts.append(value.strip())

        content = message.content
        if isinstance(content, list):
            for block in content:
                if not isinstance(block, dict):
                    continue
                block_type = block.get("type")
                if block_type == "thinking" and block.get("thinking"):
                    text = str(block["thinking"]).strip()
                    if text and text not in parts:
                        parts.append(text)
                elif block_type == "reasoning" and block.get("reasoning"):
                    text = str(block["reasoning"]).strip()
                    if text and text not in parts:
                        parts.append(text)
        return "\n".join(parts)

    @staticmethod
    def format_status(message: str) -> str:
        text = message.strip() or "working"
        return f"Status> {text}"

    def format_llm_start(
        self,
        tool_call_count: int = 0,
        max_tool_calls: int = 0,
        idle_rounds: int = 0,
    ) -> str:
        return self.format_status(
            f"LLM thinking (tools={tool_call_count}/{max_tool_calls}, idle={idle_rounds})"
        )

    def print_status(self, message: str) -> None:
        print(self.format_status(message), flush=True)

    def print_llm_start(
        self,
        tool_call_count: int = 0,
        max_tool_calls: int = 0,
        idle_rounds: int = 0,
    ) -> None:
        print(
            self.format_llm_start(
                tool_call_count=tool_call_count,
                max_tool_calls=max_tool_calls,
                idle_rounds=idle_rounds,
            ),
            flush=True,
        )

    def format_tool_call(self, name: str, args: dict) -> str | None:
        if name in self.silent_tool_names:
            return None
        rendered_args = json.dumps(args, ensure_ascii=False, sort_keys=True)
        return f"Tool> {name}({rendered_args})"

    def format_tool_result(self, name: str, content: Any) -> str | None:
        if name in self.silent_tool_names:
            return None
        if isinstance(content, str):
            text = content
        else:
            try:
                text = json.dumps(content, ensure_ascii=False)
            except TypeError:
                text = str(content)
        text = text.strip()
        if not text:
            return f"Result> {name}: (empty)"
        limit = self.result_preview_chars
        if len(text) > limit:
            omitted = len(text) - limit
            text = f"{text[:limit]}\n... ({omitted} more chars)"
        return f"Result> {name}: {text}"

    def format_llm_step_lines(self, message: AIMessage) -> list[str]:
        # Intermediate ReAct traces only: plain-text idle retries stay quiet.
        if not (getattr(message, "tool_calls", None) or []):
            return []
        lines: list[str] = []
        reasoning = self.message_reasoning(message)
        if reasoning:
            lines.append(f"Reason> {reasoning}")
        text = self.message_text_content(message.content)
        if text:
            lines.append(f"LLM> {text}")
        return lines

    def format_llm_step(self, message: AIMessage) -> str | None:
        lines = self.format_llm_step_lines(message)
        if not lines:
            return None
        return "\n".join(lines)

    def last_completion_reply(self, state: SessionAgentState) -> str | None:
        """Return this turn's ``chat_completion`` reply, if any.

        Prior-turn completions are ignored so an idle/plain-text end cannot
        reprint the previous answer.
        """
        reply = completion_tool_reply(
            state,
            completion_tool_name=self.completion_tool_name,
        )
        if reply is None:
            return None
        return self.unwrap_completion_reply(reply)

    @staticmethod
    def unwrap_completion_reply(reply: str) -> str:
        """Strip accidental ``chat_completion(reply=...)`` wrapping from local models."""
        text = reply.strip()
        match = _WRAPPED_COMPLETION_RE.match(text)
        if match:
            return match.group("body")
        return reply

    def print_tool_call(self, name: str, args: dict) -> None:
        line = self.format_tool_call(name, args)
        if line:
            print(line)

    def print_tool_result(self, name: str, content: Any) -> None:
        line = self.format_tool_result(name, content)
        if line:
            print(line)

    def print_llm_step(self, message: AIMessage) -> None:
        for line in self.format_llm_step_lines(message):
            print(line)

    def print_turn_output(self, state: SessionAgentState) -> None:
        reply = self.last_completion_reply(state)
        if reply is None:
            fallback = last_ai_message(current_turn_messages(state))
            if fallback is not None:
                print(f"Assistant> {self.message_text_content(fallback.content)}")
                return
            print(f"Assistant> (no reply; expected {self.completion_tool_name})")
            return
        print(f"Assistant> {reply}")
