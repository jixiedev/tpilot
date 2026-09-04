import type { DatabotAgentState, TableCard } from "./types";

/** Merge card lists by model name; later groups override earlier payloads. */
export function mergeTableCardsByName(
  ...groups: (TableCard[] | undefined)[]
): TableCard[] {
  const byName = new Map<string, TableCard>();
  for (const group of groups) {
    for (const card of group ?? []) {
      if (card?.name) byName.set(card.name, card);
    }
  }
  return Array.from(byName.values());
}

/**
 * Card pool for the artifact panel. At the cards gate, ``review_cards`` is
 * authoritative for human review but ``committed_cards`` can lag in the
 * AG-UI snapshot — merge both so the Cards tab matches the gate panel.
 */
export function databotDisplayCardPool(
  ds: Pick<
    DatabotAgentState,
    "stage" | "committed_cards" | "review_cards" | "staging_cards"
  > | undefined,
): TableCard[] {
  if (!ds) return [];

  const committed = ds.committed_cards ?? [];
  const review = ds.review_cards ?? [];
  const staging = ds.staging_cards ?? [];

  if (ds.stage === "gate_cards") {
    return mergeTableCardsByName(committed, review);
  }
  if (committed.length > 0) return committed;
  return staging;
}
