import type { SkyLetter } from "@/types/recommendation";
import type { WeatherCondition } from "@/types/weather";

function pickToneAndBody(conditions: WeatherCondition[]): SkyLetter {
  const hasBigPressureSwing = conditions.some(
    (c) => c.pressure.changeLevel === "high",
  );
  const hasHighPollen = conditions.some(
    (c) => c.pollen.level === "high" || c.pollen.level === "very_high",
  );
  const hasHeavyRain = conditions.some((c) => c.precipitation.level === "high");
  const tempValues = conditions.map((c) => c.temperature.value);
  const tempMax = tempValues.length ? Math.max(...tempValues) : 0;
  const tempMin = tempValues.length ? Math.min(...tempValues) : 0;
  const tempSwing = tempMax - tempMin;

  if (hasBigPressureSwing) {
    return {
      title: "今日の空だより",
      tone: "alert",
      body: "気圧の動きが大きい目安の一日です。だるさを感じやすいかもしれないので、無理せず予定に少し余白を作ると過ごしやすいかもしれません。",
    };
  }

  if (hasHeavyRain) {
    return {
      title: "今日の空だより",
      tone: "gentle",
      body: "雨が強くなる時間帯がある見込みです。傘と濡れに強い靴を用意しつつ、屋内で進められる予定を中心に組むと安心です。",
    };
  }

  if (hasHighPollen) {
    return {
      title: "今日の空だより",
      tone: "gentle",
      body: "花粉が多めの一日になりそうです。マスクや帰宅後のひと払いを忘れずに、洗濯物は室内干しの目安で。",
    };
  }

  if (tempSwing >= 8) {
    return {
      title: "今日の空だより",
      tone: "gentle",
      body: "朝晩と日中で気温差が大きい一日です。脱ぎ着しやすい羽織りで体温を整えながら過ごしてください。",
    };
  }

  return {
    title: "今日の空だより",
    tone: "calm",
    body: "穏やかな空模様が続く目安の一日です。無理のない範囲で、今日できることを少しずつ進めていきましょう。",
  };
}

export function buildSkyLetter(conditions: WeatherCondition[]): SkyLetter {
  if (conditions.length === 0) {
    return {
      title: "今日の空だより",
      tone: "calm",
      body: "天気データを取得しています。少しお待ちください。",
    };
  }
  return pickToneAndBody(conditions);
}
