"""Static checks that the web UI's Databot state shapes match the backend."""

from __future__ import annotations

import re
from pathlib import Path

from agent.specialists.databot.graph import VALID_PHASES
from agent.specialists.databot.ui_actions import DATABOT_STATE_KEYS

_COMPONENTS = Path(__file__).resolve().parents[1] / "frontend" / "app" / "components"


def _empty_state_block() -> str:
    text = (_COMPONENTS / "databotClientReset.ts").read_text(encoding="utf-8")
    match = re.search(r"EMPTY_DATABOT_STATE[^=]*=\s*\{(.*?)\n\};", text, re.S)
    assert match, "EMPTY_DATABOT_STATE literal not found"
    return match.group(1)


def test_client_reset_uses_valid_phase() -> None:
    match = re.search(r'\bstage:\s*"([^"]+)"', _empty_state_block())
    assert match
    assert match.group(1) in VALID_PHASES


def test_client_reset_clears_every_ui_state_key() -> None:
    block = _empty_state_block()
    keys = set(re.findall(r"^\s*([a-z_]+):", block, re.M))
    # execution_result is cleared to undefined separately in resetDatabotAgentView.
    expected = set(DATABOT_STATE_KEYS) - {"execution_result"}
    assert expected <= keys, sorted(expected - keys)


def test_frontend_state_type_declares_every_ui_state_key() -> None:
    text = (_COMPONENTS / "types.ts").read_text(encoding="utf-8")
    match = re.search(r"interface DatabotAgentState \{(.*?)\n\}", text, re.S)
    assert match
    declared = set(re.findall(r"^\s*([a-z_]+)\?:", match.group(1), re.M))
    assert set(DATABOT_STATE_KEYS) <= declared, sorted(set(DATABOT_STATE_KEYS) - declared)


def test_frontend_comments_point_at_current_backend_package() -> None:
    for path in _COMPONENTS.glob("*.ts*"):
        assert "agent/react/databot" not in path.read_text(encoding="utf-8"), path.name
