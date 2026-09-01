"use client";

import {
  CopilotChatAssistantMessage,
  type CopilotChatAssistantMessageProps,
} from "@copilotkit/react-core/v2";
import {
  assistantMessageHasToolCalls,
  isChatCompletionOnlyMessage,
  isHiddenAssistantNarration,
} from "./databotChatUtils";

function HiddenToolCallsView() {
  return null;
}

/** Hide thinking/planning; show user-facing prose (including short lines with tool calls). */
export function DatabotAssistantMessage(props: CopilotChatAssistantMessageProps) {
  const hasToolCalls = assistantMessageHasToolCalls(props.message);
  const content = (props.message.content || "").trim();
  const chatCompletionOnly = isChatCompletionOnlyMessage(props.message);
  const hideNarration = isHiddenAssistantNarration(content);

  if (!hasToolCalls && hideNarration) {
    return null;
  }
  if (!hasToolCalls && !content) {
    return null;
  }

  const showMarkdown = content.length > 0 && !hideNarration;

  return (
    <CopilotChatAssistantMessage
      {...props}
      inspectorButton={() => null}
      toolbarVisible={false}
      markdownRenderer={showMarkdown ? undefined : () => null}
      toolCallsView={chatCompletionOnly && showMarkdown ? HiddenToolCallsView : undefined}
    />
  );
}
