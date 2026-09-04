"""Diagnostic specialist — Airflow MCP and infra tools for production triage."""

from __future__ import annotations

from collections.abc import Sequence

from langchain_core.tools import BaseTool

from agent.config import AgentRunContext, RouterConfig
from agent.listener import ReactAgentListener
from agent.specialists.diagnostic.prompt import DiagnosticSystemPrompt
from agent.specialists.diagnostic.tool_scopes import diagnostic_react_tools
from agent.react import BaseReactAgent
from agent.runtime.tahoe_runtime_helper import (
    DEFAULT_MAX_IDLE_ROUNDS,
    DEFAULT_MAX_TOOL_CALLS,
    DEFAULT_PROFILE_DIR,
    SESSION_TURN_BOUNDARY,
    tahoe_run_context,
    tahoe_react_agent_kwargs,
)
from collections.abc import Callable

from state.state import SessionAgentState
from memory.profile_store import ProfileStore
from tools.dynamic import register_dynamic_tool_bindings


class DiagnosticAgent(BaseReactAgent):
    """Simple ReAct agent for online Airflow incident diagnosis."""

    turn_boundary = SESSION_TURN_BOUNDARY
    default_profile_dir = DEFAULT_PROFILE_DIR
    prompt_assembler_cls = DiagnosticSystemPrompt

    def __init__(
        self,
        *,
        profile_store: ProfileStore,
        tools: Sequence[BaseTool],
        run_context: AgentRunContext | None = None,
        router_config: RouterConfig | None = None,
        react_listener: ReactAgentListener | None = None,
        system_prompt: Callable[[SessionAgentState], str] | None = None,
        prompt_assembler: DiagnosticSystemPrompt | None = None,
    ) -> None:
        super().__init__(
            **tahoe_react_agent_kwargs(
                profile_store=profile_store,
                tools=tools,
                prompt_assembler=prompt_assembler or DiagnosticSystemPrompt(),
                run_context=run_context,
                router_config=router_config,
                react_listener=react_listener,
                system_prompt=system_prompt,
            )
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
        system_prompt: Callable[[SessionAgentState], str] | None = None,
        run_context: AgentRunContext | None = None,
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
            run_context=run_context
            or tahoe_run_context(
                max_tool_calls=max_tool_calls,
                max_idle_rounds=max_idle_rounds,
            ),
            router_config=router_config,
            react_listener=react_listener,
            system_prompt=system_prompt,
        )
