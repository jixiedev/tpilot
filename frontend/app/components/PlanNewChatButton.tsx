"use client";

import { useAgent, useCopilotChatConfiguration } from "@copilotkit/react-core/v2";
import { usePlanSession } from "./PlanSessionContext";

type PlanNewChatButtonProps = {
  className?: string;
};

/**
 * Mint a fresh CopilotKit thread (new UUID), clear the chat, and reset
 * the working-state UI. Mirrors ``DatabotNewChatButton`` but for the
 * plan agent — there is no client-side state to clear beyond the
 * session-key remount.
 */
export function PlanNewChatButton({ className }: PlanNewChatButtonProps) {
  const config = useCopilotChatConfiguration();
  const { agent, isReady } = useAgent({ agentId: "plan" });
  const { resetSessionUi } = usePlanSession();
  const busy = isReady && agent.isRunning;

  const handleClick = () => {
    if (busy) return;
    config?.startNewThread();
    resetSessionUi();
  };

  return (
    <button
      type="button"
      className={["plan-new-chat-btn", className].filter(Boolean).join(" ")}
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
