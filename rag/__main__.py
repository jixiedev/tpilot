"""CLI: python -m rag plan|run|download ..."""

from __future__ import annotations

import argparse
import sys

from rag.job import default_checkpoint_path, plan_ingest, run_ingest
from rag.models import download_configured_models


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Plan and run RAG ingest into Qdrant")
    sub = parser.add_subparsers(dest="command", required=True)

    plan = sub.add_parser(
        "plan",
        help="Scan a source path and write a task list plus a fresh checkpoint",
    )
    plan.add_argument(
        "-t",
        "--job-type",
        required=True,
        metavar="TYPE",
        help="jira | drive | dbt (wiki not implemented yet)",
    )
    plan.add_argument(
        "-p",
        "--path",
        required=True,
        help=(
            "path to the document file (jira CSV), directory of extracted files "
            "(drive), or directory of dbt schema yml files (dbt)"
        ),
    )
    plan.add_argument(
        "-c",
        "--collection-name",
        required=True,
        help="target Qdrant collection",
    )
    plan.add_argument(
        "--tasks",
        required=True,
        help="task-list JSON to write",
    )
    plan.add_argument(
        "--checkpoint",
        default=None,
        help="checkpoint JSON to write (default: <tasks>.checkpoint.json)",
    )
    plan.add_argument(
        "--start-line",
        type=int,
        default=0,
        help="skip the first N data rows (jira CSV); stored on the task list",
    )

    run = sub.add_parser(
        "run",
        help="Ingest from a task list; resume from checkpoint when that file exists",
    )
    run.add_argument(
        "--tasks",
        required=True,
        help="task-list JSON to read",
    )
    run.add_argument(
        "--checkpoint",
        default=None,
        help=(
            "checkpoint JSON for this task list. If the path is set and the file "
            "exists, ingest resumes from it; if the file is missing, ingest starts "
            "from the beginning. Default: <tasks>.checkpoint.json"
        ),
    )
    run.add_argument(
        "--batch-size",
        type=int,
        default=1,
        help="number of source files to ingest between checkpoint writes",
    )
    run.add_argument(
        "--recreate-collection",
        action="store_true",
        help="delete the target Qdrant collection and ignore completed files in the checkpoint",
    )

    sub.add_parser(
        "download",
        help="Download BAAI/bge-m3 and BAAI/bge-reranker-v2-m3 into the local model cache",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_arg_parser().parse_args(argv)
    try:
        if args.command == "download":
            for line in download_configured_models():
                print(line)
            return 0
        if args.command == "plan":
            plan_ingest(
                job_type=args.job_type,
                source=args.path,
                collection=args.collection_name,
                tasks_path=args.tasks,
                checkpoint_path=args.checkpoint,
                start_line=args.start_line,
            )
            return 0
        checkpoint = args.checkpoint
        if checkpoint is None:
            checkpoint = str(default_checkpoint_path(args.tasks))
        run_ingest(
            tasks_path=args.tasks,
            checkpoint_path=checkpoint,
            batch_size=args.batch_size,
            recreate_collection=args.recreate_collection,
        )
        return 0
    except (FileNotFoundError, NotImplementedError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
