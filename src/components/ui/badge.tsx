import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const badgeStyles = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium",
  {
    variants: {
      tone: {
        leaf: "bg-leaf-50 text-leaf-700 border border-leaf-100",
        neutral: "bg-ink-50 text-ink-600 border border-ink-100",
        alert: "bg-alert-50 text-alert-700 border border-alert-100",
        rain: "bg-rain-50 text-rain-700 border border-rain-100",
        pollen: "bg-pollen-50 text-pollen-700 border border-pollen-100",
        muted: "bg-white text-ink-500 border border-leaf-100",
      },
    },
    defaultVariants: { tone: "leaf" },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeStyles>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ tone }), className)} {...props} />;
}
