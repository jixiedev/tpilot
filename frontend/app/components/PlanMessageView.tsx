"use client";

import {
  CopilotChatMessageView,
  type CopilotChatMessageViewProps,
} from "@copilotkit/react-core/v2";
import { DatabotAssistantMessage } from "./DatabotAssistantMessage";
import { HiddenReasoningMessage } from "./HiddenReasoningMessage";
import { PlanGateChatBanner } from "./PlanGateChatBanner";

/** Plan chat: hide reasoning rows and ReAct monologue; summary-only prose surfaces. */
function PlanMessageViewImpl(
  props: CopilotChatMessageViewProps,
): React.JSX.Element {
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

/** `messageView` slot contract — see `DatabotMessageView` for details. */
export const PlanMessageView = Object.assign(PlanMessageViewImpl, {
  Cursor: CopilotChatMessageView.Cursor,
});
