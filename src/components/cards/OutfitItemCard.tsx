"use client";

import {
  Footprints,
  Glasses,
  Home,
  Package,
  Shirt,
  Wind,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { CheckIndicator } from "@/components/ui/check-indicator";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/stores/useAppStore";
import type { OutfitItem } from "@/types/recommendation";

const PRIORITY_LABEL: Record<OutfitItem["priority"], string> = {
  required: "必須",
  recommended: "推奨",
  optional: "任意",
};

function renderOutfitIcon(
  category: OutfitItem["category"],
  size: number,
): ReactNode {
  switch (category) {
    case "outer":
      return <Wind size={size} />;
    case "top":
      return <Shirt size={size} />;
    case "bottom":
      return <Package size={size} />;
    case "shoes":
      return <Footprints size={size} />;
    case "accessory":
      return <Glasses size={size} />;
    case "indoor":
      return <Home size={size} />;
  }
}

export function OutfitItemCard({ item }: { item: OutfitItem }) {
  const checked = useAppStore((s) => Boolean(s.outfitChecks[item.id]));
  const toggle = useAppStore((s) => s.toggleOutfitCheck);
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
            ? "border-leaf-200 border-t-leaf-500 bg-leaf-50/60 hover:bg-leaf-50"
            : "border-leaf-100/80 border-t-leaf-400 bg-white hover:bg-leaf-25",
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
              checked ? "text-leaf-600" : "text-leaf-700",
            )}
          >
            {renderOutfitIcon(item.category, 14)}
          </span>
          <span className="line-clamp-2 min-w-0 flex-1 break-words leading-snug">
            {item.name}
          </span>
        </p>
        <Badge tone={isRequired ? "leaf" : "muted"} className="shrink-0">
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
