"use client";

import { ArrowDown, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
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
import { PERIOD_TONE } from "@/lib/periodTone";
import type { Recommendations } from "@/features/recommendations/buildRecommendations";
import { relativeDayLabel } from "@/features/weather/services/buildTimeSlots";
import { DAY_WINDOW_MAX_START, useAppStore } from "@/stores/useAppStore";
import type { TimeSlot } from "@/types/timeline";
import type { WeatherCondition } from "@/types/weather";

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
          <CardTitle>カード表示なし</CardTitle>
          <CardDescription>この表示範囲では詳細カードを出していません</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs leading-relaxed text-ink-500">
            服装・持ち物・行動の提案は、24H と 3D を中心に表示しています。
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
  const dayWindowStart = useAppStore((s) => s.dayWindowStart);
  const setDayWindowStart = useAppStore((s) => s.setDayWindowStart);
  const resetAllCardChecks = useAppStore((s) => s.resetAllCardChecks);
  const canPrev = dayWindowStart > 0;
  const canNext = dayWindowStart < DAY_WINDOW_MAX_START;

  return (
    <Card>
      <CardHeader>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="flex items-center justify-start">
            <CardTitle className="text-base text-ink-800">
              アドバイスカード
            </CardTitle>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setDayWindowStart(dayWindowStart - 1)}
              disabled={!canPrev}
              aria-label="前の日へ"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                canPrev
                  ? "text-leaf-700 hover:bg-leaf-50"
                  : "cursor-not-allowed text-ink-200",
              )}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <CardTitle className="text-base text-ink-800">
                {group.relativeLabel}
              </CardTitle>
              <p className="text-[11px] text-ink-400">{group.dateLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setDayWindowStart(dayWindowStart + 1)}
              disabled={!canNext}
              aria-label="次の日へ"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                canNext
                  ? "text-leaf-700 hover:bg-leaf-50"
                  : "cursor-not-allowed text-ink-200",
              )}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex justify-start md:justify-end">
            <button
              type="button"
              onClick={resetAllCardChecks}
              className="inline-flex items-center gap-1 rounded-full border border-leaf-100 bg-white px-3 py-1 text-[11px] text-ink-500 transition-colors hover:bg-leaf-25 hover:text-ink-700"
            >
              <RotateCcw size={12} />
              チェックを戻す
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {group.slots.map((slot, index) => (
          <div key={slot.id} className="space-y-2">
            <SlotRow
              slot={slot}
              condition={conditions.find((c) => c.slotId === slot.id)}
              outfit={recommendations.outfit.filter((o) => o.slotId === slot.id)}
              carry={recommendations.carry.filter((c) => c.slotId === slot.id)}
              action={recommendations.action.filter((a) => a.slotId === slot.id)}
            />
            {index < group.slots.length - 1 && (
              <div className="my-2 flex items-center justify-center gap-2 text-leaf-400">
                <span className="h-px flex-1 bg-leaf-100" />
                <ArrowDown size={12} />
                <span className="h-px flex-1 bg-leaf-100" />
              </div>
            )}
          </div>
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
        PERIOD_TONE[slot.period].rowBg,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="flex min-w-0 shrink-0 items-center gap-2 text-sm font-medium text-ink-700">
          <span
            aria-hidden
            className={cn(
              "inline-block h-2 w-2 shrink-0 rounded-full",
              PERIOD_TONE[slot.period].dotBg,
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
          <p className="min-w-0 flex-1 break-words text-right text-[11px] leading-relaxed text-ink-500">
            {pressureTrendLabel(condition.pressure.trend)} ・
            {" "}
            {condition.temperature.value}℃
            {" ・ "}
            {precipLevelLabel(condition.precipitation.level)}
            {" ・ "}花粉 {pollenLevelLabel(condition.pollen.level)}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Column tone="leaf" title="服装" empty="提案なし">
          {outfit.map((item) => (
            <OutfitItemCard key={item.id} item={item} period={slot.period} />
          ))}
        </Column>
        <Column tone="pollen" title="持ち物" empty="この時間帯はとくに必要なし">
          {carry.map((item) => (
            <CarryItemCard key={item.id} item={item} period={slot.period} />
          ))}
        </Column>
        <Column tone="rain" title="アクション" empty="無理のない範囲で過ごせる目安">
          {action.map((item) => (
            <ActionCard key={item.id} item={item} period={slot.period} />
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
    <div className="min-w-0 space-y-2">
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
