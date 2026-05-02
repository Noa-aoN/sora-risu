"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/cn";
import { DAY_WINDOW_MAX_START, useAppStore } from "@/stores/useAppStore";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function shiftDate(base: Date, offset: number): Date {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

function shortDate(d: Date): string {
  return `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())} (${WEEKDAYS[d.getDay()]})`;
}

function relativeDayName(offset: number): string {
  if (offset === 0) return "今日";
  if (offset === 1) return "明日";
  if (offset === 2) return "明後日";
  return `${offset}日後`;
}

export function DayPicker() {
  const dayWindowStart = useAppStore((s) => s.dayWindowStart);
  const setDayWindowStart = useAppStore((s) => s.setDayWindowStart);

  const today = new Date();
  const day = shiftDate(today, dayWindowStart);

  const canPrev = dayWindowStart > 0;
  const canNext = dayWindowStart < DAY_WINDOW_MAX_START;

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-leaf-100 bg-white px-2 py-2">
      <button
        type="button"
        onClick={() => setDayWindowStart(dayWindowStart - 1)}
        disabled={!canPrev}
        aria-label="前の日へ"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
          canPrev
            ? "text-leaf-700 hover:bg-leaf-50"
            : "cursor-not-allowed text-ink-200",
        )}
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex flex-col items-center text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400">
          カードの対象日
        </p>
        <p className="text-sm font-medium text-ink-800">
          {relativeDayName(dayWindowStart)}
        </p>
        <p className="text-[11px] text-ink-500">{shortDate(day)}</p>
      </div>

      <button
        type="button"
        onClick={() => setDayWindowStart(dayWindowStart + 1)}
        disabled={!canNext}
        aria-label="次の日へ"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
          canNext
            ? "text-leaf-700 hover:bg-leaf-50"
            : "cursor-not-allowed text-ink-200",
        )}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
