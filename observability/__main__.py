"""CLI: python -m observability --agent databot --eval-set functional"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from observability.runner import (  # noqa: E402
    DEFAULT_EVAL_SETS,
    DEFAULT_MODEL,
    EVAL_AGENTS,
    build_loader,
    list_cases,
    run_eval,
)


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run eval case suites against a TahoePilot agent",
    )
    parser.add_argument(
        "-a",
        "--agent",
        default="databot",
        choices=EVAL_AGENTS,
        help="agent to evaluate (default: databot)",
    )
    parser.add_argument(
        "-g",
        "--groups",
        "--eval-set",
        dest="eval_sets",
        nargs="+",
        default=None,
        help="eval-set slices under cases/<eval_set>/ (default: agent-specific)",
    )
    parser.add_argument(
        "--cases-dir",
        type=Path,
        default=None,
        help="directory containing eval-set folders (default: observability/cases)",
    )
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"model name from models/models.toml (default: {DEFAULT_MODEL})",
    )
    parser.add_argument(
        "--fail-under",
        type=float,
        default=None,
        help="exit with code 1 when average score is below this threshold",
    )
    parser.add_argument(
        "--list-groups",
        "--list-eval-sets",
        dest="list_eval_sets",
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


def main(argv: list[str] | None = None) -> int:
    args = build_arg_parser().parse_args(argv)
    if args.list_eval_sets:
        loader = build_loader(args.agent, cases_dir=args.cases_dir, model_name=args.model)
        for name in loader.list_eval_sets():
            print(name)
        return 0
    if args.list_models:
        from models.models import _model_configs, default_model_name

        for name in sorted(_model_configs):
            marker = " (default)" if name == default_model_name else ""
            print(f"{name}{marker}")
        return 0

    eval_sets = args.eval_sets or DEFAULT_EVAL_SETS[args.agent]
    if args.list_cases:
        try:
            for line in list_cases(
                agent_name=args.agent,
                eval_sets=eval_sets,
                cases_dir=args.cases_dir,
                model_name=args.model,
            ):
                print(line)
        except (FileNotFoundError, ValueError, TypeError) as exc:
            print(str(exc), file=sys.stderr)
            return 2
        return 0
    try:
        report = asyncio.run(
            run_eval(
                agent_name=args.agent,
                eval_sets=eval_sets,
                cases_dir=args.cases_dir,
                model_name=args.model,
            )
        )
    except (FileNotFoundError, ValueError, TypeError) as exc:
        print(str(exc), file=sys.stderr)
        return 2
    except Exception as exc:
        print(f"Eval failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2

    print(report.render())
    if args.fail_under is not None and report.average < args.fail_under:
        print(
            f"Average {report.average:.3f} is below --fail-under {args.fail_under:.3f}",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
