"use client";

import {
  CopilotChatConfigurationProvider,
  CopilotSidebar,
} from "@copilotkit/react-core/v2";
import { AgentDebugPanel } from "./components/AgentDebugPanel";
import { DatabotArtifactPanel } from "./components/DatabotArtifactPanel";
import { DatabotNewChatButton } from "./components/DatabotNewChatButton";
import { DatabotSessionProvider, useDatabotSession } from "./components/DatabotSessionContext";
import { DatabotMessageView } from "./components/DatabotMessageView";
import { DatabotToolRenderers } from "./components/DatabotToolRenderers";
import { GatePanel } from "./components/GatePanel";

function DatabotWorkingPanels() {
  const { sessionKey } = useDatabotSession();
  return (
    <>
      <GatePanel key={`gate-${sessionKey}`} />
      <DatabotArtifactPanel key={`artifact-${sessionKey}`} />
      <AgentDebugPanel key={`debug-${sessionKey}`} />
    </>
  );
}

export default function Page() {
  return (
    <CopilotChatConfigurationProvider agentId="databot">
    <DatabotSessionProvider>
    <main className="databot-shell">
      <header className="databot-topbar">
        <div className="databot-topbar-main">
          <h1>TahoePilot · Databot</h1>
          <p className="databot-tagline">
            Multi-stage data retrieval with RAG, glossary, and human gates.
          </p>
        </div>
        <DatabotNewChatButton />
      </header>

      <div className="databot-layout">
        {/* Sidebar is the chat + interrupt-rendering surface.
            The GatePanel is a headless hook that mounts the cards / SQL
            / chart interrupt UI in-place via CopilotKit's interrupt
            channel. We render a `null` element from it; the chat picks
            it up automatically. */}
        <CopilotSidebar
          defaultOpen
          messageView={DatabotMessageView}
          labels={{
            modalHeaderTitle: "Databot",
            welcomeMessageText:
              "Ask me about tables, metrics, or run a SQL query. I'll fetch candidates, draft the SQL, and ask for your approval before executing.",
          }}
        />
        <DatabotToolRenderers />
        <DatabotWorkingPanels />
      </div>
    </main>
    </DatabotSessionProvider>
    </CopilotChatConfigurationProvider>
  );
}
