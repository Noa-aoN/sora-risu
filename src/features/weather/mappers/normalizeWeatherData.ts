import type { RawAirQualityResponse } from "@/features/weather/api/airQualityClient";
import type { RawForecastResponse } from "@/features/weather/api/openMeteoClient";
import type {
  HourlyPoint,
  DailyPoint,
  NormalizedPollen,
  NormalizedWeather,
  PollenHourlyPoint,
} from "@/types/weather";

export function normalizeForecast(raw: RawForecastResponse): NormalizedWeather {
  const h = raw.hourly;
  const d = raw.daily;

  const hourly: HourlyPoint[] = h.time.map((time, i) => ({
    time,
    temperature: h.temperature_2m[i] ?? 0,
    apparentTemperature: h.apparent_temperature[i] ?? (h.temperature_2m[i] ?? 0),
    pressure: h.pressure_msl[i] ?? 1013,
    precipitationProbability: h.precipitation_probability[i] ?? 0,
    precipitation: h.precipitation[i] ?? 0,
    windSpeed: h.wind_speed_10m[i] ?? 0,
    windGust: h.wind_gusts_10m[i] ?? 0,
    humidity: h.relative_humidity_2m[i] ?? 0,
    weatherCode: h.weathercode[i] ?? 0,
    uvIndex: h.uv_index[i] ?? 0,
  }));

  const daily: DailyPoint[] = d.time.map((date, i) => ({
    date,
    tempMax: d.temperature_2m_max[i] ?? 0,
    tempMin: d.temperature_2m_min[i] ?? 0,
    precipitationSum: d.precipitation_sum[i] ?? 0,
    precipitationProbabilityMax: d.precipitation_probability_max[i] ?? 0,
    weatherCode: d.weathercode[i] ?? 0,
    sunrise: d.sunrise[i] ?? "",
    sunset: d.sunset[i] ?? "",
    windGustMax: d.wind_gusts_10m_max[i] ?? 0,
    uvIndexMax: d.uv_index_max[i] ?? 0,
  }));

  return {
    hourly,
    daily,
    meta: {
      latitude: raw.latitude,
      longitude: raw.longitude,
      timezone: raw.timezone,
      fetchedAt: new Date().toISOString(),
    },
  };
}

export function normalizePollen(raw: RawAirQualityResponse): NormalizedPollen {
  const h = raw.hourly;

  const hourly: PollenHourlyPoint[] = h.time.map((time, i) => ({
    time,
    alder: h.alder_pollen[i] ?? null,
    birch: h.birch_pollen[i] ?? null,
    grass: h.grass_pollen[i] ?? null,
    mugwort: h.mugwort_pollen[i] ?? null,
    olive: h.olive_pollen[i] ?? null,
    ragweed: h.ragweed_pollen[i] ?? null,
  }));

  const available = hourly.some(
    (p) =>
      p.alder !== null ||
      p.birch !== null ||
      p.grass !== null ||
      p.mugwort !== null ||
      p.olive !== null ||
      p.ragweed !== null,
  );

  return {
    hourly,
    available,
    meta: {
      latitude: raw.latitude,
      longitude: raw.longitude,
      fetchedAt: new Date().toISOString(),
    },
  };
}
