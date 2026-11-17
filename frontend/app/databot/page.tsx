"use client";

import { useState } from "react";
import {
  CopilotChatConfigurationProvider,
  CopilotChat,
  CopilotChatMessageView,
} from "@copilotkit/react-core/v2";
import { ColorSchemeToggle } from "../providers";
import { DatabotNewChatButton } from "../components/DatabotNewChatButton";
import { DatabotSessionProvider, useDatabotSession } from "../components/DatabotSessionContext";
import { DatabotMessageView } from "../components/DatabotMessageView";
import { DatabotSidePanels } from "../components/DatabotSidePanels";
import { DatabotToolRenderers } from "../components/DatabotToolRenderers";
import { GatePanel } from "../components/GatePanel";
import { DATABOT_AGENT_ID } from "../components/databotAgent";
import { AppNav } from "../components/AppNav";

function DatabotWorkingPanels({ debugEnabled }: { debugEnabled: boolean }) {
  const { sessionKey } = useDatabotSession();
  return (
    <div className="databot-right-column" data-testid="databot-right-column">
      <GatePanel key={`gate-${sessionKey}`} />
      <DatabotSidePanels key={`side-${sessionKey}`} debugEnabled={debugEnabled} />
    </div>
  );
}

export default function DatabotPage() {
  const [debugEnabled, setDebugEnabled] = useState(false);

  return (
    <CopilotChatConfigurationProvider agentId={DATABOT_AGENT_ID}>
    <DatabotSessionProvider>
    <main className="databot-shell">
      <header className="databot-topbar">
        <div className="databot-brand">
          <span className="databot-logo" aria-hidden="true">
            DB
          </span>
          <div className="databot-topbar-main">
            <h1>Databot</h1>
            <p className="databot-tagline">Data retrieval · table cards → reviewed SQL → results</p>
          </div>
        </div>
        <AppNav />
        <div className="databot-topbar-actions">
          <ColorSchemeToggle />
          <label className="databot-switch-field">
            <input
              type="checkbox"
              checked={debugEnabled}
              onChange={(e) => setDebugEnabled(e.target.checked)}
              data-testid="debug-toggle"
            />
            <span className="databot-switch" aria-hidden="true" />
            <span>Debug</span>
          </label>
          <DatabotNewChatButton />
        </div>
      </header>

      <div className="databot-layout">
        <div className="databot-chat-column" data-testid="databot-chat-column">
          <CopilotChat
            messageView={DatabotMessageView as unknown as typeof CopilotChatMessageView}
            labels={{
              modalHeaderTitle: "Databot",
              welcomeMessageText:
                "Ask a data question. I’ll pick the tables (you approve them), draft the SQL (you approve it), run it and explain the result.",
            }}
            className="databot-chat"
          />
        </div>
        <DatabotToolRenderers />
        <DatabotWorkingPanels debugEnabled={debugEnabled} />
      </div>
    </main>
    </DatabotSessionProvider>
    </CopilotChatConfigurationProvider>
  );
}
