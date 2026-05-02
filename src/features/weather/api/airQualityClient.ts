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

  let response: Response;
  try {
    response = await fetch(`${AIR_QUALITY_ENDPOINT}?${params.toString()}`, {
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
    throw err;
  }

  if (!response.ok) {
    throw new Error(`Air quality failed: ${response.status}`);
  }

  return (await response.json()) as RawAirQualityResponse;
}
