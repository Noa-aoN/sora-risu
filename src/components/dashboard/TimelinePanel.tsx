"use client";

import { Segmented } from "@/components/ui/segmented";
import { useAppStore } from "@/stores/useAppStore";
import type { TimelineRange } from "@/types/timeline";

const TIMELINE_OPTIONS: Array<{
  value: TimelineRange;
  label: string;
  disabled?: boolean;
}> = [
  { value: "1d", label: "1D" },
  { value: "3d", label: "3D" },
  { value: "7d", label: "7D" },
  { value: "14d", label: "14D" },
];

export function TimelinePanel() {
  const range = useAppStore((s) => s.timelineRange);
  const setRange = useAppStore((s) => s.setTimelineRange);

  return (
    <div className="inline-flex w-full flex-col gap-1.5 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
      <span className="font-brand text-xs text-ink-500">時間軸</span>
      <Segmented<TimelineRange>
        value={range}
        onChange={setRange}
        options={TIMELINE_OPTIONS}
        size="sm"
      />
    </div>
  );
}
