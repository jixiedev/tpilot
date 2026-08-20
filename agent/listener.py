"""CLI-oriented ReAct listener (formatting + stdout)."""

from __future__ import annotations

import json
import re
from typing import Any

from langchain_core.messages import AIMessage, ToolMessage

from state.state import SessionAgentState, last_ai_message, message_text

_DEFAULT_RESULT_PREVIEW_CHARS = 2000
_WRAPPED_COMPLETION_RE = re.compile(
    r"""^\s*chat_completion\s*\(\s*reply\s*=\s*(?P<q>["'])(?P<body>.*)(?P=q)\s*\)\s*$""",
    re.DOTALL | re.IGNORECASE,
)


class ReactAgentListener:
    """Hooks for CLI / UI feedback during a ReAct turn."""

    def print_tool_call(self, name: str, args: dict) -> None:
        return None

    def print_tool_result(self, name: str, content: Any) -> None:
        return None

    def print_llm_step(self, message: AIMessage) -> None:
        return None

    def print_turn_output(self, state: SessionAgentState) -> None:
        return None


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
        for message in reversed(state["messages"]):
            if isinstance(message, ToolMessage) and message.name == self.completion_tool_name:
                content = message.content
                if isinstance(content, str):
                    return self.unwrap_completion_reply(content)
                return self.unwrap_completion_reply(str(content))
        return None

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
            fallback = last_ai_message(state)
            if fallback is not None:
                print(f"Assistant> {self.message_text_content(fallback.content)}")
                return
            print(f"Assistant> (no reply; expected {self.completion_tool_name})")
            return
        print(f"Assistant> {reply}")
