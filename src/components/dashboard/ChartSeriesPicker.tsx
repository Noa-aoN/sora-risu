"use client";

import { CloudRain, CloudSun, Flower, Gauge, Thermometer } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useAppStore } from "@/stores/useAppStore";
import type { ChartSeriesKey } from "@/types/settings";

type Item = {
  key: ChartSeriesKey;
  label: string;
  icon: ReactNode;
  activeClass: string;
};

const ITEMS: Item[] = [
  {
    key: "weather",
    label: "天気",
    icon: <CloudSun size={12} />,
    activeClass: "border-leaf-300 bg-leaf-50 text-leaf-800",
  },
  {
    key: "temperature",
    label: "気温",
    icon: <Thermometer size={12} />,
    activeClass: "border-leaf-300 bg-leaf-50 text-leaf-800",
  },
  {
    key: "precipitation",
    label: "降水",
    icon: <CloudRain size={12} />,
    activeClass: "border-rain-100 bg-rain-50 text-rain-700",
  },
  {
    key: "pressure",
    label: "気圧",
    icon: <Gauge size={12} />,
    activeClass: "border-leaf-300 bg-leaf-50 text-leaf-800",
  },
  {
    key: "pollen",
    label: "花粉",
    icon: <Flower size={12} />,
    activeClass: "border-pollen-100 bg-pollen-50 text-pollen-700",
  },
];

type Props = {
  showPollen?: boolean;
  showPressure?: boolean;
};

export function ChartSeriesPicker({
  showPollen = true,
  showPressure = true,
}: Props) {
  const chartSeries = useAppStore((s) => s.chartSeries);
  const toggleChartSeries = useAppStore((s) => s.toggleChartSeries);

  const items = ITEMS.filter((item) => {
    if (item.key === "pollen" && !showPollen) return false;
    if (item.key === "pressure" && !showPressure) return false;
    return true;
  });

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="font-brand text-xs text-ink-500">表示</span>
      {items.map((item) => {
        const active = chartSeries[item.key];
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => toggleChartSeries(item.key)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors",
              active
                ? item.activeClass
                : "border-leaf-100 bg-white text-ink-400 hover:bg-leaf-25",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
