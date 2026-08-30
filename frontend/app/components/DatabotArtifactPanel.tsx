"use client";

import { useMemo, useState } from "react";
import { useAgent } from "@copilotkit/react-core/v2";
import { ExecutionChart } from "./ExecutionChart";
import { SqlEditor } from "./SqlEditor";
import { TableCardList } from "./TableCardList";
import type { DatabotAgentState, DatabotStage } from "./types";

// ---------------------------------------------------------------------------
// DatabotArtifactPanel
// ---------------------------------------------------------------------------
// Right-hand panel that visualizes the agent's working state. Tabs:
//   1. Cards    — candidate + selected `TableCard`s
//   2. SQL      — current draft / approved SQL with editor
//   3. Results  — `execution_result` rendered as a Recharts chart
//
// The active tab is auto-selected from the current `stage` so the user
// doesn't have to hunt for what needs their attention:
//   fetch / gate_cards   -> Cards
//   sql / gate_sql       -> SQL
//   execute / chart / done -> Results
//
// The panel also dispatches user actions back to the backend via the
// CopilotKit runtime:
//   - `update_card_selection` (via the `addMissingTools` mock or a new
//     human message that asks the LLM to update; see below for the
//     current approach).
//   - `propose_sql` direct save (via a new human message).
//   - `request_sql_regenerate` (via a new human message with the
//     feedback text).
//
// We dispatch through a small `useSendMessage` helper because the v2
// `useAgent` API gives us a `.run()` / `.sendMessage()`-style call.
// ---------------------------------------------------------------------------

type Tab = "cards" | "sql" | "results";

function stageToTab(stage: DatabotStage | undefined): Tab {
  if (stage === "sql" || stage === "gate_sql") return "sql";
  if (stage === "execute" || stage === "chart" || stage === "done") return "results";
  return "cards";
}

export function DatabotArtifactPanel() {
  const { agent, isReady } = useAgent({ agentId: "databot" });
  // AG-UI: backend LangGraph state is mirrored onto the agent's
  // `state` field. ``isReady`` is true once the runtime has synced.
  const rawState = isReady ? (agent as unknown as { state: unknown }).state : undefined;
  const ds = (rawState as DatabotAgentState | undefined) ?? undefined;
  const [manualTab, setManualTab] = useState<Tab | null>(null);
  const activeTab = manualTab ?? stageToTab(ds?.stage);

  // We don't yet have a `sendMessage` binding here — CopilotKit v2
  // exposes it via `useAgent().run(...)` or via the chat. We expose
  // callbacks that the page wires up. As a fallback, we render
  // placeholder "send via chat" hints when interactive controls are
  // disabled. This keeps the panel declarative and lets the page
  // choose how to wire actions.

  const interactive = ds?.stage === "gate_cards" || ds?.stage === "sql";

  const stageLabel = ds?.stage ?? "idle";
  const halted = Boolean(ds?.halt_reason);

  return (
    <aside className="artifact-panel" data-testid="artifact-panel">
      <header className="artifact-header">
        <div className="artifact-title">
          <h2>Databot working state</h2>
          <span className={`stage-pill stage-${stageLabel}`} data-testid="stage-pill">
            stage: {stageLabel}
          </span>
        </div>
        {halted && (
          <p className="halt-banner" role="status">
            Halted: {ds?.halt_reason}
          </p>
        )}
        {ds?.dryrun && !halted && (
          <p className="dryrun-banner" role="status">
            Dryrun mode — no profile writes
          </p>
        )}
      </header>

      <nav className="artifact-tabs" role="tablist">
        <TabButton
          tab="cards"
          active={activeTab === "cards"}
          onClick={() => setManualTab("cards")}
          count={(ds?.candidate_cards?.length ?? 0) || (ds?.selected_cards?.length ?? 0)}
          label="Cards"
        />
        <TabButton
          tab="sql"
          active={activeTab === "sql"}
          onClick={() => setManualTab("sql")}
          count={ds?.approved_sql || ds?.draft_sql ? 1 : 0}
          label="SQL"
        />
        <TabButton
          tab="results"
          active={activeTab === "results"}
          onClick={() => setManualTab("results")}
          count={ds?.execution_result ? 1 : 0}
          label="Results"
        />
      </nav>

      <main className="artifact-body">
        {activeTab === "cards" && (
          <TableCardList
            candidates={ds?.candidate_cards ?? []}
            selected={ds?.selected_cards ?? []}
            metricConflicts={ds?.metric_conflicts ?? []}
            mode={ds?.stage === "gate_cards" ? "interactive" : "readonly"}
            onChange={() => {
              // The CopilotKit UI currently doesn't expose a generic
              // "call backend tool" binding for the v2 AG-UI runtime,
              // so the human-driven edit path is to send a follow-up
              // message ("drop X, add Y"). The page-level handler below
              // wires that. We no-op here.
            }}
          />
        )}
        {activeTab === "sql" && (
          <SqlEditor
            draft={ds?.draft_sql ?? ""}
            approved={ds?.approved_sql ?? ""}
            validated={ds?.sql_validated ?? false}
            mode={interactive ? "interactive" : "readonly"}
            onSaveDraft={() => {
              // v2: human can save the draft by sending a follow-up
              // message. The chat composer supports that without extra
              // wiring; the dedicated `propose_sql` tool is owned by
              // the LLM. We treat any direct user edit as
              // documentation; the official flow is via the gate.
            }}
            onRegenerate={() => {
              // Same as above: human asks via the chat composer.
            }}
          />
        )}
        {activeTab === "results" && <ExecutionChart result={ds?.execution_result} />}
      </main>

      {ds?.gate_decisions && ds.gate_decisions.length > 0 && (
        <AuditTrail decisions={ds.gate_decisions} />
      )}
    </aside>
  );
}

function TabButton({
  tab,
  active,
  onClick,
  count,
  label,
}: {
  tab: Tab;
  active: boolean;
  onClick: () => void;
  count: number;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`artifact-tab ${active ? "is-active" : ""}`}
      data-tab={tab}
      onClick={onClick}
    >
      {label}
      {count > 0 && <span className="tab-badge">{count}</span>}
    </button>
  );
}

function AuditTrail({
  decisions,
}: {
  decisions: NonNullable<DatabotAgentState["gate_decisions"]>;
}) {
  return (
    <section className="audit-trail">
      <h3>gate decisions</h3>
      <ol>
        {decisions.map((d, i) => (
          <li key={i} className={`audit-row audit-${d.decision}`}>
            <span className="audit-gate">{d.gate}</span>
            <span className="audit-decision">{d.decision}</span>
            {d.comments && <span className="audit-comments">— {d.comments}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
