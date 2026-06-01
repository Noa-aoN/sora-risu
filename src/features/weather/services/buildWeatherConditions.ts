import type { TimeSlot } from "@/types/timeline";
import type {
  ChangeLevel,
  DailyPoint,
  HourlyPoint,
  NormalizedPollen,
  NormalizedWeather,
  PollenHourlyPoint,
  PollenLevel,
  PrecipLevel,
  PressureTrend,
  WeatherCondition,
} from "@/types/weather";

function parseLocalISO(s: string): number {
  const parts = s.split("T");
  const datePart = parts[0] ?? s;
  const timePart = parts[1] ?? "00:00";
  const dateSegments = datePart.split("-").map(Number);
  const timeSegments = timePart.split(":").map(Number);
  const y = dateSegments[0] ?? 1970;
  const m = dateSegments[1] ?? 1;
  const d = dateSegments[2] ?? 1;
  const hh = timeSegments[0] ?? 0;
  const mm = timeSegments[1] ?? 0;
  return new Date(y, m - 1, d, hh, mm).getTime();
}

function pickHourlyInSlot<T extends { time: string }>(
  points: T[],
  slot: TimeSlot,
): T[] {
  const start = parseLocalISO(slot.start);
  const end = parseLocalISO(slot.end);
  return points.filter((p) => {
    const t = parseLocalISO(p.time);
    return t >= start && t < end;
  });
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function pickDailyForSlot(
  daily: DailyPoint[],
  slot: TimeSlot,
): DailyPoint | undefined {
  const date = slot.start.slice(0, 10);
  return daily.find((d) => d.date === date);
}

function classifyPressureTrend(points: HourlyPoint[]): {
  trend: PressureTrend;
  changeLevel: ChangeLevel;
} {
  if (points.length < 2) return { trend: "stable", changeLevel: "low" };
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) return { trend: "stable", changeLevel: "low" };
  const diff = last.pressure - first.pressure;
  const abs = Math.abs(diff);
  const trend: PressureTrend =
    abs < 0.8 ? "stable" : diff > 0 ? "rising" : "falling";
  const changeLevel: ChangeLevel = abs >= 4 ? "high" : abs >= 2 ? "medium" : "low";
  return { trend, changeLevel };
}

function classifyPrecip(probability: number, amount: number): PrecipLevel {
  if (amount >= 5) return "high";
  if (amount >= 1) return "medium";
  if (amount >= 0.1 || probability >= 50) return "low";
  return "none";
}

function classifyWind(speed: number): ChangeLevel {
  if (speed < 4) return "low";
  if (speed < 8) return "medium";
  return "high";
}

function classifyPollenValue(v: number): PollenLevel {
  if (v <= 0) return "none";
  if (v < 10) return "low";
  if (v < 50) return "medium";
  if (v < 200) return "high";
  return "very_high";
}

const POLLEN_LEVEL_ORDER: PollenLevel[] = [
  "none",
  "low",
  "medium",
  "high",
  "very_high",
  "unknown",
];

function maxPollenLevel(levels: PollenLevel[]): PollenLevel {
  let result: PollenLevel = "none";
  for (const l of levels) {
    if (l === "unknown") continue;
    if (POLLEN_LEVEL_ORDER.indexOf(l) > POLLEN_LEVEL_ORDER.indexOf(result)) {
      result = l;
    }
  }
  return result;
}

const POLLEN_TYPE_LABELS: Record<keyof Omit<PollenHourlyPoint, "time">, string> = {
  alder: "ハンノキ",
  birch: "シラカバ",
  grass: "イネ科",
  mugwort: "ヨモギ",
  olive: "オリーブ",
  ragweed: "ブタクサ",
};

function summarizePollen(
  pollen: NormalizedPollen | null,
  slot: TimeSlot,
): { level: PollenLevel; types: string[] } {
  if (!pollen || !pollen.available) {
    return { level: "unknown", types: [] };
  }
  const points = pickHourlyInSlot(pollen.hourly, slot);
  if (points.length === 0) return { level: "unknown", types: [] };

  const perType: Record<keyof typeof POLLEN_TYPE_LABELS, PollenLevel> = {
    alder: "none",
    birch: "none",
    grass: "none",
    mugwort: "none",
    olive: "none",
    ragweed: "none",
  };

  for (const key of Object.keys(POLLEN_TYPE_LABELS) as Array<
    keyof typeof POLLEN_TYPE_LABELS
  >) {
    const values = points
      .map((p) => p[key])
      .filter((v): v is number => v !== null);
    if (values.length === 0) continue;
    const peak = Math.max(...values);
    perType[key] = classifyPollenValue(peak);
  }

  const types = (Object.keys(perType) as Array<keyof typeof perType>)
    .filter((k) => POLLEN_LEVEL_ORDER.indexOf(perType[k]) >= 2)
    .map((k) => POLLEN_TYPE_LABELS[k]);

  return {
    level: maxPollenLevel(Object.values(perType)),
    types,
  };
}

