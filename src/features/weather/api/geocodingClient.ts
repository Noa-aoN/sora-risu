import type { GeoLocation } from "@/types/location";

const GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

type RawResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
  population?: number;
};

type RawSearchResponse = {
  results?: RawResult[];
};

export type SearchLocationsInput = {
  query: string;
  language?: string;
  count?: number;
  signal?: AbortSignal;
};

const JP_PLACE_SUFFIX = /[市町村区県府都道]$/;

function buildQueryVariants(rawQuery: string): string[] {
  const trimmed = rawQuery.trim();
  if (trimmed.length === 0) return [];
  const variants = new Set<string>([trimmed]);
  if (!JP_PLACE_SUFFIX.test(trimmed)) {
    variants.add(`${trimmed}市`);
  }
  return Array.from(variants);
}

async function fetchOne(
  query: string,
  language: string,
  count: number,
  signal: AbortSignal | undefined,
): Promise<RawResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: count.toString(),
    language,
    format: "json",
  });
  let response: Response;
  try {
    response = await fetch(`${GEOCODING_ENDPOINT}?${params.toString()}`, {
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return [];
    throw err;
  }
  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.status}`);
  }
  const json = (await response.json()) as RawSearchResponse;
  return json.results ?? [];
}

export async function searchLocations({
  query,
  language = "ja",
  count = 8,
  signal,
}: SearchLocationsInput): Promise<GeoLocation[]> {
  const variants = buildQueryVariants(query);
  if (variants.length === 0) return [];

  const settled = await Promise.allSettled(
    variants.map((v) => fetchOne(v, language, count, signal)),
  );

  const seen = new Map<number, RawResult>();
  for (const r of settled) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      if (!seen.has(item.id)) seen.set(item.id, item);
    }
  }

  const merged = Array.from(seen.values()).sort((a, b) => {
    const ap = a.population ?? -1;
    const bp = b.population ?? -1;
    return bp - ap;
  });

  return merged.slice(0, count).map((r) => ({
    id: `${r.id}`,
    name: r.name,
    admin: r.admin1,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}
