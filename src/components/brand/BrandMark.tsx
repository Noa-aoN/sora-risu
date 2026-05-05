import Image from "next/image";

import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block h-9 w-9", className)}
    >
      <Image
        src="/brand/logo-mark2.png"
        alt=""
        fill
        sizes="80px"
        className="object-contain"
      />
    </span>
  );
}
