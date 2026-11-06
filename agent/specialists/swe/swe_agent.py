"""SWE specialist — local code editing, shell, and Python execution."""

from __future__ import annotations

from agent.prompt import SystemPromptAssembler
from agent.react import BaseReactAgent
from config.agent_config import AgentConfig, agent_config_path

REGISTRY_NAME = "swe"
TOOL_ID_DEFAULT = "default"
TOOL_ID_REACT: tuple[str, ...] = (TOOL_ID_DEFAULT,)


class SWESystemPrompt(SystemPromptAssembler):
    """Local script and code development via editor, shell, and Python."""

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or AgentConfig(agent_config_path("swe")))


class SWEAgent(BaseReactAgent):
    """ReAct agent for script and small-program development."""

    prompt_factory = SWESystemPrompt
    tool_ids = TOOL_ID_REACT
