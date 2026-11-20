"use client";

import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotChatMessageView,
} from "@copilotkit/react-core/v2";
import { ColorSchemeToggle } from "../providers";
import { AgentIcon, TahoeMark } from "../components/icons";
import { AppNav } from "../components/AppNav";
import { DatabotNewChatButton } from "../components/DatabotNewChatButton";
import { DatabotSessionProvider, useDatabotSession } from "../components/DatabotSessionContext";
import { LEAD_AGENT_ID } from "../components/leadState";
import { LeadMessageView } from "../components/lead/LeadMessageView";
import { LeadToolRenderers } from "../components/lead/LeadToolRenderers";
import { LeadWorkspace } from "../components/lead/LeadWorkspace";
import { SqlReviewGate } from "../components/lead/SqlReviewGate";
import { resetLeadAgentView } from "../components/lead/leadClientReset";

const SPECIALISTS = [
  { id: "warehouse", name: "Warehouse", text: "data questions, with every query reviewed by you" },
  { id: "knowledge", name: "Knowledge", text: "metric definitions, docs, code and Jira" },
  { id: "diagnostic", name: "Diagnostic", text: "failing jobs, DAGs and pods" },
  { id: "data_analysis", name: "Data analysis", text: "trends, comparisons and charts" },
  { id: "swe", name: "SWE", text: "code and config changes" },
];

function LeadWorkspaceColumn() {
  const { sessionKey } = useDatabotSession();
  return <LeadWorkspace key={`workspace-${sessionKey}`} />;
}

export default function LeadPage() {
  return (
    <CopilotChatConfigurationProvider agentId={LEAD_AGENT_ID}>
      <DatabotSessionProvider>
        <main className="lead-shell">
          <header className="lead-topbar">
            <div className="lead-brand">
              <TahoeMark size={36} />
              <div>
                <h1>TahoePilot</h1>
                <p className="lead-tagline">Lead agent · answers, plans and delegates to specialists</p>
              </div>
            </div>
            <AppNav />
            <div className="lead-topbar-actions">
              <ColorSchemeToggle />
              <DatabotNewChatButton agentId={LEAD_AGENT_ID} resetAgentView={resetLeadAgentView} />
            </div>
          </header>

          <div className="lead-layout">
            <section className="lead-chat-column" data-testid="lead-chat-column">
              <CopilotChat
                // A plain component fills the slot; the slot type expects the built-in view.
                messageView={LeadMessageView as unknown as typeof CopilotChatMessageView}
                labels={{
                  modalHeaderTitle: "TahoePilot",
                  welcomeMessageText:
                    "Ask about data, metrics, failing jobs or code. I answer what I can, ask when something is unclear, and hand real work to a specialist.",
                }}
                className="lead-chat"
              />
              <ul className="lead-roster" aria-label="Specialists">
                {SPECIALISTS.map((s) => (
                  <li key={s.name} className={`agent-chip agent-chip--${s.id}`} title={s.text}>
                    <AgentIcon name={s.id} size={13} />
                    <strong>{s.name}</strong>
                    <span className="lead-roster-text">{s.text}</span>
                  </li>
                ))}
              </ul>
            </section>
            <LeadWorkspaceColumn />
          </div>
          <LeadToolRenderers />
          <SqlReviewGate />
        </main>
      </DatabotSessionProvider>
    </CopilotChatConfigurationProvider>
  );
}
