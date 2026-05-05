"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Pose =
  | "basic"
  | "sitting"
  | "sunny"
  | "rain"
  | "pollen_high"
  | "pressure_low"
  | "pressure_calm"
  | "walking"
  | "reading"
  | "umbrella"
  | "mask"
  | "blanket"
  | "on-cloud";

const POSE_SRC: Record<Pose, string> = {
  basic: "/brand/sora/risu-basic.png",
  sitting: "/brand/sora/risu-sitting.png",
  sunny: "/brand/sora/risu-sunny.png",
  rain: "/brand/sora/risu-rain.png",
  pollen_high: "/brand/sora/risu-pollen_high.png",
  pressure_low: "/brand/sora/risu-pressure_low.png",
  pressure_calm: "/brand/sora/risu-pressure_calm.png",
  walking: "/brand/sora/risu-walking.png",
  reading: "/brand/sora/risu-reading.png",
  umbrella: "/brand/sora/risu-umbrella.png",
  mask: "/brand/sora/risu-mask.png",
  blanket: "/brand/sora/risu-blanket.png",
  "on-cloud": "/brand/sora/risu-on-cloud.png",
};

export type SoraRisuPose = Pose;

type Props = {
  pose: Pose;
  size?: number;
  ariaLabel?: string;
  align?: "left" | "right";
  children: ReactNode;
  className?: string;
};

export function SoraRisuPopover({
  pose,
  size = 64,
  ariaLabel = "そらリスのコメントを見る",
  align = "right",
  children,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-expanded={open}
        className="inline-flex shrink-0 items-end justify-center rounded-full transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-300"
      >
        <Image
          src={POSE_SRC[pose]}
          alt=""
          width={size}
          height={size}
          className="select-none"
          draggable={false}
          unoptimized
        />
      </button>
      {open && (
        <div
          role="dialog"
          className={cn(
            "absolute top-full z-30 mt-2 w-64 rounded-2xl border border-cream-200 bg-white px-4 py-3 text-sm leading-relaxed text-ink-700 shadow-lg shadow-leaf-900/[0.08]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-cream-200 bg-white",
              align === "right" ? "right-6" : "left-6",
            )}
          />
          {children}
        </div>
      )}
    </div>
  );
}
