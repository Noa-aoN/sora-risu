import type { SoraRisuPose } from "@/components/brand/SoraRisuPopover";
import type { NormalizedWeather, WeatherCondition } from "@/types/weather";
import { isFogCode, isSnowCode, isThunderstormCode } from "../../lib/labels.ts";

export type RisuMood = {
  pose: SoraRisuPose;
  message: string;
};

function dayHumidityRange(
  weather: NormalizedWeather | null,
): { min: number; max: number } | null {
  const day = weather?.daily[0];
  if (!day || !weather) return null;
  const todayPoints = weather.hourly.filter((p) => p.time.startsWith(day.date));
  if (todayPoints.length === 0) return null;
  const values = todayPoints.map((p) => p.humidity);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function dayHasCode(
  highlight: WeatherCondition | null,
  weather: NormalizedWeather | null,
  predicate: (code: number) => boolean,
): boolean {
  if (highlight?.weatherCode !== undefined && predicate(highlight.weatherCode))
    return true;
  const day = weather?.daily[0];
  if (day && predicate(day.weatherCode)) return true;
  if (day && weather) {
    const dateStr = day.date;
    if (
      weather.hourly.some(
        (p) => p.time.startsWith(dateStr) && predicate(p.weatherCode),
      )
    ) {
      return true;
    }
  }
  return false;
}

export function pickRisuMood(
  highlight: WeatherCondition | null,
  weather: NormalizedWeather | null = null,
): RisuMood {
  if (!highlight) {
    return {
      pose: "on-cloud",
      message: "今、空のようすを聞きにいってるよ。\n少し待っていてね。",
    };
  }

  const dailyTempMax = weather?.daily[0]?.tempMax;
  const dailyTempMin = weather?.daily[0]?.tempMin;

  if (highlight.pressure.changeLevel === "high") {
    return {
      pose: "pressure_low",
      message: "気圧が少し下がりそう。\n無理しすぎず過ごしてね。",
    };
  }

  if (dayHasCode(highlight, weather, isThunderstormCode)) {
    return {
      pose: "umbrella",
      message:
        "雷雨のおそれ。\n音が聞こえたらすぐ建物の中へ。屋外の予定は短めに。",
    };
  }

  if (dailyTempMax !== undefined && dailyTempMax >= 35) {
    return {
      pose: "sunny",
      message:
        "今日はかなり暑くなりそう。\n水分とこまめな休憩、日陰を上手に使って無理せずね。",
    };
  }

  if (dailyTempMin !== undefined && dailyTempMin >= 25) {
    return {
      pose: "sunny",
      message:
        "夜になっても気温が下がりにくい予報。\n寝苦しい時は冷房や保冷剤で、ぐっすり眠れるように。",
    };
  }

  const humidityRange = dayHumidityRange(weather);
  if (
    humidityRange &&
    humidityRange.max >= 80 &&
    dailyTempMax !== undefined &&
    dailyTempMax >= 28
  ) {
    return {
      pose: "sunny",
      message:
        "今日は蒸し暑い予報。\n通気のいい服でこまめに水分・塩分、無理せずクールダウンしよう。",
    };
  }

  if (dayHasCode(highlight, weather, isSnowCode)) {
    return {
      pose: "blanket",
      message:
        "雪が降る予報。\n滑りにくい靴と防水の上着で、足元と頭から冷えを守ろう。",
    };
  }

  if (highlight.precipitation.level === "high") {
    return {
      pose: "umbrella",
      message:
        "しっかり雨が降る時間があるよ。\n大きめの傘と濡れにくい靴で、足元から守ろう。",
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

  if (dailyTempMax !== undefined && dailyTempMax < 5) {
    return {
      pose: "blanket",
      message:
        "今日は冷え込みそう。\n厚手の上着と、手袋・マフラーで首・手首を温めて出かけよう。",
    };
  }

  if (dailyTempMin !== undefined && dailyTempMin < 0) {
    return {
      pose: "blanket",
      message:
        "夜は氷点下になりそう。\n足元の凍結に気をつけて、滑りにくい靴がおすすめ。",
    };
  }

  if (humidityRange && humidityRange.min <= 30) {
    return {
      pose: "pressure_calm",
      message:
        "空気が乾燥しやすい一日。\nのどとお肌の保湿、こまめな水分補給でいたわってね。",
    };
  }

  if (dayHasCode(highlight, weather, isFogCode)) {
    return {
      pose: "pressure_calm",
      message:
        "霧が出やすい予報。\n運転や自転車は早めにライトを点けて、いつもよりゆっくりめが安心。",
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
      message:
        "ぱらつく時間がありそう。\n出かける前に空を見てから決めよう。",
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
