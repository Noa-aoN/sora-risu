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
    <Card className="flex h-full flex-col bg-gradient-to-br from-leaf-25 to-white">
      <CardHeader>
        <div className="flex items-center gap-2 text-leaf-700">
          <Mail size={14} />
          <CardTitle className="text-leaf-800">{letter.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-ink-700">{letter.body}</p>
      </CardContent>
    </Card>
  );
}
