"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";
import { AgentDebugPanel } from "./components/AgentDebugPanel";
import { DatabotArtifactPanel } from "./components/DatabotArtifactPanel";
import { GatePanel } from "./components/GatePanel";

export default function Page() {
  return (
    <main className="databot-shell">
      <header className="databot-topbar">
        <h1>TahoePilot · Databot</h1>
        <p className="databot-tagline">
          Multi-stage data retrieval with RAG, glossary, and human gates.
        </p>
      </header>

      <div className="databot-layout">
        {/* Sidebar is the chat + interrupt-rendering surface.
            The GatePanel is a headless hook that mounts the cards / SQL
            / chart interrupt UI in-place via CopilotKit's interrupt
            channel. We render a `null` element from it; the chat picks
            it up automatically. */}
        <CopilotSidebar
          defaultOpen
          labels={{
            modalHeaderTitle: "Databot",
            welcomeMessageText:
              "Ask me about tables, metrics, or run a SQL query. I'll fetch candidates, draft the SQL, and ask for your approval before executing.",
          }}
        />
        <GatePanel />

        <DatabotArtifactPanel />
        <AgentDebugPanel />
      </div>
    </main>
  );
}
