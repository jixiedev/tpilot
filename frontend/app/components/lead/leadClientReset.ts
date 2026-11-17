import type { AbstractAgent } from "@ag-ui/client";

const PRESERVED_AGENT_STATE_KEYS = ["tools", "copilotkit"] as const;

/** Clear the lead's in-memory view (chat, plan, work record, specialist) for a new thread. */
export function resetLeadAgentView(agent: AbstractAgent): void {
  const current = (agent.state ?? {}) as Record<string, unknown>;
  const preserved: Record<string, unknown> = {};
  for (const key of PRESERVED_AGENT_STATE_KEYS) {
    if (key in current) preserved[key] = current[key];
  }
  agent.setMessages([]);
  agent.setState({ ...preserved, plan: [], work_record: [], active_subagent: null });
  agent.pendingInterrupts = [];
}
