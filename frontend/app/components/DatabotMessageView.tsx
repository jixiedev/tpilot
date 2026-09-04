"use client";

import {
  CopilotChatMessageView,
  type CopilotChatMessageViewProps,
} from "@copilotkit/react-core/v2";
import { DatabotAssistantMessage } from "./DatabotAssistantMessage";
import { DatabotGateChatBanner } from "./DatabotGateChatNotice";
import { HiddenReasoningMessage } from "./HiddenReasoningMessage";

/** Chat message list with gate banner, no inspector chrome, and no reasoning/thinking rows. */
function DatabotMessageViewImpl(
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

/**
 * `messageView` is a CopilotKit slot typed as the library component, which
 * carries a `Cursor` static. We render the cursor ourselves from the
 * imported component, so the static is only re-attached to satisfy the
 * slot contract.
 */
export const DatabotMessageView = Object.assign(DatabotMessageViewImpl, {
  Cursor: CopilotChatMessageView.Cursor,
});
