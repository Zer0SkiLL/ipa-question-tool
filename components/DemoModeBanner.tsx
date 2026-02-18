"use client";

import { useDemoMode } from "./DemoModeProvider";

export function DemoModeBanner() {
  const isDemoMode = useDemoMode();
  if (!isDemoMode) return null;
  return (
    <div className="bg-yellow-500 text-black text-center py-2 text-sm font-medium sticky top-0 z-50">
      Demo-Modus &mdash; Eingeschr&auml;nkte Funktionalit&auml;t. Anmeldedaten: demo@ipa.wid.li / demo1234
    </div>
  );
}
