"""Agent factory: registration, tools, create, and instance cache."""

from __future__ import annotations

import inspect
import logging
from collections.abc import Awaitable, Callable, Mapping, Sequence
from dataclasses import dataclass, field
from typing import Any, ClassVar

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver

from agent.agent import BaseAgent
from config.agent_config import AgentConfig, agent_config_path, agent_config_type
from memory import CompressionConfig
from memory.profile_store import ProfileStore

logger = logging.getLogger(__name__)

DEFAULT_AGENT = "intent"

_AgentFactory = Callable[..., Awaitable[BaseAgent]]


@dataclass(frozen=True)
class AgentCatalogSettings:
    """Shared runtime applied to every ``AgentCatalog.create`` call.

    ``compression_config``, when set, replaces each agent file's
    ``[compression]`` table. Leave it unset to use the file.
    """

    profile_store: ProfileStore
    run_overrides: Mapping[str, Any] = field(default_factory=dict)
    compression_config: CompressionConfig | None = None
    model: BaseChatModel | None = None
    checkpointer: BaseCheckpointSaver | None = None

    @classmethod
    def for_agent(
        cls,
        agent_name: str,
        *,
        profile_store: ProfileStore,
        model: BaseChatModel | None = None,
        checkpointer: BaseCheckpointSaver | None = None,
        compression_config: CompressionConfig | None = None,
        **run_overrides: Any,
    ) -> AgentCatalogSettings:
        del agent_name
        return cls(
            profile_store=profile_store,
            run_overrides=run_overrides,
            model=model,
            checkpointer=checkpointer,
            compression_config=compression_config,
        )


