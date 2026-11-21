import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { AGUI_BACKEND_URL, backendAuthHeaders } from "../../../lib/auth";

// ---------------------------------------------------------------------------
// Path B wiring (see tahoepilot/server/app.py and langgraph.json http.app).
//
// ``langgraph dev`` (port 8000) mounts tahoepilot/server/app.py, which serves one AG-UI
// endpoint per front agent: ``/agui/lead`` and ``/agui/databot``. Each
// CopilotKit agent below forwards to its endpoint through a plain
// ``HttpAgent``, so tool calls, state snapshots and interrupts pass 1:1.
// The pages pick their agent: ``/lead`` uses ``lead``, ``/databot`` uses
// ``databot``.
//
// Visitor identity. Agents are built per request so each call carries the
// visitor's session: the login cookie (``tp_session``) becomes
// ``Authorization: Bearer <token>``, which tahoepilot/server/app.py verifies when
// ``[auth].enabled``. Headers set here win over forwarded ones, so a browser
// cannot substitute its own. The runtime also forwards the browser request's
// ``x-*`` headers, which is how an auth proxy's ``X-Tahoepilot-User``
// (``[agui].user_header``) reaches the backend when login is off.
// ---------------------------------------------------------------------------

const runtime = new CopilotRuntime({
  agents: ({ request }) => {
    const headers = backendAuthHeaders(request);
    return {
      // Keys are the agent ids the pages use (``useAgent({ agentId })``).
      lead: new HttpAgent({
        url: `${AGUI_BACKEND_URL}/lead`,
        headers,
        description:
          "TahoePilot lead agent — answers, plans and delegates to specialists (warehouse runs reviewed SQL).",
      }),
      databot: new HttpAgent({
        url: `${AGUI_BACKEND_URL}/databot`,
        headers,
        description: "Databot — table cards → human-gated SQL → execute.",
      }),
    };
  },
  // SSE mode. The real conversation state lives in checkpoints.sqlite
  // (set up in tahoepilot/server/app.py), this only holds UI thread metadata.
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;
