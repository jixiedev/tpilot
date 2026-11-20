"use client";

import { useState } from "react";
import { useAgent } from "@copilotkit/react-core/v2";
import { ExecutionChart } from "../ExecutionChart";
import {
  LEAD_AGENT_ID,
  agentLabel,
  asExecutionResult,
  leadStateOf,
  warehouseViewOf,
  type PlanStep,
  type WarehouseView,
  type WorkRecordEntry,
} from "../leadState";
import { StatusPill } from "./StatusPill";
import { AgentIcon, CheckIcon, HistoryIcon, PlanIcon, SparkleIcon } from "../icons";

/**
 * Right column of the lead page: what the lead is doing, not what it said.
 * - Plan: this turn's steps (only when the lead planned).
 * - Specialist: the latest specialist run; for warehouse, its tables, the SQL
 *   under review or approved, and the result.
 * - Work record: every delegation in this conversation.
 */
export function LeadWorkspace() {
  const { agent, isReady } = useAgent({ agentId: LEAD_AGENT_ID });
  const state = leadStateOf(isReady ? agent.state : undefined);
  const running = isReady && agent.isRunning;
  const plan = state.plan ?? [];
  const record = state.work_record ?? [];
  const active = state.active_subagent ?? null;
  const warehouse = warehouseViewOf(state);
  // A specialist that is still working has no view yet; its pending
  // `delegate` call names it.
  const working = running ? pendingDelegateAgent(isReady ? agent.messages : []) : undefined;
  const shownName = working ?? active?.name;
  // `paused` comes from the last snapshot; once the user answers and the run
  // resumes it is stale until the next one.
  const paused = Boolean(active?.paused) && !running;

  return (
    <aside className="lead-workspace" data-testid="lead-workspace" aria-label="Lead workspace">
      <PlanPanel plan={plan} running={running} />
      <SpecialistPanel
        name={shownName}
        paused={paused}
        warehouse={shownName === active?.name ? warehouse : undefined}
        running={Boolean(working)}
      />
      <WorkRecordPanel record={record} />
    </aside>
  );
}

/** Specialist named by the latest `delegate` call that has no result yet. */
function pendingDelegateAgent(messages: unknown[]): string | undefined {
  const answered = new Set<string>();
  for (const m of messages as Array<{ role?: string; toolCallId?: string }>) {
    if (m.role === "tool" && m.toolCallId) answered.add(m.toolCallId);
  }
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i] as {
      role?: string;
      toolCalls?: Array<{ id: string; function?: { name?: string; arguments?: string } }>;
    };
    if (m.role !== "assistant" || !m.toolCalls?.length) continue;
    for (const call of m.toolCalls) {
      if (call.function?.name !== "delegate" || answered.has(call.id)) continue;
      try {
        const args = JSON.parse(call.function.arguments || "{}") as { agent?: string };
        if (args.agent) return args.agent;
      } catch {
        /* arguments still streaming */
      }
    }
  }
  return undefined;
}

function Panel({
  title,
  icon,
  aside,
  children,
  testId,
}: {
  title: string;
  icon?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
  testId?: string;
}) {
  return (
    <section className="lead-panel" data-testid={testId}>
      <header className="lead-panel-head">
        <h2>
          {icon ? <span className="lead-panel-icon">{icon}</span> : null}
          {title}
        </h2>
        {aside}
      </header>
      <div className="lead-panel-body">{children}</div>
    </section>
  );
}

