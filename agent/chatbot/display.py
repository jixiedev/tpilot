from __future__ import annotations

import json

from agent.chatbot.session import last_chat_reply
from agent.chatbot.tools import CHAT_COMPLETION_TOOL_NAME
from state.state import SessionAgentState


def format_tool_call(name: str, args: dict) -> str | None:
    if name == CHAT_COMPLETION_TOOL_NAME:
        return None
    rendered_args = json.dumps(args, ensure_ascii=False, sort_keys=True)
    return f"Tool> {name}({rendered_args})"


def print_tool_call(name: str, args: dict) -> None:
    line = format_tool_call(name, args)
    if line:
        print(line)


def print_turn_output(state: SessionAgentState) -> None:
    reply = last_chat_reply(state)
    if reply is None:
        fallback = SessionAgentState.last_ai_message(state)
        if fallback is not None:
            content = fallback.content
            if isinstance(content, list):
                text_parts = [
                    part.get("text", "")
                    for part in content
                    if isinstance(part, dict) and part.get("type") == "text"
                ]
                content = "".join(text_parts)
            print(f"Assistant> {content}")
            return
        print("Assistant> (no reply; expected chat_completion)")
        return
    print(f"Assistant> {reply}")
