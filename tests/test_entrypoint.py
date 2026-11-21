"""docker/entrypoint.sh: download RAG models only when they are missing.

A fake ``python`` on PATH logs each call and answers ``-m tahoepilot.rag check``
with a canned ``<state> <policy>`` line, so every branch runs without Docker.
"""

from __future__ import annotations

import os
import subprocess
from pathlib import Path

import pytest

ENTRYPOINT = Path(__file__).resolve().parents[1] / "docker" / "entrypoint.sh"

FAKE_PYTHON = """#!/bin/sh
echo "$*" >> "$CALLS"
case "$*" in
  "-m tahoepilot.rag check") echo "$CHECK_OUTPUT" ;;
  "-m tahoepilot.rag download") exit "${DOWNLOAD_STATUS:-0}" ;;
esac
exit 0
"""


def _run(tmp_path: Path, check_output: str, *, download_status: int = 0, command: str = "cli"):
    bin_dir = tmp_path / "bin"
    bin_dir.mkdir()
    python = bin_dir / "python"
    python.write_text(FAKE_PYTHON)
    python.chmod(0o755)
    calls = tmp_path / "calls.log"
    calls.touch()
    env = {
        **os.environ,
        "PATH": f"{bin_dir}:{os.environ['PATH']}",
        "CALLS": str(calls),
        "CHECK_OUTPUT": check_output,
        "DOWNLOAD_STATUS": str(download_status),
    }
    result = subprocess.run(["sh", str(ENTRYPOINT), command], env=env, capture_output=True, text=True)
    return result, calls.read_text().splitlines()


@pytest.mark.parametrize("state", ["ready download", "off off"])
def test_ready_or_off_skips_the_download(tmp_path: Path, state: str) -> None:
    result, calls = _run(tmp_path, state)
    assert result.returncode == 0, result.stderr
    assert calls == ["-m tahoepilot.rag check", "-m tahoepilot"]


def test_missing_models_are_downloaded_before_start(tmp_path: Path) -> None:
    result, calls = _run(tmp_path, "missing download")
    assert result.returncode == 0, result.stderr
    assert calls == ["-m tahoepilot.rag check", "-m tahoepilot.rag download", "-m tahoepilot"]


def test_failed_download_still_starts_with_download_policy(tmp_path: Path) -> None:
    result, calls = _run(tmp_path, "missing download", download_status=1)
    assert result.returncode == 0
    assert calls[-1] == "-m tahoepilot"
    assert "starting without knowledge search" in result.stderr


@pytest.mark.parametrize(
    ("check_output", "download_status"),
    [("missing require", 1), ("no-library require", 0)],
)
def test_require_policy_exits_when_models_are_unavailable(
    tmp_path: Path, check_output: str, download_status: int
) -> None:
    result, calls = _run(tmp_path, check_output, download_status=download_status)
    assert result.returncode == 1
    assert "-m tahoepilot" not in calls
    assert '"require"; exiting' in result.stderr


def test_missing_libraries_skip_the_download(tmp_path: Path) -> None:
    result, calls = _run(tmp_path, "no-library download")
    assert result.returncode == 0
    assert calls == ["-m tahoepilot.rag check", "-m tahoepilot"]
    assert "not installed" in result.stderr


def test_backend_runs_the_check_before_the_server(tmp_path: Path) -> None:
    result, calls = _run(tmp_path, "ready download", command="backend")
    assert result.returncode == 0, result.stderr
    assert calls == ["-m tahoepilot.rag check", "-m tahoepilot.server.app"]
