"use client";

import { createContext, useCallback, useContext, useState } from "react";

type PlanSessionContextValue = {
  /** Bumped on each new chat to remount the working-state UI cleanly. */
  sessionKey: number;
  resetSessionUi: () => void;
};

const PlanSessionContext = createContext<PlanSessionContextValue | null>(null);

export function PlanSessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionKey, setSessionKey] = useState(0);
  const resetSessionUi = useCallback(() => {
    setSessionKey((key) => key + 1);
  }, []);

  return (
    <PlanSessionContext.Provider value={{ sessionKey, resetSessionUi }}>
      {children}
    </PlanSessionContext.Provider>
  );
}

export function usePlanSession(): PlanSessionContextValue {
  const value = useContext(PlanSessionContext);
  if (!value) {
    throw new Error("usePlanSession requires PlanSessionProvider");
  }
  return value;
}
