"use client";

import { Settings } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/stores/useAppStore";
import type { BodyType, StyleTag } from "@/types/recommendation";

const STYLE_OPTIONS: Array<{ value: StyleTag; label: string }> = [
  { value: "simple", label: "シンプル" },
  { value: "casual", label: "カジュアル" },
  { value: "office", label: "オフィス" },
  { value: "outdoor", label: "アウトドア" },
];

const BODY_OPTIONS: Array<{ value: BodyType; label: string }> = [
  { value: "neutral", label: "ふつう" },
  { value: "cold_sensitive", label: "寒がり" },
  { value: "heat_sensitive", label: "暑がり" },
];

export function SettingsPanel() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const resetCarryChecks = useAppStore((s) => s.resetCarryChecks);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-leaf-700">
          <Settings size={14} />
          <CardTitle className="text-leaf-800">設定</CardTitle>
        </div>
        <CardDescription>
          ジャンルと体質補正は服装・持ち物の提案に反映されます
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="服装ジャンル">
            <Select
              value={profile.styleGenre}
              onChange={(e) =>
                setProfile({ styleGenre: e.target.value as StyleTag })
              }
            >
              {STYLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="体質補正">
            <Select
              value={profile.bodyType}
              onChange={(e) =>
                setProfile({ bodyType: e.target.value as BodyType })
              }
            >
              {BODY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="持ち物チェック">
            <button
              type="button"
              onClick={resetCarryChecks}
              className="h-9 rounded-full border border-leaf-200 bg-white px-4 text-xs text-ink-600 hover:bg-leaf-25"
            >
              すべて未チェックに戻す
            </button>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.2em] text-ink-400">
        {label}
      </span>
      <div>{children}</div>
    </label>
  );
}
