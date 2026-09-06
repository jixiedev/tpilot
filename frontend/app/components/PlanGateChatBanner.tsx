"use client";

import { useAgent } from "@copilotkit/react-core/v2";
import { parseGateInterruptMessage } from "./databotGateUtils";
import { GateHelpPopover } from "./GateHelpPopover";
import { useAgentRefresh } from "./useAgentRefresh";

/** Compact chat notice while a nested specialist gate is pending. */
export function PlanGateChatBanner() {
  const { agent, isReady } = useAgent({ agentId: "plan" });
  useAgentRefresh(isReady ? agent : undefined, isReady);

  const pending = (agent as { pendingInterrupts?: Array<{ message?: unknown }> })
    .pendingInterrupts;
  const interrupt = pending?.[0];
  const gate = interrupt ? parseGateInterruptMessage(interrupt.message)?.gate : null;

  if (!isReady || !gate) {
    return null;
  }

  return (
    <div
      className="chat-gate-notice chat-gate-notice--compact"
      role="status"
      data-testid="plan-chat-gate-notice"
    >
      <div className="chat-gate-notice-title">
        <span className="chat-gate-notice-kicker">Action required</span>
        {" — "}
        Submit your decision in the <strong>confirmation dialog</strong>.
        <GateHelpPopover gate={gate} surface="dialog" className="chat-gate-notice-help" />
      </div>
    </div>
  );
}
