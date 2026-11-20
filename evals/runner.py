"""Run eval cases: one code path for every agent.

For each case, variant and LLM the runner builds (and caches) the agent, runs
one turn with an :class:`~evals.listeners.EvalReactListener` attached, records
what happened in a :class:`RunRecord`, and scores it with the case's checks.

Batch run options (``EvalCase.run``):

- ``stub_specialists``: every specialist the agent delegates to is a
  :class:`RoutingStub`, which records the task and returns a short ``done``
  result, so a lead run scores its choice, not the specialists' work.
- ``variants``: run_context overrides; the case runs once per variant, each
  with its own agent (for example the retrieval arms of ``model_selection``).
"""

from __future__ import annotations

import json
import time
from collections.abc import Awaitable, Callable, Mapping, Sequence
from dataclasses import dataclass, field
from typing import Any

from langchain_core.messages import AIMessage

from agent.subagent import SubagentResult, SubagentTask
from agent.turn import AgentTurnResult
from evals.case import EvalCase
from graph.messages import strip_think_blocks
from evals.checks import CheckResult, run_checks
from evals.listeners import EvalReactListener
from evals.timing import EvalTimer, TurnTiming

#: Default ``user_id`` for eval turns (CLI ``--user-id`` overrides it).
EVAL_USER_ID = "case_bot"

#: ``(llm model name, run_context) -> agent``
AgentFactory = Callable[[str, dict[str, Any]], Awaitable[Any]]


class RoutingStub:
    """Stands in for a specialist: records the task and returns a canned result."""

    def __init__(self, name: str, calls: list[SubagentTask], scripted: Mapping[str, Any] | None = None) -> None:
        self.name = name
        self._calls = calls
        #: Optional ``{"status", "summary"}`` from the case's ``stub_results``.
        self._scripted = dict(scripted or {})

    async def run_as_subagent(self, task: SubagentTask) -> SubagentResult:
        self._calls.append(task)
        if self._scripted:
            return SubagentResult(
                agent=self.name,
                status=str(self._scripted.get("status") or "done"),  # type: ignore[arg-type]
                summary=str(self._scripted.get("summary") or ""),
            )
        return SubagentResult(
            agent=self.name,
            status="done",
            # Reads like a real, complete result so the lead moves on instead of
            # re-delegating; routing evals score the choice, not the content.
            summary=(
                f"Task complete. Result: 42 (source: eval_stub_{self.name}). "
                "Definition, tables and steps were checked; nothing is missing."
            ),
        )


def extract_lead_outcome(state: Mapping[str, Any] | None) -> dict[str, Any]:
    """Classify one turn by its first move.

    - ``plan``: the first tool batch calls ``write_plan``.
    - ``delegate``: the first tool batch delegates without a plan (or any later delegation).
    - ``clarify``: no tools and the reply ends with a question mark.
    - ``answer``: no tools otherwise.

    ``routes`` lists every specialist delegated to this turn, in order.
    """
    messages = AgentTurnResult.current_turn_messages(state)
    first_batch = next((m.tool_calls for m in messages if isinstance(m, AIMessage) and m.tool_calls), [])
    first_tools = [call.get("name") for call in first_batch]
    routes = [
        str(call.get("args", {}).get("agent") or "").strip().lower()
        for m in messages
        if isinstance(m, AIMessage)
        for call in (m.tool_calls or [])
        if call.get("name") == "delegate"
    ]
    reply = AgentTurnResult.last_user_visible_reply(state) or ""
    if "write_plan" in first_tools:
        decision = "plan"
    elif "delegate" in first_tools or routes:
        decision = "delegate"
    elif reply.rstrip().endswith(("?", "？")):
        decision = "clarify"
    else:
        decision = "answer"
    return {"decision": decision, "routes": [r for r in routes if r], "reply": reply}


@dataclass
class RunRecord:
    """What one agent turn did, as the checks see it."""

    reply: str = ""
    state: dict[str, Any] = field(default_factory=dict)
    tool_names: list[str] = field(default_factory=list)
    rounds: int = 0
    seconds: float = 0.0
    cancelled: bool = False
    #: Exception text when the run crashed (scored as 0).
    error: str = ""
    #: Model / tool call timing (reported, not scored).
    timing: TurnTiming = field(default_factory=TurnTiming)

    @property
    def outcome(self) -> dict[str, Any]:
        return extract_lead_outcome(self.state)

    @property
    def selection(self) -> dict[str, Any]:
        from agent.specialists.model_selection.model_selection_agent import parse_selection

        return parse_selection(self.reply)

    @property
    def candidates(self) -> list[str]:
        from agent.specialists.model_selection.model_selection_agent import staged_model_names
        from evals.checks import normalize_model_name

        return [normalize_model_name(n) for n in staged_model_names(self.state or {})]


