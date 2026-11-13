"""EvalTimer: per-call model / tool timing for one eval turn.

The timer is a LangChain callback handler bound through a configure hook, so every
model and tool run started while it is active — in any agent, subgraph, or parallel
tool batch — reports to it without changes to the agent graphs.
"""

from __future__ import annotations

import time
from collections.abc import Iterator
from contextlib import contextmanager
from contextvars import ContextVar
from dataclasses import dataclass, field
from typing import Any, ClassVar, Literal
from uuid import UUID

from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.tracers.context import register_configure_hook

CallKind = Literal["model", "tool"]


@dataclass
class TimedCall:
    kind: CallKind
    name: str
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

    def by_stage(self) -> dict[str, dict[CallKind, float]]:
        """Model / tool seconds per top-level graph node, in first-seen order."""
        stages: dict[str, dict[CallKind, float]] = {}
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
            f"  timing: wall={self.wall_seconds:.1f}s "
            f"model={self.seconds('model'):.1f}s/{self.count('model')} calls "
            f"tools={self.seconds('tool'):.1f}s/{self.count('tool')} calls"
        ]
        if len(self.by_stage()) > 1:
            stages = " | ".join(
                f"{stage or '(outside graph)'} model={totals['model']:.1f}s tools={totals['tool']:.1f}s"
                for stage, totals in self.by_stage().items()
            )
            lines.append(f"    by stage: {stages}")
        if self.count("tool"):
            tools = ", ".join(
                f"{name} {len(durations)}x {sum(durations):.1f}s (max {max(durations):.1f}s)"
                for name, durations in self.by_tool().items()
            )
            lines.append(f"    by tool: {tools}")
        return lines


class EvalTimer(BaseCallbackHandler):
    """Times every chat-model and tool run started while ``active()`` is entered."""

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

    def stage_of(self, metadata: dict[str, Any] | None) -> str:
        """Top-level graph node that the run belongs to (``""`` outside a graph)."""
        namespace = (metadata or {}).get("langgraph_checkpoint_ns", "")
        return namespace.split(":", 1)[0]

    def start(self, run_id: UUID, kind: CallKind, name: str, metadata: dict[str, Any] | None) -> None:
        self._open[run_id] = (kind, name, self.stage_of(metadata), time.perf_counter())

    def finish(self, run_id: UUID) -> None:
        kind, name, stage, started = self._open.pop(run_id)
        self.calls.append(TimedCall(kind, name, stage, time.perf_counter() - started))

    # --- callback hooks -------------------------------------------------------

    def on_chat_model_start(
        self, serialized: dict[str, Any], messages: Any, *, run_id: UUID,
        metadata: dict[str, Any] | None = None, **kwargs: Any,
    ) -> None:
        self.start(run_id, "model", "model", metadata)

    def on_llm_end(self, response: Any, *, run_id: UUID, **kwargs: Any) -> None:
        self.finish(run_id)

    def on_llm_error(self, error: BaseException, *, run_id: UUID, **kwargs: Any) -> None:
        self.finish(run_id)

    def on_tool_start(
        self, serialized: dict[str, Any], input_str: str, *, run_id: UUID,
        metadata: dict[str, Any] | None = None, **kwargs: Any,
    ) -> None:
        self.start(run_id, "tool", serialized["name"], metadata)

    def on_tool_end(self, output: Any, *, run_id: UUID, **kwargs: Any) -> None:
        self.finish(run_id)

    def on_tool_error(self, error: BaseException, *, run_id: UUID, **kwargs: Any) -> None:
        self.finish(run_id)


register_configure_hook(EvalTimer.ACTIVE, inheritable=True)
