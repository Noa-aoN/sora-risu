import type { GeoLocation } from "@/types/location";

const GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

type RawSearchResponse = {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
    timezone?: string;
  }>;
};

export type SearchLocationsInput = {
  query: string;
  language?: string;
  count?: number;
  signal?: AbortSignal;
};

export async function searchLocations({
  query,
  language = "ja",
  count = 8,
  signal,
}: SearchLocationsInput): Promise<GeoLocation[]> {
  if (query.trim().length === 0) return [];

  const params = new URLSearchParams({
    name: query,
    count: count.toString(),
    language,
    format: "json",
  });

  const response = await fetch(`${GEOCODING_ENDPOINT}?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.status}`);
  }

  const json = (await response.json()) as RawSearchResponse;
  const results = json.results ?? [];

  return results.map((r) => ({
    id: `${r.id}`,
    name: r.name,
    admin: r.admin1,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}
