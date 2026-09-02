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
import typing
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

# pydantic 2.13 rejects ``typing.TypedDict`` on Python < 3.12; the
# pinned ``ag-ui-langgraph`` 0.0.43 still uses it, so we shim the symbol
# to ``typing_extensions.TypedDict`` (which pydantic accepts everywhere)
# BEFORE the SDK gets imported below. Without this the very first AG-UI
# request blows up with a PydanticUserError on internal schema
# generation.
if not hasattr(typing, "_tpilot_typed_dict_shim_applied"):
    import typing_extensions

    typing.TypedDict = typing_extensions.TypedDict  # type: ignore[attr-defined]
    typing._tpilot_typed_dict_shim_applied = True  # type: ignore[attr-defined]

import aiosqlite
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

from agent.registry import get_agent
from ag_ui_langgraph import LangGraphAgent  # add_langgraph_fastapi_endpoint no longer used
from memory import CompressionConfig
from models.models import get_default_model

logger = logging.getLogger("agui_server")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Path to the SQLite checkpoint DB. Defaults to the repo-root
# ``checkpoints.sqlite`` so the AG-UI server, the CLI, and ``langgraph
# dev`` Studio all share the same thread store. Override with
# ``AGUI_CHECKPOINT_DB`` if you want isolation (e.g. during tests).
CHECKPOINT_DB = os.environ.get(
    "AGUI_CHECKPOINT_DB",
    str(Path(__file__).resolve().parent / "checkpoints.sqlite"),
)

# AG-UI mount path. Frontend's ``CopilotKit runtimeUrl`` resolves to
# ``/api/copilotkit``, which the Next.js route handler proxies to
# ``http://localhost:8000{AGUI_PATH}``.
AGUI_PATH = os.environ.get("AGUI_AGENT_PATH", "/agui")

# Agent name (must match frontend's ``CopilotKit agent="..."`` and
# ``useAgent({ agentId: "..." })``). We pin it to the same string the
# existing LangGraph deployment uses so neither side has to change.
AGENT_NAME = "databot"


# ---------------------------------------------------------------------------
# Graph build (sync entry, called once at import time by langgraph dev)
# ---------------------------------------------------------------------------

def _build_graph():
    """Compile the databot graph with a long-lived SQLite checkpointer.

    ``langgraph dev`` mounts this module as a Starlette app; it imports
    the symbol bound to ``app`` (see bottom of file). We compile the
    graph at import time so the first HTTP request doesn't pay the
    MCP / RAG / Trino tool-loading cost.

    The checkpointer's underlying ``aiosqlite.Connection`` must outlive
    the request scope: every AG-UI request does
    ``agent.clone() -> agent.run()`` which calls
    ``self.graph.aget_state(config)`` and that needs a live connection.
    ``AsyncSqliteSaver.from_conn_string`` is a ``@asynccontextmanager``
    that closes the connection on ``__aexit__``, so we open the
    connection ourselves and hand it to ``AsyncSqliteSaver(conn)``
    directly. The connection is closed in the FastAPI lifespan hook
    below.
    """

    async def _go():
        spec = get_agent(AGENT_NAME)
        agent = await spec.create_agent(max_tool_calls=30)
        conn = await aiosqlite.connect(CHECKPOINT_DB)
        saver = AsyncSqliteSaver(conn)
        await saver.setup()
        await agent.bind(
            get_default_model(),
            checkpointer=saver,
            compression_config=CompressionConfig(enabled=True),
        )
        return agent._graph, conn  # type: ignore[attr-defined]

    # Return a coroutine. Callers (lifespan startup, first request)
    # are async, so they ``await _build_graph()`` directly. We avoid
    # ``asyncio.run`` here because ``langgraph dev`` already has a
    # running event loop at module-import time.
    return _go()


_checkpoint_conn: "aiosqlite.Connection | None" = None
_agent_lock = asyncio.Lock()


async def _ensure_built():
    """Build the graph on first call; return the cached one thereafter.

    Idempotent across concurrent requests thanks to ``_agent_lock``.
    Each request's ``agent.clone()`` reads ``self.graph`` at clone
    time, so updating ``_agent.graph`` after a build is enough for
    subsequent requests to see the real graph.
    """
    global _compiled_graph, _checkpoint_conn
    if _compiled_graph is not None:
        return _compiled_graph
    async with _agent_lock:
        if _compiled_graph is not None:
            return _compiled_graph
        graph, conn = await _build_graph()
        _compiled_graph = graph
        _checkpoint_conn = conn
        # Swap the placeholder graph on the module-level agent so the
        # route's per-request ``agent.clone()`` picks it up.
        _agent.graph = graph  # type: ignore[attr-defined]
        logger.info("AG-UI agent graph built; ready to serve /agui")
        return graph


