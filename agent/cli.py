"""Interactive CLI for multi-turn chat."""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
import uuid
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from agent.registry import AGENTS, DEFAULT_AGENT, get_agent
from models.models import default_model, default_model_name
from state.state import StateProcessor, StateStore

logger = logging.getLogger(__name__)

_EXIT_COMMANDS = frozenset({"quit", "exit", "q", ":q"})

_NOISY_LOGGERS = (
    "httpx",
    "httpcore",
    "openai",
    "langchain",
    "langchain_core",
    "langchain_mcp_adapters",
    "langgraph",
    "mcp",
    "mcp_server_datahub",
    "fastmcp",
    "datahub",
    "tools.mcp",
    "agent.chatbot.routes",
)


def _configure_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(levelname)s %(name)s: %(message)s",
        force=True,
    )
    if not verbose:
        for name in _NOISY_LOGGERS:
            logging.getLogger(name).setLevel(logging.WARNING)


async def run_repl(*, agent_name: str, session: str, verbose: bool = False) -> None:
    _configure_logging(verbose)
    agent = get_agent(agent_name)
    print("TahoePilot — type 'quit' to exit")
    print(f"Agent: {agent.name}")
    print(f"Session: {session}")
    if verbose:
        print(f"Model: {default_model_name}")

    graph = await agent.build_graph(default_model, max_tool_calls=30)
    state_store = StateStore()
    state_processor = StateProcessor(state_store)

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

        state = agent.begin_turn(state_processor, session, user_input)
        turn_start = len(state["messages"])

        try:
            state = await graph.ainvoke(state)
        except Exception:
            logger.exception("Graph invocation failed")
            print("Assistant> Request failed; see logs for details.", file=sys.stderr)
            continue

        state_processor.finish_turn(session, state)
        agent.print_turn_output(state, start_index=turn_start, verbose=verbose)


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
        "-v",
        "--verbose",
        action="store_true",
        help="Show tool result previews and more logging",
    )
    return parser


def main(argv: list[str] | None = None) -> None:
    args = build_arg_parser().parse_args(argv)
    session = args.session or str(uuid.uuid4())
    asyncio.run(run_repl(agent_name=args.agent, session=session, verbose=args.verbose))


if __name__ == "__main__":
    main()
