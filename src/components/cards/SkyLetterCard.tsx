import { Mail } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { SkyLetter } from "@/types/recommendation";

const TONE_CLASS: Record<SkyLetter["tone"], string> = {
  calm: "from-leaf-25 to-white",
  gentle: "from-leaf-50 to-white",
  alert: "from-alert-50 to-white",
};

export function SkyLetterCard({ letter }: { letter: SkyLetter }) {
  return (
    <Card
      className={cn(
        "bg-gradient-to-br",
        TONE_CLASS[letter.tone],
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-2 text-leaf-700">
          <Mail size={14} />
          <CardTitle className="text-leaf-800">{letter.title}</CardTitle>
        </div>
        <CardDescription>今日の空からのひとこと</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-ink-700">{letter.body}</p>
      </CardContent>
    </Card>
  );
}
