"""Report eval runs: CLI lines, a per-variant summary, and the ``--out`` JSON."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from evals.runner import CaseAggregate, CaseRun


def format_run(run: CaseRun) -> str:
    case = run.case
    variant = f" variant={run.variant}" if run.variant else ""
    head = f"{case.id} model={run.model_name}{variant}"
    if run.record.cancelled:
        return f"[CANCELLED] {head}"
    if run.record.error:
        return f"[ERROR] {head}\n  {run.record.error[:300]}"
    dims = " ".join(f"{c.name}={c.score:.2f}" for c in run.checks if c.score is not None)
    lines = [f"[{run.total:.2f}] {head} ({dims})"]
    lines.extend(f"  {c.line}" for c in run.checks if c.line)
    if run.record.timing.calls:
        lines.extend(f"  {line}" for line in run.record.timing.render())
    return "\n".join(lines)


def format_aggregate(aggregate: CaseAggregate) -> str:
    n = len(aggregate.runs)
    models = ", ".join(r.model_name for r in aggregate.runs)
    return f"  case avg: {aggregate.average:.3f} ({n} model{'s' if n != 1 else ''}: {models})"


def _mean(values: list[float]) -> float | None:
    return sum(values) / len(values) if values else None


def variant_summary(aggregates: list[CaseAggregate]) -> list[dict[str, Any]]:
    """One row per variant: runs, mean of every check, tool calls, seconds, average."""
    rows = []
    for variant in dict.fromkeys(a.variant for a in aggregates):
        aggs = [a for a in aggregates if a.variant == variant]
        runs = [r for a in aggs for r in a.runs if not r.cancelled and not r.record.error]
        names = list(dict.fromkeys(c.name for r in runs for c in r.checks))
        rows.append(
            {
                "variant": variant,
                "runs": sum(len(a.runs) for a in aggs),
                "errors": sum(1 for a in aggs for r in a.runs if r.record.error),
                "checks": {n: _mean([r.scores[n] for r in runs if n in r.scores]) for n in names},
                "tool_calls": _mean([float(len(r.record.tool_names)) for r in runs]),
                "seconds": _mean([r.record.seconds for r in runs]),
                "model_seconds": _mean([r.record.timing.seconds("model") for r in runs]),
                "tool_seconds": _mean([r.record.timing.seconds("tool") for r in runs]),
                "average": _mean([a.average for a in aggs]) or 0.0,
            }
        )
    return rows


def format_variant_summary(aggregates: list[CaseAggregate]) -> str:
    rows = variant_summary(aggregates)
    names = list(dict.fromkeys(n for row in rows for n in row["checks"]))
    header = f"{'variant':<10}{'runs':>5}" + "".join(f"{n:>12}" for n in names) + f"{'tools':>7}{'secs':>7}{'avg':>7}"
    lines = [header, "-" * len(header)]
    for row in rows:
        cells = "".join(
            f"{'-':>12}" if row["checks"].get(n) is None else f"{row['checks'][n]:>12.2f}" for n in names
        )
        lines.append(
            f"{row['variant'] or '-':<10}{row['runs']:>5}{cells}"
            f"{row['tool_calls'] or 0:>7.1f}{row['seconds'] or 0:>7.1f}{row['average']:>7.3f}"
        )
    return "\n".join(lines)


def format_case_matrix(aggregates: list[CaseAggregate]) -> str:
    """Per case, the chosen model on each variant (first LLM), ``*`` when accepted."""
    variants = list(dict.fromkeys(a.variant for a in aggregates))
    by_case: dict[str, dict[str, CaseAggregate]] = {}
    for agg in aggregates:
        label = f"{agg.case.name} ({agg.case.kind})" if agg.case.kind else agg.case.name
        by_case.setdefault(label, {})[agg.variant] = agg
    width = max([len(k) for k in by_case] + [4]) + 2
    lines = [f"{'case':<{width}}" + "".join(f"{v:<34}" for v in variants)]
    for label, per_variant in by_case.items():
        cells = []
        for variant in variants:
            agg = per_variant.get(variant)
            run = agg.runs[0] if agg and agg.runs else None
            check = next((c for c in run.checks if c.name == "selection"), None) if run else None
            if check is None:
                cells.append(f"{'-':<34}")
                continue
            chosen = check.details.get("chosen") or "null"
            cells.append(f"{'*' if check.score else ' '}{chosen[:32]:<33}")
        lines.append(f"{label:<{width}}" + "".join(cells))
    return "\n".join(lines)


def run_to_json(run: CaseRun) -> dict[str, Any]:
    """One run; keys stay readable by ``evals/selection_report.py`` (``arm`` = variant)."""
    details: dict[str, Any] = {c.name: c.details for c in run.checks}
    selection = details.get("selection") or {}
    score: dict[str, Any] = {c.name: c.score for c in run.checks}
    score["total"] = run.total
    score["details"] = {**details, "parsed": selection.get("parsed"), "chosen": selection.get("chosen")}
    return {
        "case": run.case.id,
        "agent": run.case.agent,
        "batch": run.case.batch,
        "kind": run.case.kind,
        "arm": run.variant,
        "model": run.model_name,
        "cancelled": run.record.cancelled,
        "error": run.record.error,
        "expected": selection.get("expected", []),
        "chosen": selection.get("chosen", ""),
        "candidates": run.record.candidates if "recall" in details else [],
        "tool_calls": run.record.tool_names,
        "rounds": run.record.rounds,
        "seconds": round(run.record.seconds, 2),
        "timing": run.record.timing.to_json(),
        "score": score,
        "reply": run.record.reply,
    }


def results_to_json(aggregates: list[CaseAggregate]) -> dict[str, Any]:
    return {
        "summary": variant_summary(aggregates),
        "runs": [run_to_json(r) for agg in aggregates for r in agg.runs],
    }


def write_results(aggregates: list[CaseAggregate], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(results_to_json(aggregates), ensure_ascii=False, indent=2), encoding="utf-8")
