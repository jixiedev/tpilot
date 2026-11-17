"use client";

import {
  CopilotChatAssistantMessage,
  type CopilotChatAssistantMessageProps,
} from "@copilotkit/react-core/v2";
import {
  assistantMessageHasToolCalls,
  extractThinkText,
  isHiddenAssistantNarration,
  stripThinkBlocks,
} from "./databotChatUtils";
import { FoldSection } from "./FoldSection";

/**
 * Assistant turn: model thinking and planning narration fold into collapsed
 * rows; the user-facing reply and tool cards render as usual.
 */
export function DatabotAssistantMessage(props: CopilotChatAssistantMessageProps) {
  const hasToolCalls = assistantMessageHasToolCalls(props.message);
  const rawContent = (props.message.content || "").trim();
  const content = stripThinkBlocks(rawContent);
  const think = extractThinkText(rawContent);
  const isLatest = props.messages?.[props.messages.length - 1]?.id === props.message.id;
  const streaming = Boolean(props.isRunning && isLatest);

  // Narration: internal monologue, or long prose written alongside tool calls.
  const isNarration =
    content.length > 0 &&
    (isHiddenAssistantNarration(rawContent) || (hasToolCalls && content.length > 200));
  const reply = isNarration ? "" : content;

  const thinkingFold = think.text ? (
    <FoldSection
      label={think.open && streaming ? "Thinking…" : "Thinking"}
      active={think.open && streaming}
      className="fold-section--thinking"
    >
      <div className="fold-section-text">{think.text}</div>
    </FoldSection>
  ) : null;
  const narrationFold = isNarration ? (
    <FoldSection label="Reasoning" className="fold-section--reasoning">
      <div className="fold-section-text">{content}</div>
    </FoldSection>
  ) : null;

  if (!hasToolCalls && !reply) {
    if (!thinkingFold && !narrationFold) return null;
    return (
      <div className="databot-assistant-folds">
        {thinkingFold}
        {narrationFold}
      </div>
    );
  }

  return (
    <div className="databot-assistant-folds">
      {thinkingFold}
      {narrationFold}
      <CopilotChatAssistantMessage
        {...props}
        message={{ ...props.message, content: reply }}
        inspectorButton={() => null}
        toolbarVisible={false}
        markdownRenderer={reply ? undefined : () => null}
      />
    </div>
  );
}
