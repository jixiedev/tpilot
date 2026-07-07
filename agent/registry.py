from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from langgraph.graph.state import CompiledStateGraph

from agent.chatbot.display import print_turn_output
from agent.chatbot.graph import build_chat_graph
from agent.chatbot.session import begin_turn
from state.state import AgentState, StateProcessor


@dataclass(frozen=True)
class AgentSpec:
    name: str
    description: str
    build_graph: Callable[..., Awaitable[CompiledStateGraph]]
    begin_turn: Callable[[StateProcessor, str, str], AgentState]
    print_turn_output: Callable[..., None]


CHATBOT = AgentSpec(
    name="chatbot",
    description="Multi-turn data assistant with Hive, Trino, MCP, and chat_completion",
    build_graph=build_chat_graph,
    begin_turn=begin_turn,
    print_turn_output=print_turn_output,
)

AGENTS: dict[str, AgentSpec] = {
    CHATBOT.name: CHATBOT,
}

DEFAULT_AGENT = CHATBOT.name


def get_agent(name: str) -> AgentSpec:
    try:
        return AGENTS[name]
    except KeyError as exc:
        available = ", ".join(sorted(AGENTS))
        raise SystemExit(f"Unknown agent {name!r}; available: {available}") from exc
