export type TimelineRange = "1d" | "24h" | "3d" | "7d" | "14d";

export type DisplayTarget =
  | "summary"
  | "pressure"
  | "temperature"
  | "precipitation"
  | "pollen"
  | "outfit"
  | "items"
  | "actions";

export type SlotPeriod = "morning" | "daytime" | "evening" | "night" | "daily";

export type TimeSlot = {
  id: string;
  label: string;
  start: string;
  end: string;
  dateLabel: string;
  period: SlotPeriod;
};
