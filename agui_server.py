"""AG-UI FastAPI entry point for CopilotKit (path B wiring).

Mounted by ``langgraph dev`` via the ``http.app`` field in
``langgraph.json`` (so the dev server, the AG-UI endpoint, and the
checkpointed graph all run in the same process — no second deployment).
Exposes a single ``/agui`` endpoint that wraps the compiled databot
graph in an AG-UI adapter so CopilotKit's runtime can talk to it
without losing tool / interrupt / state events.

Why this file exists
--------------------
``@copilotkit/runtime``'s ``LangGraphAgent`` proxies raw AG-UI events
without teaching the runtime which tools/interrupts the LangGraph graph
actually exposes. The result on the frontend is that any tool/inject
event whose name isn't pre-registered with ``useCopilotAction`` falls
into the "View in Inspector (local only)" bucket and never reaches the
chat panel.

The fix is to wrap the compiled graph in
``ag_ui_langgraph.LangGraphAgent`` and serve it through the official
``add_langgraph_fastapi_endpoint`` helper. The wrapper:

* Re-emits every LangGraph tool call as a first-class AG-UI
  ``TOOL_CALL_*`` triplet so the runtime's tool registry sees them.
* Carries ``messages`` / state deltas through the AG-UI snapshot
  channel so the chat panel re-renders without manual state wiring.
* Re-exposes LangGraph ``interrupt(...)`` payloads under the standard
  ``{id, reason, message}`` shape, so the existing ``GatePanel`` keeps
  working with no code change on the frontend.

The Next.js ``/api/copilotkit`` route then stops using
``LangGraphAgent`` and just forwards the AG-UI request to this
process's ``/agui`` endpoint via a plain ``@ag-ui/client`` ``HttpAgent``.
"""

from __future__ import annotations

import asyncio
import logging
import os
from collections.abc import AsyncIterator, Awaitable, Callable
from contextlib import asynccontextmanager
from typing import Any

import compat  # noqa: F401 — TypedDict shim before AG-UI SDK

import aiosqlite
from ag_ui.core import EventType, RunErrorEvent
from ag_ui.core.types import RunAgentInput
from ag_ui.encoder import EventEncoder
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

from agent.catalog import AgentCatalog, AgentCatalogSettings
from agent.runtime import TahoeRuntimeHelper
from ag_ui_langgraph import LangGraphAgent  # add_langgraph_fastapi_endpoint no longer used
from config.local_config import ensure_local_dirs, get_local_paths
from models.llm import get_default_model

logger = logging.getLogger("agui_server")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Path to the SQLite checkpoint DB (``config/local.toml`` + env overrides).
CHECKPOINT_DB = str(get_local_paths().checkpoint_db)

# AG-UI mount path. Frontend's ``CopilotKit runtimeUrl`` resolves to
# ``/api/copilotkit``, which the Next.js route handler proxies to
# ``http://localhost:8000{AGUI_PATH}``.
AGUI_PATH = os.environ.get("AGUI_AGENT_PATH", "/agui")

# Agent name (must match frontend's ``CopilotKit agent="..."`` and
# ``useAgent({ agentId: "..." })``). We pin it to the same string the
# existing LangGraph deployment uses so neither side has to change.
AGENT_NAME = "databot"


# ---------------------------------------------------------------------------
# Runtime: the compiled graph, its checkpoint connection, and the AG-UI agent
# ---------------------------------------------------------------------------


async def _build_graph() -> tuple[Any, aiosqlite.Connection]:
    """Compile the databot graph with a long-lived SQLite checkpointer.

    The checkpointer's ``aiosqlite.Connection`` must outlive the request
    scope: every AG-UI request does ``agent.clone() -> agent.run()``, which
    calls ``self.graph.aget_state(config)`` and needs a live connection.
    ``AsyncSqliteSaver.from_conn_string`` closes the connection on exit, so
    we open it ourselves; :meth:`AguiRuntime.close` closes it at shutdown.
    """
    profile_store = TahoeRuntimeHelper.default_profile_store(get_local_paths().profiles_dir)
    conn = await aiosqlite.connect(CHECKPOINT_DB)
    saver = AsyncSqliteSaver(conn)
    await saver.setup()
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            AGENT_NAME,
            profile_store=profile_store,
            model=get_default_model(),
            checkpointer=saver,
            max_tool_calls=30,
        )
    )
    agent = await catalog.create(AGENT_NAME)
    return agent.graph, conn


class _DummyCompiledGraph:  # pragma: no cover - never executed
    """Stand-in graph until :meth:`AguiRuntime.ensure_built` runs.

    ``LangGraphAgent.__init__`` reads ``self.graph.nodes.items()`` to build
    the AG-UI tool schema, so the placeholder only needs ``nodes``.
    """

    nodes: dict = {}


