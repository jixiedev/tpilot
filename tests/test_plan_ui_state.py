"""Tests for the Plan agent UI state subset helper.

The frontend binds to a small, stable shape (see ``agent/plan/ui_state.py``).
Adding or removing a key here is a contract change; these tests pin the
current shape so a future edit doesn't silently drop a field the UI reads.
"""

from __future__ import annotations

from agent.plan.ui_state import PLAN_STATE_KEYS, plan_state_subset


def test_plan_state_keys_are_stable() -> None:
    assert PLAN_STATE_KEYS == (
        "plan_id",
        "stage",
        "user_question",
        "subagent_rounds",
        "step_results",
        "plan_snapshot",
    )


def test_plan_state_subset_picks_only_known_keys() -> None:
    full = {
        "plan_id": "p1",
        "stage": "execute",
        "user_question": "what's GMV?",
        "subagent_rounds": 2,
        "step_results": [{"agent": "databot", "output": "42"}],
        "plan_snapshot": {"plan_id": "p1", "title": "T", "steps": []},
        # Keys the UI does not read — must be filtered out.
        "messages": ["hidden"],
        "profile_blob": "internal",
        "_private": True,
    }
    out = plan_state_subset(full)
    assert out == {
        "plan_id": "p1",
        "stage": "execute",
        "user_question": "what's GMV?",
        "subagent_rounds": 2,
        "step_results": [{"agent": "databot", "output": "42"}],
        "plan_snapshot": {"plan_id": "p1", "title": "T", "steps": []},
    }
    assert "messages" not in out
    assert "_private" not in out


def test_plan_state_subset_handles_missing_keys() -> None:
    """Partial state (e.g. mid-turn) must not raise; missing keys are simply absent."""
    out = plan_state_subset({"plan_id": "p1"})
    assert out == {"plan_id": "p1"}


def test_plan_state_subset_handles_empty() -> None:
    assert plan_state_subset({}) == {}


def test_plan_state_subset_preserves_none_snapshot() -> None:
    """``plan_snapshot`` is ``None`` before the agent calls ``create_plan``."""
    out = plan_state_subset({"plan_id": "p1", "stage": "create", "plan_snapshot": None})
    assert out == {"plan_id": "p1", "stage": "create", "plan_snapshot": None}
