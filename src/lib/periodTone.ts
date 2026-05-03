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
      "border-pollen-100 border-t-pollen-500 bg-pollen-50/80 hover:bg-pollen-50",
    cardUnchecked:
      "border-pollen-100 border-t-pollen-500/60 bg-white hover:bg-pollen-50/45",
    cardChecked: "border-pollen-100 border-t-pollen-500 bg-pollen-50/80",
    checkUnchecked: "border-pollen-100 bg-white text-pollen-500",
    checkChecked: "border-pollen-500 bg-pollen-500 text-white",
    checkedIconText: "text-pollen-700",
  },
  daytime: {
    rowBg: "bg-leaf-50/30",
    labelText: "text-leaf-700",
    cardRequired:
      "border-leaf-200 border-t-leaf-500 bg-leaf-50/70 hover:bg-leaf-50",
    cardUnchecked:
      "border-leaf-100/80 border-t-leaf-400 bg-white hover:bg-leaf-25",
    cardChecked: "border-leaf-200 border-t-leaf-500 bg-leaf-50/75",
    checkUnchecked: "border-leaf-200 bg-white text-leaf-300",
    checkChecked: "border-leaf-600 bg-leaf-600 text-white",
    checkedIconText: "text-leaf-700",
  },
  evening: {
    rowBg: "bg-dusk-50/25",
    labelText: "text-dusk-700",
    cardRequired:
      "border-dusk-100 border-t-dusk-500 bg-dusk-50/75 hover:bg-dusk-50",
    cardUnchecked:
      "border-dusk-100 border-t-dusk-500/60 bg-white hover:bg-dusk-50/45",
    cardChecked: "border-dusk-100 border-t-dusk-500 bg-dusk-50/80",
    checkUnchecked: "border-dusk-100 bg-white text-dusk-500",
    checkChecked: "border-dusk-500 bg-dusk-500 text-white",
    checkedIconText: "text-dusk-700",
  },
  night: {
    rowBg: "bg-ink-50/55",
    labelText: "text-ink-700",
    cardRequired:
      "border-ink-100 border-t-ink-500 bg-ink-50 hover:bg-ink-50",
    cardUnchecked:
      "border-ink-100 border-t-ink-400/70 bg-white hover:bg-ink-50/70",
    cardChecked: "border-ink-100 border-t-ink-500 bg-ink-50",
    checkUnchecked: "border-ink-200 bg-white text-ink-400",
    checkChecked: "border-ink-600 bg-ink-600 text-white",
    checkedIconText: "text-ink-600",
  },
  daily: {
    rowBg: "",
    labelText: "text-ink-500",
    cardRequired:
      "border-ink-100 border-t-ink-400 bg-ink-50/80 hover:bg-ink-50",
    cardUnchecked:
      "border-ink-100 border-t-ink-300 bg-white hover:bg-ink-50/70",
    cardChecked: "border-ink-100 border-t-ink-400 bg-ink-50/80",
    checkUnchecked: "border-ink-100 bg-white text-ink-300",
    checkChecked: "border-ink-500 bg-ink-500 text-white",
    checkedIconText: "text-ink-600",
  },
};
