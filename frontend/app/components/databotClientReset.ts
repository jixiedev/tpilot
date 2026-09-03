import type { AbstractAgent } from "@ag-ui/client";
import type { DatabotAgentState } from "./types";

/** Databot fields cleared when the user starts a new chat. */
export const EMPTY_DATABOT_STATE: DatabotAgentState = {
  stage: "fetch",
  staging_cards: [],
  committed_cards: [],
  review_cards: [],
  approved_cards: [],
  metric_conflicts: [],
  draft_sql: "",
  approved_sql: "",
  sql_validated: false,
  gate_decisions: [],
  cards_reasons: {},
  sql_reasons: {},
  dryrun: false,
  halt_reason: "",
  chart_requested: false,
  deny_feedback: "",
};

const PRESERVED_AGENT_STATE_KEYS = ["tools", "copilotkit"] as const;

/**
 * Clear in-memory agent view state after ``startNewThread()``.
 * Preserves runtime metadata (tool registry) but wipes cards, SQL,
 * results, gates, and chat messages so the main panel matches a
 * fresh thread.
 */
export function resetDatabotAgentView(agent: AbstractAgent): void {
  const current = (agent.state ?? {}) as Record<string, unknown>;
  const preserved: Record<string, unknown> = {};
  for (const key of PRESERVED_AGENT_STATE_KEYS) {
    if (key in current) preserved[key] = current[key];
  }

  agent.setMessages([]);
  agent.setState({
    ...preserved,
    ...EMPTY_DATABOT_STATE,
    execution_result: undefined,
  });
  agent.pendingInterrupts = [];
}
