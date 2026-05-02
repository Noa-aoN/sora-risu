import type {
  ActionItem,
  CarryItem,
  OutfitItem,
  SceneSelection,
  SkyLetter,
  UserProfile,
} from "@/types/recommendation";
import type { WeatherCondition } from "@/types/weather";

import { buildActionItems } from "./actionRules";
import { buildCarryItems } from "./carryItemRules";
import { buildOutfitItems } from "./clothingRules";
import { buildSkyLetter } from "./letterRules";

export type Recommendations = {
  outfit: OutfitItem[];
  carry: CarryItem[];
  action: ActionItem[];
  letter: SkyLetter;
};

const OUTDOOR_OUTFIT_CATEGORIES: OutfitItem["category"][] = ["outer"];
const OUTDOOR_CARRY_CATEGORIES: CarryItem["category"][] = [
  "umbrella",
  "sunshade",
  "mask",
  "pollen",
];
const OUTDOOR_ACTION_CATEGORIES: ActionItem["category"][] = ["outing"];
const INDOOR_OUTFIT_CATEGORIES: OutfitItem["category"][] = ["indoor"];

function filterByScene<T extends { category: string }>(
  items: T[],
  scenes: SceneSelection,
  outdoorCategories: T["category"][],
  indoorCategories: T["category"][] = [],
): T[] {
  const indoor = scenes.indoor;
  const outdoor = scenes.outdoor;
  if (indoor && outdoor) return items;
  if (!indoor && !outdoor) return items;
  return items.filter((item) => {
    const isOutdoor = outdoorCategories.includes(item.category);
    const isIndoor = indoorCategories.includes(item.category);
    if (!outdoor && isOutdoor) return false;
    if (!indoor && isIndoor) return false;
    return true;
  });
}

export function buildRecommendations(
  conditions: WeatherCondition[],
  profile: UserProfile,
): Recommendations {
  const outfit = filterByScene(
    conditions.flatMap((c) => buildOutfitItems(c, profile)),
    profile.scenes,
    OUTDOOR_OUTFIT_CATEGORIES,
    INDOOR_OUTFIT_CATEGORIES,
  );
  const carry = filterByScene(
    conditions.flatMap((c) => buildCarryItems(c)),
    profile.scenes,
    OUTDOOR_CARRY_CATEGORIES,
  );
  const action = filterByScene(
    conditions.flatMap((c) => buildActionItems(c)),
    profile.scenes,
    OUTDOOR_ACTION_CATEGORIES,
  );
  const letter = buildSkyLetter(conditions);

  return { outfit, carry, action, letter };
}
