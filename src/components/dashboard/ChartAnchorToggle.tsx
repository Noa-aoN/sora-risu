"use client";

import { cn } from "@/lib/cn";
import { useAppStore } from "@/stores/useAppStore";
import type { ChartAnchor } from "@/types/settings";

const OPTIONS: Array<{ value: ChartAnchor; label: string }> = [
  { value: "center", label: "中央" },
  { value: "left", label: "左端" },
];

export function ChartAnchorToggle() {
  const anchor = useAppStore((s) => s.chartAnchor);
  const setAnchor = useAppStore((s) => s.setChartAnchor);

  return (
    <div className="inline-flex items-center gap-2">
      <span className="font-brand text-xs text-ink-500">現在時間の表示位置</span>
      <div className="inline-flex rounded-full border border-leaf-100 bg-white p-0.5">
        {OPTIONS.map((opt) => {
          const active = anchor === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => setAnchor(opt.value)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                active
                  ? "bg-leaf-600 text-white"
                  : "text-ink-500 hover:text-ink-700",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
