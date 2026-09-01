"use client";

import { createContext, useCallback, useContext, useState } from "react";

type DatabotSessionContextValue = {
  /** Bumped on each new chat to remount panels with local React state. */
  sessionKey: number;
  resetSessionUi: () => void;
};

const DatabotSessionContext = createContext<DatabotSessionContextValue | null>(
  null,
);

export function DatabotSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionKey, setSessionKey] = useState(0);
  const resetSessionUi = useCallback(() => {
    setSessionKey((key) => key + 1);
  }, []);

  return (
    <DatabotSessionContext.Provider value={{ sessionKey, resetSessionUi }}>
      {children}
    </DatabotSessionContext.Provider>
  );
}

export function useDatabotSession(): DatabotSessionContextValue {
  const value = useContext(DatabotSessionContext);
  if (!value) {
    throw new Error("useDatabotSession requires DatabotSessionProvider");
  }
  return value;
}
