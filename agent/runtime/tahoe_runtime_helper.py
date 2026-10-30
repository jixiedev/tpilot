"""Shared Tahoe team defaults and runtime session helper."""

from __future__ import annotations

from collections.abc import Callable, Sequence
from dataclasses import replace
from pathlib import Path
from typing import Any

from langchain_core.tools import BaseTool
from langgraph.graph.state import CompiledStateGraph

from agent.config import AgentRunContext, RouterConfig
from agent.listener import CliReactListener, ListenerHub, ReactAgentListener
from agent.prompt import SystemPromptAssembler
from agent.runtime.prompt import SESSION_TURN_BOUNDARY
from agent.session import SessionTurnBuilder
from config.local_config import get_local_paths
from memory.profile_store import FileProfileStore, ProfileStore
from state.state import SessionAgentState

DEFAULT_MAX_TOOL_CALLS = 10
# One plain-text reply ends the turn (no multi-minute idle retries for local models).
DEFAULT_MAX_IDLE_ROUNDS = 1
DEFAULT_PROFILE_DIR = get_local_paths().profiles_dir


def default_profile_store(root: Path | None = None) -> FileProfileStore:
    return FileProfileStore(root or DEFAULT_PROFILE_DIR)


def tahoe_router_config(run_context: AgentRunContext) -> RouterConfig:
    refine_enabled = bool(run_context.refine_user_profile_prompt.strip())
    end_outlet = (
        RouterConfig().refine_user_profile_outlet if refine_enabled else "__end__"
    )
    return RouterConfig(
        reason_end_outlet=end_outlet,
        action_end_outlet=end_outlet,
    )


def tahoe_react_agent_kwargs(
    *,
    profile_store: ProfileStore,
    tools: Sequence[BaseTool],
    prompt_assembler: SystemPromptAssembler,
    run_context: AgentRunContext | None = None,
    router_config: RouterConfig | None = None,
    react_listener: ReactAgentListener | None = None,
    system_prompt: Callable[[SessionAgentState], str] | None = None,
) -> dict[str, Any]:
    """Keyword arguments for ``BaseReactAgent`` with Tahoe team defaults."""
    context = run_context or AgentRunContext.default()
    return {
        "system_prompt": system_prompt,
        "run_context": context,
        "router_config": router_config or tahoe_router_config(context),
        "profile_store": profile_store,
        "tools": tools,
        "react_listener": react_listener,
        "prompt_assembler": prompt_assembler,
    }


class TahoeRuntimeHelper:
    """Session turns, profile-aware prompts, and listener hub (not a runnable agent)."""

    def __init__(
        self,
        *,
        profile_store: ProfileStore,
        prompt_assembler: SystemPromptAssembler,
        react_listener: ReactAgentListener | None = None,
        system_prompt: Callable[[SessionAgentState], str] | None = None,
        turn_boundary: str = SESSION_TURN_BOUNDARY,
    ) -> None:
        primary = react_listener or CliReactListener()
        self.react_listener: ListenerHub = (
            primary if isinstance(primary, ListenerHub) else ListenerHub(primary)
        )
        self.profile_store = profile_store
        self.prompt_assembler = prompt_assembler
        self.turn_boundary = turn_boundary
        self.session = SessionTurnBuilder(turn_boundary, profile_store=profile_store)
        self.system_prompt = (
            system_prompt if system_prompt is not None else self.render_system_prompt
        )

    def render_system_prompt(self, state: SessionAgentState) -> str:
        profile = self.profile_store.load_for_turn(state)
        return self.prompt_assembler.with_profile(profile).build()

    async def prepare_turn_input(
        self,
        graph: CompiledStateGraph,
        session: str,
        user_prompt: str,
        *,
        user_id: str | None = None,
    ) -> SessionAgentState:
        return await self.session.prepare_turn_input(
            graph,
            session,
            user_prompt,
            user_id=user_id,
        )

    def on_turn_output(self, state: SessionAgentState) -> None:
        self.react_listener.on_turn_output(state)

    def register_secondary(self, listener: ReactAgentListener) -> None:
        self.react_listener.register_secondary(listener)

    def clear_secondaries(self) -> None:
        self.react_listener.clear_secondaries()


__all__ = [
    "DEFAULT_MAX_IDLE_ROUNDS",
    "DEFAULT_MAX_TOOL_CALLS",
    "DEFAULT_PROFILE_DIR",
    "SESSION_TURN_BOUNDARY",
    "TahoeRuntimeHelper",
    "default_profile_store",
    "tahoe_react_agent_kwargs",
    "tahoe_router_config",
]
