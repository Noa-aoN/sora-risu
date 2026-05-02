import type { ActionItem } from "@/types/recommendation";
import type { WeatherCondition } from "@/types/weather";

export function buildActionItems(condition: WeatherCondition): ActionItem[] {
  const items: Array<Omit<ActionItem, "id" | "slotId">> = [];
  const { pressure, precipitation, pollen, temperature } = condition;

  if (pressure.changeLevel === "high") {
    items.push({
      title: "無理のない過ごし方を意識する",
      category: "rest",
      description: "予定に余白を作り、休める時間帯を確保する",
      reason: "気圧の変化が大きい目安のため、だるさを感じやすい可能性があります",
      intensity: "low",
    });
    items.push({
      title: "首・肩まわりをゆっくり回す",
      category: "stretch",
      description: "肩を後ろに大きく回したり、首を左右にゆっくり傾ける",
      reason: "緊張がたまりやすい時間帯の目安として",
      intensity: "low",
    });
  } else if (pressure.trend === "falling" && pressure.changeLevel === "medium") {
    items.push({
      title: "深呼吸と水分補給",
      category: "weather_care",
      description: "ゆっくりと息を吐く時間を意識し、こまめに水分をとる",
      reason: "気圧が下降傾向のため、無理せず過ごす目安に",
      intensity: "low",
    });
  } else if (pressure.trend === "rising" && pressure.changeLevel !== "low") {
    items.push({
      title: "軽めの散歩",
      category: "outing",
      description: "20分程度を目安にゆっくり歩く",
      reason: "気圧が上昇傾向で外に出やすい時間帯のため",
      intensity: "low",
    });
  } else {
    items.push({
      title: "通常通り過ごせる時間帯",
      category: "work",
      description: "無理のない範囲で予定を進める",
      reason: "気圧が安定した時間帯のため",
      intensity: "low",
    });
  }

  if (pollen.level === "high" || pollen.level === "very_high") {
    items.push({
      title: "帰宅後に上着を払う",
      category: "pollen_care",
      description: "玄関で軽く上着を払ってから室内に入る",
      reason: "花粉を室内に持ち込まないため",
      intensity: "low",
    });
    items.push({
      title: "洗濯物は室内干しの目安",
      category: "pollen_care",
      description: "外干しを避け、換気時間も短めにする",
      reason: "花粉が多い時間帯のため",
      intensity: "low",
    });
  }

  if (precipitation.level === "high") {
    items.push({
      title: "屋内中心の予定にする",
      category: "weather_care",
      description: "外出予定はずらす、または短時間にまとめる",
      reason: "降水量が多い見込みのため",
      intensity: "low",
    });
  }

  if (temperature.value >= 28) {
    items.push({
      title: "こまめに休憩と水分補給",
      category: "weather_care",
      description: "10〜15分ごとに小休憩、日陰で過ごす",
      reason: "気温が高い時間帯のため",
      intensity: "low",
    });
  }

  return items.map((item, i) => ({
    id: `${condition.slotId}-action-${i}`,
    slotId: condition.slotId,
    ...item,
  }));
}
