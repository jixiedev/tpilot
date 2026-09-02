"""SWE specialist — local code editing, shell, and Python execution."""

from __future__ import annotations

from collections.abc import Sequence

from langchain_core.tools import BaseTool

from agent.config import AgentPromptConfig, AgentRunConfig, RouterConfig
from agent.listener import ReactAgentListener
from agent.react.swe.prompt import SWESystemPrompt
from agent.react.swe.tool_scopes import swe_react_tools
from agent.react.tahoe.tahoe_agent import (
    DEFAULT_MAX_IDLE_ROUNDS,
    DEFAULT_MAX_TOOL_CALLS,
    TahoeAgent,
)
from graph.builder import SystemPromptSpec
from memory.profile_store import ProfileStore


class SWEAgent(TahoeAgent):
    """ReAct agent for script and small-program development."""

    prompt_assembler_cls = SWESystemPrompt

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
        prompt_assembler: SWESystemPrompt | None = None,
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
    ) -> SWEAgent:
        store = profile_store or cls.default_profile_store()
        tools = swe_react_tools()
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
