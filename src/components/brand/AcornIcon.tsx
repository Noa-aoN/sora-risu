import Image from "next/image";

import { cn } from "@/lib/cn";

export function AcornIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block h-5 w-5 shrink-0", className)}
    >
      <Image
        src="/brand/acorn-face.png"
        alt=""
        fill
        sizes="40px"
        className="object-contain"
      />
    </span>
  );
}
