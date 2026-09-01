"use client";

import { useAgent, useCopilotChatConfiguration } from "@copilotkit/react-core/v2";
import { resetDatabotAgentView } from "./databotClientReset";
import { useDatabotSession } from "./DatabotSessionContext";

type DatabotNewChatButtonProps = {
  className?: string;
};

/**
 * Mint a fresh CopilotKit thread (new UUID), clear chat + working-state
 * UI, and show the welcome screen.
 * Requires ``CopilotChatConfigurationProvider`` and ``DatabotSessionProvider``.
 */
export function DatabotNewChatButton({ className }: DatabotNewChatButtonProps) {
  const config = useCopilotChatConfiguration();
  const { agent, isReady } = useAgent({ agentId: "databot" });
  const { resetSessionUi } = useDatabotSession();
  const busy = isReady && agent.isRunning;

  const handleClick = () => {
    if (busy) return;
    config?.startNewThread();
    if (isReady) resetDatabotAgentView(agent);
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
      New chat
    </button>
  );
}
