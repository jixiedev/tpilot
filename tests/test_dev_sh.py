"""Shell-level checks for ``scripts/dev.sh`` stop/status/start.

The script is copied into a temp ROOT and run with shimmed ``curl``, ``pkill``,
``npm`` and ``.venv/bin/langgraph`` so nothing real is started, probed, or
killed outside the processes these tests spawn.
"""

from __future__ import annotations

import os
import shutil
import signal
import subprocess
import sys
import threading
import time
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[1]
DEV_SH = REPO / "scripts" / "dev.sh"

pytestmark = pytest.mark.skipif(
    sys.platform == "win32" or shutil.which("bash") is None,
    reason="dev.sh needs bash and POSIX process tools",
)


def _write_exe(path: Path, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("#!/bin/sh\n" + body, encoding="utf-8")
    path.chmod(0o755)


@pytest.fixture
def sandbox(tmp_path: Path) -> dict:
    root = tmp_path / "root"
    (root / "scripts").mkdir(parents=True)
    (root / "frontend").mkdir()
    shutil.copy2(DEV_SH, root / "scripts" / "dev.sh")
    shims = tmp_path / "shims"
    pkill_log = tmp_path / "pkill.log"
    # Record pkill calls instead of killing anything machine-wide.
    _write_exe(shims / "pkill", f'echo "$*" >> "{pkill_log}"\nexit 0\n')
    # curl: /agui answers 404 (route not mounted); everything else 200.
    _write_exe(
        shims / "curl",
        'for a in "$@"; do last="$a"; done\n'
        'case "$last" in */agui) printf 404 ;; *) printf 200 ;; esac\n',
    )
    _write_exe(shims / "npm", "sleep 60 &\nwait\n")
    _write_exe(root / ".venv" / "bin" / "langgraph", "sleep 60 &\nwait\n")
    env = dict(os.environ)
    env["PATH"] = f"{shims}{os.pathsep}{env.get('PATH', '')}"
    return {"root": root, "env": env, "pkill_log": pkill_log}


def _run(sandbox: dict, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["bash", str(sandbox["root"] / "scripts" / "dev.sh"), *args],
        env=sandbox["env"],
        capture_output=True,
        text=True,
        timeout=60,
    )


def _children(pid: int) -> list[int]:
    out = subprocess.run(["pgrep", "-P", str(pid)], capture_output=True, text=True).stdout
    return [int(x) for x in out.split()]


def _alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    # A zombie still answers kill -0; treat it as dead.
    state = subprocess.run(
        ["ps", "-o", "stat=", "-p", str(pid)], capture_output=True, text=True
    ).stdout.strip()
    return bool(state) and not state.startswith("Z")


def _wait_dead(pids: list[int], timeout: float = 5.0) -> list[int]:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        alive = [pid for pid in pids if _alive(pid)]
        if not alive:
            return []
        time.sleep(0.05)
    return [pid for pid in pids if _alive(pid)]


def _spawn(*, own_group: bool) -> tuple[subprocess.Popen, list[int]]:
    proc = subprocess.Popen(["sh", "-c", "sleep 60 & wait"], start_new_session=own_group)
    # Reap it as soon as it exits so it does not linger as a zombie.
    threading.Thread(target=proc.wait, daemon=True).start()
    deadline = time.monotonic() + 5
    while not (kids := _children(proc.pid)) and time.monotonic() < deadline:
        time.sleep(0.02)
    assert kids, "sleep child did not start"
    return proc, kids


def _cleanup(*pids: int) -> None:
    for pid in pids:
        try:
            os.kill(pid, signal.SIGKILL)
        except ProcessLookupError:
            pass


def test_stop_kills_only_recorded_pids_and_their_children(sandbox: dict) -> None:
    run_dir = sandbox["root"] / ".run"
    run_dir.mkdir()
    grouped, grouped_kids = _spawn(own_group=True)
    # Shares pytest's process group: stop must not signal that group.
    ungrouped, ungrouped_kids = _spawn(own_group=False)
    bystander, bystander_kids = _spawn(own_group=True)
    (run_dir / "langgraph.pid").write_text(f"{grouped.pid}\n", encoding="utf-8")
    (run_dir / "next.pid").write_text(f"{ungrouped.pid}\n", encoding="utf-8")
    try:
        result = _run(sandbox, "stop")
        assert result.returncode == 0, result.stderr
        assert not sandbox["pkill_log"].exists(), sandbox["pkill_log"].read_text()
        assert _wait_dead([grouped.pid, *grouped_kids, ungrouped.pid, *ungrouped_kids]) == []
        assert _alive(bystander.pid) and all(_alive(pid) for pid in bystander_kids)
        assert not (run_dir / "langgraph.pid").exists()
        assert not (run_dir / "next.pid").exists()
        assert "stopped langgraph" in result.stdout
        assert "stopped next" in result.stdout
    finally:
        _cleanup(grouped.pid, ungrouped.pid, bystander.pid, *grouped_kids,
                 *ungrouped_kids, *bystander_kids)


def test_stop_removes_stale_and_garbage_pid_files(sandbox: dict) -> None:
    run_dir = sandbox["root"] / ".run"
    run_dir.mkdir()
    dead = subprocess.Popen(["true"])
    dead.wait()
    (run_dir / "langgraph.pid").write_text(f"{dead.pid}\n", encoding="utf-8")
    (run_dir / "next.pid").write_text("-1 1\n", encoding="utf-8")

    result = _run(sandbox, "stop")

    assert result.returncode == 0, result.stderr
    assert not (run_dir / "langgraph.pid").exists()
    assert not (run_dir / "next.pid").exists()
    assert not sandbox["pkill_log"].exists()


def test_start_then_stop_uses_own_process_groups(sandbox: dict) -> None:
    run_dir = sandbox["root"] / ".run"
    started = _run(sandbox, "start")
    assert started.returncode == 0, started.stderr
    pids = {
        name: int((run_dir / f"{name}.pid").read_text().strip())
        for name in ("langgraph", "next")
    }
    kids: list[int] = []
    try:
        for pid in pids.values():
            deadline = time.monotonic() + 5
            while not _children(pid) and time.monotonic() < deadline:
                time.sleep(0.02)
            kids.extend(_children(pid))
            assert os.getpgid(pid) == pid
        stopped = _run(sandbox, "stop")
        assert stopped.returncode == 0, stopped.stderr
        assert _wait_dead([*pids.values(), *kids]) == []
        assert not list(run_dir.glob("*.pid"))
    finally:
        _cleanup(*pids.values(), *kids)


def test_status_reports_agui_404_as_not_mounted(sandbox: dict) -> None:
    result = _run(sandbox, "status")
    assert result.returncode == 0, result.stderr
    agui = [line for line in result.stdout.splitlines() if line.startswith("AG-UI")]
    assert len(agui) == 1
    assert "not mounted" in agui[0]
    assert "HTTP 404" in agui[0]
    assert "ALIVE" not in agui[0]
    assert "ALIVE (HTTP 200)" in result.stdout  # :8000 / :3000 still probed
