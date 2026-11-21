"""Code tools run in the workspace folder and never see secrets."""

from __future__ import annotations

from pathlib import Path

import pytest

import importlib

bash_mod = importlib.import_module("tahoepilot.tools.code.bash")
from tahoepilot.tools.code.workspace import subprocess_env


@pytest.fixture
def workspace(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    for name in ("tahoepilot.tools.code.workspace", "tahoepilot.tools.code.bash", "tahoepilot.tools.code.python_execute"):
        monkeypatch.setattr(importlib.import_module(name), "workspace_dir", lambda: tmp_path)
    monkeypatch.setenv("TP_FAKE_SECRET", "s3cr3t")
    bash_mod.clear_sessions()
    yield tmp_path
    bash_mod.clear_sessions()


def test_subprocess_env_drops_secrets(workspace: Path) -> None:
    env = subprocess_env()
    assert "TP_FAKE_SECRET" not in env
    assert env["HOME"] == str(workspace)
    assert "PATH" in env


def test_bash_starts_in_workspace_without_secrets(workspace: Path) -> None:
    assert bash_mod.bash.invoke({"command": "pwd -P"}) == str(workspace.resolve())
    assert bash_mod.bash.invoke({"command": 'echo "[${TP_FAKE_SECRET:-}]"'}) == "[]"


def test_python_execute_runs_in_workspace_without_secrets(workspace: Path) -> None:
    out = importlib.import_module("tahoepilot.tools.code.python_execute").run_python("import os; print(os.path.realpath(os.getcwd())); print(os.environ.get('TP_FAKE_SECRET'))")
    assert out["observation"].splitlines() == [str(workspace.resolve()), "None"]


def test_default_workspace_is_under_data_dir() -> None:
    from tahoepilot.settings.runtime_config import get_runtime_paths

    paths = get_runtime_paths()
    assert paths.workspace_dir == paths.data_dir / "workspace"
