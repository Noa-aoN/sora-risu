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
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { CheckIndicator } from "@/components/ui/check-indicator";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/stores/useAppStore";
import type { CarryItem } from "@/types/recommendation";

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

export function CarryItemCard({ item }: { item: CarryItem }) {
  const checked = useAppStore((s) => Boolean(s.carryChecks[item.id]));
  const toggle = useAppStore((s) => s.toggleCarryCheck);
  const isRequired = item.priority === "required";

  return (
    <button
      type="button"
      onClick={() => toggle(item.id)}
      aria-pressed={checked}
      className={cn(
        "group relative w-full rounded-2xl border border-t-2 px-4 py-3 text-left transition-colors",
        checked
          ? "border-leaf-200 border-t-leaf-500 bg-leaf-50/70"
          : isRequired
            ? "border-pollen-100 border-t-pollen-500 bg-pollen-50/60 hover:bg-pollen-50"
            : "border-pollen-100 border-t-pollen-500/55 bg-white hover:bg-pollen-50/40",
      )}
    >
      <div className="flex items-center gap-2.5">
        <CheckIndicator checked={checked} />
        <p
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1.5 text-sm font-medium",
            checked ? "text-leaf-800 line-through" : "text-ink-800",
          )}
        >
          <span
            className={cn(
              "shrink-0",
              checked ? "text-leaf-600" : "text-pollen-700",
            )}
          >
            {renderCarryIcon(item.category, 14)}
          </span>
          <span className="truncate">{item.name}</span>
        </p>
        <Badge tone={isRequired ? "pollen" : "muted"}>
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
