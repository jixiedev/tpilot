import type { AbstractAgent } from "@ag-ui/client";
import type { PlanAgentState } from "./planTypes";

/** Plan fields cleared when the user starts a new chat. */
export const EMPTY_PLAN_STATE: PlanAgentState = {
  plan_id: "",
  stage: undefined,
  user_question: "",
  subagent_rounds: 0,
  step_results: [],
  plan_snapshot: null,
};

const PRESERVED_AGENT_STATE_KEYS = ["tools", "copilotkit"] as const;

/** Clear in-memory Plan agent view after ``startNewThread()``. */
export function resetPlanAgentView(agent: AbstractAgent): void {
  const current = (agent.state ?? {}) as Record<string, unknown>;
  const preserved: Record<string, unknown> = {};
  for (const key of PRESERVED_AGENT_STATE_KEYS) {
    if (key in current) preserved[key] = current[key];
  }

  agent.setMessages([]);
  agent.setState({
    ...preserved,
    ...EMPTY_PLAN_STATE,
  });
  agent.pendingInterrupts = [];
}
