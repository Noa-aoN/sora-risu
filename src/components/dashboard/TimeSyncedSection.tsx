"use client";

import { ActionCard } from "@/components/cards/ActionCard";
import { CarryItemCard } from "@/components/cards/CarryItemCard";
import { OutfitItemCard } from "@/components/cards/OutfitItemCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  pollenLevelLabel,
  precipLevelLabel,
  pressureTrendLabel,
} from "@/lib/labels";
import type { Recommendations } from "@/features/recommendations/buildRecommendations";
import type { TimeSlot } from "@/types/timeline";
import type { WeatherCondition } from "@/types/weather";

type Props = {
  slots: TimeSlot[];
  conditions: WeatherCondition[];
  recommendations: Recommendations;
};

export function TimeSyncedSection({
  slots,
  conditions,
  recommendations,
}: Props) {
  if (slots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>準備中</CardTitle>
          <CardDescription>このレンジは近日対応予定です</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs leading-relaxed text-ink-500">
            7日 / 14日の空だよりは、週次レポートと一緒に追加していく予定です。今は 24H と 3D を中心にお使いください。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {slots.map((slot) => {
        const condition = conditions.find((c) => c.slotId === slot.id);
        const outfit = recommendations.outfit.filter(
          (o) => o.slotId === slot.id,
        );
        const carry = recommendations.carry.filter((c) => c.slotId === slot.id);
        const action = recommendations.action.filter(
          (a) => a.slotId === slot.id,
        );

        return (
          <Card key={slot.id}>
            <CardHeader>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <CardTitle className="text-base text-ink-800">
                  {slot.label}
                  <span className="ml-2 text-[11px] font-normal text-ink-400">
                    {slot.dateLabel}
                    {slot.period !== "daily"
                      ? ` ・ ${slot.start.slice(11, 16)}–${slot.end.slice(11, 16)}`
                      : ""}
                  </span>
                </CardTitle>
                {condition && (
                  <p className="text-[11px] text-ink-500">
                    {pressureTrendLabel(condition.pressure.trend)} ・
                    {" "}
                    {condition.temperature.value}℃
                    {" ・ "}
                    {precipLevelLabel(condition.precipitation.level)}
                    {" ・ "}花粉 {pollenLevelLabel(condition.pollen.level)}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-3">
                <Column tone="leaf" title="服装" empty="提案なし">
                  {outfit.map((item) => (
                    <OutfitItemCard key={item.id} item={item} />
                  ))}
                </Column>
                <Column tone="pollen" title="持ち物" empty="この時間帯はとくに必要なし">
                  {carry.map((item) => (
                    <CarryItemCard key={item.id} item={item} />
                  ))}
                </Column>
                <Column tone="rain" title="アクション" empty="無理のない範囲で過ごせる目安">
                  {action.map((item) => (
                    <ActionCard key={item.id} item={item} />
                  ))}
                </Column>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

type ColumnTone = "leaf" | "pollen" | "rain";

const TONE_HEADER_CLASS: Record<ColumnTone, string> = {
  leaf: "text-leaf-700",
  pollen: "text-pollen-700",
  rain: "text-rain-700",
};

const TONE_DOT_CLASS: Record<ColumnTone, string> = {
  leaf: "bg-leaf-400",
  pollen: "bg-pollen-500",
  rain: "bg-rain-500",
};

function Column({
  tone,
  title,
  empty,
  children,
}: {
  tone: ColumnTone;
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children : [children];
  const hasContent = items.some(Boolean) && items.length > 0;
  return (
    <div className="space-y-2">
      <p
        className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em] ${TONE_HEADER_CLASS[tone]}`}
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${TONE_DOT_CLASS[tone]}`}
          aria-hidden
        />
        {title}
      </p>
      {hasContent ? (
        <div className="space-y-2">{children}</div>
      ) : (
        <p className="rounded-2xl border border-dashed border-leaf-100 bg-leaf-25 px-4 py-3 text-[11px] text-ink-400">
          {empty}
        </p>
      )}
    </div>
  );
}
