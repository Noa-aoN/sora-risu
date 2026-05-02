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
    <div className="rounded-2xl border border-leaf-100/80 bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-leaf-50 text-leaf-700">
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
        <Badge tone="muted">{INTENSITY_LABEL[item.intensity]}</Badge>
      </div>
    </div>
  );
}
