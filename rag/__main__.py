"""CLI: python -m rag --job-type jira --path ./export.csv --collection jira_tahoe"""

from __future__ import annotations

import argparse
import sys


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Upload documents into Qdrant for RAG")
    parser.add_argument(
        "-t",
        "--job-type",
        default="jira",
        choices=("jira", "google_drive", "wiki"),
        help="document source type",
    )
    parser.add_argument(
        "-p",
        "--path",
        required=True,
        help="path to the document file (jira CSV) or directory (google_drive zips)",
    )
    parser.add_argument(
        "-c",
        "--collection-name",
        default="default",
        help="target Qdrant collection",
    )
    parser.add_argument(
        "--start-line",
        type=int,
        default=0,
        help="skip the first N data rows (jira CSV)",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_arg_parser().parse_args(argv)
    if args.job_type == "jira":
        from rag.jira_ingest import upload_jira_csv

        upload_jira_csv(
            args.path,
            args.collection_name,
            start_line=args.start_line,
        )
        return 0
    if args.job_type == "google_drive":
        from rag.google_drive_ingest import upload_google_drive

        upload_google_drive(args.path, args.collection_name)
        return 0
    print(
        f"Job type {args.job_type!r} is not implemented yet.",
        file=sys.stderr,
    )
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
