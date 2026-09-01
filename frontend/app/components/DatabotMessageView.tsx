"use client";

import {
  CopilotChatMessageView,
  type CopilotChatMessageViewProps,
} from "@copilotkit/react-core/v2";
import { DatabotAssistantMessage } from "./DatabotAssistantMessage";
import { DatabotGateChatBanner } from "./DatabotGateChatNotice";

function HiddenReasoningMessage() {
  return null;
}

/** Chat message list with gate banner, no inspector chrome, and no reasoning/thinking rows. */
export function DatabotMessageView(props: CopilotChatMessageViewProps) {
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
            className="copilotKitMessages cpk:flex cpk:flex-col databot-message-list"
          >
            {messageElements}
            <DatabotGateChatBanner />
            {interruptElement}
            {showCursor && <CopilotChatMessageView.Cursor />}
          </div>
        );
      }}
    </CopilotChatMessageView>
  );
}
