"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// SqlEditor
// ---------------------------------------------------------------------------
// Two modes:
//   - read-only  : show the current draft / approved SQL with a small badge
//   - interactive: let the human edit the draft (gates the SQL gate), and
//                  request a regenerate (which re-runs the SQL subgraph with
//                  a feedback comment written into the next-turn state).
//
// The upstream ``draft`` prop is produced by the agent and can change under
// the human's feet (the SQL subgraph regenerates it). The editor therefore
// keeps its own copy and reconciles the two:
//
//   - upstream changed, human has NOT edited  -> adopt the upstream draft
//   - upstream changed, human HAS edited      -> keep the human's text and
//     surface the divergence with a "load / keep" choice
//
// The previous implementation overwrote the textarea unconditionally from
// an effect, which silently discarded in-progress human edits — the exact
// opposite of what its comment claimed.
// ---------------------------------------------------------------------------

export type SqlEditorMode = "interactive" | "readonly";

export interface SqlEditorProps {
  draft: string;
  approved: string;
  validated?: boolean;
  mode?: SqlEditorMode;
  disabled?: boolean;
  /** When false, hides “Regenerate with feedback” (e.g. during SQL gate). */
  allowRegenerate?: boolean;
  onSaveDraft?: (sql: string) => void;
  onRegenerate?: (feedback: string) => void;
}

const MAX_FEEDBACK = 500;

type EditorState = {
  /** The last upstream draft we have reconciled with. */
  synced: string;
  /** What the textarea shows. */
  text: string;
  /** A newer upstream draft the human has not accepted yet. */
  conflict: string | null;
};

export function SqlEditor({
  draft,
  approved,
  validated = false,
  mode = "readonly",
  disabled = false,
  allowRegenerate = true,
  onSaveDraft,
  onRegenerate,
}: SqlEditorProps) {
  const interactive = mode === "interactive";
  const source = approved || draft;

  const [editor, setEditor] = useState<EditorState>({
    synced: draft,
    text: draft,
    conflict: null,
  });
  const [feedback, setFeedback] = useState("");

  // Reconcile with the upstream draft. React's "adjust state while
  // rendering" pattern — no effect, so no cascading render, and the
  // comparison below keeps it to a single pass per upstream change.
  if (editor.synced !== draft) {
    const humanEdited = editor.text !== editor.synced;
    // The upstream now matches what the human has: their own save landed
    // (the backend strips surrounding whitespace, so compare loosely).
    const matchesHuman = editor.text.trim() === draft.trim();
    setEditor(
      humanEdited && !matchesHuman
        ? { synced: draft, text: editor.text, conflict: draft }
        : { synced: draft, text: draft, conflict: null },
    );
  }

  const dirty = editor.text !== editor.synced;
  const hasConflict = editor.conflict !== null;

  const handleSave = () => {
    if (onSaveDraft && editor.text.trim().length > 0) {
      onSaveDraft(editor.text);
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
        {dirty && !approved && (
          <span className="tag tag-draft" data-testid="sql-unsaved-badge">
            unsaved edits
          </span>
        )}
      </header>

      {hasConflict && (
        <div className="sql-conflict" role="status" data-testid="sql-conflict">
          <span>
            The agent produced a new draft while you were editing. Your text was kept.
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              setEditor((prev) => ({ ...prev, text: prev.conflict ?? "", conflict: null }))
            }
          >
            Load agent&apos;s version
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setEditor((prev) => ({ ...prev, conflict: null }))}
          >
            Keep mine
          </button>
        </div>
      )}

      {interactive ? (
        <textarea
          className="sql-textarea"
          value={editor.text}
          disabled={disabled}
          onChange={(e) =>
            setEditor((prev) => ({
              ...prev,
              text: e.target.value,
            }))
          }
          spellCheck={false}
          rows={Math.max(4, Math.min(20, editor.text.split("\n").length + 1))}
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
            disabled={
              disabled || !dirty || editor.text.trim().length === 0
            }
          >
            Save draft
          </button>
          {allowRegenerate && onRegenerate && (
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
                disabled={disabled || feedback.trim().length === 0}
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
