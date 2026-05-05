import test from "node:test";
import assert from "node:assert/strict";

import { pickSolarTerm } from "./solarTerms.ts";

test("pickSolarTerm returns 立春 right after 2/4", () => {
  const result = pickSolarTerm(new Date(2026, 1, 5));
  assert.equal(result.term, "立春");
});

test("pickSolarTerm returns 大寒 in late January", () => {
  const result = pickSolarTerm(new Date(2026, 0, 25));
  assert.equal(result.term, "大寒");
});

test("pickSolarTerm rolls over from 冬至 of previous year on Jan 1", () => {
  const result = pickSolarTerm(new Date(2026, 0, 1));
  assert.equal(result.term, "冬至");
});

test("pickSolarTerm returns 夏至 around 6/22", () => {
  const result = pickSolarTerm(new Date(2026, 5, 22));
  assert.equal(result.term, "夏至");
});

test("pickSolarTerm returns 秋分 around 9/24", () => {
  const result = pickSolarTerm(new Date(2026, 8, 24));
  assert.equal(result.term, "秋分");
});
