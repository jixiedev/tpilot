"""Interactive CLI for multi-turn chat."""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
import uuid
from pathlib import Path

import tahoepilot.settings.paths  # noqa: F401 — loads .env and the secrets file first
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

from tahoepilot.agent.catalog import AgentCatalog, AgentCatalogSettings, DEFAULT_AGENT
from tahoepilot.agent.runtime import TahoeRuntimeHelper
from tahoepilot.memory.profile_store import resolve_user_id
from tahoepilot.settings.runtime_config import ensure_runtime_dirs, get_runtime_paths
from tahoepilot.settings.logging_config import configure_logging
from tahoepilot.agent.graph.error_recovery import format_turn_failure
from tahoepilot.memory import CompressionConfig
from tahoepilot.models.llm import default_model_name, get_default_model
from tahoepilot.tools.mcp.client import check_mcp_servers, format_mcp_startup_lines

logger = logging.getLogger(__name__)

_EXIT_COMMANDS = frozenset({"quit", "exit", "q", ":q"})


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
    profile_store = TahoeRuntimeHelper.default_profile_store(profile_dir)
    print("TahoePilot — type 'quit' to exit")
    print(f"Agent: {agent_name}")
    print(f"Model: {default_model_name}")
    print(f"Session: {session}")
    print(f"User: {user_id}")
    if verbose:
        print(f"Checkpoint DB: {checkpoint_db}")
        print(f"Profile dir: {profile_dir}")

    for line in format_mcp_startup_lines(await check_mcp_servers()):
        print(line)

    model = get_default_model()
    async with AsyncSqliteSaver.from_conn_string(str(checkpoint_db)) as checkpointer:
        await checkpointer.setup()
        catalog = AgentCatalog(
            AgentCatalogSettings.for_agent(
                agent_name,
                profile_store=profile_store,
                model=model,
                checkpointer=checkpointer,
                max_tool_calls=30,
            )
        )
        agent = await catalog.create(agent_name)

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
    parser = argparse.ArgumentParser(prog="tahoepilot", description="TahoePilot CLI chat")
    parser.add_argument(
        "-a",
        "--agent",
        default=DEFAULT_AGENT,
        choices=list(AgentCatalog.names()),
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
        help="User id for profile lookup (default: [user].default_id in runtime.toml, else the OS user)",
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
    ensure_runtime_dirs()
    session = args.session or str(uuid.uuid4())
    user_id = resolve_user_id(args.user_id)
    local_paths = get_runtime_paths()
    asyncio.run(
        run_repl(
            agent_name=args.agent,
            session=session,
            user_id=user_id,
            checkpoint_db=local_paths.checkpoint_db,
            profile_dir=local_paths.profiles_dir,
            verbose=args.verbose,
        )
    )


if __name__ == "__main__":
    main()
