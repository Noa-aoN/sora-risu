export type RawGeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  timezone?: string;
  population?: number;
  feature_code?: string;
};

const FEATURE_CODE_PRIORITY: Record<string, number> = {
  PPLC: 100,
  PPLA: 90,
  PPLA2: 80,
  PPLA3: 70,
  PPLA4: 60,
  PPLA5: 50,
  PPL: 40,
  PPLG: 35,
  PPLX: 30,
  PPLF: 10,
  PPLL: 5,
  ADM1: 45,
};

const EXCLUDED_FEATURE_CODES = new Set(["PPLH", "PPLQ", "PPLW"]);
const JP_COMPLETION_SUFFIXES = ["市", "区", "町", "村"] as const;
const JP_MUNICIPALITY_SUFFIX = /[市区町村]$/;
const JP_PREFECTURES = new Set([
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
]);
const JP_PREFECTURE_ENTRIES = Array.from(
  JP_PREFECTURES,
  (name) => [name.replace(/[都道府県]$/, ""), name] as const,
);
const JP_PREFECTURE_ALIASES = new Map(JP_PREFECTURE_ENTRIES);

export function buildQueryVariants(rawQuery: string): string[] {
  const trimmed = rawQuery.trim();
  if (trimmed.length === 0) return [];

  const variants = new Set<string>([trimmed]);
  const prefectureName = JP_PREFECTURE_ALIASES.get(trimmed);
  if (prefectureName) {
    variants.add(prefectureName);
  }

  if (!JP_MUNICIPALITY_SUFFIX.test(trimmed) && !JP_PREFECTURES.has(trimmed)) {
    for (const suffix of JP_COMPLETION_SUFFIXES) {
      variants.add(`${trimmed}${suffix}`);
    }
  }

  return Array.from(variants);
}

export function findMatchingPrefectures(rawQuery: string): string[] {
  const trimmed = rawQuery.trim();
  if (!trimmed) return [];

  return JP_PREFECTURE_ENTRIES.filter(([stem, fullName]) => {
    return (
      trimmed === stem ||
      trimmed === fullName ||
      stem.startsWith(trimmed) ||
      fullName.startsWith(trimmed)
    );
  }).map(([, fullName]) => fullName);
}

export function isWorthShowing(item: RawGeocodingResult): boolean {
  const fc = item.feature_code ?? "";
  if (fc === "ADM1") return true;
  if (!fc.startsWith("PPL")) return false;
  return !EXCLUDED_FEATURE_CODES.has(fc);
}

function normalizeMatchText(value: string | undefined): string {
  return (value ?? "").trim().toLocaleLowerCase("ja-JP");
}

function matchScore(query: string, item: RawGeocodingResult): number {
  const q = normalizeMatchText(query);
  if (!q) return 0;

  const name = normalizeMatchText(item.name);
  const admin1 = normalizeMatchText(item.admin1);
  const admin2 = normalizeMatchText(item.admin2);
  const admin3 = normalizeMatchText(item.admin3);

  if (name === q) return 400;
  if (name.startsWith(q)) return 300;
  if (admin1 === q) return 250;
  if (admin2 === q || admin3 === q) return 225;
  if (name.includes(q)) return 200;
  if (admin1.includes(q) || admin2.includes(q) || admin3.includes(q)) return 100;
  return 0;
}

export function compareResults(
  query: string,
  a: RawGeocodingResult,
  b: RawGeocodingResult,
): number {
  const ma = matchScore(query, a);
  const mb = matchScore(query, b);
  if (ma !== mb) return mb - ma;

  const fa = FEATURE_CODE_PRIORITY[a.feature_code ?? ""] ?? 0;
  const fb = FEATURE_CODE_PRIORITY[b.feature_code ?? ""] ?? 0;
  if (fa !== fb) return fb - fa;

  const pa = a.population ?? -1;
  const pb = b.population ?? -1;
  if (pa !== pb) return pb - pa;
  return 0;
}

export function mergeSearchResults(
  query: string,
  resultSets: RawGeocodingResult[][],
): RawGeocodingResult[] {
  const seen = new Map<number, RawGeocodingResult>();

  for (const results of resultSets) {
    for (const item of results) {
      if (!isWorthShowing(item)) continue;
      if (!seen.has(item.id)) seen.set(item.id, item);
    }
  }

  return Array.from(seen.values()).sort((a, b) => compareResults(query, a, b));
}
