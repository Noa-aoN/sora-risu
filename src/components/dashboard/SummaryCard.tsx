"use client";

import Image from "next/image";
import { CloudRain, Gauge, Thermometer, Wind } from "lucide-react";

import { AcornIcon } from "@/components/brand/AcornIcon";
import { SoraRisuPopover } from "@/components/brand/SoraRisuPopover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pickRisuMood } from "@/features/recommendations/risuMood";
import { pressureTrendLabel, weatherCodeLabel } from "@/lib/labels";
import type { TimeSlot } from "@/types/timeline";
import type { NormalizedWeather, WeatherCondition } from "@/types/weather";

type Props = {
  conditions: WeatherCondition[];
  slots: TimeSlot[];
  weather: NormalizedWeather | null;
};

function findCurrentSlot(slots: TimeSlot[]): TimeSlot | null {
  const nowMs = Date.now();
  return (
    slots.find((s) => {
      const start = new Date(s.start).getTime();
      const end = new Date(s.end).getTime();
      return nowMs >= start && nowMs < end;
    }) ?? null
  );
}

function pickHighlightCondition(
  conditions: WeatherCondition[],
  slots: TimeSlot[],
): WeatherCondition | null {
  if (conditions.length === 0) return null;
  const alert = conditions.find(
    (c) =>
      c.pressure.changeLevel === "high" ||
      c.precipitation.level === "high" ||
      c.pollen.level === "very_high",
  );
  if (alert) return alert;
  const currentSlot = findCurrentSlot(slots);
  if (currentSlot) {
    const current = conditions.find((c) => c.slotId === currentSlot.id);
    if (current) return current;
  }
  return conditions[0] ?? null;
}

export function SummaryCard({ conditions, slots, weather }: Props) {
  const highlight = pickHighlightCondition(conditions, slots);
  const slot = highlight
    ? slots.find((s) => s.id === highlight.slotId)
    : undefined;

  const tempMax =
    weather && weather.daily[0] ? Math.round(weather.daily[0].tempMax) : null;
  const tempMin =
    weather && weather.daily[0] ? Math.round(weather.daily[0].tempMin) : null;
  const weatherCode = weather?.daily[0]?.weatherCode;
  const mood = pickRisuMood(highlight);

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AcornIcon bounce />
          <CardTitle>今日のサマリー</CardTitle>
        </div>
      </CardHeader>
      <div className="absolute right-2 top-5 z-10 sm:right-4 sm:top-5">
        {highlight ? (
          <SoraRisuPopover
            pose={mood.pose}
            size={88}
            ariaLabel="そらリスのひとこと"
            placement="left"
            popoverClassName="w-[min(24rem,calc(100vw-8rem))]"
          >
            <p className="font-brand text-sm text-ink-800">
              そらリスのひとこと
            </p>
            <p className="mt-1 text-[13px] leading-6 text-ink-600">
              {mood.message}
            </p>
          </SoraRisuPopover>
        ) : (
          <span
            aria-hidden
            className="inline-flex h-[88px] w-[88px] items-center justify-center"
          >
            <Image
              src="/brand/sora/acorn-basic.png"
              alt=""
              width={36}
              height={36}
              className="motion-acorn-spin select-none [animation:acorn-spin_2.4s_linear_infinite]"
              draggable={false}
              unoptimized
            />
          </span>
        )}
      </div>
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
