"use client";

import { useEffect, useRef, useState } from "react";

import { MiniMascot } from "@/components/brand/MiniMascot";

const CHIRPS: string[] = [
  "今日もそっとね",
  "ぼちぼちでいいよ",
  "ひといきどうぞ",
  "ゆっくりねぇ",
  "ふかいきひとつ",
  "むりしすぎずに",
  "きみのペースで",
  "じぶんを大事に",
  "肩のちから、ぬいて",
  "ちいさく前にね",
  "今日は今日の風",
  "はれま、まちかね",
  "また会えたねぇ",
  "おうえん、してる",
  "そばにいるよ",
  "おだやかにね",
  "ぬくもり、どうぞ",
  "おちゃでもどう？",
  "やわらかな日に",
  "今日もえらいねぇ",
  "あせらずいこう",
  "ひとやすみも◎",
  "そらを見てね",
  "雲のあいだに",
  "風がやさしいよ",
  "どんぐり、いる？",
  "ぽかぽか、しよ",
  "ぎゅっとどうぞ",
  "そっと、まいにち",
  "ふぅ、おちゃする？",
  "へへ、おひるね？",
  "もうすこしだけね",
  "そう、それで◎",
  "さんぽしよっか",
  "きみは、きみで◎",
];

function pickChirp(prev: string | null): string {
  let next = CHIRPS[Math.floor(Math.random() * CHIRPS.length)] ?? CHIRPS[0]!;
  if (prev && CHIRPS.length > 1 && next === prev) {
    const others = CHIRPS.filter((c) => c !== prev);
    next = others[Math.floor(Math.random() * others.length)] ?? next;
  }
  return next;
}

export function SkyMascotChirp() {
  const [open, setOpen] = useState(false);
  const [chirp, setChirp] = useState<string | null>(null);
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
    <div ref={wrapRef} className="relative -mt-1 inline-block">
      <button
        type="button"
        onClick={() => {
          setChirp((prev) => pickChirp(prev));
          setOpen((v) => !v);
        }}
        aria-label="そらリスから一言"
        aria-expanded={open}
        className="inline-flex rounded-full transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-300"
      >
        <MiniMascot />
      </button>
      {open && chirp && (
        <div
          role="dialog"
          className="absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 rounded-2xl border border-cream-200 bg-white px-3 py-3 shadow-md shadow-leaf-900/[0.08]"
        >
          <span
            aria-hidden
            className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-cream-200 bg-white"
          />
          <p
            className="font-brand text-[13px] leading-6 text-ink-700"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "upright",
              letterSpacing: "0.05em",
            }}
          >
            {chirp}
          </p>
        </div>
      )}
    </div>
  );
}
