"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { fetchAirQuality } from "@/features/weather/api/airQualityClient";
import { fetchForecast } from "@/features/weather/api/openMeteoClient";
import {
  normalizeForecast,
  normalizePollen,
} from "@/features/weather/mappers/normalizeWeatherData";
import type { GeoLocation } from "@/types/location";

export function useWeather(location: GeoLocation | null) {
  const lat = location?.latitude;
  const lon = location?.longitude;
  const enabled = lat !== undefined && lon !== undefined;

  const forecastQuery = useQuery({
    queryKey: ["forecast", lat, lon],
    queryFn: ({ signal }) =>
      fetchForecast({
        latitude: lat!,
        longitude: lon!,
        pastDays: 7,
        signal,
      }),
    enabled,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const pollenQuery = useQuery({
    queryKey: ["pollen", lat, lon],
    queryFn: ({ signal }) =>
      fetchAirQuality({
        latitude: lat!,
        longitude: lon!,
        pastDays: 1,
        signal,
      }),
    enabled,
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const weather = useMemo(
    () => (forecastQuery.data ? normalizeForecast(forecastQuery.data) : null),
    [forecastQuery.data],
  );
  const pollen = useMemo(
    () => (pollenQuery.data ? normalizePollen(pollenQuery.data) : null),
    [pollenQuery.data],
  );

  return {
    weather,
    pollen,
    isLoading: forecastQuery.isLoading,
    isFetching: forecastQuery.isFetching || pollenQuery.isFetching,
    isError: forecastQuery.isError,
    error: forecastQuery.error as Error | null,
    refetch: () =>
      Promise.all([forecastQuery.refetch(), pollenQuery.refetch()]),
  };
}
