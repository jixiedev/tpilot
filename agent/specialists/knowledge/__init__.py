"""Knowledge specialist — RAG and metadata tools on the ReAct base."""

from agent.specialists.knowledge.knowledge_agent import (
    KnowledgeAgent,
    KnowledgeSystemPrompt,
    REGISTRY_NAME,
    TOOL_ID_CATALOG,
    TOOL_ID_DEFAULT,
    TOOL_ID_REACT,
)

__all__ = [
    "KnowledgeAgent",
    "KnowledgeSystemPrompt",
    "REGISTRY_NAME",
    "TOOL_ID_CATALOG",
    "TOOL_ID_DEFAULT",
    "TOOL_ID_REACT",
]
