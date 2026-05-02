import test from "node:test";
import assert from "node:assert/strict";

import {
  buildQueryVariants,
  compareResults,
  findMatchingPrefectures,
  isWorthShowing,
  mergeSearchResults,
  type RawGeocodingResult,
} from "./geocodingSearch.ts";

function place(
  partial: Partial<RawGeocodingResult> & Pick<RawGeocodingResult, "id" | "name">,
): RawGeocodingResult {
  return {
    latitude: 0,
    longitude: 0,
    ...partial,
  };
}

test("buildQueryVariants expands Japanese place names without suffix", () => {
  assert.deepEqual(buildQueryVariants("京都"), [
    "京都",
    "京都府",
    "京都市",
    "京都区",
    "京都町",
    "京都村",
  ]);
});

test("buildQueryVariants keeps existing municipality suffixes as-is", () => {
  assert.deepEqual(buildQueryVariants("京都市"), ["京都市"]);
  assert.deepEqual(buildQueryVariants("渋谷区"), ["渋谷区"]);
  assert.deepEqual(buildQueryVariants("ニセコ町"), ["ニセコ町"]);
  assert.deepEqual(buildQueryVariants("京都府"), ["京都府"]);
});

test("buildQueryVariants trims whitespace and ignores empty input", () => {
  assert.deepEqual(buildQueryVariants("  京都  "), [
    "京都",
    "京都府",
    "京都市",
    "京都区",
    "京都町",
    "京都村",
  ]);
  assert.deepEqual(buildQueryVariants("   "), []);
});

test("buildQueryVariants expands prefecture stems to official names", () => {
  assert.deepEqual(buildQueryVariants("東京"), [
    "東京",
    "東京都",
    "東京市",
    "東京区",
    "東京町",
    "東京村",
  ]);
  assert.deepEqual(buildQueryVariants("大阪"), [
    "大阪",
    "大阪府",
    "大阪市",
    "大阪区",
    "大阪町",
    "大阪村",
  ]);
});

test("findMatchingPrefectures resolves prefecture stems and prefixes", () => {
  assert.deepEqual(findMatchingPrefectures("京都"), ["京都府"]);
  assert.deepEqual(findMatchingPrefectures("東"), ["東京都"]);
  assert.deepEqual(findMatchingPrefectures("北海道"), ["北海道"]);
});

test("isWorthShowing excludes non-populated places and hidden feature codes", () => {
  assert.equal(isWorthShowing(place({ id: 1, name: "京都市", feature_code: "PPLA" })), true);
  assert.equal(isWorthShowing(place({ id: 2, name: "京都府", feature_code: "ADM1" })), true);
  assert.equal(isWorthShowing(place({ id: 3, name: "福岡", feature_code: "PPLH" })), false);
});

test("compareResults prioritizes match quality before population", () => {
  const exactMatch = place({
    id: 1,
    name: "京都",
    feature_code: "PPL",
    population: 1000,
  });
  const majorCity = place({
    id: 2,
    name: "京都市",
    feature_code: "PPLA",
    population: 1463723,
  });
  const smallWard = place({
    id: 3,
    name: "京都区",
    feature_code: "PPLA",
    population: 10000,
  });
  const samePopulationHigherPriority = place({
    id: 4,
    name: "県庁所在地",
    feature_code: "PPLC",
    population: 1000,
  });
  const samePopulationLowerPriority = place({
    id: 5,
    name: "一般市",
    feature_code: "PPL",
    population: 1000,
  });

  assert.ok(compareResults("京都", exactMatch, majorCity) < 0);
  assert.ok(compareResults("京都", majorCity, smallWard) < 0);
  assert.ok(compareResults("query", samePopulationHigherPriority, samePopulationLowerPriority) < 0);
});

test("mergeSearchResults de-duplicates by id and sorts merged candidates", () => {
  const merged = mergeSearchResults("福岡", [
    [
      place({
        id: 10,
        name: "福岡",
        feature_code: "PPLL",
      }),
      place({
        id: 11,
        name: "福岡市",
        feature_code: "PPLA",
        population: 1612392,
      }),
    ],
    [
      place({
        id: 11,
        name: "福岡市",
        feature_code: "PPLA",
        population: 1612392,
      }),
      place({
        id: 12,
        name: "福岡県",
        feature_code: "ADM1",
        population: 5100000,
      }),
    ],
  ]);

  assert.deepEqual(
    merged.map((item) => item.name),
    ["福岡", "福岡市", "福岡県"],
  );
});
