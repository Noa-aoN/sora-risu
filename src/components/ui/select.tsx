import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-9 rounded-full border border-leaf-200 bg-white px-3 text-sm text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500/30",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
