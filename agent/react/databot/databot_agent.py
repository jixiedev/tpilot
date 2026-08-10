"""Databot retrieval agent — Tahoe base + warehouse/data tools and prompts."""

from __future__ import annotations

from collections.abc import Sequence

from langchain_core.tools import BaseTool

from agent.config import AgentPromptConfig, AgentRunConfig, RouterConfig
from agent.react.databot.prompt import (
    IDLE_CHAT_COMPLETION_PROMPT,
    NEXT_STEP_PROMPT,
    REFINE_USER_PROFILE_PROMPT,
    TOOL_BUDGET_EXHAUSTED_PROMPT,
    DatabotSystemPrompt,
)
from agent.listener import ReactAgentListener
from agent.react.tahoe.tahoe_agent import (
    DEFAULT_MAX_IDLE_ROUNDS,
    DEFAULT_MAX_TOOL_CALLS,
    TahoeAgent,
)
from graph.builder import SystemPromptSpec
from memory.profile_store import ProfileStore
from tools.loader import load_data_tools


class DatabotAgent(TahoeAgent):
    """Data-retrieval specialist on top of the Tahoe team agent base."""

    prompt_assembler_cls = DatabotSystemPrompt

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
        prompt_assembler: DatabotSystemPrompt | None = None,
    ) -> None:
        super().__init__(
            profile_store=profile_store,
            tools=tools,
            agent_run_config=agent_run_config,
            agent_prompt_config=agent_prompt_config or self.default_prompt_config(),
            router_config=router_config,
            react_listener=react_listener,
            system_prompt=system_prompt,
            prompt_assembler=prompt_assembler,
        )

    @classmethod
    def default_prompt_config(cls) -> AgentPromptConfig:
        return AgentPromptConfig(
            next_step=NEXT_STEP_PROMPT,
            idle_nudge_prompt=IDLE_CHAT_COMPLETION_PROMPT,
            tool_budget_exhausted_prompt=TOOL_BUDGET_EXHAUSTED_PROMPT,
            refine_user_profile_prompt=REFINE_USER_PROFILE_PROMPT,
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
    ) -> DatabotAgent:
        store = profile_store or cls.default_profile_store()
        data_tools = await load_data_tools()
        tools: list[BaseTool] = [
            *data_tools,
            *cls.base_tools(enable_compression_tools=enable_compression_tools),
        ]
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