# Placeholder: populated by ``_ensure_built()`` on the first request
# or during lifespan startup. ``LangGraphAgent.__init__`` needs a
# graph argument (it reads ``self.graph.nodes`` to populate the AG-UI
# tool schema), so we give it a dummy here and swap in the real one
# at build time. The dummy is never actually used to execute.
class _DummyCompiledGraph:  # pragma: no cover - never executed
    """Stand-in for a real CompiledStateGraph until the lifespan runs.

    LangGraphAgent.__init__ reads ``self.graph.nodes.items()`` to
    populate the AG-UI tool schema, so the placeholder just needs
    a ``nodes`` attribute that is iterable. Everything else will
    short-circuit before the dummy is actually used.
    """
    nodes: dict = {}


_compiled_graph: "object | None" = None  # type: ignore[assignment]


# ---------------------------------------------------------------------------
# FastAPI lifespan — required by ``langgraph dev``'s router merger
# (langgraph_api/server.py:validate_router_lifespan_hooks rejects
# @app.on_startup / @app.on_shutdown handlers — it only accepts a
# single ``lifespan=`` context manager). We use it to close the
# long-lived aiosqlite connection we opened in ``_build_graph`` above.
# ---------------------------------------------------------------------------

@asynccontextmanager
async def _lifespan(_app: FastAPI) -> AsyncIterator[None]:
    # Eagerly build the graph so the first AG-UI request doesn't pay
    # the MCP / RAG / Trino tool-loading cost. Errors here are
    # surfaced as a startup failure rather than a per-request 500.
    await _ensure_built()
    try:
        yield
    finally:
        global _checkpoint_conn
        if _checkpoint_conn is not None:
            try:
                await _checkpoint_conn.close()
            except Exception:  # pragma: no cover - shutdown best effort
                logger.exception("failed to close checkpoint connection cleanly")
            _checkpoint_conn = None

# Wrap in the AG-UI adapter. This is the line that actually fixes
# the "View in Inspector (local only)" issue: the wrapper teaches the
# AG-UI stream about the graph's tool calls and interrupt events, so
# the runtime no longer treats them as unknown.
#
# Note: we use ``ag_ui_langgraph.LangGraphAgent`` rather than
# ``copilotkit.LangGraphAGUIAgent`` because in the currently-pinned
# versions the latter's ``__init__`` signature is narrower than its
# parent's, and ``add_langgraph_fastapi_endpoint`` calls
# ``agent.clone()`` (which round-trips through the parent signature)
# and explodes. ``LangGraphAGUIAgent`` only adds CopilotKit-internal
# ``copilotkit:emit-*`` metadata filtering — which the graph nodes
# here never emit — so the missing layer is a no-op for this app.
_agent = LangGraphAgent(
    name=AGENT_NAME,
    graph=_DummyCompiledGraph(),  # swapped for the real graph by _ensure_built()
    description=(
        "Databot — staged data retrieval pipeline (RAG → human-gated SQL → execute)."
    ),
    # The two flags below are critical for CopilotKit v2's interrupt UX:
    #
    #   - ``emit_interrupt_outcome=True`` makes LangGraphAgent attach an
    #     AG-UI standard ``outcome: { type: "interrupt", interrupts: [...] }``
    #     to the ``RUN_FINISHED`` event when the graph hits
    #     ``langgraph.types.interrupt(...)``. Without this, the runtime
    #     sees ``outcome: null`` and treats the paused run as a normal
    #     success — the chat panel stops refreshing because CopilotKit
    #     thinks "nothing more to do", while the graph is actually
    #     waiting for a human gate decision.
    #
    #   - ``enable_legacy_on_interrupt_event=False`` suppresses the old
    #     CopilotKit v1 ``on_interrupt`` custom event. The legacy channel
    #     is what previously made the chat "freeze" (custom events
    #     arrive but the runtime doesn't pause the run for them). The
    #     standard outcome is the only channel v2's ``useAgent`` hook
    #     actually subscribes to.
    emit_interrupt_outcome=True,
    enable_legacy_on_interrupt_event=False,
)

# ---------------------------------------------------------------------------
# FastAPI app (mounted by ``langgraph dev`` via http.app in langgraph.json)
# ---------------------------------------------------------------------------

app = FastAPI(title="tpilot-agui", version="0.1.0", lifespan=_lifespan)


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "agent": {"name": _agent.name, "path": AGUI_PATH},
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

from ag_ui.core.types import RunAgentInput  # noqa: E402  (after FastAPI app to keep import order stable)
from ag_ui.encoder import EventEncoder  # noqa: E402


