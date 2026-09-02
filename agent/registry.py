"""Agent registry and intention → specialist routing."""

from __future__ import annotations

from collections.abc import Awaitable, Callable, Mapping
from dataclasses import dataclass, field
from typing import Any

from langchain_core.tools import BaseTool

from agent.agent import BaseAgent

# ``accepted_mcp`` server list token: load tools from every server in mcp.json.
MCP_ALL_SERVERS = "*"


@dataclass(frozen=True)
class AgentSpec:
    """Registered agent application.

    Set ``intention`` to make this agent a routable specialist for IntentOrchestrator.
    Leave it ``None`` for entrypoints that are not intention targets (e.g. tahoe, intent).

    ``accepted_mcp`` maps tool identifiers (same keys as ``register_tools``) to MCP
    server names from ``tools/mcp/mcp.json``. On startup, every tool from those
    servers is registered under that identifier. Use ``MCP_ALL_SERVERS`` (``"*"``)
    to accept tools from all configured servers.

    ``mcp_replace_identifiers`` lists identifiers whose static tool bucket is
    cleared before MCP tools are registered (e.g. native DataHub GraphQL replaced
    by the DataHub MCP server).
    """

    name: str
    description: str
    create_agent: Callable[..., Awaitable[BaseAgent]]
    register_tools: dict[str, list[BaseTool]] = field(default_factory=dict)
    accepted_mcp: Mapping[str, tuple[str, ...]] = field(default_factory=dict)
    mcp_replace_identifiers: frozenset[str] = frozenset()
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


async def _create_diagnostic_agent(**kwargs: Any) -> BaseAgent:
    from agent.react.dignostic.diagnostic_agent import DiagnosticAgent

    return await DiagnosticAgent.create(**kwargs)


async def _create_data_analysis_agent(**kwargs: Any) -> BaseAgent:
    from agent.react.data_analysis.data_analysis_agent import DataAnalysisAgent

    return await DataAnalysisAgent.create(**kwargs)


async def _create_swe_agent(**kwargs: Any) -> BaseAgent:
    from agent.react.swe.swe_agent import SWEAgent

    return await SWEAgent.create(**kwargs)


async def _create_plan_agent(**kwargs: Any) -> BaseAgent:
    from agent.react.plan.plan_agent import PlanAgent

    return await PlanAgent.create(**kwargs)


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
    accepted_mcp={
        "default": (MCP_ALL_SERVERS,),
        "fetch": ("datahub",),
    },
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
    accepted_mcp={
        "catalog": ("datahub",),
        "default": ("datahub",),
    },
    mcp_replace_identifiers=frozenset({"catalog"}),
    intention="KNOWLEDGE",
    intention_description=(
        "team knowledge — Tahoe codebase, architecture docs, Google Docs, "
        "wikis/FAQs, or Jira tickets (how systems work, where code lives, process questions)"
    ),
)

DIAGNOSTIC = AgentSpec(
    name="diagnostic",
    description=(
        "Production diagnostics specialist (K8s, S3, Hive/Trino, Airflow MCP, and other infra tools)"
    ),
    create_agent=_create_diagnostic_agent,
    accepted_mcp={
        "default": ("airflow_tahoe", "airflow_legacy"),
    },
)

DATA_ANALYSIS = AgentSpec(
    name="data_analysis",
    description="Exploratory data analysis specialist (SQL, Python, charts)",
    create_agent=_create_data_analysis_agent,
)

SWE = AgentSpec(
    name="swe",
    description="Software engineering specialist (edit files, shell, Python scripts)",
    create_agent=_create_swe_agent,
)

PLAN = AgentSpec(
    name="plan",
    description="Plan-and-execute orchestrator (decompose tasks, delegate to specialists)",
    create_agent=_create_plan_agent,
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
    DIAGNOSTIC.name: DIAGNOSTIC,
    DATA_ANALYSIS.name: DATA_ANALYSIS,
    SWE.name: SWE,
    PLAN.name: PLAN,
    INTENT.name: INTENT,
}

DEFAULT_AGENT = TAHOE.name


def get_agent(name: str) -> AgentSpec:
    try:
        return AGENTS[name]
    except KeyError as exc:
        available = ", ".join(sorted(AGENTS))
        raise SystemExit(f"Unknown agent {name!r}; available: {available}") from exc


def get_agent_tools(agent_name: str, identifier: str) -> list[BaseTool]:
    """Return tools registered for one agent identifier (empty when unset)."""
    from tools.bootstrap import ensure_tools_registered

    ensure_tools_registered()
    spec = get_agent(agent_name)
    return list(spec.register_tools.get(identifier, []))


def get_all_registered_tools(agent_name: str) -> list[BaseTool]:
    """Return every tool registered for an agent, de-duplicated by tool name."""
    from tools.bootstrap import ensure_tools_registered

    ensure_tools_registered()
    spec = get_agent(agent_name)
    seen: set[str] = set()
    out: list[BaseTool] = []
    for tools in spec.register_tools.values():
        for tool in tools:
            name = getattr(tool, "name", "") or repr(id(tool))
            if name in seen:
                continue
            seen.add(name)
            out.append(tool)
    return out


def dedupe_tools(tools: list[BaseTool]) -> list[BaseTool]:
    """De-duplicate a tool list by ``tool.name`` (first occurrence wins)."""
    seen: set[str] = set()
    out: list[BaseTool] = []
    for tool in tools:
        name = getattr(tool, "name", "") or repr(id(tool))
        if name in seen:
            continue
        seen.add(name)
        out.append(tool)
    return out


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
