from __future__ import annotations

from langchain.tools import tool

from tools.common import bind_tool_to_agent

CHAT_COMPLETION_TOOL_NAME = "chat_completion"


@bind_tool_to_agent("tahoe,react")
@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("databot,fetch")
@bind_tool_to_agent("databot,sql")
@bind_tool_to_agent("knowledge,default")
@bind_tool_to_agent("diagnostic,default")
@bind_tool_to_agent("data_analysis,default")
@bind_tool_to_agent("swe,default")
@bind_tool_to_agent("plan,default")
@tool
def chat_completion(reply: str) -> str:
    """Deliver the final answer to the user. Call this when you are ready to respond."""
    return reply


TOOLS = [chat_completion]
