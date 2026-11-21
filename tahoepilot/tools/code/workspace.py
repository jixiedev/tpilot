"""The code tools' workspace: where they run, which paths they accept, what env they see.

``bash``, ``python_execute`` and ``str_replace_editor`` all work in
``[paths].workspace_dir`` of ``runtime.toml`` (default ``<data_dir>/workspace``):

- the shell and Python subprocesses start there;
- the editor resolves relative paths against it and refuses anything outside it
  (after following symlinks);
- subprocesses get a minimal environment, so API keys, passwords and tokens
  loaded from the secrets file never reach a command the model writes.

This is a guard rail, not a sandbox: a shell command can still ``cd`` elsewhere.
Real isolation needs a separate container/user (see tahoepilot/tools/README.md).
"""

from __future__ import annotations

import os
from pathlib import Path

from tahoepilot.settings.runtime_config import get_runtime_paths

#: Variables passed through to code-tool subprocesses; everything else is dropped.
_PASSTHROUGH_ENV = ("PATH", "LANG", "LC_ALL", "LC_CTYPE", "TERM", "TZ")


class WorkspacePathError(ValueError):
    """A path outside the workspace was requested."""


def workspace_dir() -> Path:
    """The workspace folder, created on first use."""
    path = get_runtime_paths().workspace_dir
    path.mkdir(parents=True, exist_ok=True)
    return path


def subprocess_env() -> dict[str, str]:
    """Minimal environment for code-tool subprocesses (no secrets)."""
    ws = str(workspace_dir())
    env = {key: os.environ[key] for key in _PASSTHROUGH_ENV if key in os.environ}
    env.setdefault("PATH", "/usr/local/bin:/usr/bin:/bin")
    env["HOME"] = ws
    env["TMPDIR"] = ws
    env["PYTHONUNBUFFERED"] = "1"
    return env


def resolve_in_workspace(raw: str | Path) -> Path:
    """``raw`` as an absolute path inside the workspace, else ``WorkspacePathError``.

    Relative paths resolve against the workspace. Symlinks are followed before
    the check, so a link pointing outside is refused too.
    """
    root = workspace_dir().resolve()
    candidate = Path(raw).expanduser()
    if not candidate.is_absolute():
        candidate = root / candidate
    resolved = candidate.resolve()
    if resolved != root and root not in resolved.parents:
        raise WorkspacePathError(
            f"{raw} is outside the workspace {root}; code tools can only use files in it"
        )
    return resolved
