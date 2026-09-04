"use client";

import { useState } from "react";
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

function formatStage(
  stage: PlanStage | undefined,
  steps: PlanStepView[],
): { label: string; tone: string } {
  // A nested specialist writes its own ``stage`` (sql, fetch, gate_cards, …)
  // onto the same state field. Those values are not plan stages. While a
  // step is in progress the plan is executing, whatever the leaked value is.
  const inProgress = steps.some((step) => step.status === "in_progress");
  if (inProgress) return { label: "Executing", tone: "plan-stage--execute" };
  if (stage === "adjust") return { label: "Reviewing", tone: "plan-stage--adjust" };
  const allCompleted =
    steps.length > 0 && steps.every((step) => step.status === "completed");
  if (stage === "done" || allCompleted) return { label: "Done", tone: "plan-stage--done" };
  if (stage === "create") return { label: "Creating plan", tone: "plan-stage--create" };
  if (
    stage === "execute" ||
    steps.some((step) => step.status === "completed" || step.status === "blocked")
  ) {
    return { label: "Executing", tone: "plan-stage--execute" };
  }
  if (steps.length > 0 && stage && stage !== "create") {
    return { label: "Executing", tone: "plan-stage--execute" };
  }
  return { label: "Idle", tone: "plan-stage--idle" };
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

/**
 * How many *earlier* steps are owned by the same agent as ``step``.
 *
 * The pairing has to count *steps* (not results) for the same owner — the
 * previous implementation counted earlier results, which is always zero
 * because the first owner-tagged result is by definition the earliest one.
 * Every step of an owner therefore showed that owner's first output.
 */
function ownerStepOffset(step: PlanStepView, steps: PlanStepView[]): number {
  const owner = ownerFromStep(step.text);
  if (!owner) return 0;
  return steps.filter(
    (s) => s.index < step.index && ownerFromStep(s.text) === owner,
  ).length;
}

function ownerResultsFor(
  step: PlanStepView,
  results: PlanStepResult[] | undefined,
): PlanStepResult[] {
  const owner = ownerFromStep(step.text);
  if (!owner) return [];
  return (results ?? []).filter((r) => r.agent === owner);
}

/**
 * Match a plan step with the specialist output that produced it.
 *
 * The plan agent reuses the same owner for related steps, so we associate by
 * order: the i-th owner-tagged result maps to the i-th step mentioning the
 * same owner. This is a v1 heuristic; once the agent emits explicit
 * step ↔ result linkage we can switch.
 */
function stepResultFor(
  step: PlanStepView,
  steps: PlanStepView[],
  results: PlanStepResult[] | undefined,
): PlanStepResult | null {
  if (!results?.length) return null;
  const ownerResults = ownerResultsFor(step, results);
  if (!ownerResults.length) return null;
  const offset = ownerStepOffset(step, steps);
  // Fall back to the last result for that owner so a step still shows
  // whatever its owner produced.
  return ownerResults[offset] ?? ownerResults[ownerResults.length - 1];
}

/**
 * Strict pairing: does this step have a specialist output of its own?
 *
 * Unlike :func:`stepResultFor` this never falls back, so it can be used to
 * decide whether a step actually ran.
 */
function hasOwnResult(
  step: PlanStepView,
  steps: PlanStepView[],
  results: PlanStepResult[] | undefined,
): boolean {
  if (!results?.length) return false;
  const ownerResults = ownerResultsFor(step, results);
  if (!ownerResults.length) return false;
  return ownerStepOffset(step, steps) < ownerResults.length;
}

/**
 * Effective status of a step.
 *
 * The backend owns the step statuses — ``plan_snapshot`` mirrors the plan.
 * But the mirror can lag the execution: a step whose specialist already
 * returned may still read "not started" while the plan turn is still
 * running. When that happens and we hold a specialist output for the step,
 * report it as completed so the tree never shows a finished step as
 * pending.
 */
function effectiveStatus(
  step: PlanStepView,
  steps: PlanStepView[],
  results: PlanStepResult[] | undefined,
): StepStatus {
  if (step.status !== "not_started") return step.status;
  return hasOwnResult(step, steps, results) ? "completed" : step.status;
}

export function PlanTaskTree() {
  const { agent, isReady } = useAgent({ agentId: "plan" });
  const rawState = isReady ? (agent as unknown as { state: unknown }).state : undefined;
  const ps = (rawState as PlanAgentState | undefined) ?? undefined;
  const snapshot: PlanSnapshot | null | undefined = ps?.plan_snapshot;
  const stage = ps?.stage;
  const subagentRounds = ps?.subagent_rounds ?? 0;

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

  // Effective statuses: the backend mirror is authoritative, with a
  // fallback for steps whose specialist already returned but whose mirror
  // has not caught up yet.
  const effectiveSteps: PlanStepView[] = snapshot.steps.map((step) => ({
    ...step,
    status: effectiveStatus(step, snapshot.steps, ps?.step_results),
  }));

  const progress = {
    total: effectiveSteps.length,
    completed: effectiveSteps.filter((s) => s.status === "completed").length,
    in_progress: effectiveSteps.filter((s) => s.status === "in_progress").length,
    blocked: effectiveSteps.filter((s) => s.status === "blocked").length,
    not_started: effectiveSteps.filter((s) => s.status === "not_started").length,
  };
  const pct =
    progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
  const stageMeta = formatStage(stage, effectiveSteps);

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
        {effectiveSteps.map((step) => {
          const meta = STATUS_META[step.status];
          const owner = ownerFromStep(step.text);
          const text = stepTextWithoutOwner(step.text);
          const result = stepResultFor(step, snapshot.steps, ps?.step_results);
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
