export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-leaf-25 px-4 py-16 text-ink-800">
      <div className="mx-auto max-w-md space-y-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-leaf-700">
          Weather Dash
        </p>
        <h1 className="text-xl font-medium">オフラインのようです</h1>
        <p className="text-sm leading-relaxed text-ink-500">
          ネットワークに接続できないため、最新の天気データを取得できませんでした。接続が戻ったら、画面を更新してもう一度お試しください。
        </p>
      </div>
    </main>
  );
}
