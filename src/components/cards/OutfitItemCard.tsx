import { Shirt } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { OutfitItem } from "@/types/recommendation";

const PRIORITY_LABEL: Record<OutfitItem["priority"], string> = {
  required: "必須",
  recommended: "推奨",
  optional: "任意",
};

export function OutfitItemCard({ item }: { item: OutfitItem }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-leaf-100/80 bg-white px-4 pb-3 pt-4">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-leaf-400"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-leaf-50 text-leaf-700">
            <Shirt size={14} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink-800">{item.name}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-ink-500">
              {item.reason}
            </p>
          </div>
        </div>
        <Badge tone={item.priority === "required" ? "leaf" : "muted"}>
          {PRIORITY_LABEL[item.priority]}
        </Badge>
      </div>
    </div>
  );
}
