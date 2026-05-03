import { BrandMark } from "@/components/brand/BrandMark";

export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-16 text-ink-800">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <BrandMark className="h-10 w-10" />
          <span className="font-brand text-2xl text-leaf-700">そらリス</span>
        </div>
        <div className="space-y-3 rounded-3xl border border-cream-200 bg-white/70 px-6 py-8 shadow-sm">
          <h1 className="font-brand text-xl text-ink-700">
            空とつながれていません
          </h1>
          <p className="text-sm leading-relaxed text-ink-500">
            ネットワークに接続できないため、最新のお天気を取りに行けませんでした。
            <br />
            電波が戻ったら、画面を更新してもう一度のぞいてみてください。
          </p>
        </div>
        <p className="font-brand text-xs text-leaf-700">
          気圧と体調のそばに、やさしい空を。
        </p>
      </div>
    </main>
  );
}
