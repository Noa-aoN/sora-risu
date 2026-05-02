import test from "node:test";
import assert from "node:assert/strict";

import { findLocalFallbackLocations } from "./geocodingClient.ts";

test("findLocalFallbackLocations returns Arao for exact and prefix matches", () => {
  assert.deepEqual(
    findLocalFallbackLocations("荒尾").map((item) => item.name),
    ["荒尾市"],
  );
  assert.deepEqual(
    findLocalFallbackLocations("荒").map((item) => item.name),
    ["荒尾市"],
  );
  assert.deepEqual(findLocalFallbackLocations("無関係"), []);
});
