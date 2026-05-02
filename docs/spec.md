# Weather Dash 仕様書

気圧・天気・気温・降水・花粉から、服装・持ち物・行動を一画面で提案する PWA。
ミニアプリ Week 向け MVP として短期間で成立させつつ、将来的に通知・AI レポート・課金・モバイルアプリ化まで拡張できる構造を目指す。

---

## 1. プロダクト概要

### 1.1 コンセプト

> 今日の空と、うまく付き合う。

単なる天気予報アプリではない。ユーザーが知りたいのは「今日は何を着るか」「傘やマスクは必要か」「気圧で不調になりそうか」「いつ外出しやすいか」「無理しない方がいい時間帯はいつか」。本アプリは気象データをそのまま表示せず、生活判断に変換して提示する。

### 1.2 コア価値

1. 気圧変化をわかりやすく見る
2. 天気・気温・降水・花粉を生活判断に変換する
3. 朝・昼・晩、または選択時間軸に応じて服装を提案する
4. 持ち物をカード化し、チェックできる
5. 気圧・花粉・天候に合わせた行動やストレッチを提案する
6. 今日のひとこと・季節の便りでやさしい体験にする

---

## 2. プロダクト方針

### 2.1 機能の状態を分けて見せる

機能そのものは設計上削らず、状態を分ける。

- 実装済み
- 簡易実装
- 準備中
- 将来対応

未実装機能は完全に消すのではなく、UI 上では「準備中」「近日追加」として将来像を見せる。ただし未実装が多すぎると未完成感が出るため、初期画面では「現在使える機能」を中心に表示し、準備中機能は下部または設定画面にまとめる。

### 2.2 認証方針

MVP では認証なし。理由：

- ミニアプリ Week では初回体験の速さが重要
- 位置情報 + 認証は心理的ハードルが高い
- 実装コストを本質機能に回したい

初期保存は `localStorage` を使う。

保存対象：

- 選択地点
- 服装ジャンル
- 寒がり / 暑がり
- 持ち物チェック状態
- 表示モード

将来は任意ログイン（複数地点保存・通知設定・AI レポート履歴・週次レポート・デバイス間同期・課金・スキン保存）。

---

## 3. 情報設計

### 3.1 二軸設計

UX は時間軸と対象軸の 2 軸で整理する。

時間軸：現在 / 朝 / 昼 / 晩 / 24H / 3D / 7D / 14D / 任意日付 / 任意時間帯

対象軸：気圧 / 気温 / 天気 / 降水 / 風 / 湿度 / 花粉 / 紫外線 / 服装 / 持ち物 / 気圧ケア / 花粉ケア / おすすめ行動 / AI アドバイス / 季節の便り

重要なのは、Timeline Panel で選んだ時間軸に応じて、下部のカード表示も自動で対応すること。

---

## 4. Timeline Panel UX 仕様

### 4.1 基本思想

Timeline Panel は単なるグラフ切り替えではない。選択した時間軸に応じて、気圧・気温・降水・花粉・服装アイテムカード・持ち物カード・アクションカードがすべて同じ時間軸に沿って並ぶ。

- `24H` → 24 時間単位で全情報を見る
- `3D` → 3 日分の各日・各時間帯の情報を見る
- `朝/昼/晩` → その時間帯に必要な服装・持ち物・行動を見る

### 4.2 Timeline 選択肢

MVP：`24H` / `3D`
準備中：`7D` / `14D`
将来：任意日付 / 任意時間帯

### 4.3 24H モード

目的：今日〜明日にかけて、時間帯ごとの変化と行動を判断する。
表示単位：3 時間ごと、または朝・昼・晩・深夜。
表示内容：24 時間気圧グラフ、気温推移、降水確率/降水量、花粉レベル、時間帯別服装/持ち物/アクションカード。

UI 例：

```
08:00 朝
- 気圧：下降傾向
- 気温：17℃
- 降水：20%
- 花粉：やや多い
- 服装：薄手ジャケット、長袖
- 持ち物：マスク、目薬
- 行動：首肩ストレッチ、予定に余白

12:00 昼
- 気圧：安定
- 気温：23℃
- 降水：10%
- 花粉：多い
- 服装：シャツ、軽めの羽織り
- 持ち物：水分、日傘
- 行動：短い散歩、換気は控えめ

18:00 晩
- 気圧：再下降
- 気温：16℃
- 降水：60%
- 花粉：少なめ
- 服装：カーディガン、軽アウター
- 持ち物：折りたたみ傘
- 行動：入浴、画面時間を減らす
```

### 4.4 3D モード

