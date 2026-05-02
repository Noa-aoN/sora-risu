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
] as const;

const DAILY_FIELDS = [
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "weathercode",
  "sunrise",
  "sunset",
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
  };
};

export type FetchForecastInput = {
  latitude: number;
  longitude: number;
  forecastDays?: number;
  signal?: AbortSignal;
};

export async function fetchForecast({
  latitude,
  longitude,
  forecastDays = 14,
  signal,
}: FetchForecastInput): Promise<RawForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: HOURLY_FIELDS.join(","),
    daily: DAILY_FIELDS.join(","),
    timezone: "auto",
    forecast_days: forecastDays.toString(),
  });

  const response = await fetch(`${FORECAST_ENDPOINT}?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Open-Meteo forecast failed: ${response.status}`);
  }

  return (await response.json()) as RawForecastResponse;
}
