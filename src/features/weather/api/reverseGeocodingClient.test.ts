import test from "node:test";
import assert from "node:assert/strict";

import { reverseGeocode } from "./reverseGeocodingClient.ts";

type FetchSig = typeof globalThis.fetch;

function withFetchMock<T>(
  responder: (url: string) => Response | Promise<Response>,
  fn: () => Promise<T>,
): Promise<T> {
  const original: FetchSig = globalThis.fetch;
  globalThis.fetch = (async (input: Request | string | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    return await responder(url);
  }) as FetchSig;
  return fn().finally(() => {
    globalThis.fetch = original;
  });
}

test("reverseGeocode prefers locality when present", async () => {
  const result = await withFetchMock(
    () =>
      new Response(
        JSON.stringify({ locality: "渋谷区", city: "東京", principalSubdivision: "東京都" }),
        { status: 200 },
      ),
    () => reverseGeocode({ latitude: 35.66, longitude: 139.7 }),
  );
  assert.equal(result, "渋谷区");
});

test("reverseGeocode falls through to city when no locality", async () => {
  const result = await withFetchMock(
    () =>
      new Response(
        JSON.stringify({ city: "京都市", principalSubdivision: "京都府" }),
        { status: 200 },
      ),
    () => reverseGeocode({ latitude: 35.0, longitude: 135.7 }),
  );
  assert.equal(result, "京都市");
});

test("reverseGeocode picks highest-order admin entry as fallback", async () => {
  const result = await withFetchMock(
    () =>
      new Response(
        JSON.stringify({
          principalSubdivision: "宮城県",
          localityInfo: {
            administrative: [
              { name: "日本", order: 1 },
              { name: "宮城県", order: 4 },
              { name: "仙台市", order: 6 },
              { name: "青葉区", order: 7 },
            ],
          },
        }),
        { status: 200 },
      ),
    () => reverseGeocode({ latitude: 38.26, longitude: 140.86 }),
  );
  assert.equal(result, "青葉区");
});

test("reverseGeocode returns null when response is not ok", async () => {
  const result = await withFetchMock(
    () => new Response("oops", { status: 500 }),
    () => reverseGeocode({ latitude: 0, longitude: 0 }),
  );
  assert.equal(result, null);
});

test("reverseGeocode returns null when fetch throws", async () => {
  const result = await withFetchMock(
    () => Promise.reject(new Error("network down")),
    () => reverseGeocode({ latitude: 0, longitude: 0 }),
  );
  assert.equal(result, null);
});
