"use client";

import { AcornIcon } from "@/components/brand/AcornIcon";
import { SoraRisuPopover } from "@/components/brand/SoraRisuPopover";
import { CheckIndicator } from "@/components/ui/check-indicator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/stores/useAppStore";
import type {
  BodyType,
  SceneSelection,
  StyleTag,
} from "@/types/recommendation";

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

  const setScene = (key: keyof SceneSelection, value: boolean) => {
    const next: SceneSelection = { ...profile.scenes, [key]: value };
    if (!next.indoor && !next.outdoor) return;
    setProfile({ scenes: next });
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AcornIcon />
          <CardTitle>設定</CardTitle>
        </div>
        <CardDescription>
          ジャンル / 体質 / シーンは服装・持ち物・アクションの提案に反映されます
        </CardDescription>
      </CardHeader>
      <CardContent className="pr-28 sm:pr-32">
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:max-w-xl sm:grid-cols-3">
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
            <Field label="シーン">
              <div className="flex flex-wrap gap-2 pt-0.5">
                <SceneChip
                  label="室内"
                  checked={profile.scenes.indoor}
                  onClick={() => setScene("indoor", !profile.scenes.indoor)}
                />
                <SceneChip
                  label="室外"
                  checked={profile.scenes.outdoor}
                  onClick={() => setScene("outdoor", !profile.scenes.outdoor)}
                />
              </div>
            </Field>
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-3 right-3 z-10 sm:bottom-4 sm:right-4">
        <SoraRisuPopover
          pose="on-cloud"
          size={104}
          ariaLabel="そらリスのこと"
          align="right"
        >
          <p className="font-brand text-sm text-ink-800">そらリスのこと</p>
          <p className="mt-1 text-[13px] leading-6 text-ink-600">
            空のすみっこに住んでいる小さなリス。雲のしっぽで風を読み、どんぐりに今日の空模様をしまっています。気圧がゆれる日や、雨が近い日は、そっと知らせに来てくれます。
          </p>
        </SoraRisuPopover>
      </div>
    </Card>
  );
}

function SceneChip({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
        checked
          ? "border-leaf-300 bg-leaf-50 text-leaf-800"
          : "border-leaf-100 bg-white text-ink-400 hover:bg-leaf-25",
      )}
    >
      <CheckIndicator checked={checked} />
      {label}
    </button>
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
      <span className="font-brand text-xs text-ink-500">{label}</span>
      <div>{children}</div>
    </label>
  );
}
