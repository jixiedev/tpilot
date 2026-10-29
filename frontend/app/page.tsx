"use client";

import { useState } from "react";
import {
  CopilotChatConfigurationProvider,
  CopilotChat,
} from "@copilotkit/react-core/v2";
import { ColorSchemeToggle } from "./providers";
import { DatabotNewChatButton } from "./components/DatabotNewChatButton";
import { DatabotSessionProvider, useDatabotSession } from "./components/DatabotSessionContext";
import { DatabotMessageView } from "./components/DatabotMessageView";
import { DatabotSidePanels } from "./components/DatabotSidePanels";
import { DatabotToolRenderers } from "./components/DatabotToolRenderers";
import { GatePanel } from "./components/GatePanel";

function DatabotWorkingPanels({ debugEnabled }: { debugEnabled: boolean }) {
  const { sessionKey } = useDatabotSession();
  return (
    <div className="databot-right-column" data-testid="databot-right-column">
      <GatePanel key={`gate-${sessionKey}`} />
      <DatabotSidePanels key={`side-${sessionKey}`} debugEnabled={debugEnabled} />
    </div>
  );
}

export default function Page() {
  const [debugEnabled, setDebugEnabled] = useState(false);

  return (
    <CopilotChatConfigurationProvider agentId="databot">
    <DatabotSessionProvider>
    <main className="databot-shell">
      <header className="databot-topbar">
        <div className="databot-brand">
          <span className="databot-logo" aria-hidden="true">
            TP
          </span>
          <div className="databot-topbar-main">
            <h1>TahoePilot</h1>
            <p className="databot-tagline">Databot · tables, metrics, SQL, and human gates</p>
          </div>
        </div>
        <div className="databot-topbar-actions">
          <nav className="databot-topbar-nav" aria-label="Agent switcher">
            <span
              className="databot-nav-link databot-nav-link--active"
              aria-current="page"
              data-testid="databot-nav-databot"
            >
              Databot
            </span>
            <a
              className="databot-nav-link"
              href="/plan"
              data-testid="databot-nav-plan"
            >
              Plan
            </a>
          </nav>
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
            messageView={DatabotMessageView}
            labels={{
              modalHeaderTitle: "Databot",
              welcomeMessageText:
                "Ask about tables or metrics, or run SQL. I’ll fetch candidates, draft the query, and wait for your approval before executing.",
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
