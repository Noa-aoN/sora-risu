export type SeasonalWord = {
  term: string;
  reading: string;
  description: string;
  startMonth: number;
  startDay: number;
};

const TERMS: SeasonalWord[] = [
  {
    term: "立春",
    reading: "りっしゅん",
    description: "春の始まり。寒さの底を抜け、これから少しずつ日が伸びていく。",
    startMonth: 2,
    startDay: 4,
  },
  {
    term: "雨水",
    reading: "うすい",
    description: "雪が雨に変わり、氷が溶け始める。春の気配が濃くなる頃。",
    startMonth: 2,
    startDay: 19,
  },
  {
    term: "啓蟄",
    reading: "けいちつ",
    description: "土の中で冬眠していた虫たちが目覚めて動き始める頃。",
    startMonth: 3,
    startDay: 5,
  },
  {
    term: "春分",
    reading: "しゅんぶん",
    description: "昼と夜の長さがほぼ同じになる日。本格的な春の入り口。",
    startMonth: 3,
    startDay: 20,
  },
  {
    term: "清明",
    reading: "せいめい",
    description: "万物が清々しく明るく見える頃。花も葉も生き生きとし始める。",
    startMonth: 4,
    startDay: 4,
  },
  {
    term: "穀雨",
    reading: "こくう",
    description: "穀物を潤す春の雨が降る頃。種まきや農作業が本格化する。",
    startMonth: 4,
    startDay: 20,
  },
  {
    term: "立夏",
    reading: "りっか",
    description: "暦の上では夏の始まり。新緑が眩しく、初夏の風が心地よい頃。",
    startMonth: 5,
    startDay: 5,
  },
  {
    term: "小満",
    reading: "しょうまん",
    description: "草木が成長して天地に満ち始める頃。陽気が日増しに高まる。",
    startMonth: 5,
    startDay: 21,
  },
  {
    term: "芒種",
    reading: "ぼうしゅ",
    description: "稲や麦など、芒 (のぎ) のある穀物の種を蒔く頃。梅雨入りも近い。",
    startMonth: 6,
    startDay: 6,
  },
  {
    term: "夏至",
    reading: "げし",
    description: "一年で最も昼が長い日。これから少しずつ日が短くなっていく。",
    startMonth: 6,
    startDay: 21,
  },
  {
    term: "小暑",
    reading: "しょうしょ",
    description: "暑さが本格的になり始める頃。梅雨明けが近づき、空も賑やかに。",
    startMonth: 7,
    startDay: 7,
  },
  {
    term: "大暑",
    reading: "たいしょ",
    description: "一年で最も暑さが厳しくなる頃。打ち水や夕涼みが心地よい時季。",
    startMonth: 7,
    startDay: 22,
  },
  {
    term: "立秋",
    reading: "りっしゅう",
    description: "暦の上では秋の始まり。残暑のなかにも、ふと風の変化を感じる頃。",
    startMonth: 8,
    startDay: 7,
  },
  {
    term: "処暑",
    reading: "しょしょ",
    description: "暑さがやわらぎ始める頃。朝晩に涼しさが混じり、空が澄んでくる。",
    startMonth: 8,
    startDay: 23,
  },
  {
    term: "白露",
    reading: "はくろ",
    description: "草の葉に朝露が宿り始める頃。秋の気配が日ごとに濃くなる。",
    startMonth: 9,
    startDay: 8,
  },
  {
    term: "秋分",
    reading: "しゅうぶん",
    description: "再び昼と夜の長さがほぼ同じになる日。これから夜が長くなっていく。",
    startMonth: 9,
    startDay: 23,
  },
  {
    term: "寒露",
    reading: "かんろ",
    description: "冷たい露が草葉に降りる頃。空気が澄み、秋が深まっていく。",
    startMonth: 10,
    startDay: 8,
  },
  {
    term: "霜降",
    reading: "そうこう",
    description: "朝晩の冷え込みで霜が降り始める頃。紅葉が見頃を迎える地域も。",
    startMonth: 10,
    startDay: 23,
  },
  {
    term: "立冬",
    reading: "りっとう",
    description: "暦の上では冬の始まり。木々の葉が落ち、冬支度を進める頃。",
    startMonth: 11,
    startDay: 7,
  },
  {
    term: "小雪",
    reading: "しょうせつ",
    description: "雪がちらつき始める頃。寒さが本格化していく予感が漂う。",
    startMonth: 11,
    startDay: 22,
  },
  {
    term: "大雪",
    reading: "たいせつ",
    description: "本格的に雪が降り積もる頃。山々や街並みが白く染まり始める。",
    startMonth: 12,
    startDay: 7,
  },
  {
    term: "冬至",
    reading: "とうじ",
    description: "一年で最も昼が短い日。柚子湯や南瓜で身体を温める習わしが残る。",
    startMonth: 12,
    startDay: 22,
  },
  {
    term: "小寒",
    reading: "しょうかん",
    description: "寒さが本格化していく頃。寒中見舞いの季節が始まる。",
    startMonth: 1,
    startDay: 5,
  },
  {
    term: "大寒",
    reading: "だいかん",
    description: "一年で最も寒さが厳しい頃。寒さの底を抜ければ、春の足音が近づく。",
    startMonth: 1,
    startDay: 20,
  },
];

function startOfYearMs(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getTime();
}

export function pickSeasonalWord(now: Date = new Date()): SeasonalWord {
  const year = now.getFullYear();
  const t = now.getTime();

  let best: SeasonalWord = TERMS[TERMS.length - 1] ?? TERMS[0]!;
  let bestStart = -Infinity;

  for (const term of TERMS) {
    const startThisYear = startOfYearMs(year, term.startMonth, term.startDay);
    const startLastYear = startOfYearMs(year - 1, term.startMonth, term.startDay);
    const candidateStart =
      startThisYear <= t ? startThisYear : startLastYear;
    if (candidateStart <= t && candidateStart > bestStart) {
      bestStart = candidateStart;
      best = term;
    }
  }
  return best;
}
