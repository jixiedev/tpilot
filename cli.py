"""Interactive CLI for multi-turn chat."""

from __future__ import annotations

import argparse
import asyncio
import getpass
import logging
import os
import sys
import uuid
from pathlib import Path

from dotenv import load_dotenv
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

load_dotenv(Path(__file__).resolve().parent / ".env")

from agent.registry import AGENTS, DEFAULT_AGENT, get_agent
from agent.react.tahoe.tahoe_agent import TahoeAgent
from config.logging_config import configure_logging
from graph.error_recovery import format_turn_failure
from memory import CompressionConfig
from models.models import default_model, default_model_name
from tools.mcp.mcp import check_mcp_servers, format_mcp_startup_lines

logger = logging.getLogger(__name__)

_EXIT_COMMANDS = frozenset({"quit", "exit", "q", ":q"})
_DEFAULT_CHECKPOINT_DB = Path(__file__).resolve().parent / "checkpoints.sqlite"
_DEFAULT_PROFILE_DIR = Path(__file__).resolve().parent / "profiles"


def resolve_cli_user_id(explicit: str | None = None) -> str:
    """CLI user id: flag / env / process username."""
    if explicit and explicit.strip():
        return explicit.strip()
    env_value = os.getenv("TAHOEPILOT_USER_ID", "").strip()
    if env_value:
        return env_value
    return getpass.getuser()


def _read_line(prompt: str) -> str | None:
    try:
        return input(prompt)
    except (EOFError, KeyboardInterrupt):
        print()
        return None


async def _cli_on_interrupt(question: str) -> str | None:
    """Human-in-the-loop callback used by ``BaseAgent.run``."""
    print(f"Prompt> {question}")
    reply = _read_line("You> ")
    if reply is None:
        return None
    text = reply.strip()
    if text.lower() in _EXIT_COMMANDS:
        return None
    return text


async def run_repl(
    *,
    agent_name: str,
    session: str,
    user_id: str,
    checkpoint_db: Path,
    profile_dir: Path,
    verbose: bool = False,
) -> None:
    spec = get_agent(agent_name)
    profile_store = TahoeAgent.default_profile_store(profile_dir)
    print("TahoePilot — type 'quit' to exit")
    print(f"Agent: {spec.name}")
    print(f"Model: {default_model_name}")
    print(f"Session: {session}")
    print(f"User: {user_id}")
    if verbose:
        print(f"Checkpoint DB: {checkpoint_db}")
        print(f"Profile dir: {profile_dir}")

    for line in format_mcp_startup_lines(await check_mcp_servers()):
        print(line)

    async with AsyncSqliteSaver.from_conn_string(str(checkpoint_db)) as checkpointer:
        await checkpointer.setup()
        agent = await spec.create_agent(
            profile_store=profile_store,
            max_tool_calls=30,
        )
        await agent.bind(
            default_model,
            checkpointer,
            compression_config=CompressionConfig(enabled=True),
        )

        while True:
            user_input = _read_line("You> ")
            if user_input is None:
                print("Bye.")
                break

            user_input = user_input.strip()
            if not user_input:
                continue
            if user_input.lower() in _EXIT_COMMANDS:
                print("Bye.")
                break

            try:
                result = await agent.run(
                    user_input,
                    session=session,
                    user_id=user_id,
                    on_interrupt=_cli_on_interrupt,
                    print_output=True,
                )
            except Exception as exc:
                logger.exception("Agent turn failed")
                print(f"Assistant> {format_turn_failure(exc)}", file=sys.stderr)
                continue

            if result.cancelled:
                print("Bye.")
                break


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
        "-u",
        "--user-id",
        default=None,
        help="User id for profile lookup (default: TAHOEPILOT_USER_ID or process username)",
    )
    parser.add_argument(
        "--checkpoint-db",
        default=None,
        help="SQLite path for LangGraph checkpoints (default: ./checkpoints.sqlite)",
    )
    parser.add_argument(
        "--profile-dir",
        default=None,
        help="Directory for per-user profile JSON files (default: ./profiles)",
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
    user_id = resolve_cli_user_id(args.user_id)
    checkpoint_db = Path(
        args.checkpoint_db
        or os.getenv("TAHOEPILOT_CHECKPOINT_DB")
        or _DEFAULT_CHECKPOINT_DB
    )
    profile_dir = Path(
        args.profile_dir
        or os.getenv("TAHOEPILOT_PROFILE_DIR")
        or _DEFAULT_PROFILE_DIR
    )
    asyncio.run(
        run_repl(
            agent_name=args.agent,
            session=session,
            user_id=user_id,
            checkpoint_db=checkpoint_db,
            profile_dir=profile_dir,
            verbose=args.verbose,
        )
    )


if __name__ == "__main__":
    main()
