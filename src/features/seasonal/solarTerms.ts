export type SolarTerm = {
  term: string;
  reading: string;
  description: string;
  startMonth: number;
  startDay: number;
};

const TERMS: SolarTerm[] = [
  {
    term: "小寒",
    reading: "しょうかん",
    description: "寒の入り。寒さがいよいよ本格的になっていく時季。",
    startMonth: 1,
    startDay: 5,
  },
  {
    term: "大寒",
    reading: "だいかん",
    description: "一年でいちばん寒い時季。寒さの底から、また春へ向かい始める。",
    startMonth: 1,
    startDay: 20,
  },
  {
    term: "立春",
    reading: "りっしゅん",
    description: "暦のうえで春の入り口。寒さの底から、ひそやかに季節がうごき出す。",
    startMonth: 2,
    startDay: 4,
  },
  {
    term: "雨水",
    reading: "うすい",
    description: "雪が雨に変わる頃。氷も溶けて、土がやわらかくなり始める。",
    startMonth: 2,
    startDay: 19,
  },
  {
    term: "啓蟄",
    reading: "けいちつ",
    description: "冬ごもりの虫たちが目を覚ます頃。土の中から、小さな足音が聞こえてくる。",
    startMonth: 3,
    startDay: 5,
  },
  {
    term: "春分",
    reading: "しゅんぶん",
    description: "昼と夜がほぼ同じ長さになる頃。光がだんだんと長く差し込み始める。",
    startMonth: 3,
    startDay: 20,
  },
  {
    term: "清明",
    reading: "せいめい",
    description: "すべてが清らかに、明るく輝く頃。草木の若葉がいっせいに芽吹く。",
    startMonth: 4,
    startDay: 4,
  },
  {
    term: "穀雨",
    reading: "こくう",
    description: "穀物を育てる、しっとりとした春雨が降る頃。畑も気持ちもじんわり潤う。",
    startMonth: 4,
    startDay: 20,
  },
  {
    term: "立夏",
    reading: "りっか",
    description: "夏の入り口。新緑がきらきらして、心地よい風が通り始める。",
    startMonth: 5,
    startDay: 5,
  },
  {
    term: "小満",
    reading: "しょうまん",
    description: "草木がすくすくと育ち、満ち始める頃。生命の勢いが、そっと加速していく。",
    startMonth: 5,
    startDay: 21,
  },
  {
    term: "芒種",
    reading: "ぼうしゅ",
    description: "稲などの種をまく頃。蛍が舞い、梅の実が黄色く色づき始める。",
    startMonth: 6,
    startDay: 5,
  },
  {
    term: "夏至",
    reading: "げし",
    description: "一年で昼がいちばん長い日。これから少しずつ、夜が伸びていく。",
    startMonth: 6,
    startDay: 21,
  },
  {
    term: "小暑",
    reading: "しょうしょ",
    description: "暑さがだんだん本格化する頃。蝉の声が空に響き始める。",
    startMonth: 7,
    startDay: 7,
  },
  {
    term: "大暑",
    reading: "たいしょ",
    description: "一年でいちばん暑さが厳しい頃。日差しと打ち水で、夏のまんなか。",
    startMonth: 7,
    startDay: 22,
  },
  {
    term: "立秋",
    reading: "りっしゅう",
    description: "暦のうえでは秋の入り口。風の中に、ふっと涼しさがまざる。",
    startMonth: 8,
    startDay: 7,
  },
  {
    term: "処暑",
    reading: "しょしょ",
    description: "暑さがそろそろおさまる頃。朝晩の空気が、少しずつ和らいでいく。",
    startMonth: 8,
    startDay: 23,
  },
  {
    term: "白露",
    reading: "はくろ",
    description: "草に白い露が宿り始める頃。秋の気配がはっきり感じられるようになる。",
    startMonth: 9,
    startDay: 7,
  },
  {
    term: "秋分",
    reading: "しゅうぶん",
    description: "昼と夜がほぼ同じ長さになる頃。これから日が短くなっていく。",
    startMonth: 9,
    startDay: 23,
  },
  {
    term: "寒露",
    reading: "かんろ",
    description: "冷たい露が草に降りる頃。実りの秋がいっそう深まる。",
    startMonth: 10,
    startDay: 8,
  },
  {
    term: "霜降",
    reading: "そうこう",
    description: "朝晩に霜が降り始める頃。木々が紅葉し、冬の足音が近づく。",
    startMonth: 10,
    startDay: 23,
  },
  {
    term: "立冬",
    reading: "りっとう",
    description: "暦のうえで冬の入り口。北風が増えて、コートの出番がやってくる。",
    startMonth: 11,
    startDay: 7,
  },
  {
    term: "小雪",
    reading: "しょうせつ",
    description: "雪がちらつき始める頃。木枯らしと、初冬の冷たい空気。",
    startMonth: 11,
    startDay: 22,
  },
  {
    term: "大雪",
    reading: "たいせつ",
    description: "雪が本格的に降る頃。静かに積もる雪が、空気をきれいに整える。",
    startMonth: 12,
    startDay: 7,
  },
  {
    term: "冬至",
    reading: "とうじ",
    description: "一年で夜がいちばん長い日。柚子湯やかぼちゃで、体をあたためる時季。",
    startMonth: 12,
    startDay: 22,
  },
];

function startOfDayMs(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getTime();
}

export function pickSolarTerm(now: Date = new Date()): SolarTerm {
  const year = now.getFullYear();
  const t = now.getTime();

  let best: SolarTerm = TERMS[TERMS.length - 1] ?? TERMS[0]!;
  let bestStart = -Infinity;

  for (const term of TERMS) {
    const startThisYear = startOfDayMs(year, term.startMonth, term.startDay);
    const startLastYear = startOfDayMs(year - 1, term.startMonth, term.startDay);
    const candidateStart = startThisYear <= t ? startThisYear : startLastYear;
    if (candidateStart <= t && candidateStart > bestStart) {
      bestStart = candidateStart;
      best = term;
    }
  }
  return best;
}

export type SolarTermRange = SolarTerm & {
  startLabel: string;
  endLabel: string;
};

export function describeSolarTerm(now: Date = new Date()): SolarTermRange {
  const year = now.getFullYear();
  const t = now.getTime();
  const sorted = TERMS.flatMap((term) => [
    { ms: startOfDayMs(year - 1, term.startMonth, term.startDay), term },
    { ms: startOfDayMs(year, term.startMonth, term.startDay), term },
    { ms: startOfDayMs(year + 1, term.startMonth, term.startDay), term },
  ]).sort((a, b) => a.ms - b.ms);

  let curIdx = 0;
  for (let k = 0; k < sorted.length; k++) {
    if ((sorted[k]?.ms ?? Number.NEGATIVE_INFINITY) <= t) curIdx = k;
    else break;
  }
  const current = sorted[curIdx]!;
  const next = sorted[(curIdx + 1) % sorted.length]!;
  const endDate = new Date(next.ms - 24 * 60 * 60 * 1000);

  return {
    ...current.term,
    startLabel: `${current.term.startMonth}/${current.term.startDay}`,
    endLabel: `${endDate.getMonth() + 1}/${endDate.getDate()}`,
  };
}
