from __future__ import annotations

import json
from typing import Any

from langchain_core.messages import AIMessage

from agent.chatbot.session import last_chat_reply
from agent.chatbot.tools import CHAT_COMPLETION_TOOL_NAME
from state.state import SessionAgentState, TurnTaskType


def message_text_content(content: Any) -> str:
    """Extract user-visible text from a message content payload."""
    if isinstance(content, str):
        return content.strip()
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
    if content is None:
        return ""
    return str(content).strip()


def format_tool_call(name: str, args: dict) -> str | None:
    if name == CHAT_COMPLETION_TOOL_NAME:
        return None
    rendered_args = json.dumps(args, ensure_ascii=False, sort_keys=True)
    return f"Tool> {name}({rendered_args})"


def print_tool_call(name: str, args: dict) -> None:
    line = format_tool_call(name, args)
    if line:
        print(line)


def format_llm_step(message: AIMessage) -> str | None:
    text = message_text_content(message.content)
    if not text:
        return None
    return f"LLM> {text}"


def print_llm_step(message: AIMessage) -> None:
    line = format_llm_step(message)
    if line:
        print(line)


def format_classify_task(
    turn_task_type: TurnTaskType,
    confidence: float | None,
    model_label: TurnTaskType | None,
) -> str:
    details: list[str] = []
    if model_label is not None:
        details.append(f"model={model_label}")
    if confidence is not None:
        details.append(f"confidence={confidence:.2f}")
    suffix = f" ({', '.join(details)})" if details else ""
    return f"Classify> {turn_task_type}{suffix}"


def print_classify_task(
    turn_task_type: TurnTaskType,
    confidence: float | None,
    model_label: TurnTaskType | None,
) -> None:
    print(format_classify_task(turn_task_type, confidence, model_label))


def print_turn_output(state: SessionAgentState) -> None:
    reply = last_chat_reply(state)
    if reply is None:
        fallback = SessionAgentState.last_ai_message(state)
        if fallback is not None:
            content = message_text_content(fallback.content)
            print(f"Assistant> {content}")
            return
        print("Assistant> (no reply; expected chat_completion)")
        return
    print(f"Assistant> {reply}")
