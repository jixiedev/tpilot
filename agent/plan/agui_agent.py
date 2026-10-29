"""Plan AG-UI agent.

The stock adapter snapshots whatever the parent graph checkpoint holds.
During a plan round that checkpoint is stale, so this subclass puts the
live plan on every snapshot, including the interrupt replay that runs
when a client reconnects to a paused turn.
"""

from __future__ import annotations

from typing import Any

from ag_ui.core import EventType, StateSnapshotEvent
from ag_ui_langgraph import LangGraphAgent

from agent.plan.ui_state import overlay_live_plan_snapshot


def with_live_plan_snapshot_event(
    events: list[Any] | None,
    snapshot_event: Any,
) -> list[Any] | None:
    """Insert ``snapshot_event`` just after ``RUN_STARTED``, when that is first."""
    if not events:
        return events
    first_type = getattr(events[0], "type", None)
    type_value = getattr(first_type, "value", first_type)
    insert_at = 1 if type_value == "RUN_STARTED" else 0
    return [*events[:insert_at], snapshot_event, *events[insert_at:]]


class PlanLangGraphAgent(LangGraphAgent):
    """LangGraph AG-UI adapter that keeps the task tree on the live plan."""

    def get_state_snapshot(self, state: Any) -> Any:
        filtered = super().get_state_snapshot(state)
        return overlay_live_plan_snapshot(filtered)

    async def prepare_stream(self, input: Any, agent_state: Any, config: Any) -> Any:
        prepared = await super().prepare_stream(
            input=input, agent_state=agent_state, config=config
        )
        events = prepared.get("events_to_dispatch")
        if not events:
            return prepared
        values = getattr(agent_state, "values", None) or {}
        snapshot = StateSnapshotEvent(
            type=EventType.STATE_SNAPSHOT,
            snapshot=self.get_state_snapshot(values),
        )
        prepared["events_to_dispatch"] = with_live_plan_snapshot_event(
            list(events), snapshot
        )
        return prepared
