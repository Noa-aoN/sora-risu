"use client";

import { useQuery } from "@tanstack/react-query";
import { Compass, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchLocations } from "@/features/weather/api/geocodingClient";
import { reverseGeocode } from "@/features/weather/api/reverseGeocodingClient";
import { useAppStore } from "@/stores/useAppStore";
import type { GeoLocation } from "@/types/location";

const DEFAULT_LOCATION: GeoLocation = {
  id: "default-tokyo",
  name: "東京",
  admin: "東京都",
  country: "日本",
  latitude: 35.6812,
  longitude: 139.7671,
};

function useDebounced<T>(value: T, delay = 300): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function todayLabel(): string {
  const now = new Date();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 (${weekdays[now.getDay()]})`;
}

export function LocationHeader() {
  const location = useAppStore((s) => s.location);
  const setLocation = useAppStore((s) => s.setLocation);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounced(query);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocation(DEFAULT_LOCATION);
      return;
    }
    const controller = new AbortController();
    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return;
        const base: GeoLocation = {
          id: "current",
          name: "現在地",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocation(base);
        const name = await reverseGeocode({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          signal: controller.signal,
        });
        if (cancelled || !name) return;
        setLocation({ ...base, admin: name });
      },
      () => {
        if (cancelled) return;
        setLocation(DEFAULT_LOCATION);
      },
      { timeout: 6000, maximumAge: 60_000 },
    );
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [location, setLocation]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const search = useQuery({
    queryKey: ["geocoding", debounced],
    queryFn: ({ signal }) => searchLocations({ query: debounced, signal }),
    enabled: debounced.trim().length >= 1,
    staleTime: 5 * 60 * 1000,
  });

  function pickCurrent() {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const base: GeoLocation = {
          id: "current",
          name: "現在地",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocation(base);
        setOpen(false);
        const name = await reverseGeocode({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        if (!name) return;
        setLocation({ ...base, admin: name });
      },
      () => {},
      { timeout: 6000, maximumAge: 60_000 },
    );
  }

  function pickResult(loc: GeoLocation) {
    setLocation(loc);
    setOpen(false);
    setQuery("");
  }

  const results = search.data ?? [];

  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.3em] text-leaf-700">
            Weather Dash
          </p>
          <div className="flex items-center gap-2 text-ink-800">
            <MapPin size={16} className="text-leaf-700" />
            <span className="text-lg font-medium">
              {location?.name ?? "地点を選んでください"}
            </span>
            {location?.admin && (
              <span className="text-xs text-ink-500">{location.admin}</span>
            )}
          </div>
          <p className="text-xs text-ink-500">{todayLabel()}</p>
        </div>

        <div ref={containerRef} className="relative w-full max-w-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="地点を検索 (例: 京都)"
                className="pl-9"
              />
            </div>
            <Button
              type="button"
              variant="soft"
              size="sm"
              onClick={pickCurrent}
              className="shrink-0"
            >
              <Compass size={14} />
              現在地
            </Button>
          </div>

          {open && (debounced.length > 0 || results.length > 0) && (
            <div className="absolute left-0 right-0 top-12 z-20 max-h-72 overflow-y-auto rounded-2xl border border-leaf-100 bg-white p-1 shadow-lg shadow-leaf-900/[0.06]">
              {search.isFetching && (
                <p className="px-3 py-2 text-xs text-ink-400">検索中…</p>
              )}
              {!search.isFetching && results.length === 0 && (
                <p className="px-3 py-2 text-xs text-ink-400">
                  該当する地点が見つかりません
                </p>
              )}
              {results.map((r) => {
                const breadcrumb = [r.admin3, r.admin2, r.admin, r.country]
                  .filter(Boolean)
                  .join(" / ");
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => pickResult(r)}
                    className="flex w-full flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left hover:bg-leaf-25"
                  >
                    <span className="text-sm text-ink-800">{r.name}</span>
                    <span className="text-[11px] text-ink-500">
                      {breadcrumb || "—"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
