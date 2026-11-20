"""Per-call model / tool timing for one eval turn (ported from the golden-query benchmark branch).

:class:`EvalTimer` is a LangChain callback handler bound through a configure
hook, so every chat-model and tool run started while it is active — in any
agent, nested specialist, stage layer or parallel tool batch — reports to it
without changes to the agent graphs. Timing is reported, not scored.
"""

from __future__ import annotations

import time
from collections.abc import Iterator
from contextlib import contextmanager
from contextvars import ContextVar
from dataclasses import asdict, dataclass, field
from typing import Any, ClassVar, Literal
from uuid import UUID

from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.tracers.context import register_configure_hook

CallKind = Literal["model", "tool"]


@dataclass
class TimedCall:
    kind: CallKind
    name: str
    #: Top-level graph node the call ran under (``""`` outside a graph).
    stage: str
    seconds: float


@dataclass
class TurnTiming:
    """Wall-clock time of one turn plus every model / tool call inside it."""

    wall_seconds: float = 0.0
    calls: list[TimedCall] = field(default_factory=list)

    def seconds(self, kind: CallKind) -> float:
        return sum(call.seconds for call in self.calls if call.kind == kind)

    def count(self, kind: CallKind) -> int:
        return sum(1 for call in self.calls if call.kind == kind)

    def by_stage(self) -> dict[str, dict[str, float]]:
        """Model / tool seconds per top-level graph node, in first-seen order."""
        stages: dict[str, dict[str, float]] = {}
        for call in self.calls:
            totals = stages.setdefault(call.stage, {"model": 0.0, "tool": 0.0})
            totals[call.kind] += call.seconds
        return stages

    def by_tool(self) -> dict[str, list[float]]:
        """Durations per tool name, slowest total first."""
        tools: dict[str, list[float]] = {}
        for call in self.calls:
            if call.kind == "tool":
                tools.setdefault(call.name, []).append(call.seconds)
        return dict(sorted(tools.items(), key=lambda item: -sum(item[1])))

    def render(self) -> list[str]:
        lines = [
            f"timing: wall={self.wall_seconds:.1f}s "
            f"model={self.seconds('model'):.1f}s/{self.count('model')} calls "
            f"tools={self.seconds('tool'):.1f}s/{self.count('tool')} calls"
        ]
        if len(self.by_stage()) > 1:
            lines.append("  by stage: " + " | ".join(
                f"{stage or '(outside graph)'} model={t['model']:.1f}s tools={t['tool']:.1f}s"
                for stage, t in self.by_stage().items()
            ))
        if self.count("tool"):
            lines.append("  by tool: " + ", ".join(
                f"{name} {len(d)}x {sum(d):.1f}s (max {max(d):.1f}s)" for name, d in self.by_tool().items()
            ))
        return lines

    def to_json(self) -> dict[str, Any]:
        return {
            "wall_seconds": round(self.wall_seconds, 2),
            "model_seconds": round(self.seconds("model"), 2),
            "model_calls": self.count("model"),
            "tool_seconds": round(self.seconds("tool"), 2),
            "tool_calls": self.count("tool"),
            "calls": [{**asdict(c), "seconds": round(c.seconds, 3)} for c in self.calls],
        }


class EvalTimer(BaseCallbackHandler):
    """Times every chat-model and tool run started while :meth:`active` is entered."""

    ACTIVE: ClassVar[ContextVar[EvalTimer | None]] = ContextVar("eval_timer", default=None)
    run_inline = True

    def __init__(self) -> None:
        self.calls: list[TimedCall] = []
        self._open: dict[UUID, tuple[CallKind, str, str, float]] = {}

    @contextmanager
    def active(self) -> Iterator[EvalTimer]:
        token = self.ACTIVE.set(self)
        try:
            yield self
        finally:
            self.ACTIVE.reset(token)

    @staticmethod
    def stage_of(metadata: dict[str, Any] | None) -> str:
        namespace = (metadata or {}).get("langgraph_checkpoint_ns", "")
        return namespace.split(":", 1)[0]

    def _start(self, run_id: UUID, kind: CallKind, name: str, metadata: dict[str, Any] | None) -> None:
        self._open[run_id] = (kind, name, self.stage_of(metadata), time.perf_counter())

    def _finish(self, run_id: UUID) -> None:
        opened = self._open.pop(run_id, None)
        if opened is not None:
            kind, name, stage, started = opened
            self.calls.append(TimedCall(kind, name, stage, time.perf_counter() - started))

    def on_chat_model_start(self, serialized: dict[str, Any], messages: Any, *, run_id: UUID,
                            metadata: dict[str, Any] | None = None, **kwargs: Any) -> None:
        self._start(run_id, "model", "model", metadata)

    def on_llm_end(self, response: Any, *, run_id: UUID, **kwargs: Any) -> None:
        self._finish(run_id)

    def on_llm_error(self, error: BaseException, *, run_id: UUID, **kwargs: Any) -> None:
        self._finish(run_id)

    def on_tool_start(self, serialized: dict[str, Any], input_str: str, *, run_id: UUID,
                      metadata: dict[str, Any] | None = None, **kwargs: Any) -> None:
        self._start(run_id, "tool", str((serialized or {}).get("name") or "tool"), metadata)

    def on_tool_end(self, output: Any, *, run_id: UUID, **kwargs: Any) -> None:
        self._finish(run_id)

    def on_tool_error(self, error: BaseException, *, run_id: UUID, **kwargs: Any) -> None:
        self._finish(run_id)


register_configure_hook(EvalTimer.ACTIVE, inheritable=True)
