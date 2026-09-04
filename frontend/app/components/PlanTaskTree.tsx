"use client";

import { useMemo, useState } from "react";
import { useAgent } from "@copilotkit/react-core/v2";
import type {
  PlanAgentState,
  PlanSnapshot,
  PlanStage,
  PlanStepResult,
  PlanStepView,
  StepStatus,
} from "./planTypes";

// ---------------------------------------------------------------------------
// PlanTaskTree
// ---------------------------------------------------------------------------
// Right-hand panel that visualizes the plan agent's working state.
//
//   1. Header  — plan title, stage pill, progress bar
//   2. Steps   — each step with status icon, owner chip, expandable notes
//   3. Empty   — shown until the agent's first ``create_plan`` call lands
//
// Data source: ``agent.plan_snapshot`` (JSON-mirrored from
// ``tools.plan.Plan`` by ``agent/plan/stage_tools.py`` after every modify)
// and ``agent.step_results`` (per-subagent round output from
// ``agent/plan/stage_tools.invoke_agent``). Both are streamed via the AG-UI
// ``STATE_SNAPSHOT`` channel — the component re-renders on each delta.
// ---------------------------------------------------------------------------

const STATUS_META: Record<
  StepStatus,
  { symbol: string; label: string; tone: string }
> = {
  not_started: { symbol: "○", label: "Pending", tone: "plan-step--pending" },
  in_progress: { symbol: "◐", label: "In progress", tone: "plan-step--active" },
  completed: { symbol: "●", label: "Completed", tone: "plan-step--done" },
  blocked: { symbol: "✕", label: "Blocked", tone: "plan-step--blocked" },
};

function formatStage(stage: PlanStage | undefined): { label: string; tone: string } {
  switch (stage) {
    case "create":
      return { label: "Creating plan", tone: "plan-stage--create" };
    case "execute":
      return { label: "Executing", tone: "plan-stage--execute" };
    case "adjust":
      return { label: "Reviewing", tone: "plan-stage--adjust" };
    case "done":
      return { label: "Done", tone: "plan-stage--done" };
    default:
      return { label: "Idle", tone: "plan-stage--idle" };
  }
}

function ownerFromStep(text: string): string | null {
  // Steps follow the ``[agent_name] ...`` convention; surface the chip
  // so the user can see which specialist will run this step.
  const m = text.match(/^\[([a-z_]+)\]\s*/i);
  return m ? m[1].toLowerCase() : null;
}

function stepTextWithoutOwner(text: string): string {
  return text.replace(/^\[[a-z_]+\]\s*/i, "").trim();
}

function stepResultFor(
  step: PlanStepView,
  results: PlanStepResult[] | undefined,
): PlanStepResult | null {
  if (!results || !results.length) return null;
  const owner = ownerFromStep(step.text);
  if (!owner) return null;
  // Match the latest completed invocation of the step's owner. The plan
  // agent reuses the same owner for related steps, so we associate by
  // the order: the i-th owner-tagged result maps to the i-th step
  // mentioning the same owner. This is a v1 heuristic; once the agent
  // emits explicit step ↔ result linkage we can switch.
  const ownerResults = results.filter((r) => r.agent === owner);
  if (!ownerResults.length) return null;
  // Count earlier steps with the same owner; pair by index.
  const earlier = (results || [])
    .slice(0, results.indexOf(ownerResults[0]))
    .filter((r) => r.agent === owner).length;
  // Fall back to last result for that owner.
  return ownerResults[earlier] ?? ownerResults[ownerResults.length - 1];
}

