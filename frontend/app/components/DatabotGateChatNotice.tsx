"use client";

import { useAgent } from "@copilotkit/react-core/v2";
import type { DatabotAgentState } from "./types";
import {
  gateKindFromStage,
  gateUserInstructions,
} from "./databotGateUtils";
import { useAgentRefresh } from "./useAgentRefresh";

/** Shown in the chat transcript while a human gate is pending. */
export function DatabotGateChatBanner() {
  const { agent, isReady } = useAgent({ agentId: "databot" });
  useAgentRefresh(isReady ? agent : undefined, isReady);

  const stage = (agent?.state as DatabotAgentState | undefined)?.stage;
  const gateKind = gateKindFromStage(stage);

  if (!isReady || !gateKind) {
    return null;
  }

  const instructions = gateUserInstructions(gateKind);

  return (
    <div className="chat-gate-notice" role="status" data-testid="chat-gate-notice">
      <p className="chat-gate-notice-kicker">Action required</p>
      <h4 className="chat-gate-notice-title">{instructions.headline}</h4>
      <ol className="chat-gate-notice-steps">
        {instructions.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="chat-gate-notice-pointer">
        Submit your decision in the <strong>gate panel on the right</strong>.
      </p>
    </div>
  );
}
