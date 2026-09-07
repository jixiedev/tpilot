import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

// ---------------------------------------------------------------------------
// Path B wiring (see agui_server.py and langgraph.json http.app).
//
// The graph runs wrapped in a ``LangGraphAgent`` and is served by
// ``langgraph dev`` on port 8000 at the ``/agui`` path. ``langgraph dev``
// honours the ``http.app`` field in langgraph.json — it imports the
// module and mounts the resulting Starlette/FastAPI app alongside its
// own LangGraph Platform routes.
//
// This route no longer wraps a ``LangGraphAgent`` — that was the source
// of the "View in Inspector (local only)" issue, because the raw AG-UI
// bridge didn't surface the graph's tool calls to the runtime's
// registry. We now point the runtime straight at the AG-UI endpoint
// via an ``HttpAgent`` so the runtime forwards events 1:1 and lets the
// frontend's chat panel re-render.
// ---------------------------------------------------------------------------

// AG-UI backend base URL. Points at the shared ``/agui`` prefix on the
// FastAPI process; each registered agent gets a sub-path under it
// (``/agui/databot``, ``/agui/plan``). Override via the env var to
// point at a remote deployment — the value MUST include the ``/agui``
// prefix (or whatever ``AGUI_AGENT_PATH`` was set to on the backend).
const AGUI_BACKEND_URL =
  process.env.AGUI_BACKEND_URL || "http://localhost:8000/agui";

const runtime = new CopilotRuntime({
  agents: {
    // One HttpAgent per logical agent name. The CopilotKit runtime keys
    // its agent registry on this name; the frontend's ``useAgent`` and
    // the ``<CopilotKit agent="...">`` prop must use the same string.
    //
    // Each agent runs at ``{AGUI_BACKEND_URL}/{agent_name}``; the AG-UI
    // server (``agui_server.py``) mounts one endpoint per registered
    // agent under the shared ``/agui`` prefix. Adding a new specialist
    // here is the only frontend change required to expose it.
    databot: new HttpAgent({
      url: `${AGUI_BACKEND_URL}/databot`,
      description:
        "Databot — staged data retrieval pipeline (RAG → human-gated SQL → execute).",
    }),
    plan: new HttpAgent({
      url: `${AGUI_BACKEND_URL}/plan`,
      description:
        "Plan — decompose a request into ordered steps and delegate to specialists.",
    }),
  },
  // SSE mode. The real conversation state lives in checkpoints.sqlite
  // (set up in agui_server.py), this only holds UI thread metadata.
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;
