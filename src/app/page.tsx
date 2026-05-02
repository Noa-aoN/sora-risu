"use client";

import { useMemo, useSyncExternalStore } from "react";

import { ComingSoonSection } from "@/components/cards/ComingSoonSection";
import { PollenCard } from "@/components/cards/PollenCard";
import { SkyLetterCard } from "@/components/cards/SkyLetterCard";
import { DayPicker } from "@/components/dashboard/DayPicker";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TimeSyncedSection } from "@/components/dashboard/TimeSyncedSection";
import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
import { WeatherChart } from "@/components/dashboard/WeatherChart";
import { AppShell } from "@/components/layout/AppShell";
import { LocationHeader } from "@/components/layout/LocationHeader";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { useWeather } from "@/components/weather/useWeather";
import { buildRecommendations } from "@/features/recommendations/buildRecommendations";
import { buildCardSlots } from "@/features/weather/services/buildTimeSlots";
import { buildWeatherConditions } from "@/features/weather/services/buildWeatherConditions";
import { useAppStore } from "@/stores/useAppStore";

const subscribeNoop = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function HomePage() {
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

  const location = useAppStore((s) => s.location);
  const range = useAppStore((s) => s.timelineRange);
  const profile = useAppStore((s) => s.profile);
  const dayWindowStart = useAppStore((s) => s.dayWindowStart);

  const { weather, pollen, isLoading, isError } = useWeather(location);

  const cardSlots = useMemo(
    () => (mounted ? buildCardSlots(dayWindowStart, 1) : []),
    [mounted, dayWindowStart],
  );
  const cardConditions = useMemo(
    () => (weather ? buildWeatherConditions(cardSlots, weather, pollen) : []),
    [weather, pollen, cardSlots],
  );
  const recommendations = useMemo(
    () => buildRecommendations(cardConditions, profile),
    [cardConditions, profile],
  );

  const todaySlots = useMemo(
    () => (mounted ? buildCardSlots(0, 1) : []),
    [mounted],
  );
  const todayConditions = useMemo(
    () => (weather ? buildWeatherConditions(todaySlots, weather, pollen) : []),
    [weather, pollen, todaySlots],
  );

  if (!mounted) {
    return (
      <AppShell>
        <DashboardSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <LocationHeader />

        {isError && (
          <div className="rounded-2xl border border-alert-100 bg-alert-50/50 px-4 py-3 text-sm text-alert-700">
            天気データの取得に失敗しました。ネットワークを確認してから、再度お試しください。
          </div>
        )}

        <SummaryCard
          conditions={todayConditions}
          slots={todaySlots}
          weather={weather}
        />

        <TimelinePanel />
        <WeatherChart weather={weather} pollen={pollen} range={range} />

        <DayPicker />
        <TimeSyncedSection
          slots={cardSlots}
          conditions={cardConditions}
          recommendations={recommendations}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SkyLetterCard letter={recommendations.letter} />
          </div>
          <PollenCard
            level={cardConditions[0]?.pollen.level ?? "unknown"}
            types={cardConditions[0]?.pollen.types ?? []}
            available={pollen?.available ?? false}
          />
        </div>

        <SettingsPanel />
        <ComingSoonSection />

        <footer className="pt-2 text-center text-[11px] text-ink-400">
          {isLoading
            ? "天気データを取得しています…"
            : "データ提供: Open-Meteo (Forecast / Geocoding / Air Quality)"}
        </footer>
      </div>
    </AppShell>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="space-y-2">
        <div className="h-3 w-24 animate-pulse rounded-full bg-leaf-100" />
        <div className="h-6 w-44 animate-pulse rounded-full bg-leaf-100" />
        <div className="h-3 w-32 animate-pulse rounded-full bg-leaf-100" />
      </div>
      <div className="h-36 animate-pulse rounded-2xl border border-leaf-100/80 bg-white" />
      <div className="h-9 w-56 animate-pulse rounded-full bg-leaf-100" />
      <div className="h-72 animate-pulse rounded-2xl border border-leaf-100/80 bg-white" />
      <div className="h-56 animate-pulse rounded-2xl border border-leaf-100/80 bg-white" />
      <div className="h-40 animate-pulse rounded-2xl border border-leaf-100/80 bg-white" />
    </div>
  );
}
