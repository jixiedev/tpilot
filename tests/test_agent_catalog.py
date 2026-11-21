"""Tests for ``AgentCatalog``."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from tahoepilot.agent.agent import BaseAgent
from tahoepilot.agent.catalog import AgentCatalog, AgentCatalogSettings
from tahoepilot.memory.profile_store import FileProfileStore


@pytest.mark.asyncio
async def test_catalog_create_invokes_registry_factory(tmp_path) -> None:
    store = FileProfileStore(tmp_path)
    built = MagicMock(spec=BaseAgent)
    built.graph = None
    built.build_graph = MagicMock()

    factory = AsyncMock(return_value=built)
    original = AgentCatalog._factories["knowledge"]
    AgentCatalog._factories["knowledge"] = factory
    try:
        catalog = AgentCatalog(
            AgentCatalogSettings.for_agent("knowledge", profile_store=store, max_tool_calls=5)
        )
        agent = await catalog.create("knowledge")
    finally:
        AgentCatalog._factories["knowledge"] = original

    assert agent is built
    factory.assert_awaited_once()
    call_kwargs = factory.await_args.kwargs
    assert call_kwargs["profile_store"] is store
    assert call_kwargs["agent_config"].run_context["max_tool_calls"] == 5
    assert "run_context" not in call_kwargs
    assert "tools" in call_kwargs
    built.build_graph.assert_called_once()


@pytest.mark.asyncio
async def test_catalog_get_or_create_caches(tmp_path) -> None:
    store = FileProfileStore(tmp_path)
    built = MagicMock(spec=BaseAgent)
    built.graph = None
    built.build_graph = MagicMock()

    factory = AsyncMock(return_value=built)
    original = AgentCatalog._factories["lead"]
    AgentCatalog._factories["lead"] = factory
    try:
        catalog = AgentCatalog(
            AgentCatalogSettings.for_agent("lead", profile_store=store)
        )
        first = await catalog.get_or_create("lead")
        second = await catalog.get_or_create("lead")
    finally:
        AgentCatalog._factories["lead"] = original

    assert first is second
    assert factory.await_count == 1
