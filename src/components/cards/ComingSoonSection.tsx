import { Bell, CalendarRange, Coins, MoonStar, Smartphone, Sun } from "lucide-react";
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ComingItem = {
  icon: ReactNode;
  title: string;
  body: string;
};

const ITEMS: ComingItem[] = [
  {
    icon: <CalendarRange size={16} />,
    title: "7日 / 14日の空だより",
    body: "週の服装計画や旅行・イベント前の傾向把握に",
  },
  {
    icon: <Bell size={16} />,
    title: "気圧変化アラート",
    body: "急変の見込みを朝のうちにそっと知らせる",
  },
  {
    icon: <Sun size={16} />,
    title: "紫外線・熱中症ケア",
    body: "季節に合わせた屋外時間の目安を提案",
  },
  {
    icon: <MoonStar size={16} />,
    title: "月の満ち欠け / 季節暦",
    body: "コンディションを整える背景情報をそっと添える",
  },
  {
    icon: <Coins size={16} />,
    title: "プラン / 同期",
    body: "複数地点保存、週次レポート、デバイス間同期など",
  },
  {
    icon: <Smartphone size={16} />,
    title: "iOS / Android アプリ",
    body: "通知や HealthKit 連携を含むネイティブ版を検討中",
  },
];

export function ComingSoonSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>近日追加の機能</CardTitle>
        <CardDescription>育てていく予定です</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 sm:grid-cols-2">
          {ITEMS.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-leaf-100/70 bg-leaf-25 px-4 py-3"
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-leaf-700">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink-800">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-ink-500">
                    {item.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
