"""Tests for Databot stage tools."""

from __future__ import annotations

from agent.specialists.databot.stage_tools import record_metric_conflict


def test_record_metric_conflict_appends() -> None:
    runtime = type(
        "Runtime",
        (),
        {
            "tool_call_id": "call_1",
            "state": {
                "metric_conflicts": [
                    {
                        "card_name": "orders",
                        "metric": "gmv",
                        "glossary_term": "GMV",
                        "reason": "first",
                    }
                ],
            },
        },
    )()
    cmd = record_metric_conflict(
        card_name="revenue",
        metric="rev",
        glossary_term="Revenue",
        reason="second",
        runtime=runtime,
    )
    update = cmd.update if hasattr(cmd, "update") else cmd["update"]
    conflicts = update["metric_conflicts"]
    assert len(conflicts) == 2
    assert conflicts[0]["card_name"] == "orders"
    assert conflicts[1]["card_name"] == "revenue"
