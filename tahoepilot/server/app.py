"""AG-UI FastAPI entry point for CopilotKit (path B wiring).

Mounted by ``langgraph dev`` via the ``http.app`` field in
``langgraph.json`` (so the dev server, the AG-UI endpoints, and the
checkpointed graphs all run in the same process — no second deployment).

Two front agents, each with its own endpoint and web page:

* ``/agui/lead`` — the lead agent (page ``/lead``). It answers, plans and
  delegates to specialists that run nested inside its ``delegate`` tool. A
  specialist's review ``interrupt(...)`` (warehouse's SQL review) pauses the
  lead's run with the same payload, and resuming the lead's thread resumes it.
  Root state snapshots carry ``active_subagent`` — the latest specialist's UI
  view, overlaid with the live state of one paused at a gate.
* ``/agui/databot`` — databot, the staged data-retrieval pipeline with its
  cards and SQL gates (page ``/databot``). ``/agui/databot/actions`` patches
  its paused gate state from the artifact panel.

Both share one SQLite checkpointer; threads are separate per page.

Why this file exists
--------------------
``@copilotkit/runtime``'s ``LangGraphAgent`` proxies raw AG-UI events
without teaching the runtime which tools/interrupts the LangGraph graph
actually exposes, so tool calls fell into the "View in Inspector (local
only)" bucket. Wrapping each compiled graph in
``ag_ui_langgraph.LangGraphAgent`` re-emits tool calls as ``TOOL_CALL_*``
events, carries state snapshots, and exposes ``interrupt(...)`` payloads as
standard AG-UI interrupts. The Next.js ``/api/copilotkit`` route forwards
each agent to its endpoint with a plain ``@ag-ui/client`` ``HttpAgent``.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import AsyncIterator, Awaitable, Callable
from contextlib import asynccontextmanager
from typing import Any

from tahoepilot import compat  # noqa: F401 — TypedDict shim before AG-UI SDK

import aiosqlite
from ag_ui.core import EventType, RunErrorEvent
from ag_ui.core.types import RunAgentInput
from ag_ui.encoder import EventEncoder
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

from tahoepilot.agent.catalog import AgentCatalog, AgentCatalogSettings
from tahoepilot.agent.session import GRAPH_RECURSION_LIMIT, with_run_user
from tahoepilot.agent.lead.paused import live_subagent_view
from tahoepilot.agent.runtime import TahoeRuntimeHelper
from ag_ui_langgraph import LangGraphAgent  # add_langgraph_fastapi_endpoint no longer used
from tahoepilot.server.auth import AuthError, DirectoryUnavailable, auth_config, login, user_from_request
from tahoepilot.server.history import AguiHistoryRepair
from tahoepilot.memory.profile_store import resolve_user_id
from tahoepilot.settings.runtime_config import ensure_runtime_dirs, get_runtime_paths
from tahoepilot.settings.server_config import get_server_config
from tahoepilot.models.llm import get_default_model

# Follow-up requests resend streamed tool-call arguments. Install before any
# request reaches LangGraphAgent.prepare_stream.
AguiHistoryRepair().install()

logger = logging.getLogger("tahoepilot.server")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Path to the SQLite checkpoint DB (``config/runtime.toml`` + env overrides).
CHECKPOINT_DB = str(get_runtime_paths().checkpoint_db)

# AG-UI base path; each front agent is served at ``{AGUI_PATH}/{name}``. The
# Next.js route ``frontend/app/api/copilotkit/[...path]/route.ts`` forwards
# CopilotKit agent ``lead`` / ``databot`` to these endpoints.
# Set in ``<config dir>/server.toml`` ``[agui]``, like the other server settings.
AGUI_PATH = get_server_config().agui.base_path

LEAD_AGENT = "lead"
DATABOT_AGENT = "databot"
#: Front agents served over AG-UI, in mount order.
FRONT_AGENTS = (LEAD_AGENT, DATABOT_AGENT)

AGENT_DESCRIPTIONS = {
    LEAD_AGENT: (
        "TahoePilot lead agent — answers, plans and delegates to specialists "
        "(warehouse: reviewed SQL; knowledge; diagnostic; data_analysis; swe)."
    ),
    DATABOT_AGENT: "Databot — RAG table cards → human-gated SQL → execute.",
}


def agent_path(name: str) -> str:
    return f"{AGUI_PATH}/{name}"


# Request header naming the visitor (``[agui].user_header`` in server.toml). The
# ingress / auth proxy must set it; CopilotKit's runtime forwards ``x-*`` headers
# from the browser request to this server unchanged.
USER_HEADER = get_server_config().agui.user_header


# How a delegated specialist's own stream reaches the client (ag_ui_langgraph):
# "inline" streams its text and tool calls as the lead's work (the only mode a
# @ag-ui/client <= 0.0.57 accepts), "hidden" shows only the delegate call and
# its result, "attributed" adds SUBAGENT_* events (needs a newer client).
SUBAGENT_VISIBILITY = get_server_config().agui.subagent_visibility

# The adapter's raw LangGraph event copies are off by default. With them on it
# attaches each underlying event (full prompts, full specialist state) to every
# AG-UI event: a dozen nested databot steps streamed ~95 MB to the browser,
# against ~0.3 MB without, and a longer run hung a 16 GB machine. Nothing in
# the frontend reads them; set ``emit_raw_events = true`` in server.toml to debug.
EMIT_RAW_EVENTS = get_server_config().agui.emit_raw_events


# ---------------------------------------------------------------------------
# Runtime: the compiled graph, its checkpoint connection, and the AG-UI agent
# ---------------------------------------------------------------------------


class LeadGraphView:
    """The lead's compiled graph as the AG-UI adapter sees it.

    Root ``aget_state`` snapshots overlay ``active_subagent`` with the live view
    of a specialist paused at a gate (``tahoepilot/agent/lead/paused.py``); the lead's own
    state only receives that view when ``delegate`` returns. Everything else is
    delegated to the compiled graph unchanged.
    """

    def __init__(self, lead: Any) -> None:
        self.lead = lead
        self._graph = lead.build_graph()

    def __getattr__(self, name: str) -> Any:
        return getattr(self._graph, name)

    async def aget_state(self, config: Any, *, subgraphs: bool = False) -> Any:
        snapshot = await self._graph.aget_state(config, subgraphs=subgraphs)
        if (config.get("configurable") or {}).get("checkpoint_ns"):
            return snapshot
        try:
            view = await live_subagent_view(self.lead, config)
        except Exception:  # noqa: BLE001 - the overlay is best effort
            logger.exception("could not read the paused specialist's state")
            return snapshot
        if not view:
            return snapshot
        values = {**(snapshot.values or {}), "active_subagent": view}
        return snapshot._replace(values=values)


class DatabotGraphView:
    """Databot's compiled graph as the AG-UI adapter sees it.

    Databot's gates pause inside layer subgraphs, so the root checkpoint still
    holds pre-layer values and the artifact panel showed "idle, no models"
    while the gate listed them. Root ``aget_state`` snapshots overlay the
    paused layer's UI fields (``DatabotAgent.ui_view``); everything else is
    delegated to the compiled graph unchanged.
    """

    def __init__(self, agent: Any) -> None:
        self.agent = agent
        self._graph = agent.build_graph()

    def __getattr__(self, name: str) -> Any:
        return getattr(self._graph, name)

    async def aget_state(self, config: Any, *, subgraphs: bool = False) -> Any:
        snapshot = await self._graph.aget_state(config, subgraphs=subgraphs)
        if subgraphs or (config.get("configurable") or {}).get("checkpoint_ns"):
            return snapshot
        try:
            active = await self.agent.aget_active_snapshot(config)
        except Exception:  # noqa: BLE001 - the overlay is best effort
            logger.exception("could not read databot's paused layer state")
            return snapshot
        if active is None or active.config == snapshot.config or not active.values:
            return snapshot
        live = self.agent.ui_view(active.values)
        return snapshot._replace(values={**(snapshot.values or {}), **live})


class CheckpointStore:
    """One long-lived SQLite checkpointer shared by every front agent.

    The ``aiosqlite.Connection`` must outlive the request scope: every AG-UI
    request does ``agent.clone() -> agent.run()``, which calls
    ``graph.aget_state(config)`` and needs a live connection.
    ``AsyncSqliteSaver.from_conn_string`` closes it on exit, so it is opened
    here and closed at shutdown.
    """

    def __init__(self, path: str = CHECKPOINT_DB) -> None:
        self.path = path
        self.saver: AsyncSqliteSaver | None = None
        self._conn: aiosqlite.Connection | None = None
        self._lock = asyncio.Lock()

    async def get(self) -> AsyncSqliteSaver:
        async with self._lock:
            if self.saver is None:
                self._conn = await aiosqlite.connect(self.path)
                saver = AsyncSqliteSaver(self._conn)
                await saver.setup()
                self.saver = saver
        return self.saver

    async def close(self) -> None:
        if self._conn is not None:
            try:
                await self._conn.close()
            except Exception:  # pragma: no cover - shutdown best effort
                logger.exception("failed to close checkpoint connection cleanly")
        self._conn = None
        self.saver = None


CHECKPOINTS = CheckpointStore()


async def _create_front_agent(name: str) -> Any:
    profile_store = TahoeRuntimeHelper.default_profile_store(get_runtime_paths().profiles_dir)
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            name,
            profile_store=profile_store,
            model=get_default_model(),
            checkpointer=await CHECKPOINTS.get(),
            max_tool_calls=30,
        )
    )
    return await catalog.create(name)


async def _build_lead() -> tuple[Any, None]:
    """The lead's graph, wrapped so root snapshots show a paused specialist."""
    return LeadGraphView(await _create_front_agent(LEAD_AGENT)), None


