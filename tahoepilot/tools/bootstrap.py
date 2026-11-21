"""Import tool modules (``register_tool``), then bind tools per agent config."""

from __future__ import annotations

_REGISTERED = False


def ensure_tools_registered() -> None:
    """Register every static tool once, then fill agent scopes from ``[tools]``."""
    global _REGISTERED
    if _REGISTERED:
        return

    import tahoepilot.agent.specialists.databot.stage_tools  # noqa: F401
    import tahoepilot.memory.tools  # noqa: F401
    import tahoepilot.tools.code  # noqa: F401
    import tahoepilot.tools.data.hive  # noqa: F401
    import tahoepilot.tools.data.metrics  # noqa: F401
    import tahoepilot.tools.data.s3  # noqa: F401
    import tahoepilot.tools.data.trino  # noqa: F401
    import tahoepilot.tools.external.datahub  # noqa: F401
    import tahoepilot.tools.k8s  # noqa: F401
    import tahoepilot.tools.plan  # noqa: F401
    try:
        import tahoepilot.tools.rag  # noqa: F401
    except ImportError:
        pass
    import tahoepilot.tools.web.search  # noqa: F401

    from tahoepilot.agent.catalog import AgentCatalog

    AgentCatalog.bind_configured_tools()
    AgentCatalog.capture_tools_snapshot()
    _REGISTERED = True
