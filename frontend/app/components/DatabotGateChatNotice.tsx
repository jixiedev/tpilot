"use client";

import { useAgent } from "@copilotkit/react-core/v2";
import type { DatabotAgentState } from "./types";
import { gateKindFromStage } from "./databotGateUtils";
import { GateHelpPopover } from "./GateHelpPopover";
import { useAgentRefresh } from "./useAgentRefresh";

/** Compact chat notice while a human gate is pending. */
export function DatabotGateChatBanner() {
  const { agent, isReady } = useAgent({ agentId: "databot" });
  useAgentRefresh(isReady ? agent : undefined, isReady);

  const stage = (agent?.state as DatabotAgentState | undefined)?.stage;
  const gateKind = gateKindFromStage(stage);

  if (!isReady || !gateKind) {
    return null;
  }

  return (
    <div className="chat-gate-notice chat-gate-notice--compact" role="status" data-testid="chat-gate-notice">
      <div className="chat-gate-notice-title">
        <span className="chat-gate-notice-kicker">Action required</span>
        {" — "}
        Submit your decision in the <strong>gate panel on the right</strong>.
        <GateHelpPopover gate={gateKind} className="chat-gate-notice-help" />
      </div>
    </div>
  );
}