@dataclass
class CaseRun:
    """One case on one variant and one LLM, scored."""

    case: EvalCase
    model_name: str
    variant: str
    record: RunRecord
    checks: list[CheckResult]

    @property
    def cancelled(self) -> bool:
        return self.record.cancelled

    @property
    def scores(self) -> dict[str, float]:
        return {c.name: c.score for c in self.checks if c.score is not None}

    @property
    def total(self) -> float:
        if self.record.cancelled or self.record.error:
            return 0.0
        values = list(self.scores.values())
        return sum(values) / len(values) if values else 0.0


@dataclass
class CaseAggregate:
    """One case on one variant, averaged across its LLMs."""

    case: EvalCase
    variant: str
    runs: list[CaseRun] = field(default_factory=list)

    @property
    def average(self) -> float:
        return sum(r.total for r in self.runs) / len(self.runs) if self.runs else 0.0


async def run_turn(case: EvalCase, agent: Any, *, variant: str = "", user_id: str = EVAL_USER_ID) -> RunRecord:
    """Run the case's query as one turn and record it (tools, rounds, reply, state, timing)."""
    listener = EvalReactListener()
    has_listeners = hasattr(agent, "register_secondary")
    if has_listeners:
        agent.clear_secondaries()
        agent.register_secondary(listener)
    calls: list[SubagentTask] = []
    if case.run.stub_specialists:
        async def stub(name: str) -> RoutingStub:
            return RoutingStub(name, calls, case.stub_results.get(name))

        agent.specialists.get_or_create = stub
    run_kwargs: dict[str, Any] = {}
    if case.run.gate_reply is not None:
        reply = case.run.gate_reply

        async def answer_gate(question: str) -> str:
            return reply

        run_kwargs["on_interrupt"] = answer_gate
    timer = EvalTimer()
    started = time.monotonic()
    try:
        with timer.active():
            result: AgentTurnResult = await agent.run(
                case.query,
                session=case.session_id(variant),
                user_id=user_id,
                print_output=False,
                **run_kwargs,
            )
    finally:
        if has_listeners:
            agent.clear_secondaries()
    wall = time.monotonic() - started
    state = result.state if isinstance(result.state, dict) else {}
    return RunRecord(
        # The user-visible answer: a reasoning model's <think> block is not part of it.
        reply=strip_think_blocks(AgentTurnResult.extract_output(state)).strip(),
        state=state,
        tool_names=listener.tool_names(),
        rounds=listener.reason_round_count,
        seconds=wall,
        cancelled=result.cancelled,
        timing=TurnTiming(wall_seconds=wall, calls=list(timer.calls)),
    )


def score_run(case: EvalCase, record: RunRecord, *, model_name: str = "", variant: str = "") -> CaseRun:
    checks = [] if (record.error or record.cancelled) else run_checks(case, record)
    return CaseRun(case=case, model_name=model_name, variant=variant, record=record, checks=checks)


def select_variants(case: EvalCase, wanted: Sequence[str] | None) -> list[str]:
    names = list(case.run.variants)
    if not wanted:
        return names
    unknown = [v for v in wanted if v not in names]
    if unknown:
        raise ValueError(f"{case.id}: unknown variant(s) {unknown}; this batch has {names}")
    return [v for v in names if v in wanted]


async def run_cases(
    cases: list[EvalCase],
    agent_factory: AgentFactory,
    *,
    variants: Sequence[str] | None = None,
    run_context: Mapping[str, Any] | None = None,
    on_result: Callable[[CaseRun], None] | None = None,
    models: Sequence[str] | None = None,
    user_id: str = EVAL_USER_ID,
) -> list[CaseAggregate]:
    """Run every case on each of its variants and LLMs; one agent per ``(LLM, variant)``.

    A run that raises is recorded as an error (score 0) and the eval goes on.
    ``run_context`` is merged under each variant's overrides (CLI ``--run-context``).
    ``models`` replaces every case's LLM list (CLI ``--models``); ``user_id`` is
    the turn's user (Trino impersonation runs queries as this user).
    """
    agents: dict[tuple[str, str, bool], Any] = {}
    aggregates: list[CaseAggregate] = []
    for case in cases:
        for variant in select_variants(case, variants):
            context = {**dict(run_context or {}), **case.run.variants[variant]}
            aggregate = CaseAggregate(case=case, variant=variant)
            for model_name in (list(models) if models else case.models):
                # Reuse an agent only for the same LLM, run_context and stub mode
                # (stubbing replaces the agent's specialist lookup for good).
                key = (model_name, json.dumps(context, sort_keys=True, default=str), case.run.stub_specialists)
                try:
                    if key not in agents:
                        agents[key] = await agent_factory(model_name, context)
                    record = await run_turn(case, agents[key], variant=variant, user_id=user_id)
                except Exception as exc:  # noqa: BLE001 - one bad run must not end the eval
                    record = RunRecord(error=f"{type(exc).__name__}: {exc}"[:500])
                run = score_run(case, record, model_name=model_name, variant=variant)
                if on_result is not None:
                    on_result(run)
                aggregate.runs.append(run)
            aggregates.append(aggregate)
    return aggregates


def suite_average(aggregates: list[CaseAggregate]) -> float:
    return sum(a.average for a in aggregates) / len(aggregates) if aggregates else 0.0