@app.post(AGUI_PATH)
async def agui_endpoint(input_data: RunAgentInput, request: "Request"):
    # Ensure the real graph is built before we clone the agent. This
    # also runs in the lifespan startup path, so it's a fast no-op
    # in the steady state.
    await _ensure_built()

    accept_header = request.headers.get("accept")
    encoder = EventEncoder(accept=accept_header)

    # Clone per request: LangGraphAgent stores per-request state in
    # self.active_run; sharing a single instance across concurrent
    # requests corrupts that state.
    request_agent = _agent.clone()

    # Debug: log which state keys LangGraph thinks the graph has. If
    # ``review_cards`` / ``committed_cards`` are missing from the
    # output schema, the AG-UI runtime filters them out of the
    # ``STATE_SNAPSHOT`` event and the human gate UI can't see what
    # the LLM picked.
    try:
        schema_keys = request_agent.get_schema_keys(
            {"configurable": {"thread_id": input_data.thread_id}}
        )
        logger.warning(
            "agui_endpoint schema input=%s output=%s",
            schema_keys.get("input"),
            schema_keys.get("output"),
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("agui_endpoint: get_schema_keys failed: %r", exc)

    # The thread id is stable for the whole conversation; we also
    # need the run id so the terminal events we synthesise on
    # error/abort line up with whatever the agent already started
    # emitting. AG-UI guarantees ``input_data.run_id`` is present.
    run_id = input_data.run_id
    thread_id = input_data.thread_id

    async def event_generator():
        from ag_ui.core import EventType, RunErrorEvent
        terminal_seen = False
        try:
            async for event in request_agent.run(input_data):
                if event.type in ("RUN_FINISHED", "RUN_ERROR"):
                    terminal_seen = True
                yield encoder.encode(event)
        except asyncio.CancelledError:
            # The client (browser) closed the connection. Don't try to
            # write more bytes; just let Starlette clean up.
            logger.info("agui_endpoint: client disconnected mid-stream (run_id=%s)", run_id)
            raise
        except BaseException as exc:  # noqa: BLE001 - last-resort guard
            # Surface the failure as a structured terminal event so the
            # client can render a sensible error message instead of
            # seeing a raw stack trace. Then re-raise so Starlette /
            # uvicorn also log the exception server-side. We catch
            # ``BaseException`` (not just ``Exception``) so that errors
            # raised from background tasks inside ``LangGraphAgent.run``
            # — e.g. ``openai.BadRequestError`` from the LLM client —
            # which propagate as the async generator's task fails, still
            # surface here as a ``RUN_ERROR`` event before the stream
            # tears down.
            logger.exception(
                "agui_endpoint: unhandled exception (run_id=%s): %r",
                run_id,
                exc,
            )
            try:
                yield encoder.encode(
                    RunErrorEvent(
                        type=EventType.RUN_ERROR,
                        message=f"{type(exc).__name__}: {exc}",
                        code="AGENT_RUNTIME_ERROR",
                    )
                )
                terminal_seen = True
            except Exception:  # pragma: no cover - encoder already gone
                pass
        # If the agent's own ``run()`` exhausted without emitting a
        # terminal event (e.g. it crashed mid-stream, or the client
        # disconnected before ``run()`` could finalise), synthesise
        # an explicit ``RUN_ERROR`` so the AG-UI client doesn't have
        # to fabricate its own ``INCOMPLETE_STREAM`` error. This
        # also makes the failure mode visible in the chat panel
        # instead of looking like a hang.
        if not terminal_seen:
            try:
                yield encoder.encode(
                    RunErrorEvent(
                        type=EventType.RUN_ERROR,
                        message="AG-UI stream ended without a terminal event",
                        code="INCOMPLETE_STREAM",
                    )
                )
            except Exception:  # pragma: no cover
                pass

    return StreamingResponse(
        event_generator(),
        media_type=encoder.get_content_type(),
    )


@app.get(f"{AGUI_PATH.rstrip('/')}/health")
def agui_health() -> dict:
    return {"status": "ok", "agent": {"name": _agent.name}}


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
async def databot_ui_action(body: DatabotUiActionBody) -> dict:
    """Apply a human UI edit directly to the LangGraph checkpoint."""
    from agent.react.databot.ui_actions import (
        DatabotUiAction,
        build_ui_action_patch,
        databot_state_subset,
    )

    await _ensure_built()
    if _compiled_graph is None:
        raise HTTPException(status_code=503, detail="graph not ready")

    action = body.action
    if action not in {
        "update_card_selection",
        "propose_sql",
        "request_sql_regenerate",
    }:
        raise HTTPException(status_code=400, detail=f"unknown action: {action}")

    config = {"configurable": {"thread_id": body.thread_id}}
    snapshot = await _compiled_graph.aget_state(config)  # type: ignore[attr-defined]
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

    await _compiled_graph.aupdate_state(config, patch)  # type: ignore[attr-defined]
    updated = await _compiled_graph.aget_state(config)  # type: ignore[attr-defined]
    merged = dict(state)
    merged.update(patch)
    if updated and updated.values:
        merged.update(updated.values)

    return {
        "ok": True,
        "action": action,
        "state": databot_state_subset(merged),
    }


# The official AG-UI endpoint. Mounted at ``/agui`` so Next.js's
# CopilotKit runtime can forward a turn directly to it without going
# through the deployment-URL bridge.
add_langgraph_fastapi_endpoint_unused_marker = None  # was: add_langgraph_fastapi_endpoint(app, _agent, path=AGUI_PATH)
# We register /agui ourselves in the FastAPI app block below; see
# the comment above ``agui_endpoint`` for why.

logger.info(
    "AG-UI server ready: agent=%s path=%s checkpoint_db=%s",
    _agent.name,
    AGUI_PATH,
    CHECKPOINT_DB,
)


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
