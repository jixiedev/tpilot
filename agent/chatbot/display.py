from __future__ import annotations

import json

from langchain_core.messages import AIMessage, ToolMessage

from agent.chatbot.session import last_chat_reply
from agent.chatbot.tools import CHAT_COMPLETION_TOOL_NAME
from state.state import AgentState, last_ai_message


def _format_tool_calls(message: AIMessage) -> str:
    lines: list[str] = []
    for call in message.tool_calls or []:
        name = call.get("name")
        if name == CHAT_COMPLETION_TOOL_NAME:
            continue
        args = call.get("args", {})
        rendered_args = json.dumps(args, ensure_ascii=False, sort_keys=True)
        lines.append(f"Tool> {name}({rendered_args})")
    return "\n".join(lines)


def print_turn_output(state: AgentState, *, start_index: int, verbose: bool) -> None:
    for message in state["messages"][start_index:]:
        if isinstance(message, AIMessage) and message.tool_calls:
            formatted = _format_tool_calls(message)
            if formatted:
                print(formatted)

    if verbose:
        pending_tool_names: list[str] = []
        for message in state["messages"][start_index:]:
            if isinstance(message, AIMessage) and message.tool_calls:
                pending_tool_names = [
                    call.get("name", "?")
                    for call in message.tool_calls
                    if call.get("name") != CHAT_COMPLETION_TOOL_NAME
                ]
            elif isinstance(message, ToolMessage) and pending_tool_names:
                name = pending_tool_names.pop(0)
                preview = message.content
                if isinstance(preview, str) and len(preview) > 240:
                    preview = preview[:240] + "…"
                print(f"  ↳ {name}: {preview}")

    reply = last_chat_reply(state)
    if reply is None:
        fallback = last_ai_message(state)
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
        print("Assistant> (no reply; expected chat_completion — try -v)")
        return
    print(f"Assistant> {reply}")
