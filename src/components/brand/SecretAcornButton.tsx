"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";

type ArcStyle = CSSProperties & Record<`--${string}`, string>;

function randomArcStyle(): ArcStyle {
  const rand = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const peak = -rand(28, 58);
  const midX = rand(38, 62);

  // Quarter points wobble around the linear path so the trajectory is
  // less predictable.
  const q1X = rand(15, 32);
  const q1Y = -rand(8, 28);
  const q3X = rand(70, 90);
  const q3Y = -rand(4, 24);

  const endX = rand(102, 122);
  const endY = rand(-12, 12);

  // Big spin: 720°〜1800°, sign random.
  const rotMag = rand(720, 1800);
  const rot = rotMag * (Math.random() < 0.5 ? -1 : 1);
  const duration = rand(1.8, 3.6);

  return {
    "--acorn-q1-x": `${q1X.toFixed(1)}vw`,
    "--acorn-q1-y": `${q1Y.toFixed(1)}vh`,
    "--acorn-mid-x": `${midX.toFixed(1)}vw`,
    "--acorn-peak": `${peak.toFixed(1)}vh`,
    "--acorn-q3-x": `${q3X.toFixed(1)}vw`,
    "--acorn-q3-y": `${q3Y.toFixed(1)}vh`,
    "--acorn-end-x": `${endX.toFixed(1)}vw`,
    "--acorn-end-y": `${endY.toFixed(1)}vh`,
    "--acorn-rot": `${rot.toFixed(0)}deg`,
    animationDuration: `${duration.toFixed(2)}s`,
  };
}

export function SecretAcornButton() {
  const [flying, setFlying] = useState(false);
  const [arcStyle, setArcStyle] = useState<ArcStyle>(() => randomArcStyle());

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (flying) return;
          setArcStyle(randomArcStyle());
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
            style={arcStyle}
            onAnimationEnd={() => setFlying(false)}
          >
            <Image
              src="/brand/sora/acorn-fly.png"
              alt=""
              width={36}
              height={36}
              className="select-none [transform:scaleX(-1)]"
              draggable={false}
              unoptimized
            />
          </span>
        </span>
      )}
    </>
  );
}
