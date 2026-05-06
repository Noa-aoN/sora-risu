import type { SlotPeriod } from "@/types/timeline";

type PeriodTone = {
  rowBg: string;
  labelText: string;
  cardRequired: string;
  cardUnchecked: string;
  cardChecked: string;
  checkUnchecked: string;
  checkChecked: string;
  checkedIconText: string;
};

export const PERIOD_TONE: Record<SlotPeriod, PeriodTone> = {
  morning: {
    rowBg: "bg-pollen-50/30",
    labelText: "text-pollen-700",
    cardRequired:
      "border-cream-200 border-t-cream-500 bg-cream-50 hover:bg-cream-50",
    cardUnchecked:
      "border-cream-200 border-t-cream-300 bg-white hover:bg-white",
    cardChecked: "border-cream-200 border-t-cream-500 bg-cream-50",
    checkUnchecked: "border-cream-200 bg-white text-leaf-300",
    checkChecked: "border-cream-500 bg-cream-500 text-white",
    checkedIconText: "text-ink-600",
  },
  daytime: {
    rowBg: "bg-leaf-50/30",
    labelText: "text-leaf-700",
    cardRequired:
      "border-cream-200 border-t-cream-500 bg-cream-50 hover:bg-cream-50",
    cardUnchecked:
      "border-cream-200 border-t-cream-300 bg-white hover:bg-white",
    cardChecked: "border-cream-200 border-t-cream-500 bg-cream-50",
    checkUnchecked: "border-cream-200 bg-white text-cream-300",
    checkChecked: "border-cream-500 bg-cream-500 text-white",
    checkedIconText: "text-ink-600",
  },
  evening: {
    rowBg: "bg-dusk-50/25",
    labelText: "text-dusk-700",
    cardRequired:
      "border-cream-200 border-t-cream-500 bg-cream-50 hover:bg-cream-50",
    cardUnchecked:
      "border-cream-200 border-t-cream-300 bg-white hover:bg-white",
    cardChecked: "border-cream-200 border-t-cream-500 bg-cream-50",
    checkUnchecked: "border-cream-200 bg-white text-leaf-300",
    checkChecked: "border-cream-500 bg-cream-500 text-white",
    checkedIconText: "text-ink-600",
  },
  night: {
    rowBg: "bg-ink-50/55",
    labelText: "text-ink-700",
    cardRequired:
      "border-cream-200 border-t-cream-500 bg-cream-50 hover:bg-cream-50",
    cardUnchecked:
      "border-cream-200 border-t-cream-300 bg-white hover:bg-white",
    cardChecked: "border-cream-200 border-t-cream-500 bg-cream-50",
    checkUnchecked: "border-cream-200 bg-white text-cream-300",
    checkChecked: "border-cream-500 bg-cream-500 text-white",
    checkedIconText: "text-ink-600",
  },
  daily: {
    rowBg: "",
    labelText: "text-ink-500",
    cardRequired:
      "border-cream-200 border-t-cream-500 bg-cream-50 hover:bg-cream-50",
    cardUnchecked:
      "border-cream-200 border-t-cream-300 bg-white hover:bg-white",
    cardChecked: "border-cream-200 border-t-cream-500 bg-cream-50",
    checkUnchecked: "border-cream-200 bg-white text-leaf-300",
    checkChecked: "border-cream-500 bg-cream-500 text-white",
    checkedIconText: "text-ink-600",
  },
};
