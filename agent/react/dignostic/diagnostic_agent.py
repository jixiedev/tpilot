"""Diagnostic specialist — Tahoe base + Airflow MCP for production triage."""

from __future__ import annotations

from collections.abc import Sequence

from langchain_core.tools import BaseTool

from agent.config import AgentPromptConfig, AgentRunConfig, RouterConfig
from agent.listener import ReactAgentListener
from agent.react.dignostic.prompt import DiagnosticSystemPrompt
from agent.react.dignostic.tool_scopes import diagnostic_react_tools
from agent.react.tahoe.tahoe_agent import (
    DEFAULT_MAX_IDLE_ROUNDS,
    DEFAULT_MAX_TOOL_CALLS,
    TahoeAgent,
)
from graph.builder import SystemPromptSpec
from memory.profile_store import ProfileStore
from tools.dynamic import register_dynamic_tool_bindings


class DiagnosticAgent(TahoeAgent):
    """Simple ReAct agent for online Airflow incident diagnosis."""

    prompt_assembler_cls = DiagnosticSystemPrompt

    def __init__(
        self,
        *,
        profile_store: ProfileStore,
        tools: Sequence[BaseTool],
        agent_run_config: AgentRunConfig | None = None,
        agent_prompt_config: AgentPromptConfig | None = None,
        router_config: RouterConfig | None = None,
        react_listener: ReactAgentListener | None = None,
        system_prompt: str | SystemPromptSpec | None = None,
        prompt_assembler: DiagnosticSystemPrompt | None = None,
    ) -> None:
        super().__init__(
            profile_store=profile_store,
            tools=tools,
            agent_run_config=agent_run_config,
            agent_prompt_config=agent_prompt_config,
            router_config=router_config,
            react_listener=react_listener,
            system_prompt=system_prompt,
            prompt_assembler=prompt_assembler,
        )

    @classmethod
    async def create(
        cls,
        *,
        profile_store: ProfileStore | None = None,
        max_tool_calls: int = DEFAULT_MAX_TOOL_CALLS,
        max_idle_rounds: int = DEFAULT_MAX_IDLE_ROUNDS,
        enable_compression_tools: bool = True,
        react_listener: ReactAgentListener | None = None,
        system_prompt: str | SystemPromptSpec | None = None,
        agent_prompt_config: AgentPromptConfig | None = None,
        router_config: RouterConfig | None = None,
    ) -> DiagnosticAgent:
        store = profile_store or cls.default_profile_store()
        await register_dynamic_tool_bindings()
        tools = diagnostic_react_tools()
        if not enable_compression_tools:
            from memory.tools import COMPACT_CONTEXT_TOOL_NAME, READ_OFFLOADED_FILE_TOOL_NAME

            skip = {COMPACT_CONTEXT_TOOL_NAME, READ_OFFLOADED_FILE_TOOL_NAME}
            tools = [tool for tool in tools if getattr(tool, "name", "") not in skip]
        return cls(
            profile_store=store,
            tools=tools,
            agent_run_config=AgentRunConfig(
                max_tool_calls=max_tool_calls,
                max_idle_rounds=max_idle_rounds,
            ),
            agent_prompt_config=agent_prompt_config,
            router_config=router_config,
            react_listener=react_listener,
            system_prompt=system_prompt,
        )