export function PlanTaskTree() {
  const { agent, isReady } = useAgent({ agentId: "plan" });
  const rawState = isReady ? (agent as unknown as { state: unknown }).state : undefined;
  const ps = (rawState as PlanAgentState | undefined) ?? undefined;
  const snapshot: PlanSnapshot | null | undefined = ps?.plan_snapshot;
  const stage = ps?.stage;
  const subagentRounds = ps?.subagent_rounds ?? 0;

  const stageMeta = useMemo(() => formatStage(stage), [stage]);
  const [openNotes, setOpenNotes] = useState<Set<number>>(new Set());

  const toggleNote = (index: number) => {
    setOpenNotes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (!snapshot) {
    return (
      <div className="plan-tree plan-tree--empty" data-testid="plan-tree-empty">
        <div className="plan-tree-empty-icon" aria-hidden="true">
          ◇
        </div>
        <h2>No plan yet</h2>
        <p>
          Ask the Plan agent to break a task into steps. The first
          response will sketch a plan and start delegating to specialists.
        </p>
        <p className="plan-tree-empty-hint">
          Example: &ldquo;Compare weekly GMV across US and EU for the
          last 8 weeks and write a summary.&rdquo;
        </p>
      </div>
    );
  }

  const progress = snapshot.progress;
  const pct =
    progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <div className="plan-tree" data-testid="plan-tree">
      <header className="plan-tree-header">
        <div className="plan-tree-title-row">
          <h2 className="plan-tree-title">{snapshot.title}</h2>
          <span
            className={`plan-stage-pill ${stageMeta.tone}`}
            data-testid="plan-stage-pill"
          >
            {stageMeta.label}
          </span>
        </div>
        <div className="plan-tree-progress">
          <div className="plan-tree-progress-bar" aria-hidden="true">
            <div
              className="plan-tree-progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="plan-tree-progress-meta">
            <span>
              {progress.completed} / {progress.total} steps
            </span>
            <span className="plan-tree-progress-pct">{pct}%</span>
          </div>
        </div>
        <div className="plan-tree-summary">
          {progress.in_progress > 0 && (
            <span className="plan-tree-summary-chip plan-tree-summary-chip--active">
              ◐ {progress.in_progress} in progress
            </span>
          )}
          {progress.blocked > 0 && (
            <span className="plan-tree-summary-chip plan-tree-summary-chip--blocked">
              ✕ {progress.blocked} blocked
            </span>
          )}
          {progress.not_started > 0 && (
            <span className="plan-tree-summary-chip plan-tree-summary-chip--pending">
              ○ {progress.not_started} pending
            </span>
          )}
          {subagentRounds > 0 && (
            <span className="plan-tree-summary-chip plan-tree-summary-chip--rounds">
              {subagentRounds} round{subagentRounds === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </header>

      <ol className="plan-step-list" data-testid="plan-step-list">
        {snapshot.steps.map((step) => {
          const meta = STATUS_META[step.status];
          const owner = ownerFromStep(step.text);
          const text = stepTextWithoutOwner(step.text);
          const result = stepResultFor(step, ps?.step_results);
          const hasNotes = step.notes.trim().length > 0 || !!result;
          const isOpen = openNotes.has(step.index);
          return (
            <li
              key={step.index}
              className={`plan-step ${meta.tone}`}
              data-testid={`plan-step-${step.index}`}
              data-status={step.status}
            >
              <div className="plan-step-row">
                <span className="plan-step-icon" aria-hidden="true">
                  {meta.symbol}
                </span>
                <span className="plan-step-index">{step.index + 1}.</span>
                <span className="plan-step-text">{text}</span>
                {owner && (
                  <span
                    className={`plan-step-owner plan-step-owner--${owner}`}
                    title={`Delegated to ${owner}`}
                  >
                    {owner}
                  </span>
                )}
                {hasNotes && (
                  <button
                    type="button"
                    className="plan-step-toggle"
                    onClick={() => toggleNote(step.index)}
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen ? "Hide step details" : "Show step details"
                    }
                  >
                    {isOpen ? "▾" : "▸"}
                  </button>
                )}
              </div>
              {isOpen && hasNotes && (
                <div className="plan-step-detail">
                  {step.notes && (
                    <div className="plan-step-notes">
                      <span className="plan-step-detail-label">Notes</span>
                      <p>{step.notes}</p>
                    </div>
                  )}
                  {result && (
                    <div className="plan-step-result">
                      <span className="plan-step-detail-label">
                        {result.agent} output
                      </span>
                      <pre>{truncate(result.output, 1200)}</pre>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function truncate(text: string, max: number): string {
  const t = (text || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trimEnd() + "…";
}
