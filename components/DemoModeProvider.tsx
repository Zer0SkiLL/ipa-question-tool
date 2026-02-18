"use client";

import { createContext, useContext, type ReactNode } from "react";

const DemoModeContext = createContext(false);

export function DemoModeProvider({
  isDemoMode,
  children,
}: {
  isDemoMode: boolean;
  children: ReactNode;
}) {
  return (
    <DemoModeContext.Provider value={isDemoMode}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
