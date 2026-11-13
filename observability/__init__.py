"""Observability eval loop.

``EvalTimer`` records model / tool time per run into ``EvalRunResult.timing``.

``CaseLoader`` → ``EvalCase`` → ``EvalRunner`` → ``EvalRunResult`` → ``EvalScorer`` →
``EvalScore``, orchestrated by ``EvalPipeline``.
"""

from observability.case import (
    CASES_DIR,
    CaseLoader,
    DatabotEvalCase,
    EvalCase,
    IntentEvalCase,
    ReactEvalCase,
    ToolPathEvalCase,
    ToolsSpec,
)
from observability.pipeline import (
    DEFAULT_EVAL_SETS,
    DEFAULT_MODEL,
    CaseReport,
    EvalPipeline,
    EvalReport,
    ScoredRun,
)
from observability.runner import EvalRunner, EvalRunResult, ToolCall, EvalToolTrace
from observability.scorer import DimensionScore, EvalScore, EvalScorer
from observability.timing import EvalTimer, TimedCall, TurnTiming

__all__ = [
    "CASES_DIR",
    "CaseLoader",
    "CaseReport",
    "DEFAULT_EVAL_SETS",
    "DEFAULT_MODEL",
    "DatabotEvalCase",
    "DimensionScore",
    "EvalCase",
    "EvalPipeline",
    "EvalReport",
    "EvalRunResult",
    "EvalRunner",
    "EvalScore",
    "EvalScorer",
    "EvalTimer",
    "IntentEvalCase",
    "ReactEvalCase",
    "ScoredRun",
    "TimedCall",
    "ToolCall",
    "ToolPathEvalCase",
    "EvalToolTrace",
    "ToolsSpec",
    "TurnTiming",
]
