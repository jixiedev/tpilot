from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from langgraph.graph.state import CompiledStateGraph

from agent.chatbot.display import print_turn_output
from agent.chatbot.graph import build_chat_graph
from agent.chatbot.session import prepare_turn_input
from state.state import SessionAgentState


@dataclass(frozen=True)
class AgentSpec:
    name: str
    description: str
    build_graph: Callable[..., Awaitable[CompiledStateGraph]]
    prepare_turn_input: Callable[..., Awaitable[SessionAgentState]]
    print_turn_output: Callable[..., None]


DATABOT = AgentSpec(
    name="databot",
    description="Multi-turn data assistant",
    build_graph=build_chat_graph,
    prepare_turn_input=prepare_turn_input,
    print_turn_output=print_turn_output,
)

AGENTS: dict[str, AgentSpec] = {
    DATABOT.name: DATABOT,
}

DEFAULT_AGENT = DATABOT.name


def get_agent(name: str) -> AgentSpec:
    try:
        return AGENTS[name]
    except KeyError as exc:
        available = ", ".join(sorted(AGENTS))
        raise SystemExit(f"Unknown agent {name!r}; available: {available}") from exc
