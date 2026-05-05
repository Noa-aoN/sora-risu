"use client";

import { useEffect, useState } from "react";

type Phase = "morning" | "noon" | "evening" | "night";

function phaseFromHour(hour: number): Phase {
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 16) return "noon";
  if (hour >= 16 && hour < 19) return "evening";
  return "night";
}

const PHASE_GRADIENT: Record<Phase, string> = {
  morning:
    "linear-gradient(180deg, rgba(207,228,243,0.55) 0%, rgba(242,231,214,0) 100%)",
  noon: "linear-gradient(180deg, rgba(242,231,214,0.55) 0%, rgba(247,250,244,0) 100%)",
  evening:
    "linear-gradient(180deg, rgba(243,213,202,0.55) 0%, rgba(247,250,244,0) 100%)",
  night:
    "linear-gradient(180deg, rgba(197,204,224,0.55) 0%, rgba(247,250,244,0) 100%)",
};

export function TimeBasedBackground() {
  const [phase, setPhase] = useState<Phase | null>(null);

  useEffect(() => {
    const update = () => setPhase(phaseFromHour(new Date().getHours()));
    update();
    const id = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden
      className="absolute inset-0 transition-[background] duration-700"
      style={{
        background: phase ? PHASE_GRADIENT[phase] : PHASE_GRADIENT.morning,
      }}
    />
  );
}
