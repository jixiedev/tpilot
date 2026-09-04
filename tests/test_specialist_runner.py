"""Tests for nested specialist delegation."""

from __future__ import annotations

import asyncio
from unittest.mock import AsyncMock, patch

import pytest

from agent.plan.stage_tools import SpecialistRunner


@pytest.mark.asyncio
async def test_run_isolated_delegates_in_worker_thread() -> None:
    runner = SpecialistRunner(get_specialist=AsyncMock())
    with patch(
        "agent.plan.stage_tools.asyncio.to_thread",
        new_callable=AsyncMock,
    ) as to_thread:
        to_thread.return_value = "nested output"
        output = await runner.run_isolated(
            "knowledge",
            "what is shipping_country",
            parent_session="parent",
        )
    assert output == "nested output"
    to_thread.assert_awaited_once()
    work = to_thread.await_args.args[0]
    assert callable(work)
