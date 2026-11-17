"use client";

import {
  CopilotChatAssistantMessage,
  CopilotChatMessageView,
  type CopilotChatMessageViewProps,
} from "@copilotkit/react-core/v2";
import { DatabotAssistantMessage } from "../DatabotAssistantMessage";

/**
 * Lead chat list: thinking and narration fold (shared assistant message), and
 * warehouse's SQL review renders in place via `interruptElement`.
 */
export function LeadMessageView(props: CopilotChatMessageViewProps) {
  return (
    <CopilotChatMessageView {...props} assistantMessage={DatabotAssistantMessage as unknown as typeof CopilotChatAssistantMessage}>
      {({ messageElements, isRunning, messages, interruptElement }) => {
        const lastMessage = messages[messages.length - 1];
        const showCursor = isRunning && lastMessage?.role !== "reasoning";
        return (
          <div
            data-testid="copilot-message-list"
            className="copilotKitMessages cpk:flex cpk:flex-col lead-message-list"
          >
            {messageElements}
            {interruptElement}
            {showCursor && <CopilotChatMessageView.Cursor />}
          </div>
        );
      }}
    </CopilotChatMessageView>
  );
}
