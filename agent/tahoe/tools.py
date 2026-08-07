from __future__ import annotations

from langchain.tools import tool

CHAT_COMPLETION_TOOL_NAME = "chat_completion"


@tool
def chat_completion(reply: str) -> str:
    """Deliver the final answer to the user. Call this when you are ready to respond."""
    return reply


TOOLS = [chat_completion]
