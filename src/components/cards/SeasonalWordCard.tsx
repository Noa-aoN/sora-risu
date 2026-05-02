"use client";

import { Leaf } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";

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
    <Card className="bg-gradient-to-br from-leaf-25 to-white">
      <CardHeader>
        <div className="flex items-center gap-2 text-leaf-700">
          <Leaf size={14} />
          <CardTitle className="text-leaf-800">今日の季節の言葉</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {word ? (
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-medium text-ink-800">{word.term}</p>
              <p className="text-[11px] text-ink-400">{word.reading}</p>
            </div>
            <p className="text-xs leading-relaxed text-ink-600">
              {word.description}
            </p>
          </div>
        ) : (
          <p className="text-xs text-ink-400">読み込み中…</p>
        )}
      </CardContent>
    </Card>
  );
}
