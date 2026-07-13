"""Interactive CLI for multi-turn chat."""

from __future__ import annotations

import argparse
import asyncio
import logging
import os
import sys
import uuid
from pathlib import Path

from dotenv import load_dotenv
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

load_dotenv(Path(__file__).resolve().parent / ".env")

from agent.chatbot.session import graph_config
from agent.registry import AGENTS, DEFAULT_AGENT, get_agent
from config.logging_config import configure_logging
from graph.error_recovery import format_turn_failure
from models.models import default_model, default_model_name

logger = logging.getLogger(__name__)

_EXIT_COMMANDS = frozenset({"quit", "exit", "q", ":q"})
_DEFAULT_CHECKPOINT_DB = Path(__file__).resolve().parent / "checkpoints.sqlite"


async def run_repl(
    *,
    agent_name: str,
    session: str,
    checkpoint_db: Path,
    verbose: bool = False,
) -> None:
    agent = get_agent(agent_name)
    print("TahoePilot — type 'quit' to exit")
    print(f"Agent: {agent.name}")
    print(f"Session: {session}")
    if verbose:
        print(f"Model: {default_model_name}")
        print(f"Checkpoint DB: {checkpoint_db}")

    async with AsyncSqliteSaver.from_conn_string(str(checkpoint_db)) as checkpointer:
        await checkpointer.setup()
        graph = await agent.build_graph(
            default_model,
            checkpointer=checkpointer,
            max_tool_calls=30,
        )
        config = graph_config(session)

        while True:
            try:
                user_input = input("You> ").strip()
            except (EOFError, KeyboardInterrupt):
                print("\nBye.")
                break

            if not user_input:
                continue
            if user_input.lower() in _EXIT_COMMANDS:
                print("Bye.")
                break

            turn_input = await agent.prepare_turn_input(graph, session, user_input)

            try:
                state = await graph.ainvoke(turn_input, config)
            except Exception as exc:
                logger.exception("Graph invocation failed")
                print(f"Assistant> {format_turn_failure(exc)}", file=sys.stderr)
                continue

            agent.print_turn_output(state)


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="TahoePilot CLI chat")
    parser.add_argument(
        "-a",
        "--agent",
        default=DEFAULT_AGENT,
        choices=sorted(AGENTS),
        help=f"Agent application to run (default: {DEFAULT_AGENT})",
    )
    parser.add_argument(
        "-s",
        "--session",
        default=None,
        help="Session id for conversation history (default: random UUID)",
    )
    parser.add_argument(
        "--checkpoint-db",
        default=None,
        help="SQLite path for LangGraph checkpoints (default: ./checkpoints.sqlite)",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Show model name at startup",
    )
    return parser


def main(argv: list[str] | None = None) -> None:
    args = build_arg_parser().parse_args(argv)
    configure_logging(verbose=args.verbose)
    session = args.session or str(uuid.uuid4())
    checkpoint_db = Path(
        args.checkpoint_db
        or os.getenv("TAHOEPILOT_CHECKPOINT_DB")
        or _DEFAULT_CHECKPOINT_DB
    )
    asyncio.run(
        run_repl(
            agent_name=args.agent,
            session=session,
            checkpoint_db=checkpoint_db,
            verbose=args.verbose,
        )
    )


if __name__ == "__main__":
    main()
