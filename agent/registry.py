from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from typing import Any

from agent.react import BaseReactAgent
from agent.react.databot.databot_agent import DatabotAgent
from agent.react.tahoe.tahoe_agent import TahoeAgent


@dataclass(frozen=True)
class AgentSpec:
    name: str
    description: str
    create_agent: Callable[..., Awaitable[BaseReactAgent]]


async def _create_tahoe_agent(**kwargs: Any) -> TahoeAgent:
    return await TahoeAgent.create(**kwargs)


async def _create_databot_agent(**kwargs: Any) -> DatabotAgent:
    return await DatabotAgent.create(**kwargs)


TAHOE = AgentSpec(
    name="tahoe",
    description="Tahoe interactive ReAct agent",
    create_agent=_create_tahoe_agent,
)

DATABOT = AgentSpec(
    name="databot",
    description="Data-retrieval specialist (glossary-first → SQL → evidenced answer)",
    create_agent=_create_databot_agent,
)

AGENTS: dict[str, AgentSpec] = {
    TAHOE.name: TAHOE,
    DATABOT.name: DATABOT,
}

DEFAULT_AGENT = TAHOE.name


def get_agent(name: str) -> AgentSpec:
    try:
        return AGENTS[name]
    except KeyError as exc:
        available = ", ".join(sorted(AGENTS))
        raise SystemExit(f"Unknown agent {name!r}; available: {available}") from exc
