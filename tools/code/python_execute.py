"""Run Python snippets with timeout protection (Janus PythonExecuteTool)."""

from __future__ import annotations

import shutil
import subprocess
from typing import Any

from langchain.tools import tool

from tools.common import bind_tool_to_agent

DEFAULT_TIMEOUT_SECONDS = 30
MAX_TIMEOUT_SECONDS = 120


def _resolve_python() -> str | None:
    return shutil.which("python3") or shutil.which("python")


def _normalize_timeout(timeout_seconds: int | None) -> int:
    if timeout_seconds is None or timeout_seconds <= 0:
        return DEFAULT_TIMEOUT_SECONDS
    return min(int(timeout_seconds), MAX_TIMEOUT_SECONDS)


def run_python(code: str, timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS) -> dict[str, Any]:
    """Execute ``code`` in a subprocess. Only stdout/stderr from print are captured."""
    python = _resolve_python()
    if python is None:
        return {
            "observation": "Python interpreter not found (tried python3, python)",
            "success": False,
        }
    limit = _normalize_timeout(timeout_seconds)
    try:
        completed = subprocess.run(
            [python, "-c", code],
            capture_output=True,
            text=True,
            timeout=limit,
            check=False,
        )
    except subprocess.TimeoutExpired:
        return {
            "observation": f"Execution timeout after {limit} seconds",
            "success": False,
        }
    except OSError as exc:
        return {"observation": str(exc), "success": False}

    output = (completed.stdout or "") + (completed.stderr or "")
    output = output.rstrip("\n")
    if completed.returncode != 0 and not output.strip():
        return {
            "observation": f"Process exited with code {completed.returncode}",
            "success": False,
        }
    return {"observation": output, "success": completed.returncode == 0}


@bind_tool_to_agent("tahoe,react")
@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("knowledge,default")
@tool
def python_execute(code: str, timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS) -> dict[str, Any]:
    """Executes Python code string. Note: Only print outputs are visible, function return values
    are not captured. Use print statements to see results.
    """
    return run_python(code, timeout_seconds)


TOOLS = [python_execute]
