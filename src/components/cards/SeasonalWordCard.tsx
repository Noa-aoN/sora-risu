"use client";

import { useMemo, useSyncExternalStore } from "react";

import { AcornIcon } from "@/components/brand/AcornIcon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { describeSeasonalWord } from "@/features/seasonal/seasonalWords";
import { describeSolarTerm } from "@/features/seasonal/solarTerms";

const subscribeNoop = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function SeasonalWordCard() {
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

  const word = useMemo(
    () => (mounted ? describeSeasonalWord() : null),
    [mounted],
  );
  const solar = useMemo(
    () => (mounted ? describeSolarTerm() : null),
    [mounted],
  );

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AcornIcon />
          <CardTitle>今日の季節の言葉</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 pt-3">
        {word && solar ? (
          <div className="flex flex-1 flex-col rounded-2xl bg-cream-50 px-4 py-4 space-y-3">
            <section className="space-y-1.5">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p className="font-brand text-base text-ink-800">
                  {solar.term}
                </p>
                <p className="text-[11px] text-ink-400">{solar.reading}</p>
                <p className="text-[11px] text-ink-400">
                  （二十四節気：{solar.startLabel}〜{solar.endLabel}）
                </p>
              </div>
              <p className="text-[12px] leading-6 text-ink-600">
                {solar.description}
              </p>
            </section>

            <div className="h-px bg-gradient-to-r from-cream-200 via-cream-100 to-transparent" />

            <section className="flex items-start gap-2">
              <span
                aria-hidden
                className="select-none pt-0.5 font-brand text-sm text-ink-300"
              >
                └
              </span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <p className="font-brand text-lg text-ink-800">
                    {word.term}
                  </p>
                  <p className="text-[11px] text-ink-400">{word.reading}</p>
                  <p className="text-[11px] text-ink-400">
                    （七十二候：{word.startLabel}〜{word.endLabel}）
                  </p>
                </div>
                <p className="text-[13px] leading-7 text-ink-600">
                  {word.description}
                </p>
              </div>
            </section>
          </div>
        ) : (
          <p className="text-xs text-ink-400">読み込み中…</p>
        )}
      </CardContent>
    </Card>
  );
}
