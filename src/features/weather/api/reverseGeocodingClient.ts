const ENDPOINT = "https://api.bigdatacloud.net/data/reverse-geocode-client";

type RawResponse = {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  localityInfo?: {
    administrative?: Array<{
      name?: string;
      description?: string;
      order?: number;
    }>;
  };
};

export type ReverseGeocodeInput = {
  latitude: number;
  longitude: number;
  language?: string;
  signal?: AbortSignal;
};

export async function reverseGeocode({
  latitude,
  longitude,
  language = "ja",
  signal,
}: ReverseGeocodeInput): Promise<string | null> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    localityLanguage: language,
  });

  try {
    const response = await fetch(`${ENDPOINT}?${params.toString()}`, {
      signal,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as RawResponse;

    return (
      data.locality ||
      data.city ||
      pickFromAdministrative(data) ||
      data.principalSubdivision ||
      null
    );
  } catch {
    return null;
  }
}

function pickFromAdministrative(data: RawResponse): string | null {
  const list = data.localityInfo?.administrative ?? [];
  const sorted = [...list].sort(
    (a, b) => (b.order ?? 0) - (a.order ?? 0),
  );
  for (const entry of sorted) {
    if (entry.name && entry.name.trim().length > 0) return entry.name;
  }
  return null;
}
