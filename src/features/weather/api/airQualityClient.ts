const AIR_QUALITY_ENDPOINT =
  "https://air-quality-api.open-meteo.com/v1/air-quality";

const POLLEN_FIELDS = [
  "alder_pollen",
  "birch_pollen",
  "grass_pollen",
  "mugwort_pollen",
  "olive_pollen",
  "ragweed_pollen",
] as const;

export type RawAirQualityResponse = {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    alder_pollen: (number | null)[];
    birch_pollen: (number | null)[];
    grass_pollen: (number | null)[];
    mugwort_pollen: (number | null)[];
    olive_pollen: (number | null)[];
    ragweed_pollen: (number | null)[];
  };
};

export type FetchAirQualityInput = {
  latitude: number;
  longitude: number;
  forecastDays?: number;
  pastDays?: number;
  signal?: AbortSignal;
};

function ensureAirQualityResponse(json: unknown): RawAirQualityResponse {
  if (!json || typeof json !== "object") {
    throw new Error("Open-Meteo air quality: response root is not an object");
  }
  const root = json as Record<string, unknown>;
  if (!root.hourly || typeof root.hourly !== "object") {
    throw new Error("Open-Meteo air quality: missing hourly section");
  }
  const hourly = root.hourly as Record<string, unknown>;
  const time = hourly.time;
  if (!Array.isArray(time)) {
    throw new Error("Open-Meteo air quality: hourly.time is not an array");
  }
  for (const field of POLLEN_FIELDS) {
    const arr = hourly[field];
    if (!Array.isArray(arr) || arr.length !== time.length) {
      throw new Error(
        `Open-Meteo air quality: hourly.${field} length mismatch ` +
          `(got ${Array.isArray(arr) ? arr.length : typeof arr}, expected ${time.length})`,
      );
    }
  }
  return json as RawAirQualityResponse;
}

export async function fetchAirQuality({
  latitude,
  longitude,
  forecastDays = 5,
  pastDays = 0,
  signal,
}: FetchAirQualityInput): Promise<RawAirQualityResponse | null> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: POLLEN_FIELDS.join(","),
    timezone: "auto",
    forecast_days: forecastDays.toString(),
    past_days: pastDays.toString(),
  });

  let json: unknown;
  try {
    const response = await fetch(`${AIR_QUALITY_ENDPOINT}?${params.toString()}`, {
      signal,
    });
    if (!response.ok) {
      throw new Error(`Air quality failed: ${response.status}`);
    }
    json = await response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
    if (signal?.aborted) return null;
    throw err;
  }

  return ensureAirQualityResponse(json);
}
