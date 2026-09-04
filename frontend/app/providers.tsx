"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="databot" useSingleEndpoint={false}>
      {children}
    </CopilotKit>
  );
}
