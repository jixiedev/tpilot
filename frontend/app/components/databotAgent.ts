// Databot is a front agent with its own page (`/databot`) and AG-UI endpoint
// (`/agui/databot`, see `agui_server.py`). Its state arrives at the top level
// of the agent state: { messages, stage, review_cards, draft_sql, ... }.

import type { DatabotAgentState } from "./types";

/** CopilotKit / AG-UI agent id; must match `agui_server.DATABOT_AGENT` and the runtime route. */
export const DATABOT_AGENT_ID = "databot";

/** Databot's state from the agent state (kept as a function so callers stay agent-agnostic). */
export function databotStateOf(state: unknown): DatabotAgentState | undefined {
  return (state ?? undefined) as DatabotAgentState | undefined;
}

/** Agent state with `patch` merged in (used after a UI action). */
export function withDatabotPatch(
  state: unknown,
  patch: Partial<DatabotAgentState>,
): Record<string, unknown> {
  return { ...((state ?? {}) as Record<string, unknown>), ...patch };
}
