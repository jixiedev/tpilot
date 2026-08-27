import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";

const runtime = new CopilotRuntime({
  agents: {
    databot: new LangGraphAgent({
      deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123",
      graphId: "databot",
      langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
    }),
  },
  // SSE mode + process-local thread store. Real conversation state lives in
  // the LangGraph backend (checkpoints.sqlite); this only holds UI thread
  // metadata. Restarting `next dev` clears the list.
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;
