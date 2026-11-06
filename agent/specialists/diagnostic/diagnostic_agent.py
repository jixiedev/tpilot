"""Diagnostic specialist — Airflow MCP and infra tools for production triage."""

from __future__ import annotations

from agent.prompt import SystemPromptAssembler
from agent.react import BaseReactAgent
from config.agent_config import AgentConfig, agent_config_path

REGISTRY_NAME = "diagnostic"
TOOL_ID_DEFAULT = "default"
TOOL_ID_REACT: tuple[str, ...] = (TOOL_ID_DEFAULT,)


class DiagnosticSystemPrompt(SystemPromptAssembler):
    """Production / platform diagnostics across infra read-only tools."""

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or AgentConfig(agent_config_path("diagnostic")))


class DiagnosticAgent(BaseReactAgent):
    """Simple ReAct agent for online Airflow incident diagnosis."""

    prompt_factory = DiagnosticSystemPrompt
    tool_ids = TOOL_ID_REACT
