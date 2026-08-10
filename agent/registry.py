"""Agent registry and intention → specialist routing."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from typing import Any

from agent.agent import BaseAgent


@dataclass(frozen=True)
class AgentSpec:
    """Registered agent application.

    Set ``intention`` to make this agent a routable specialist for IntentOrchestrator.
    Leave it ``None`` for entrypoints that are not intention targets (e.g. tahoe, intent).
    """

    name: str
    description: str
    create_agent: Callable[..., Awaitable[BaseAgent]]
    intention: str | None = None
    intention_description: str = ""


async def _create_tahoe_agent(**kwargs: Any) -> BaseAgent:
    from agent.react.tahoe.tahoe_agent import TahoeAgent

    return await TahoeAgent.create(**kwargs)


async def _create_databot_agent(**kwargs: Any) -> BaseAgent:
    from agent.react.databot.databot_agent import DatabotAgent

    return await DatabotAgent.create(**kwargs)


async def _create_knowledge_agent(**kwargs: Any) -> BaseAgent:
    from agent.react.knowledge.knowledge_agent import KnowledgeAgent

    return await KnowledgeAgent.create(**kwargs)


async def _create_intent_agent(**kwargs: Any) -> BaseAgent:
    from agent.intent.orchestrator import IntentOrchestrator

    return await IntentOrchestrator.create(**kwargs)


TAHOE = AgentSpec(
    name="tahoe",
    description="Tahoe interactive ReAct agent",
    create_agent=_create_tahoe_agent,
)

DATABOT = AgentSpec(
    name="databot",
    description="Data-retrieval specialist (glossary-first → SQL → evidenced answer)",
    create_agent=_create_databot_agent,
    intention="DATA",
    intention_description=(
        "data retrieval or analysis — find tables, metrics/glossary definitions, "
        "schemas, run read-only SQL, compute numbers, or investigate data anomalies "
        "using warehouse / catalog tools"
    ),
)

KNOWLEDGE = AgentSpec(
    name="knowledge",
    description="Tahoe team knowledge specialist (code, docs, wikis, Jira)",
    create_agent=_create_knowledge_agent,
    intention="KNOWLEDGE",
    intention_description=(
        "team knowledge — Tahoe codebase, architecture docs, Google Docs, "
        "wikis/FAQs, or Jira tickets (how systems work, where code lives, process questions)"
    ),
)

INTENT = AgentSpec(
    name="intent",
    description="Intent orchestrator (plan intentions → specialist AgentChain)",
    create_agent=_create_intent_agent,
)

AGENTS: dict[str, AgentSpec] = {
    TAHOE.name: TAHOE,
    DATABOT.name: DATABOT,
    KNOWLEDGE.name: KNOWLEDGE,
    INTENT.name: INTENT,
}

DEFAULT_AGENT = TAHOE.name


def get_agent(name: str) -> AgentSpec:
    try:
        return AGENTS[name]
    except KeyError as exc:
        available = ", ".join(sorted(AGENTS))
        raise SystemExit(f"Unknown agent {name!r}; available: {available}") from exc


def intention_routes() -> dict[str, AgentSpec]:
    """Map intention label → specialist ``AgentSpec`` (extensible via registry)."""
    routes: dict[str, AgentSpec] = {}
    for spec in AGENTS.values():
        if not spec.intention:
            continue
        label = spec.intention.strip().upper()
        if not label:
            continue
        if label in routes:
            raise ValueError(
                f"Duplicate intention {label!r}: "
                f"{routes[label].name!r} and {spec.name!r}"
            )
        routes[label] = spec
    return routes


def routable_intentions() -> frozenset[str]:
    """Intention labels that IntentOrchestrator may publish and route."""
    return frozenset(intention_routes())


def resolve_route_target(intention: str) -> str:
    """Return specialist agent name for ``intention``, or ``\"\"`` if none."""
    label = (intention or "").strip().upper()
    if not label or label == "UNCLEAR":
        return ""
    spec = intention_routes().get(label)
    return spec.name if spec is not None else ""


def get_agent_for_intention(intention: str) -> AgentSpec | None:
    """Return the specialist ``AgentSpec`` for ``intention``, if registered."""
    label = (intention or "").strip().upper()
    if not label or label == "UNCLEAR":
        return None
    return intention_routes().get(label)


def intention_catalog() -> list[tuple[str, str]]:
    """Ordered (intention, description) pairs for prompts and clarification copy."""
    items: list[tuple[str, str]] = []
    for label, spec in sorted(intention_routes().items()):
        description = (spec.intention_description or spec.description).strip()
        items.append((label, description))
    return items


def is_routable_intention(intention: str) -> bool:
    return (intention or "").strip().upper() in routable_intentions()


def get_routable_agent(name: str) -> AgentSpec:
    """Return a registered specialist by agent name (must declare ``intention``)."""
    spec = get_agent(name)
    if not spec.intention:
        raise SystemExit(
            f"Agent {name!r} is not a routable specialist "
            f"(set AgentSpec.intention to enable intent routing)"
        )
    return spec


def published_route_target(state: Any) -> str:
    """Extract first specialist agent name from a finished intent orchestrator state."""
    if not isinstance(state, dict):
        return ""
    if (state.get("status") or "").strip().lower() != "published":
        return ""
    targets = state.get("route_targets")
    if isinstance(targets, list) and targets:
        first = str(targets[0] or "").strip()
        if first:
            return first
    return str(state.get("route_target") or "").strip()


def published_execution_plan(state: Any) -> list[dict[str, Any]]:
    """Return the published specialist plan, or a single-step fallback from route_target."""
    if not isinstance(state, dict):
        return []
    if (state.get("status") or "").strip().lower() != "published":
        return []
    plan = state.get("execution_plan")
    if isinstance(plan, list) and plan:
        return [dict(item) for item in plan if isinstance(item, dict)]
    target = str(state.get("route_target") or "").strip()
    if not target:
        return []
    intention = str(state.get("user_intention") or "").strip().upper()
    question = str(state.get("user_question") or "").strip()
    return [
        {
            "step_index": 0,
            "intention": intention,
            "agent": target,
            "task": question or f"Handle the {intention or target} request.",
        }
    ]


def specialist_session_id(session: str, agent_name: str) -> str:
    """Isolate specialist checkpoints from the intent-router thread."""
    return f"{session}:{agent_name}"
