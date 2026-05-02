import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { GeoLocation } from "@/types/location";
import type { UserProfile } from "@/types/recommendation";
import type {
  AppSettings,
  ChartSeriesKey,
  ChartSeriesVisibility,
} from "@/types/settings";
import { DEFAULT_CHART_SERIES } from "@/types/settings";
import type { DisplayTarget, TimelineRange } from "@/types/timeline";

export const DAY_WINDOW_MAX_START = 6;

type Actions = {
  setLocation: (location: GeoLocation | null) => void;
  setTimelineRange: (range: TimelineRange) => void;
  setDisplayTarget: (target: DisplayTarget) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  toggleCarryCheck: (id: string) => void;
  resetCarryChecks: () => void;
  setDayWindowStart: (n: number) => void;
  toggleChartSeries: (key: ChartSeriesKey) => void;
  resetChartSeries: () => void;
};

type AppStore = AppSettings & {
  dayWindowStart: number;
} & Actions;

const initial: AppSettings = {
  location: null,
  profile: { styleGenre: "simple", bodyType: "neutral" },
  timelineRange: "24h",
  displayTarget: "summary",
  carryChecks: {},
  chartSeries: DEFAULT_CHART_SERIES,
};

function clampDayWindow(n: number): number {
  if (n < 0) return 0;
  if (n > DAY_WINDOW_MAX_START) return DAY_WINDOW_MAX_START;
  return n;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initial,
      dayWindowStart: 0,
      setLocation: (location) => set({ location }),
      setTimelineRange: (timelineRange) => set({ timelineRange }),
      setDisplayTarget: (displayTarget) => set({ displayTarget }),
      setProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),
      toggleCarryCheck: (id) =>
        set((state) => ({
          carryChecks: {
            ...state.carryChecks,
            [id]: !state.carryChecks[id],
          },
        })),
      resetCarryChecks: () => set({ carryChecks: {} }),
      setDayWindowStart: (n) => set({ dayWindowStart: clampDayWindow(n) }),
      toggleChartSeries: (key) =>
        set((state) => ({
          chartSeries: {
            ...state.chartSeries,
            [key]: !state.chartSeries[key],
          },
        })),
      resetChartSeries: () => set({ chartSeries: DEFAULT_CHART_SERIES }),
    }),
    {
      name: "weather-dash:settings",
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = (persisted as Partial<AppSettings>) ?? {};
        if (version < 2 || !state.chartSeries) {
          return { ...state, chartSeries: DEFAULT_CHART_SERIES };
        }
        return state;
      },
      partialize: (state) => ({
        location: state.location,
        profile: state.profile,
        timelineRange: state.timelineRange,
        displayTarget: state.displayTarget,
        carryChecks: state.carryChecks,
        chartSeries: state.chartSeries,
      }),
    },
  ),
);

export type { ChartSeriesKey, ChartSeriesVisibility };
