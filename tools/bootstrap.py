"""Import tool modules (``register_tool``), then bind tools per agent config."""

from __future__ import annotations

_REGISTERED = False


def ensure_tools_registered() -> None:
    """Register every static tool once, then fill agent scopes from ``[tools]``."""
    global _REGISTERED
    if _REGISTERED:
        return

    import agent.specialists.databot.stage_tools  # noqa: F401
    import agent.plan.stage_tools  # noqa: F401
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
        pass
    import tools.web.search  # noqa: F401

    from agent.catalog import AgentCatalog

    AgentCatalog.bind_configured_tools()
    AgentCatalog.capture_tools_snapshot()
    _REGISTERED = True
