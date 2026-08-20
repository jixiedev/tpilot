from __future__ import annotations

import pytest

from tools.code.bash import bash, clear_sessions


@pytest.fixture(autouse=True)
def _reset_bash() -> None:
    clear_sessions()
    yield
    clear_sessions()


def test_bash_runs_command() -> None:
    result = bash.invoke({"command": "echo hello-from-bash"})
    assert "hello-from-bash" in result


def test_bash_persists_session_state() -> None:
    bash.invoke({"command": "export TP_BASH_MARK=1"})
    result = bash.invoke({"command": "echo $TP_BASH_MARK"})
    assert result.strip() == "1"


def test_bash_restart_resets_session() -> None:
    bash.invoke({"command": "export TP_BASH_MARK=1"})
    restarted = bash.invoke({"command": "true", "restart": True})
    assert restarted == "tool has been restarted."
    result = bash.invoke({"command": 'echo ${TP_BASH_MARK:-unset}'})
    assert result.strip() == "unset"
