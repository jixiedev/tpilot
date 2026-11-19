"""Model-selection evals: compare retrieval setups on the same questions.

Each case is a data question plus the dbt models a reviewer would accept
(``expected_models``). The ``model_selection`` agent runs every case once per
retrieval arm (``rag``, ``catalog``, ``hybrid``; see
:attr:`config.agent_config.ModelSelectionAgentConfig.RETRIEVAL_ARMS`) and per
LLM, and answers with a JSON choice. Nothing runs SQL.

Three dimensions per run, each in ``[0, 1]``:

- ``selection``: the chosen model is one of ``expected_models``. A case with
  ``expected_models: []`` expects the agent to abstain (``"model": null``),
  because no model in the corpus answers it.
- ``recall``: an expected model was among the staged candidates at all, so a
  miss can be blamed on retrieval (recall 0) or on the choice (recall 1).
  ``None`` (not counted) for abstain cases.
- ``economy``: tool calls within ``max_tool_calls`` (soft penalty above).

The report prints every run, then one comparison table per arm.
"""

from __future__ import annotations

import json
import time
from collections.abc import Awaitable, Callable, Sequence
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any

from agent.specialists.model_selection.model_selection_agent import (
    parse_selection,
    staged_model_names,
)
from agent.turn import AgentTurnResult
from config.agent_config import ModelSelectionAgentConfig
from evals.case_base import AggregateAverageMixin, BaseCase, iter_raw_cases, load_base_fields
from evals.listeners import EvalReactListener

ARMS: tuple[str, ...] = tuple(ModelSelectionAgentConfig.RETRIEVAL_ARMS)
DEFAULT_MAX_TOOL_CALLS = 4

#: ``(llm_model_name, arm) -> agent``
SelectionAgentFactory = Callable[[str, str], Awaitable[Any]]


def normalize_model_name(name: Any) -> str:
    """``core_data.fct_dau`` / ``FCT_DAU`` -> ``fct_dau``; ``None`` -> ``""``."""
    if name is None:
        return ""
    return str(name).strip().rsplit(".", 1)[-1].lower()


@dataclass
class SelectionScore:
    selection: float
    recall: float | None
    economy: float
    details: dict[str, Any] = field(default_factory=dict)

    @property
    def total(self) -> float:
        parts = [self.selection, self.economy]
        if self.recall is not None:
            parts.append(self.recall)
        return sum(parts) / len(parts)


@dataclass
class SelectionResult:
    case: ModelSelectionCase
    arm: str
    model_name: str
    score: SelectionScore
    chosen: str
    candidates: list[str]
    tool_calls: list[str]
    seconds: float
    reply: str
    cancelled: bool = False
    #: Exception text when the run crashed; scored as a miss.
    error: str = ""


@dataclass
class SelectionAggregate(AggregateAverageMixin):
    """One case on one arm, averaged across its LLMs."""

    case: ModelSelectionCase
    arm: str
    model_results: list[SelectionResult] = field(default_factory=list)


class ModelSelectionCase(BaseCase):
    def __init__(
        self,
        name: str,
        case_group: str,
        query: str,
        models: list[str],
        expected_models: list[str],
        kind: str = "metric",
        max_tool_calls: int = DEFAULT_MAX_TOOL_CALLS,
        notes: str = "",
    ) -> None:
        super().__init__(name, case_group, query, models)
        self.expected_models = [normalize_model_name(m) for m in expected_models]
        self.kind = kind
        self.max_tool_calls = max(1, int(max_tool_calls))
        self.notes = notes

    async def run(self, agent: Any, *, model_name: str = "", arm: str = "") -> SelectionResult:
        listener = EvalReactListener()
        agent.clear_secondaries()
        agent.register_secondary(listener)
        started = time.monotonic()
        try:
            result: AgentTurnResult = await agent.run(
                self.query,
                session=self._session_id(f"select-{arm}"),
                user_id="case_bot",
                print_output=False,
            )
        finally:
            agent.clear_secondaries()
        return self.score(
            result,
            listener,
            arm=arm,
            model_name=model_name,
            seconds=time.monotonic() - started,
        )

    def score(
        self,
        result: AgentTurnResult,
        listener: EvalReactListener,
        *,
        arm: str,
        model_name: str,
        seconds: float = 0.0,
    ) -> SelectionResult:
        reply = AgentTurnResult.extract_output(result.state)
        selection = parse_selection(reply)
        chosen = normalize_model_name(selection.get("model"))
        candidates = [normalize_model_name(n) for n in staged_model_names(result.state or {})]
        tools = listener.tool_names()
        expected = set(self.expected_models)

        if expected:
            selection_score = 1.0 if chosen and chosen in expected else 0.0
            recall_score: float | None = 1.0 if expected & set(candidates) else 0.0
        else:
            # Abstain case: right only when the agent answered and chose nothing.
            selection_score = 1.0 if selection and not chosen else 0.0
            recall_score = None
        over = len(tools) - self.max_tool_calls
        economy_score = 1.0 if over <= 0 else max(0.0, 1.0 - over / self.max_tool_calls)
        score = SelectionScore(
            selection=selection_score,
            recall=recall_score,
            economy=economy_score,
            details={
                "expected": self.expected_models,
                "chosen": chosen,
                "parsed": bool(selection),
                "root_id": selection.get("root_id"),
                "member_id": selection.get("member_id"),
                "reason": selection.get("reason"),
            },
        )
        return SelectionResult(
            case=self,
            arm=arm,
            model_name=model_name,
            score=score,
            chosen=chosen,
            candidates=candidates,
            tool_calls=tools,
            seconds=seconds,
            reply=reply,
            cancelled=result.cancelled,
        )


