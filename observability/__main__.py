"""CLI: python -m observability --agent tahoe --groups general"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

from dotenv import load_dotenv
from langchain_core.language_models import BaseChatModel

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

EVAL_AGENTS = ("tahoe", "databot", "knowledge", "intent")
DEFAULT_GROUPS: dict[str, list[str]] = {
    "tahoe": ["general", "tahoe"],
    "databot": ["databot"],
    "knowledge": ["knowledge"],
    "intent": ["intent"],
}


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run eval case suites against a TahoePilot agent",
    )
    parser.add_argument(
        "-a",
        "--agent",
        default="tahoe",
        choices=EVAL_AGENTS,
        help="agent to evaluate (default: tahoe)",
    )
    parser.add_argument(
        "-g",
        "--groups",
        nargs="+",
        default=None,
        help="case group keys matching cases/<group>.json (default: agent-specific)",
    )
    parser.add_argument(
        "--cases-dir",
        type=Path,
        default=None,
        help="directory containing case JSON files (default: observability/cases)",
    )
    parser.add_argument(
        "--fail-under",
        type=float,
        default=None,
        help="exit with code 1 when average score is below this threshold",
    )
    parser.add_argument(
        "--list-groups",
        action="store_true",
        help="list available case group keys and exit",
    )
    parser.add_argument(
        "--list-models",
        action="store_true",
        help="list model names from models/models.toml and exit",
    )
    return parser


def resolve_eval_model(model_name: str) -> BaseChatModel:
    from models.models import models

    if model_name not in models:
        known = ", ".join(sorted(models))
        raise ValueError(f"Unknown model {model_name!r}; known models: {known}")
    return models[model_name]


async def create_eval_agent(agent_name: str, model_name: str):
    from langgraph.checkpoint.memory import MemorySaver

    from agent.listener import ReactAgentListener
    from agent.registry import get_agent
    from agent.react.tahoe.tahoe_agent import TahoeAgent
    from memory import CompressionConfig

    model = resolve_eval_model(model_name)
    spec = get_agent(agent_name)
    if agent_name == "intent":
        agent = await spec.create_agent()
        await agent.bind(model, MemorySaver())
        return agent

    agent = await spec.create_agent(
        profile_store=TahoeAgent.default_profile_store(),
        react_listener=ReactAgentListener(),
    )
    await agent.bind(
        model,
        MemorySaver(),
        compression_config=CompressionConfig(enabled=False),
    )
    return agent


async def run_eval(
    *,
    agent_name: str,
    groups: list[str],
    cases_dir: Path | None,
) -> tuple[float, list]:
    async def agent_factory(model_name: str):
        return await create_eval_agent(agent_name, model_name)

    if agent_name == "intent":
        from observability.intent_case import (
            format_intent_case_aggregate,
            run_intent_cases,
        )

        average, aggregates = await run_intent_cases(
            groups,
            agent_factory,
            cases_dir=cases_dir,
        )
        for aggregate in aggregates:
            print(format_intent_case_aggregate(aggregate))
    else:
        from observability.case import format_case_aggregate, run_cases

        average, aggregates = await run_cases(
            groups,
            agent_factory,
            cases_dir=cases_dir,
        )
        for aggregate in aggregates:
            print(format_case_aggregate(aggregate))

    model_runs = sum(len(item.model_results) for item in aggregates)
    print(
        f"Average score: {average:.3f} "
        f"({len(aggregates)} case(s), {model_runs} model run(s))"
    )
    return average, aggregates


def main(argv: list[str] | None = None) -> int:
    from observability.case import list_case_groups

    args = build_arg_parser().parse_args(argv)
    if args.list_groups:
        for group in list_case_groups(cases_dir=args.cases_dir):
            print(group)
        return 0
    if args.list_models:
        from models.models import default_model_name, models

        for name in sorted(models):
            marker = " (default)" if name == default_model_name else ""
            print(f"{name}{marker}")
        return 0

    groups = args.groups or DEFAULT_GROUPS[args.agent]
    try:
        average, _ = asyncio.run(
            run_eval(
                agent_name=args.agent,
                groups=groups,
                cases_dir=args.cases_dir,
            )
        )
    except FileNotFoundError as exc:
        print(str(exc), file=sys.stderr)
        return 2
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2
    except TypeError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    if args.fail_under is not None and average < args.fail_under:
        print(
            f"Average {average:.3f} is below --fail-under {args.fail_under:.3f}",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
