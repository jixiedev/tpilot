"""Evals: one case type, batch files per agent and objective, one runner (`python -m evals`).

- ``evals/case.py``: :class:`EvalCase` and loading ``cases/<agent>/<objective>.json``.
- ``evals/checks.py``: the scored dimensions; a case's expectation keys pick them.
- ``evals/runner.py``: runs a case (listener, optional specialist stubs and variants).
- ``evals/report.py``: CLI lines, per-variant summary, ``--out`` JSON.
"""

from evals.case import BatchRun, EvalCase, list_agents, list_batches, load_batch, load_cases
from evals.checks import CHECKS, CheckResult, run_checks, score_sequence
from evals.listeners import EvalReactListener, ToolCallRecord, ToolResultRecord
from evals.runner import (
    CaseAggregate,
    CaseRun,
    RoutingStub,
    RunRecord,
    extract_lead_outcome,
    run_cases,
    run_turn,
    score_run,
    suite_average,
)

__all__ = [
    "BatchRun",
    "CHECKS",
    "CaseAggregate",
    "CaseRun",
    "CheckResult",
    "EvalCase",
    "EvalReactListener",
    "RoutingStub",
    "RunRecord",
    "ToolCallRecord",
    "ToolResultRecord",
    "extract_lead_outcome",
    "list_agents",
    "list_batches",
    "load_batch",
    "load_cases",
    "run_cases",
    "run_checks",
    "run_turn",
    "score_run",
    "score_sequence",
    "suite_average",
]
