"""Data analysis specialist — warehouse SQL and Python visualization."""

from __future__ import annotations

from agent.prompt import SystemPromptAssembler
from agent.react import BaseReactAgent
from config.agent_config import AgentConfig, agent_config_path

REGISTRY_NAME = "data_analysis"
TOOL_ID_DEFAULT = "default"
TOOL_ID_REACT: tuple[str, ...] = (TOOL_ID_DEFAULT,)


class DataAnalysisSystemPrompt(SystemPromptAssembler):
    """Exploratory analysis, aggregation, and visualization on warehouse data."""

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or AgentConfig(agent_config_path("data_analysis")))


class DataAnalysisAgent(BaseReactAgent):
    """ReAct agent for exploratory analytics and charting."""

    prompt_factory = DataAnalysisSystemPrompt
    tool_ids = TOOL_ID_REACT
