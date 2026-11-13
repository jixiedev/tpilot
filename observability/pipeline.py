"""EvalPipeline: load cases → run each on the requested models → score → aggregate a report."""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field

from observability.case import CaseLoader, EvalCase
from observability.runner import EvalRunner, EvalRunResult
from observability.scorer import EvalScore, EvalScorer

DEFAULT_MODEL = "MiniMax-M3"
DEFAULT_EVAL_SETS: dict[str, list[str]] = {
    "databot": ["functional"],
    "knowledge": ["functional", "harness"],
    "intent": ["functional", "harness"],
}


@dataclass
class ScoredRun:
    result: EvalRunResult
    score: EvalScore

    def render(self) -> str:
        status = "CANCELLED" if self.score.cancelled else f"{self.score.total:.2f}"
        lines = [
            f"[{status}] {self.result.case.id} model={self.result.model_name} "
            f"({self.score.summary()})"
        ]
        if not self.score.cancelled:
            for dimension in self.score.dimensions:
                lines.extend(dimension.render())
        lines.extend(self.result.timing.render())
        return "\n".join(lines)


@dataclass
class CaseReport:
    """One case scored on every model it ran on."""

    case: EvalCase
    runs: list[ScoredRun] = field(default_factory=list)

    @property
    def average(self) -> float:
        return sum(run.score.total for run in self.runs) / len(self.runs)

    def render(self) -> str:
        n = len(self.runs)
        models = ", ".join(run.result.model_name for run in self.runs)
        lines = [run.render() for run in self.runs]
        lines.append(f"  case avg: {self.average:.3f} ({n} model{'s' if n != 1 else ''}: {models})")
        return "\n".join(lines)


@dataclass
class EvalReport:
    cases: list[CaseReport] = field(default_factory=list)

    @property
    def average(self) -> float:
        if not self.cases:
            return 0.0
        return sum(item.average for item in self.cases) / len(self.cases)

    def render(self) -> str:
        runs = sum(len(item.runs) for item in self.cases)
        lines = [item.render() for item in self.cases]
        lines.append(
            f"Average score: {self.average:.3f} ({len(self.cases)} case(s), {runs} model run(s))"
        )
        return "\n".join(lines)


class EvalPipeline:
    """Wire ``CaseLoader`` → ``EvalRunner`` → ``EvalScorer`` into one ``EvalReport``."""

    def __init__(
        self,
        loader: CaseLoader | None = None,
        runner: EvalRunner | None = None,
        scorer: EvalScorer | None = None,
    ) -> None:
        self.loader = loader or CaseLoader()
        self.runner = runner or EvalRunner()
        self.scorer = scorer or EvalScorer()

    async def run(
        self,
        agents: Iterable[str],
        eval_sets: Iterable[str],
        models: list[str],
    ) -> EvalReport:
        """Run every selected case on every model in ``models``."""
        report = EvalReport()
        for case in self.loader.load(agents, eval_sets):
            report.cases.append(await self.run_case(case, models))
        return report

    async def run_case(self, case: EvalCase, models: list[str]) -> CaseReport:
        report = CaseReport(case=case)
        for model_name in models:
            result = await self.runner.run(case, model_name)
            report.runs.append(ScoredRun(result=result, score=self.scorer.score(result)))
        return report
