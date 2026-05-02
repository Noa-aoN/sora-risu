"use client";

import { Segmented } from "@/components/ui/segmented";
import { useAppStore } from "@/stores/useAppStore";
import type { TimelineRange } from "@/types/timeline";

const TIMELINE_OPTIONS: Array<{
  value: TimelineRange;
  label: string;
  disabled?: boolean;
}> = [
  { value: "24h", label: "24H" },
  { value: "3d", label: "3D" },
  { value: "7d", label: "7D 準備中", disabled: true },
  { value: "14d", label: "14D 準備中", disabled: true },
];

export function TimelinePanel() {
  const range = useAppStore((s) => s.timelineRange);
  const setRange = useAppStore((s) => s.setTimelineRange);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-400">
          Timeline
        </p>
        <p className="text-sm text-ink-700">
          選んだ時間軸に沿って、グラフとカードが揃って動きます
        </p>
      </div>
      <Segmented<TimelineRange>
        value={range}
        onChange={setRange}
        options={TIMELINE_OPTIONS}
      />
    </div>
  );
}
