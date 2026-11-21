"""SWE specialist — local code editing, shell, and Python execution."""

from tahoepilot.agent.specialists.swe.swe_agent import (
    REGISTRY_NAME,
    SWEAgent,
    SWESystemPrompt,
    TOOL_ID_DEFAULT,
    TOOL_ID_REACT,
)

__all__ = [
    "REGISTRY_NAME",
    "SWEAgent",
    "SWESystemPrompt",
    "TOOL_ID_DEFAULT",
    "TOOL_ID_REACT",
]
