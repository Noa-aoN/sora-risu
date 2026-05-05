export type Priority = "required" | "recommended" | "optional";

export type StyleTag = "simple" | "casual" | "office" | "outdoor";

export type OutfitCategory =
  | "outer"
  | "top"
  | "bottom"
  | "shoes"
  | "accessory"
  | "indoor";

export type OutfitItem = {
  id: string;
  slotId: string;
  name: string;
  category: OutfitCategory;
  reason: string;
  priority: Priority;
  styleTags: StyleTag[];
};

export type CarryCategory =
  | "umbrella"
  | "mask"
  | "medicine"
  | "sunshade"
  | "water"
  | "warmth"
  | "pollen"
  | "other";

export type CarryItem = {
  id: string;
  slotId: string;
  name: string;
  category: CarryCategory;
  reason: string;
  priority: Priority;
};

export type ActionCategory =
  | "stretch"
  | "training"
  | "rest"
  | "work"
  | "outing"
  | "pollen_care"
  | "weather_care";

export type ActionItem = {
  id: string;
  slotId: string;
  title: string;
  category: ActionCategory;
  description: string;
  reason: string;
  intensity: "low" | "medium" | "high";
};

export type LetterCategory =
  | "pressure"
  | "rain"
  | "pollen"
  | "temp"
  | "calm"
  | "no_data";

export type SkyLetter = {
  title: string;
  body: string;
  tone: "calm" | "gentle" | "alert";
  category: LetterCategory;
};

export type BodyType = "neutral" | "cold_sensitive" | "heat_sensitive";

export type SceneSelection = {
  indoor: boolean;
  outdoor: boolean;
};

export const DEFAULT_SCENES: SceneSelection = {
  indoor: true,
  outdoor: true,
};

export type UserProfile = {
  styleGenre: StyleTag;
  bodyType: BodyType;
  scenes: SceneSelection;
};
