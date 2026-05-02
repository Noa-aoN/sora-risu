import type {
  ActionItem,
  CarryItem,
  OutfitItem,
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

export function buildRecommendations(
  conditions: WeatherCondition[],
  profile: UserProfile,
): Recommendations {
  const outfit = conditions.flatMap((c) => buildOutfitItems(c, profile));
  const carry = conditions.flatMap((c) => buildCarryItems(c));
  const action = conditions.flatMap((c) => buildActionItems(c));
  const letter = buildSkyLetter(conditions);

  return { outfit, carry, action, letter };
}
