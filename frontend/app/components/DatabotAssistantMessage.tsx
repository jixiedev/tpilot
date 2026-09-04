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
function DatabotAssistantMessageImpl(
  props: CopilotChatAssistantMessageProps,
): React.JSX.Element {
  const hasToolCalls = assistantMessageHasToolCalls(props.message);
  const rawContent = (props.message.content || "").trim();
  const content = stripThinkBlocks(rawContent);
  const hideNarration = isHiddenAssistantNarration(rawContent);
  const latestId = props.messages?.[props.messages.length - 1]?.id;
  // Only the in-flight message is planning text. Earlier replies stay put.
  const streaming =
    Boolean(props.isRunning) && latestId != null && props.message.id === latestId;
  const hideContent =
    streaming || hideNarration || (hasToolCalls && content.length > 200);

  // Empty fragment instead of `null`: the slot type demands a JSX element,
  // and a fragment renders exactly as much as `null` would.
  if (!hasToolCalls && (streaming || hideNarration || !content)) {
    return <></>;
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

/**
 * CopilotKit types the `assistantMessage` slot as the library component
 * *including* its nested slot statics (`MarkdownRenderer`, `Toolbar`, …).
 * Our override delegates straight to `CopilotChatAssistantMessage`, so it
 * never renders those nested slots itself — we re-attach them purely to
 * satisfy the slot contract.
 */
export const DatabotAssistantMessage = Object.assign(
  DatabotAssistantMessageImpl,
  {
    MarkdownRenderer: CopilotChatAssistantMessage.MarkdownRenderer,
    Toolbar: CopilotChatAssistantMessage.Toolbar,
    ToolbarButton: CopilotChatAssistantMessage.ToolbarButton,
    CopyButton: CopilotChatAssistantMessage.CopyButton,
    InspectorButton: CopilotChatAssistantMessage.InspectorButton,
    ThumbsUpButton: CopilotChatAssistantMessage.ThumbsUpButton,
    ThumbsDownButton: CopilotChatAssistantMessage.ThumbsDownButton,
    ReadAloudButton: CopilotChatAssistantMessage.ReadAloudButton,
    RegenerateButton: CopilotChatAssistantMessage.RegenerateButton,
  },
);
