"use client";

import { useState } from "react";
import { useAgent } from "@copilotkit/react-core/v2";
import { ExecutionChart } from "./ExecutionChart";
import { SqlEditor } from "./SqlEditor";
import { TableCardList } from "./TableCardList";
import { useDatabotActions } from "./useDatabotActions";
import { databotDisplayCardPool } from "./databotCardPool";
import { selectGateInterrupt } from "./databotGateUtils";
import { hasExecutionResult } from "./executionResultUtils";
import type { DatabotAgentState, DatabotStage } from "./types";

// ---------------------------------------------------------------------------
// DatabotArtifactPanel
// ---------------------------------------------------------------------------
// Right-hand panel that visualizes the agent's working state. Tabs:
//   1. Cards    — candidate + selected `TableCard`s
//   2. SQL      — current draft / approved SQL with editor
//   3. Results  — `execution_result` rendered as a Recharts chart
//
// User edits dispatch to the LangGraph checkpoint via
// ``POST /api/databot/actions`` (see ``useDatabotActions``).
//
// Two rules drive the interaction model here:
//
//  1. A control is only editable while the agent is *idle*. While the SQL
//     subgraph is running it overwrites ``draft_sql`` at the end, so any
//     human edit made in that window would be silently lost.
//  2. "The gate is open" is proven by a pending interrupt, not by the
//     agent's ``stage`` field — the SQL subgraph flips ``stage`` to
//     ``gate_sql`` before the gate actually interrupts.
// ---------------------------------------------------------------------------

type Tab = "cards" | "sql" | "results";

function stageToTab(stage: DatabotStage | undefined): Tab {
  if (stage === "sql" || stage === "gate_sql") return "sql";
  if (stage === "execute" || stage === "done") return "results";
  return "cards";
}

export function DatabotArtifactPanel() {
  const { agent, isReady } = useAgent({ agentId: "databot" });
  const rawState = isReady ? (agent as unknown as { state: unknown }).state : undefined;
  const ds = (rawState as DatabotAgentState | undefined) ?? undefined;
  const stage = ds?.stage;

  // The tab follows the agent's stage until the human picks one. Picking a
  // tab is a temporary override: the next stage change re-syncs the panel,
  // otherwise a single early click would strand the user on the wrong tab
  // (e.g. on "Results" while the SQL gate opens).
  const [manualTab, setManualTab] = useState<Tab | null>(null);
  const [lastStage, setLastStage] = useState<DatabotStage | undefined>(stage);
  if (stage !== lastStage) {
    setLastStage(stage);
    setManualTab(null);
  }
  const activeTab = manualTab ?? stageToTab(stage);

  const {
    updateCardSelection,
    saveSqlDraft,
    regenerateSql,
    isPending,
    error,
    clearError,
  } = useDatabotActions(isReady ? agent : undefined, isReady);

  const agentBusy = Boolean(agent?.isRunning);
  const pendingInterrupts = agent?.pendingInterrupts;
  const cardsGateOpen =
    Boolean(selectGateInterrupt(pendingInterrupts, "cards")) && !agentBusy;
  const sqlGateOpen =
    Boolean(selectGateInterrupt(pendingInterrupts, "sql")) && !agentBusy;

  // Editing is only safe while the agent waits for a human.
  const interactiveCards = cardsGateOpen;
  const interactiveSql = sqlGateOpen;

  const displayCards = databotDisplayCardPool(ds);

  const stageLabel = stage ?? "idle";
  const halted = Boolean(ds?.halt_reason);

  return (
    <aside className="artifact-panel" data-testid="artifact-panel">
      <header className="artifact-header">
        <div className="artifact-title">
          <h2>Working state</h2>
          <span className={`stage-pill stage-${stageLabel}`} data-testid="stage-pill">
            {stageLabel.replaceAll("_", " ")}
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
        {error && (
          <p className="action-error" role="alert">
            {error}{" "}
            <button type="button" className="btn btn-ghost" onClick={clearError}>
              dismiss
            </button>
          </p>
        )}
        {isPending && (
          <p className="action-pending" role="status">
            Saving…
          </p>
        )}
      </header>

      <nav className="artifact-tabs" role="tablist">
        <TabButton
          tab="cards"
          active={activeTab === "cards"}
          onClick={() => setManualTab("cards")}
          count={displayCards.length}
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
          count={hasExecutionResult(ds?.execution_result) ? 1 : 0}
          label="Results"
        />
      </nav>

      <main className="artifact-body">
        {activeTab === "cards" && interactiveCards && (
          <p className="artifact-gate-hint" role="status">
            Gate is open: adjust checkboxes here, then use the <strong>gate panel</strong>{" "}
            above to Approve or Request changes.
          </p>
        )}
        {activeTab === "cards" && (
          <TableCardList
            candidates={displayCards}
            selected={ds?.review_cards ?? []}
            metricConflicts={ds?.metric_conflicts ?? []}
            mode={interactiveCards ? "interactive" : "readonly"}
            disabled={isPending}
            onChange={(names) => {
              void updateCardSelection(names).catch(() => undefined);
            }}
          />
        )}
        {activeTab === "sql" && sqlGateOpen && (
          <p className="artifact-gate-hint" role="status">
            SQL gate is open: edit and <strong>Save draft</strong> here if you want to fix SQL
            yourself. To ask the agent to rewrite it, use <strong>Regenerate with feedback</strong>{" "}
            below or <strong>Request changes</strong> in the gate panel.
          </p>
        )}
        {activeTab === "sql" && agentBusy && (
          <p className="artifact-gate-hint" role="status">
            The agent is drafting the SQL — the editor opens once it asks for your review.
          </p>
        )}
        {activeTab === "sql" && (
          <SqlEditor
            draft={ds?.draft_sql ?? ""}
            approved={ds?.approved_sql ?? ""}
            validated={ds?.sql_validated ?? false}
            mode={interactiveSql ? "interactive" : "readonly"}
            disabled={isPending}
            allowRegenerate={sqlGateOpen}
            onSaveDraft={(sql) => {
              void saveSqlDraft(sql).catch(() => undefined);
            }}
            onRegenerate={(feedback) => {
              void regenerateSql(feedback).catch(() => undefined);
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
      <h3>Gate decisions</h3>
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
