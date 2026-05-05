<p align="center">
  <img src="public/brand/header-lockup.png" alt="そらリス｜気圧と体調のそばに、やさしい空を。" width="720" />
</p>

# そらリス

公開URL: <https://sora-risu.vercel.app>

空の変化に振り回される人のために。

そらリスは、天気・気温・降水確率・気圧・花粉をもとに、今日の服装・持ち物・過ごし方をやさしく提案するアプリです。

朝の「今日どうしよう」を少し減らし、低気圧の日も、雨の日も、花粉が多い日も、空とうまく付き合えるようにサポートします。

## 機能概要

上の Timeline を 24H / 3D / 7D / 14D に切り替えると、グラフを一覧で確認できます。
また、設定をもとに、今日の服装・持ち物・アクションのカードも自動で提示されます。
「いつの判断か」を 1 タップで揃えられるのが、自分で使っていて一番気に入っているところです。

朝・昼・夕方・夜のスロットは色を統一していて、長い時間帯を眺めても視線が散らからないです。
アドバイスカードは押すだけでチェックでき、状態はそのままブラウザに残ります（バックエンドなし）。
位置情報を許可しなかった場合は東京を初期表示し、検索バーから差し替えられます。

裏側は Open-Meteo と BigDataCloud の鍵不要 API だけで動く作りです。
Serwist 経由で PWA としてホーム画面にも入れられます。

## スクリプト

```sh
pnpm dev         # 開発サーバ
pnpm build       # 本番ビルド
pnpm start       # 本番起動
pnpm typecheck   # tsc --noEmit
pnpm lint        # ESLint
pnpm test        # Node test runner
```

## 技術選定

Next.js 16（webpack） / React 19 / TypeScript / Tailwind CSS v4 / Recharts / Zustand / TanStack Query / Serwist。Vite ではなく Next.js を選んだ経緯は `docs/spec.md` に書いています。

## 取り扱いの注意

バックエンドは無いので、位置情報・設定・カードのチェック状態はすべてブラウザの localStorage に置きっぱなしです。
気象・地名取得 API はブラウザから直接呼んでいます。
各気象情報から出している提案はあくまで生活判断のための材料で、医療助言ではありません。

## 判断詳細

- 仕様・設計判断: [docs/spec.md](docs/spec.md)
- API 比較・選定: [docs/api-selection.md](docs/api-selection.md)

## ライセンス

未設定。ライセンスファイルが追加されるまでデフォルトで再利用は許諾されません。
