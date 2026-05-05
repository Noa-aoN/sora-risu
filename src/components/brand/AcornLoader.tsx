import Image from "next/image";

import { cn } from "@/lib/cn";

const DEFAULT_MESSAGE = "そらリスが空を読んでいます…";

export function AcornLoader({
  size = 56,
  message,
  className,
}: {
  size?: number;
  message?: string;
  className?: string;
}) {
  const text = message ?? DEFAULT_MESSAGE;
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-6 text-center",
        className,
      )}
    >
      <Image
        src="/brand/sora/acorn-basic.png"
        alt=""
        width={size}
        height={size}
        className="motion-acorn-spin select-none [animation:acorn-spin_2.4s_linear_infinite]"
        draggable={false}
        unoptimized
      />
      <p className="text-xs text-ink-500">{text}</p>
    </div>
  );
}
