"use client";

import {
  Activity,
  BedDouble,
  Briefcase,
  Cloud,
  Dumbbell,
  Footprints,
  Wind,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { CheckIndicator } from "@/components/ui/check-indicator";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/stores/useAppStore";
import type { ActionItem } from "@/types/recommendation";

const INTENSITY_LABEL: Record<ActionItem["intensity"], string> = {
  low: "強度 弱",
  medium: "強度 中",
  high: "強度 強",
};

function renderActionIcon(
  category: ActionItem["category"],
  size: number,
): ReactNode {
  switch (category) {
    case "stretch":
      return <Activity size={size} />;
    case "training":
      return <Dumbbell size={size} />;
    case "rest":
      return <BedDouble size={size} />;
    case "work":
      return <Briefcase size={size} />;
    case "outing":
      return <Footprints size={size} />;
    case "pollen_care":
      return <Wind size={size} />;
    case "weather_care":
      return <Cloud size={size} />;
  }
}

export function ActionCard({ item }: { item: ActionItem }) {
  const checked = useAppStore((s) => Boolean(s.actionChecks[item.id]));
  const toggle = useAppStore((s) => s.toggleActionCheck);

  return (
    <button
      type="button"
      onClick={() => toggle(item.id)}
      aria-pressed={checked}
      className={cn(
        "group relative w-full rounded-2xl border border-t-2 px-4 py-3 text-left transition-colors",
        checked
          ? "border-leaf-200 border-t-leaf-500 bg-leaf-50/70"
          : "border-rain-100 border-t-rain-500 bg-white hover:bg-rain-50/50",
      )}
    >
      <div className="flex items-start gap-2.5">
        <CheckIndicator checked={checked} className="mt-0.5" />
        <div className="min-w-0 flex-1 space-y-0.5">
          <p
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium",
              checked ? "text-leaf-800 line-through" : "text-ink-800",
            )}
          >
            <span
              className={cn(
                "shrink-0",
                checked ? "text-leaf-600" : "text-rain-700",
              )}
            >
              {renderActionIcon(item.category, 14)}
            </span>
            <span className="truncate">{item.title}</span>
          </p>
          <p className="text-[11px] leading-relaxed text-ink-600">
            {item.description}
          </p>
        </div>
        <Badge tone="rain">{INTENSITY_LABEL[item.intensity]}</Badge>
      </div>
      <span
        role="tooltip"
        className="pointer-events-none absolute inset-x-0 top-full z-20 mt-1 rounded-xl border border-leaf-100 bg-white px-3 py-2 text-[11px] leading-relaxed text-ink-600 opacity-0 shadow-md shadow-leaf-900/[0.08] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {item.reason}
      </span>
    </button>
  );
}