function PlanPanel({ plan, running }: { plan: PlanStep[]; running: boolean }) {
  const done = plan.filter((s) => s.status === "done").length;
  return (
    <Panel
      title="Plan"
      icon={<PlanIcon size={14} />}
      testId="lead-plan"
      aside={plan.length ? <span className="lead-panel-meta">{done}/{plan.length} done</span> : null}
    >
      {plan.length === 0 ? (
        <p className="lead-empty">
          {running
            ? "No plan for this request — the lead plans only when it needs several steps."
            : "Multi-step requests get a plan here. Simple questions are answered or delegated directly."}
        </p>
      ) : (
        <ol className="lead-plan">
          {plan.map((step, i) => (
            <li key={`${i}-${step.text}`} className={`lead-plan-step lead-plan-step--${step.status}`}>
              <span className="lead-plan-index" aria-hidden="true">
                {step.status === "done" ? <CheckIcon size={12} strokeWidth={2.6} /> : i + 1}
              </span>
              <div className="lead-plan-text">
                <span>{step.text}</span>
                <span className="lead-plan-meta">
                  {step.agent ? agentLabel(step.agent) : "Lead"}
                  {step.added ? " · added" : ""}
                </span>
              </div>
              <StatusPill status={step.status} />
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}

type WarehouseTab = "results" | "sql" | "tables";

function SpecialistPanel({
  name,
  paused,
  warehouse,
  running,
}: {
  name?: string;
  paused: boolean;
  warehouse?: WarehouseView;
  running: boolean;
}) {
  const [tab, setTab] = useState<WarehouseTab>("results");
  const status = paused ? "paused" : running && name ? "running" : name ? "done" : "";
  const working = running && !paused;

  if (!name) {
    return (
      <Panel title="Specialist" icon={<SparkleIcon size={14} />} testId="lead-specialist">
        <p className="lead-empty">
          When the lead hands work to a specialist, its live work shows here. Data questions go
          to <strong>Warehouse</strong>, which asks you to review every query before it runs.
        </p>
      </Panel>
    );
  }

  const review = warehouse?.sql_review;
  const execution = warehouse?.execution;
  const tables = warehouse?.tables ?? [];
  const candidates = warehouse?.candidates ?? [];
  const result = asExecutionResult(execution);
  const effectiveTab: WarehouseTab =
    tab === "results" && !execution ? (review ? "sql" : "tables") : tab;

  return (
    <Panel
      title={agentLabel(name)}
      icon={<AgentIcon name={name} size={14} />}
      testId="lead-specialist"
      aside={status ? <StatusPill status={status} /> : null}
    >
      {!warehouse ? (
        <p className="lead-empty">
          {working
            ? `${agentLabel(name)} is working — its steps stream into the chat.`
            : `${agentLabel(name)} reports back in the chat.`}
        </p>
      ) : (
        <>
          <div className="lead-tabs" role="tablist">
            {(["results", "sql", "tables"] as WarehouseTab[]).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={effectiveTab === t}
                className={"lead-tab" + (effectiveTab === t ? " is-active" : "")}
                onClick={() => setTab(t)}
              >
                {t === "results"
                  ? `Results${execution?.row_count != null ? ` (${execution.row_count})` : ""}`
                  : t === "sql"
                    ? "SQL"
                    : `Tables (${tables.length})`}
              </button>
            ))}
          </div>
          {effectiveTab === "results" ? (
            execution ? (
              <div className="lead-results">
                <ExecutionChart result={result} />
                {execution.truncated ? (
                  <p className="lead-note">Result truncated at {execution.row_count} rows.</p>
                ) : null}
              </div>
            ) : (
              <p className="lead-empty">No query has run yet.</p>
            )
          ) : null}
          {effectiveTab === "sql" ? (
            review || execution?.sql ? (
              <div className="lead-sql">
                {review?.status ? (
                  <p className="lead-sql-status">
                    <StatusPill status={reviewPill(review.status, paused)} />
                    {review.edited ? <span className="lead-note"> edited by the reviewer</span> : null}
                  </p>
                ) : paused ? (
                  <p className="lead-sql-status">
                    <StatusPill status="paused" /> <span className="lead-note">review the SQL in the chat</span>
                  </p>
                ) : null}
                <pre className="lead-code">{execution?.sql || review?.sql}</pre>
                {review?.explanation ? <p className="lead-note">{review.explanation}</p> : null}
                {review?.comments ? <p className="lead-note">Reviewer: {review.comments}</p> : null}
              </div>
            ) : (
              <p className="lead-empty">
                {paused ? "Review the SQL in the chat." : "No SQL drafted yet."}
              </p>
            )
          ) : null}
          {effectiveTab === "tables" ? (
            <>
              {tables.length ? (
                <ul className="lead-tables">
                  {tables.map((t) => (
                    <li key={t.name}>
                      <code>{t.name}</code>
                      {t.description ? <p>{t.description}</p> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="lead-empty">
                  {paused
                    ? "A query is waiting for your review — its tables are listed on the card in the chat."
                    : review || execution
                      ? "The SQL reads no named table."
                      : "No SQL yet — tables appear once a query is drafted."}
                </p>
              )}
              {candidates.length ? <CandidateList names={candidates} /> : null}
            </>
          ) : null}
        </>
      )}
    </Panel>
  );
}

function CandidateList({ names }: { names: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lead-candidates">
      <button
        type="button"
        className="fold-section-header"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="fold-chevron" aria-hidden="true" />
        <span>Also found by search, not used ({names.length})</span>
      </button>
      {open ? (
        <ul className="lead-chip-row">
          {names.map((name) => (
            <li key={name} className="lead-chip lead-chip--table">
              {name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function reviewPill(status: string, paused: boolean): string {
  if (status === "approved") return "done";
  if (status === "stopped") return "halted";
  if (status === "revise") return paused ? "paused" : "pending";
  return status;
}

function WorkRecordPanel({ record }: { record: WorkRecordEntry[] }) {
  const items = [...record].reverse();
  return (
    <Panel
      title="Work record"
      icon={<HistoryIcon size={14} />}
      testId="lead-work-record"
      aside={record.length ? <span className="lead-panel-meta">{record.length}</span> : null}
    >
      {items.length === 0 ? (
        <p className="lead-empty">Specialist results in this conversation are listed here, newest first.</p>
      ) : (
        <ol className="lead-record">
          {items.map((entry, i) => (
            <WorkRecordItem key={`${record.length - i}`} entry={entry} />
          ))}
        </ol>
      )}
    </Panel>
  );
}

function WorkRecordItem({ entry }: { entry: WorkRecordEntry }) {
  const [open, setOpen] = useState(false);
  const sql = typeof entry.artifacts?.sql === "string" ? entry.artifacts.sql : "";
  return (
    <li className="lead-record-item">
      <button
        type="button"
        className="lead-record-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="fold-chevron" aria-hidden="true" />
        <span className="lead-record-agent">
          <AgentIcon name={entry.agent} size={13} />
          {agentLabel(entry.agent)}
        </span>
        <span className="lead-record-task">{entry.task}</span>
        <StatusPill status={String(entry.status)} />
      </button>
      {open ? (
        <div className="lead-record-body">
          {entry.turn ? (
            <p className="lead-note">
              Turn {entry.turn}
              {entry.step ? ` · step ${entry.step}` : ""}
            </p>
          ) : null}
          {entry.summary ? <p className="lead-record-summary">{entry.summary}</p> : null}
          {sql ? <pre className="lead-code">{sql}</pre> : null}
        </div>
      ) : null}
    </li>
  );
}
