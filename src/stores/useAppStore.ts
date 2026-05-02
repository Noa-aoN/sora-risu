import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { GeoLocation } from "@/types/location";
import type { UserProfile } from "@/types/recommendation";
import type { AppSettings } from "@/types/settings";
import type { DisplayTarget, TimelineRange } from "@/types/timeline";

type Actions = {
  setLocation: (location: GeoLocation | null) => void;
  setTimelineRange: (range: TimelineRange) => void;
  setDisplayTarget: (target: DisplayTarget) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  toggleCarryCheck: (id: string) => void;
  resetCarryChecks: () => void;
};

type AppStore = AppSettings & Actions;

const initial: AppSettings = {
  location: null,
  profile: { styleGenre: "simple", bodyType: "neutral" },
  timelineRange: "24h",
  displayTarget: "summary",
  carryChecks: {},
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initial,
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
