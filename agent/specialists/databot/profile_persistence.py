"""Persist per-turn Databot artifacts (approved cards, SQL) to a sidecar JSONL."""

from __future__ import annotations

import json
import logging
from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from agent.specialists.databot.state import DatabotState
from memory.profile_store import resolve_user_id, safe_profile_filename

logger = logging.getLogger(__name__)


def _sidecar_path(profile_dir: Path, user_id: str) -> Path:
    return profile_dir / f"{safe_profile_filename(user_id)}.databot_turns.jsonl"


def make_persist_turn_artifact_node(
    profile_dir: Path,
) -> Callable[[DatabotState], dict[str, Any]]:
    """Return a node function that writes the per-turn artifact.

    Skips on ``dryrun`` (preview-only). The user id comes from ``ProfileStore``
    resolution (checkpoint prior, then env, then the process user).
    """

    def persist_turn_artifact(state: DatabotState) -> dict[str, Any]:
        if state.get("dryrun"):
            return {}
        user_id = resolve_user_id(prior=state.get("user_id"))
        # Only persist if at least one approve happened.
        audit = state.get("gate_decisions") or []
        if not any(entry.get("decision") == "approve" for entry in audit):
            return {}

        record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "session": state.get("session_name", ""),
            "approved_cards": state.get("approved_cards") or [],
            "approved_sql": state.get("approved_sql") or "",
            "execution_result_preview": _execution_preview(state.get("execution_result") or {}),
            "metric_conflicts": state.get("metric_conflicts") or [],
            "gate_decisions": list(audit),
        }
        path = _sidecar_path(profile_dir, user_id)
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            with path.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(record, ensure_ascii=False) + "\n")
        except OSError as exc:
            logger.warning("failed to persist databot turn artifact: %s", exc)
        return {}

    return persist_turn_artifact


def _execution_preview(result: dict[str, Any]) -> dict[str, Any]:
    """Keep just the first 5 rows of an execution_result for the sidecar."""
    if not result:
        return {}
    rows = result.get("rows") or []
    if isinstance(rows, list) and len(rows) > 5:
        result = {**result, "rows": rows[:5], "_rows_truncated": True}
    return result
