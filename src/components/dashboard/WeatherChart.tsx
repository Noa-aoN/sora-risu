"use client";

import { CloudRain, Flower, Gauge, Thermometer } from "lucide-react";
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
};

const HOURLY_BAND_BASE = [
  { startHour: 6, endHour: 11, fill: "#dde6d8", opacity: 0.22, label: "朝" },
  { startHour: 11, endHour: 15, fill: "#dde6d8", opacity: 0.36, label: "昼" },
  { startHour: 15, endHour: 19, fill: "#dde6d8", opacity: 0.22, label: "晩" },
  { startHour: 19, endHour: 24, fill: "#cdd1c9", opacity: 0.18, label: "夜" },
];

const NOW_LINE_COLOR = "#b86a6a";
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

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

function todayMidnightMs(): number {
  return dayStartMs(Date.now());
}

function formatHourTick(ms: number): string {
  return pad2(new Date(ms).getHours()) + "時";
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
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]})`;
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
): ChartPoint[] {
  const points: ChartPoint[] = weather.hourly.map((p) => ({
    t: parseLocalISOToMs(p.time),
    pressure: Math.round(p.pressure),
    temperature: Math.round(p.temperature * 10) / 10,
    precip: p.precipitation,
    precipProb: p.precipitationProbability,
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

  const startIdx = Math.max(0, nowIdx - 12);
  const endIdx = Math.min(points.length, nowIdx + 13);
  const sliced = points.slice(startIdx, endIdx);

  if (!pollen || !pollen.available) return sliced;
  const pollenMap = buildPollenHourlyMap(pollen);
  return sliced.map((p) => ({ ...p, pollen: pollenMap.get(p.t) }));
}

function buildDailyWindow(
  weather: NormalizedWeather,
  pollen: NormalizedPollen | null,
  count: number,
): ChartPoint[] {
  const points: ChartPoint[] = weather.daily.map((d) => ({
    t: parseLocalISOToMs(d.date),
    pressure: 1013,
    temperature: Math.round((d.tempMax + d.tempMin) / 2),
    precip: d.precipitationSum,
    precipProb: d.precipitationProbabilityMax,
  }));

  if (points.length === 0) return points;

  const todayMs = todayMidnightMs();
  let todayIdx = points.findIndex((p) => p.t === todayMs);
  if (todayIdx < 0) todayIdx = 0;

  const halfBefore = Math.floor((count - 1) / 2);
  const halfAfter = count - 1 - halfBefore;
  const startIdx = Math.max(0, todayIdx - halfBefore);
  const endIdx = Math.min(points.length, todayIdx + halfAfter + 1);
  const sliced = points.slice(startIdx, endIdx);

  if (!pollen || !pollen.available) return sliced;
  const pollenDailyMap = buildPollenDailyMap(pollen);
  return sliced.map((p) => ({
    ...p,
    pollen: pollenDailyMap.get(localDateStringFromMs(p.t)),
  }));
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

type ChartContext = {
  data: ChartPoint[];
  isHourly: boolean;
  nowX: number;
  bands: Band[];
  domain: [number, number];
  tickFormatter: (ms: number) => string;
  tooltipFormatter: (ms: number) => string;
  minTickGap: number;
  showPollen: boolean;
  pollenGrayoutFromMs: number | null;
};

function buildChartContext(
  weather: NormalizedWeather,
  pollen: NormalizedPollen | null,
  range: TimelineRange,
): ChartContext {
  const isHourly = range === "24h";
  const data = isHourly
    ? build24hWindow(weather, pollen)
    : buildDailyWindow(weather, pollen, dailyCountForRange(range));

  const first = data[0];
  const last = data[data.length - 1];
  const domain: [number, number] = [
    first?.t ?? Date.now(),
    last?.t ?? Date.now(),
  ];

  const showPollen = pollen !== null && pollen.available;
  let pollenGrayoutFromMs: number | null = null;
  if (showPollen && pollen) {
    const lastPollenMs = pollenLastAvailableMs(pollen);
    if (lastPollenMs !== null && lastPollenMs < domain[1]) {
      pollenGrayoutFromMs = lastPollenMs;
    }
  }

  return {
    data,
    isHourly,
    nowX: isHourly ? Date.now() : todayMidnightMs(),
    bands: isHourly ? buildHourlyBands(data) : [],
    domain,
    tickFormatter: isHourly ? formatHourTick : formatDayTick,
    tooltipFormatter: isHourly ? formatHourTooltip : formatDayTooltip,
    minTickGap: isHourly ? 30 : range === "14d" ? 60 : 0,
    showPollen,
    pollenGrayoutFromMs,
  };
}

type Props = {
  weather: NormalizedWeather | null;
  pollen: NormalizedPollen | null;
  range: TimelineRange;
};

export function WeatherChart({ weather, pollen, range }: Props) {
  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>気圧 / 気温 / 降水 / 花粉</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-xs text-ink-400">
            データを取得しています
          </div>
        </CardContent>
      </Card>
    );
  }

  const ctx = buildChartContext(weather, pollen, range);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {ctx.showPollen ? "気圧 / 気温 / 降水 / 花粉" : "気圧 / 気温 / 降水"}
        </CardTitle>
        {range === "24h" && (
          <div className="flex items-center gap-3 pt-1 text-[10px] text-ink-400">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-leaf-100" />
              朝・晩
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-leaf-100 opacity-100" />
              昼
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-ink-200" />
              夜
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-0.5 w-3 bg-[#b86a6a]" />
              現在
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
        <div className="space-y-4">
          {ctx.isHourly && (
            <ChartRow icon={<Gauge size={14} />} label="気圧" height="h-40">
              <PressureChart ctx={ctx} />
            </ChartRow>
          )}
          <ChartRow icon={<Thermometer size={14} />} label="気温" height="h-36">
            <TemperatureChart ctx={ctx} />
          </ChartRow>
          <ChartRow icon={<CloudRain size={14} />} label="降水" height="h-28">
            <PrecipChart ctx={ctx} />
          </ChartRow>
          {ctx.showPollen && (
            <ChartRow icon={<Flower size={14} />} label="花粉" height="h-24">
              <PollenChart ctx={ctx} />
            </ChartRow>
          )}
        </div>
        {ctx.pollenGrayoutFromMs !== null && (
          <p className="mt-2 text-[10px] leading-relaxed text-ink-400">
            花粉データは Open-Meteo Air Quality (CAMS) の都合で 5 日先までしか取得できません。グラフ右側のグレー部分はデータ未提供の範囲です。
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ChartRow({
  icon,
  label,
  height,
  children,
}: {
  icon: ReactNode;
  label: string;
  height: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-stretch gap-2">
      <div className="flex w-10 flex-col items-center justify-center gap-1 text-ink-500">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-leaf-50 text-leaf-700">
          {icon}
        </span>
        <span className="text-[9px] tracking-wider">{label}</span>
      </div>
      <div className={`flex-1 ${height}`}>{children}</div>
    </div>
  );
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
    padding: { left: 12, right: 12 },
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
              value: ctx.isHourly ? "現在" : "今日",
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
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={ctx.data}
        margin={{ top: 16, right: 8, left: -8, bottom: 0 }}
      >
        <CartesianGrid stroke="#e8efe6" vertical={false} />
        <XAxis {...commonAxisProps(ctx)} />
        <YAxis
          yAxisId="p"
          domain={["dataMin - 2", "dataMax + 2"]}
          tick={{ fill: "#8d938a", fontSize: 11 }}
          width={36}
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
        {commonOverlays(ctx, "p", true)}
        <Line
          yAxisId="p"
          type="monotone"
          dataKey="pressure"
          stroke="#5b7a62"
          strokeWidth={2}
          dot={false}
          name="気圧 (hPa)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function TemperatureChart({ ctx }: { ctx: ChartContext }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={ctx.data}
        margin={{ top: 14, right: 8, left: -8, bottom: 0 }}
      >
        <defs>
          <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86a48b" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#86a48b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e8efe6" vertical={false} />
        <XAxis {...commonAxisProps(ctx)} />
        <YAxis
          tick={{ fill: "#8d938a", fontSize: 11 }}
          width={36}
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
        {commonOverlays(ctx, undefined, !ctx.isHourly)}
        <Area
          type="monotone"
          dataKey="temperature"
          stroke="#6f8f75"
          fill="url(#tempFill)"
          strokeWidth={2}
          name="気温 (℃)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function PrecipChart({ ctx }: { ctx: ChartContext }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={ctx.data}
        margin={{ top: 6, right: 8, left: -8, bottom: 0 }}
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
          width={36}
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
    </ResponsiveContainer>
  );
}

function PollenChart({ ctx }: { ctx: ChartContext }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={ctx.data}
        margin={{ top: 6, right: 8, left: -8, bottom: 0 }}
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
          width={36}
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
              value: "データ未提供",
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
    </ResponsiveContainer>
  );
}
