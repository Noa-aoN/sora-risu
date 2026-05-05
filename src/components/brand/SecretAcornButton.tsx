"use client";

import Image from "next/image";
import { useState } from "react";

export function SecretAcornButton() {
  const [flying, setFlying] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (flying) return;
          setFlying(true);
        }}
        aria-label="そらリスのいたずら"
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center align-middle opacity-50 transition hover:scale-110 hover:opacity-100"
      >
        <Image
          src="/brand/acorn-face.png"
          alt=""
          width={14}
          height={14}
          className="select-none"
          draggable={false}
          unoptimized
        />
      </button>
      {flying && (
        <span
          aria-hidden
          className="pointer-events-none fixed bottom-12 left-0 z-40"
        >
          <span
            className="motion-acorn-arc inline-block [animation:acorn-arc_2.4s_ease-in-out_forwards]"
            onAnimationEnd={() => setFlying(false)}
          >
            <Image
              src="/brand/sora/acorn-fly.png"
              alt=""
              width={36}
              height={36}
              className="select-none"
              draggable={false}
              unoptimized
            />
          </span>
        </span>
      )}
    </>
  );
}