function buildHourlyCondition(
  slot: TimeSlot,
  weather: NormalizedWeather,
  pollen: NormalizedPollen | null,
): WeatherCondition {
  const points = pickHourlyInSlot(weather.hourly, slot);
  const pressureClass = classifyPressureTrend(points);
  const avgTemp = average(points.map((p) => p.temperature));
  const avgFeel = points.length
    ? average(points.map((p) => p.apparentTemperature))
    : avgTemp;
  const precipProb = points.length
    ? Math.max(...points.map((p) => p.precipitationProbability))
    : 0;
  const precipAmount = points.reduce((a, b) => a + b.precipitation, 0);
  const windSpeed = points.length
    ? Math.max(...points.map((p) => p.windSpeed))
    : 0;
  const humidity = average(points.map((p) => p.humidity));
  const midPoint = points[Math.floor(points.length / 2)];

  return {
    slotId: slot.id,
    pressure: {
      value: midPoint?.pressure ?? 1013,
      trend: pressureClass.trend,
      changeLevel: pressureClass.changeLevel,
    },
    temperature: { value: Math.round(avgTemp), feelsLike: Math.round(avgFeel) },
    precipitation: {
      probability: Math.round(precipProb),
      amount: Math.round(precipAmount * 10) / 10,
      level: classifyPrecip(precipProb, precipAmount),
    },
    pollen: summarizePollen(pollen, slot),
    wind: { speed: Math.round(windSpeed * 10) / 10, level: classifyWind(windSpeed) },
    humidity: { value: Math.round(humidity) },
    weatherCode: midPoint?.weatherCode,
  };
}

function buildDailyCondition(
  slot: TimeSlot,
  weather: NormalizedWeather,
  pollen: NormalizedPollen | null,
): WeatherCondition {
  const day = pickDailyForSlot(weather.daily, slot);
  const points = pickHourlyInSlot(weather.hourly, slot);
  const pressureClass = classifyPressureTrend(points);
  const midPoint = points[Math.floor(points.length / 2)];
  const tempMax = day?.tempMax ?? Math.max(...points.map((p) => p.temperature), 0);
  const tempMin = day?.tempMin ?? Math.min(...points.map((p) => p.temperature), 0);
  const precipProb = day?.precipitationProbabilityMax ?? 0;
  const precipAmount = day?.precipitationSum ?? 0;
  const windSpeed = points.length
    ? Math.max(...points.map((p) => p.windSpeed))
    : 0;

  return {
    slotId: slot.id,
    pressure: {
      value: midPoint?.pressure ?? 1013,
      trend: pressureClass.trend,
      changeLevel: pressureClass.changeLevel,
    },
    temperature: {
      value: Math.round((tempMax + tempMin) / 2),
      min: Math.round(tempMin),
      max: Math.round(tempMax),
      feelsLike: points.length
        ? Math.round(average(points.map((p) => p.apparentTemperature)))
        : Math.round((tempMax + tempMin) / 2),
    },
    precipitation: {
      probability: Math.round(precipProb),
      amount: Math.round(precipAmount * 10) / 10,
      level: classifyPrecip(precipProb, precipAmount),
    },
    pollen: summarizePollen(pollen, slot),
    wind: {
      speed: Math.round(windSpeed * 10) / 10,
      level: classifyWind(windSpeed),
    },
    humidity: { value: Math.round(average(points.map((p) => p.humidity))) },
    weatherCode: day?.weatherCode,
  };
}

export function buildWeatherConditions(
  slots: TimeSlot[],
  weather: NormalizedWeather,
  pollen: NormalizedPollen | null,
): WeatherCondition[] {
  return slots.map((slot) =>
    slot.period === "daily"
      ? buildDailyCondition(slot, weather, pollen)
      : buildHourlyCondition(slot, weather, pollen),
  );
}
