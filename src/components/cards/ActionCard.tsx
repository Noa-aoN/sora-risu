import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ActionItem } from "@/types/recommendation";

const INTENSITY_LABEL: Record<ActionItem["intensity"], string> = {
  low: "強度 弱",
  medium: "強度 中",
  high: "強度 強",
};

export function ActionCard({ item }: { item: ActionItem }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-rain-100 bg-white px-4 pb-3 pt-4">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-rain-500"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-rain-50 text-rain-700">
            <Sparkles size={14} />
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-ink-800">{item.title}</p>
            <p className="text-[11px] leading-relaxed text-ink-600">
              {item.description}
            </p>
            <p className="text-[11px] leading-relaxed text-ink-400">
              {item.reason}
            </p>
          </div>
        </div>
        <Badge tone="rain">{INTENSITY_LABEL[item.intensity]}</Badge>
      </div>
    </div>
  );
}
