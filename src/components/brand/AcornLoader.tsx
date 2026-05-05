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
      <span
        aria-hidden
        className="motion-acorn-spin relative inline-block [animation:acorn-spin_2.4s_linear_infinite]"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/sora/acorn-basic.png"
          alt=""
          fill
          sizes={`${size * 2}px`}
          className="select-none object-contain"
          draggable={false}
          unoptimized
        />
      </span>
      <p className="text-xs text-ink-500">{text}</p>
    </div>
  );
}
