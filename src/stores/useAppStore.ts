import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { GeoLocation } from "@/types/location";
import type { UserProfile } from "@/types/recommendation";
import type { AppSettings } from "@/types/settings";
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
    }),
    {
      name: "weather-dash:settings",
      partialize: (state) => ({
        location: state.location,
        profile: state.profile,
        timelineRange: state.timelineRange,
        displayTarget: state.displayTarget,
        carryChecks: state.carryChecks,
      }),
    },
  ),
);
