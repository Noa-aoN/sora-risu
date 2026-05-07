const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

const HOURLY_FIELDS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "pressure_msl",
  "precipitation_probability",
  "precipitation",
  "weathercode",
  "wind_speed_10m",
  "uv_index",
] as const;

const DAILY_FIELDS = [
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "weathercode",
  "sunrise",
  "sunset",
  "uv_index_max",
] as const;

export type RawForecastResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    pressure_msl: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weathercode: number[];
    wind_speed_10m: number[];
    uv_index: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    weathercode: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
};

export type FetchForecastInput = {
  latitude: number;
  longitude: number;
  forecastDays?: number;
  pastDays?: number;
  signal?: AbortSignal;
};

function ensureMatchingArrays(
  obj: Record<string, unknown>,
  fields: readonly string[],
  scope: string,
): void {
  const time = obj.time;
  if (!Array.isArray(time)) {
    throw new Error(`Open-Meteo forecast: ${scope}.time is not an array`);
  }
  for (const field of fields) {
    const arr = obj[field];
    if (!Array.isArray(arr) || arr.length !== time.length) {
      throw new Error(
        `Open-Meteo forecast: ${scope}.${field} length mismatch ` +
          `(got ${Array.isArray(arr) ? arr.length : typeof arr}, expected ${time.length})`,
      );
    }
  }
}

function ensureForecastResponse(json: unknown): RawForecastResponse {
  if (!json || typeof json !== "object") {
    throw new Error("Open-Meteo forecast: response root is not an object");
  }
  const root = json as Record<string, unknown>;
  if (!root.hourly || typeof root.hourly !== "object") {
    throw new Error("Open-Meteo forecast: missing hourly section");
  }
  if (!root.daily || typeof root.daily !== "object") {
    throw new Error("Open-Meteo forecast: missing daily section");
  }
  ensureMatchingArrays(
    root.hourly as Record<string, unknown>,
    HOURLY_FIELDS,
    "hourly",
  );
  ensureMatchingArrays(
    root.daily as Record<string, unknown>,
    DAILY_FIELDS,
    "daily",
  );
  return json as RawForecastResponse;
}

export async function fetchForecast({
  latitude,
  longitude,
  forecastDays = 14,
  pastDays = 0,
  signal,
}: FetchForecastInput): Promise<RawForecastResponse | null> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: HOURLY_FIELDS.join(","),
    daily: DAILY_FIELDS.join(","),
    timezone: "auto",
    forecast_days: forecastDays.toString(),
    past_days: pastDays.toString(),
  });

  let json: unknown;
  try {
    const response = await fetch(`${FORECAST_ENDPOINT}?${params.toString()}`, {
      signal,
    });
    if (!response.ok) {
      throw new Error(`Open-Meteo forecast failed: ${response.status}`);
    }
    json = await response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
    if (signal?.aborted) return null;
    throw err;
  }

  return ensureForecastResponse(json);
}
