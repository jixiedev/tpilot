"use client";

import { useAgent, useCopilotChatConfiguration } from "@copilotkit/react-core/v2";
import type { AbstractAgent } from "@ag-ui/client";
import { resetDatabotAgentView } from "./databotClientReset";
import { useDatabotSession } from "./DatabotSessionContext";
import { DATABOT_AGENT_ID } from "./databotAgent";

type DatabotNewChatButtonProps = {
  className?: string;
  /** Agent whose thread is replaced (databot or lead). */
  agentId?: string;
  /** Clears the agent's in-memory view after the new thread starts. */
  resetAgentView?: (agent: AbstractAgent) => void;
};

/**
 * Mint a fresh CopilotKit thread (new UUID), clear chat + working-state
 * UI, and show the welcome screen.
 * Requires ``CopilotChatConfigurationProvider`` and ``DatabotSessionProvider``.
 */
export function DatabotNewChatButton({
  className,
  agentId = DATABOT_AGENT_ID,
  resetAgentView = resetDatabotAgentView,
}: DatabotNewChatButtonProps) {
  const config = useCopilotChatConfiguration();
  const { agent, isReady } = useAgent({ agentId });
  const { resetSessionUi } = useDatabotSession();
  const busy = isReady && agent.isRunning;

  const handleClick = () => {
    if (busy) return;
    config?.startNewThread();
    if (isReady) resetAgentView(agent);
    resetSessionUi();
  };

  return (
    <button
      type="button"
      className={["databot-new-chat-btn", className].filter(Boolean).join(" ")}
      onClick={handleClick}
      disabled={busy}
      title={
        busy
          ? "Wait for the current run to finish"
          : "Start a new conversation (new thread)"
      }
    >
      + New chat
    </button>
  );
}
