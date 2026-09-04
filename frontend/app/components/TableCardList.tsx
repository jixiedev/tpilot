"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { TableCard, TableCardColumn, TableCardMetric } from "./types";

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

function columnDescription(column: TableCardColumn): string {
  const parts = [column.description, column.entity?.description]
    .map((value) => (value || "").trim())
    .filter(Boolean);
  return [...new Set(parts)].join("\n");
}

function metricDescription(metric: TableCardMetric): string {
  const parts = [
    metric.label && metric.label !== metric.name ? metric.label : "",
    metric.description,
    metric.expr ? `expr: ${metric.expr}` : "",
  ]
    .map((value) => (value || "").trim())
    .filter(Boolean);
  return parts.join("\n");
}

function descriptionsFromCard(card: TableCard): {
  columns: Map<string, string>;
  metrics: Map<string, string>;
} {
  const columns = new Map<string, string>();
  for (const column of card.columns ?? []) {
    if (column.name) columns.set(column.name, columnDescription(column));
  }
  const metrics = new Map<string, string>();
  for (const metric of card.metrics ?? []) {
    if (metric.name) metrics.set(metric.name, metricDescription(metric));
  }
  return { columns, metrics };
}

function FieldChip({
  name,
  description,
  className,
  children,
}: {
  name: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; place: "above" | "below" } | null>(
    null,
  );
  const text = (description || "").trim();

  const show = () => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const place = rect.top < 96 ? "below" : "above";
    const x = Math.min(Math.max(rect.left + rect.width / 2, 148), window.innerWidth - 148);
    const y = place === "above" ? rect.top : rect.bottom;
    setTip({ x, y, place });
  };

  return (
    <>
      <span
        ref={ref}
        className={["field-chip", className].filter(Boolean).join(" ")}
        tabIndex={0}
        onMouseEnter={show}
        onMouseLeave={() => setTip(null)}
        onFocus={show}
        onBlur={() => setTip(null)}
      >
        {children}
      </span>
      {tip &&
        createPortal(
          <div
            className={`field-hover-tip field-hover-tip--${tip.place}`}
            role="tooltip"
            style={{ left: tip.x, top: tip.y }}
          >
            <div className="field-hover-tip-name">{name}</div>
            <div className="field-hover-tip-desc">
              {text || "No description for this field."}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function ChipRow({
  label,
  items,
  variant,
  descriptions,
}: {
  label: string;
  items: string[];
  variant: "dim" | "metric";
  descriptions?: Map<string, string>;
}) {
  if (!items.length) return null;
  return (
    <div className={`card-chip-row card-chip-row--${variant}`}>
      <span className="card-chip-row-label">{label}</span>
      <div className="card-chip-wrap">
        {items.map((item) => (
          <FieldChip
            key={item}
            name={item}
            description={descriptions?.get(item)}
            className={`card-chip card-chip--${variant}`}
          >
            {item}
          </FieldChip>
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
  const closeDetail = useCallback(() => setOpenCardName(null), []);
  const selectedNames = new Set(selected.map((c) => c.name));
  const conflictByCard = new Map(metricConflicts.map((c) => [c.card_name, c]));

  // Show candidates if any; otherwise just show selected. Selected rows that
  // are missing from candidates (stale AG-UI snapshot) still need a tile.
  const showCandidates = candidates.length > 0;
  const candidateNames = new Set(candidates.map((c) => c.name));
  const selectedOnly = selected.filter((c) => !candidateNames.has(c.name));
  const pool = showCandidates ? [...candidates, ...selectedOnly] : selected;

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

  const openCard =
    pool.find((card) => (card.staging_id ?? card.name) === openCardName) ?? null;

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
          const fieldTips = descriptionsFromCard(card);
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
                  onClick={() => setOpenCardName(card.staging_id ?? card.name)}
                  aria-haspopup="dialog"
                  aria-expanded={isOpen}
                >
                  Details
                </button>
              </header>

              {card.description && (
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

              {hasPicks && (
                <div className="card-picks">
                  <ChipRow
                    label="Metrics"
                    items={card.selected_metrics ?? []}
                    variant="metric"
                    descriptions={fieldTips.metrics}
                  />
                  <ChipRow
                    label="Dims"
                    items={card.selected_dimensions ?? []}
                    variant="dim"
                    descriptions={fieldTips.columns}
                  />
                </div>
              )}
              {conflict && (
                <p className="card-conflict">
                  ⚠ <strong>{conflict.metric}</strong> disagrees with glossary term
                  {" "}
                  <code>{conflict.glossary_term}</code>: {conflict.reason}
                </p>
              )}
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
      {openCard && (
        <TableCardDetailDialog card={openCard} onClose={closeDetail} />
      )}
    </div>
  );
}

function TableCardDetailDialog({
  card,
  onClose,
}: {
  card: TableCard;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="card-detail-modal-backdrop"
      onClick={onClose}
      data-testid="card-detail-modal"
    >
      <div
        className="card-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-detail-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="card-detail-modal-header">
          <span className="card-avatar" aria-hidden>
            {card.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="card-detail-modal-heading">
            <h3 id="card-detail-modal-title" className="card-name">
              {card.name}
            </h3>
            <div className="card-detail-modal-meta">
              {card.model_type && (
                <span className="card-type-badge">{card.model_type}</span>
              )}
              <span className="card-stat-pill card-stat-pill--muted">
                {fmtScore(card.score)} relevance
              </span>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="card-detail-modal-close"
            onClick={onClose}
          >
            Close
          </button>
        </header>
        <div className="card-detail-modal-body">
          <TableCardDetail card={card} />
        </div>
      </div>
    </div>,
    document.body,
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
              <FieldChip
                key={c.name}
                name={c.name}
                description={columnDescription(c)}
                className={`card-detail-chip${dimHigh.has(c.name) ? " card-detail-chip--picked" : ""}`}
              >
                {c.name}
                {c.dimension?.type && (
                  <span className="card-detail-chip-tag">{c.dimension.type}</span>
                )}
              </FieldChip>
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
              <FieldChip
                key={m.name}
                name={m.name}
                description={metricDescription(m)}
                className={`card-detail-chip card-detail-chip--metric${metricHigh.has(m.name) ? " card-detail-chip--picked" : ""}`}
              >
                {m.name}
                {m.agg && <span className="card-detail-chip-tag">{m.agg}</span>}
              </FieldChip>
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
