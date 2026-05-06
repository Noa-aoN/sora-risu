"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Flower,
  Gauge,
  Snowflake,
  Sun,
  Thermometer,
} from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactElement, ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AcornIcon } from "@/components/brand/AcornIcon";
import { ChartAnchorToggle } from "@/components/dashboard/ChartAnchorToggle";
import { ChartSeriesPicker } from "@/components/dashboard/ChartSeriesPicker";
import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { weatherCodeLabel } from "@/lib/labels";
import { useAppStore } from "@/stores/useAppStore";
import type { ChartAnchor, ChartSeriesVisibility } from "@/types/settings";
import type { TimelineRange } from "@/types/timeline";
import type {
  NormalizedPollen,
  NormalizedWeather,
  PollenHourlyPoint,
} from "@/types/weather";

type ChartPoint = {
  t: number;
  pressure: number;
  temperature: number;
  precip: number;
  precipProb: number;
  pollen?: number;
  weatherCode?: number;
};

const HOURLY_BAND_BASE = [
  { startHour: 6, endHour: 11, fill: "#f3e6b9", opacity: 0.3, label: "朝" },
  { startHour: 11, endHour: 15, fill: "#dde9d7", opacity: 0.3, label: "昼" },
  { startHour: 15, endHour: 19, fill: "#c5cce0", opacity: 0.24, label: "夕方" },
  { startHour: 19, endHour: 24, fill: "#cdd1c9", opacity: 0.24, label: "夜" },
];

const NOW_LINE_COLOR = "#b86a6a";
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const Y_AXIS_WIDTH = 48;

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function parseLocalISOToMs(s: string): number {
  const parts = s.split("T");
  const datePart = parts[0] ?? s;
  const timePart = parts[1] ?? "00:00";
  const ds = datePart.split("-").map(Number);
  const ts = timePart.split(":").map(Number);
  const y = ds[0] ?? 1970;
  const m = ds[1] ?? 1;
  const d = ds[2] ?? 1;
  const hh = ts[0] ?? 0;
  const mm = ts[1] ?? 0;
  return new Date(y, m - 1, d, hh, mm).getTime();
}

function dayStartMs(ms: number, dayOffset = 0): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  return d.getTime();
}

function formatHourTick(ms: number): string {
  return pad2(new Date(ms).getHours()) + "時";
}

function formatNowLabel(ms: number): string {
  const d = new Date(ms);
  return `現在 (${pad2(d.getHours())}:${pad2(d.getMinutes())})`;
}

