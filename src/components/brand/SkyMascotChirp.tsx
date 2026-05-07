"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // ボタン位置を測って popover を文書座標で固定する
  // (Card の backdrop-filter で作られる stacking context を回避するため Portal で body 直下に出す)
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative mt-0.5 inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setChirp((prev) => pickChirp(prev));
          setOpen((v) => !v);
        }}
        aria-label="そらリスから一言"
        aria-expanded={open}
        className="motion-mascot-bounce mascot-hover-glow inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-300"
      >
        <MiniMascot />
      </button>
      {open &&
        chirp &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: "translateX(calc(-50% - 4px))",
              zIndex: 50,
            }}
            className="flex justify-center rounded-2xl border border-cream-200 bg-white px-3 py-3 shadow-md shadow-leaf-900/[0.08]"
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
          </div>,
          document.body,
        )}
    </div>
  );
}
