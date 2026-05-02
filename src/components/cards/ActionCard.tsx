"use client";

import { Sparkles } from "lucide-react";

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

export function ActionCard({ item }: { item: ActionItem }) {
  const checked = useAppStore((s) => Boolean(s.actionChecks[item.id]));
  const toggle = useAppStore((s) => s.toggleActionCheck);

  return (
    <button
      type="button"
      onClick={() => toggle(item.id)}
      aria-pressed={checked}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border px-4 pb-3 pt-4 text-left transition-colors",
        checked
          ? "border-leaf-300 bg-leaf-50/70"
          : "border-rain-100 bg-white hover:bg-rain-50/50",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          checked ? "bg-leaf-500" : "bg-rain-500",
        )}
      />
      <div className="flex items-start gap-3">
        <CheckIndicator checked={checked} className="mt-0.5" />
        <span
          className={cn(
            "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            checked
              ? "bg-leaf-50 text-leaf-700"
              : "bg-rain-50 text-rain-700",
          )}
        >
          <Sparkles size={14} />
        </span>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p
            className={cn(
              "text-sm font-medium",
              checked ? "text-leaf-800 line-through" : "text-ink-800",
            )}
          >
            {item.title}
          </p>
          <p className="text-[11px] leading-relaxed text-ink-600">
            {item.description}
          </p>
          <p className="text-[11px] leading-relaxed text-ink-400">
            {item.reason}
          </p>
        </div>
        <Badge tone="rain">{INTENSITY_LABEL[item.intensity]}</Badge>
      </div>
    </button>
  );
}
