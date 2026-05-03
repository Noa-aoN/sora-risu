"use client";

import { useMemo, useSyncExternalStore } from "react";

import { AcornIcon } from "@/components/brand/AcornIcon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pickSeasonalWord } from "@/features/seasonal/seasonalWords";

const subscribeNoop = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function SeasonalWordCard() {
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

  const word = useMemo(() => (mounted ? pickSeasonalWord() : null), [mounted]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AcornIcon />
          <CardTitle>今日の季節の言葉</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        {word ? (
          <div className="rounded-[1.25rem] border border-sora-100/80 bg-[linear-gradient(160deg,rgba(207,228,243,0.45),rgba(251,246,238,0.95))] px-4 py-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="font-brand text-lg text-ink-800">{word.term}</p>
                <p className="text-[11px] text-ink-400">{word.reading}</p>
              </div>
              <div className="h-px bg-gradient-to-r from-leaf-100 via-leaf-200/70 to-transparent" />
              <p className="text-[13px] leading-7 text-ink-600">
                {word.description}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-ink-400">読み込み中…</p>
        )}
      </CardContent>
    </Card>
  );
}
