import type { GeoLocation } from "@/types/location";
import {
  buildQueryVariants,
  findMatchingPrefectures,
  mergeSearchResults,
  type RawGeocodingResult,
} from "./geocodingSearch.ts";

const GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

type RawSearchResponse = {
  results?: RawGeocodingResult[];
};

type PrefectureRepresentative = {
  query: string;
  admin2?: string;
  admin3?: string;
};

type LocalFallbackLocation = GeoLocation & {
  aliases: string[];
};

export type SearchLocationsInput = {
  query: string;
  language?: string;
  count?: number;
  signal?: AbortSignal;
};

const PREFECTURE_REPRESENTATIVES: Record<string, PrefectureRepresentative> = {
  北海道: { query: "札幌市", admin2: "北海道" },
  青森県: { query: "青森市" },
  岩手県: { query: "盛岡市" },
  宮城県: { query: "仙台市" },
  秋田県: { query: "秋田市" },
  山形県: { query: "山形市" },
  福島県: { query: "福島市" },
  茨城県: { query: "水戸市" },
  栃木県: { query: "宇都宮市" },
  群馬県: { query: "前橋市" },
  埼玉県: { query: "さいたま市" },
  千葉県: { query: "千葉市" },
  東京都: { query: "新宿区", admin2: "東京" },
  神奈川県: { query: "横浜市" },
  新潟県: { query: "新潟市" },
  富山県: { query: "富山市" },
  石川県: { query: "金沢市" },
  福井県: { query: "福井市" },
  山梨県: { query: "甲府市" },
  長野県: { query: "長野市" },
  岐阜県: { query: "岐阜市" },
  静岡県: { query: "静岡市" },
  愛知県: { query: "名古屋市" },
  三重県: { query: "津市" },
  滋賀県: { query: "大津市" },
  京都府: { query: "京都市" },
  大阪府: { query: "大阪市" },
  兵庫県: { query: "神戸市" },
  奈良県: { query: "奈良市" },
  和歌山県: { query: "和歌山市" },
  鳥取県: { query: "鳥取市" },
  島根県: { query: "松江市" },
  岡山県: { query: "岡山市" },
  広島県: { query: "広島市" },
  山口県: { query: "山口市" },
  徳島県: { query: "徳島市" },
  香川県: { query: "高松市" },
  愛媛県: { query: "松山市" },
  高知県: { query: "高知市" },
  福岡県: { query: "福岡市" },
  佐賀県: { query: "佐賀市" },
  長崎県: { query: "長崎市" },
  熊本県: { query: "熊本市" },
  大分県: { query: "大分市" },
  宮崎県: { query: "宮崎市" },
  鹿児島県: { query: "鹿児島市" },
  沖縄県: { query: "那覇市" },
};

const prefectureResultCache = new Map<string, RawGeocodingResult | null>();
const LOCAL_FALLBACK_LOCATIONS: LocalFallbackLocation[] = [
  {
    id: "manual-arao-kumamoto",
    name: "荒尾市",
    admin: "熊本県",
    country: "日本",
    latitude: 32.98672222222222,
    longitude: 130.43319444444444,
    timezone: "Asia/Tokyo",
    aliases: ["荒尾", "荒尾市"],
  },
];

async function fetchOne(
  query: string,
  language: string,
  count: number,
  signal: AbortSignal | undefined,
): Promise<RawGeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: count.toString(),
    language,
    format: "json",
  });
  let response: Response;
  try {
    response = await fetch(`${GEOCODING_ENDPOINT}?${params.toString()}`, {
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return [];
    throw err;
  }
  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.status}`);
  }
  const json = (await response.json()) as RawSearchResponse;
  return json.results ?? [];
}

async function fetchPrefectureFallbacks(
  query: string,
  language: string,
  signal: AbortSignal | undefined,
): Promise<RawGeocodingResult[]> {
  const matches = findMatchingPrefectures(query);
  if (matches.length === 0) return [];

  const settled = await Promise.allSettled(
    matches.map(async (prefectureName) => {
      const cached = prefectureResultCache.get(prefectureName);
      if (cached !== undefined) return cached;

      const representative = PREFECTURE_REPRESENTATIVES[prefectureName];
      if (!representative) return null;

      const candidates = await fetchOne(
        representative.query,
        language,
        1,
        signal,
      );
      const base = candidates[0];
      if (!base) {
        prefectureResultCache.set(prefectureName, null);
        return null;
      }

      const fallback: RawGeocodingResult = {
        ...base,
        id: base.id + 10_000_000,
        name: prefectureName,
        admin1: prefectureName,
        admin2: representative.admin2 ?? base.admin2,
        admin3: representative.admin3,
        feature_code: "ADM1",
      };

      prefectureResultCache.set(prefectureName, fallback);
      return fallback;
    }),
  );

  return settled.flatMap((result) => {
    if (result.status !== "fulfilled" || !result.value) return [];
    return [result.value];
  });
}

function normalizeQuery(value: string): string {
  return value.trim().toLocaleLowerCase("ja-JP");
}

export function findLocalFallbackLocations(query: string): GeoLocation[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];

  return LOCAL_FALLBACK_LOCATIONS.filter((location) =>
    location.aliases.some((alias) => {
      const candidate = normalizeQuery(alias);
      return (
        candidate === normalized ||
        candidate.startsWith(normalized) ||
        normalized.startsWith(candidate)
      );
    }),
  ).map((entry) => {
    const { aliases, ...location } = entry;
    void aliases;
    return location;
  });
}

export async function searchLocations({
  query,
  language = "ja",
  count = 12,
  signal,
}: SearchLocationsInput): Promise<GeoLocation[]> {
  const variants = buildQueryVariants(query);
  if (variants.length === 0) return [];

  const fetchCount = Math.max(count, 10);
  const settled = await Promise.allSettled(
    variants.map((v) => fetchOne(v, language, fetchCount, signal)),
  );
  const prefectureFallbacks = await fetchPrefectureFallbacks(
    query,
    language,
    signal,
  );

  const fulfilledResults: RawGeocodingResult[][] = [];
  for (const r of settled) {
    if (r.status !== "fulfilled") continue;
    fulfilledResults.push(r.value);
  }
  if (prefectureFallbacks.length > 0) {
    fulfilledResults.push(prefectureFallbacks);
  }

  const merged = mergeSearchResults(query, fulfilledResults);
  const localFallbacks = findLocalFallbackLocations(query);
  const resultIds = new Set(merged.map((item) => `${item.id}`));
  const dedupedLocalFallbacks = localFallbacks.filter(
    (item) => !resultIds.has(item.id),
  );

  const normalizedMerged = merged.slice(0, count).map((r) => ({
    id: `${r.id}`,
    name: r.name,
    admin: r.admin1,
    admin2: r.admin2,
    admin3: r.admin3,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));

  return [...dedupedLocalFallbacks, ...normalizedMerged].slice(0, count);
}
