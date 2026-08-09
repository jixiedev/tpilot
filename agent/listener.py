"""CLI-oriented ReAct listener (formatting + stdout)."""

from __future__ import annotations

import json
from typing import Any

from langchain_core.messages import AIMessage, ToolMessage

from state.state import SessionAgentState, last_ai_message, message_text


class ReactAgentListener:
    """Hooks for CLI / UI feedback during a ReAct turn."""

    def print_tool_call(self, name: str, args: dict) -> None:
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
    ) -> None:
        self.completion_tool_name = completion_tool_name
        self.silent_tool_names = silent_tool_names or frozenset({completion_tool_name})

    @staticmethod
    def message_text_content(content: Any) -> str:
        # Keep thinking-block support for CLI LLM> traces; shared helper covers text.
        if isinstance(content, list):
            parts: list[str] = []
            for block in content:
                if isinstance(block, str) and block.strip():
                    parts.append(block.strip())
                    continue
                if not isinstance(block, dict):
                    continue
                block_type = block.get("type")
                if block_type == "text" and block.get("text"):
                    parts.append(str(block["text"]).strip())
                elif block_type == "thinking" and block.get("thinking"):
                    parts.append(str(block["thinking"]).strip())
            return "\n".join(part for part in parts if part)
        return message_text(content)

    def format_tool_call(self, name: str, args: dict) -> str | None:
        if name in self.silent_tool_names:
            return None
        rendered_args = json.dumps(args, ensure_ascii=False, sort_keys=True)
        return f"Tool> {name}({rendered_args})"

    def format_llm_step(self, message: AIMessage) -> str | None:
        text = self.message_text_content(message.content)
        if not text:
            return None
        return f"LLM> {text}"

    def last_completion_reply(self, state: SessionAgentState) -> str | None:
        for message in reversed(state["messages"]):
            if isinstance(message, ToolMessage) and message.name == self.completion_tool_name:
                content = message.content
                if isinstance(content, str):
                    return content
                return str(content)
        return None

    def print_tool_call(self, name: str, args: dict) -> None:
        line = self.format_tool_call(name, args)
        if line:
            print(line)

    def print_llm_step(self, message: AIMessage) -> None:
        line = self.format_llm_step(message)
        if line:
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
