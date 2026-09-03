"""Message-history helpers for strict OpenAI-compatible tool providers."""

from __future__ import annotations

import logging
from typing import Any

from langchain_core.messages import AIMessage, BaseMessage, ToolMessage

logger = logging.getLogger(__name__)

_MISSING_TOOL_RESULT = (
    '{"error":"missing tool result in checkpoint; synthesized to satisfy provider"}'
)


def message_content_to_str(content: Any) -> str:
    """Normalize LangChain message content (str or multimodal parts) to plain text."""
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts: list[str] = []
        for part in content:
            if isinstance(part, dict) and part.get("type") == "text":
                parts.append(str(part.get("text", "")))
            else:
                parts.append(str(part))
        return "".join(parts).strip()
    return str(content).strip()


def _tool_call_ids(tool_calls: list[dict[str, Any]]) -> list[str]:
    return [str(call.get("id") or "") for call in tool_calls if call.get("id")]


def _strip_ai_content_for_tool_calls(message: AIMessage) -> AIMessage:
    """MiniMax / GLM replay often rejects assistant text mixed with tool_calls."""
    if not message.tool_calls or not message.content:
        return message
    return message.model_copy(update={"content": ""})


def sanitize_messages_for_strict_tool_providers(
    messages: list[BaseMessage],
) -> list[BaseMessage]:
    """Repair tool-call chains before sending history to the chat model.

    Some providers (notably MiniMax) return HTTP 400 / error 2013 when:

    - an ``AIMessage`` with ``tool_calls`` is not immediately followed by a
      ``ToolMessage`` for every ``tool_call_id`` (in call order);
    - assistant planning text is replayed alongside ``tool_calls``;
    - a prior run was interrupted mid-tool-batch and the checkpoint is partial.
    """
    sanitized: list[BaseMessage] = []
    index = 0
    while index < len(messages):
        message = messages[index]
        if isinstance(message, AIMessage):
            tool_calls = list(getattr(message, "tool_calls", None) or [])
            if tool_calls:
                sanitized.append(_strip_ai_content_for_tool_calls(message))
                expected_ids = _tool_call_ids(tool_calls)
                collected: dict[str, ToolMessage] = {}
                scan = index + 1
                while scan < len(messages):
                    candidate = messages[scan]
                    if isinstance(candidate, ToolMessage):
                        tool_id = str(candidate.tool_call_id or "")
                        if tool_id and tool_id in expected_ids and tool_id not in collected:
                            collected[tool_id] = candidate
                        scan += 1
                        continue
                    break

                for call_index, tool_call in enumerate(tool_calls):
                    tool_id = str(tool_call.get("id") or "")
                    if not tool_id:
                        continue
                    tool_message = collected.get(tool_id)
                    if tool_message is None:
                        logger.warning(
                            "synthesizing missing ToolMessage for tool_call_id=%s tool=%s",
                            tool_id,
                            tool_call.get("name"),
                        )
                        tool_message = ToolMessage(
                            content=_MISSING_TOOL_RESULT,
                            name=str(tool_call.get("name") or ""),
                            tool_call_id=tool_id,
                            status="error",
                        )
                    sanitized.append(tool_message)

                if len(collected) < len(expected_ids):
                    logger.warning(
                        "repaired incomplete tool batch: expected %s result(s), found %s",
                        len(expected_ids),
                        len(collected),
                    )

                index = scan
                continue

        sanitized.append(message)
        index += 1

    return sanitized
