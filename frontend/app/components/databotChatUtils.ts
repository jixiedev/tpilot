/** Heuristics for hiding ReAct planning text in the chat sidebar. */

export function assistantMessageHasToolCalls(message: {
  toolCalls?: unknown[] | null;
}): boolean {
  return Array.isArray(message.toolCalls) && message.toolCalls.length > 0;
}

/** Strip model think blocks before deciding whether to show assistant text. */
export function stripThinkBlocks(content: string): string {
  const withoutClosed = content.replace(/<think>[\s\S]*?<\/think>/gi, "");
  const cut = withoutClosed.replace(/<think>[\s\S]*$/i, "");
  return cut.trim();
}

/**
 * Text inside the model's think blocks, joined; `open` is true while the
 * last block is still streaming (no closing tag yet).
 */
export function extractThinkText(content: string): { text: string; open: boolean } {
  const parts: string[] = [];
  for (const match of content.matchAll(/<think>([\s\S]*?)<\/think>/gi)) {
    parts.push(match[1].trim());
  }
  const rest = content.replace(/<think>[\s\S]*?<\/think>/gi, "");
  const unclosed = /<think>([\s\S]*)$/i.exec(rest);
  if (unclosed) parts.push(unclosed[1].trim());
  return { text: parts.filter(Boolean).join("\n\n"), open: unclosed !== null };
}

/** Hide internal monologue; keep short user-facing status lines. */
export function isHiddenAssistantNarration(content: string): boolean {
  // Judge the prose only: a real answer often quotes the SQL it ran in a
  // fenced block (date_trunc, current_date, tool-like names), which made the
  // lead's full GMV answer fold away as "Reasoning".
  const text = stripThinkBlocks(content)
    .replace(/```[\s\S]*?```/g, "")
    .replace(/```[\s\S]*$/, "")
    .trim();
  if (!text) return false;

  const lower = text.toLowerCase();

  const internalOpeners =
    /^(let me |i need to |i'll |i will |maybe i |actually |actually wait|the user |looking at the|i've validated|i have validated|i validated|i already provided|i should call |wait, |hmm,|so the )/i;
  if (internalOpeners.test(text)) {
    return true;
  }

  if (
    lower.includes("没有新的") ||
    lower.includes("等你下一条") ||
    lower.includes("等你下一个") ||
    lower.includes("latest message is empty") ||
    lower.includes("no new question") ||
    lower.includes("no actual new question") ||
    lower.includes("system reminder")
  ) {
    return true;
  }

  if (
    /\bthe user (wants|is asking)\b/i.test(text) ||
    /\bthey asked\b/i.test(text) ||
    /\bmy (task|job) is\b/i.test(text)
  ) {
    return true;
  }

  if (
    lower.includes("invoke_knowledge") ||
    lower.includes("fetch_related_models") ||
    lower.includes("find_models_metrics") ||
    lower.includes("search_metric_catalog") ||
    lower.includes("commit_cards") ||
    lower.includes("add_card_to_state") ||
    lower.includes("mark_cards_selected") ||
    lower.includes("trino_explain") ||
    lower.includes("propose_sql") ||
    lower.includes("write_gate_reasons") ||
    lower.includes("ok=true") ||
    lower.includes("returned ok") ||
    lower.includes("view in inspector") ||
    lower.includes("[blocked]")
  ) {
    return true;
  }

  if (
    text.length > 200 &&
    (lower.includes("date_trunc") ||
      lower.includes("current_date") ||
      lower.includes("interval '") ||
      lower.includes("add_months"))
  ) {
    return true;
  }

  if (lower.includes("emit only tool") || lower.includes("take exactly one action")) {
    return true;
  }

  return false;
}
