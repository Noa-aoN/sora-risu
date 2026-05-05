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

type Placement = "bottom" | "left";

type Props = {
  pose: Pose;
  size?: number;
  ariaLabel?: string;
  align?: "left" | "right";
  placement?: Placement;
  children: ReactNode;
  className?: string;
  popoverClassName?: string;
};

export function SoraRisuPopover({
  pose,
  size = 64,
  ariaLabel = "そらリスのコメントを見る",
  align = "right",
  placement = "bottom",
  children,
  className,
  popoverClassName,
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
        className="motion-mascot-bounce mascot-hover-glow inline-flex shrink-0 items-end justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-300"
        style={{ width: size, height: size }}
      >
        <span
          className="relative block h-full w-full"
          aria-hidden
        >
          <Image
            src={POSE_SRC[pose]}
            alt=""
            fill
            sizes={`${size * 2}px`}
            className="select-none object-contain"
            draggable={false}
            unoptimized
          />
        </span>
      </button>
      {open && (
        <div
          role="dialog"
          className={cn(
            "absolute z-30 w-64 rounded-2xl border border-cream-200 bg-white px-4 py-3 text-sm leading-relaxed text-ink-700 shadow-lg shadow-leaf-900/[0.08]",
            placement === "bottom"
              ? cn("top-full mt-2", align === "right" ? "right-0" : "left-0")
              : "right-full top-1/2 mr-3 -translate-y-1/2",
            popoverClassName,
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute h-3 w-3 rotate-45 border-cream-200 bg-white",
              placement === "bottom"
                ? cn(
                    "-top-1.5 border-l border-t",
                    align === "right" ? "right-6" : "left-6",
                  )
                : "right-[-6px] top-1/2 -translate-y-1/2 border-r border-t",
            )}
          />
          {children}
        </div>
      )}
    </div>
  );
}
