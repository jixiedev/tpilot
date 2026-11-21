"""Summarize model-selection eval results (the ``--out`` JSON of one or more runs).

    uv run python -m evals.selection_report [--rescore] RESULTS.json [MORE.json ...]

Prints Markdown: per-arm totals, selection by case kind, a paired comparison
of arms on the same cases (wins / losses / ties plus an exact sign test), and
every case where the arms disagree. Several files are merged first, so arms run
in separate processes can be reported together.

``--rescore`` re-scores every stored reply against the current case file
(``evals/cases/model_selection/*.json``) with the current answer parser, so a
gold-label correction or parser fix needs no new LLM runs.
"""

from __future__ import annotations

import json
import math
import sys
from collections import defaultdict
from collections.abc import Iterable
from pathlib import Path
from typing import Any


def load_runs(paths: Iterable[str | Path]) -> list[dict[str, Any]]:
    """Runs from ``--out`` JSON files or their ``.partial.jsonl`` siblings."""
    runs: list[dict[str, Any]] = []
    for path in paths:
        text = Path(path).read_text(encoding="utf-8")
        if str(path).endswith(".jsonl"):
            runs.extend(json.loads(line) for line in text.splitlines() if line.strip())
        else:
            runs.extend(json.loads(text)["runs"])
    return runs


def rescore_runs(
    runs: list[dict[str, Any]], *, cases_dir: Path | None = None
) -> list[dict[str, Any]]:
    """Recompute selection / recall from each stored reply and the current cases."""
    from tahoepilot.agent.specialists.model_selection import parse_selection
    from evals.case import load_cases
    from evals.checks import normalize_model_name

    agents = sorted({run["case"].split("/", 1)[0] for run in runs})
    cases = {case.id: case for agent in agents for case in load_cases(agent, cases_dir=cases_dir)}
    out: list[dict[str, Any]] = []
    for run in runs:
        case = cases.get(run["case"])
        if case is None or run.get("error") or run["cancelled"]:
            out.append(run)
            continue
        selection = parse_selection(run["reply"])
        chosen = normalize_model_name(selection.get("model"))
        expected_models = [normalize_model_name(m) for m in case.expect.get("expected_models") or []]
        expected = set(expected_models)
        if expected:
            sel = 1.0 if chosen and chosen in expected else 0.0
            recall = 1.0 if expected & set(run["candidates"]) else 0.0
        else:
            sel = 1.0 if selection and not chosen else 0.0
            recall = None
        score = dict(run["score"])
        score.update(selection=sel, recall=recall)
        score["details"] = {**score.get("details", {}), "parsed": bool(selection), "chosen": chosen}
        out.append({**run, "kind": case.kind, "expected": expected_models, "chosen": chosen, "score": score})
    return out


def _mean(values: list[float]) -> float | None:
    return sum(values) / len(values) if values else None


def _fmt(value: float | None, digits: int = 2) -> str:
    return "-" if value is None else f"{value:.{digits}f}"


def sign_test_p(wins: int, losses: int) -> float:
    """Two-sided exact binomial sign test on discordant pairs (ties dropped)."""
    n = wins + losses
    if n == 0:
        return 1.0
    k = min(wins, losses)
    tail = sum(math.comb(n, i) for i in range(k + 1)) / 2**n
    return min(1.0, 2 * tail)


