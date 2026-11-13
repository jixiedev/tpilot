"""CLI: python -m observability --agent databot --eval-set functional"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from observability.case import CASES_DIR, CaseLoader  # noqa: E402
from observability.pipeline import (  # noqa: E402
    DEFAULT_EVAL_SETS,
    DEFAULT_MODEL,
    EvalPipeline,
)
from observability.scorer import EvalScorer  # noqa: E402


class EvalCli:
    """``python -m observability``: list fixtures or run a suite and print the report."""

    def parser(self) -> argparse.ArgumentParser:
        parser = argparse.ArgumentParser(
            description="Run eval case suites against a TahoePilot agent",
        )
        parser.add_argument(
            "-a",
            "--agent",
            default="databot",
            choices=list(CaseLoader.CASE_TYPES),
            help="agent to evaluate (default: databot)",
        )
        parser.add_argument(
            "-g",
            "--eval-set",
            dest="eval_sets",
            nargs="+",
            choices=list(EvalScorer.DIMENSIONS),
            default=None,
            help="eval-set slices under cases/<eval_set>/ (default: agent-specific)",
        )
        parser.add_argument(
            "--cases-dir",
            type=Path,
            default=CASES_DIR,
            help="directory containing eval-set folders (default: observability/cases)",
        )
        parser.add_argument(
            "-m",
            "--model",
            dest="models",
            nargs="+",
            default=[DEFAULT_MODEL],
            help=(
                "one or more model names from models/models.toml; every case runs on each "
                f"(default: {DEFAULT_MODEL})"
            ),
        )
        parser.add_argument(
            "--fail-under",
            type=float,
            default=None,
            help="exit with code 1 when average score is below this threshold",
        )
        parser.add_argument(
            "--list-eval-sets",
            action="store_true",
            help="list available eval-set directories and exit",
        )
        parser.add_argument(
            "--list-cases",
            action="store_true",
            help="list cases for --agent / --eval-set and exit",
        )
        parser.add_argument(
            "--list-models",
            action="store_true",
            help="list model names from models/models.toml and exit",
        )
        return parser

    def main(self, argv: list[str] | None = None) -> int:
        args = self.parser().parse_args(argv)
        loader = CaseLoader(args.cases_dir)
        if args.list_eval_sets:
            print("\n".join(loader.eval_sets()))
            return 0
        if args.list_models:
            from models.models import _model_configs, default_model_name

            for name in sorted(_model_configs):
                print(f"{name}{' (default)' if name == default_model_name else ''}")
            return 0

        eval_sets = args.eval_sets or DEFAULT_EVAL_SETS[args.agent]
        if args.list_cases:
            cases = loader.load([args.agent], eval_sets)
            print("\n".join(sorted(case.id for case in cases)))
            return 0

        report = asyncio.run(EvalPipeline(loader).run([args.agent], eval_sets, args.models))
        print(report.render())
        if args.fail_under is not None and report.average < args.fail_under:
            print(
                f"Average {report.average:.3f} is below --fail-under {args.fail_under:.3f}",
                file=sys.stderr,
            )
            return 1
        return 0


if __name__ == "__main__":
    raise SystemExit(EvalCli().main())