function formatDayTick(ms: number): string {
  const d = new Date(ms);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatHourTooltip(ms: number): string {
  const d = new Date(ms);
  return `${d.getMonth() + 1}/${d.getDate()} ${pad2(d.getHours())}:00`;
}

function formatDayTooltip(ms: number): string {
  const d = new Date(ms);
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]}) ${pad2(d.getHours())}:00`;
}

function buildDayCenterTicks(data: ChartPoint[]): number[] {
  const seen = new Set<string>();
  const ticks: number[] = [];
  for (const p of data) {
    const d = new Date(p.t);
    const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const noon = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      12,
    ).getTime();
    ticks.push(noon);
  }
  return ticks;
}

function pollenPointMax(p: PollenHourlyPoint): number | undefined {
  const values = [p.alder, p.birch, p.grass, p.mugwort, p.olive, p.ragweed].filter(
    (v): v is number => typeof v === "number",
  );
  if (values.length === 0) return undefined;
  return Math.max(...values);
}

function buildPollenHourlyMap(pollen: NormalizedPollen): Map<number, number> {
  const map = new Map<number, number>();
  for (const p of pollen.hourly) {
    const peak = pollenPointMax(p);
    if (peak === undefined) continue;
    map.set(parseLocalISOToMs(p.time), Math.round(peak * 10) / 10);
  }
  return map;
}

function buildPollenDailyMap(pollen: NormalizedPollen): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of pollen.hourly) {
    const peak = pollenPointMax(p);
    if (peak === undefined) continue;
    const dateStr = p.time.slice(0, 10);
    const cur = map.get(dateStr) ?? 0;
    if (peak > cur) map.set(dateStr, Math.round(peak * 10) / 10);
  }
  return map;
}

function pollenLastAvailableMs(pollen: NormalizedPollen): number | null {
  for (let i = pollen.hourly.length - 1; i >= 0; i--) {
    const p = pollen.hourly[i];
    if (!p) continue;
    if (pollenPointMax(p) !== undefined) {
      return parseLocalISOToMs(p.time);
    }
  }
  return null;
}

function localDateStringFromMs(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function build24hWindow(
  weather: NormalizedWeather,
  pollen: NormalizedPollen | null,
  anchor: ChartAnchor,
): ChartPoint[] {
  const points: ChartPoint[] = weather.hourly.map((p) => ({
    t: parseLocalISOToMs(p.time),
    pressure: Math.round(p.pressure),
    temperature: Math.round(p.temperature * 10) / 10,
    precip: p.precipitation,
    precipProb: p.precipitationProbability,
    weatherCode: p.weatherCode,
  }));

  if (points.length === 0) return points;
  const nowMs = Date.now();

  let nowIdx = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < points.length; i++) {
    const candidate = points[i];
    if (!candidate) continue;
    const diff = Math.abs(candidate.t - nowMs);
    if (diff < bestDiff) {
      bestDiff = diff;
      nowIdx = i;
    }
  }

  const startIdx =
    anchor === "left" ? nowIdx : Math.max(0, nowIdx - 12);
  const endIdx =
    anchor === "left"
      ? Math.min(points.length, nowIdx + 25)
      : Math.min(points.length, nowIdx + 13);
  const sliced = points.slice(startIdx, endIdx);

  if (!pollen || !pollen.available) return sliced;
  const pollenMap = buildPollenHourlyMap(pollen);
  return sliced.map((p) => ({ ...p, pollen: pollenMap.get(p.t) }));
}

function buildDailyWindow(
  weather: NormalizedWeather,
  pollen: NormalizedPollen | null,
  count: number,
  anchor: ChartAnchor,
): ChartPoint[] {
  const todayMs = dayStartMs(Date.now());
  const startOffset = anchor === "left" ? 0 : -Math.floor((count - 1) / 2);
  const minMs = dayStartMs(todayMs, startOffset);
  const maxMs = dayStartMs(minMs, count);

  const dailyByDate = new Map(
    weather.daily.map((d) => [d.date.slice(0, 10), d] as const),
  );

  const points: ChartPoint[] = weather.hourly
    .map((p) => {
      const t = parseLocalISOToMs(p.time);
      const date = new Date(t);
      const dateKey = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
      const isWeatherIconHour = date.getHours() === 12;
      const daily = dailyByDate.get(dateKey);
      return {
        t,
        pressure: Math.round(p.pressure),
        temperature: Math.round(p.temperature * 10) / 10,
        precip: p.precipitation,
        precipProb: p.precipitationProbability,
        weatherCode: isWeatherIconHour ? daily?.weatherCode : undefined,
      } satisfies ChartPoint;
    })
    .filter((p) => p.t >= minMs && p.t < maxMs);

  if (!pollen || !pollen.available) return points;
  const pollenHourly = buildPollenHourlyMap(pollen);
  const pollenDaily = buildPollenDailyMap(pollen);
  return points.map((p) => {
    const hourly = pollenHourly.get(p.t);
    const fallback = pollenDaily.get(localDateStringFromMs(p.t));
    return { ...p, pollen: hourly ?? fallback };
  });
}

function dailyCountForRange(range: TimelineRange): number {
  switch (range) {
    case "3d":
      return 3;
    case "7d":
      return 7;
    case "14d":
      return 14;
    default:
      return 0;
  }
}

type Band = {
  x1: number;
  x2: number;
  fill: string;
  opacity: number;
  key: string;
};

function buildHourlyBands(data: ChartPoint[]): Band[] {
  if (data.length === 0) return [];
  const first = data[0];
  const last = data[data.length - 1];
  if (!first || !last) return [];

  const bands: Band[] = [];
  let dayMs = dayStartMs(first.t);
  while (dayMs <= last.t) {
    const dayDate = new Date(dayMs);
    const dateKey = `${dayDate.getFullYear()}-${pad2(dayDate.getMonth() + 1)}-${pad2(dayDate.getDate())}`;
    for (const part of HOURLY_BAND_BASE) {
      const x1 = new Date(
        dayDate.getFullYear(),
        dayDate.getMonth(),
        dayDate.getDate(),
        part.startHour,
      ).getTime();
      const x2 = new Date(
        dayDate.getFullYear(),
        dayDate.getMonth(),
        dayDate.getDate(),
        part.endHour,
      ).getTime();
      bands.push({
        x1,
        x2,
        fill: part.fill,
        opacity: part.opacity,
        key: `${dateKey}-${part.label}`,
      });
    }
    dayMs = dayStartMs(dayMs, 1);
  }
  return bands;
}

function renderWeatherIcon(code: number, size: number): ReactNode {
  const props = { size, color: "#5b7a62", strokeWidth: 1.6 };
  if (code === 0) return <Sun {...props} />;
  if (code <= 3) return <CloudSun {...props} />;
  if (code >= 45 && code <= 48) return <CloudFog {...props} />;
  if (code >= 51 && code <= 57) return <CloudDrizzle {...props} />;
  if (code >= 61 && code <= 67) return <CloudRain {...props} />;
  if (code >= 71 && code <= 77) return <Snowflake {...props} />;
  if (code >= 80 && code <= 82) return <CloudRain {...props} />;
  if (code >= 85 && code <= 86) return <CloudSnow {...props} />;
  if (code >= 95) return <CloudLightning {...props} />;
  return <Cloud {...props} />;
}

type ChartContext = {
  data: ChartPoint[];
  isHourly: boolean;
  nowX: number;
  bands: Band[];
  domain: [number, number];
  tickFormatter: (ms: number) => string;
  tooltipFormatter: (ms: number) => string;
  minTickGap: number;
  ticks?: number[];
  pollenAvailable: boolean;
  pollenGrayoutFromMs: number | null;
};

function rangeHalfMs(range: TimelineRange): number {
  switch (range) {
    case "24h":
      return 12 * 60 * 60 * 1000;
    case "3d":
      return 1.5 * 24 * 60 * 60 * 1000;
    case "7d":
      return 3.5 * 24 * 60 * 60 * 1000;
    case "14d":
      return 7 * 24 * 60 * 60 * 1000;
  }
}

function buildChartContext(
  weather: NormalizedWeather,
  pollen: NormalizedPollen | null,
  range: TimelineRange,
  anchor: ChartAnchor,
): ChartContext {
  const isHourly = range === "24h";
  const data = isHourly
    ? build24hWindow(weather, pollen, anchor)
    : buildDailyWindow(weather, pollen, dailyCountForRange(range), anchor);

  const nowMs = Date.now();
  const halfMs = rangeHalfMs(range);
  const first = data[0];
  const last = data[data.length - 1];
  const domain: [number, number] =
    !isHourly && first && last
      ? first.t === last.t
        ? [first.t - 12 * 60 * 60 * 1000, first.t + 12 * 60 * 60 * 1000]
        : [first.t, last.t]
      : anchor === "left"
        ? [nowMs, nowMs + 2 * halfMs]
        : [nowMs - halfMs, nowMs + halfMs];

  const pollenAvailable = pollen !== null && pollen.available;
  let pollenGrayoutFromMs: number | null = null;
  if (!pollenAvailable) {
    pollenGrayoutFromMs = domain[0];
  } else if (pollen) {
    const lastPollenMs = pollenLastAvailableMs(pollen);
    if (lastPollenMs !== null && lastPollenMs < domain[1]) {
      pollenGrayoutFromMs = lastPollenMs;
    }
  }

  return {
    data,
    isHourly,
    nowX: nowMs,
    bands: isHourly ? buildHourlyBands(data) : [],
    domain,
    tickFormatter: isHourly ? formatHourTick : formatDayTick,
    tooltipFormatter: isHourly ? formatHourTooltip : formatDayTooltip,
    minTickGap: isHourly ? 30 : 0,
    ticks: isHourly ? undefined : buildDayCenterTicks(data),
    pollenAvailable,
    pollenGrayoutFromMs,
  };
}

type Props = {
  weather: NormalizedWeather | null;
  pollen: NormalizedPollen | null;
  range: TimelineRange;
  isError?: boolean;
};

function useNowTick(intervalMs = 60_000): number {
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
}

export function WeatherChart({ weather, pollen, range, isError }: Props) {
  const chartSeries = useAppStore((s) => s.chartSeries);
  const chartAnchor = useAppStore((s) => s.chartAnchor);
  const nowMs = useNowTick();
  const nowLabel = formatNowLabel(nowMs);

  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AcornIcon />
            <CardTitle>気圧 / 気温 / 降水 / 天気 / 花粉</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-xs text-ink-400">
            {isError ? "天気データを取得できません" : "データを取得しています"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const ctx = buildChartContext(weather, pollen, range, chartAnchor);

  const showPressure = chartSeries.pressure;
  const showTemperature = chartSeries.temperature;
  const showPrecipitation = chartSeries.precipitation;
  const showWeather = chartSeries.weather;
  const showPollenChart = chartSeries.pollen;
  const visibleCount = [
    showPressure,
    showTemperature,
    showPrecipitation,
    showWeather,
    showPollenChart,
  ].filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AcornIcon />
              <CardTitle>{buildTitle(chartSeries)}</CardTitle>
            </div>
            <p className="text-[11px] leading-relaxed text-ink-400">
              24H は時刻ごと、3D / 7D / 14D は日次で傾向を見られます
            </p>
          </div>
          <TimelinePanel />
        </div>
        <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <ChartSeriesPicker showPollen showPressure />
          <ChartAnchorToggle />
        </div>
        {range === "24h" && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[10px] text-ink-400">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2.5 w-4 rounded-sm bg-pollen-100" />
              朝
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2.5 w-4 rounded-sm bg-leaf-100" />
              昼
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2.5 w-4 rounded-sm bg-dusk-100" />
              夕方
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2.5 w-4 rounded-sm bg-ink-200" />
              夜
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-0.5 w-3 bg-[#b86a6a]" />
              {nowLabel}
            </span>
          </div>
        )}
        {range === "14d" && (
          <p className="pt-1 text-[11px] leading-relaxed text-ink-500">
            14 日先までは予報の精度が下がります。「これからの傾向」の目安としてご覧ください。
          </p>
        )}
      </CardHeader>
      <CardContent>
        {visibleCount === 0 ? (
          <p className="rounded-2xl border border-dashed border-leaf-100 bg-leaf-25 px-4 py-8 text-center text-xs text-ink-400">
            上のボタンで表示する系列を選んでください
          </p>
        ) : (
          <div className="space-y-4">
            {showWeather && (
              <ChartRow
                icon={<CloudSun size={14} />}
                label="天気"
                height="h-16"
                iconPaddingTop={24}
                iconClass="bg-leaf-50 text-leaf-700"
              >
                <WeatherIconRow ctx={ctx} weather={weather} range={range} />
              </ChartRow>
            )}
            {showTemperature && (
              <ChartRow
                icon={<Thermometer size={14} />}
                label="気温"
                height="h-36"
                iconClass="bg-alert-50 text-alert-700"
              >
                <TemperatureChart ctx={ctx} />
              </ChartRow>
            )}
            {showPrecipitation && (
              <ChartRow
                icon={<CloudRain size={14} />}
                label="降水"
                height="h-28"
                iconClass="bg-rain-50 text-rain-700"
              >
                <PrecipChart ctx={ctx} />
              </ChartRow>
            )}
            {showPressure && (
              <ChartRow
                icon={<Gauge size={14} />}
                label="気圧"
                height="h-36"
                iconClass="bg-dusk-50 text-dusk-700"
              >
                <PressureChart ctx={ctx} />
              </ChartRow>
            )}
            {showPollenChart && (
              <ChartRow
                icon={<Flower size={14} />}
                label="花粉"
                height="h-24"
                iconClass="bg-pollen-50 text-pollen-700"
              >
                <PollenChart ctx={ctx} />
              </ChartRow>
            )}
          </div>
        )}
        {showPollenChart && ctx.pollenAvailable && ctx.pollenGrayoutFromMs !== null && (
          <p className="mt-2 text-[10px] leading-relaxed text-ink-400">
            花粉データは Open-Meteo Air Quality (CAMS) の都合で 5 日先までしか取得できません。グラフ右側のグレー部分はデータ未提供の範囲です。
          </p>
        )}
        {showPollenChart && !ctx.pollenAvailable && (
          <p className="mt-2 text-[10px] leading-relaxed text-ink-400">
            花粉データはこの地域では未提供です。Phase 2 で Google Pollen API などへの差し替えを検討します。
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function buildTitle(chartSeries: ChartSeriesVisibility): string {
  const parts: string[] = [];
  if (chartSeries.weather) parts.push("天気");
  if (chartSeries.temperature) parts.push("気温");
  if (chartSeries.precipitation) parts.push("降水");
  if (chartSeries.pressure) parts.push("気圧");
  if (chartSeries.pollen) parts.push("花粉");
  return parts.length > 0 ? parts.join(" / ") : "表示なし";
}

type DotProps = {
  cx?: number;
  cy?: number;
  payload?: { code?: number };
};

function WeatherIconDot({ cx, cy, payload }: DotProps) {
  if (typeof cx !== "number" || typeof cy !== "number") return null;
  const code = payload?.code;
  if (typeof code !== "number") return null;
  const size = 16;
  return (
    <g transform={`translate(${cx - size / 2}, ${cy - size / 2})`}>
      {renderWeatherIcon(code, size)}
    </g>
  );
}

type WeatherRowPoint = { t: number; weatherY: number; code: number };

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

function subscribeViewport(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getIsMobileSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

function sampleWeatherRowPoints(
  data: WeatherRowPoint[],
  isHourly: boolean,
  isMobile: boolean,
): WeatherRowPoint[] {
  if (!isHourly || data.length <= 10) return data;

  const step = isMobile ? 3 : 2;
  const sampled = data.filter((_, index) => index % step === 0);
  const last = data[data.length - 1];
  if (last && sampled[sampled.length - 1]?.t !== last.t) {
    sampled.push(last);
  }
  return sampled;
}

function buildHourlyIconPoints(
  weather: NormalizedWeather,
  domain: [number, number],
  stepHours: number,
): WeatherRowPoint[] {
  const stepMs = stepHours * 60 * 60 * 1000;
  const out: WeatherRowPoint[] = [];
  for (const p of weather.hourly) {
    const t = parseLocalISOToMs(p.time);
    if (t < domain[0] || t > domain[1]) continue;
    if (typeof p.weatherCode !== "number") continue;
    const last = out[out.length - 1];
    if (last && t - last.t < stepMs) continue;
    out.push({ t, weatherY: 0.5, code: p.weatherCode });
  }
  return out;
}

function WeatherIconRow({
  ctx,
  weather,
  range,
}: {
  ctx: ChartContext;
  weather: NormalizedWeather;
  range: TimelineRange;
}) {
  const isMobile = useSyncExternalStore(
    subscribeViewport,
    getIsMobileSnapshot,
    () => false,
  );
  const data =
    range === "3d"
      ? buildHourlyIconPoints(weather, ctx.domain, isMobile ? 6 : 4)
      : sampleWeatherRowPoints(
          ctx.data
            .filter((p) => typeof p.weatherCode === "number")
            .map((p) => ({
              t: p.t,
              weatherY: 0.5,
              code: p.weatherCode as number,
            })),
          ctx.isHourly,
          isMobile,
        );

  return (
    <ChartFrame>
      <LineChart
        data={data}
        margin={{ top: 24, right: 8, left: 0, bottom: 0 }}
      >
        <XAxis
          {...commonAxisProps(ctx)}
          tick={false}
          axisLine={false}
          height={0}
        />
        <YAxis
          width={Y_AXIS_WIDTH}
          domain={[0, 1]}
          tick={false}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={false}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const point = payload[0]?.payload as
              | { t?: number; code?: number }
              | undefined;
            const ts =
              typeof label === "number"
                ? label
                : typeof point?.t === "number"
                  ? point.t
                  : null;
            const code = point?.code;
            return (
              <div
                className="rounded-xl border border-[#dce6d8] bg-white px-2.5 py-2 text-xs leading-snug shadow-sm"
                style={{ minWidth: 120 }}
              >
                {ts !== null && (
                  <p className="text-ink-700">{ctx.tooltipFormatter(ts)}</p>
                )}
                <p className="mt-0.5 text-ink-500">
                  天気：
                  <span className="text-ink-700">{weatherCodeLabel(code)}</span>
                </p>
              </div>
            );
          }}
        />
        {ctx.bands.map((b) => (
          <ReferenceArea
            key={b.key}
            x1={b.x1}
            x2={b.x2}
            fill={b.fill}
            fillOpacity={b.opacity}
            ifOverflow="hidden"
          />
        ))}
        <ReferenceLine
          x={ctx.nowX}
          stroke={NOW_LINE_COLOR}
          strokeOpacity={0.65}
          strokeDasharray="4 3"
          strokeWidth={1.5}
          ifOverflow="extendDomain"
          label={{
            value: formatNowLabel(ctx.nowX),
            position: "top",
            offset: 11,
            fill: NOW_LINE_COLOR,
            fontSize: 10,
          }}
        />
        <Line
          dataKey="weatherY"
          stroke="transparent"
          dot={<WeatherIconDot />}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartFrame>
  );
}

function ChartRow({
  icon,
  label,
  height,
  iconPaddingTop = 0,
  iconClass = "bg-leaf-50 text-leaf-700",
  children,
}: {
  icon: ReactNode;
  label: string;
  height: string;
  iconPaddingTop?: number;
  iconClass?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-stretch gap-2">
      <div
        className="flex w-10 flex-col items-center justify-center gap-0.5 text-ink-500"
        style={iconPaddingTop ? { paddingTop: iconPaddingTop } : undefined}
      >
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${iconClass}`}
        >
          {icon}
        </span>
        <span className="text-[9px] leading-none tracking-wider">{label}</span>
      </div>
      <div className={`min-w-0 flex-1 ${height}`}>{children}</div>
    </div>
  );
}

