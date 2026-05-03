import Image from "next/image";

import { cn } from "@/lib/cn";

export function MiniMascot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block h-16 w-16 shrink-0", className)}
    >
      <Image
        src="/brand/mini-mascot-v2.png"
        alt=""
        fill
        sizes="128px"
        className="object-contain"
      />
    </span>
  );
}
