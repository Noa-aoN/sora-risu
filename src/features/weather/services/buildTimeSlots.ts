import type { TimelineRange, TimeSlot } from "@/types/timeline";

type DayPart = {
  period: "morning" | "daytime" | "evening" | "night";
  label: string;
  startHour: number;
  endHour: number;
};

const DAY_PARTS: DayPart[] = [
  { period: "morning", label: "朝", startHour: 6, endHour: 11 },
  { period: "daytime", label: "昼", startHour: 11, endHour: 15 },
  { period: "evening", label: "晩", startHour: 15, endHour: 19 },
  { period: "night", label: "夜", startHour: 19, endHour: 24 },
];

const RELATIVE_DAY_LABELS = ["今日", "明日", "明後日"];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toLocalISO(date: Date, hour: number): string {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}T${pad(hour)}:00`;
}

function formatDateLabel(date: Date): string {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getMonth() + 1}/${date.getDate()} (${weekdays[date.getDay()]})`;
}

function startOfDay(base: Date, dayOffset: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function build24hSlots(now: Date): TimeSlot[] {
  const today = startOfDay(now, 0);
  const dateLabel = formatDateLabel(today);
  return DAY_PARTS.map((part) => ({
    id: `${today.toISOString().slice(0, 10)}-${part.period}`,
    label: part.label,
    start: toLocalISO(today, part.startHour),
    end: toLocalISO(today, part.endHour),
    dateLabel,
    period: part.period,
  }));
}

function buildDailyRangeSlots(now: Date, count: number): TimeSlot[] {
  return Array.from({ length: count }, (_, offset) => {
    const day = startOfDay(now, offset);
    const dateLabel = formatDateLabel(day);
    return {
      id: `${day.toISOString().slice(0, 10)}-daily`,
      label: RELATIVE_DAY_LABELS[offset] ?? dateLabel,
      start: toLocalISO(day, 0),
      end: toLocalISO(day, 24),
      dateLabel,
      period: "daily" as const,
    };
  });
}

export function buildTimeSlots(
  range: TimelineRange,
  now: Date = new Date(),
): TimeSlot[] {
  switch (range) {
    case "24h":
      return build24hSlots(now);
    case "3d":
      return buildDailyRangeSlots(now, 3);
    case "7d":
      return buildDailyRangeSlots(now, 7);
    case "14d":
      return buildDailyRangeSlots(now, 14);
  }
}

export function buildCardSlots(
  dayOffset: number,
  dayCount: number = 2,
  now: Date = new Date(),
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let d = 0; d < dayCount; d++) {
    const day = startOfDay(now, dayOffset + d);
    const dateLabel = formatDateLabel(day);
    for (const part of DAY_PARTS) {
      slots.push({
        id: `${day.toISOString().slice(0, 10)}-${part.period}`,
        label: part.label,
        start: toLocalISO(day, part.startHour),
        end: toLocalISO(day, part.endHour),
        dateLabel,
        period: part.period,
      });
    }
  }
  return slots;
}

export function relativeDayLabel(dateStr: string, now: Date = new Date()): string {
  const today = startOfDay(now, 0).getTime();
  const target = startOfDay(new Date(dateStr + "T00:00"), 0).getTime();
  const diffDays = Math.round((target - today) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "明日";
  if (diffDays === 2) return "明後日";
  if (diffDays === -1) return "昨日";
  if (diffDays < 0) return `${Math.abs(diffDays)}日前`;
  return `${diffDays}日後`;
}
