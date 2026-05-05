export type SeasonalWord = {
  term: string;
  reading: string;
  description: string;
  startMonth: number;
  startDay: number;
};

const TERMS: SeasonalWord[] = [
  {
    term: "雪下出麦",
    reading: "ゆきわたりてむぎのびる",
    description: "雪の下で麦が芽を出す頃。寒さの中にも、生命の力が静かに動いている。",
    startMonth: 1,
    startDay: 1,
  },
  {
    term: "芹乃栄",
    reading: "せりすなわちさかう",
    description: "せりがすくすくと育つ頃。お正月の七草の味わいで、体を整える時季。",
    startMonth: 1,
    startDay: 5,
  },
  {
    term: "水泉動",
    reading: "しみずあたたかをふくむ",
    description: "凍っていた地中の水が、ほんの少し動き出す頃。寒さの底でも、春の準備はもう始まっている。",
    startMonth: 1,
    startDay: 10,
  },
  {
    term: "雉始雊",
    reading: "きじはじめてなく",
    description: "雉のオスが鳴き始める頃。寒い朝に響く声が、ひそかに春を呼ぶ。",
    startMonth: 1,
    startDay: 15,
  },
  {
    term: "款冬華",
    reading: "ふきのはなさく",
    description: "ふきのとうが花を咲かせる頃。雪の下から春の使者が顔を出す。",
    startMonth: 1,
    startDay: 20,
  },
  {
    term: "水沢腹堅",
    reading: "さわみずこおりつめる",
    description: "沢の水が厚く凍る頃。一年で最も寒さが厳しい時季。",
    startMonth: 1,
    startDay: 25,
  },
  {
    term: "鶏始乳",
    reading: "にわとりはじめてとやにつく",
    description: "鶏が卵を産み始める頃。寒さの中にも、新しい命の予感。",
    startMonth: 1,
    startDay: 30,
  },
  {
    term: "東風解凍",
    reading: "はるかぜこおりをとく",
    description: "春風が氷を解かし始める頃。寒さの底をそろりと抜けて、空気がほんの少しゆるむ。",
    startMonth: 2,
    startDay: 4,
  },
  {
    term: "黄鶯睍睆",
    reading: "うぐいすなく",
    description: "山里でうぐいすが鳴き始める頃。春の声が遠くから聞こえてくる時季。",
    startMonth: 2,
    startDay: 9,
  },
  {
    term: "魚上氷",
    reading: "うおこおりをいずる",
    description: "割れた氷の間から魚が跳ね上がる頃。水面にも春の動きが現れ始める。",
    startMonth: 2,
    startDay: 14,
  },
  {
    term: "土脉潤起",
    reading: "つちのしょううるおいおこる",
    description: "雪解け水が大地にしみ込み、土がうるおい目を覚ます頃。",
    startMonth: 2,
    startDay: 19,
  },
  {
    term: "霞始靆",
    reading: "かすみはじめてたなびく",
    description: "遠くの景色が春霞に包まれ始める頃。空気がふんわりと柔らかい。",
    startMonth: 2,
    startDay: 24,
  },
  {
    term: "草木萌動",
    reading: "そうもくめばえいずる",
    description: "草木の新しい芽が動き出す頃。地面のあちこちに春のサインが顔を出す。",
    startMonth: 3,
    startDay: 1,
  },
  {
    term: "蟄虫啓戸",
    reading: "すごもりむしとをひらく",
    description: "土の中で冬眠していた虫たちが目覚めて、地上に出てくる頃。",
    startMonth: 3,
    startDay: 5,
  },
  {
    term: "桃始笑",
    reading: "ももはじめてさく",
    description: "桃の花がほころび始める頃。枝に明るいピンクの灯がともる。",
    startMonth: 3,
    startDay: 10,
  },
  {
    term: "菜虫化蝶",
    reading: "なむしちょうとなる",
    description: "青虫がモンシロチョウに姿を変える頃。畑のまわりが春らしくなる。",
    startMonth: 3,
    startDay: 15,
  },
  {
    term: "雀始巣",
    reading: "すずめはじめてすくう",
    description: "雀が巣を作り始める頃。屋根のすき間にも小さな営みが始まる。",
    startMonth: 3,
    startDay: 20,
  },
  {
    term: "桜始開",
    reading: "さくらはじめてひらく",
    description: "桜の花がほころび始める頃。今年の春の本番がいよいよやってくる。",
    startMonth: 3,
    startDay: 25,
  },
  {
    term: "雷乃発声",
    reading: "かみなりすなわちこえをはっす",
    description: "春の雷が遠くで鳴り始める頃。空気がしっとりと湿っていく。",
    startMonth: 3,
    startDay: 30,
  },
  {
    term: "玄鳥至",
    reading: "つばめきたる",
    description: "南からツバメが渡ってくる頃。軒先にすばやい影が舞い始める。",
    startMonth: 4,
    startDay: 4,
  },
  {
    term: "鴻雁北",
    reading: "こうがんかえる",
    description: "雁が北へ帰っていく頃。冬のお客さんがそろって去っていく時季。",
    startMonth: 4,
    startDay: 9,
  },
  {
    term: "虹始見",
    reading: "にじはじめてあらわる",
    description: "雨上がりに虹が見えるようになる頃。空気の透明感が日に日に増していく。",
    startMonth: 4,
    startDay: 14,
  },
  {
    term: "葭始生",
    reading: "あしはじめてしょうず",
    description: "水辺で葦の芽が伸び始める頃。川や池のまわりに緑が増えていく。",
    startMonth: 4,
    startDay: 19,
  },
  {
    term: "霜止出苗",
    reading: "しもやみてなえいずる",
    description: "霜が止んで、田んぼに苗が育ち始める頃。農作業の音が聞こえてくる。",
    startMonth: 4,
    startDay: 24,
  },
  {
    term: "牡丹華",
    reading: "ぼたんはなさく",
    description: "ふっくらと牡丹の花が咲く頃。庭に華やかな存在感が灯る。",
    startMonth: 4,
    startDay: 29,
  },
  {
    term: "蛙始鳴",
    reading: "かわずはじめてなく",
    description: "蛙が鳴き始める頃。夕方の田んぼがにぎやかになる。",
    startMonth: 5,
    startDay: 5,
  },
  {
    term: "蚯蚓出",
    reading: "みみずいずる",
    description: "ミミズが土の中から現れる頃。土の温度が上がってきたしるし。",
    startMonth: 5,
    startDay: 10,
  },
  {
    term: "竹笋生",
    reading: "たけのこしょうず",
    description: "たけのこが地面から顔を出す頃。春の終わりの恵みが食卓に並ぶ。",
    startMonth: 5,
    startDay: 15,
  },
  {
    term: "蚕起食桑",
    reading: "かいこおきてくわをはむ",
    description: "蚕が起きて桑の葉を食べ始める頃。古くからの初夏の風物詩。",
    startMonth: 5,
    startDay: 21,
  },
  {
    term: "紅花栄",
    reading: "べにばなさかう",
    description: "紅花が一面に咲き誇る頃。畑が黄から橙へとゆっくり染まる。",
    startMonth: 5,
    startDay: 26,
  },
  {
    term: "麦秋至",
    reading: "むぎのときいたる",
    description: "麦が黄金色に実る頃。もうすぐ刈り取りの「麦秋」がやってくる。",
    startMonth: 5,
    startDay: 31,
  },
  {
    term: "螳螂生",
    reading: "かまきりしょうず",
    description: "カマキリの子がかえる頃。小さな鎌が草陰に並び始める。",
    startMonth: 6,
    startDay: 5,
  },
  {
    term: "腐草為螢",
    reading: "くされたるくさほたるとなる",
    description: "草の根元から蛍が飛び立つ頃。夜の景色に小さな光が混じり始める。",
    startMonth: 6,
    startDay: 10,
  },
  {
    term: "梅子黄",
    reading: "うめのみきばむ",
    description: "梅の実が黄色く熟す頃。梅雨の言葉はここから生まれた。",
    startMonth: 6,
    startDay: 15,
  },
  {
    term: "乃東枯",
    reading: "なつかれくさかるる",
    description: "夏枯草（うつぼぐさ）が枯れていく頃。本格的な夏の入り口。",
    startMonth: 6,
    startDay: 21,
  },
  {
    term: "菖蒲華",
    reading: "あやめはなさく",
    description: "あやめが花を咲かせる頃。雨の合間に紫の便りが届く。",
    startMonth: 6,
    startDay: 26,
  },
  {
    term: "半夏生",
    reading: "はんげしょうず",
    description: "半夏が生え、田植えがひと段落する頃。農家にとって節目の日。",
    startMonth: 7,
    startDay: 1,
  },
  {
    term: "温風至",
    reading: "あつかぜいたる",
    description: "あたたかい風が吹きはじめる頃。本格的な夏の訪れ。",
    startMonth: 7,
    startDay: 7,
  },
  {
    term: "蓮始開",
    reading: "はすはじめてひらく",
    description: "蓮の花が開き始める頃。早朝の池がいちばん美しい時間帯。",
    startMonth: 7,
    startDay: 12,
  },
  {
    term: "鷹乃学習",
    reading: "たかすなわちわざをならう",
    description: "鷹のひなが飛び方を覚える頃。空を見上げるとさかんに練習している。",
    startMonth: 7,
    startDay: 17,
  },
  {
    term: "桐始結花",
    reading: "きりはじめてはなをむすぶ",
    description: "桐が実を結び始める頃。夏の盛りの一里塚。",
    startMonth: 7,
    startDay: 23,
  },
  {
    term: "土潤溽暑",
    reading: "つちうるおうてむしあつし",
    description: "土がじっとりと湿って蒸し暑くなる頃。一年で最もこたえる時季。",
    startMonth: 7,
    startDay: 28,
  },
  {
    term: "大雨時行",
    reading: "たいうときどきにふる",
    description: "ときどき大雨が降る頃。夕立が空気をすっと冷ましていく。",
    startMonth: 8,
    startDay: 2,
  },
  {
    term: "涼風至",
    reading: "すずかぜいたる",
    description: "夏の終わりに涼しい風が吹き始める頃。ふっと肩の力が抜ける。",
    startMonth: 8,
    startDay: 8,
  },
  {
    term: "寒蝉鳴",
    reading: "ひぐらしなく",
    description: "ヒグラシが鳴き始める頃。夕暮れの音色が秋の入り口を運ぶ。",
    startMonth: 8,
    startDay: 13,
  },
  {
    term: "蒙霧升降",
    reading: "ふかききりまとう",
    description: "深い霧が山に立ちこめる頃。朝晩の気温差が増していく。",
    startMonth: 8,
    startDay: 18,
  },
  {
    term: "綿柎開",
    reading: "わたのはなしべひらく",
    description: "綿の花を包むがくが開く頃。秋の収穫の合図。",
    startMonth: 8,
    startDay: 23,
  },
  {
    term: "天地始粛",
    reading: "てんちはじめてさむし",
    description: "暑さがおさまり、空気が落ち着いていく頃。",
    startMonth: 8,
    startDay: 28,
  },
  {
    term: "禾乃登",
    reading: "こくものすなわちみのる",
    description: "稲が実り始める頃。田んぼ一面が黄色に変わっていく。",
    startMonth: 9,
    startDay: 2,
  },
  {
    term: "草露白",
    reading: "くさのつゆしろし",
    description: "草の上の露が白く光って見える頃。秋の気配が日に日に濃くなる。",
    startMonth: 9,
    startDay: 8,
  },
  {
    term: "鶺鴒鳴",
    reading: "せきれいなく",
    description: "セキレイが鳴き始める頃。水辺に秋の声が増えていく。",
    startMonth: 9,
    startDay: 13,
  },
  {
    term: "玄鳥去",
    reading: "つばめさる",
    description: "ツバメが南へ帰っていく頃。夏の主役が静かに去っていく。",
    startMonth: 9,
    startDay: 18,
  },
  {
    term: "雷乃収声",
    reading: "かみなりすなわちこえをおさむ",
    description: "夏の雷が鳴りやむ頃。空がぐっと静かになる。",
    startMonth: 9,
    startDay: 23,
  },
  {
    term: "蟄虫坏戸",
    reading: "むしかくれてとをふさぐ",
    description: "虫たちが土に潜って戸を閉じる頃。冬支度がはじまる。",
    startMonth: 9,
    startDay: 28,
  },
  {
    term: "水始涸",
    reading: "みずはじめてかるる",
    description: "田んぼの水を抜き、稲の刈り取り準備が進む頃。",
    startMonth: 10,
    startDay: 3,
  },
  {
    term: "鴻雁来",
    reading: "こうがんきたる",
    description: "雁が北から渡ってくる頃。冬のお客さんが空にやってくる。",
    startMonth: 10,
    startDay: 8,
  },
  {
    term: "菊花開",
    reading: "きくのはなひらく",
    description: "菊の花が咲き始める頃。秋の盛りが香り立つ。",
    startMonth: 10,
    startDay: 13,
  },
  {
    term: "蟋蟀在戸",
    reading: "きりぎりすとにあり",
    description: "コオロギが戸口で鳴く頃。夜長の足音が近づく。",
    startMonth: 10,
    startDay: 18,
  },
  {
    term: "霜始降",
    reading: "しもはじめてふる",
    description: "山あいで霜が降り始める頃。朝の景色が白く粉をふく。",
    startMonth: 10,
    startDay: 23,
  },
  {
    term: "霎時施",
    reading: "こさめときどきふる",
    description: "通り雨がぱらぱらと降る頃。空気の湿り気が冬めいてくる。",
    startMonth: 10,
    startDay: 28,
  },
  {
    term: "楓蔦黄",
    reading: "もみじつたきばむ",
    description: "もみじやつたが色づく頃。山が一年で一番にぎやかな表情に。",
    startMonth: 11,
    startDay: 2,
  },
  {
    term: "山茶始開",
    reading: "つばきはじめてひらく",
    description: "山茶花が咲き始める頃。冬の入り口を彩る華やかな便り。",
    startMonth: 11,
    startDay: 7,
  },
  {
    term: "地始凍",
    reading: "ちはじめてこおる",
    description: "大地が凍り始める頃。朝、霜柱の音が鳴り始める。",
    startMonth: 11,
    startDay: 12,
  },
  {
    term: "金盞香",
    reading: "きんせんかさく",
    description: "水仙の香りが漂う頃。寒い空気の中で凛と立つ姿が美しい。",
    startMonth: 11,
    startDay: 17,
  },
  {
    term: "虹蔵不見",
    reading: "にじかくれてみえず",
    description: "虹が見えなくなる頃。空の彩度がだんだん落ちていく。",
    startMonth: 11,
    startDay: 22,
  },
  {
    term: "朔風払葉",
    reading: "きたかぜこのはをはらう",
    description: "北風が木の葉を払う頃。風の冷たさが本格的になる。",
    startMonth: 11,
    startDay: 27,
  },
  {
    term: "橘始黄",
    reading: "たちばなはじめてきばむ",
    description: "橘の実が黄色く色づく頃。冬の柑橘の便り。",
    startMonth: 12,
    startDay: 2,
  },
  {
    term: "閉塞成冬",
    reading: "そらさむくふゆとなる",
    description: "天地の気がふさがって、本格的な冬になる頃。",
    startMonth: 12,
    startDay: 7,
  },
  {
    term: "熊蟄穴",
    reading: "くまあなにこもる",
    description: "熊が穴に入って冬ごもりを始める頃。",
    startMonth: 12,
    startDay: 12,
  },
  {
    term: "鱖魚群",
    reading: "さけのうおむらがる",
    description: "鮭が川を群れて遡る頃。命の力強さに胸が熱くなる。",
    startMonth: 12,
    startDay: 17,
  },
  {
    term: "乃東生",
    reading: "なつかれくさしょうず",
    description: "夏枯草の芽が出始める頃。冬至の頃なのに、もう次の準備が動き出している。",
    startMonth: 12,
    startDay: 22,
  },
  {
    term: "麋角解",
    reading: "さわしかのつのおつる",
    description: "大鹿が角を落とす頃。冬の自然のリズム。",
    startMonth: 12,
    startDay: 27,
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

export type SeasonalWordRange = SeasonalWord & {
  startLabel: string;
  endLabel: string;
};

export function describeSeasonalWord(now: Date = new Date()): SeasonalWordRange {
  const year = now.getFullYear();
  const t = now.getTime();
  const sorted = TERMS.flatMap((term) => [
    { ms: startOfYearMs(year - 1, term.startMonth, term.startDay), term },
    { ms: startOfYearMs(year, term.startMonth, term.startDay), term },
    { ms: startOfYearMs(year + 1, term.startMonth, term.startDay), term },
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
