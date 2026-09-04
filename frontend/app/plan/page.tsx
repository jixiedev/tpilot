"use client";

import Link from "next/link";
import {
  CopilotChatConfigurationProvider,
  CopilotChat,
} from "@copilotkit/react-core/v2";
import { PlanNewChatButton } from "../components/PlanNewChatButton";
import { PlanSessionProvider, usePlanSession } from "../components/PlanSessionContext";
import { PlanTaskTree } from "../components/PlanTaskTree";

function PlanWorkingPanel() {
  const { sessionKey } = usePlanSession();
  return (
    <div className="plan-right-column" data-testid="plan-right-column">
      <PlanTaskTree key={`tree-${sessionKey}`} />
    </div>
  );
}

export default function PlanPage() {
  return (
    <CopilotChatConfigurationProvider agentId="plan">
      <PlanSessionProvider>
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
              <PlanNewChatButton />
            </div>
          </header>

          <div className="plan-layout">
            <div className="plan-chat-column" data-testid="plan-chat-column">
              <CopilotChat
                labels={{
                  modalHeaderTitle: "Plan",
                  welcomeMessageText:
                    "Describe a multi-step task and the Plan agent will break it into ordered steps, delegate each step to the right specialist, and report the result.",
                }}
                className="plan-chat"
              />
            </div>
            <PlanWorkingPanel />
          </div>
        </main>
      </PlanSessionProvider>
    </CopilotChatConfigurationProvider>
  );
}
