import { Mail } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SkyLetter } from "@/types/recommendation";

export function SkyLetterCard({ letter }: { letter: SkyLetter }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2 text-leaf-700">
          <Mail size={14} />
          <CardTitle className="text-base text-ink-800">
            {letter.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="rounded-[1.25rem] border border-leaf-100/80 bg-[radial-gradient(circle_at_top_left,_rgba(225,236,228,0.55),_rgba(248,250,246,0.95)_60%)] px-4 py-4">
          <p className="text-[15px] leading-7 text-ink-700">{letter.body}</p>
        </div>
      </CardContent>
    </Card>
  );
}
