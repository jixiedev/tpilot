"""Run Python snippets with timeout protection (Janus PythonExecuteTool)."""

from __future__ import annotations

import shutil
import subprocess
from typing import Any

from langchain.tools import tool

from tools.errors import ToolErrorType, register_exception
from tools.registry import register_tool

DEFAULT_TIMEOUT_SECONDS = 30
MAX_TIMEOUT_SECONDS = 120


class PythonExecuteError(RuntimeError):
    """The snippet could not run to completion (no interpreter, timeout, OS error).

    A snippet that runs and exits non-zero is not a tool failure: its output
    comes back as ``{"observation": ..., "success": False}``.
    """

    def __init__(self, message: str, *, timed_out: bool = False) -> None:
        super().__init__(message)
        self.timed_out = timed_out


def _classify_python_execute_error(
    exc: BaseException,
) -> tuple[ToolErrorType, bool, str] | None:
    # Never auto-retried: the same code would time out again, and the snippet
    # may have side effects.
    if getattr(exc, "timed_out", False):
        return ToolErrorType.TIMEOUT, False, str(exc)
    return ToolErrorType.UNKNOWN, False, str(exc)


register_exception(PythonExecuteError, classifier=_classify_python_execute_error)


def _resolve_python() -> str | None:
    return shutil.which("python3") or shutil.which("python")


def _normalize_timeout(timeout_seconds: int | None) -> int:
    if timeout_seconds is None or timeout_seconds <= 0:
        return DEFAULT_TIMEOUT_SECONDS
    return min(int(timeout_seconds), MAX_TIMEOUT_SECONDS)


def run_python(code: str, timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS) -> dict[str, Any]:
    """Execute ``code`` in a subprocess. Only stdout/stderr from print are captured.

    Raises ``PythonExecuteError`` when the code cannot run to completion
    (no interpreter, timeout, OS error) so the ReAct loop classifies it.
    """
    python = _resolve_python()
    if python is None:
        raise PythonExecuteError("Python interpreter not found (tried python3, python)")
    limit = _normalize_timeout(timeout_seconds)
    try:
        completed = subprocess.run(
            [python, "-c", code],
            capture_output=True,
            text=True,
            timeout=limit,
            check=False,
        )
    except subprocess.TimeoutExpired as exc:
        raise PythonExecuteError(
            f"Execution timeout after {limit} seconds", timed_out=True
        ) from exc
    except OSError as exc:
        raise PythonExecuteError(str(exc)) from exc

    output = (completed.stdout or "") + (completed.stderr or "")
    output = output.rstrip("\n")
    if completed.returncode != 0 and not output.strip():
        return {
            "observation": f"Process exited with code {completed.returncode}",
            "success": False,
        }
    return {"observation": output, "success": completed.returncode == 0}


@register_tool
@tool
def python_execute(code: str, timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS) -> dict[str, Any]:
    """Executes Python code string. Note: Only print outputs are visible, function return values
    are not captured. Use print statements to see results.
    """
    return run_python(code, timeout_seconds)


TOOLS = [python_execute]