def arm_rows(runs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_arm: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for run in runs:
        by_arm[run["arm"]].append(run)
    rows = []
    for arm, items in by_arm.items():
        ok = [r for r in items if not r["cancelled"]]
        rows.append(
            {
                "arm": arm,
                "runs": len(items),
                "selection": _mean([r["score"]["selection"] for r in ok]),
                "recall": _mean([r["score"]["recall"] for r in ok if r["score"]["recall"] is not None]),
                "economy": _mean([r["score"]["economy"] for r in ok]),
                "tools": _mean([float(len(r["tool_calls"])) for r in ok]),
                "candidates": _mean([float(len(r["candidates"])) for r in ok]),
                "seconds": _mean([float(r["seconds"]) for r in ok]),
                "no_json": sum(
                    1 for r in ok if r["score"]["details"].get("parsed") is False and not r.get("error")
                ),
                "errors": sum(1 for r in items if r.get("error")),
            }
        )
    return rows


def kind_table(runs: list[dict[str, Any]]) -> tuple[list[str], dict[str, dict[str, tuple[int, int]]]]:
    """``kind -> arm -> (correct, total)``."""
    arms = list(dict.fromkeys(r["arm"] for r in runs))
    table: dict[str, dict[str, list[int]]] = defaultdict(lambda: defaultdict(lambda: [0, 0]))
    for run in runs:
        cell = table[run["kind"]][run["arm"]]
        cell[0] += int(run["score"]["selection"] == 1.0)
        cell[1] += 1
    return arms, {k: {a: tuple(v) for a, v in d.items()} for k, d in table.items()}  # type: ignore[misc]


def paired(runs: list[dict[str, Any]], a: str, b: str) -> dict[str, Any]:
    """Per case (first run of each arm): does ``a`` beat ``b`` on selection?"""
    first: dict[tuple[str, str], float] = {}
    for run in runs:
        first.setdefault((run["arm"], run["case"]), run["score"]["selection"])
    cases = sorted({c for (arm, c) in first if arm == a} & {c for (arm, c) in first if arm == b})
    wins = sum(1 for c in cases if first[(a, c)] > first[(b, c)])
    losses = sum(1 for c in cases if first[(a, c)] < first[(b, c)])
    return {
        "a": a,
        "b": b,
        "cases": len(cases),
        "wins": wins,
        "losses": losses,
        "ties": len(cases) - wins - losses,
        "p": sign_test_p(wins, losses),
    }


def disagreements(runs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_case: dict[str, dict[str, dict[str, Any]]] = defaultdict(dict)
    for run in runs:
        by_case[run["case"]].setdefault(run["arm"], run)
    rows = []
    for case, per_arm in sorted(by_case.items()):
        if len({r["score"]["selection"] for r in per_arm.values()}) > 1:
            rows.append({"case": case, "per_arm": per_arm})
    return rows


def render(runs: list[dict[str, Any]]) -> str:
    out: list[str] = []
    out.append("| Arm | Runs | Selection | Recall | Economy | Tool calls | Candidates | Seconds | No JSON | Errors |")
    out.append("|-----|------|-----------|--------|---------|------------|------------|---------|---------|--------|")
    for row in arm_rows(runs):
        out.append(
            f"| {row['arm']} | {row['runs']} | {_fmt(row['selection'])} | {_fmt(row['recall'])} | "
            f"{_fmt(row['economy'])} | {_fmt(row['tools'], 1)} | {_fmt(row['candidates'], 1)} | "
            f"{_fmt(row['seconds'], 1)} | {row['no_json']} | {row['errors']} |"
        )

    arms, kinds = kind_table(runs)
    out.append("")
    out.append("| Kind | " + " | ".join(arms) + " |")
    out.append("|------|" + "|".join("---" for _ in arms) + "|")
    for kind, per_arm in kinds.items():
        cells = []
        for arm in arms:
            correct, total = per_arm.get(arm, (0, 0))
            cells.append(f"{correct}/{total}")
        out.append(f"| {kind} | " + " | ".join(cells) + " |")

    out.append("")
    out.append("| Comparison | Cases | Wins | Losses | Ties | Sign test p |")
    out.append("|------------|-------|------|--------|------|-------------|")
    for i, a in enumerate(arms):
        for b in arms[i + 1 :]:
            p = paired(runs, a, b)
            out.append(
                f"| {a} vs {b} | {p['cases']} | {p['wins']} | {p['losses']} | {p['ties']} | {p['p']:.3f} |"
            )

    rows = disagreements(runs)
    if rows:
        out.append("")
        out.append("| Case | " + " | ".join(arms) + " | Expected |")
        out.append("|------|" + "|".join("---" for _ in arms) + "|---|")
        for row in rows:
            cells = []
            expected = []
            for arm in arms:
                run = row["per_arm"].get(arm)
                if run is None:
                    cells.append("-")
                    continue
                expected = run["expected"]
                mark = "✓" if run["score"]["selection"] == 1.0 else "✗"
                cells.append(f"{mark} `{run['chosen'] or 'null'}`")
            name = row["case"].rsplit("/", 1)[-1]
            out.append(
                f"| {name} | " + " | ".join(cells) + f" | {', '.join(expected) or 'null'} |"
            )
    return "\n".join(out)


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    rescore = "--rescore" in args
    paths = [a for a in args if a != "--rescore"]
    if not paths:
        print(__doc__)
        return 2
    runs = load_runs(paths)
    if rescore:
        runs = rescore_runs(runs)
    print(render(runs))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
