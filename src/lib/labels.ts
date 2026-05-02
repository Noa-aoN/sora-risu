import type { PollenLevel, PrecipLevel, PressureTrend } from "@/types/weather";

export function pressureTrendLabel(trend: PressureTrend): string {
  switch (trend) {
    case "rising":
      return "上昇傾向";
    case "falling":
      return "下降傾向";
    case "stable":
      return "安定";
  }
}

export function precipLevelLabel(level: PrecipLevel): string {
  switch (level) {
    case "none":
      return "降水なし";
    case "low":
      return "弱め";
    case "medium":
      return "やや多め";
    case "high":
      return "多い";
  }
}

export function pollenLevelLabel(level: PollenLevel): string {
  switch (level) {
    case "none":
      return "ほぼなし";
    case "low":
      return "少なめ";
    case "medium":
      return "やや多め";
    case "high":
      return "多い";
    case "very_high":
      return "非常に多い";
    case "unknown":
      return "データ未提供";
  }
}

export function weatherCodeLabel(code?: number): string {
  if (code === undefined) return "—";
  if (code === 0) return "快晴";
  if (code <= 2) return "晴れ";
  if (code === 3) return "くもり";
  if (code >= 45 && code <= 48) return "霧";
  if (code >= 51 && code <= 57) return "霧雨";
  if (code >= 61 && code <= 67) return "雨";
  if (code >= 71 && code <= 77) return "雪";
  if (code >= 80 && code <= 82) return "にわか雨";
  if (code >= 85 && code <= 86) return "雪";
  if (code >= 95) return "雷雨";
  return "—";
}
