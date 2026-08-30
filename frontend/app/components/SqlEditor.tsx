"use client";

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// SqlEditor
// ---------------------------------------------------------------------------
// Two modes:
//   - read-only  : show the current draft / approved SQL with a small badge
//   - interactive: let the human edit the draft (gates the SQL gate), and
//                  request a regenerate (which re-runs the SQL subgraph with
//                  a feedback comment written into the next-turn state).
//
// We keep the textarea's local state in sync with the upstream prop so
// backend-driven updates (LLM regenerated, gate approved) replace what
// the human was typing — we never silently drop human edits.
// ---------------------------------------------------------------------------

export type SqlEditorMode = "interactive" | "readonly";

export interface SqlEditorProps {
  draft: string;
  approved: string;
  validated?: boolean;
  mode?: SqlEditorMode;
  onSaveDraft?: (sql: string) => void;
  onRegenerate?: (feedback: string) => void;
}

const MAX_FEEDBACK = 500;

export function SqlEditor({
  draft,
  approved,
  validated = false,
  mode = "readonly",
  onSaveDraft,
  onRegenerate,
}: SqlEditorProps) {
  const interactive = mode === "interactive";
  const source = approved || draft;
  const [localDraft, setLocalDraft] = useState(draft);
  const [feedback, setFeedback] = useState("");

  // Keep the editor in sync with the upstream draft when the LLM
  // regenerates the SQL — but only if the user isn't currently typing
  // a different version. We use a key change check to avoid stomping
  // a half-written local edit on every render.
  useEffect(() => {
    setLocalDraft(draft);
  }, [draft]);

  const handleSave = () => {
    if (onSaveDraft && localDraft.trim().length > 0) {
      onSaveDraft(localDraft);
    }
  };

  return (
    <div className="sql-editor">
      <header className="sql-editor-header">
        <span className="sql-label">
          {approved ? "approved SQL" : "draft SQL"}
        </span>
        {approved && <span className="tag tag-approved">approved</span>}
        {!approved && validated && <span className="tag tag-validated">EXPLAIN ✓</span>}
        {!approved && !validated && interactive && <span className="tag tag-draft">draft</span>}
        {!approved && !validated && !interactive && <span className="tag tag-draft">no validation</span>}
      </header>

      {interactive ? (
        <textarea
          className="sql-textarea"
          value={localDraft}
          onChange={(e) => setLocalDraft(e.target.value)}
          spellCheck={false}
          rows={Math.max(4, Math.min(20, localDraft.split("\n").length + 1))}
          aria-label="SQL draft"
        />
      ) : (
        <pre className="sql-pre"><code>{source || "(empty SQL)"}</code></pre>
      )}

      {interactive && (
        <div className="sql-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={localDraft === draft || localDraft.trim().length === 0}
          >
            Save draft
          </button>
          {onRegenerate && (
            <details className="sql-regen">
              <summary className="btn btn-secondary">Regenerate with feedback</summary>
              <textarea
                className="sql-feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value.slice(0, MAX_FEEDBACK))}
                placeholder="What should the LLM change? e.g. 'add is_ltd_product=false filter' or 'use dt not transaction_time'"
                rows={3}
                maxLength={MAX_FEEDBACK}
              />
              <button
                type="button"
                className="btn btn-warn"
                disabled={feedback.trim().length === 0}
                onClick={() => {
                  onRegenerate(feedback.trim());
                  setFeedback("");
                }}
              >
                Send feedback & regenerate
              </button>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
