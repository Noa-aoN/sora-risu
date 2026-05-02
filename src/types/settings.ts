import type { GeoLocation } from "./location";
import type { UserProfile } from "./recommendation";
import type { DisplayTarget, TimelineRange } from "./timeline";

export type ChartSeriesKey =
  | "pressure"
  | "temperature"
  | "precipitation"
  | "weather"
  | "pollen";

export type ChartSeriesVisibility = Record<ChartSeriesKey, boolean>;

export const DEFAULT_CHART_SERIES: ChartSeriesVisibility = {
  pressure: true,
  temperature: true,
  precipitation: true,
  weather: true,
  pollen: true,
};

export type AppSettings = {
  location: GeoLocation | null;
  profile: UserProfile;
  timelineRange: TimelineRange;
  displayTarget: DisplayTarget;
  carryChecks: Record<string, boolean>;
  chartSeries: ChartSeriesVisibility;
};
