"""Import tool modules so ``bind_tool_to_agent`` registrations run."""

from __future__ import annotations

from typing import Any

_REGISTERED = False
_ORIGINAL_REGISTER_TOOLS: dict[str, dict[str, list[Any]]] | None = None


def ensure_tools_registered() -> None:
    """Load every static tool module once (decorators populate ``register_tools``)."""
    global _REGISTERED, _ORIGINAL_REGISTER_TOOLS
    if _REGISTERED:
        return

    import agent.specialists.databot.stage_tools  # noqa: F401
    import agent.plan.stage_tools  # noqa: F401
    import agent.runtime.tahoe_runtime_helper  # noqa: F401
    import memory.tools  # noqa: F401
    import tools.code  # noqa: F401
    import tools.data.hive  # noqa: F401
    import tools.data.s3  # noqa: F401
    import tools.data.trino  # noqa: F401
    import tools.external.datahub  # noqa: F401
    import tools.k8s  # noqa: F401
    import tools.plan  # noqa: F401
    try:
        import tools.rag  # noqa: F401
    except ImportError:
        # Optional: pip install tahoepilot[rag]
        pass
    import tools.web.search  # noqa: F401

    from agent.registry import AGENTS

    _ORIGINAL_REGISTER_TOOLS = {
        name: {ident: list(tools) for ident, tools in spec.register_tools.items()}
        for name, spec in AGENTS.items()
    }
    _REGISTERED = True


def restore_register_tools_snapshot() -> None:
    """Test helper: reset ``register_tools`` to the post-bootstrap snapshot."""
    global _ORIGINAL_REGISTER_TOOLS
    if _ORIGINAL_REGISTER_TOOLS is None:
        ensure_tools_registered()
    if _ORIGINAL_REGISTER_TOOLS is None:
        return
    from agent.registry import AGENTS

    for agent_name, buckets in _ORIGINAL_REGISTER_TOOLS.items():
        spec = AGENTS[agent_name]
        spec.register_tools.clear()
        for ident, tools in buckets.items():
            spec.register_tools[ident] = list(tools)
