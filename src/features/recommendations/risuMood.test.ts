import test from "node:test";
import assert from "node:assert/strict";

import { pickRisuMood } from "./risuMood.ts";
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

test("pickRisuMood returns on-cloud when no condition", () => {
  const m = pickRisuMood(null);
  assert.equal(m.pose, "on-cloud");
});

test("pickRisuMood returns pressure_low for high change level", () => {
  const m = pickRisuMood(
    baseCondition({ pressure: { value: 1010, trend: "falling", changeLevel: "high" } }),
  );
  assert.equal(m.pose, "pressure_low");
});

test("pickRisuMood returns umbrella for heavy rain", () => {
  const m = pickRisuMood(
    baseCondition({ precipitation: { level: "high", probability: 90 } }),
  );
  assert.equal(m.pose, "umbrella");
});

test("pickRisuMood returns mask for high pollen", () => {
  const m = pickRisuMood(baseCondition({ pollen: { level: "very_high" } }));
  assert.equal(m.pose, "mask");
});

test("pickRisuMood returns blanket for strong wind", () => {
  const m = pickRisuMood(
    baseCondition({ wind: { speed: 9, level: "high" } }),
  );
  assert.equal(m.pose, "blanket");
});

test("pickRisuMood returns pressure_calm for stable trend with no other alerts", () => {
  const m = pickRisuMood(baseCondition());
  assert.equal(m.pose, "pressure_calm");
});

test("pickRisuMood prefers pressure_low over rain when both elevated", () => {
  const m = pickRisuMood(
    baseCondition({
      pressure: { value: 1005, trend: "falling", changeLevel: "high" },
      precipitation: { level: "high", probability: 70 },
    }),
  );
  assert.equal(m.pose, "pressure_low");
});
