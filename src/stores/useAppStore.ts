import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { GeoLocation } from "@/types/location";
import type { UserProfile } from "@/types/recommendation";
import { DEFAULT_SCENES } from "@/types/recommendation";
import type {
  AppSettings,
  ChartAnchor,
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
  toggleOutfitCheck: (id: string) => void;
  toggleActionCheck: (id: string) => void;
  resetAllCardChecks: () => void;
  setDayWindowStart: (n: number) => void;
  toggleChartSeries: (key: ChartSeriesKey) => void;
  resetChartSeries: () => void;
  setChartAnchor: (anchor: ChartAnchor) => void;
};

type AppStore = AppSettings & {
  dayWindowStart: number;
  outfitChecks: Record<string, boolean>;
  actionChecks: Record<string, boolean>;
} & Actions;

const initial: AppSettings = {
  location: null,
  profile: {
    styleGenre: "simple",
    bodyType: "neutral",
    scenes: DEFAULT_SCENES,
  },
  timelineRange: "24h",
  displayTarget: "summary",
  carryChecks: {},
  chartSeries: DEFAULT_CHART_SERIES,
  chartAnchor: "center",
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
      outfitChecks: {},
      actionChecks: {},
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
      toggleOutfitCheck: (id) =>
        set((state) => ({
          outfitChecks: {
            ...state.outfitChecks,
            [id]: !state.outfitChecks[id],
          },
        })),
      toggleActionCheck: (id) =>
        set((state) => ({
          actionChecks: {
            ...state.actionChecks,
            [id]: !state.actionChecks[id],
          },
        })),
      resetAllCardChecks: () =>
        set({ carryChecks: {}, outfitChecks: {}, actionChecks: {} }),
      setDayWindowStart: (n) => set({ dayWindowStart: clampDayWindow(n) }),
      toggleChartSeries: (key) =>
        set((state) => ({
          chartSeries: {
            ...state.chartSeries,
            [key]: !state.chartSeries[key],
          },
        })),
      resetChartSeries: () => set({ chartSeries: DEFAULT_CHART_SERIES }),
      setChartAnchor: (chartAnchor) => set({ chartAnchor }),
    }),
    {
      name: "sorarisu:settings",
      version: 6,
      migrate: (persisted: unknown, version: number) => {
        const state = (persisted as Partial<AppSettings> & {
          outfitChecks?: Record<string, boolean>;
          actionChecks?: Record<string, boolean>;
        }) ?? {};
        let next = { ...state };
        if (version < 2 || !next.chartSeries) {
          next = { ...next, chartSeries: DEFAULT_CHART_SERIES };
        }
        if (version < 3 && next.chartSeries) {
          next = {
            ...next,
            chartSeries: { ...DEFAULT_CHART_SERIES, ...next.chartSeries },
          };
        }
        if (version < 4) {
          next = {
            ...next,
            outfitChecks: next.outfitChecks ?? {},
            actionChecks: next.actionChecks ?? {},
          };
        }
        if (version < 5 && next.profile && !next.profile.scenes) {
          next = {
            ...next,
            profile: { ...next.profile, scenes: DEFAULT_SCENES },
          };
        }
        if (version < 6 && !next.chartAnchor) {
          next = { ...next, chartAnchor: "center" };
        }
        return next;
      },
      partialize: (state) => ({
        location: state.location,
        profile: state.profile,
        timelineRange: state.timelineRange,
        displayTarget: state.displayTarget,
        carryChecks: state.carryChecks,
        outfitChecks: state.outfitChecks,
        actionChecks: state.actionChecks,
        chartSeries: state.chartSeries,
        chartAnchor: state.chartAnchor,
      }),
    },
  ),
);

export type { ChartSeriesKey, ChartSeriesVisibility };
