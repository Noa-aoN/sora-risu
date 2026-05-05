# そらリス アーキテクチャ

最終確認: 2026-05-06

クライアント単独の Next.js (App Router) PWA。サーバ側にはユーザーデータを持たず、外部 API から取得した気象データをブラウザ内で正規化して UI に流す構造。

仕様の本体は [`docs/spec.md`](spec.md)。本ドキュメントは「データの流れ」と「コンポーネントの並び方」を 2 枚の図で素早く把握するための補助資料。

## 1. データフロー

ユーザーが地点を選んでから、画面に服装 / 持ち物 / 行動 / 空だよりが届くまでのシーケンス。

```mermaid
sequenceDiagram
    autonumber
    participant U as ユーザー
    participant LH as LocationHeader
    participant Store as useAppStore (zustand)
    participant Q as React Query (useWeather)
    participant API as Open-Meteo / Air Quality
    participant Norm as normalizeWeatherData
    participant Slots as buildTimeSlots
    participant Cond as buildWeatherConditions
    participant Reco as buildRecommendations
    participant UI as SummaryCard / Chart / TimeSynced / SkyLetter

    U->>LH: 地点を検索 / 現在地ボタン
    LH->>Store: setLocation(geo)
    Store-->>Q: location 更新
    Q->>API: fetchForecast / fetchAirQuality
    API-->>Q: raw JSON
    Q->>Norm: normalize
    Norm-->>UI: NormalizedWeather / NormalizedPollen
    UI->>Slots: buildCardSlots(dayOffset, range)
    Slots-->>UI: TimeSlot[]
    UI->>Cond: buildWeatherConditions(slots, weather, pollen)
    Cond-->>UI: WeatherCondition[]
    UI->>Reco: buildRecommendations(conditions, profile)
    Reco-->>UI: { outfit, carry, action, letter }
    UI-->>U: カード描画
    U->>UI: 持ち物カードをチェック
    UI->>Store: toggleCarryCheck(slotId)
    Store-->>Store: persist (localStorage)
```

ポイント

- `useWeather` は React Query の `useQuery` を 2 本（forecast と air quality）走らせる。lat/lon が変わるとキー変更で自動再取得
- `weather` は `NormalizedWeather` に整形してから UI に渡す。生 JSON は UI へ届かない
- TimeSlot → WeatherCondition → Recommendations の 3 段で「時間軸 × 対象軸」を直交させ、UI は最終形だけ描画する責務に絞る
- 起動時、`onRehydrateStorage` で過去日付の checks を破棄してからストアが利用可能になる

## 2. コンポーネント階層

`AppShell` をラッパーに、`HomePage` 配下のセクションが縦に並ぶ。マスコット系・どんぐり系の小部品は横断的に再利用される。

```mermaid
flowchart TD
    Root[layout.tsx<br/>metadata / OGP / manifest]
    Providers[providers.tsx<br/>QueryClientProvider]
    Page[page.tsx HomePage<br/>useSyncExternalStore mounted gate]

    Root --> Providers --> Page
    Page --> Shell[AppShell]

    Shell --> TBG[TimeBasedBackground]
    Shell --> Footer[FooterCloudAnimation]
    Shell --> Content

    Content --> LH[LocationHeader]
    Content --> SC[SummaryCard]
    Content --> WC[WeatherChart]
    Content --> TPanel[TimelinePanel]
    Content --> TSec[TimeSyncedSection]
    Content --> SkyL[SkyLetterCard]
    Content --> SWord[SeasonalWordCard]
    Content --> Set[SettingsPanel]
    Content --> Foot[footer copyright + SecretAcornButton]

    TSec --> Outfit[OutfitItemCard]
    TSec --> Carry[CarryItemCard]
    TSec --> Act[ActionCard]

    SC -. uses .-> SoraPop[SoraRisuPopover<br/>状態別ポーズ]
    Set -. uses .-> SoraPop
    SkyL -. uses .-> Chirp[SkyMascotChirp<br/>縦書き一言]
    SkyL -. uses .-> Stamp[SeasonalStamp]

    Outfit -. uses .-> Roll[AcornRoll]
    Carry -. uses .-> Roll
    Act -. uses .-> Roll

    SC -. uses .-> Loader[AcornLoader<br/>初期読み込み]
    WC -. uses .-> Loader

    classDef shared fill:#fff7e0,stroke:#c8a87a,stroke-width:1px;
    class SoraPop,Chirp,Stamp,Roll,Loader,SecretAcornButton shared;
```

ポイント

- `HomePage` は `useSyncExternalStore` を使った mounted ゲートで、SSR 時はスケルトン、ハイドレーション後にダッシュボードへ切替（ローカル日時依存の処理を SSR から外す）
- `WeatherChart` は `next/dynamic({ ssr: false })` で完全にクライアント描画。Recharts の SVG が SSR 不要なため、初期 HTML を軽くする目的
- 黄色背景の部品（`SoraRisuPopover` / `SkyMascotChirp` / `SeasonalStamp` / `AcornRoll` / `AcornLoader`）はカードを跨いで使われる「マスコット・遊び心系」。トーンや動きの基準は [`spec.md` 14 章](spec.md#14-マスコット--遊び心-ui) に集約

## 3. 外部依存

| 種別 | 採用 | 用途 |
| --- | --- | --- |
| 気象 forecast | Open-Meteo Forecast API | 気温 / 気圧 / 降水 / 風 / 湿度 / 天気コード |
| 大気質 | Open-Meteo Air Quality API | 花粉指標 |
| 地点検索 (forward) | Open-Meteo Geocoding API + ローカル辞書 | 名称検索、市町村サフィックス展開 |
| 逆ジオコーディング | BigDataCloud reverse-geocode-client | 「現在地」ボタンで取得した緯度経度の表示名 |
| データ取得層 | TanStack React Query | フェッチ / キャッシュ / 再取得 |
| 永続化 | zustand `persist` + localStorage | 設定 / 地点 / 表示状態 / カード checks |
| Service Worker | Serwist | PWA キャッシュ / オフライン画面 |

商用化フェーズで差し替え検討する候補は [`docs/api-selection.md`](api-selection.md) 参照。
