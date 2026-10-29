"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type PlanInterruptUiContextValue = {
  /**
   * True when the user dismissed the confirmation dialog without answering
   * the gate. The interrupt stays pending on the agent — only the overlay
   * is hidden — so the chat banner has to offer a way back.
   */
  dismissed: boolean;
  dismiss: () => void;
  reopen: () => void;
};

const PlanInterruptUiContext = createContext<PlanInterruptUiContextValue | null>(
  null,
);

export function PlanInterruptUiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dismissed, setDismissed] = useState(false);
  const dismiss = useCallback(() => setDismissed(true), []);
  const reopen = useCallback(() => setDismissed(false), []);

  const value = useMemo(
    () => ({ dismissed, dismiss, reopen }),
    [dismissed, dismiss, reopen],
  );

  return (
    <PlanInterruptUiContext.Provider value={value}>
      {children}
    </PlanInterruptUiContext.Provider>
  );
}

export function usePlanInterruptUi(): PlanInterruptUiContextValue {
  const value = useContext(PlanInterruptUiContext);
  if (!value) {
    throw new Error("usePlanInterruptUi requires PlanInterruptUiProvider");
  }
  return value;
}
