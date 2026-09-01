/** Shared helpers for CopilotKit tool-call renderers. */

export type ToolRenderStatus = "inProgress" | "executing" | "complete";

export function formatToolResult(result: unknown): string {
  if (result == null) return "";
  if (typeof result === "string") return result;
  try {
    return JSON.stringify(result, null, 2);
  } catch {
    return String(result);
  }
}

export function truncate(text: string, max: number): string {
  const cleaned = text.trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1)}…`;
}

export function cardNamesFromUnknown(cards: unknown): string[] {
  if (!Array.isArray(cards)) return [];
  return cards
    .map((c) => {
      if (c && typeof c === "object" && "name" in c) {
        return String((c as { name: unknown }).name ?? "");
      }
      return "";
    })
    .filter(Boolean);
}

export interface FetchRelatedModelsSummary {
  names: string[];
  count: number;
  message?: string;
}

/** Parse ``fetch_related_models`` ToolMessage JSON (``staged`` refs). */
export function parseFetchRelatedModelsResult(
  result: unknown,
): FetchRelatedModelsSummary | null {
  let payload: Record<string, unknown> | null = null;
  if (typeof result === "string") {
    try {
      payload = JSON.parse(result) as Record<string, unknown>;
    } catch {
      return null;
    }
  } else if (result && typeof result === "object") {
    payload = result as Record<string, unknown>;
  }
  if (!payload) return null;

  const staged = Array.isArray(payload.staged) ? payload.staged : [];
  const names = cardNamesFromUnknown(staged);
  const total =
    typeof payload.staging_total === "number"
      ? payload.staging_total
      : names.length;

  return {
    names,
    count: Math.max(total, names.length),
    message: typeof payload.message === "string" ? payload.message : undefined,
  };
}

export function sqlPreview(sql: string | undefined, max = 420): string {
  return truncate((sql ?? "").replace(/\s+/g, " "), max);
}

export function isToolErrorText(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("tool error") ||
    lower.includes("connection error") ||
    lower.includes("connection refused") ||
    lower.includes("missing datahub") ||
    lower.includes("traceback")
  );
}

export interface GlossarySummary {
  query: string;
  total: number;
  names: string[];
  rawNote?: string;
}

export function parseGlossaryResult(result: unknown): GlossarySummary | null {
  let payload: Record<string, unknown> | null = null;
  if (typeof result === "string") {
    try {
      payload = JSON.parse(result) as Record<string, unknown>;
    } catch {
      return null;
    }
  } else if (result && typeof result === "object") {
    payload = result as Record<string, unknown>;
  }
  if (!payload) return null;
  const entities = Array.isArray(payload.entities) ? payload.entities : [];
  const names = entities
    .map((e) => {
      if (e && typeof e === "object" && "name" in e) {
        return String((e as { name: unknown }).name ?? "");
      }
      return "";
    })
    .filter(Boolean);
  return {
    query: String(payload.query ?? ""),
    total: Number(payload.total ?? names.length ?? 0),
    names,
    rawNote: typeof payload.note === "string" ? payload.note : undefined,
  };
}