def crashed_result(
    case: ModelSelectionCase, *, arm: str, model_name: str, exc: BaseException
) -> SelectionResult:
    """A run that raised: zero selection and economy, recall unknown."""
    return SelectionResult(
        case=case,
        arm=arm,
        model_name=model_name,
        score=SelectionScore(
            selection=0.0, recall=None, economy=0.0, details={"parsed": False, "error": True}
        ),
        chosen="",
        candidates=[],
        tool_calls=[],
        seconds=0.0,
        reply="",
        error=f"{type(exc).__name__}: {exc}"[:500],
    )


def find_selection_cases(
    groups: list[str], *, cases_dir: Path | None = None
) -> list[ModelSelectionCase]:
    cases: list[ModelSelectionCase] = []
    for raw, group, suite_name, default_models in iter_raw_cases(groups, cases_dir=cases_dir):
        base = load_base_fields(
            raw,
            group=group,
            suite_name=suite_name,
            default_models=default_models,
            extra_required=("expected_models",),
        )
        expected = raw["expected_models"]
        if isinstance(expected, str):
            expected = [expected]
        if not isinstance(expected, list):
            raise ValueError(
                f"case {base['name']!r} in {group}/{suite_name}: "
                "'expected_models' must be a list of dbt model names ([] = expect null)"
            )
        cases.append(
            ModelSelectionCase(
                **base,
                expected_models=[str(m) for m in expected],
                kind=str(raw.get("kind") or "metric"),
                max_tool_calls=int(raw.get("max_tool_calls") or DEFAULT_MAX_TOOL_CALLS),
                notes=str(raw.get("notes") or ""),
            )
        )
    return cases


def validate_arms(arms: Sequence[str]) -> list[str]:
    chosen = [arm.strip().lower() for arm in arms if arm.strip()]
    unknown = [arm for arm in chosen if arm not in ARMS]
    if unknown or not chosen:
        raise ValueError(f"unknown arm(s) {unknown or arms!r}; choose from: {', '.join(ARMS)}")
    return list(dict.fromkeys(chosen))


async def run_selection_cases(
    groups: list[str],
    agent_factory: SelectionAgentFactory,
    *,
    arms: Sequence[str] = ARMS,
    cases_dir: Path | None = None,
    on_result: Callable[[SelectionResult], None] | None = None,
) -> list[SelectionAggregate]:
    """Run every case on every arm and LLM; one agent per ``(llm, arm)``."""
    cases = find_selection_cases(groups, cases_dir=cases_dir)
    agents: dict[tuple[str, str], Any] = {}
    aggregates: list[SelectionAggregate] = []
    for arm in validate_arms(arms):
        for case in cases:
            aggregate = SelectionAggregate(case=case, arm=arm)
            for model_name in case.models:
                key = (model_name, arm)
                if key not in agents:
                    agents[key] = await agent_factory(model_name, arm)
                try:
                    result = await case.run(agents[key], model_name=model_name, arm=arm)
                except Exception as exc:  # noqa: BLE001 - one bad run must not end the eval
                    result = crashed_result(case, arm=arm, model_name=model_name, exc=exc)
                if on_result is not None:
                    on_result(result)
                aggregate.model_results.append(result)
            aggregates.append(aggregate)
    return aggregates


# --------------------------------------------------------------------------- #
# Reporting
# --------------------------------------------------------------------------- #


