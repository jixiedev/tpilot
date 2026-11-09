"""The catalog of documentation diagrams.

Each drawing lives in a themed module next to this one; this module only keeps
the catalog, the writer and the command line.

Regenerate the committed assets with::

    python -m docs_site.diagrams --write docs_site/pages/assets/diagrams
"""

from __future__ import annotations

import argparse
from pathlib import Path

from docs_site.diagrams_agents import (
    _databot_flow,
    _databot_gates,
    _intent_route,
    _plan_graph,
)
from docs_site.diagrams_data import _evals_run, _rag_flow, _tool_errors
from docs_site.diagrams_memory import (
    _compressor,
    _config_shape,
    _memory_layout,
    _profile_store,
    _session_layout,
    _state_layout,
)
from docs_site.diagrams_system import (
    _react_loop,
    _system,
    _turn_browser,
    _turn_cli,
    _turn_lifecycle,
)
from docs_site.diagrams_ui import _agui_action, _agui_chat, _agui_gate

_DRAWERS = {
    "system": _system,
    "turn-cli": _turn_cli,
    "turn-browser": _turn_browser,
    "turn-lifecycle": _turn_lifecycle,
    "react-loop": _react_loop,
    "intent-route": _intent_route,
    "plan-graph": _plan_graph,
    "databot-flow": _databot_flow,
    "databot-gates": _databot_gates,
    "agui-chat": _agui_chat,
    "agui-gate": _agui_gate,
    "agui-action": _agui_action,
    "rag-flow": _rag_flow,
    "tool-errors": _tool_errors,
    "evals-run": _evals_run,
    "compressor": _compressor,
    "memory-layout": _memory_layout,
    "profile-store": _profile_store,
    "session-layout": _session_layout,
    "state-layout": _state_layout,
    "config-shape": _config_shape,
}


def names() -> tuple[str, ...]:
    """Every diagram in the catalog."""
    return tuple(_DRAWERS)


def svg(name: str) -> str:
    """The painted drawing for one diagram."""
    return _DRAWERS[name]()[0]


def caption(name: str) -> str:
    """The sentence that explains one diagram."""
    return _DRAWERS[name]()[1]


def write_diagrams(target: Path) -> list[Path]:
    """Paint every diagram and write it as a static SVG file.

    Fails loudly if a painted label still names a source file: that is the bug the
    reader label map exists to prevent.
    """
    target.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    for name in names():
        drawing = svg(name)
        if ".py" in drawing:
            raise AssertionError(f"diagram '{name}' still names a source file")
        path = target / f"{name}.svg"
        path.write_text(drawing, encoding="utf-8")
        written.append(path)
    return written


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--write",
        metavar="DIR",
        help="write every diagram as an SVG file into DIR",
    )
    args = parser.parse_args(argv)
    if not args.write:
        parser.print_help()
        return 2
    for path in write_diagrams(Path(args.write)):
        print(path)
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
