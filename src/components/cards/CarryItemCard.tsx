"use client";

import { Package } from "lucide-react";

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
        "relative w-full overflow-hidden rounded-2xl border px-4 pb-3 pt-4 text-left transition-colors",
        checked
          ? "border-leaf-300 bg-leaf-50/70"
          : isRequired
            ? "border-pollen-200 bg-pollen-50/60 hover:bg-pollen-50"
            : "border-pollen-100 bg-white hover:bg-pollen-50/40",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          checked ? "bg-leaf-500" : "bg-pollen-500",
        )}
      />
      <div className="flex items-start gap-3">
        <CheckIndicator checked={checked} className="mt-0.5" />
        <span
          className={cn(
            "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            checked
              ? "bg-leaf-50 text-leaf-700"
              : "bg-pollen-50 text-pollen-700",
          )}
        >
          <Package size={14} />
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
        <Badge tone={isRequired ? "pollen" : "muted"}>
          {PRIORITY_LABEL[item.priority]}
        </Badge>
      </div>
    </button>
  );
}
