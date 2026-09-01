"use client";

/** User-facing answer rendered like a normal assistant chat bubble. */
export function DatabotAssistantReply({ content }: { content: string }) {
  return (
    <div className="databot-assistant-reply" data-testid="databot-assistant-reply">
      <div className="databot-assistant-reply-body">{content}</div>
    </div>
  );
}
