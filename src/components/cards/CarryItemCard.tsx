"use client";

import {
  Flame,
  Flower,
  GlassWater,
  Package,
  Pill,
  ShieldCheck,
  Sun,
  Umbrella,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { AcornRoll } from "@/components/brand/AcornRoll";
import { Badge } from "@/components/ui/badge";
import { CheckIndicator } from "@/components/ui/check-indicator";
import { cn } from "@/lib/cn";
import { PERIOD_TONE } from "@/lib/periodTone";
import { useAppStore } from "@/stores/useAppStore";
import type { CarryItem } from "@/types/recommendation";
import type { SlotPeriod } from "@/types/timeline";

const PRIORITY_LABEL: Record<CarryItem["priority"], string> = {
  required: "必須",
  recommended: "推奨",
  optional: "任意",
};

function renderCarryIcon(
  category: CarryItem["category"],
  size: number,
): ReactNode {
  switch (category) {
    case "umbrella":
      return <Umbrella size={size} />;
    case "mask":
      return <ShieldCheck size={size} />;
    case "medicine":
      return <Pill size={size} />;
    case "sunshade":
      return <Sun size={size} />;
    case "water":
      return <GlassWater size={size} />;
    case "warmth":
      return <Flame size={size} />;
    case "pollen":
      return <Flower size={size} />;
    case "other":
      return <Package size={size} />;
  }
}

export function CarryItemCard({
  item,
  period,
}: {
  item: CarryItem;
  period: SlotPeriod;
}) {
  const checked = useAppStore((s) => Boolean(s.carryChecks[item.id]));
  const toggle = useAppStore((s) => s.toggleCarryCheck);
  const isRequired = item.priority === "required";
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
        checked
          ? tone.cardChecked
          : isRequired
            ? tone.cardRequired
            : tone.cardUnchecked,
      )}
    >
      <AcornRoll trigger={rollTrigger} />
      <div className="flex items-center gap-2.5">
        <CheckIndicator
          checked={checked}
          checkedClassName={tone.checkChecked}
          uncheckedClassName={tone.checkUnchecked}
        />
        <p
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1.5 text-sm font-medium",
            checked ? "text-leaf-800 line-through" : "text-ink-800",
          )}
        >
          <span
            className={cn(
              "shrink-0",
              checked ? tone.checkedIconText : "text-pollen-700",
            )}
          >
            {renderCarryIcon(item.category, 14)}
          </span>
          <span className="line-clamp-2 min-w-0 flex-1 break-words leading-snug">
            {item.name}
          </span>
        </p>
        <Badge tone={isRequired ? "pollen" : "muted"} className="shrink-0">
          {PRIORITY_LABEL[item.priority]}
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
