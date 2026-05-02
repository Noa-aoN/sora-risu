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
  { value: "7d", label: "7D" },
  { value: "14d", label: "14D" },
];

export function TimelinePanel() {
  const range = useAppStore((s) => s.timelineRange);
  const setRange = useAppStore((s) => s.setTimelineRange);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <p className="text-sm text-ink-700">
          グラフの時間軸を選んでください
        </p>
        <p className="text-[11px] text-ink-400">
          24H は時刻ごと、3D / 7D / 14D は日次でグラフが切り替わります
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