async def _build_databot() -> tuple[Any, None]:
    """Databot's graph, wrapped so root snapshots show the paused gate layer."""
    return DatabotGraphView(await _create_front_agent(DATABOT_AGENT)), None


GRAPH_BUILDERS: dict[str, Callable[[], Awaitable[tuple[Any, Any]]]] = {
    LEAD_AGENT: _build_lead,
    DATABOT_AGENT: _build_databot,
}


class _DummyCompiledGraph:  # pragma: no cover - never executed
    """Stand-in graph until :meth:`AguiRuntime.ensure_built` runs.

    ``LangGraphAgent.__init__`` reads ``self.graph.nodes.items()`` to build
    the AG-UI tool schema, so the placeholder only needs ``nodes``.
    """

    nodes: dict = {}


def _make_agent(name: str = LEAD_AGENT) -> LangGraphAgent:
    # ``ag_ui_langgraph.LangGraphAgent`` rather than
    # ``copilotkit.LangGraphAGUIAgent``: in the pinned versions the latter's
    # ``__init__`` is narrower than its parent's and ``agent.clone()`` breaks.
    # The missing layer only filters ``copilotkit:emit-*`` metadata, which
    # these graphs never emit.
    return LangGraphAgent(
        name=name,
        graph=_DummyCompiledGraph(),  # swapped for the real graph by ensure_built()
        description=AGENT_DESCRIPTIONS.get(name, name),
        # CopilotKit v2 interrupt UX:
        # - emit_interrupt_outcome attaches ``outcome: {type: "interrupt"}`` to
        #   RUN_FINISHED, so a paused gate isn't treated as a finished run.
        # - enable_legacy_on_interrupt_event=False drops the v1 ``on_interrupt``
        #   custom event, which made the chat panel freeze.
        emit_interrupt_outcome=True,
        enable_legacy_on_interrupt_event=False,
        subagent_visibility=SUBAGENT_VISIBILITY,
        emit_raw_events=EMIT_RAW_EVENTS,
        config={"recursion_limit": GRAPH_RECURSION_LIMIT},
    )


