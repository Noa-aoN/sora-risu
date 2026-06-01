export type PressureTrend = "rising" | "falling" | "stable";
export type ChangeLevel = "low" | "medium" | "high";
export type PrecipLevel = "none" | "low" | "medium" | "high";
export type PollenLevel =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "very_high"
  | "unknown";

export type HourlyPoint = {
  time: string;
  temperature: number;
  apparentTemperature: number;
  pressure: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  windGust: number;
  humidity: number;
  weatherCode: number;
  uvIndex: number;
};

export type DailyPoint = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  windGustMax: number;
  uvIndexMax: number;
};

export type PollenHourlyPoint = {
  time: string;
  alder: number | null;
  birch: number | null;
  grass: number | null;
  mugwort: number | null;
  olive: number | null;
  ragweed: number | null;
};

export type NormalizedWeather = {
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    fetchedAt: string;
  };
};

export type NormalizedPollen = {
  hourly: PollenHourlyPoint[];
  available: boolean;
  meta: {
    latitude: number;
    longitude: number;
    fetchedAt: string;
  };
};

export type WeatherCondition = {
  slotId: string;
  pressure: {
    value: number;
    trend: PressureTrend;
    changeLevel: ChangeLevel;
  };
  temperature: {
    value: number;
    min?: number;
    max?: number;
    feelsLike?: number;
  };
  precipitation: {
    probability?: number;
    amount?: number;
    level: PrecipLevel;
  };
  pollen: {
    level: PollenLevel;
    types?: string[];
  };
  wind?: {
    speed: number;
    level: ChangeLevel;
  };
  humidity?: {
    value: number;
  };
  weatherCode?: number;
};
