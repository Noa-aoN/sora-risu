import type { CarryItem } from "@/types/recommendation";
import type { WeatherCondition } from "@/types/weather";

export function buildCarryItems(condition: WeatherCondition): CarryItem[] {
  const items: Array<Omit<CarryItem, "id" | "slotId">> = [];
  const precip = condition.precipitation;
  const t = condition.temperature;
  const pollen = condition.pollen;

  if ((precip.probability ?? 0) >= 50 || precip.level === "high") {
    items.push({
      name: "折りたたみ傘",
      category: "umbrella",
      reason: "降水確率が高い時間帯があるため",
      priority: "required",
    });
  } else if ((precip.probability ?? 0) >= 30) {
    items.push({
      name: "折りたたみ傘",
      category: "umbrella",
      reason: "雨の可能性が残るため念のため",
      priority: "recommended",
    });
  }

  if (pollen.level === "high" || pollen.level === "very_high") {
    items.push({
      name: "マスク",
      category: "mask",
      reason: "花粉が多い見込みのため",
      priority: "required",
    });
    items.push({
      name: "目薬",
      category: "medicine",
      reason: "目のかゆみが出やすいため",
      priority: "recommended",
    });
  } else if (pollen.level === "medium") {
    items.push({
      name: "マスク",
      category: "mask",
      reason: "花粉がやや多めの見込みのため",
      priority: "recommended",
    });
  }

  if (t.value >= 28 || (t.max ?? 0) >= 28) {
    items.push({
      name: "水分",
      category: "water",
      reason: "気温が高く脱水を避けるため",
      priority: "recommended",
    });
  }

  if (t.value >= 28) {
    items.push({
      name: "日傘または帽子",
      category: "sunshade",
      reason: "強い日差しを避けるため",
      priority: "recommended",
    });
  }

  if (t.value <= 8) {
    items.push({
      name: "カイロ",
      category: "warmth",
      reason: "末端の冷え対策に",
      priority: "optional",
    });
  }

  if (
    condition.pressure.changeLevel === "high" ||
    (condition.pressure.changeLevel === "medium" &&
      condition.pressure.trend !== "stable")
  ) {
    items.push({
      name: "頓服や常備薬",
      category: "medicine",
      reason: "気圧の変化が大きい目安のため",
      priority: "optional",
    });
  }

  return items.map((item, i) => ({
    id: `${condition.slotId}-carry-${i}`,
    slotId: condition.slotId,
    ...item,
  }));
}
