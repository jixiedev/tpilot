"use client";

import { CopilotChatReasoningMessage } from "@copilotkit/react-core/v2";

/**
 * Reasoning / thinking rows are never shown in this app — the agent's
 * internal monologue is noise for the user. CopilotKit renders a reasoning
 * row for every message that carries one, so we swap the whole slot for a
 * component that renders nothing.
 *
 * CopilotKit types the `reasoningMessage` slot as the library component
 * including its nested slot statics, so they are re-attached here purely to
 * satisfy the slot contract.
 */
function HiddenReasoningMessageImpl(): React.JSX.Element {
  return <></>;
}

export const HiddenReasoningMessage = Object.assign(
  HiddenReasoningMessageImpl,
  {
    Header: CopilotChatReasoningMessage.Header,
    Content: CopilotChatReasoningMessage.Content,
    Toggle: CopilotChatReasoningMessage.Toggle,
  },
);
