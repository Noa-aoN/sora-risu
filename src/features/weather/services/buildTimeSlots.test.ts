import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCardSlots,
  buildTimeSlots,
  relativeDayLabel,
} from "./buildTimeSlots.ts";

test("buildCardSlots returns 4 day-parts per day", () => {
  const now = new Date(2026, 4, 4, 12, 0);
  const slots = buildCardSlots(0, 1, now);
  assert.equal(slots.length, 4);
  assert.deepEqual(
    slots.map((s) => s.period),
    ["morning", "daytime", "evening", "night"],
  );
});

test("buildCardSlots covers requested day count", () => {
  const now = new Date(2026, 4, 4, 12, 0);
  const slots = buildCardSlots(0, 3, now);
  assert.equal(slots.length, 12);
  const uniqueDates = new Set(slots.map((s) => s.start.slice(0, 10)));
  assert.equal(uniqueDates.size, 3);
});

test("buildTimeSlots respects timeline range", () => {
  const now = new Date(2026, 4, 4, 12, 0);
  assert.equal(buildTimeSlots("1d", now).length, 4);
  assert.equal(buildTimeSlots("3d", now).length, 3);
  assert.equal(buildTimeSlots("7d", now).length, 7);
  assert.equal(buildTimeSlots("14d", now).length, 14);
});

test("relativeDayLabel maps offsets to friendly labels", () => {
  const now = new Date(2026, 4, 4);
  assert.equal(relativeDayLabel("2026-05-04", now), "今日");
  assert.equal(relativeDayLabel("2026-05-05", now), "明日");
  assert.equal(relativeDayLabel("2026-05-06", now), "明後日");
  assert.equal(relativeDayLabel("2026-05-03", now), "昨日");
  assert.equal(relativeDayLabel("2026-05-10", now), "6日後");
});
