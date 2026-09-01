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
  disabled?: boolean;
  onChange?: (selectedNames: string[]) => void;
}

const fmtScore = (score: number | undefined): string => {
  if (score == null) return "—";
  return (score * 100).toFixed(0) + "%";
};

function scoreTier(score: number | undefined): "high" | "mid" | "low" | "none" {
  if (score == null) return "none";
  if (score >= 0.55) return "high";
  if (score >= 0.4) return "mid";
  return "low";
}

function CardScoreBar({ score }: { score: number | undefined }) {
  const pct = score != null ? Math.min(100, Math.max(0, score * 100)) : 0;
  return (
    <div className="card-score" title={score != null ? `Relevance ${fmtScore(score)}` : "No score"}>
      <div className="card-score-track">
        <div
          className={`card-score-fill card-score-fill--${scoreTier(score)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="card-score-label">{fmtScore(score)}</span>
    </div>
  );
}

function ChipRow({
  label,
  items,
  variant,
}: {
  label: string;
  items: string[];
  variant: "dim" | "metric";
}) {
  if (!items.length) return null;
  return (
    <div className={`card-chip-row card-chip-row--${variant}`}>
      <span className="card-chip-row-label">{label}</span>
      <div className="card-chip-wrap">
        {items.map((item) => (
          <span key={item} className={`card-chip card-chip--${variant}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TableCardList({
  candidates,
  selected,
  metricConflicts = [],
  mode = "readonly",
  disabled = false,
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
    if (!interactive || !onChange || disabled) return;
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
        <div className="card-list-summary-bar">
          <span className="card-list-summary-count">
            {selectedNames.size}
            <span className="card-list-summary-of"> / {candidates.length}</span>
          </span>
          <span className="card-list-summary-text">
            models selected
            {interactive ? " · click cards to refine" : ""}
          </span>
        </div>
      )}
      <div className="card-grid">
        {pool.map((card) => {
          const isSelected = selectedNames.has(card.name);
          const isOpen = openCardName === (card.staging_id ?? card.name);
          const conflict = conflictByCard.get(card.name);
          const cardMode = interactive && isSelected ? "selected" : interactive ? "candidate" : "frozen";
          const hasPicks =
            (card.selected_dimensions?.length ?? 0) > 0 ||
            (card.selected_metrics?.length ?? 0) > 0;
          return (
            <article
              key={card.staging_id ?? card.name}
              className={`card-item card-${cardMode}${hasPicks ? " card-has-picks" : ""}${isOpen ? " card-is-open" : ""}`}
              data-testid={`card-${card.name}`}
            >
              <div className="card-accent" aria-hidden />
              <header className="card-header">
                <div className="card-identity">
                  <span className="card-avatar" aria-hidden>
                    {card.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="card-title-block">
                    <label className="card-select">
                      {interactive && (
                        <input
                          type="checkbox"
                          className="card-checkbox"
                          checked={isSelected}
                          disabled={disabled}
                          onChange={() => handleToggle(card.name)}
                          aria-label={`Select ${card.name}`}
                        />
                      )}
                      {!interactive && (
                        <span
                          className={`card-status-dot card-status-dot--${isSelected ? "selected" : "candidate"}`}
                          title={isSelected ? "Selected for this question" : "Candidate"}
                        />
                      )}
                      <span className="card-name">{card.name}</span>
                    </label>
                    {card.model_type && (
                      <span className="card-type-badge">{card.model_type}</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className={`card-expand${isOpen ? " card-expand--open" : ""}`}
                  onClick={() =>
                    setOpenCardName(isOpen ? null : (card.staging_id ?? card.name))
                  }
                  aria-expanded={isOpen}
                >
                  {isOpen ? "Collapse" : "Details"}
                </button>
              </header>

              {!isOpen && card.description && (
                <p className="card-blurb">{card.description}</p>
              )}

              <div className="card-stats">
                <CardScoreBar score={card.score} />
                <div className="card-stat-pills">
                  {card.matched_chunk_type && (
                    <span className="card-stat-pill">
                      {card.matched_chunk_type.replace("model+", "")}
                    </span>
                  )}
                  {(card.physical_tables?.length ?? 0) > 0 && (
                    <span className="card-stat-pill">
                      {card.physical_tables!.length} table
                      {card.physical_tables!.length === 1 ? "" : "s"}
                    </span>
                  )}
                  <span className="card-stat-pill card-stat-pill--muted">
                    {card.columns?.length ?? 0} cols · {card.metrics?.length ?? 0} metrics
                  </span>
                </div>
              </div>

              {hasPicks && !isOpen && (
                <div className="card-picks">
                  <ChipRow label="Metrics" items={card.selected_metrics ?? []} variant="metric" />
                  <ChipRow label="Dims" items={card.selected_dimensions ?? []} variant="dim" />
                </div>
              )}
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
        <div className="card-list-empty">
          <span className="card-list-empty-icon" aria-hidden>◇</span>
          <p>No models yet — Databot is still searching the semantic index.</p>
        </div>
      )}
    </div>
  );
}

function TableCardDetail({
  card,
  highlightDimensions,
  highlightMetrics,
}: {
  card: TableCard;
  highlightDimensions?: Set<string>;
  highlightMetrics?: Set<string>;
}) {
  const dimHigh = highlightDimensions ?? new Set(card.selected_dimensions ?? []);
  const metricHigh = highlightMetrics ?? new Set(card.selected_metrics ?? []);

  return (
    <div className="card-detail">
      {card.selection_notes && (
        <p className="card-selection-notes">
          <span className="meta-label">LLM pick</span>
          {card.selection_notes}
        </p>
      )}
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
        <section className="card-detail-panel card-detail-panel--columns">
          <h4>
            <span className="card-detail-panel-icon">⬡</span>
            Columns
            <span className="card-detail-count">{card.columns?.length ?? 0}</span>
          </h4>
          <div className="card-chip-grid">
            {card.columns?.slice(0, 20).map((c) => (
              <span
                key={c.name}
                className={`card-detail-chip${dimHigh.has(c.name) ? " card-detail-chip--picked" : ""}`}
                title={c.description || c.name}
              >
                {c.name}
                {c.dimension?.type && (
                  <span className="card-detail-chip-tag">{c.dimension.type}</span>
                )}
              </span>
            ))}
            {(card.columns?.length ?? 0) > 20 && (
              <span className="card-detail-chip card-detail-chip--more">
                +{card.columns!.length - 20} more
              </span>
            )}
          </div>
        </section>
        <section className="card-detail-panel card-detail-panel--metrics">
          <h4>
            <span className="card-detail-panel-icon">◆</span>
            Metrics
            <span className="card-detail-count">{card.metrics?.length ?? 0}</span>
          </h4>
          <div className="card-chip-grid">
            {card.metrics?.map((m) => (
              <span
                key={m.name}
                className={`card-detail-chip card-detail-chip--metric${metricHigh.has(m.name) ? " card-detail-chip--picked" : ""}`}
                title={m.description || m.label || m.name}
              >
                {m.name}
                {m.agg && <span className="card-detail-chip-tag">{m.agg}</span>}
              </span>
            ))}
            {(card.metrics?.length ?? 0) === 0 && (
              <span className="card-detail-chip card-detail-chip--muted">No metrics</span>
            )}
          </div>
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

/** Compact card row for the human gate (decision only — details live in Cards tab). */
export function GateCardPreview({ card }: { card: TableCard }) {
  const tables = card.physical_tables?.filter(Boolean) ?? [];

  return (
    <li className="gate-card-tile">
      <span className="gate-card-avatar" aria-hidden>
        {card.name.slice(0, 2).toUpperCase()}
      </span>
      <div className="gate-card-body">
        <div className="gate-card-title-row">
          <span className="gate-card-name">{card.name}</span>
        </div>
        {tables.length > 0 && (
          <div className="gate-card-tables">
            {tables.slice(0, 2).map((t) => (
              <span key={t} className="gate-table-chip">
                {t}
              </span>
            ))}
            {tables.length > 2 && (
              <span className="gate-table-chip gate-table-chip--more">
                +{tables.length - 2}
              </span>
            )}
          </div>
        )}
        {card.description && (
          <p className="gate-card-desc">{card.description}</p>
        )}
        {card.selection_notes && (
          <p className="gate-card-notes">{card.selection_notes}</p>
        )}
      </div>
    </li>
  );
}
