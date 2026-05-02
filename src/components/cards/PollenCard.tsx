import { Flower } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pollenLevelLabel } from "@/lib/labels";
import type { PollenLevel } from "@/types/weather";

type Props = {
  level: PollenLevel;
  types: string[];
  available: boolean;
};

export function PollenCard({ level, types, available }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>花粉</CardTitle>
          <Badge tone="pollen">
            <Flower size={12} />
            {pollenLevelLabel(level)}
          </Badge>
        </div>
        <CardDescription>
          {available
            ? "Open-Meteo Air Quality（CAMS）の参考値"
            : "現地点ではデータ未提供（近日対応予定）"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!available && (
          <p className="text-xs leading-relaxed text-ink-500">
            この地域では花粉データの取得が安定していません。Phase 2 で Google Pollen API などへの差し替えを検討します。
          </p>
        )}
        {available && types.length === 0 && (
          <p className="text-xs leading-relaxed text-ink-500">
            目立った花粉は検出されていません。外干し・外出に向く時間帯の目安です。
          </p>
        )}
        {available && types.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-ink-500">注意したい花粉</p>
            <div className="flex flex-wrap gap-1.5">
              {types.map((t) => (
                <Badge key={t} tone="pollen">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
