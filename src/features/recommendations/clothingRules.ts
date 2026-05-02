import type {
  BodyType,
  OutfitItem,
  StyleTag,
  UserProfile,
} from "@/types/recommendation";
import type { WeatherCondition } from "@/types/weather";

type Bucket = "very_hot" | "hot" | "warm" | "mild" | "cool" | "cold" | "very_cold";

const ALL_STYLES: StyleTag[] = ["simple", "casual", "office", "outdoor"];

function adjustTemperatureForBody(temp: number, body: BodyType): number {
  switch (body) {
    case "cold_sensitive":
      return temp - 2;
    case "heat_sensitive":
      return temp + 2;
    default:
      return temp;
  }
}

function pickBucket(temp: number): Bucket {
  if (temp >= 30) return "very_hot";
  if (temp >= 25) return "hot";
  if (temp >= 20) return "warm";
  if (temp >= 15) return "mild";
  if (temp >= 10) return "cool";
  if (temp >= 5) return "cold";
  return "very_cold";
}

function baseItems(bucket: Bucket): Array<Omit<OutfitItem, "id" | "slotId">> {
  switch (bucket) {
    case "very_hot":
      return [
        {
          name: "半袖シャツ",
          category: "top",
          reason: "30度以上で熱がこもりやすいため",
          priority: "required",
          styleTags: ALL_STYLES,
        },
        {
          name: "通気性の良いボトム",
          category: "bottom",
          reason: "汗をかきやすい時間帯のため",
          priority: "recommended",
          styleTags: ALL_STYLES,
        },
        {
          name: "帽子",
          category: "accessory",
          reason: "直射日光を避けるため",
          priority: "recommended",
          styleTags: ["casual", "outdoor"],
        },
      ];
    case "hot":
      return [
        {
          name: "半袖または薄手シャツ",
          category: "top",
          reason: "気温が高めで動きやすい服装が良いため",
          priority: "required",
          styleTags: ALL_STYLES,
        },
        {
          name: "薄手の羽織り",
          category: "outer",
          reason: "冷房対策に",
          priority: "optional",
          styleTags: ["office", "simple"],
        },
      ];
    case "warm":
      return [
        {
          name: "長袖シャツ",
          category: "top",
          reason: "20度前後で過ごしやすい層構造",
          priority: "required",
          styleTags: ALL_STYLES,
        },
        {
          name: "薄手の羽織り",
          category: "outer",
          reason: "朝晩の冷え込みに備えるため",
          priority: "recommended",
          styleTags: ALL_STYLES,
        },
      ];
    case "mild":
      return [
        {
          name: "長袖",
          category: "top",
          reason: "肌寒さを感じやすい気温帯のため",
          priority: "required",
          styleTags: ALL_STYLES,
        },
        {
          name: "カーディガンまたは薄手ジャケット",
          category: "outer",
          reason: "気温の上下に対応しやすい一枚",
          priority: "recommended",
          styleTags: ALL_STYLES,
        },
      ];
    case "cool":
      return [
        {
          name: "ニットまたは厚手の長袖",
          category: "top",
          reason: "10度台前半は冷えを感じやすいため",
          priority: "required",
          styleTags: ALL_STYLES,
        },
        {
          name: "ジャケットまたは薄手コート",
          category: "outer",
          reason: "外気の冷たさをやわらげる目的",
          priority: "required",
          styleTags: ALL_STYLES,
        },
      ];
    case "cold":
      return [
        {
          name: "コート",
          category: "outer",
          reason: "本格的な冷えに備えるため",
          priority: "required",
          styleTags: ALL_STYLES,
        },
        {
          name: "マフラー",
          category: "accessory",
          reason: "首まわりからの冷えを抑えるため",
          priority: "recommended",
          styleTags: ALL_STYLES,
        },
        {
          name: "暖かいインナー",
          category: "top",
          reason: "重ね着で体温を保つ",
          priority: "recommended",
          styleTags: ALL_STYLES,
        },
      ];
    case "very_cold":
      return [
        {
          name: "厚手コート",
          category: "outer",
          reason: "冷え込みが強いため",
          priority: "required",
          styleTags: ALL_STYLES,
        },
        {
          name: "手袋",
          category: "accessory",
          reason: "末端の冷えを防ぐため",
          priority: "recommended",
          styleTags: ALL_STYLES,
        },
        {
          name: "防寒小物",
          category: "accessory",
          reason: "首・耳・足元を守るため",
          priority: "recommended",
          styleTags: ALL_STYLES,
        },
      ];
  }
}

function adjustments(
  condition: WeatherCondition,
): Array<Omit<OutfitItem, "id" | "slotId">> {
  const result: Array<Omit<OutfitItem, "id" | "slotId">> = [];
  const t = condition.temperature;
  const precip = condition.precipitation;
  const wind = condition.wind;
  const pollen = condition.pollen;

  if (
    typeof t.max === "number" &&
    typeof t.min === "number" &&
    t.max - t.min >= 8
  ) {
    result.push({
      name: "脱ぎ着しやすい羽織り",
      category: "outer",
      reason: "1日の気温差が8度以上の見込みのため",
      priority: "recommended",
      styleTags: ALL_STYLES,
    });
  }

  if ((precip.probability ?? 0) >= 50) {
    result.push({
      name: "撥水性のある靴",
      category: "shoes",
      reason: "降水確率が高い時間帯のため",
      priority: "recommended",
      styleTags: ALL_STYLES,
    });
  }

  if (wind && wind.level === "high") {
    result.push({
      name: "風を通しにくいアウター",
      category: "outer",
      reason: "風がやや強い見込みのため",
      priority: "recommended",
      styleTags: ALL_STYLES,
    });
  }

  if (pollen.level === "high" || pollen.level === "very_high") {
    result.push({
      name: "花粉が付きにくい素材の上着",
      category: "outer",
      reason: "花粉が多い時間帯のため",
      priority: "recommended",
      styleTags: ["simple", "office"],
    });
  }

  return result;
}

export function buildOutfitItems(
  condition: WeatherCondition,
  profile: UserProfile,
): OutfitItem[] {
  const adjustedTemp = adjustTemperatureForBody(
    condition.temperature.value,
    profile.bodyType,
  );
  const bucket = pickBucket(adjustedTemp);
  const items = [...baseItems(bucket), ...adjustments(condition)];

  return items
    .filter((item) => item.styleTags.includes(profile.styleGenre))
    .map((item, i) => ({
      id: `${condition.slotId}-outfit-${i}`,
      slotId: condition.slotId,
      ...item,
    }));
}
