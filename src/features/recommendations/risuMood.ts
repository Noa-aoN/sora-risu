import type { SoraRisuPose } from "@/components/brand/SoraRisuPopover";
import type { WeatherCondition } from "@/types/weather";

export type RisuMood = {
  pose: SoraRisuPose;
  message: string;
};

export function pickRisuMood(highlight: WeatherCondition | null): RisuMood {
  if (!highlight) {
    return {
      pose: "on-cloud",
      message: "今、空のようすを聞きにいってるよ。\n少し待っていてね。",
    };
  }

  if (highlight.pressure.changeLevel === "high") {
    return {
      pose: "pressure_low",
      message: "気圧が少し下がりそう。\n無理しすぎず過ごしてね。",
    };
  }

  if (highlight.precipitation.level === "high") {
    return {
      pose: "umbrella",
      message: "雨が近いみたい。\n折りたたみ傘を持っていくと安心だよ。",
    };
  }

  if (
    highlight.pollen.level === "high" ||
    highlight.pollen.level === "very_high"
  ) {
    return {
      pose: "mask",
      message: "花粉が少し多め。\nマスクと目元のケアがあるとよさそう。",
    };
  }

  if (highlight.wind && highlight.wind.level === "high") {
    return {
      pose: "blanket",
      message: "今日は風が強いよ。\n軽い羽織りがあると安心。",
    };
  }

  if (highlight.precipitation.level === "medium") {
    return {
      pose: "rain",
      message: "ぱらつく時間がありそう。\n出かける前に空を見てから決めよう。",
    };
  }

  if (highlight.pressure.trend === "stable") {
    return {
      pose: "pressure_calm",
      message: "今日は比較的おだやか。\n動きやすい一日になりそう。",
    };
  }

  return {
    pose: "sunny",
    message: "今日はにこにこの空。\nほどよく外の空気を吸いに出てみよう。",
  };
}
