import { Check } from "lucide-react";

import { cn } from "@/lib/cn";

export function CheckIndicator({
  checked,
  className,
}: {
  checked: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
        checked
          ? "border-leaf-600 bg-leaf-600 text-white"
          : "border-leaf-200 bg-white text-leaf-300",
        className,
      )}
    >
      <Check
        size={12}
        strokeWidth={3}
        className={checked ? "opacity-100" : "opacity-0"}
      />
    </span>
  );
}
