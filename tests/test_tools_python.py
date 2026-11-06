from __future__ import annotations

import pytest

from tools.code.python_execute import PythonExecuteError, python_execute, run_python


def test_python_execute_captures_print() -> None:
    result = python_execute.invoke({"code": "print(1 + 1)"})
    assert result["success"] is True
    assert result["observation"] == "2"


def test_python_execute_reports_nonzero_exit() -> None:
    result = run_python("import sys; sys.exit(2)")
    assert result["success"] is False
    assert "2" in result["observation"]


def test_python_execute_timeout() -> None:
    with pytest.raises(PythonExecuteError, match="timeout") as info:
        run_python("import time; time.sleep(5)", timeout_seconds=1)
    assert info.value.timed_out is True
