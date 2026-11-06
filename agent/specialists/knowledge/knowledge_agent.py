"""Knowledge specialist — RAG and metadata tools on the ReAct base."""

from __future__ import annotations

from agent.prompt import SystemPromptAssembler
from agent.react import BaseReactAgent
from config.agent_config import AgentConfig, agent_config_path

REGISTRY_NAME = "knowledge"
TOOL_ID_DEFAULT = "default"
TOOL_ID_CATALOG = "catalog"
TOOL_ID_REACT: tuple[str, ...] = (TOOL_ID_DEFAULT, TOOL_ID_CATALOG)


class KnowledgeSystemPrompt(SystemPromptAssembler):
    """Knowledge: Tahoe base plus team-doc / Jira retrieval guidance."""

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or AgentConfig(agent_config_path("knowledge")))


class KnowledgeAgent(BaseReactAgent):
    """Team knowledge specialist (code, docs, wikis, Jira)."""

    prompt_factory = KnowledgeSystemPrompt
    tool_ids = TOOL_ID_REACT
