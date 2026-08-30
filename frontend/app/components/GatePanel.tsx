"use client";

import { useState } from "react";
import { useInterrupt } from "@copilotkit/react-core/v2";
import type { GateDecision } from "./types";

// ---------------------------------------------------------------------------
// GatePanel
// ---------------------------------------------------------------------------
// Renders the human gates that the LangGraph graph pauses at. The graph
// emits AG-UI v2 standard interrupts via the ``RUN_FINISHED`` event
// (the AG-UI server wraps the LangGraph ``interrupt(...)`` payload in
// an ``outcome.type === "interrupt"`` envelope — see
// ``agui_server.py`` for the flags that make this happen). We mount
// the gate UI off the chat via ``useInterrupt({ renderInChat: false })``
// so it stays in the existing right-column slot; the hook gives us a
// live element whenever the graph is paused and a ``resolve(payload)``
// callback that round-trips a ``ResumeEntry`` back to the AG-UI
// endpoint, which the LangGraph server then turns into a graph
// ``Command(resume=...)`` to unblock the graph.
//
// We parse the ``message`` field of each interrupt as a JSON payload
// matching the contract in ``agent/react/databot/gates.py``:
//   {
//     "question": "...", "options": [{"id": "approve", ...}, ...],
//     "default": "approve|deny-comments|deny-halt|dryrun|skip|chart",
//     "gate":    "cards" | "sql" | "chart",
//   }
// ---------------------------------------------------------------------------

interface GateInterruptValue {
  question: string;
  options: { id: string; label: string; reason: string }[];
  default: string;
  gate: "cards" | "sql" | "chart";
  // Only populated for the cards gate; lets the UI list each
  // selected dbt model alongside the decision buttons so the
  // human can sanity-check the LLM's pick.
  selected_cards?: {
    name: string;
    catalog?: string;
    schema?: string;
    description?: string;
  }[];
}

const GATE_OPTIONS: GateDecision[] = [
  "approve",
  "deny-comments",
  "deny-halt",
  "dryrun",
];

function parseInterruptMessage(message: unknown): GateInterruptValue | null {
  if (typeof message !== "string" || !message) return null;
  // Databot stores the rich payload as a JSON string in `message`.
  try {
    const parsed = JSON.parse(message);
    if (
      parsed &&
      typeof parsed === "object" &&
      "question" in parsed &&
      "options" in parsed &&
      "default" in parsed
    ) {
      return parsed as GateInterruptValue;
    }
  } catch {
    return null;
  }
  return null;
}

export function GatePanel() {
  // ``renderInChat: false`` keeps the gate UI in this right-column
  // slot (matches the v1 layout) while still using the v2 AG-UI
  // standard interrupt protocol underneath. The hook returns the
  // element to mount, or ``null`` when no interrupt is pending.
  const element = useInterrupt({
    agentId: "databot",
    renderInChat: false,
    render: ({ interrupt, resolve, cancel }) => {
      if (!interrupt) return <></>;
      const value = parseInterruptMessage(interrupt.message);
      if (!value) return <></>;
      if (value.gate === "chart") {
        return (
          <ChartGate
            value={value}
            onApprove={() => resolve({ decision: "approve" })}
            onSkip={() => resolve("dryrun")}
            onCancel={() => cancel()}
          />
        );
      }
      return (
        <HumanGate
          value={value}
          onChoose={(decision, comments) => {
            const payload =
              comments.trim().length > 0
                ? { decision, comments: comments.trim() }
                : decision;
            resolve(payload);
          }}
        />
      );
    },
  });

  return element;
}

const DECISION_LABEL: Record<GateDecision, string> = {
  approve: "Approve",
  "deny-comments": "Request changes",
  "deny-halt": "Halt",
  dryrun: "Dry-run (preview)",
};

const DECISION_HINT: Record<GateDecision, string> = {
  approve: "Lock in this selection / SQL and continue.",
  "deny-comments": "Loop back to the LLM with your comment below.",
  "deny-halt": "Stop the turn with no side effects.",
  dryrun: "Continue without writing anything to the profile sidecar.",
};

