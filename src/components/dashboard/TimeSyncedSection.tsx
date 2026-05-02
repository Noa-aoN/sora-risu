"use client";

import type { ReactNode } from "react";

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
import { cn } from "@/lib/cn";
import type { Recommendations } from "@/features/recommendations/buildRecommendations";
import { relativeDayLabel } from "@/features/weather/services/buildTimeSlots";
import type { SlotPeriod, TimeSlot } from "@/types/timeline";
import type { WeatherCondition } from "@/types/weather";

const SLOT_DOT_COLOR: Record<SlotPeriod, string> = {
  morning: "bg-pollen-500",
  daytime: "bg-leaf-500",
  evening: "bg-dusk-700",
  night: "bg-ink-700",
  daily: "bg-ink-300",
};

const SLOT_BG_TINT: Record<SlotPeriod, string> = {
  morning: "bg-pollen-50/60",
  daytime: "bg-leaf-50/60",
  evening: "bg-dusk-50/60",
  night: "bg-ink-50",
  daily: "",
};

type Props = {
  slots: TimeSlot[];
  conditions: WeatherCondition[];
  recommendations: Recommendations;
};

type DayGroup = {
  date: string;
  dateLabel: string;
  relativeLabel: string;
  slots: TimeSlot[];
};

function groupSlotsByDay(slots: TimeSlot[]): DayGroup[] {
  const groups = new Map<string, DayGroup>();
  for (const slot of slots) {
    const date = slot.start.slice(0, 10);
    let group = groups.get(date);
    if (!group) {
      group = {
        date,
        dateLabel: slot.dateLabel,
        relativeLabel: relativeDayLabel(date),
        slots: [],
      };
      groups.set(date, group);
    }
    group.slots.push(slot);
  }
  return Array.from(groups.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

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

  const days = groupSlotsByDay(slots);

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <DayBlock
          key={day.date}
          group={day}
          conditions={conditions}
          recommendations={recommendations}
        />
      ))}
    </div>
  );
}

function DayBlock({
  group,
  conditions,
  recommendations,
}: {
  group: DayGroup;
  conditions: WeatherCondition[];
  recommendations: Recommendations;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-baseline justify-between gap-2">
          <CardTitle className="text-base text-ink-800">
            {group.relativeLabel}
            <span className="ml-2 text-[11px] font-normal text-ink-400">
              {group.dateLabel}
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {group.slots.map((slot) => (
          <SlotRow
            key={slot.id}
            slot={slot}
            condition={conditions.find((c) => c.slotId === slot.id)}
            outfit={recommendations.outfit.filter((o) => o.slotId === slot.id)}
            carry={recommendations.carry.filter((c) => c.slotId === slot.id)}
            action={recommendations.action.filter((a) => a.slotId === slot.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function SlotRow({
  slot,
  condition,
  outfit,
  carry,
  action,
}: {
  slot: TimeSlot;
  condition: WeatherCondition | undefined;
  outfit: Recommendations["outfit"];
  carry: Recommendations["carry"];
  action: Recommendations["action"];
}) {
  return (
    <div
      className={cn(
        "space-y-3 rounded-2xl px-3 py-3",
        SLOT_BG_TINT[slot.period],
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium text-ink-700">
          <span
            aria-hidden
            className={cn(
              "inline-block h-2 w-2 rounded-full",
              SLOT_DOT_COLOR[slot.period],
            )}
          />
          {slot.label}
          {slot.period !== "daily" && (
            <span className="ml-1 text-[10px] font-normal text-ink-400">
              {slot.start.slice(11, 16)}–{slot.end.slice(11, 16)}
            </span>
          )}
        </p>
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
  children: ReactNode;
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
