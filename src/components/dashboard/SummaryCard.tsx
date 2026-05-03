"use client";

import { CloudRain, Gauge, Thermometer, Wind } from "lucide-react";

import { AcornIcon } from "@/components/brand/AcornIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  pollenLevelLabel,
  pressureTrendLabel,
  weatherCodeLabel,
} from "@/lib/labels";
import type { TimeSlot } from "@/types/timeline";
import type { NormalizedWeather, WeatherCondition } from "@/types/weather";

type Props = {
  conditions: WeatherCondition[];
  slots: TimeSlot[];
  weather: NormalizedWeather | null;
};

function pickHighlightCondition(
  conditions: WeatherCondition[],
): WeatherCondition | null {
  if (conditions.length === 0) return null;
  const alert = conditions.find(
    (c) =>
      c.pressure.changeLevel === "high" ||
      c.precipitation.level === "high" ||
      c.pollen.level === "very_high",
  );
  return alert ?? conditions[0] ?? null;
}

export function SummaryCard({ conditions, slots, weather }: Props) {
  const highlight = pickHighlightCondition(conditions);
  const slot = highlight
    ? slots.find((s) => s.id === highlight.slotId)
    : undefined;

  const tempMax =
    weather && weather.daily[0] ? Math.round(weather.daily[0].tempMax) : null;
  const tempMin =
    weather && weather.daily[0] ? Math.round(weather.daily[0].tempMin) : null;
  const weatherCode = weather?.daily[0]?.weatherCode;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <AcornIcon />
            <CardTitle>今日のサマリー</CardTitle>
          </div>
          {highlight && (
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="leaf">
                <Gauge size={12} />
                {pressureTrendLabel(highlight.pressure.trend)}
              </Badge>
              {highlight.pressure.changeLevel === "high" && (
                <Badge tone="alert">変化が大きい目安</Badge>
              )}
              {highlight.precipitation.level === "high" && (
                <Badge tone="rain">
                  <CloudRain size={12} />
                  雨が強め
                </Badge>
              )}
              {highlight.pollen.level === "high" ||
              highlight.pollen.level === "very_high" ? (
                <Badge tone="pollen">
                  花粉 {pollenLevelLabel(highlight.pollen.level)}
                </Badge>
              ) : null}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <p className="font-brand text-2xl leading-snug text-ink-800">
            {weatherCodeLabel(weatherCode)}
          </p>
          <p className="text-xs text-ink-500">
            {tempMax !== null && tempMin !== null
              ? `最高 ${tempMax}℃ / 最低 ${tempMin}℃`
              : "—"}
          </p>
        </div>

        {highlight && slot && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryStat
              icon={<Thermometer size={14} />}
              label="気温"
              value={`${highlight.temperature.value}℃`}
              hint={
                highlight.temperature.feelsLike !== undefined
                  ? `体感 ${highlight.temperature.feelsLike}℃`
                  : undefined
              }
            />
            <SummaryStat
              icon={<Gauge size={14} />}
              label="気圧"
              value={`${Math.round(highlight.pressure.value)} hPa`}
              hint={pressureTrendLabel(highlight.pressure.trend)}
            />
            <SummaryStat
              icon={<CloudRain size={14} />}
              label="降水確率"
              value={`${highlight.precipitation.probability ?? 0}%`}
              hint={
                highlight.precipitation.amount !== undefined
                  ? `${highlight.precipitation.amount} mm`
                  : undefined
              }
            />
            <SummaryStat
              icon={<Wind size={14} />}
              label="風"
              value={
                highlight.wind ? `${highlight.wind.speed} m/s` : "—"
              }
              hint={
                highlight.humidity
                  ? `湿度 ${highlight.humidity.value}%`
                  : undefined
              }
            />
          </div>
        )}

        <p className="text-xs leading-relaxed text-ink-500">
          表示は予報データに基づく目安です。体調や予定に合わせて、無理のない範囲で参考にしてください。
        </p>
      </CardContent>
    </Card>
  );
}

function SummaryStat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-cream-50 px-4 py-3">
      <div className="flex items-center gap-1 text-xs text-ink-500">
        {icon}
        <span className="font-brand">{label}</span>
      </div>
      <p className="mt-1 font-brand text-base text-ink-800">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-ink-500">{hint}</p>}
    </div>
  );
}
