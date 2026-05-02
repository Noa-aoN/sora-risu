"use client";

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
import type { NormalizedWeather } from "@/types/weather";

type ChartPoint = {
  label: string;
  pressure: number;
  temperature: number;
  precip: number;
  precipProb: number;
};

const HOURLY_SLOT_BANDS: Array<{
  x1: string;
  x2: string;
  fill: string;
  opacity: number;
  label: string;
}> = [
  { x1: "06時", x2: "11時", fill: "#dde6d8", opacity: 0.22, label: "朝" },
  { x1: "11時", x2: "15時", fill: "#dde6d8", opacity: 0.36, label: "昼" },
  { x1: "15時", x2: "19時", fill: "#dde6d8", opacity: 0.22, label: "晩" },
  { x1: "19時", x2: "23時", fill: "#cdd1c9", opacity: 0.18, label: "夜" },
];

const NOW_LINE_COLOR = "#b86a6a";

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function currentHourLabel(): string {
  return `${pad2(new Date().getHours())}時`;
}

function todayDateLabel(): string {
  const d = new Date();
  return `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`;
}

function hourlyOverlays(yAxisId?: string, withLabel = false) {
  const now = currentHourLabel();
  const axisProp = yAxisId ? { yAxisId } : {};
  const elements = [
    ...HOURLY_SLOT_BANDS.map((band) => (
      <ReferenceArea
        key={`band-${band.label}`}
        x1={band.x1}
        x2={band.x2}
        fill={band.fill}
        fillOpacity={band.opacity}
        ifOverflow="hidden"
        {...axisProp}
      />
    )),
    <ReferenceLine
      key="now"
      x={now}
      stroke={NOW_LINE_COLOR}
      strokeOpacity={0.65}
      strokeDasharray="4 3"
      strokeWidth={1.5}
      ifOverflow="extendDomain"
      {...axisProp}
      {...(withLabel
        ? {
            label: {
              value: "現在",
              position: "top",
              fill: NOW_LINE_COLOR,
              fontSize: 10,
            },
          }
        : {})}
    />,
  ];
  return elements;
}

function dailyOverlays(yAxisId?: string, withLabel = false) {
  const today = todayDateLabel();
  const axisProp = yAxisId ? { yAxisId } : {};
  return [
    <ReferenceLine
      key="today"
      x={today}
      stroke={NOW_LINE_COLOR}
      strokeOpacity={0.65}
      strokeDasharray="4 3"
      strokeWidth={1.5}
      ifOverflow="extendDomain"
      {...axisProp}
      {...(withLabel
        ? {
            label: {
              value: "今日",
              position: "top",
              fill: NOW_LINE_COLOR,
              fontSize: 10,
            },
          }
        : {})}
    />,
  ];
}

function buildHourlyChartData(weather: NormalizedWeather): ChartPoint[] {
  return weather.hourly.slice(0, 24).map((p) => ({
    label: p.time.slice(11, 13) + "時",
    pressure: Math.round(p.pressure),
    temperature: Math.round(p.temperature * 10) / 10,
    precip: p.precipitation,
    precipProb: p.precipitationProbability,
  }));
}

function buildDailyChartData(
  weather: NormalizedWeather,
  count: number,
): ChartPoint[] {
  return weather.daily.slice(0, count).map((d) => ({
    label: d.date.slice(5).replace("-", "/"),
    pressure: 1013,
    temperature: Math.round((d.tempMax + d.tempMin) / 2),
    precip: d.precipitationSum,
    precipProb: d.precipitationProbabilityMax,
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

type Props = {
  weather: NormalizedWeather | null;
  range: TimelineRange;
};

export function WeatherChart({ weather, range }: Props) {
  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>気圧と気温の流れ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-xs text-ink-400">
            データを取得しています
          </div>
        </CardContent>
      </Card>
    );
  }

  const data =
    range === "24h"
      ? buildHourlyChartData(weather)
      : buildDailyChartData(weather, dailyCountForRange(range));

  const xInterval =
    range === "24h" ? 2 : range === "14d" ? 1 : 0;

  const overlays = (yAxisId?: string, withLabel = false) =>
    range === "24h"
      ? hourlyOverlays(yAxisId, withLabel)
      : dailyOverlays(yAxisId, withLabel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>気圧 / 気温 / 降水</CardTitle>
        {range === "24h" && (
          <div className="flex items-center gap-3 pt-1 text-[10px] text-ink-400">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-leaf-100" />
              朝・晩
            </span>
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2 w-3 rounded-sm bg-leaf-100"
                style={{ opacity: 1 }}
              />
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {range === "14d" && (
            <p className="rounded-2xl bg-leaf-25 px-4 py-2.5 text-[11px] leading-relaxed text-ink-500">
              14 日先までは予報の精度が下がります。「これからの傾向」の目安としてご覧ください。
            </p>
          )}
          {range === "24h" && (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid stroke="#e8efe6" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#8d938a", fontSize: 11 }}
                    interval={2}
                    axisLine={{ stroke: "#dce6d8" }}
                    tickLine={false}
                  />
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
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #dce6d8",
                      fontSize: 12,
                    }}
                  />
                  {overlays("p", true)}
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
            </div>
          )}

          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#86a48b" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#86a48b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e8efe6" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#8d938a", fontSize: 11 }}
                  interval={xInterval}
                  axisLine={{ stroke: "#dce6d8" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8d938a", fontSize: 11 }}
                  width={36}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ stroke: "#c1d3bc", strokeDasharray: "3 3" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #dce6d8",
                    fontSize: 12,
                  }}
                />
                {overlays(undefined, range !== "24h")}
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
          </div>

          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6c9bd2" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#6c9bd2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e8efe6" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#8d938a", fontSize: 11 }}
                  interval={xInterval}
                  axisLine={{ stroke: "#dce6d8" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#8d938a", fontSize: 11 }}
                  width={36}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ stroke: "#c1d3bc", strokeDasharray: "3 3" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #dce6d8",
                    fontSize: 12,
                  }}
                />
                {overlays()}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
