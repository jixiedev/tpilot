"""CLI: python -m evals --agent knowledge [--groups not_in_catalog ...]

Cases live in ``evals/cases/<agent>/<objective>.json``. ``--agent`` picks the
folder (and the agent under test); ``--groups`` picks batch files in it
(default: every batch of that agent).
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

import tahoepilot.settings.paths  # noqa: F401 — loads .env and the secrets file first
from langchain_core.language_models import BaseChatModel

DEFAULT_AGENT = "databot"


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run eval case batches against a TahoePilot agent")
    parser.add_argument("-a", "--agent", default=DEFAULT_AGENT,
                        help="agent under test = folder under the cases dir (default: databot)")
    parser.add_argument("-g", "--groups", nargs="+", default=None,
                        help="batch names = files in cases/<agent>/ without .json (default: all)")
    parser.add_argument("-m", "--models", nargs="+", default=None,
                        help="LLMs to run every case on, replacing the cases' own 'models' "
                             "(names from config/models.toml)")
    parser.add_argument("--user-id", default=None,
                        help="user_id of every eval turn (default: case_bot). With Trino "
                             "user_identity = \"impersonate\" the SQL runs as this user")
    parser.add_argument("--cases-dir", type=Path, default=None,
                        help="directory holding <agent>/<batch>.json files (default: evals/cases)")
    parser.add_argument("--variants", "--arms", dest="variants", nargs="+", default=None,
                        help="run only these variants of batches that define run.variants "
                             "(model_selection: rag catalog hybrid)")
    parser.add_argument("--run-context", action="append", default=[], metavar="KEY=VALUE",
                        help="extra run_context for every agent built (repeatable)")
    parser.add_argument("--rag-collection", default=None,
                        help="shortcut for --run-context rag_collection=NAME (model_selection)")
    parser.add_argument("--out", type=Path, default=None,
                        help="write every run and the per-variant summary to this JSON file")
    parser.add_argument("--fail-under", type=float, default=None,
                        help="exit with code 1 when the average score is below this threshold")
    parser.add_argument("--list-groups", action="store_true",
                        help="list <agent>/<batch> for every batch and exit")
    parser.add_argument("--list-cases", action="store_true",
                        help="list <agent>/<batch>/<case> for --agent (and --groups) and exit")
    parser.add_argument("--list-models", action="store_true",
                        help="list model names from config/models.toml and exit")
    return parser


def resolve_eval_model(model_name: str) -> BaseChatModel:
    from tahoepilot.models.llm import get_model_by_name

    try:
        return get_model_by_name(model_name)
    except KeyError as exc:
        raise ValueError(str(exc)) from exc


async def create_eval_agent(agent_name: str, model_name: str, *, run_context: dict | None = None):
    """Build the agent as production does, with an in-memory checkpointer and no compression."""
    from langgraph.checkpoint.memory import MemorySaver

    from tahoepilot.agent.catalog import AgentCatalog, AgentCatalogSettings
    from tahoepilot.agent.listener import AgentListener
    from tahoepilot.agent.runtime import TahoeRuntimeHelper
    from tahoepilot.memory import CompressionConfig

    model = resolve_eval_model(model_name)
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            agent_name,
            profile_store=TahoeRuntimeHelper.default_profile_store(),
            model=model,
            checkpointer=MemorySaver(),
            compression_config=CompressionConfig(enabled=False),
        )
    )
    return await catalog.create(agent_name, listener=AgentListener(), run_context=run_context or None)


def parse_run_context(pairs: list[str], rag_collection: str | None) -> dict[str, str]:
    context: dict[str, str] = {}
    for pair in pairs:
        key, sep, value = pair.partition("=")
        if not sep or not key.strip():
            raise ValueError(f"--run-context expects KEY=VALUE, got {pair!r}")
        context[key.strip()] = value
    if rag_collection:
        context["rag_collection"] = rag_collection
    return context


async def run_eval(
    *,
    agent_name: str,
    groups: list[str] | None,
    cases_dir: Path | None,
    variants: list[str] | None = None,
    run_context: dict | None = None,
    out: Path | None = None,
    models: list[str] | None = None,
    user_id: str | None = None,
) -> tuple[float, list]:
    from evals.case import load_cases
    from evals.report import (
        format_aggregate,
        format_case_matrix,
        format_run,
        format_variant_summary,
        run_to_json,
        write_results,
    )
    from evals.runner import EVAL_USER_ID, run_cases, suite_average

    cases = load_cases(agent_name, groups, cases_dir=cases_dir)

    async def agent_factory(model_name: str, context: dict):
        return await create_eval_agent(agent_name, model_name, run_context=context)

    partial = out.with_suffix(".partial.jsonl") if out is not None else None
    if partial is not None:
        partial.parent.mkdir(parents=True, exist_ok=True)
        partial.write_text("", encoding="utf-8")

    def on_result(run) -> None:
        print(format_run(run), flush=True)
        if partial is not None:
            # One line per finished run, so a crash or Ctrl-C keeps the work done.
            with partial.open("a", encoding="utf-8") as handle:
                handle.write(json.dumps(run_to_json(run), ensure_ascii=False) + "\n")

    aggregates = await run_cases(
        cases,
        agent_factory,
        variants=variants,
        run_context=run_context,
        on_result=on_result,
        models=models,
        user_id=user_id or EVAL_USER_ID,
    )
    for aggregate in aggregates:
        if len(aggregate.runs) > 1:
            print(format_aggregate(aggregate))
    if len({a.variant for a in aggregates}) > 1:
        print()
        if any(c.name == "selection" for a in aggregates for r in a.runs for c in r.checks):
            print(format_case_matrix(aggregates))
            print()
        print(format_variant_summary(aggregates))
    if out is not None:
        write_results(aggregates, out)
        print(f"Wrote {out}")
    average = suite_average(aggregates)
    runs = sum(len(a.runs) for a in aggregates)
    print(f"Average score: {average:.3f} ({len(aggregates)} case(s), {runs} run(s))")
    return average, aggregates


def main(argv: list[str] | None = None) -> int:
    from evals.case import list_agents, list_batches

    args = build_arg_parser().parse_args(argv)
    if args.list_groups:
        for agent in list_agents(cases_dir=args.cases_dir):
            for batch in list_batches(agent, cases_dir=args.cases_dir):
                print(f"{agent}/{batch}")
        return 0
    if args.list_cases:
        from evals.case import load_cases

        for case in load_cases(args.agent, args.groups, cases_dir=args.cases_dir):
            print(case.id)
        return 0
    if args.list_models:
        from tahoepilot.models.llm import _model_configs, default_model_name

        for name in sorted(_model_configs):
            print(f"{name}{' (default)' if name == default_model_name else ''}")
        return 0

    try:
        average, _ = asyncio.run(
            run_eval(
                agent_name=args.agent,
                groups=args.groups,
                cases_dir=args.cases_dir,
                variants=args.variants,
                run_context=parse_run_context(args.run_context, args.rag_collection),
                out=args.out,
                models=args.models,
                user_id=args.user_id,
            )
        )
    except (FileNotFoundError, ValueError, TypeError) as exc:
        print(str(exc), file=sys.stderr)
        return 2

    if args.fail_under is not None and average < args.fail_under:
        print(f"Average {average:.3f} is below --fail-under {args.fail_under:.3f}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
