"use client";

import { useState } from "react";
import { useAgent, useInterrupt } from "@copilotkit/react-core/v2";
import type { DatabotAgentState, GateDecision, TableCard } from "./types";
import { GateCardPreview } from "./TableCardList";
import { GateHelpPopover } from "./GateHelpPopover";
import {
  parseGateInterruptMessage,
  type GateInterruptValue,
} from "./databotGateUtils";
import { stripThinkBlocks } from "./databotChatUtils";

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

const GATE_OPTIONS: GateDecision[] = [
  "approve",
  "deny-comments",
  "deny-halt",
  "dryrun",
];

export function GatePanel() {
  const { agent, isReady } = useAgent({ agentId: "databot" });
  const liveState = isReady
    ? ((agent.state as DatabotAgentState | undefined) ?? undefined)
    : undefined;

  // ``renderInChat: false`` keeps the gate UI in this right-column
  // slot (matches the v1 layout) while still using the v2 AG-UI
  // standard interrupt protocol underneath. The hook returns the
  // element to mount, or ``null`` when no interrupt is pending.
  const element = useInterrupt({
    agentId: "databot",
    renderInChat: false,
    render: ({ interrupt, resolve, cancel }) => {
      if (!interrupt) return <></>;
      const value = parseGateInterruptMessage(interrupt.message);
      if (!value) return <></>;
      if (value.gate === "chart") {
        return (
          <div className="databot-gate-dock" data-testid="databot-gate-dock">
            <ChartGate
              value={value}
              onApprove={() => resolve({ decision: "approve" })}
              onSkip={() => resolve("dryrun")}
              onCancel={() => cancel()}
            />
          </div>
        );
      }
      return (
        <div className="databot-gate-dock" data-testid="databot-gate-dock">
          <HumanGate
            value={value}
            liveSelectedCards={liveState?.review_cards}
            liveDraftSql={liveState?.draft_sql}
            liveSelectionSummary={liveState?.cards_selection_summary}
            onChoose={(decision, comments) => {
              const payload =
                comments.trim().length > 0
                  ? { decision, comments: comments.trim() }
                  : decision;
              resolve(payload);
            }}
          />
        </div>
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
  approve: "Continue the pipeline with this selection or SQL.",
  "deny-comments": "Send feedback — I'll revise models or SQL and re-run the gate.",
  "deny-halt": "Stop here; no query execution or profile writes.",
  dryrun: "Preview the rest of the flow without writing to your profile.",
};

function gateOptionCopy(raw: string | undefined, fallback: string): string {
  const text = stripThinkBlocks(raw || "");
  if (!text) return fallback;
  if (/^context:?$/i.test(text)) return fallback;
  if (/the user wants me to write/i.test(text)) return fallback;
  if (text.startsWith("- User asked") || /committed card:/i.test(text)) return fallback;
  return text;
}

const DECISION_ICON: Record<GateDecision, string> = {
  approve: "✓",
  "deny-comments": "✎",
  "deny-halt": "■",
  dryrun: "◎",
};

const GATE_TITLE: Record<"cards" | "sql" | "chart", string> = {
  cards: "Review model selection",
  sql: "Review SQL draft",
  chart: "Visualize results?",
};

function gatePresentation(
  value: GateInterruptValue,
  liveDraftSql?: string,
  liveSelectedCards?: DatabotAgentState["review_cards"],
): { title: string; subtitle: string; sql?: string } {
  const question = value.question.trim();
  if (value.gate === "sql") {
    const sql = liveDraftSql?.trim() || extractSqlBlock(question);
    const intro = question.split("```")[0].trim();
    return {
      title: GATE_TITLE.sql,
      subtitle: intro || "Databot drafted SQL for your question.",
      sql: sql || undefined,
    };
  }
  if (value.gate === "cards") {
    const cards = liveSelectedCards?.length
      ? liveSelectedCards
      : value.review_cards?.map((c) => ({
          name: String((c as { name?: string }).name ?? ""),
        }));
    const names = cards?.map((c) => c.name).filter(Boolean).join(", ") ?? "";
    return {
      title: GATE_TITLE.cards,
      subtitle: names
        ? `${cards?.length ?? 0} model(s): ${names}`
        : "Check the models Databot picked for your question.",
    };
  }
  return { title: GATE_TITLE.chart, subtitle: question };
}

function extractSqlBlock(text: string): string {
  const match = text.match(/```sql\s*([\s\S]*?)```/i);
  return match?.[1]?.trim() ?? "";
}

function HumanGate({
  value,
  liveSelectedCards,
  liveDraftSql,
  liveSelectionSummary,
  onChoose,
}: {
  value: GateInterruptValue;
  liveSelectedCards?: DatabotAgentState["review_cards"];
  liveDraftSql?: string;
  liveSelectionSummary?: string;
  onChoose: (decision: GateDecision, comments: string) => void;
}) {
  const [comments, setComments] = useState("");
  const defaultDecision = (value.default as GateDecision) || "dryrun";
  const presentation = gatePresentation(value, liveDraftSql, liveSelectedCards);
  const selectionSummary =
    value.gate === "cards"
      ? (value.selection_summary?.trim() || liveSelectionSummary?.trim() || "")
      : "";
  const reasonByOption = Object.fromEntries(
    value.options.map((o) => [o.id, o.reason?.trim() ?? ""]),
  ) as Partial<Record<GateDecision, string>>;
  const selectedCards: TableCard[] | undefined =
    value.gate === "cards" && liveSelectedCards && liveSelectedCards.length > 0
      ? liveSelectedCards
      : value.review_cards?.map((c) => {
          const card = c as {
            name?: string;
            description?: string;
            physical_tables?: string[];
            catalog?: string;
            selection_notes?: string;
          };
          return {
            name: card.name ?? "",
            description: card.description,
            physical_tables: card.physical_tables?.length
              ? card.physical_tables
              : card.catalog
                ? [card.catalog]
                : [],
            selection_notes: card.selection_notes,
          };
        });

  return (
    <div className={`gate-panel gate-panel--${value.gate}`} data-testid={`gate-${value.gate}`}>
      <header className="gate-hero">
        <div className={`gate-hero-icon gate-hero-icon--${value.gate}`} aria-hidden>
          {value.gate === "cards" ? "⬡" : value.gate === "sql" ? "{ }" : "◐"}
        </div>
        <div className="gate-hero-text">
          <div className="gate-hero-title-row">
            <span className={`tag tag-gate tag-gate-${value.gate}`}>{value.gate} gate</span>
            <GateHelpPopover gate={value.gate} />
          </div>
          <h3 className="gate-title">{presentation.title}</h3>
          <p className="gate-subtitle">{presentation.subtitle}</p>
        </div>
      </header>

      {value.gate === "sql" && presentation.sql && (
        <div className="gate-sql-block">
          <div className="gate-sql-block-label">Draft SQL</div>
          <pre className="sql-pre gate-sql-live">
            <code>{presentation.sql}</code>
          </pre>
        </div>
      )}

      {value.gate === "cards" &&
        selectedCards !== undefined &&
        selectedCards.length > 0 && (
          <section className="gate-card-list" data-testid="gate-selected-cards">
            <h4 className="gate-card-list-title">
              Selected models
              <span className="gate-card-list-badge">{selectedCards.length}</span>
            </h4>
            <ul className="gate-card-tiles">
              {selectedCards.map((c, i) => (
                <GateCardPreview key={c.staging_id ?? `${c.name}-${i}`} card={c} />
              ))}
            </ul>
          </section>
        )}

      {value.gate === "cards" && selectionSummary && (
        <section className="gate-selection-summary" data-testid="gate-selection-summary">
          <h4 className="gate-card-list-title">Selection summary</h4>
          <p className="gate-selection-summary-text">{selectionSummary}</p>
        </section>
      )}

      <div className="gate-options" role="group" aria-label="Gate decision">
        {(Object.keys(DECISION_LABEL) as GateDecision[]).map((decision) => (
          <button
            key={decision}
            type="button"
            className={`gate-option gate-option--${decision.replace(/[^a-z]/g, "")} ${decision === defaultDecision ? "is-default" : ""}`}
            onClick={() => onChoose(decision, comments)}
          >
            <span className="gate-option-icon" aria-hidden>
              {DECISION_ICON[decision]}
            </span>
            <span className="gate-option-content">
              <span className="gate-option-top">
                <span className="gate-option-label">{DECISION_LABEL[decision]}</span>
                {decision === defaultDecision && (
                  <span className="gate-default-badge">default</span>
                )}
              </span>
              <span className="gate-option-hint">
                {gateOptionCopy(reasonByOption[decision], DECISION_HINT[decision])}
              </span>
            </span>
          </button>
        ))}
      </div>

      <label className="gate-comments-label">
        <span className="gate-comments-heading">Feedback for the agent</span>
        <span className="gate-comments-note">Used when you choose Request changes</span>
        <textarea
          className="gate-comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
          placeholder={
            value.gate === "cards"
              ? "e.g. drop orders_daily, use fct_transaction_variations instead"
              : "e.g. add is_ltd_product=false filter; use dt not transaction_time"
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
    <div className="gate-panel gate-panel--chart" data-testid="gate-chart">
      <header className="gate-hero">
        <div className="gate-hero-icon gate-hero-icon--chart" aria-hidden>
          ◐
        </div>
        <div className="gate-hero-text">
          <span className="tag tag-gate tag-gate-chart">chart</span>
          <h3 className="gate-title">{GATE_TITLE.chart}</h3>
          <p className="gate-subtitle">{value.question}</p>
        </div>
      </header>
      <div className="gate-options gate-options--pair">
        <button type="button" className="gate-option gate-option--dryrun" onClick={onSkip}>
          <span className="gate-option-icon" aria-hidden>
            ◎
          </span>
          <span className="gate-option-content">
            <span className="gate-option-label">No, end the turn</span>
            <span className="gate-option-hint">Results are enough.</span>
          </span>
        </button>
        <button type="button" className="gate-option gate-option--approve" onClick={onApprove}>
          <span className="gate-option-icon" aria-hidden>
            ✓
          </span>
          <span className="gate-option-content">
            <span className="gate-option-label">Yes, generate a chart</span>
            <span className="gate-option-hint">
              Visualization helps (Superset emit is TODO).
            </span>
          </span>
        </button>
      </div>
      <button type="button" className="btn btn-ghost gate-cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
