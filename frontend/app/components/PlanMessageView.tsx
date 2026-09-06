"use client";

import {
  CopilotChatMessageView,
  type CopilotChatMessageViewProps,
} from "@copilotkit/react-core/v2";
import { DatabotAssistantMessage } from "./DatabotAssistantMessage";
import { PlanGateChatBanner } from "./PlanGateChatBanner";

function HiddenReasoningMessage() {
  return null;
}

/** Plan chat: hide reasoning rows and ReAct monologue; summary-only prose surfaces. */
export function PlanMessageView(props: CopilotChatMessageViewProps) {
  return (
    <CopilotChatMessageView
      {...props}
      assistantMessage={DatabotAssistantMessage}
      reasoningMessage={HiddenReasoningMessage}
    >
      {({ messageElements, isRunning, messages, interruptElement }) => {
        const lastMessage = messages[messages.length - 1];
        const showCursor = isRunning && lastMessage?.role !== "reasoning";
        return (
          <div
            data-testid="copilot-message-list"
            className="copilotKitMessages cpk:flex cpk:flex-col plan-message-list"
          >
            {messageElements}
            <PlanGateChatBanner />
            {interruptElement}
            {showCursor && <CopilotChatMessageView.Cursor />}
          </div>
        );
      }}
    </CopilotChatMessageView>
  );
}
