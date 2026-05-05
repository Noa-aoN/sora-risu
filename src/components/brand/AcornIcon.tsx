import Image from "next/image";

import { cn } from "@/lib/cn";

export function AcornIcon({
  className,
  bounce = false,
}: {
  className?: string;
  bounce?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-block h-5 w-5 shrink-0",
        bounce && "motion-acorn-bounce",
        className,
      )}
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
