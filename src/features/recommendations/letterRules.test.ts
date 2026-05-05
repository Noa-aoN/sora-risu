import test from "node:test";
import assert from "node:assert/strict";

import { buildSkyLetter } from "./letterRules.ts";
import type { WeatherCondition } from "@/types/weather";

function baseCondition(overrides: Partial<WeatherCondition> = {}): WeatherCondition {
  return {
    slotId: "test-slot",
    pressure: { value: 1013, trend: "stable", changeLevel: "low" },
    temperature: { value: 20 },
    precipitation: { level: "none" },
    pollen: { level: "low" },
    wind: { speed: 1.5, level: "low" },
    humidity: { value: 50 },
    ...overrides,
  };
}

test("buildSkyLetter returns no_data category when conditions are empty", () => {
  const letter = buildSkyLetter([]);
  assert.equal(letter.category, "no_data");
});

test("buildSkyLetter prefers pressure over rain when both elevated", () => {
  const letter = buildSkyLetter([
    baseCondition({
      pressure: { value: 1005, trend: "falling", changeLevel: "high" },
      precipitation: { level: "high", probability: 80 },
    }),
  ]);
  assert.equal(letter.category, "pressure");
  assert.equal(letter.tone, "alert");
});

test("buildSkyLetter chooses rain when pressure is calm but rain heavy", () => {
  const letter = buildSkyLetter([
    baseCondition({
      precipitation: { level: "high", probability: 80 },
    }),
  ]);
  assert.equal(letter.category, "rain");
});

test("buildSkyLetter chooses pollen for high pollen with no other alerts", () => {
  const letter = buildSkyLetter([
    baseCondition({ pollen: { level: "very_high" } }),
  ]);
  assert.equal(letter.category, "pollen");
});

test("buildSkyLetter chooses temp when temperature swing >= 8C", () => {
  const letter = buildSkyLetter([
    baseCondition({ slotId: "morning", temperature: { value: 8 } }),
    baseCondition({ slotId: "afternoon", temperature: { value: 22 } }),
  ]);
  assert.equal(letter.category, "temp");
});

test("buildSkyLetter falls back to calm for ordinary conditions", () => {
  const letter = buildSkyLetter([baseCondition()]);
  assert.equal(letter.category, "calm");
  assert.equal(letter.tone, "calm");
  assert.equal(letter.title, "今日の空だより");
});
