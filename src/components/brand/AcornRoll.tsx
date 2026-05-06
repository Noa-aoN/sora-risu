"use client";

import Image from "next/image";

export function AcornRoll({ trigger }: { trigger: number }) {
  if (trigger === 0) return null;
  return (
    <span
      key={trigger}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
    >
      <span className="motion-acorn-roll absolute top-1/2 -mt-3.5 opacity-70 [animation:acorn-roll_1100ms_ease-in-out_forwards]">
        <Image
          src="/brand/acorn-face.png"
          alt=""
          width={28}
          height={28}
          className="select-none"
          draggable={false}
        />
      </span>
    </span>
  );
}
