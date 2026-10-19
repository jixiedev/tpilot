"use client";

import { useAgent } from "@copilotkit/react-core/v2";
import {
  parseGateInterruptMessage,
  selectPlanGateInterrupt,
} from "./databotGateUtils";
import { GateHelpPopover } from "./GateHelpPopover";
import { useAgentRefresh } from "./useAgentRefresh";
import { usePlanStopDismissal } from "./usePlanStopDismissal";

/** Compact chat notice while a nested specialist gate is pending. */
export function PlanGateChatBanner() {
  const { agent, isReady } = useAgent({ agentId: "plan" });
  useAgentRefresh(isReady ? agent : undefined, isReady);
  const stopDismissed = usePlanStopDismissal(isReady ? agent : undefined, isReady);

  const pending = agent.pendingInterrupts;
  const interrupt = selectPlanGateInterrupt(pending);
  const gate = interrupt
    ? parseGateInterruptMessage(interrupt.message)?.gate
    : null;

  // ``pendingInterrupts`` is not cleared on RUN_STARTED, so a cards-gate
  // payload stays visible while generate_sql tools are still streaming.
  // Stopping the run also leaves that payload in place — do not treat it
  // as a live confirmation.
  if (!isReady || agent.isRunning || stopDismissed || !gate) {
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