function ChartFrame({ children }: { children: ReactElement }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [hasSize, setHasSize] = useState(false);
  const ready = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getServerMountedSnapshot,
  );

  useEffect(() => {
    if (!ready) return;
    const frame = frameRef.current;
    if (!frame) return;

    let animationFrame = 0;
    const updateSize = () => {
      animationFrame = 0;
      const { width, height } = frame.getBoundingClientRect();
      setHasSize((current) => {
        const next = width > 0 && height > 0;
        return current === next ? current : next;
      });
    };
    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateSize);
    };

    scheduleUpdate();
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleUpdate)
        : null;
    observer?.observe(frame);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      observer?.disconnect();
    };
  }, [ready]);

  return (
    <div
      ref={frameRef}
      className="h-full min-h-px w-full min-w-px"
    >
      {ready && hasSize && (
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={1}
          minHeight={1}
        >
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
}

function subscribeMounted() {
  return () => undefined;
}

function getMountedSnapshot() {
  return true;
}

function getServerMountedSnapshot() {
  return false;
}

function commonAxisProps(ctx: ChartContext) {
  return {
    type: "number" as const,
    scale: "time" as const,
    dataKey: "t" as const,
    domain: ctx.domain,
    tickFormatter: ctx.tickFormatter,
    minTickGap: ctx.minTickGap,
    tick: { fill: "#8d938a", fontSize: 11 },
    axisLine: { stroke: "#dce6d8" },
    tickLine: false,
    padding: ctx.isHourly ? { left: 12, right: 12 } : { left: 0, right: 0 },
    ...(ctx.ticks
      ? { ticks: ctx.ticks, interval: 0 as const }
      : {}),
  };
}

function commonOverlays(ctx: ChartContext, yAxisId?: string, withLabel = false) {
  const axisProp = yAxisId ? { yAxisId } : {};
  const overlays: ReactElement[] = ctx.bands.map((b) => (
    <ReferenceArea
      key={b.key}
      x1={b.x1}
      x2={b.x2}
      fill={b.fill}
      fillOpacity={b.opacity}
      ifOverflow="hidden"
      {...axisProp}
    />
  ));
  overlays.push(
    <ReferenceLine
      key="now"
      x={ctx.nowX}
      stroke={NOW_LINE_COLOR}
      strokeOpacity={0.65}
      strokeDasharray="4 3"
      strokeWidth={1.5}
      ifOverflow="extendDomain"
      {...axisProp}
      {...(withLabel
        ? {
            label: {
              value: formatNowLabel(ctx.nowX),
              position: "top",
              fill: NOW_LINE_COLOR,
              fontSize: 10,
            },
          }
        : {})}
    />,
  );
  return overlays;
}

function PressureChart({ ctx }: { ctx: ChartContext }) {
  return (
    <ChartFrame>
      <LineChart
        data={ctx.data}
        margin={{ top: 16, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="#e8efe6" vertical={false} />
        <XAxis {...commonAxisProps(ctx)} />
        <YAxis
          yAxisId="p"
          domain={["dataMin - 2", "dataMax + 2"]}
          tick={{ fill: "#8d938a", fontSize: 11 }}
          width={Y_AXIS_WIDTH}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ stroke: "#c1d3bc", strokeDasharray: "3 3" }}
          labelFormatter={(value) => ctx.tooltipFormatter(value as number)}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #dce6d8",
            fontSize: 12,
          }}
        />
        {commonOverlays(ctx, "p", false)}
        <Line
          yAxisId="p"
          type="monotone"
          dataKey="pressure"
          stroke="#4a5278"
          strokeWidth={2}
          dot={false}
          name="気圧 (hPa)"
        />
      </LineChart>
    </ChartFrame>
  );
}

