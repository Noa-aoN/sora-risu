import { AcornIcon } from "@/components/brand/AcornIcon";
import { MiniMascot } from "@/components/brand/MiniMascot";
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
        <div className="flex items-center gap-2">
          <AcornIcon />
          <CardTitle>{letter.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="rounded-[1.25rem] border border-sora-100 bg-[radial-gradient(circle_at_top_left,_rgba(207,228,243,0.45),_rgba(251,246,238,0.95)_60%)] px-4 py-4">
          <div className="flex items-start gap-3">
            <MiniMascot className="-mt-1" />
            <div className="relative min-w-0 flex-1 rounded-2xl border border-cream-200 bg-white/85 px-4 py-4 shadow-sm">
              <span
                aria-hidden
                className="absolute left-[-7px] top-4 h-3 w-3 rotate-45 border-b border-l border-cream-200 bg-white/85"
              />
              <p className="text-[15px] leading-7 text-ink-700">
                {letter.body}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
