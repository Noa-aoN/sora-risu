import type { SkyLetter } from "@/types/recommendation";
import type { WeatherCondition } from "@/types/weather";

import {
  CALM,
  HEAVY_RAIN,
  HIGH_POLLEN,
  NO_DATA,
  PRESSURE_SWING,
  TEMP_SWING,
  type LetterPattern,
  type Season,
} from "./letterMessages";

function dayIndex(date: Date = new Date()): number {
  return Math.floor(date.getTime() / 86_400_000);
}

function seasonOf(date: Date): Season {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

function pickFromPattern(
  pattern: LetterPattern,
  date: Date = new Date(),
): SkyLetter {
  const season = seasonOf(date);
  const seasonal = pattern.seasonalBodies?.[season] ?? [];
  const pool = [...pattern.bodies, ...seasonal];
  const idx = dayIndex(date) % pool.length;
  const body = pool[idx] ?? pool[0]!;
  return {
    title: pattern.title,
    tone: pattern.tone,
    category: pattern.category,
    body,
  };
}

function pickPattern(conditions: WeatherCondition[]): LetterPattern {
  const hasBigPressureSwing = conditions.some(
    (c) => c.pressure.changeLevel === "high",
  );
  if (hasBigPressureSwing) return PRESSURE_SWING;

  const hasHeavyRain = conditions.some((c) => c.precipitation.level === "high");
  if (hasHeavyRain) return HEAVY_RAIN;

  const hasHighPollen = conditions.some(
    (c) => c.pollen.level === "high" || c.pollen.level === "very_high",
  );
  if (hasHighPollen) return HIGH_POLLEN;

  const tempValues = conditions.map((c) => c.temperature.value);
  const tempMax = tempValues.length ? Math.max(...tempValues) : 0;
  const tempMin = tempValues.length ? Math.min(...tempValues) : 0;
  if (tempMax - tempMin >= 8) return TEMP_SWING;

  return CALM;
}

export function buildSkyLetter(conditions: WeatherCondition[]): SkyLetter {
  if (conditions.length === 0) return pickFromPattern(NO_DATA);
  return pickFromPattern(pickPattern(conditions));
}