function TemperatureChart({ ctx }: { ctx: ChartContext }) {
  return (
    <ChartFrame>
      <AreaChart
        data={ctx.data}
        margin={{ top: 14, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e08a8a" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#e08a8a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e8efe6" vertical={false} />
        <XAxis {...commonAxisProps(ctx)} />
        <YAxis
          tick={{ fill: "#8d938a", fontSize: 11 }}
          width={Y_AXIS_WIDTH}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ stroke: "#c1d3bc", strokeDasharray: "3 3" }}
          labelFormatter={(value) => ctx.tooltipFormatter(value as number)}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #dce6d8",
            fontSize: 12,
          }}
        />
        {commonOverlays(ctx, undefined, false)}
        <Area
          type="monotone"
          dataKey="temperature"
          stroke="#e08a8a"
          fill="url(#tempFill)"
          strokeWidth={2}
          name="気温 (℃)"
        />
      </AreaChart>
    </ChartFrame>
  );
}

function PrecipChart({ ctx }: { ctx: ChartContext }) {
  return (
    <ChartFrame>
      <AreaChart
        data={ctx.data}
        margin={{ top: 6, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c9bd2" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#6c9bd2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e8efe6" vertical={false} />
        <XAxis {...commonAxisProps(ctx)} />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#8d938a", fontSize: 11 }}
          width={Y_AXIS_WIDTH}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ stroke: "#c1d3bc", strokeDasharray: "3 3" }}
          labelFormatter={(value) => ctx.tooltipFormatter(value as number)}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #dce6d8",
            fontSize: 12,
          }}
        />
        {commonOverlays(ctx)}
        <Area
          type="monotone"
          dataKey="precipProb"
          stroke="#6c9bd2"
          fill="url(#rainFill)"
          strokeWidth={2}
          name="降水確率 (%)"
        />
      </AreaChart>
    </ChartFrame>
  );
}