目的：今日・明日・明後日の予定、服装、外出判断を立てる。
表示単位：日別 + 朝/昼/晩。
表示内容：3 日間の気圧トレンド、日別の最高/最低気温、降水傾向、花粉傾向、日別/時間帯別服装カード、日別持ち物カード、日別おすすめ行動。

### 4.5 7D モード（準備中）

目的：一週間の服装計画、外出予定、花粉対策。
将来表示内容：7 日間の天気/気温/気圧/花粉サマリー、曜日別の服装目安、週内の注意日、洗濯/外出/運動に向く日、週次空だより。

### 4.6 14D モード（準備中）

目的：旅行、イベント、予定調整のための長期傾向。
将来表示内容：14 日間の傾向、気温差、雨傾向、花粉傾向、旅行/イベント向け持ち物。

注意：14 日予報は精度に限界があるため、断定せず「傾向」として表示する。

---

## 5. 表示モード仕様

Timeline Panel とは別に、対象軸を切り替える。

MVP：まとめ / 気圧 / 服装
将来：まとめ / 気圧 / 天気 / 気温 / 降水 / 花粉 / 服装 / 持ち物 / 行動

### 5.1 まとめモード

初期表示。総合コンディション、気圧/気温/降水/花粉の要約、注意時間帯、服装サマリー、持ち物サマリー、今日のアクション、今日の空だより。

### 5.2 気圧モード

気圧グラフ、急変ポイント、最低/最高気圧、下降/上昇の時間帯、気圧ケアアクション。

### 5.3 服装モード

時間帯別服装カード、外/室内、持ち物カード、ジャンル切替、寒がり/暑がり補正。

---

## 6. 主要 UI コンポーネント

### 6.1 Home Dashboard

PC 版：

```
Header        : アプリ名 / 現在地 / 日付 / 検索フォーム / 現在の気圧/気温/天気
Summary Card  : 今日の総合コンディション / 注意ポイント / 服装サマリー / 持ち物サマリー
Timeline Panel: 24H / 3D / 7D / 14D / 対象軸タブ / グラフ
Time-Synced   : 服装アイテムカード / 持ち物カード / アクションカード
Letter        : 今日の空だより / 季節の豆知識
Future        : 通知 / 週次レポート / 月の満ち欠け / スキン
```

スマホ版：縦に上から、現在地・検索 → 今日の総合 → Timeline → 同期カード群 → 空だより → 準備中。

### 6.2 Timeline Panel 状態

```ts
type TimelineRange = "24h" | "3d" | "7d" | "14d";

type DisplayTarget =
  | "summary"
  | "pressure"
  | "temperature"
  | "precipitation"
  | "pollen"
  | "outfit"
  | "items"
  | "actions";
```

### 6.3 主要型

```ts
type TimeSlot = {
  id: string;
  label: string;            // 朝 / 昼 / 晩 / 08:00 / 今日 / 明日
  start: string;
  end: string;
  dateLabel: string;
  period: "morning" | "daytime" | "evening" | "night" | "daily";
};

type WeatherCondition = {
  slotId: string;
  pressure: {
    value: number;
    trend: "rising" | "falling" | "stable";
    changeLevel: "low" | "medium" | "high";
  };
  temperature: { value: number; min?: number; max?: number; feelsLike?: number };
  precipitation: { probability?: number; amount?: number; level: "none" | "low" | "medium" | "high" };
  pollen: { level: "none" | "low" | "medium" | "high" | "very_high" | "unknown"; types?: string[] };
  wind?: { speed: number; level: "low" | "medium" | "high" };
  humidity?: { value: number };
};

type OutfitItem = {
  id: string;
  slotId: string;
  name: string;
  category: "outer" | "top" | "bottom" | "shoes" | "accessory" | "indoor";
  reason: string;
  priority: "required" | "recommended" | "optional";
  styleTags: string[];
};

type CarryItem = {
  id: string;
  slotId: string;
  name: string;
  category: "umbrella" | "mask" | "medicine" | "sunshade" | "water" | "warmth" | "pollen" | "other";
  reason: string;
  priority: "required" | "recommended" | "optional";
  checked: boolean;
};

type ActionItem = {
  id: string;
  slotId: string;
  title: string;
  category: "stretch" | "training" | "rest" | "work" | "outing" | "pollen_care" | "weather_care";
  description: string;
  reason: string;
  intensity: "low" | "medium" | "high";
};
```

---

## 7. 服装・持ち物・アクション生成ルール

### 7.1 服装の判定要素

