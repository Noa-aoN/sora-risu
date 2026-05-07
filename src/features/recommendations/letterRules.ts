import type { SkyLetter } from "@/types/recommendation";
import type { NormalizedWeather, WeatherCondition } from "@/types/weather";
import { isFogCode, isSnowCode, isThunderstormCode } from "../../lib/labels.ts";

import {
  CALM,
  EXTREME_COLD,
  EXTREME_HEAT,
  FOG_DAY,
  HEAVY_RAIN,
  HIGH_POLLEN,
  NO_DATA,
  PRESSURE_SWING,
  SNOW_DAY,
  TEMP_SWING,
  THUNDERSTORM,
  type LetterPattern,
  type Season,
} from "./letterMessages.ts";

function dayHasCode(
  conditions: WeatherCondition[],
  weather: NormalizedWeather | null,
  predicate: (code: number) => boolean,
): boolean {
  if (
    conditions.some(
      (c) => c.weatherCode !== undefined && predicate(c.weatherCode),
    )
  ) {
    return true;
  }
  const day = weather?.daily[0];
  if (day && predicate(day.weatherCode)) return true;
  if (day && weather) {
    const dateStr = day.date;
    if (
      weather.hourly.some(
        (p) => p.time.startsWith(dateStr) && predicate(p.weatherCode),
      )
    ) {
      return true;
    }
  }
  return false;
}

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

function pickPattern(
  conditions: WeatherCondition[],
  weather: NormalizedWeather | null,
): LetterPattern {
  const hasBigPressureSwing = conditions.some(
    (c) => c.pressure.changeLevel === "high",
  );
  if (hasBigPressureSwing) return PRESSURE_SWING;

  if (dayHasCode(conditions, weather, isThunderstormCode)) return THUNDERSTORM;

  const dailyTempMax = weather?.daily[0]?.tempMax;
  const dailyTempMin = weather?.daily[0]?.tempMin;

  if (
    (dailyTempMax !== undefined && dailyTempMax >= 35) ||
    (dailyTempMin !== undefined && dailyTempMin >= 25)
  ) {
    return EXTREME_HEAT;
  }

  if (dayHasCode(conditions, weather, isSnowCode)) return SNOW_DAY;

  const hasHeavyRain = conditions.some((c) => c.precipitation.level === "high");
  if (hasHeavyRain) return HEAVY_RAIN;

  const hasHighPollen = conditions.some(
    (c) => c.pollen.level === "high" || c.pollen.level === "very_high",
  );
  if (hasHighPollen) return HIGH_POLLEN;

  if (
    (dailyTempMax !== undefined && dailyTempMax < 5) ||
    (dailyTempMin !== undefined && dailyTempMin < 0)
  ) {
    return EXTREME_COLD;
  }

  if (dayHasCode(conditions, weather, isFogCode)) return FOG_DAY;

  const tempValues = conditions.map((c) => c.temperature.value);
  const slotMax = tempValues.length ? Math.max(...tempValues) : 0;
  const slotMin = tempValues.length ? Math.min(...tempValues) : 0;
  if (slotMax - slotMin >= 8) return TEMP_SWING;

  return CALM;
}

export function buildSkyLetter(
  conditions: WeatherCondition[],
  weather: NormalizedWeather | null = null,
): SkyLetter {
  if (conditions.length === 0) return pickFromPattern(NO_DATA);
  return pickFromPattern(pickPattern(conditions, weather));
}
