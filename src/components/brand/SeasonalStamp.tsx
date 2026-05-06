import Image from "next/image";

import { cn } from "@/lib/cn";
import type { LetterCategory } from "@/types/recommendation";

type StampKind =
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  | "rain"
  | "pollen";

const STAMP_META: Record<
  StampKind,
  { src: string; label: string; width: number; height: number }
> = {
  spring: {
    src: "/brand/sora/stamp-spring.png",
    label: "春のしるし",
    width: 145,
    height: 125,
  },
  summer: {
    src: "/brand/sora/stamp-summer.png",
    label: "夏のしるし",
    width: 135,
    height: 125,
  },
  autumn: {
    src: "/brand/sora/stamp-autumn.png",
    label: "秋のしるし",
    width: 135,
    height: 125,
  },
  winter: {
    src: "/brand/sora/stamp-winter.png",
    label: "冬のしるし",
    width: 135,
    height: 125,
  },
  rain: {
    src: "/brand/sora/stamp-rain.png",
    label: "雨のしるし",
    width: 135,
    height: 125,
  },
  pollen: {
    src: "/brand/sora/stamp-pollen.png",
    label: "花粉のしるし",
    width: 155,
    height: 125,
  },
};

function monthToSeason(month: number): StampKind {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export function pickStampKind(
  category: LetterCategory,
  date: Date = new Date(),
): StampKind {
  if (category === "rain") return "rain";
  if (category === "pollen") return "pollen";
  return monthToSeason(date.getMonth() + 1);
}

export function SeasonalStamp({
  kind,
  size = 44,
  className,
}: {
  kind: StampKind;
  size?: number;
  className?: string;
}) {
  const meta = STAMP_META[kind];
  const width = Math.round((size * meta.width) / meta.height);

  return (
    <Image
      src={meta.src}
      alt={meta.label}
      width={width}
      height={size}
      className={cn("inline-block select-none", className)}
      draggable={false}
      unoptimized
    />
  );
}
