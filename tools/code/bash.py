"""Persistent bash session tool (Janus BashTool)."""

from __future__ import annotations

import os
import select
import threading
import time
from pathlib import Path

from langchain.tools import tool

from tools.common import bind_tool_to_agent

from tools.errors import ToolErrorType, register_exception

DESCRIPTION = """\
Execute a bash command in the terminal.
* Long running commands: For commands that may run indefinitely, it should be run in the background and the output should be redirected to a file, e.g. command = `python3 app.py > server.log 2>&1 &`.
* Interactive: If a bash command returns exit code `-1`, this means the process is not yet finished. The assistant must then send a second call to terminal with an empty `command` (which will retrieve any additional logs), or it can send additional text (set `command` to the text) to STDIN of the running process, or it can send command=`ctrl+c` to interrupt the process.
* Timeout: If a command execution result says "Command timed out. Sending SIGINT to the process", the assistant should retry running the command in the background.
"""

SENTINEL = "<<exit>>"
OUTPUT_DELAY_SECONDS = 0.2
TIMEOUT_SECONDS = 120.0
DEFAULT_SESSION_ID = "__default__"

_lock = threading.Lock()
_sessions: dict[str, "_BashSession"] = {}
_working_directory: Path | None = None


class BashSessionError(RuntimeError):
    def __init__(self, message: str, system: str | None = None) -> None:
        super().__init__(message)
        self.system = system


def _classify_bash_session_error(exc: BaseException) -> tuple[ToolErrorType, bool, str] | None:
    message = str(exc)
    if "timed out" in message.lower() or "timeout" in message.lower():
        return ToolErrorType.TIMEOUT, True, message
    return ToolErrorType.UNKNOWN, False, message


register_exception(BashSessionError, classifier=_classify_bash_session_error)


class _BashSession:
    def __init__(self, working_directory: Path | None) -> None:
        self.working_directory = working_directory
        self.process = None
        self._stdout = bytearray()
        self._stderr = bytearray()
        self.timed_out = False

    def start(self) -> None:
        import subprocess

        kwargs: dict = {
            "stdin": subprocess.PIPE,
            "stdout": subprocess.PIPE,
            "stderr": subprocess.PIPE,
        }
        if self.working_directory is not None and self.working_directory.is_dir():
            kwargs["cwd"] = str(self.working_directory)
        self.process = subprocess.Popen(["/bin/bash"], **kwargs)
        self._stdout.clear()
        self._stderr.clear()
        self.timed_out = False

    def is_alive(self) -> bool:
        return (
            self.process is not None
            and self.process.poll() is None
            and not self.timed_out
        )

    def stop(self) -> None:
        if self.process is None:
            return
        if self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=2)
            except Exception:
                self.process.kill()
                self.process.wait(timeout=1)
        self.process = None

    def run(self, command: str) -> tuple[str, str]:
        if not self.is_alive():
            if self.process is not None and self.process.poll() is not None:
                raise BashSessionError(
                    f"bash has exited with returncode {self.process.returncode}",
                    "tool must be restarted",
                )
            raise BashSessionError(
                f"timed out: bash has not returned in {int(TIMEOUT_SECONDS)} seconds "
                "and must be restarted"
            )
        assert self.process is not None and self.process.stdin is not None
        payload = f"{command}; echo '{SENTINEL}'\n"
        try:
            self.process.stdin.write(payload.encode("utf-8"))
            self.process.stdin.flush()
        except OSError as exc:
            raise BashSessionError(str(exc)) from exc

        deadline = time.monotonic() + TIMEOUT_SECONDS
        while time.monotonic() < deadline:
            time.sleep(OUTPUT_DELAY_SECONDS)
            self._drain()
            text = self._stdout.decode("utf-8", errors="replace")
            sentinel_index = text.find(SENTINEL)
            if sentinel_index >= 0:
                output = _strip_trailing_newline(text[:sentinel_index])
                error = _strip_trailing_newline(
                    self._stderr.decode("utf-8", errors="replace")
                )
                self._stdout.clear()
                self._stderr.clear()
                return output, error
        self.timed_out = True
        raise BashSessionError(
            f"timed out: bash has not returned in {int(TIMEOUT_SECONDS)} seconds "
            "and must be restarted"
        )

    def send_control_c(self) -> None:
        if self.process is None or self.process.stdin is None:
            return
        self.process.stdin.write(b"\x03")
        self.process.stdin.flush()
        time.sleep(OUTPUT_DELAY_SECONDS)
        self._drain()

    def drain_output(self) -> str:
        self._drain()
        text = _strip_trailing_newline(self._stdout.decode("utf-8", errors="replace"))
        self._stdout.clear()
        return text

    def drain_error(self) -> str:
        self._drain()
        text = _strip_trailing_newline(self._stderr.decode("utf-8", errors="replace"))
        self._stderr.clear()
        return text

    def _drain(self) -> None:
        if self.process is None:
            return
        self._read_available(self.process.stdout, self._stdout)
        self._read_available(self.process.stderr, self._stderr)

    @staticmethod
    def _read_available(stream, buffer: bytearray) -> None:
        if stream is None:
            return
        fd = stream.fileno()
        while True:
            ready, _, _ = select.select([fd], [], [], 0)
            if not ready:
                break
            chunk = os.read(fd, 4096)
            if not chunk:
                break
            buffer.extend(chunk)


def set_working_directory(path: str | Path | None) -> None:
    global _working_directory
    _working_directory = Path(path).resolve() if path else None


def clear_sessions() -> None:
    with _lock:
        for session in _sessions.values():
            session.stop()
        _sessions.clear()


def _session() -> _BashSession:
    holder = _sessions.get(DEFAULT_SESSION_ID)
    if holder is None or not holder.is_alive():
        holder = _BashSession(_working_directory)
        holder.start()
        _sessions[DEFAULT_SESSION_ID] = holder
    return holder


def _format_cli_result(output: str | None, error: str | None, system: str | None) -> str:
    if system:
        return system
    if error:
        return f"Error: {error}"
    return output or ""


def _strip_trailing_newline(text: str) -> str:
    if text.endswith("\n"):
        return text[:-1]
    return text


@bind_tool_to_agent("tahoe,react")
@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("knowledge,default")
@tool(description=DESCRIPTION)
def bash(command: str, restart: bool = False) -> str:
    """Execute a bash command in a persistent terminal session.

    ``command`` may be empty to drain extra logs, or ``ctrl+c`` to interrupt.
    ``restart=True`` starts a fresh session.
    """
    with _lock:
        if restart:
            existing = _sessions.pop(DEFAULT_SESSION_ID, None)
            if existing is not None:
                existing.stop()
            holder = _BashSession(_working_directory)
            holder.start()
            _sessions[DEFAULT_SESSION_ID] = holder
            return "tool has been restarted."
        if command is None:
            raise ValueError("no command provided.")
        holder = _session()
        if command == "ctrl+c":
            holder.send_control_c()
            return _format_cli_result(holder.drain_output(), holder.drain_error(), None)
        try:
            output, error = holder.run(command)
            return _format_cli_result(output, error, None)
        except BashSessionError as exc:
            return _format_cli_result(None, str(exc), exc.system)


TOOLS = [bash]
