"""Tests for internal-assistant narration heuristics used outside step_reason."""

from __future__ import annotations

from graph.messages import is_internal_assistant_narration


def test_is_internal_assistant_narration_detects_sql_date_reasoning() -> None:
    text = (
        "Actually DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1' MONTH) - if "
        "CURRENT_DATE is say 2026-03-15, then ... [blocked]"
    )
    assert is_internal_assistant_narration(text)
