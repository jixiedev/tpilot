import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

// ---------------------------------------------------------------------------
// Path B wiring (see agui_server.py and langgraph.json http.app).
//
// ``langgraph dev`` (port 8000) mounts agui_server.py, which serves one AG-UI
// endpoint per front agent: ``/agui/lead`` and ``/agui/databot``. Each
// CopilotKit agent below forwards to its endpoint through a plain
// ``HttpAgent``, so tool calls, state snapshots and interrupts pass 1:1.
// The pages pick their agent: ``/lead`` uses ``lead``, ``/databot`` uses
// ``databot``.
// ---------------------------------------------------------------------------

/** AG-UI base URL; each agent is served at ``${AGUI_BACKEND_URL}/<agent>``. */
const AGUI_BACKEND_URL = (
  process.env.AGUI_BACKEND_URL || "http://localhost:8000/agui"
).replace(/\/+$/, "");

const runtime = new CopilotRuntime({
  agents: {
    // Keys are the agent ids the pages use (``useAgent({ agentId })``).
    lead: new HttpAgent({
      url: `${AGUI_BACKEND_URL}/lead`,
      description:
        "TahoePilot lead agent — answers, plans and delegates to specialists (warehouse runs reviewed SQL).",
    }),
    databot: new HttpAgent({
      url: `${AGUI_BACKEND_URL}/databot`,
      description: "Databot — table cards → human-gated SQL → execute.",
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
