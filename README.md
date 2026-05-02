# Weather Dash

> 今日の空と、うまく付き合う。

気圧・天気・気温・降水・花粉から、服装・持ち物・行動を一画面で提案する PWA。Timeline で `24H` / `3D` を選ぶと、グラフだけでなく服装・持ち物・行動カードまでが同じ時間軸に同期して並び替わる。

## 必要環境

- Node.js 20 以上
- pnpm 10 以上
- ブラウザの位置情報取得を許可、または検索で地点を指定

## セットアップ

```sh
pnpm install
cp .env.example .env.local
```

## 起動

```sh
pnpm dev
# 親リポで :3000 が埋まっていれば PORT=3030 pnpm dev で逃がす
```

`http://localhost:3000` を開く。

## 主なスクリプト

```sh
pnpm dev         開発サーバ起動
pnpm build       本番ビルド
pnpm start       本番ビルドの起動
pnpm typecheck   TypeScript 型検査
pnpm lint        ESLint
```

## 使用 API

- Open-Meteo Forecast API（気温・気圧・降水・風・湿度・天気コード）
- Open-Meteo Geocoding API（地点検索）
- Open-Meteo Air Quality API（花粉）

非商用利用は無料・API キー不要。商用利用時は有償プランまたは別 API を検討する（詳細は `docs/spec.md`）。

## ドキュメント

- 設計仕様: [`docs/spec.md`](docs/spec.md)

## ライセンス

未定（リリース前にコミットする）。
