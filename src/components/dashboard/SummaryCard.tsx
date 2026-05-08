"use client";

import Image from "next/image";
import { AlertTriangle, CloudRain, Gauge, Thermometer, Wind } from "lucide-react";

import { AcornIcon } from "@/components/brand/AcornIcon";
import { SoraRisuPopover } from "@/components/brand/SoraRisuPopover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pickRisuMood } from "@/features/recommendations/risuMood";
import {
  rainIntensityLabel,
  summarizeDayWeather,
  weatherCodeLabel,
} from "@/lib/labels";
import { pickTodayDaily } from "@/lib/todayDaily";
import type { TimeSlot } from "@/types/timeline";
import type {
  HourlyPoint,
  NormalizedWeather,
  WeatherCondition,
} from "@/types/weather";

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

function pickCurrentHourly(
  weather: NormalizedWeather | null,
): {
  code: number;
  temp: number;
  pressure: number;
} | null {
  if (!weather) return null;
  const nowMs = Date.now();
  const point = weather.hourly.find((p) => {
    const t = new Date(p.time).getTime();
    return t <= nowMs && nowMs < t + 60 * 60 * 1000;
  });
  if (!point) return null;
  return {
    code: point.weatherCode,
    temp: Math.round(point.temperature),
    pressure: Math.round(point.pressure),
  };
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

function pickPeakHour(todayHourly: HourlyPoint[]): number | null {
  if (todayHourly.length === 0) return null;
  const peakProb = Math.max(
    ...todayHourly.map((p) => p.precipitationProbability),
  );
  if (peakProb <= 0) return null;
  for (const p of todayHourly) {
    if (p.precipitationProbability === peakProb) {
      return new Date(p.time).getHours();
    }
  }
  return null;
}

function dayPressureTrendLabel(pressures: number[]): string | null {
  if (pressures.length < 2) return null;
  const first = pressures[0];
  const last = pressures[pressures.length - 1];
  if (first === undefined || last === undefined) return null;
  const diff = last - first;
  if (Math.abs(diff) < 0.8) return "安定";
  return diff > 0 ? "上昇傾向" : "下降傾向";
}

export function SummaryCard({ conditions, slots, weather }: Props) {
  const highlight = pickHighlightCondition(conditions, slots);
  const slot = highlight
    ? slots.find((s) => s.id === highlight.slotId)
    : undefined;

  const todayDaily = pickTodayDaily(weather);
  const tempMax = todayDaily ? Math.round(todayDaily.tempMax) : null;
  const tempMin = todayDaily ? Math.round(todayDaily.tempMin) : null;
  const currentHourly = pickCurrentHourly(weather);
  const mood = pickRisuMood(highlight, weather);

  const todayDateStr = todayDaily?.date;
  const todayHourly =
    todayDateStr && weather
      ? weather.hourly.filter((p) => p.time.startsWith(todayDateStr))
      : [];
  const dayWeatherSummary = todayHourly.length
    ? summarizeDayWeather(todayHourly)
    : weatherCodeLabel(todayDaily?.weatherCode);

  const todayPressures = todayHourly.map((p) => p.pressure);
  const todayMaxPressure = todayPressures.length
    ? Math.round(Math.max(...todayPressures))
    : null;
  const todayMinPressure = todayPressures.length
    ? Math.round(Math.min(...todayPressures))
    : null;
  const todayPressureTrend = dayPressureTrendLabel(todayPressures);

  const todayPeakProb = todayHourly.length
    ? Math.max(...todayHourly.map((p) => p.precipitationProbability))
    : null;
  const todayPeakProbHour = pickPeakHour(todayHourly);
  const todayPeakHourlyPrecip = todayHourly.length
    ? Math.max(...todayHourly.map((p) => p.precipitation))
    : null;

  const todayWinds = todayHourly.map((p) => p.windSpeed);
  const todayMaxWind = todayWinds.length ? Math.max(...todayWinds) : null;
  const todayMinWind = todayWinds.length ? Math.min(...todayWinds) : null;
  const todayMaxGust = todayDaily?.windGustMax;

  const todayMaxUv = todayDaily?.uvIndexMax;
  const todayHumidities = todayHourly.map((p) => p.humidity);
  const todayMaxHumidity = todayHumidities.length
    ? Math.round(Math.max(...todayHumidities))
    : null;
  const todayMinHumidity = todayHumidities.length
    ? Math.round(Math.min(...todayHumidities))
    : null;

  const tempWarning = (() => {
    if (tempMax !== null && tempMax >= 35) return "猛暑日";
    if (tempMin !== null && tempMin >= 25) return "熱帯夜";
    if (tempMax !== null && tempMax < 5) return "冷え込みあり";
    if (tempMin !== null && tempMin < 0) return "氷点下あり";
    if (
      todayMaxHumidity !== null &&
      todayMaxHumidity >= 80 &&
      tempMax !== null &&
      tempMax >= 28
    )
      return "蒸し暑さあり";
    if (todayMinHumidity !== null && todayMinHumidity <= 30)
      return "乾燥あり";
    return null;
  })();
  const todayMaxPressureDrop = (() => {
    if (todayPressures.length < 2) return 0;
    const first = todayPressures[0];
    if (first === undefined) return 0;
    let runningMax = first;
    let maxDrop = 0;
    for (const p of todayPressures) {
      if (p > runningMax) runningMax = p;
      const drop = runningMax - p;
      if (drop > maxDrop) maxDrop = drop;
    }
    return maxDrop;
  })();
  const pressureWarning = todayMaxPressureDrop >= 6 ? "急変あり" : null;

  const precipWarning = (() => {
    if (todayPeakHourlyPrecip !== null && todayPeakHourlyPrecip >= 10)
      return "強雨あり";
    if (todayHourly.some((p) => p.weatherCode >= 95)) return "雷雨あり";
    if (
      todayHourly.some(
        (p) =>
          (p.weatherCode >= 71 && p.weatherCode <= 77) ||
          (p.weatherCode >= 85 && p.weatherCode <= 86),
      )
    )
      return "雪あり";
    return null;
  })();
  const windCardWarning = (() => {
    if (todayMaxGust !== undefined && todayMaxGust >= 25) return "暴風あり";
    if (todayMaxGust !== undefined && todayMaxGust >= 13) return "強風あり";
    if (todayMaxUv !== undefined && todayMaxUv >= 8) return "強紫外線";
    return null;
  })();

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
            popoverClassName="w-[min(24rem,calc(100vw-8.75rem))]"
          >
            <p className="font-brand text-sm text-ink-800">
              そらリスのひとこと
            </p>
            <p className="mt-1 whitespace-pre-line text-[13px] leading-6 text-ink-600">
              {mood.message}
            </p>
          </SoraRisuPopover>
        ) : (
          <span
            aria-hidden
            className="inline-flex h-[88px] w-[88px] items-center justify-center"
          >
            <span
              className="motion-acorn-spin relative inline-block h-9 w-9 [animation:acorn-spin_2.4s_linear_infinite]"
            >
              <Image
                src="/brand/sora/acorn-basic.png"
                alt=""
                fill
                sizes="72px"
                className="select-none object-contain"
                draggable={false}
              />
            </span>
          </span>
        )}
      </div>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <p className="font-brand text-2xl leading-snug text-ink-800">
            {dayWeatherSummary}
          </p>
          {currentHourly && (
            <p className="text-xs text-[#b86a6a]">
              現在（{weatherCodeLabel(currentHourly.code)}・
              {currentHourly.temp} ℃・{currentHourly.pressure} hPa）
            </p>
          )}
        </div>

        {highlight && slot && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryStat
              icon={<Thermometer size={14} />}
              label="気温・湿度"
              value={
                tempMax !== null && tempMin !== null ? (
                  todayMinHumidity !== null && todayMaxHumidity !== null ? (
                    <>
                      <span>
                        {tempMin} ~ {tempMax} ℃
                      </span>
                      <span className="hidden sm:inline"> / </span>
                      <span className="block sm:inline">
                        {todayMinHumidity} ~ {todayMaxHumidity} %
                      </span>
                    </>
                  ) : (
                    `${tempMin} ~ ${tempMax} ℃`
                  )
                ) : (
                  "—"
                )
              }
              hint={
                <>
                  {highlight.temperature.feelsLike !== undefined && (
                    <>体感 {highlight.temperature.feelsLike} ℃</>
                  )}
                  {highlight.temperature.feelsLike !== undefined &&
                    tempWarning &&
                    " ・ "}
                  {tempWarning && (
                    <span className="inline-flex items-center gap-0.5">
                      <AlertTriangle size={11} aria-hidden />
                      {tempWarning}
                    </span>
                  )}
                </>
              }
            />
            <SummaryStat
              icon={<Gauge size={14} />}
              label="気圧"
              value={
                todayMaxPressure !== null && todayMinPressure !== null
                  ? `${todayMinPressure} ~ ${todayMaxPressure} hPa`
                  : "—"
              }
              hint={
                <>
                  {todayPressureTrend ?? null}
                  {todayPressureTrend && pressureWarning && " ・ "}
                  {pressureWarning && (
                    <span className="inline-flex items-center gap-0.5">
                      <AlertTriangle size={11} aria-hidden />
                      {pressureWarning}
                    </span>
                  )}
                </>
              }
            />
            <SummaryStat
              icon={<CloudRain size={14} />}
              label="降水確率・量"
              value={
                todayPeakProb !== null
                  ? todayPeakProb > 0 && todayPeakProbHour !== null
                    ? `${todayPeakProb}%（ピーク ${todayPeakProbHour}時）`
                    : `${todayPeakProb}%`
                  : `${highlight.precipitation.probability ?? 0}%`
              }
              hint={
                <>
                  {todayPeakHourlyPrecip !== null && (
                    <>
                      {todayPeakHourlyPrecip.toFixed(1)} mm（
                      {rainIntensityLabel(todayPeakHourlyPrecip)}）
                    </>
                  )}
                  {todayPeakHourlyPrecip !== null && precipWarning && " ・ "}
                  {precipWarning && (
                    <span className="inline-flex items-center gap-0.5">
                      <AlertTriangle size={11} aria-hidden />
                      {precipWarning}
                    </span>
                  )}
                </>
              }
            />
            <SummaryStat
              icon={<Wind size={14} />}
              label="風・紫外線"
              value={
                todayMaxWind !== null && todayMinWind !== null ? (
                  todayMaxGust !== undefined && todayMaxGust > 0 ? (
                    <>
                      <span>
                        {todayMinWind.toFixed(1)} ~{" "}
                        {todayMaxWind.toFixed(1)} m/s
                      </span>
                      <span className="block text-[11px] sm:inline sm:text-base">
                        （突風 {todayMaxGust.toFixed(1)}）
                      </span>
                    </>
                  ) : (
                    `${todayMinWind.toFixed(1)} ~ ${todayMaxWind.toFixed(1)} m/s`
                  )
                ) : (
                  "—"
                )
              }
              hint={
                <>
                  {todayMaxUv !== undefined && (
                    <>UV {todayMaxUv.toFixed(0)}</>
                  )}
                  {todayMaxUv !== undefined && windCardWarning && " ・ "}
                  {windCardWarning && (
                    <span className="inline-flex items-center gap-0.5">
                      <AlertTriangle size={11} aria-hidden />
                      {windCardWarning}
                    </span>
                  )}
                </>
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
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
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
