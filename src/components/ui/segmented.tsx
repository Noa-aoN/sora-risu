import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SegmentedOption<V extends string> = {
  value: V;
  label: ReactNode;
  disabled?: boolean;
};

export type SegmentedProps<V extends string> = {
  value: V;
  onChange: (v: V) => void;
  options: SegmentedOption<V>[];
  className?: string;
  size?: "sm" | "md";
};

export function Segmented<V extends string>({
  value,
  onChange,
  options,
  className,
  size = "md",
}: SegmentedProps<V>) {
  const heightClass = size === "sm" ? "h-8" : "h-9";
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex rounded-full border border-leaf-100 bg-white p-1",
        heightClass,
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center justify-center gap-1 rounded-full px-3 text-xs font-medium transition-colors",
              active
                ? "bg-leaf-600 text-white shadow-sm"
                : "text-ink-500 hover:text-ink-700",
              opt.disabled && "opacity-40 cursor-not-allowed hover:text-ink-500",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