def _make_agent() -> LangGraphAgent:
    # ``ag_ui_langgraph.LangGraphAgent`` rather than
    # ``copilotkit.LangGraphAGUIAgent``: in the pinned versions the latter's
    # ``__init__`` is narrower than its parent's and ``agent.clone()`` breaks.
    # The missing layer only filters ``copilotkit:emit-*`` metadata, which
    # this graph never emits.
    return LangGraphAgent(
        name=AGENT_NAME,
        graph=_DummyCompiledGraph(),  # swapped for the real graph by ensure_built()
        description=(
            "Databot — staged data retrieval pipeline (RAG → human-gated SQL → execute)."
        ),
        # CopilotKit v2 interrupt UX:
        # - emit_interrupt_outcome attaches ``outcome: {type: "interrupt"}`` to
        #   RUN_FINISHED, so a paused gate isn't treated as a finished run.
        # - enable_legacy_on_interrupt_event=False drops the v1 ``on_interrupt``
        #   custom event, which made the chat panel freeze.
        emit_interrupt_outcome=True,
        enable_legacy_on_interrupt_event=False,
    )


class AguiRuntime:
    """Process-wide server state, stored on ``app.state.runtime``.

    The graph can only be built inside a running event loop, and
    ``langgraph dev`` imports this module before its loop is available, so
    the build is deferred to the lifespan startup or the first request.
    """

    def __init__(
        self,
        agent: LangGraphAgent,
        build: Callable[[], Awaitable[tuple[Any, Any]]] = _build_graph,
    ) -> None:
        self.agent = agent
        self.graph: Any | None = None
        self._build = build
        self._conn: Any | None = None
        self._lock = asyncio.Lock()

    async def ensure_built(self) -> Any:
        """Build the graph once (safe under concurrent requests) and return it."""
        if self.graph is not None:
            return self.graph
        async with self._lock:
            if self.graph is None:
                graph, self._conn = await self._build()
                # Per-request ``agent.clone()`` copies ``agent.graph``.
                self.agent.graph = graph  # type: ignore[attr-defined]
                self.graph = graph
                logger.info("AG-UI agent graph built; ready to serve %s", AGUI_PATH)
        return self.graph

    async def close(self) -> None:
        if self._conn is None:
            return
        try:
            await self._conn.close()
        except Exception:  # pragma: no cover - shutdown best effort
            logger.exception("failed to close checkpoint connection cleanly")
        self._conn = None


def _runtime(request: Request) -> AguiRuntime:
    return request.app.state.runtime


# ``langgraph dev``'s router merger only accepts a single ``lifespan=``
# context manager (it rejects on_startup/on_shutdown handlers).
@asynccontextmanager
async def _lifespan(app: FastAPI) -> AsyncIterator[None]:
    ensure_local_dirs()
    runtime: AguiRuntime = app.state.runtime
    # Build eagerly so a broken setup fails startup instead of each request.
    await runtime.ensure_built()
    try:
        yield
    finally:
        await runtime.close()


# ---------------------------------------------------------------------------
# FastAPI app (mounted by ``langgraph dev`` via http.app in langgraph.json)
# ---------------------------------------------------------------------------

app = FastAPI(title="tpilot-agui", version="0.1.0", lifespan=_lifespan)
app.state.runtime = AguiRuntime(_make_agent())


@app.get("/health")
def health(request: Request) -> dict:
    return {
        "status": "ok",
        "agent": {"name": _runtime(request).agent.name, "path": AGUI_PATH},
        "checkpoint_db": CHECKPOINT_DB,
    }


# ---------------------------------------------------------------------------
# /agui endpoint
# ---------------------------------------------------------------------------
#
# We don't use ``ag_ui_langgraph.add_langgraph_fastapi_endpoint`` because:
#   - It doesn't expose a hook for lazy graph initialisation. Our graph
#     can only be built inside a running event loop, and ``langgraph dev``
#     imports this module synchronously before its event loop is
#     accessible — so we defer the build to the first request (and to
#     the lifespan startup, when running standalone).
#   - It would couple us to a third-party helper whose signature
#     changes between versions.
#
# The handler body mirrors what
# ``ag_ui_langgraph.add_langgraph_fastapi_endpoint`` does internally.
# ---------------------------------------------------------------------------

def _run_error(encoder: EventEncoder, message: str, code: str) -> str:
    return encoder.encode(
        RunErrorEvent(type=EventType.RUN_ERROR, message=message, code=code)
    )


async def _stream_events(
    agent: LangGraphAgent,
    input_data: RunAgentInput,
    encoder: EventEncoder,
) -> AsyncIterator[str]:
    """Encode the agent's AG-UI events, always ending with a terminal event.

    A failure becomes a ``RUN_ERROR`` event (``AGENT_RUNTIME_ERROR``) so the
    chat panel shows an error instead of a raw stack trace. A stream that
    ends without RUN_FINISHED / RUN_ERROR gets ``INCOMPLETE_STREAM``, so the
    client sees a failure rather than a hang.
    """
    terminal_seen = False
    try:
        async for event in agent.run(input_data):
            if event.type in ("RUN_FINISHED", "RUN_ERROR"):
                terminal_seen = True
            yield encoder.encode(event)
    except asyncio.CancelledError:
        # The browser closed the connection; don't write more bytes.
        logger.info("agui_endpoint: client disconnected (run_id=%s)", input_data.run_id)
        raise
    except BaseException as exc:  # noqa: BLE001 - last-resort guard
        # BaseException: errors from LangGraphAgent's background tasks (e.g.
        # openai.BadRequestError) surface here as the generator's task fails.
        logger.exception(
            "agui_endpoint: unhandled exception (run_id=%s): %r", input_data.run_id, exc
        )
        terminal_seen = True
        yield _run_error(encoder, f"{type(exc).__name__}: {exc}", "AGENT_RUNTIME_ERROR")
    if not terminal_seen:
        yield _run_error(
            encoder, "AG-UI stream ended without a terminal event", "INCOMPLETE_STREAM"
        )


