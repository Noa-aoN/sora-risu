import type { GeoLocation } from "@/types/location";

const GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

type RawResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  timezone?: string;
  population?: number;
  feature_code?: string;
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

const FEATURE_CODE_PRIORITY: Record<string, number> = {
  PPLC: 100,
  PPLA: 90,
  PPLA2: 80,
  PPLA3: 70,
  PPLA4: 60,
  PPLA5: 50,
  PPL: 40,
  PPLG: 35,
  PPLX: 30,
  PPLF: 10,
  PPLL: 5,
};

const EXCLUDED_FEATURE_CODES = new Set(["PPLH", "PPLQ", "PPLW"]);

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

function isWorthShowing(item: RawResult): boolean {
  const fc = item.feature_code ?? "";
  if (!fc.startsWith("PPL")) return false;
  if (EXCLUDED_FEATURE_CODES.has(fc)) return false;
  return true;
}

function compareResults(a: RawResult, b: RawResult): number {
  const pa = a.population ?? -1;
  const pb = b.population ?? -1;
  if (pa !== pb) return pb - pa;
  const fa = FEATURE_CODE_PRIORITY[a.feature_code ?? ""] ?? 0;
  const fb = FEATURE_CODE_PRIORITY[b.feature_code ?? ""] ?? 0;
  return fb - fa;
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
  count = 12,
  signal,
}: SearchLocationsInput): Promise<GeoLocation[]> {
  const variants = buildQueryVariants(query);
  if (variants.length === 0) return [];

  const fetchCount = Math.max(count, 10);
  const settled = await Promise.allSettled(
    variants.map((v) => fetchOne(v, language, fetchCount, signal)),
  );

  const seen = new Map<number, RawResult>();
  for (const r of settled) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      if (!isWorthShowing(item)) continue;
      if (!seen.has(item.id)) seen.set(item.id, item);
    }
  }

  const merged = Array.from(seen.values()).sort(compareResults);

  return merged.slice(0, count).map((r) => ({
    id: `${r.id}`,
    name: r.name,
    admin: r.admin1,
    admin2: r.admin2,
    admin3: r.admin3,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}
