"""Regression guard: no blocking filesystem syscalls inside the event loop.

``langgraph dev`` serves the graph from an ASGI event loop and refuses
blocking syscalls there (``blockbuster``). A stray ``os.mkdir`` used to abort
the whole agent build, so the Plan agent could not delegate to *any*
specialist — every delegation failed with
``invoke_agent failed for <agent>: Blocking call to os.mkdir``.

``Path.mkdir(exist_ok=True)`` calls ``os.mkdir`` even when the directory is
already there, so "the directory exists" is not enough: the syscall itself is
rejected. The rules these tests lock down:

* ``ensure_dir`` must not call ``os.mkdir`` when the directory is present.
* Building an agent graph must create the offload store off the event loop.
"""

from __future__ import annotations

import asyncio
from pathlib import Path

import pytest


def _langgraph_blockbuster():
    """Mirror ``langgraph_runtime_inmem.queue._enable_blockbuster()``.

    ``langgraph dev`` blocks every blocking call except the ones it
    explicitly allows (``os.stat``, ``os.listdir``, the ``io`` read/write
    wrappers and every ``os.path.*`` helper).
    """
    blockbuster = pytest.importorskip("blockbuster")
    bb = blockbuster.BlockBuster(excluded_modules=[])
    for fn in (
        "os.stat",
        "os.listdir",
        "os.remove",
        "io.BufferedReader.read",
        "io.BufferedWriter.write",
        "io.TextIOWrapper.read",
        "io.TextIOWrapper.write",
    ):
        func = bb.functions.pop(fn, None)
        if func:
            func.deactivate()
    for fn in [f for f in list(bb.functions) if f.startswith("os.path.")]:
        func = bb.functions.pop(fn, None)
        if func:
            func.deactivate()
    return bb


async def test_ensure_dir_does_not_mkdir_when_the_directory_exists(
    tmp_path: Path,
) -> None:
    from config.local_config import ensure_dir

    target = tmp_path / "already-there"
    target.mkdir()

    bb = _langgraph_blockbuster()
    bb.activate()
    try:
        ensure_dir(target)
    finally:
        bb.deactivate()


async def test_offload_store_creation_does_not_block(tmp_path: Path) -> None:
    from memory.offload import OffloadStore

    root = tmp_path / "offload_store"
    root.mkdir()

    bb = _langgraph_blockbuster()
    bb.activate()
    try:
        store = OffloadStore(root)
    finally:
        bb.deactivate()

    assert store.root == root


async def test_agent_graph_build_creates_the_offload_store_off_loop(
    tmp_path: Path,
) -> None:
    """The offload directory does not exist yet — building the graph must
    still not touch the event loop with a blocking syscall."""
    from langgraph.checkpoint.memory import MemorySaver

    from memory import CompressionConfig

    agent = await _make_react_agent()
    offload_dir = tmp_path / "fresh-offload"
    config = CompressionConfig(enabled=True, offload_dir=offload_dir)

    bb = _langgraph_blockbuster()
    bb.activate()
    try:
        graph = await agent.build_graph(
            _FakeModel(),
            checkpointer=MemorySaver(),
            compression_config=config,
        )
    finally:
        bb.deactivate()

    assert graph is not None
    assert offload_dir.is_dir()


class _FakeModel:
    """Just enough model surface for ``build_react_graph`` to compile."""

    def bind_tools(self, tools, **kwargs):
        return self


async def _make_react_agent():
    """A minimal ReAct agent whose graph build touches the compressor."""
    from agent.react import BaseReactAgent
    from agent.runtime.tahoe_runtime_helper import tahoe_react_agent_kwargs
    from agent.specialists.diagnostic.prompt import DiagnosticSystemPrompt
    from memory.profile_store import FileProfileStore

    class _Agent(BaseReactAgent):
        turn_boundary = None
        default_profile_dir = None

        def __init__(self, root: Path) -> None:
            super().__init__(
                **tahoe_react_agent_kwargs(
                    profile_store=FileProfileStore(root),
                    tools=[],
                    prompt_assembler=DiagnosticSystemPrompt(),
                )
            )

    return _Agent(Path(".local/profiles"))
