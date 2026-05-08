import type { DailyPoint, NormalizedWeather } from "@/types/weather";

export function todayDateString(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function pickTodayDaily(
  weather: NormalizedWeather | null,
): DailyPoint | null {
  if (!weather) return null;
  return weather.daily.find((d) => d.date === todayDateString()) ?? null;
}