function HumanGate({
  value,
  onChoose,
}: {
  value: GateInterruptValue;
  onChoose: (decision: GateDecision, comments: string) => void;
}) {
  const [comments, setComments] = useState("");
  const [hoveredDecision, setHoveredDecision] = useState<GateDecision | null>(null);
  const defaultDecision = (value.default as GateDecision) || "dryrun";

  return (
    <div className="gate-panel" data-testid={`gate-${value.gate}`}>
      <header className="gate-header">
        <span className={`tag tag-gate tag-gate-${value.gate}`}>{value.gate} gate</span>
        <h3 className="gate-question">{value.question}</h3>
      </header>

      {value.gate === "cards" &&
        value.selected_cards !== undefined &&
        value.selected_cards.length > 0 && (
          <section className="gate-card-list" data-testid="gate-selected-cards">
            <h4 className="gate-card-list-title">
              {value.selected_cards.length} selected dbt model
              {value.selected_cards.length === 1 ? "" : "s"}
            </h4>
            <ul>
              {value.selected_cards.map((c, i) => (
                <li key={`${c.name}-${i}`} className="gate-card-row">
                  <code className="gate-card-name">{c.name}</code>
                  {(c.catalog || c.schema) && (
                    <span className="gate-card-fqn agent-debug-mono">
                      {c.catalog || ""}
                      {c.catalog && c.schema ? "." : ""}
                      {c.schema || ""}
                    </span>
                  )}
                  {c.description && (
                    <p className="gate-card-desc">{c.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

      <div className="gate-options">
        {(Object.keys(DECISION_LABEL) as GateDecision[]).map((decision) => {
          const meta = value.options.find((o) => o.id === decision);
          const reason = meta?.reason?.trim();
          return (
            <button
              key={decision}
              type="button"
              className={`gate-option ${decision === defaultDecision ? "is-default" : ""}`}
              onMouseEnter={() => setHoveredDecision(decision)}
              onMouseLeave={() => setHoveredDecision(null)}
              onClick={() => onChoose(decision, comments)}
            >
              <span className="gate-option-label">{DECISION_LABEL[decision]}</span>
              {decision === defaultDecision && (
                <span className="gate-default-badge">default</span>
              )}
              <span className="gate-option-hint">{DECISION_HINT[decision]}</span>
              <span className="gate-option-reason">
                {hoveredDecision === decision && reason
                  ? `LLM: ${reason}`
                  : reason
                  ? `hover for LLM's reason`
                  : ""}
              </span>
            </button>
          );
        })}
      </div>

      <label className="gate-comments-label">
        Comments (sent with deny-comments; ignored otherwise)
        <textarea
          className="gate-comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={2}
          placeholder={
            value.gate === "cards"
              ? "e.g. 'drop orders_daily, use fct_transaction_variations instead'"
              : "e.g. 'add is_ltd_product=false filter; use dt not transaction_time'"
          }
        />
      </label>
    </div>
  );
}

function ChartGate({
  value,
  onApprove,
  onSkip,
  onCancel,
}: {
  value: GateInterruptValue;
  onApprove: () => void;
  onSkip: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="gate-panel" data-testid="gate-chart">
      <header className="gate-header">
        <span className="tag tag-gate tag-gate-chart">chart</span>
        <h3 className="gate-question">{value.question}</h3>
      </header>
      <div className="gate-options">
        <button
          type="button"
          className="gate-option"
          onClick={onSkip}
        >
          <span className="gate-option-label">No, end the turn</span>
          <span className="gate-option-hint">Results are enough.</span>
        </button>
        <button
          type="button"
          className="gate-option"
          onClick={onApprove}
        >
          <span className="gate-option-label">Yes, generate a chart</span>
          <span className="gate-option-hint">
            Visualization helps (Superset emit is TODO).
          </span>
        </button>
      </div>
      <button type="button" className="btn btn-ghost gate-cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