気温 / 最低/最高気温 / 時間帯 / 気温差 / 降水 / 風 / 湿度 / 花粉 / ユーザー体質 / 服装ジャンル / 外/室内。

### 7.2 気温別の基本服装

```
30℃以上 : 半袖 / 通気性の良い服 / 帽子 / 日傘 / 水分
25〜29℃ : 半袖 / 薄手シャツ / 日傘・帽子
20〜24℃ : 長袖シャツ / 薄手羽織り
15〜19℃ : 長袖 / カーディガン / 薄手ジャケット
10〜14℃ : ニット / ジャケット / 薄手コート
 5〜 9℃ : コート / マフラー / 暖かいインナー
 4℃以下 : 厚手コート / 手袋 / 防寒小物
```

### 7.3 補正ルール

- 気温差 8℃ 以上 → 脱ぎ着しやすい羽織りを追加
- 降水確率 50% 以上 → 折りたたみ傘 / 靴・裾濡れ注意
- 風が強い → 風を通しにくいアウター / 丈の長い服に注意
- 花粉が多い → マスク / 眼鏡 / 花粉が付きにくい素材 / 帰宅後に上着を払う
- 紫外線が強い → 日傘 / 帽子 / 日焼け止め
- 室内冷房想定 → 薄手カーディガン / 羽織り

### 7.4 気圧アクション生成ルール

```
気圧下降 : 首・肩ストレッチ / 深呼吸 / 水分補給 / 予定に余白 / 画面時間を少し減らす
気圧上昇 : 軽い散歩 / 朝日を浴びる / 軽めの筋トレ / 作業を進める
気圧急変 : 無理な運動を避ける / 入浴 / こめかみ・首まわりを温める / 早めに休む
気圧安定 : 通常運転 / 外出・作業に向く
```

医療断定はしない。NG 表現「頭痛が起きます」「治ります」「この行動で改善します」。OK 表現「だるさを感じやすいかもしれません」「無理せず過ごす目安にしてください」「軽めのストレッチがおすすめです」。

### 7.5 花粉アクション生成ルール

```
花粉が多い : マスク / 眼鏡 / 目薬 / 帰宅後に服を払う / 洗濯物は室内干し / 換気時間を短めに
花粉が少ない : 外干ししやすい / 外出しやすい
```

---

## 8. API 候補とコスト

### 8.1 結論

MVP では Open-Meteo を第一候補。理由：

- API キーなしで始めやすい
- 非商用利用は無料
- 気圧・気温・降水・風などを取得できる
- JMA API もある

ただし Open-Meteo の無料 API は非商用利用向けで、利用条件として 1 日 10,000 コール未満、1 時間 5,000 コール未満、1 分 600 コール未満などの制限がある。商用利用では本番用 API キーや有償プランの検討が必要。

### 8.2 採用 API（MVP）

- Open-Meteo Forecast API（気温/気圧/降水/風/湿度/天気コード）
- Open-Meteo JMA API（日本向け天気予報）
- Open-Meteo Air Quality API（花粉/PM2.5/大気質）

### 8.3 商用化フェーズ候補

- Google Pollen API（最大 5 日間の花粉予報、対応 65 か国以上、解像度約 1km、従量課金）
- 日本気象協会 Weather Data API（事前承認制）
- Weathernews WxTech Data（問い合わせ型）

商用利用時は無料枠のまま本番運用しない。本番化・収益化・広告表示・課金導入時点で有償プランまたは別 API を検討する。

### 8.4 法務注意

日本国内向けに天気などの「予報業務」を行う場合、気象業務法第 17 条により気象庁長官の許可が必要。既存 API の予報値を表示するだけなのか、独自に加工して予報として発表するのか、ユーザーに継続的に予想を提供するのかで法的リスクが変わる。商用化前に必ず確認する。

### 8.5 採用フェーズ

```
Phase 1 MVP        : Open-Meteo Forecast / JMA / Air Quality
Phase 2 Week 後    : Open-Meteo 安定化 / Google Pollen 試験導入 / コスト監視
Phase 3 商用化     : Google Pollen / 日本気象協会 / Weathernews
Phase 4 本格モバイル: 独自 DB / 通知 / 課金 / AI レポート / 法務確認
```

---

## 9. 技術選定

### 9.1 MVP 構成

```
Frontend : Next.js / TypeScript / Tailwind CSS / shadcn/ui / Recharts
State    : React state / Zustand / localStorage
API      : Open-Meteo (Forecast / JMA / Air Quality)
PWA      : manifest / service worker / install 対応 / オフライン簡易画面
Deploy   : Vercel
```

### 9.2 採用理由

