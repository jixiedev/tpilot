"use client";

import {
  CopilotChatAssistantMessage,
  CopilotChatMessageView,
  type CopilotChatMessageViewProps,
} from "@copilotkit/react-core/v2";
import { DatabotAssistantMessage } from "./DatabotAssistantMessage";
import { DatabotGateChatBanner } from "./DatabotGateChatNotice";

/**
 * Chat message list with the gate banner and no inspector chrome. Reasoning
 * rows use CopilotKit's built-in view: open while streaming, folded after.
 */
export function DatabotMessageView(props: CopilotChatMessageViewProps) {
  return (
    <CopilotChatMessageView
      {...props}
      assistantMessage={DatabotAssistantMessage as unknown as typeof CopilotChatAssistantMessage}
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