def _log_schema_keys(agent: LangGraphAgent, thread_id: str) -> None:
    """Debug aid: AG-UI drops state keys missing from the output schema
    (e.g. ``review_cards``), which hides them from the gate UI."""
    try:
        keys = agent.get_schema_keys({"configurable": {"thread_id": thread_id}})
        logger.debug(
            "agui_endpoint schema input=%s output=%s", keys.get("input"), keys.get("output")
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("agui_endpoint: get_schema_keys failed: %r", exc)


# Hand-rolled instead of ``ag_ui_langgraph.add_langgraph_fastapi_endpoint``:
# that helper has no hook for the deferred graph build, and its signature
# changes between versions. The body mirrors what it does internally.
@app.post(AGUI_PATH)
async def agui_endpoint(input_data: RunAgentInput, request: Request):
    runtime = _runtime(request)
    await runtime.ensure_built()
    encoder = EventEncoder(accept=request.headers.get("accept"))
    # Clone per request: LangGraphAgent keeps per-run state in
    # ``self.active_run``, so a shared instance breaks under concurrency.
    request_agent = runtime.agent.clone()
    _log_schema_keys(request_agent, input_data.thread_id)
    return StreamingResponse(
        _stream_events(request_agent, input_data, encoder),
        media_type=encoder.get_content_type(),
    )


@app.get(f"{AGUI_PATH.rstrip('/')}/health")
def agui_health(request: Request) -> dict:
    return {"status": "ok", "agent": {"name": _runtime(request).agent.name}}


# ---------------------------------------------------------------------------
# UI action endpoint — direct state patches from the artifact panel
# ---------------------------------------------------------------------------


class DatabotUiActionBody(BaseModel):
    thread_id: str = Field(min_length=1)
    action: str
    selected_card_names: list[str] | None = None
    sql: str | None = None
    validated: bool = False
    feedback: str | None = None


@app.post(f"{AGUI_PATH.rstrip('/')}/actions")
async def databot_ui_action(body: DatabotUiActionBody, request: Request) -> dict:
    """Apply a human UI edit directly to the LangGraph checkpoint."""
    from agent.specialists.databot.graph import DatabotGraphBuilder
    from agent.specialists.databot.ui_actions import build_ui_action_patch, databot_state_subset

    graph = await _runtime(request).ensure_built()

    action = body.action
    if action not in {
        "update_card_selection",
        "propose_sql",
        "request_sql_regenerate",
    }:
        raise HTTPException(status_code=400, detail=f"unknown action: {action}")

    config = {"configurable": {"thread_id": body.thread_id}}
    # Gates pause inside layer subgraphs; read and patch that layer's checkpoint,
    # not the outer one (which still holds pre-layer values).
    snapshot = await DatabotGraphBuilder.aget_active_state(graph, config)
    state = dict(snapshot.values or {}) if snapshot else {}

    try:
        patch = build_ui_action_patch(
            action,  # type: ignore[arg-type]
            state,
            selected_card_names=body.selected_card_names,
            sql=body.sql,
            validated=body.validated,
            feedback=body.feedback,
        )
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc

    await graph.aupdate_state(snapshot.config, patch)
    updated = await DatabotGraphBuilder.aget_active_state(graph, config)
    merged = dict(state)
    merged.update(patch)
    if updated and updated.values:
        merged.update(updated.values)

    return {
        "ok": True,
        "action": action,
        "state": databot_state_subset(merged),
    }


logger.info("AG-UI server ready: agent=%s path=%s checkpoint_db=%s", AGENT_NAME, AGUI_PATH, CHECKPOINT_DB)


# ---------------------------------------------------------------------------
# ``python agui_server.py`` entry point
# ---------------------------------------------------------------------------
#
# Standalone fallback. ``langgraph dev`` is the normal way to run this
# (it loads ``agui_server.py:app`` via the ``http.app`` field in
# ``langgraph.json``), but if you ever need to run just the AG-UI
# server in isolation — e.g. against a remote LangGraph deployment —
# this is the entry point. ``AGUI_HOST`` / ``AGUI_PORT`` override the
# bind address; the defaults match what
# ``frontend/app/api/copilotkit/[...path]/route.ts`` expects
# (``http://localhost:8000/agui``).

def main() -> None:
    import uvicorn

    host = os.environ.get("AGUI_HOST", "127.0.0.1")
    port = int(os.environ.get("AGUI_PORT", "8000"))
    uvicorn.run(
        "agui_server:app",
        host=host,
        port=port,
        log_level="info",
        reload=False,
    )


if __name__ == "__main__":
    main()