class AguiRuntime:
    """One front agent's server state; ``app.state.runtimes`` maps name → runtime.

    The graph can only be built inside a running event loop, and
    ``langgraph dev`` imports this module before its loop is available, so
    the build is deferred to the lifespan startup or the first request.
    """

    def __init__(
        self,
        agent: LangGraphAgent,
        build: Callable[[], Awaitable[tuple[Any, Any]]],
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
                # Per-request ``agent.clone()`` copies ``tahoepilot.agent.graph``.
                self.agent.graph = graph  # type: ignore[attr-defined]
                self.graph = graph
                logger.info("AG-UI agent %s built; serving %s", self.agent.name, agent_path(self.agent.name))
        return self.graph

    async def close(self) -> None:
        if self._conn is None:
            return
        try:
            await self._conn.close()
        except Exception:  # pragma: no cover - shutdown best effort
            logger.exception("failed to close checkpoint connection cleanly")
        self._conn = None


def _runtime(request: Request, name: str = LEAD_AGENT) -> AguiRuntime:
    runtimes: dict[str, AguiRuntime] = request.app.state.runtimes
    if name not in runtimes:
        raise HTTPException(status_code=404, detail=f"unknown agent: {name}")
    return runtimes[name]


def make_runtimes() -> dict[str, AguiRuntime]:
    return {name: AguiRuntime(_make_agent(name), build=GRAPH_BUILDERS[name]) for name in FRONT_AGENTS}


# ``langgraph dev``'s router merger only accepts a single ``lifespan=``
# context manager (it rejects on_startup/on_shutdown handlers).
@asynccontextmanager
async def _lifespan(app: FastAPI) -> AsyncIterator[None]:
    ensure_runtime_dirs()
    if auth_config().enabled and auth_config().skip_password_check:
        logger.warning(
            "[auth].skip_password_check is on: the login page accepts ANY password "
            "(development only; anyone can sign in as anyone)"
        )
    runtimes: dict[str, AguiRuntime] = app.state.runtimes
    # Build eagerly so a broken setup fails startup instead of each request.
    for runtime in runtimes.values():
        await runtime.ensure_built()
    try:
        yield
    finally:
        for runtime in runtimes.values():
            await runtime.close()
        await CHECKPOINTS.close()


# ---------------------------------------------------------------------------
# FastAPI app (mounted by ``langgraph dev`` via http.app in langgraph.json)
# ---------------------------------------------------------------------------

app = FastAPI(title="tpilot-agui", version="0.1.0", lifespan=_lifespan)
app.state.runtimes = make_runtimes()


@app.get("/health")
def health(request: Request) -> dict:
    runtimes: dict[str, AguiRuntime] = request.app.state.runtimes
    return {
        "status": "ok",
        "agents": {name: agent_path(name) for name in runtimes},
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


async def _request_user_id(request: Request, runtime: AguiRuntime, thread_id: str) -> str:
    """The run's user.

    With ``[auth].enabled``: the username in the session token (else HTTP 401).
    Otherwise the user header, else the thread's checkpointed id, else the default.

    Same resolver as the CLI (``tahoepilot.memory.profile_store.resolve_user_id``). The
    client's own ``state.user_id`` is never consulted: the browser can set it.
    """
    if auth_config().enabled:
        # Login on: only a valid session token identifies the user.
        return _signed_in_user(request)
    header = (request.headers.get(USER_HEADER) or "").strip() if USER_HEADER else ""
    prior = None
    if not header:
        # The plain compiled graph: the views' overlays are not needed here.
        graph = getattr(runtime.graph, "_graph", runtime.graph)
        try:
            snapshot = await graph.aget_state({"configurable": {"thread_id": thread_id}})
            prior = (snapshot.values or {}).get("user_id")
        except Exception:  # noqa: BLE001 - fall back to the default user
            logger.exception("could not read the thread's user id (thread=%s)", thread_id)
    return resolve_user_id(header or None, prior=prior)


def _signed_in_user(request: Request) -> str:
    try:
        return user_from_request(request.headers)
    except AuthError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc


def bind_run_user(
    input_data: RunAgentInput, config: dict[str, Any] | None, user_id: str
) -> tuple[RunAgentInput, dict[str, Any]]:
    """Put ``user_id`` in the run's state (profile, persona, delegation) and config (tools).

    The state value overwrites whatever the client sent. On a resume the
    adapter ignores client state, so the config is what carries it there.
    """
    state = dict(input_data.state) if isinstance(input_data.state, dict) else {}
    state["user_id"] = user_id
    return input_data.model_copy(update={"state": state}), with_run_user(config, user_id)


# Hand-rolled instead of ``ag_ui_langgraph.add_langgraph_fastapi_endpoint``:
# that helper has no hook for the deferred graph build, and its signature
# changes between versions. The body mirrors what it does internally.
# ---------------------------------------------------------------------------
# Login ([auth] in server.toml; see tahoepilot/server/auth.py)
# ---------------------------------------------------------------------------


class LoginBody(BaseModel):
    username: str = Field(min_length=1, max_length=128)
    password: str = Field(max_length=1024)


@app.post(f"{AGUI_PATH}/auth/login")
async def auth_login(body: LoginBody) -> dict:
    """Check the password with LDAP; return a session token for the username."""
    if not auth_config().enabled:
        raise HTTPException(status_code=404, detail="login is disabled")
    try:
        token, session = await asyncio.to_thread(login, body.username, body.password)
    except AuthError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
    except DirectoryUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    logger.info("login: %s", session.user)
    return {"user": session.user, "token": token, "expires_at": session.expires_at}


@app.get(f"{AGUI_PATH}/auth/me")
def auth_me(request: Request) -> dict:
    """The signed-in user (``{"user": null}`` when login is disabled)."""
    if not auth_config().enabled:
        return {"user": None, "auth": False}
    return {"user": _signed_in_user(request), "auth": True}


@app.post(f"{AGUI_PATH}/{{agent_name}}")
async def agui_endpoint(agent_name: str, input_data: RunAgentInput, request: Request):
    runtime = _runtime(request, agent_name)
    await runtime.ensure_built()
    encoder = EventEncoder(accept=request.headers.get("accept"))
    # Clone per request: LangGraphAgent keeps per-run state in
    # ``self.active_run``, so a shared instance breaks under concurrency.
    request_agent = runtime.agent.clone()
    user_id = await _request_user_id(request, runtime, input_data.thread_id)
    input_data, request_agent.config = bind_run_user(input_data, request_agent.config, user_id)
    _log_schema_keys(request_agent, input_data.thread_id)
    return StreamingResponse(
        _stream_events(request_agent, input_data, encoder),
        media_type=encoder.get_content_type(),
    )


@app.get(f"{AGUI_PATH}/{{agent_name}}/health")
def agui_health(agent_name: str, request: Request) -> dict:
    return {"status": "ok", "agent": {"name": _runtime(request, agent_name).agent.name}}


# ---------------------------------------------------------------------------
# Databot UI actions — direct state patches from the artifact panel
# ---------------------------------------------------------------------------


class DatabotUiActionBody(BaseModel):
    thread_id: str = Field(min_length=1)
    action: str
    selected_card_names: list[str] | None = None
    sql: str | None = None
    validated: bool = False
    feedback: str | None = None


@app.post(f"{agent_path(DATABOT_AGENT)}/actions")
async def databot_ui_action(body: DatabotUiActionBody, request: Request) -> dict:
    """Apply a human UI edit to databot's checkpoint while it waits at a gate."""
    if auth_config().enabled:
        _signed_in_user(request)
    from tahoepilot.agent.specialists.databot.graph import DatabotGraphBuilder
    from tahoepilot.agent.specialists.databot.ui_actions import build_ui_action_patch, databot_state_subset

    graph = await _runtime(request, DATABOT_AGENT).ensure_built()

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
    if snapshot is None:
        raise HTTPException(status_code=409, detail="no databot run on this thread")
    state = dict(snapshot.values or {})

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


logger.info(
    "AG-UI server ready: agents=%s checkpoint_db=%s",
    ", ".join(f"{name}={agent_path(name)}" for name in FRONT_AGENTS),
    CHECKPOINT_DB,
)


# ---------------------------------------------------------------------------
# ``python -m tahoepilot.server.app`` entry point
# ---------------------------------------------------------------------------
#
# Standalone fallback. ``langgraph dev`` is the normal way to run this
# (it loads ``tahoepilot/server/app.py:app`` via the ``http.app`` field in
# ``langgraph.json``), but if you ever need to run just the AG-UI
# server in isolation — e.g. against a remote LangGraph deployment —
# this is the entry point. The bind address is ``[agui].host`` / ``port``
# in ``<config dir>/server.toml``; the defaults match what
# ``frontend/app/api/copilotkit/[...path]/route.ts`` expects
# (``http://localhost:8000/agui/<agent>``).

def main() -> None:
    import uvicorn

    agui = get_server_config().agui
    uvicorn.run(
        "tahoepilot.server.app:app",
        host=agui.host,
        port=agui.port,
        log_level="info",
        reload=False,
    )


if __name__ == "__main__":
    main()
