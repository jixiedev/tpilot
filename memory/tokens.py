"""Approximate token counting for compression thresholds."""

from __future__ import annotations

import json
from functools import lru_cache
from typing import Any

from langchain_core.messages import AIMessage, BaseMessage, ToolMessage


@lru_cache(maxsize=1)
def _tiktoken_encoding():
    try:
        import tiktoken

        return tiktoken.get_encoding("cl100k_base")
    except Exception:
        return None


def count_tokens(text: str) -> int:
    """Count tokens; fall back to ``len // 4`` when tiktoken is unavailable."""
    if not text:
        return 0
    encoding = _tiktoken_encoding()
    if encoding is not None:
        return len(encoding.encode(text))
    return max(1, len(text) // 4)


def _content_to_text(content: Any) -> str:
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict) and "text" in block:
                parts.append(str(block["text"]))
            else:
                parts.append(json.dumps(block, ensure_ascii=False))
        return "\n".join(parts)
    return json.dumps(content, ensure_ascii=False)


def message_tokens(message: BaseMessage) -> int:
    """Estimate tokens for one chat message, including tool-call payloads."""
    total = count_tokens(_content_to_text(message.content))
    if isinstance(message, AIMessage) and message.tool_calls:
        total += count_tokens(json.dumps(message.tool_calls, ensure_ascii=False))
    if isinstance(message, ToolMessage) and message.name:
        total += count_tokens(message.name)
    return total


def messages_tokens(messages: list[BaseMessage]) -> int:
    return sum(message_tokens(message) for message in messages)


def context_fill(messages: list[BaseMessage], context_window: int) -> float:
    if context_window <= 0:
        return 1.0
    return messages_tokens(messages) / context_window
