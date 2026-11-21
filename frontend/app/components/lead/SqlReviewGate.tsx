"use client";

import { useEffect, useState } from "react";
import { useInterrupt } from "@copilotkit/react-core/v2";
import { LEAD_AGENT_ID, parseSqlReviewInterrupt, type SqlReviewInterrupt } from "../leadState";

/**
 * Warehouse's SQL review, rendered in the chat while the lead's run is paused.
 * The reply resumes the run: `{decision: "approve" | "revise" | "stop", sql?, comments?}`
 * (parsed by `parse_gate_resume` in `tahoepilot/agent/specialists/warehouse/tools.py`).
 */
export function SqlReviewGate() {
  useInterrupt({
    agentId: LEAD_AGENT_ID,
    render: ({ interrupt, resolve }) => {
      const value = parseSqlReviewInterrupt(interrupt?.message);
      if (!value) return <></>;
      return <SqlReviewCard key={value.sql} value={value} onResolve={resolve} />;
    },
  });
  return null;
}

type Mode = "idle" | "revise" | "stop";

function SqlReviewCard({
  value,
  onResolve,
}: {
  value: SqlReviewInterrupt;
  onResolve: (payload: unknown) => void;
}) {
  const [sql, setSql] = useState(value.sql);
  const [comments, setComments] = useState("");
  const [mode, setMode] = useState<Mode>("idle");
  const [sent, setSent] = useState(false);
  useEffect(() => setSql(value.sql), [value.sql]);

  const edited = sql.trim() !== value.sql.trim();
  const send = (payload: Record<string, unknown>) => {
    if (sent) return;
    setSent(true);
    onResolve(payload);
  };

  return (
    <section className="lead-review" data-testid="lead-sql-review" aria-label="SQL review">
      <header className="lead-review-head">
        <span className="lead-review-badge">Review</span>
        <div>
          <h3>Run this SQL against the warehouse?</h3>
          <p>Nothing runs until you approve. Edit the SQL to run your version instead.</p>
        </div>
      </header>

      {value.explanation ? <p className="lead-review-explain">{value.explanation}</p> : null}
      {value.tables && value.tables.length > 0 ? (
        <ul className="lead-chip-row" aria-label="Tables">
          {value.tables.map((table) => (
            <li key={table} className="lead-chip lead-chip--table">
              {table}
            </li>
          ))}
        </ul>
      ) : null}

      <label className="lead-review-sql">
        <span>
          SQL{edited ? <em className="lead-review-edited"> · edited</em> : null}
        </span>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          spellCheck={false}
          rows={Math.min(14, Math.max(4, sql.split("\n").length + 1))}
          disabled={sent}
        />
      </label>

      {mode !== "idle" ? (
        <label className="lead-review-comments">
          <span>{mode === "revise" ? "What should change?" : "Why stop? (optional)"}</span>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={2}
            autoFocus
            disabled={sent}
            placeholder={
              mode === "revise" ? "e.g. use the payment date, not the order date" : ""
            }
          />
        </label>
      ) : null}

      <div className="lead-review-actions">
        {mode === "idle" ? (
          <>
            <button
              type="button"
              className="lead-btn lead-btn--primary"
              disabled={sent || !sql.trim()}
              onClick={() =>
                send(edited ? { decision: "approve", sql } : { decision: "approve" })
              }
            >
              {edited ? "Approve edited SQL" : "Approve & run"}
            </button>
            <button type="button" className="lead-btn" disabled={sent} onClick={() => setMode("revise")}>
              Request changes
            </button>
            <button
              type="button"
              className="lead-btn lead-btn--ghost"
              disabled={sent}
              onClick={() => setMode("stop")}
            >
              Stop
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={mode === "stop" ? "lead-btn lead-btn--danger" : "lead-btn lead-btn--primary"}
              disabled={sent || (mode === "revise" && !comments.trim())}
              onClick={() => send({ decision: mode, comments: comments.trim() })}
            >
              {mode === "revise" ? "Send back" : "Stop the query"}
            </button>
            <button type="button" className="lead-btn lead-btn--ghost" disabled={sent} onClick={() => setMode("idle")}>
              Cancel
            </button>
          </>
        )}
        {sent ? <span className="lead-review-sent">Sent — resuming…</span> : null}
      </div>
    </section>
  );
}
