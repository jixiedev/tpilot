"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CopilotChatConfigurationProvider,
  CopilotChat,
} from "@copilotkit/react-core/v2";
import { AgentDebugPanel } from "../components/AgentDebugPanel";
import { PlanInterruptDialog } from "../components/PlanInterruptDialog";
import { PlanInterruptUiProvider } from "../components/PlanInterruptUiContext";
import { PlanMessageView } from "../components/PlanMessageView";
import { PlanNewChatButton } from "../components/PlanNewChatButton";
import { PlanSessionProvider, usePlanSession } from "../components/PlanSessionContext";
import { PlanTaskTree } from "../components/PlanTaskTree";
import { PlanToolRenderers } from "../components/PlanToolRenderers";
import { ColorSchemeToggle } from "../providers";

function PlanWorkingPanel({ debugEnabled }: { debugEnabled: boolean }) {
  const { sessionKey } = usePlanSession();
  return (
    <div className="plan-right-column" data-testid="plan-right-column">
      <PlanTaskTree key={`tree-${sessionKey}`} />
      {debugEnabled && <AgentDebugPanel agentId="plan" />}
    </div>
  );
}

function PlanInterruptLayer() {
  const { sessionKey } = usePlanSession();
  return <PlanInterruptDialog key={`interrupt-${sessionKey}`} />;
}

function PlanShell() {
  const [debugEnabled, setDebugEnabled] = useState(false);

  return (
    <main className="plan-shell">
      <header className="plan-topbar">
        <div className="plan-brand">
          <span className="plan-logo" aria-hidden="true">
            TP
          </span>
          <div className="plan-topbar-main">
            <h1>TahoePilot</h1>
            <p className="plan-tagline">
              Plan · decompose, delegate, summarise
            </p>
          </div>
        </div>
        <nav className="plan-topbar-nav" aria-label="Agent switcher">
          <Link
            className="plan-nav-link"
            href="/"
            data-testid="plan-nav-databot"
          >
            Databot
          </Link>
          <span
            className="plan-nav-link plan-nav-link--active"
            aria-current="page"
            data-testid="plan-nav-plan"
          >
            Plan
          </span>
        </nav>
        <div className="plan-topbar-actions">
          <ColorSchemeToggle />
          <label className="databot-debug-toggle">
            <input
              type="checkbox"
              checked={debugEnabled}
              onChange={(e) => setDebugEnabled(e.target.checked)}
              data-testid="plan-debug-toggle"
            />
            <span className="databot-switch" aria-hidden="true" />
            <span>Debug</span>
          </label>
          <PlanNewChatButton />
        </div>
      </header>

      <div className="plan-layout">
        <div className="plan-chat-column" data-testid="plan-chat-column">
          <CopilotChat
            messageView={PlanMessageView}
            labels={{
              modalHeaderTitle: "Plan",
              welcomeMessageText:
                "Describe a multi-step task and the Plan agent will break it into ordered steps, delegate each step to the right specialist, and report the result.",
            }}
            className="plan-chat"
          />
        </div>
        <PlanToolRenderers />
        <PlanWorkingPanel debugEnabled={debugEnabled} />
      </div>
      <PlanInterruptLayer />
    </main>
  );
}

export default function PlanPage() {
  return (
    <CopilotChatConfigurationProvider agentId="plan">
      <PlanSessionProvider>
        <PlanInterruptUiProvider>
          <PlanShell />
        </PlanInterruptUiProvider>
      </PlanSessionProvider>
    </CopilotChatConfigurationProvider>
  );
}
