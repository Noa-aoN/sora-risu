# Weather Dash

「今日の天気どうかな」を見たあと、結局「で、何着る？傘いる？」を自分でやってる時間が地味に長い、という不満から作った小さな PWA。気圧・気温・降水・花粉の数字を表示するだけにせず、服装・持ち物・アクションのカードに翻訳して 1 画面に並べるのが軸です。ミニアプリ Week 第 2 弾（m-w-02）の個人 MVP。

## さわり心地

上の Timeline を 24H / 3D / 7D / 14D に切り替えると、グラフだけでなく下の服装・持ち物・アクションのカードも同じ時間軸に組み替わります。「いつの判断か」を 1 タップで揃えられるのが、自分で使っていて一番気に入っているところです。

朝・昼・晩・夜のスロットは色を統一していて、長い時間帯を眺めても視線が散らからない。持ち物カードは押すだけでチェックでき、状態はそのままブラウザに残ります（バックエンドなし）。位置情報を許可しなかった場合は東京を初期表示し、検索バーから差し替えられます。

裏側は Open-Meteo と BigDataCloud の鍵不要 API だけで動くので、`pnpm dev` 一発でフル体験できます。Serwist 経由で PWA としてホーム画面にも入れられます。

## 動かし方

```sh
pnpm install
pnpm dev
# http://localhost:3020
```

ポートはミニアプリ群で `m-w-NN → 3NN0` に揃えていて、このアプリは `3020`。被ったら `pnpm dev -- -p 3021` で枠内を逃がします。`.env.example` にキーは入っていません（MVP は外部キー不要で動く構成）。

## スクリプト

```sh
pnpm dev         # 開発サーバ
pnpm build       # 本番ビルド
pnpm start       # 本番起動
pnpm typecheck   # tsc --noEmit
pnpm lint        # ESLint
pnpm test        # Node test runner
```

## 中身

Next.js 16（webpack） / React 19 / TypeScript / Tailwind CSS v4 / Recharts / Zustand / TanStack Query / Serwist。Vite ではなく Next.js を選んだ経緯は `docs/spec.md` に書いています。

## 取り扱いの注意

バックエンドは無いので、位置情報・設定・カードのチェック状態はすべてブラウザの localStorage に置きっぱなしです。気象・地名取得 API はブラウザから直接呼んでいます。気圧や花粉から出している提案はあくまで生活判断のための材料で、医療助言ではありません。

## 続きを読む

- 仕様・設計判断: [docs/spec.md](docs/spec.md)
- API 比較・選定: [docs/api-selection.md](docs/api-selection.md)

## ライセンス

未設定。ライセンスファイルが追加されるまでデフォルトで再利用は許諾されません。
