import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-9 w-full rounded-full border border-leaf-200 bg-white px-4 text-sm text-ink-700 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500/30",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