class AgentCatalog:
    """Register agents and tools; create compiled instances from that table."""

    _factories: ClassVar[dict[str, _AgentFactory]] = {}
    _configs: ClassVar[dict[str, AgentConfig]] = {}
    _tools: ClassVar[dict[str, dict[str, list[BaseTool]]]] = {}
    _tools_snapshot: ClassVar[dict[str, dict[str, list[BaseTool]]] | None] = None
    _mcp_registered: ClassVar[set[str]] = set()

    def __init__(self, settings: AgentCatalogSettings) -> None:
        self.settings = settings
        self._compiled: dict[str, BaseAgent] = {}

    @classmethod
    def register(
        cls,
        name: str,
        factory: _AgentFactory,
        *,
        config: AgentConfig | None = None,
        config_cls: type[AgentConfig] | None = None,
    ) -> None:
        """Register an agent factory. ``config`` defaults to ``config/agents/<name>.toml``."""
        key = name.strip().lower()
        if not key:
            raise ValueError("agent name must be non-empty")
        cls._factories[key] = factory
        resolved_cls = config_cls or agent_config_type(key)
        cls._configs[key] = config or resolved_cls(agent_config_path(key))
        cls._tools.setdefault(key, {})

    @classmethod
    def unregister(cls, name: str) -> None:
        """Drop a registered agent (test helper)."""
        key = name.strip().lower()
        cls._factories.pop(key, None)
        cls._configs.pop(key, None)
        cls._tools.pop(key, None)

    @classmethod
    def names(cls) -> tuple[str, ...]:
        return tuple(sorted(cls._factories))

    @classmethod
    def config(cls, name: str) -> AgentConfig:
        key = cls._require_name(name)
        return cls._configs[key]

    @classmethod
    def register_tool(
        cls,
        agent_identifier: str,
        tool: BaseTool,
        *,
        replace: bool = False,
    ) -> None:
        """Register one tool under ``agent,identifier``."""
        from tools.registry import parse_agent_identifier

        agent, identifier = parse_agent_identifier(agent_identifier)
        cls._require_name(agent)
        buckets = cls._tools.setdefault(agent, {})
        bucket = buckets.setdefault(identifier, [])
        if replace:
            bucket.clear()
        name = getattr(tool, "name", "") or ""
        if name and any(getattr(existing, "name", "") == name for existing in bucket):
            return
        bucket.append(tool)

    @classmethod
    def clear_tool_identifier(cls, name: str, identifier: str) -> None:
        """Empty one identifier bucket (used before MCP replace)."""
        key = cls._require_name(name)
        cls._tools.setdefault(key, {})[identifier] = []

    @classmethod
    def tools_for(cls, name: str, identifier: str) -> list[BaseTool]:
        """Return tools registered for one agent identifier."""
        from tools.bootstrap import ensure_tools_registered

        ensure_tools_registered()
        key = cls._require_name(name)
        return list(cls._tools.get(key, {}).get(identifier, []))

    @classmethod
    def tools_for_scopes(cls, name: str, identifiers: Sequence[str]) -> list[BaseTool]:
        """Return the union of several identifier buckets, de-duplicated by tool name."""
        return cls.flatten_tools(cls.tools_for_agent(name), *identifiers)

    @classmethod
    def tools_for_agent(cls, name: str) -> dict[str, list[BaseTool]]:
        """Return a copy of every identifier bucket for ``name``."""
        from tools.bootstrap import ensure_tools_registered

        ensure_tools_registered()
        key = cls._require_name(name)
        return {
            ident: list(tools)
            for ident, tools in cls._tools.get(key, {}).items()
        }

    @staticmethod
    def flatten_tools(
        buckets: Mapping[str, Sequence[BaseTool]],
        *identifiers: str,
    ) -> list[BaseTool]:
        """Concatenate identifier buckets, de-duplicated by ``tool.name``."""
        seen: set[str] = set()
        out: list[BaseTool] = []
        for ident in identifiers:
            for tool in buckets.get(ident, ()):
                name = getattr(tool, "name", "") or repr(id(tool))
                if name in seen:
                    continue
                seen.add(name)
                out.append(tool)
        return out

    @classmethod
    def bind_configured_tools(cls) -> None:
        """Fill each agent's scopes from ``[tools]`` in its config file.

        A configured name that is not registered (e.g. an optional extra such
        as ``rag`` is not installed) is skipped with a warning.
        """
        from config.agent_config import agent_tool_scopes, tool_groups
        from tools.registry import registered_tools

        registry = registered_tools()
        groups = tool_groups()
        for agent in cls.names():
            for scope, names in agent_tool_scopes(agent, groups=groups).items():
                cls._tools.setdefault(agent, {}).setdefault(scope, [])
                for tool_name in names:
                    tool = registry.get(tool_name)
                    if tool is None:
                        logger.warning(
                            "agent %s scope %s lists tool %r, which is not registered",
                            agent,
                            scope,
                            tool_name,
                        )
                        continue
                    cls.register_tool(f"{agent},{scope}", tool)

    @classmethod
    def capture_tools_snapshot(cls) -> None:
        """Remember static tool buckets (call after bootstrap, before MCP)."""
        cls._tools_snapshot = {
            name: {ident: list(tools) for ident, tools in buckets.items()}
            for name, buckets in cls._tools.items()
        }

    @classmethod
    def restore_tools_snapshot(cls) -> None:
        """Reset tool buckets to the post-bootstrap snapshot."""
        if cls._tools_snapshot is None:
            from tools.bootstrap import ensure_tools_registered

            ensure_tools_registered()
        if cls._tools_snapshot is None:
            return
        cls._tools = {
            name: {ident: list(tools) for ident, tools in buckets.items()}
            for name, buckets in cls._tools_snapshot.items()
        }

    @classmethod
    async def register_mcp_tools(cls, name: str | None = None) -> None:
        """Load MCP tools from ``accepted_mcp``. ``name=None`` loads every agent."""
        from tools.bootstrap import ensure_tools_registered
        from tools.dynamic import load_mcp_tools_for_servers

        ensure_tools_registered()
        targets = [cls._require_name(name)] if name else list(cls._configs)
        for agent_name in targets:
            if agent_name in cls._mcp_registered:
                continue
            config = cls._configs[agent_name]
            cls._mcp_registered.add(agent_name)
            if not config.accepted_mcp:
                continue
            for identifier, server_names in config.accepted_mcp.items():
                tools = await load_mcp_tools_for_servers(server_names)
                if tools and identifier in config.mcp_replace_identifiers:
                    cls.clear_tool_identifier(agent_name, identifier)
                for tool in tools:
                    cls.register_tool(f"{agent_name},{identifier}", tool)

    @classmethod
    def reset_mcp_tools(cls) -> None:
        """Test helper: restore static tools and allow MCP registration again."""
        cls._mcp_registered = set()
        cls.restore_tools_snapshot()

    @classmethod
    def intention_routes(cls) -> dict[str, str]:
        """Map intention label → specialist agent name."""
        routes: dict[str, str] = {}
        for name in cls.names():
            config = cls.config(name)
            if not config.intention:
                continue
            label = config.intention.strip().upper()
            if not label:
                continue
            if label in routes:
                raise ValueError(
                    f"Duplicate intention {label!r}: "
                    f"{routes[label]!r} and {name!r}"
                )
            routes[label] = name
        return routes

    @classmethod
    def routable_intentions(cls) -> frozenset[str]:
        """Intention labels that IntentOrchestrator may publish and route."""
        return frozenset(cls.intention_routes())

    @classmethod
    def resolve_route_target(cls, intention: str) -> str:
        """Return specialist agent name for ``intention``, or ``\"\"`` if none."""
        label = (intention or "").strip().upper()
        if not label or label == "UNCLEAR":
            return ""
        return cls.intention_routes().get(label, "")

    @classmethod
    def agent_for_intention(cls, intention: str) -> str | None:
        """Return the specialist agent name for ``intention``, if registered."""
        target = cls.resolve_route_target(intention)
        return target or None

    @classmethod
    def intention_catalog(cls) -> list[tuple[str, str]]:
        """Ordered (intention, description) pairs for prompts and clarification copy."""
        items: list[tuple[str, str]] = []
        for label, name in sorted(cls.intention_routes().items()):
            config = cls.config(name)
            description = (config.intention_description or config.description).strip()
            items.append((label, description))
        return items

    @classmethod
    def is_routable_intention(cls, intention: str) -> bool:
        return (intention or "").strip().upper() in cls.routable_intentions()

    @classmethod
    def get_routable_agent(cls, name: str) -> str:
        """Return a registered specialist name (must declare ``intention``)."""
        config = cls.config(name)
        if not config.intention:
            raise SystemExit(
                f"Agent {name!r} is not a routable specialist "
                f"(set intention in config/agents/{name}.toml to enable intent routing)"
            )
        return config.name

    @classmethod
    def published_route_target(cls, state: Any) -> str:
        """Extract the published agent name from a finished intent orchestrator state."""
        if not isinstance(state, dict):
            return ""
        if (state.get("status") or "").strip().lower() != "published":
            return ""
        return str(state.get("route_target") or "").strip()

    @classmethod
    def _require_name(cls, name: str) -> str:
        key = name.strip().lower()
        if key not in cls._factories:
            available = ", ".join(cls.names()) or "(none)"
            raise SystemExit(f"Unknown agent {key!r}; available: {available}")
        return key

    @classmethod
    def _factory(cls, name: str) -> _AgentFactory:
        return cls._factories[cls._require_name(name)]

    async def create(
        self,
        name: str,
        *,
        build_graph: bool = True,
        cache: bool = False,
        **overrides: Any,
    ) -> BaseAgent:
        """Construct ``name`` from the registered factory and inject its tools."""
        key = name.strip().lower()
        if cache and key in self._compiled:
            return self._compiled[key]

        factory = self._factory(key)
        from tools.bootstrap import ensure_tools_registered

        ensure_tools_registered()
        await self.register_mcp_tools(key)

        create_kwargs = self._create_kwargs(overrides)
        run_patch = dict(self.settings.run_overrides)
        extra_run = overrides.get("run_context")
        if isinstance(extra_run, Mapping):
            run_patch = {**run_patch, **extra_run}
        config = create_kwargs.get("agent_config")
        if not isinstance(config, AgentConfig):
            config = self.config(key).with_run_overrides(run_patch)
        compression = overrides.get("compression_config", self.settings.compression_config)
        create_kwargs["agent_config"] = config.with_compression(compression)
        create_kwargs.setdefault("tools", self.tools_for_agent(key))
        create_kwargs = self._filter_factory_kwargs(factory, create_kwargs)
        agent = await factory(**create_kwargs)

        if build_graph and agent.graph is None:
            self._build_agent_graph(agent, overrides)

        if cache:
            self._compiled[key] = agent
        return agent

    async def get_or_create(self, name: str, **overrides: Any) -> BaseAgent:
        """Return a cached compiled agent for ``name``, creating it on first use."""
        return await self.create(name, cache=True, **overrides)

    def _create_kwargs(self, overrides: Mapping[str, Any]) -> dict[str, Any]:
        settings = self.settings
        kwargs: dict[str, Any] = {
            "profile_store": settings.profile_store,
        }
        if settings.model is not None:
            kwargs["model"] = settings.model
        if settings.checkpointer is not None:
            kwargs["checkpointer"] = settings.checkpointer
        for key, value in overrides.items():
            if key in {"build_graph", "cache", "run_context", "compression_config"}:
                continue
            kwargs[key] = value
        return kwargs

    @staticmethod
    def _filter_factory_kwargs(
        factory: _AgentFactory,
        kwargs: Mapping[str, Any],
    ) -> dict[str, Any]:
        sig = inspect.signature(factory)
        params = sig.parameters
        if any(p.kind == inspect.Parameter.VAR_KEYWORD for p in params.values()):
            return dict(kwargs)
        return {key: value for key, value in kwargs.items() if key in params}

    def _build_agent_graph(
        self,
        agent: BaseAgent,
        overrides: Mapping[str, Any],
    ) -> None:
        settings = self.settings
        model = overrides.get("model", settings.model)
        checkpointer = overrides.get("checkpointer", settings.checkpointer)

        sig = inspect.signature(agent.build_graph)
        params = sig.parameters
        accepts_var_kw = any(
            p.kind == inspect.Parameter.VAR_KEYWORD for p in params.values()
        )
        graph_kwargs: dict[str, Any] = {}
        if model is not None and ("model" in params or accepts_var_kw):
            graph_kwargs["model"] = model
        if checkpointer is not None and (
            "checkpointer" in params or accepts_var_kw
        ):
            graph_kwargs["checkpointer"] = checkpointer

        agent.build_graph(**graph_kwargs)

    @classmethod
    def _new_agent(cls, agent_cls: type[BaseAgent], **kwargs: Any) -> BaseAgent:
        """Construct one agent from the shared runtime arguments.

        ``agent_config`` already includes file compression and run overrides.
        A ``max_tool_calls`` keyword overlays that config. Tool buckets are
        flattened when the constructor accepts ``tools``.
        """
        from memory.session_runtime import ensure_session_runtime

        profile_store = kwargs.get("profile_store")
        if profile_store is None:
            raise TypeError(f"{agent_cls.__name__} requires profile_store")
        config = kwargs.get("agent_config")
        if not isinstance(config, AgentConfig):
            raise TypeError(f"{agent_cls.__name__} requires agent_config")
        max_tool_calls = kwargs.get("max_tool_calls")
        if max_tool_calls is not None:
            config = config.with_run_overrides(max_tool_calls=max_tool_calls)
        prepared: dict[str, Any] = {
            "model": kwargs.get("model"),
            "checkpointer": kwargs.get("checkpointer"),
            "session_runtime": ensure_session_runtime(profile_store),
            "agent_config": config,
            "listener": kwargs.get("listener"),
        }
        params = inspect.signature(agent_cls.__init__).parameters
        if "tools" in params:
            tool_ids = tuple(getattr(agent_cls, "tool_ids", ()))
            prepared["tools"] = cls.flatten_tools(kwargs.get("tools") or {}, *tool_ids)
        if "retrievals" in params and kwargs.get("retrievals") is not None:
            prepared["retrievals"] = kwargs["retrievals"]
        return agent_cls(**prepared)

    @classmethod
    async def _create_databot(cls, **kwargs: Any) -> BaseAgent:
        from agent.specialists.databot.databot_agent import DatabotAgent

        return cls._new_agent(DatabotAgent, **kwargs)

    @classmethod
    async def _create_knowledge(cls, **kwargs: Any) -> BaseAgent:
        from agent.specialists.knowledge import KnowledgeAgent

        return cls._new_agent(KnowledgeAgent, **kwargs)

    @classmethod
    async def _create_diagnostic(cls, **kwargs: Any) -> BaseAgent:
        from agent.specialists.diagnostic import DiagnosticAgent

        return cls._new_agent(DiagnosticAgent, **kwargs)

    @classmethod
    async def _create_data_analysis(cls, **kwargs: Any) -> BaseAgent:
        from agent.specialists.data_analysis import DataAnalysisAgent

        return cls._new_agent(DataAnalysisAgent, **kwargs)

    @classmethod
    async def _create_swe(cls, **kwargs: Any) -> BaseAgent:
        from agent.specialists.swe import SWEAgent

        return cls._new_agent(SWEAgent, **kwargs)

    @classmethod
    async def _create_plan(cls, **kwargs: Any) -> BaseAgent:
        from agent.plan.plan_agent import PlanAgent

        return cls._new_agent(PlanAgent, **kwargs)

    @classmethod
    async def _create_intent(cls, **kwargs: Any) -> BaseAgent:
        from agent.intent.orchestrator import IntentOrchestrator

        return cls._new_agent(IntentOrchestrator, **kwargs)

    @classmethod
    def register_builtins(cls) -> None:
        cls.register("databot", cls._create_databot)
        cls.register("knowledge", cls._create_knowledge)
        cls.register("diagnostic", cls._create_diagnostic)
        cls.register("data_analysis", cls._create_data_analysis)
        cls.register("swe", cls._create_swe)
        cls.register("plan", cls._create_plan)
        cls.register("intent", cls._create_intent)


AgentCatalog.register_builtins()


