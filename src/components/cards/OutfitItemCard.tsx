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
        "relative w-full overflow-hidden rounded-2xl border px-4 pb-3 pt-4 text-left transition-colors",
        checked
          ? "border-leaf-300 bg-leaf-50/70"
          : isRequired
            ? "border-leaf-200 bg-leaf-50/60 hover:bg-leaf-50"
            : "border-leaf-100/80 bg-white hover:bg-leaf-25",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          checked ? "bg-leaf-500" : isRequired ? "bg-leaf-500" : "bg-leaf-400",
        )}
      />
      <div className="flex items-start gap-3">
        <CheckIndicator checked={checked} className="mt-0.5" />
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-700">
          {renderOutfitIcon(item.category, 14)}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-medium",
              checked ? "text-leaf-800 line-through" : "text-ink-800",
            )}
          >
            {item.name}
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-ink-500">
            {item.reason}
          </p>
        </div>
        <Badge tone={isRequired ? "leaf" : "muted"}>
          {PRIORITY_LABEL[item.priority]}
        </Badge>
      </div>
    </button>
  );
}