function PollenChart({ ctx }: { ctx: ChartContext }) {
  return (
    <ChartFrame>
      <AreaChart
        data={ctx.data}
        margin={{ top: 6, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="pollenFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e6b85c" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#e6b85c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e8efe6" vertical={false} />
        <XAxis {...commonAxisProps(ctx)} />
        <YAxis
          domain={[0, "auto"]}
          tick={{ fill: "#8d938a", fontSize: 11 }}
          width={Y_AXIS_WIDTH}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ stroke: "#c1d3bc", strokeDasharray: "3 3" }}
          labelFormatter={(value) => ctx.tooltipFormatter(value as number)}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #dce6d8",
            fontSize: 12,
          }}
        />
        {ctx.pollenGrayoutFromMs !== null && (
          <ReferenceArea
            x1={ctx.pollenGrayoutFromMs}
            x2={ctx.domain[1]}
            fill="#cdd1c9"
            fillOpacity={0.35}
            ifOverflow="hidden"
            label={{
              value: ctx.pollenAvailable
                ? "データ未提供"
                : "データを取得できません",
              position: "center",
              fill: "#6f766d",
              fontSize: 10,
            }}
          />
        )}
        {commonOverlays(ctx)}
        <Area
          type="monotone"
          dataKey="pollen"
          stroke="#b08e3f"
          fill="url(#pollenFill)"
          strokeWidth={2}
          name="花粉 (粒/m³)"
          connectNulls={false}
        />
      </AreaChart>
    </ChartFrame>
  );
}
