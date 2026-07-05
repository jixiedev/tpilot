"""Interactive CLI for multi-turn chat."""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import sys
from typing import Any

from langchain_core.messages import AIMessage, ToolMessage

from agent.prompt import SYSTEM_PROMPT
from graph.builder import build_chat_graph, load_all_tools
from models.models import default_model, default_model_name
from state.agent_state import AgentState, append_user_turn, last_ai_message, new_chat_state

logger = logging.getLogger(__name__)

_EXIT_COMMANDS = frozenset({"quit", "exit", "q", ":q"})


def _configure_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(levelname)s %(name)s: %(message)s",
    )


def _format_tool_calls(message: AIMessage) -> str:
    lines: list[str] = []
    for call in message.tool_calls or []:
        args = call.get("args", {})
        rendered_args = json.dumps(args, ensure_ascii=False, sort_keys=True)
        lines.append(f"  • {call.get('name')}({rendered_args})")
    return "\n".join(lines)


def _print_turn_trace(state: AgentState, *, verbose: bool) -> None:
    if not verbose:
        return

    pending_tool_names: list[str] = []
    for message in state["messages"]:
        if isinstance(message, AIMessage) and message.tool_calls:
            pending_tool_names = [call.get("name", "?") for call in message.tool_calls]
            print(_format_tool_calls(message))
        elif isinstance(message, ToolMessage) and pending_tool_names:
            name = pending_tool_names.pop(0)
            preview = message.content
            if isinstance(preview, str) and len(preview) > 240:
                preview = preview[:240] + "…"
            print(f"    ↳ {name}: {preview}")


def _print_assistant_reply(state: AgentState) -> None:
    reply = last_ai_message(state)
    if reply is None:
        print("Assistant> (no text response; try -v to inspect tool trace)")
        return
    content = reply.content
    if isinstance(content, list):
        text_parts = [
            part.get("text", "")
            for part in content
            if isinstance(part, dict) and part.get("type") == "text"
        ]
        content = "".join(text_parts)
    print(f"Assistant> {content}")


async def _startup_banner(*, verbose: bool) -> None:
    tools = await load_all_tools()
    tool_names = ", ".join(tool.name for tool in tools) or "(none)"
    print("TahoePilot — type 'quit' to exit")
    print(f"Model: {default_model_name}")
    print(f"Tools ({len(tools)}): {tool_names}")
    if verbose:
        print("Verbose tool tracing enabled (-v)")


async def run_repl(*, verbose: bool = False) -> None:
    _configure_logging(verbose)
    await _startup_banner(verbose=verbose)

    graph = await build_chat_graph(default_model)
    state: AgentState = new_chat_state(SYSTEM_PROMPT)

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

        append_user_turn(state, user_input)

        try:
            state = graph.invoke(state)
        except Exception:
            logger.exception("Graph invocation failed")
            print("Assistant> Request failed; see logs for details.", file=sys.stderr)
            continue

        if verbose:
            _print_turn_trace(state, verbose=True)
        _print_assistant_reply(state)


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="TahoePilot CLI chat")
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Print tool call trace for each turn",
    )
    return parser


def main(argv: list[str] | None = None) -> None:
    args = build_arg_parser().parse_args(argv)
    asyncio.run(run_repl(verbose=args.verbose))


if __name__ == "__main__":
    main()
