/** Heuristics for hiding ReAct planning text in the chat sidebar. */

export function assistantMessageHasToolCalls(message: {
  toolCalls?: unknown[] | null;
}): boolean {
  return Array.isArray(message.toolCalls) && message.toolCalls.length > 0;
}

function toolCallName(toolCall: unknown): string {
  if (!toolCall || typeof toolCall !== "object") return "";
  const tc = toolCall as {
    function?: { name?: string };
    name?: string;
  };
  return tc.function?.name ?? tc.name ?? "";
}

/** True when the only tool calls are ``chat_completion`` (user-facing answer). */
export function isChatCompletionOnlyMessage(message: {
  toolCalls?: unknown[] | null;
  content?: string | null;
}): boolean {
  const calls = message.toolCalls;
  if (!Array.isArray(calls) || calls.length === 0) return false;
  return calls.every((tc) => toolCallName(tc) === "chat_completion");
}

/** Hide internal monologue; keep short user-facing status lines. */
export function isHiddenAssistantNarration(content: string): boolean {
  const text = content.trim();
  if (!text) return false;

  const lower = text.toLowerCase();

  const internalOpeners =
    /^(let me |i need to |i'll |i will |maybe i |actually wait|the user |looking at the|i've validated|i have validated|i validated)/i;
  if (internalOpeners.test(text)) {
    return true;
  }

  if (
    /\bthe user wants\b/i.test(text) ||
    /\bthey asked\b/i.test(text) ||
    /\bmy (task|job) is\b/i.test(text)
  ) {
    return true;
  }

  if (
    lower.includes("fetch_related_models") ||
    lower.includes("add_card_to_state") ||
    lower.includes("mark_cards_selected") ||
    lower.includes("trino_explain") ||
    lower.includes("propose_sql") ||
    lower.includes("write_gate_reasons") ||
    lower.includes("ok=true") ||
    lower.includes("returned ok") ||
    lower.includes("view in inspector")
  ) {
    return true;
  }

  if (lower.includes("emit only tool") || lower.includes("take exactly one action")) {
    return true;
  }

  return false;
}
