"""Tahoe team agent base — shared CLI ReAct contract without domain data tools."""

from __future__ import annotations

from collections.abc import Sequence
from pathlib import Path

from langchain_core.tools import BaseTool

from agent.react.react import BaseReactAgent
from agent.config import AgentPromptConfig, AgentRunConfig, RouterConfig
from agent.listener import CliReactListener, ReactAgentListener
from agent.react.tahoe.prompt import (
    IDLE_CHAT_COMPLETION_PROMPT,
    NEXT_STEP_PROMPT,
    REFINE_USER_PROFILE_PROMPT,
    SESSION_TURN_BOUNDARY,
    TOOL_BUDGET_EXHAUSTED_PROMPT,
    TahoeSystemPrompt,
)
from agent.react.tahoe.tool_scopes import REGISTRY_NAME, TOOL_ID_REACT
from agent.react.tahoe.tools import CHAT_COMPLETION_TOOL_NAME
from agent.scoped_tools import RegistryScopedTools
from graph.builder import SystemPromptSpec
from memory import COMPRESSION_TOOLS
from memory.profile_store import ProfileStore

DEFAULT_MAX_TOOL_CALLS = 10
# One plain-text reply ends the turn (no multi-minute idle retries for local models).
DEFAULT_MAX_IDLE_ROUNDS = 1
DEFAULT_PROFILE_DIR = Path(__file__).resolve().parents[2] / "profiles"


_COMPRESSION_TOOL_NAMES = frozenset(
    {getattr(tool, "name", "") for tool in COMPRESSION_TOOLS}
)


class TahoeAgent(BaseReactAgent, RegistryScopedTools):
    """Base agent for Tahoe team products.

    Provides session turns, chat_completion gating, compression tools, and the
    generic Tahoe prompt. Domain agents (e.g. Databot) subclass this and add
    their own tools and prompts.
    """

    registry_name = REGISTRY_NAME
    completion_tool_name = CHAT_COMPLETION_TOOL_NAME
    turn_boundary = SESSION_TURN_BOUNDARY
    default_profile_dir = DEFAULT_PROFILE_DIR
    prompt_assembler_cls = TahoeSystemPrompt

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
        prompt_assembler: TahoeSystemPrompt | None = None,
    ) -> None:
        run_config = agent_run_config or AgentRunConfig(
            max_tool_calls=DEFAULT_MAX_TOOL_CALLS,
            max_idle_rounds=DEFAULT_MAX_IDLE_ROUNDS,
        )
        prompt_config = agent_prompt_config or self.default_prompt_config()
        if router_config is None:
            refine_enabled = bool(prompt_config.refine_user_profile_prompt.strip())
            router_config = RouterConfig(
                action_end_outlet="refine_user_profile" if refine_enabled else "__end__",
            )
        super().__init__(
            system_prompt=system_prompt,
            agent_prompt_config=prompt_config,
            agent_run_config=run_config,
            router_config=router_config,
            profile_store=profile_store,
            tools=tools,
            react_listener=react_listener
            or CliReactListener(completion_tool_name=self.completion_tool_name),
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
    def base_tools(cls, *, enable_compression_tools: bool = True) -> list[BaseTool]:
        """Tools shared by all Tahoe team agents (no warehouse/MCP data tools)."""
        tools = cls.tools_for_scope(TOOL_ID_REACT)
        if not enable_compression_tools:
            tools = [
                tool
                for tool in tools
                if getattr(tool, "name", "") not in _COMPRESSION_TOOL_NAMES
            ]
        return tools

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
    ) -> TahoeAgent:
        store = profile_store or cls.default_profile_store()
        return cls(
            profile_store=store,
            tools=cls.base_tools(enable_compression_tools=enable_compression_tools),
            agent_run_config=AgentRunConfig(
                max_tool_calls=max_tool_calls,
                max_idle_rounds=max_idle_rounds,
            ),
            agent_prompt_config=agent_prompt_config,
            router_config=router_config,
            react_listener=react_listener,
            system_prompt=system_prompt,
        )