- Next.js: PWA 化しやすい、Vercel 相性、将来 API Routes 追加可
- TypeScript: 気象データの型管理に必須、AI 生成コードの破綻を防ぐ
- Tailwind CSS: 短期開発に強い、レスポンシブ即対応、トンマナ統一
- shadcn/ui: カード・タブ・トグル等を整えやすい
- Recharts: 気圧・気温・降水・花粉グラフ、React と相性良好
- Zustand: Timeline 選択 / 表示対象 / 地点 / 設定 / チェック状態を軽量管理

### 9.3 将来構成

```
Frontend : Next.js / Expo React Native / NativeWind
Backend  : Supabase or Rails API + PostgreSQL
Auth     : Supabase Auth / Google OAuth / Apple Sign In
Notif    : Web Push / FCM / LINE Messaging API / Email
Batch    : Vercel Cron / Supabase Edge Functions / Cloudflare Workers
AI       : OpenAI / Gemini / Claude
Payment  : Stripe / IAP / Google Play Billing
Analytics: Vercel Analytics / PostHog
Monitor  : Sentry / Better Stack
```

---

## 10. デザイン方針

### 10.1 引き継ぐ良い点

静かで上品な白〜薄緑トーン、気圧グラフを大きく見せる構造、現在値が目立つヘッダー、カード型の情報整理、急変アラート、リスク表示、予測サマリー。

### 10.2 改善点

「気圧分析ツール」ではなく「生活判断ツール」にする。追加するもの：服装アイテムカード、持ち物カード、アクションカード、花粉カード、今日の空だより、Timeline に同期したカード表示。

### 10.3 トーン

静か / やさしい / 上品 / 安心 / 朝に開きたくなる / 医療っぽすぎない / 天気アプリっぽすぎない / 情報が多くても散らからない。

### 10.4 配色

```
Base   : #F7F8F4 / #FFFFFF
Main   : #86A48B / #6F8F75
Text   : #2F352E / #6F766D
Accent : #E08A8A (注意) / #E6B85C (花粉・黄砂) / #6C9BD2 (雨)
```

---

## 11. 実装ステータス

### 11.1 MVP 実装

現在地取得 / 地点検索 / 気圧表示 / 気温表示 / 天気表示 / 降水表示 / 24H・3D グラフ / Timeline 切替 / Timeline 同期の服装・持ち物・アクションカード / 持ち物チェック / localStorage 保存 / 今日の空だより。

### 11.2 簡易実装

花粉カード / AI 風アドバイス / 服装ジャンル / 寒がり・暑がり補正 / 気圧ケア / 花粉ケア。

### 11.3 準備中表示

7D 詳細 / 14D 詳細 / 花粉アラート / 月の満ち欠け / 紫外線詳細 / LINE 通知 / 週次レポート / アカウント同期 / 課金 / スキン / モバイルアプリ。

---

## 12. データ設計

API から取得した生データを直接 UI に渡さず、必ず以下のパイプラインを通す。

```
Raw API Data
  ↓
Normalized Weather Data
  ↓
TimeSlot 生成
  ↓
WeatherCondition 生成
  ↓
OutfitItem / CarryItem / ActionItem 生成
  ↓
UI 表示
```

UI コンポーネント内に複雑な判定ロジックを書かない。判定は `features/recommendations/` に集約し、UI は受け取ったデータを描画する責務のみを持つ。

---

## 13. ディレクトリ構成

```
src/
  app/
    page.tsx
    layout.tsx
  components/
    layout/
      AppShell.tsx
      LocationHeader.tsx
    dashboard/
      SummaryCard.tsx
      TimelinePanel.tsx
      WeatherChart.tsx
      TimeSyncedSection.tsx
    cards/
      OutfitItemCard.tsx
      CarryItemCard.tsx
      ActionCard.tsx
      PollenCard.tsx
      SkyLetterCard.tsx
      ComingSoonSection.tsx
    settings/
      SettingsPanel.tsx
    ui/
      (shadcn 風プリミティブ: button / card / tabs / badge / input)
  features/
    weather/
      api/openMeteoClient.ts
      api/geocodingClient.ts
      mappers/normalizeWeatherData.ts
      services/buildTimeSlots.ts
      services/buildWeatherConditions.ts
    recommendations/
      clothingRules.ts
      carryItemRules.ts
      actionRules.ts
      letterRules.ts
  stores/
    useAppStore.ts
  types/
    timeline.ts
    weather.ts
    recommendation.ts
  lib/
    cn.ts
    date.ts
    storage.ts
    constants.ts
```
