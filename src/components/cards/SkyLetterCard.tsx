import { AcornIcon } from "@/components/brand/AcornIcon";
import { pickStampKind, SeasonalStamp } from "@/components/brand/SeasonalStamp";
import { SkyMascotChirp } from "@/components/brand/SkyMascotChirp";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SkyLetter } from "@/types/recommendation";

export function SkyLetterCard({ letter }: { letter: SkyLetter }) {
  const stampKind = pickStampKind(letter.category);
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AcornIcon bounce />
          <CardTitle>{letter.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="rounded-2xl bg-cream-50 px-4 py-4">
          <div className="flex items-start gap-3">
            <SkyMascotChirp />
            <div className="relative min-w-0 flex-1 rounded-2xl border border-cream-200 bg-white/85 px-4 py-4 shadow-sm">
              <span
                aria-hidden
                className="absolute left-[-7px] top-4 h-3 w-3 rotate-45 border-b border-l border-cream-200 bg-white/85"
              />
              <p className="whitespace-pre-line text-[15px] leading-7 text-ink-700">
                {letter.body}
              </p>
              <div className="mt-2 flex justify-end">
                <SeasonalStamp kind={stampKind} size={36} className="opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