def format_selection_result(result: SelectionResult) -> str:
    case = result.case
    s = result.score
    status = "CANCELLED" if result.cancelled else f"{s.total:.2f}"
    recall = "-" if s.recall is None else f"{s.recall:.0f}"
    head = (
        f"[{status}] {result.arm:<7} {case.case_group}/{case.name} model={result.model_name} "
        f"(selection={s.selection:.0f} recall={recall} economy={s.economy:.2f})"
    )
    if result.cancelled:
        return head
    lines = [
        head,
        f"  chosen={result.chosen or '-'} expected={case.expected_models}",
        f"  candidates={result.candidates}",
        f"  tools({len(result.tool_calls)})={result.tool_calls} {result.seconds:.1f}s",
    ]
    if result.error:
        lines.append(f"  ERROR {result.error[:200]}")
    elif not s.details.get("parsed"):
        lines.append("  reply had no JSON choice")
    return "\n".join(lines)


def _mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def arm_summary(aggregates: list[SelectionAggregate]) -> list[dict[str, Any]]:
    """One row per arm: accuracy, recall, tool calls, latency, overall."""
    rows: list[dict[str, Any]] = []
    for arm in dict.fromkeys(a.arm for a in aggregates):
        results = [
            r for a in aggregates if a.arm == arm for r in a.model_results if not r.cancelled
        ]
        arm_aggs = [a for a in aggregates if a.arm == arm]
        rows.append(
            {
                "arm": arm,
                "runs": sum(len(a.model_results) for a in arm_aggs),
                "selection": _mean([r.score.selection for r in results]),
                "recall": _mean([r.score.recall for r in results if r.score.recall is not None]),
                "economy": _mean([r.score.economy for r in results]),
                "tool_calls": _mean([float(len(r.tool_calls)) for r in results]),
                "candidates": _mean([float(len(r.candidates)) for r in results]),
                "seconds": _mean([r.seconds for r in results]),
                "average": _mean([a.average for a in arm_aggs]),
            }
        )
    return rows


def format_arm_summary(aggregates: list[SelectionAggregate]) -> str:
    header = (
        f"{'arm':<8}{'runs':>5}{'selection':>11}{'recall':>8}{'economy':>9}"
        f"{'tools':>7}{'cands':>7}{'secs':>7}{'avg':>7}"
    )
    lines = [header, "-" * len(header)]
    for row in arm_summary(aggregates):
        lines.append(
            f"{row['arm']:<8}{row['runs']:>5}{row['selection']:>11.2f}{row['recall']:>8.2f}"
            f"{row['economy']:>9.2f}{row['tool_calls']:>7.1f}{row['candidates']:>7.1f}"
            f"{row['seconds']:>7.1f}{row['average']:>7.3f}"
        )
    return "\n".join(lines)


def format_case_matrix(aggregates: list[SelectionAggregate]) -> str:
    """Per case, the chosen model on each arm (first LLM), ``*`` when accepted."""
    arms = list(dict.fromkeys(a.arm for a in aggregates))
    by_case: dict[str, dict[str, SelectionAggregate]] = {}
    for agg in aggregates:
        by_case.setdefault(f"{agg.case.name} ({agg.case.kind})", {})[agg.arm] = agg
    width = max([len(k) for k in by_case] + [4]) + 2
    lines = [f"{'case':<{width}}" + "".join(f"{arm:<34}" for arm in arms)]
    for label, per_arm in by_case.items():
        cells = []
        for arm in arms:
            agg = per_arm.get(arm)
            result = agg.model_results[0] if agg and agg.model_results else None
            if result is None or result.cancelled:
                cells.append(f"{'-':<34}")
                continue
            mark = "*" if result.score.selection else " "
            cells.append(f"{mark}{(result.chosen or 'null')[:32]:<33}")
        lines.append(f"{label:<{width}}" + "".join(cells))
    return "\n".join(lines)


def result_to_json(r: SelectionResult) -> dict[str, Any]:
    return {
        "case": f"{r.case.case_group}/{r.case.name}",
        "kind": r.case.kind,
        "arm": r.arm,
        "model": r.model_name,
        "cancelled": r.cancelled,
        "error": r.error,
        "expected": r.case.expected_models,
        "chosen": r.chosen,
        "candidates": r.candidates,
        "tool_calls": r.tool_calls,
        "seconds": round(r.seconds, 2),
        "score": {**asdict(r.score), "total": r.score.total},
        "reply": r.reply,
    }


def results_to_json(aggregates: list[SelectionAggregate]) -> dict[str, Any]:
    runs = [result_to_json(r) for agg in aggregates for r in agg.model_results]
    return {"summary": arm_summary(aggregates), "runs": runs}


def write_results(aggregates: list[SelectionAggregate], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(results_to_json(aggregates), ensure_ascii=False, indent=2), encoding="utf-8"
    )
