"use client";

import dynamic from "next/dynamic";
import { useMemo, useSyncExternalStore } from "react";

import { AcornLoader } from "@/components/brand/AcornLoader";
import { SecretAcornButton } from "@/components/brand/SecretAcornButton";
import { SeasonalWordCard } from "@/components/cards/SeasonalWordCard";
import { SkyLetterCard } from "@/components/cards/SkyLetterCard";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TimeSyncedSection } from "@/components/dashboard/TimeSyncedSection";
import { AppShell } from "@/components/layout/AppShell";
import { LocationHeader } from "@/components/layout/LocationHeader";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { useWeather } from "@/components/weather/useWeather";
import { buildRecommendations } from "@/features/recommendations/buildRecommendations";
import { buildCardSlots } from "@/features/weather/services/buildTimeSlots";
import { buildWeatherConditions } from "@/features/weather/services/buildWeatherConditions";
import { useAppStore } from "@/stores/useAppStore";

const WeatherChart = dynamic(
  () =>
    import("@/components/dashboard/WeatherChart").then((m) => ({
      default: m.WeatherChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-leaf-100/80 bg-white">
        <AcornLoader />
      </div>
    ),
  },
);

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
    () => buildRecommendations(cardConditions, profile, weather),
    [cardConditions, profile, weather],
  );

  const todaySlots = useMemo(
    () => (mounted ? buildCardSlots(0, 1) : []),
    [mounted],
  );
  const todayConditions = useMemo(
    () => (weather ? buildWeatherConditions(todaySlots, weather, pollen) : []),
    [weather, pollen, todaySlots],
  );

  return (
    <AppShell>
      {!mounted ? (
        <DashboardSkeleton />
      ) : (
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

        <WeatherChart
          weather={weather}
          pollen={pollen}
          range={range}
          isError={isError}
        />

        <TimeSyncedSection
          slots={cardSlots}
          conditions={cardConditions}
          recommendations={recommendations}
        />

        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <SkyLetterCard letter={recommendations.letter} />
          <SeasonalWordCard />
        </div>

        <SettingsPanel />

        <footer className="space-y-1 pt-6 text-center text-[11px] leading-relaxed text-ink-400">
          {isLoading ? (
            <AcornLoader
              size={40}
              message="そらリスが天気を読んでいます…"
              className="py-2"
            />
          ) : (
            <>
              <p>
                天気・地点検索・花粉データ:{" "}
                <a
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  Open-Meteo
                </a>{" "}
                (
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  CC BY 4.0
                </a>
                ) ／ 現在地の地名:{" "}
                <a
                  href="https://www.bigdatacloud.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  BigDataCloud
                </a>
              </p>
              <p>
                提案は生活判断のための目安で、医療助言ではありません。体調や予定に合わせて無理のない範囲で参考にしてください。
              </p>
              <p className="pt-1 text-ink-300">
                © 2026 NOA
                <SecretAcornButton />
              </p>
            </>
          )}
        </footer>
        </div>
      )}
    </AppShell>
  );
}

function DashboardSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">天気ダッシュボードを読み込み中</span>
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
