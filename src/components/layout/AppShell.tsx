import type { ReactNode } from "react";

import { FooterCloudAnimation } from "@/components/layout/FooterCloudAnimation";
import { TimeBasedBackground } from "@/components/layout/TimeBasedBackground";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      suppressHydrationWarning
      className="relative min-h-screen overflow-hidden bg-cream-50 text-ink-800"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-72 overflow-hidden"
      >
        <TimeBasedBackground />
        <div className="absolute -top-6 left-[8%] h-24 w-40 rounded-full bg-white/60 blur-2xl" />
        <div className="absolute top-12 right-[6%] h-20 w-32 rounded-full bg-white/55 blur-2xl" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {children}
      </div>
      <FooterCloudAnimation />
    </div>
  );
}
