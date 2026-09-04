"use client";

import {
  CopilotChatAssistantMessage,
  type CopilotChatAssistantMessageProps,
} from "@copilotkit/react-core/v2";
import {
  assistantMessageHasToolCalls,
  isHiddenAssistantNarration,
  stripThinkBlocks,
} from "./databotChatUtils";

/** Hide thinking/planning; show user-facing prose when there are no tool calls. */
export function DatabotAssistantMessage(props: CopilotChatAssistantMessageProps) {
  const hasToolCalls = assistantMessageHasToolCalls(props.message);
  const rawContent = (props.message.content || "").trim();
  const content = stripThinkBlocks(rawContent);
  const hideNarration = isHiddenAssistantNarration(rawContent);
  const hideContent =
    hideNarration || (hasToolCalls && content.length > 200);

  if (!hasToolCalls && (hideNarration || !content)) {
    return null;
  }

  const showMarkdown = content.length > 0 && !hideContent;

  return (
    <CopilotChatAssistantMessage
      {...props}
      inspectorButton={() => null}
      toolbarVisible={false}
      markdownRenderer={showMarkdown ? undefined : () => null}
    />
  );
}
