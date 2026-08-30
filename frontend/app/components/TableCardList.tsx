"use client";

import { useState } from "react";
import type { TableCard } from "./types";

// ---------------------------------------------------------------------------
// TableCardList
// ---------------------------------------------------------------------------
// Renders the fetch-stage artifact: candidate cards (everything RAG/MCP
// returned) and selected cards (the LLM's working set the human reviews).
//
// Behavior depends on the current stage:
//   - `fetch`              : read-only; LLM is still working
//   - `gate_cards` / `sql` : interactive; user can drop / add cards
//                            before approving the SQL draft
//   - any other stage      : read-only (selection is now locked in)
//
// In interactive mode, add / drop is wired to `onChange` which the parent
// dispatches to the backend via `update_card_selection`.
// ---------------------------------------------------------------------------

export type CardListMode = "interactive" | "readonly";

export interface TableCardListProps {
  candidates: TableCard[];
  selected: TableCard[];
  metricConflicts?: { card_name: string; metric: string; glossary_term: string; reason: string }[];
  mode?: CardListMode;
  onChange?: (selectedNames: string[]) => void;
}

const fmtScore = (score: number | undefined): string => {
  if (score == null) return "—";
  return (score * 100).toFixed(1) + "%";
};

export function TableCardList({
  candidates,
  selected,
  metricConflicts = [],
  mode = "readonly",
  onChange,
}: TableCardListProps) {
  const [openCardName, setOpenCardName] = useState<string | null>(null);
  const selectedNames = new Set(selected.map((c) => c.name));
  const conflictByCard = new Map(metricConflicts.map((c) => [c.card_name, c]));

  // Show candidates if any; otherwise just show selected.
  const showCandidates = candidates.length > 0;
  const pool = showCandidates ? candidates : selected;

  const interactive = mode === "interactive" && showCandidates;

  const handleToggle = (cardName: string) => {
    if (!interactive || !onChange) return;
    const next = new Set(selectedNames);
    if (next.has(cardName)) {
      next.delete(cardName);
    } else {
      next.add(cardName);
    }
    onChange(Array.from(next));
  };

  return (
    <div className="card-list">
      {showCandidates && (
        <p className="card-list-summary">
          {selectedNames.size} of {candidates.length} candidate card
          {candidates.length === 1 ? "" : "s"} selected
          {interactive ? " — toggle to refine" : ""}
        </p>
      )}
      <div className="card-grid">
        {pool.map((card) => {
          const isSelected = selectedNames.has(card.name);
          const isOpen = openCardName === card.name;
          const conflict = conflictByCard.get(card.name);
          const cardMode = interactive && isSelected ? "selected" : interactive ? "candidate" : "frozen";
          return (
            <article
              key={card.name}
              className={`card-item card-${cardMode}`}
              data-testid={`card-${card.name}`}
            >
              <header className="card-header">
                <label className="card-select">
                  {interactive && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(card.name)}
                      aria-label={`Select ${card.name}`}
                    />
                  )}
                  {!interactive && (
                    <span
                      className={`badge badge-${isSelected ? "selected" : "candidate"}`}
                      title={isSelected ? "selected by the LLM" : "candidate (not selected)"}
                    >
                      {isSelected ? "✓" : "·"}
                    </span>
                  )}
                  <span className="card-name">{card.name}</span>
                </label>
                <button
                  type="button"
                  className="card-expand"
                  onClick={() => setOpenCardName(isOpen ? null : card.name)}
                  aria-expanded={isOpen}
                >
                  {isOpen ? "hide" : "details"}
                </button>
              </header>
              <p className="card-meta">
                <span className="card-meta-cell">
                  <span className="meta-label">score</span>
                  <span className="meta-value">{fmtScore(card.score)}</span>
                </span>
                <span className="card-meta-cell">
                  <span className="meta-label">match</span>
                  <span className="meta-value">{card.matched_chunk_type ?? "—"}</span>
                </span>
                <span className="card-meta-cell">
                  <span className="meta-label">tables</span>
                  <span className="meta-value">
                    {card.physical_tables?.length ?? 0}
                  </span>
                </span>
                <span className="card-meta-cell">
                  <span className="meta-label">conf</span>
                  <span className="meta-value">{card.confidence ?? "unknown"}</span>
                </span>
              </p>
              {conflict && (
                <p className="card-conflict">
                  ⚠ <strong>{conflict.metric}</strong> disagrees with glossary term
                  {" "}
                  <code>{conflict.glossary_term}</code>: {conflict.reason}
                </p>
              )}
              {isOpen && <TableCardDetail card={card} />}
            </article>
          );
        })}
      </div>
      {pool.length === 0 && (
        <p className="card-list-empty">No cards yet — Databot is still fetching candidates.</p>
      )}
    </div>
  );
}

function TableCardDetail({ card }: { card: TableCard }) {
  return (
    <div className="card-detail">
      {card.description && (
        <p className="card-description">{card.description}</p>
      )}
      {card.usage && (
        <p className="card-usage">
          <span className="meta-label">usage</span>
          <span>{card.usage}</span>
        </p>
      )}
      <div className="card-detail-grid">
        <section>
          <h4>columns ({card.columns?.length ?? 0})</h4>
          <ul className="card-list-inline">
            {card.columns?.slice(0, 12).map((c) => (
              <li key={c.name}>
                <code>{c.name}</code>
                {c.dimension?.type && (
                  <span className="tag tag-dim">{c.dimension.type}</span>
                )}
                {c.entity?.type && (
                  <span className="tag tag-ent">{c.entity.type}</span>
                )}
              </li>
            ))}
            {(card.columns?.length ?? 0) > 12 && (
              <li className="muted">+{card.columns!.length - 12} more…</li>
            )}
          </ul>
        </section>
        <section>
          <h4>metrics ({card.metrics?.length ?? 0})</h4>
          <ul className="card-list-inline">
            {card.metrics?.map((m) => (
              <li key={m.name}>
                <code>{m.name}</code>
                {m.agg && <span className="tag tag-agg">{m.agg}</span>}
                {m.type && <span className="tag tag-type">{m.type}</span>}
              </li>
            ))}
            {(card.metrics?.length ?? 0) === 0 && (
              <li className="muted">no metrics declared</li>
            )}
          </ul>
        </section>
      </div>
      {card.cte && (
        <details className="card-cte">
          <summary>CTE / definition SQL</summary>
          <pre><code>{card.cte}</code></pre>
        </details>
      )}
      <p className="card-paths">
        {card.yml_path && <span><span className="meta-label">yml</span> {card.yml_path}</span>}
        {card.sql_path && <span><span className="meta-label">sql</span> {card.sql_path}</span>}
      </p>
    </div>
  );
}
