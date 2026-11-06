"""Minimal chat model for agent unit tests (no network)."""

from __future__ import annotations

from typing import Any


class MinimalChatModel:
    """Satisfies ``bind_tools`` used when compiling ReAct graphs in tests."""

    def bind_tools(self, tools: Any, **kwargs: Any) -> MinimalChatModel:
        return self
