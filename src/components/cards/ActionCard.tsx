"use client";

import {
  BedDouble,
  Briefcase,
  Cloud,
  Dumbbell,
  Footprints,
  PersonStanding,
  Wind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { AcornRoll } from "@/components/brand/AcornRoll";
import { Badge } from "@/components/ui/badge";
import { CheckIndicator } from "@/components/ui/check-indicator";
import { cn } from "@/lib/cn";
import { PERIOD_TONE } from "@/lib/periodTone";
import { useAppStore } from "@/stores/useAppStore";
import type { ActionItem } from "@/types/recommendation";
import type { SlotPeriod } from "@/types/timeline";

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
      return <PersonStanding size={size} />;
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

export function ActionCard({
  item,
  period,
}: {
  item: ActionItem;
  period: SlotPeriod;
}) {
  const checked = useAppStore((s) => Boolean(s.actionChecks[item.id]));
  const toggle = useAppStore((s) => s.toggleActionCheck);
  const tone = PERIOD_TONE[period];

  const prevChecked = useRef(checked);
  const [rollTrigger, setRollTrigger] = useState(0);
  useEffect(() => {
    if (!prevChecked.current && checked) setRollTrigger((n) => n + 1);
    prevChecked.current = checked;
  }, [checked]);

  return (
    <button
      type="button"
      onClick={() => toggle(item.id)}
      aria-pressed={checked}
      className={cn(
        "group relative w-full rounded-2xl border border-t-2 px-4 py-3 text-left transition-colors",
        tone.cardUnchecked,
      )}
    >
      <AcornRoll trigger={rollTrigger} />
      <div className="flex items-start gap-2.5">
        <CheckIndicator
          checked={checked}
          checkedClassName={tone.checkChecked}
          className="mt-0.5"
          uncheckedClassName={tone.checkUnchecked}
        />
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
                checked ? tone.checkedIconText : "text-leaf-700",
              )}
            >
              {renderActionIcon(item.category, 14)}
            </span>
            <span className="line-clamp-2 min-w-0 flex-1 break-words leading-snug">
              {item.title}
            </span>
          </p>
          <p className="break-words text-[11px] leading-relaxed text-ink-600">
            {item.description}
          </p>
        </div>
        <Badge tone="muted" className="shrink-0">
          {INTENSITY_LABEL[item.intensity]}
        </Badge>
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
