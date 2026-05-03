# API 選定メモ

最終確認: 2026-05-03

このドキュメントは、現時点の MVP がどの天気・地点検索・花粉プロバイダを使っているか、なぜそれを選んだかを残すための内部メモ。**法務的アドバイスではない**。本番運用・商用利用・広告 / 課金導入・大量トラフィックを行う前には、必ず各プロバイダの規約とプライシングページを再確認すること。価格や条件は更新が頻繁なので、ここに書いた数字は**「最終確認日時点のおおよそ」**であり、実装直前に最新値を取り直す前提で読んでください。

## サマリ

そらリスは今のところ「セットアップが軽いこと」「ブラウザだけで動くこと」「個人 MVP として必要十分なデータが揃うこと」を優先している。Open-Meteo は forecast / 地点検索 / 大気質（花粉）のすべてを API キー不要（非商用）で賄えるので、デフォルトプロバイダにしている。BigDataCloud はリバースジオコーディング専用。Open-Meteo Geocoding は forward search しか持たないため、現在地（緯度経度）から地名を引くために組み合わせている。

商用化フェーズでは構成を見直す前提。コア天気データは Open-Meteo の有償プランへの移行が一番摩擦が少ない。花粉を売りにするなら Google Pollen API が最有力候補だが、Google Cloud のセットアップ・API キー管理・課金・依存先の偏りを引き受ける必要がある。

## 現在の構成

| 用途 | 採用プロバイダ | 採用理由 | 主な注意点 |
| --- | --- | --- | --- |
| 天気予報・気圧・降水・天気コード | Open-Meteo Forecast API | 非商用 MVP なら API キー不要、予報の項目が広く、REST が素直 | Free API は非商用 + レート制限あり |
| 地点検索 | Open-Meteo Geocoding API | 同じプロバイダで揃う。キー不要で MVP には十分 | 日本語の地名検索は完全一致寄りなので、アプリ側でクエリ変形とローカルフォールバックを足している |
| 花粉 | Open-Meteo Air Quality API | キー不要で、花粉トレンドのカードとグラフを成立させるだけのデータが取れる | 専用プロダクトに比べると対応範囲・予報日数が短い |
| 現在地の表示名（reverse geocode） | BigDataCloud reverse-geocode-client | キー不要、ブラウザから直接呼べる、Open-Meteo に無い reverse 機能を補える | 無料 client-side エンドポイントは「ユーザの現在地をデバイスから直接引く」用途向け。サーバ側処理や保存済み座標のバッチ処理には使わない |

## コスト構造の詳細

各プロバイダのコストは「リクエスト課金」「サブスクリプション」「無料枠」の組み合わせ方が違う。同じ MAU でも構成によって月額が桁で変わるので、以下を頭に入れて見積もる。

### Open-Meteo

- **Free / Non-commercial API**
  - 価格: **0 円**
  - 制限: 10,000 calls/day, 5,000 calls/hour, 600 calls/minute（IP ベース）
  - クレジット表示要件: CC BY 4.0 のクレジット必須（フッター等）
  - **商用利用不可**。広告・課金・サブスク・B2B 用途は規約違反
  - Forecast / Geocoding / Air Quality すべて同条件
- **Commercial API**（有償プラン）
  - 形式: 月額または年額のサブスクリプション + コール数枠
  - 規模感: 個人〜中規模なら **月数十ユーロ**、大規模なら従量で増える（最終的には実装直前に [pricing](https://open-meteo.com/en/pricing) を確認）
  - メリット: API キー発行・専用キャパシティ・正式な商用許諾・クレジット表示要件は緩む
  - リクエスト形式が Free 版と完全互換なので、**移行時にアプリ側のコード変更がほぼ不要**

### BigDataCloud

- **Free client-side reverse-geocode-client**
  - 価格: **0 円**
  - 用途限定: 「**ユーザのデバイス（ブラウザ / モバイル）から、本人の現在地を直接 reverse する**」場合のみ無料
  - **NG パターン**: サーバ側からの呼び出し、保存済み座標のバッチ変換、第三者の座標を引く（規約違反）
- **Reverse Geocoding API（有償・key 必要）**
  - 価格: 月間コール数による段階制（数千〜数百万）
  - 商用 / サーバ用途で使うなら必須

### Google Pollen API（Google Maps Platform）

- **Forecast endpoint**
  - 価格: **Maps Platform の従量課金**（Pollen Forecast は 1,000 リクエストあたり数ドル）
  - 月間 $200 の Maps クレジットあり（2026-05 時点。条件は変動するので [Maps Platform pricing](https://mapsplatform.google.com/pricing/) で要確認）
  - 必要な事前準備: GCP プロジェクト作成 + 課金有効化 + Pollen API 有効化 + API キー発行 + キー制限設定
- **Heatmap tiles**
  - 別課金（タイル枚数ベース）
- **対応国**: 65 か国以上、解像度 1km、最大 5 日予報
- **データモデル**: Universal Pollen Index、植物種ごとの詳細あり。アプリ内モデルの再設計が必要

### Mapbox Geocoding

- **Free tier**: 月 100,000 リクエストまで（forward / reverse 共通）
- **超過分**: 1,000 リクエストあたり数ドルから（巻数で逓減）
- API キー必須、商用利用 OK。Maps SDK との親和性が高い

### Google Maps / Places / Geocoding

- **Geocoding API**: $5/1,000 calls（無料クレジット内に収まる範囲もあり）
- **Places API**: エンドポイント別に細かく課金、相対的に高め
- 認知度は高いが、依存先 / コスト面で重い

### 気象庁（JMA）オープンデータ

- 価格: **無料**
- 形式: XML / GRIB2 で配信（API ではなくダウンロード型）
- 商用 OK だが、出典表示・改変表記等のルールに従う必要あり
- 開発工数が大きい（パーサ・正規化を自前で書く）

### Weathernews / 日本気象協会 API

- 価格: **問い合わせ前提**（営業 → 見積もり）
- B2B 向け契約。スポット個人開発には実質使えない

## 商用利用の可否（チェックリスト）

「商用」の判定は規約上グラデーションがある。本アプリで関係しそうなパターンを以下に整理。

| 利用形態 | Open-Meteo Free | Open-Meteo Paid | BigDataCloud client-free | Google Pollen | Mapbox |
| --- | --- | --- | --- | --- | --- |
| 個人開発・無償公開 | ◯ | ◯ | ◯ | ◯（要キー / 課金有効化） | ◯ |
| Vercel 等で無料デプロイ・無広告・寄付ボタンなし | ◯ | ◯ | ◯ | ◯ | ◯ |
| 寄付ボタン（Buy Me a Coffee 等）を置く | △（グレー、推奨は paid 移行） | ◯ | ◯ | ◯ | ◯ |
| 広告を表示する | ✗ | ◯ | ✗（用途規約違反の可能性） | ◯ | ◯ |
| 月額サブスクで課金 | ✗ | ◯ | サーバ用途で paid 必須 | ◯ | ◯ |
| B2B / 法人向け SaaS | ✗ | ◯ | サーバ用途で paid 必須 | ◯ | ◯ |
| ブラウザではなくサーバ側から API 呼び出し | ◯ | ◯ | ✗（Free は client-side のみ） | ◯ | ◯ |

ポイント:

- **Open-Meteo Free + 広告 / 課金 はアウト**。収益化の入口で paid 移行が必要。
- **BigDataCloud Free + サーバ用途 はアウト**。バックエンドで地名を引くなら paid。
- **Free 全般、レート制限が IP ベース**。スクレイピング的な大量取得や、アグリゲートしてキャッシュ配信するのも実質 NG。

## 検討した代替案

| プロバイダ | 強み | トレードオフ | 判断 |
| --- | --- | --- | --- |
| Open-Meteo 有償 API | リクエスト形式が MVP のままで、商用利用 OK・専用キャパ | 有料プラン + API キー管理 | コア天気データの商用移行先として最有力 |
| Google Pollen API | 5 日間の日次花粉予報、Universal Pollen Index、植物詳細、ヒートマップタイル、対応国が広い | Google Cloud プロジェクト・API キー・課金、独自の花粉データモデル | 花粉特化フェーズの候補 |
| Google Maps / Places / Geocoding | 検索精度・reverse の品質が高い | 課金、キー制約、規約レビュー、依存面が広い | 検索品質がプロダクト課題になったら検討 |
| Mapbox Geocoding | Fuzzy search・reverse の品質が良い、地図エコシステムが強い | 課金 / トークン管理 | Google の代替候補 |
| 気象庁オープンデータ | 日本特化のデータソース、公的データ | 取り込み・利用条件 / クレジットの整理が重い、花粉は対象外 | 将来研究テーマ。MVP デフォルトには採用しない |
| Weathernews / 日本気象協会 API | 日本市場向けプロダクト・商用サポート | 問い合わせ → 審査 → 契約フローが重く、コストが営業前提 | 国内で本気で商用化する段階での候補 |

## 機能比較マトリクス

「何が取れるか」を主要候補で並べたもの。◯は標準で取れる、△は条件付き、✗は取れない / 別プロダクト。

| 機能 | Open-Meteo | Google Pollen | Mapbox | JMA | Weathernews |
| --- | --- | --- | --- | --- | --- |
| 時間別予報（〜14 日） | ◯ | ✗ | ✗ | △（短期は強い） | ◯ |
| 気圧（hPa, 時間別） | ◯ | ✗ | ✗ | △ | ◯ |
| 降水量・降水確率 | ◯ | ✗ | ✗ | ◯ | ◯ |
| 風（速度・向き） | ◯ | ✗ | ✗ | ◯ | ◯ |
| 紫外線指数 | ◯ | ✗ | ✗ | △ | ◯ |
| 花粉（汎用） | ◯（粒度低め） | ◯（高品質） | ✗ | ✗ | ◯（地域別） |
| 花粉（種別） | △（一部） | ◯ | ✗ | ✗ | ◯ |
| 地点検索（forward） | ◯ | ✗ | ◯ | ✗ | ✗ |
| reverse geocoding | ✗ | ✗ | ◯ | ✗ | ✗ |
| 地図タイル | ✗ | ◯（花粉ヒートマップ） | ◯ | ✗ | ✗ |
| 過去データ（履歴） | ◯（Historical API） | △ | ✗ | ◯（過去報） | ◯ |
| API キー不要 | ◯（非商用のみ） | ✗ | ✗ | N/A | ✗ |
| 商用利用 | △（paid 必要） | ◯ | ◯ | ◯ | ◯ |

このマトリクスから読み取れる組み合わせ案:

- **MVP / 個人公開**: Open-Meteo + BigDataCloud（現構成）
- **商用化（最小コスト）**: Open-Meteo Paid + Mapbox Geocoding
- **花粉を主軸の差別化**: Open-Meteo Paid + **Google Pollen** + Mapbox / Google Geocoding
- **国内 B2B / 高品質志向**: Weathernews 契約 + Google Maps Platform 一式

## 選定基準

- ローカル開発が、私的なクレデンシャルなしで動くこと。
- MVP はバックエンド / プロキシなしで、ブラウザだけで完結すること。
- 気温・気圧・降水・天気コード・花粉が、アドバイスカードを成立させる粒度で取れること。
- 各プロバイダの規約が現在のユースケースと整合していること。
- 有償 / 商用プロバイダへ移行する際、ドメインモデルを書き直さずに差し替えられること。

## 既知の制約

- Open-Meteo の Free API は**非商用利用**専用。レート制限は 10,000 calls/day, 5,000 calls/hour, 600 calls/minute。
- Free API はアップタイム / 精度の保証なし。CC BY 4.0 の表示要件がある（本アプリではフッターに記載済）。
- BigDataCloud の無料 client-side reverse geocoding は「ユーザの現在地を、本人の同意のもとで直接ブラウザ / モバイルから引く」用途想定。サーバ側処理・保存済み座標・バッチ用途には使わない。
- Google Pollen API は API キーと Google Cloud のセットアップが必要。forecast エンドポイントは最大 5 日の日次花粉情報を返すが、地域・植物種ごとに対応状況が異なる。
- そらリスは予報を「判断」に変換するアプリなので、日本国内で商用展開する前には、気象業務法・広告・健康関連表記・責任関係について有資格者にレビューを依頼すること。

## 推奨される移行ステップ

1. 収益化なしの MVP / デモのうちは Open-Meteo + BigDataCloud のまま運用。
2. 非商用のままトラフィックが増えるなら、規約を確認した上でリクエストキャッシュ / プロキシを足す。
3. 商用化するなら、コア天気データを Open-Meteo 有償プラン（または別の商用プロバイダ）に移す。
4. 花粉を主軸の差別化要素にするなら、Google Pollen API を内部アダプタの裏で試作し、Open-Meteo Air Quality と網羅性 / 品質を比較する。
5. 本番運用時には、明示的なクレジット表記、モニタリング、レート制限ハンドリング、プロバイダエラー時の UI、規約 / プライバシーページを揃える。

## 参考リンク

- Open-Meteo Terms: https://open-meteo.com/en/terms
- Open-Meteo Pricing: https://open-meteo.com/en/pricing
- Open-Meteo Geocoding API docs: https://open-meteo.com/en/docs/geocoding-api
- Open-Meteo Air Quality API docs: https://open-meteo.com/en/docs/air-quality-api
- Google Pollen API overview: https://developers.google.com/maps/documentation/pollen/overview
- Google Pollen API forecast endpoint: https://developers.google.com/maps/documentation/pollen/forecast
- Google Maps Platform pricing: https://mapsplatform.google.com/pricing/
- BigDataCloud free client-side reverse geocoding: https://www.bigdatacloud.com/support/why-is-reverse-geocoding-api-free
- BigDataCloud API domains: https://www.bigdatacloud.com/docs/api-domains
- Mapbox Geocoding API pricing: https://www.mapbox.com/pricing
- 気象庁オープンデータ: https://www.data.jma.go.jp/developer/index.html
- 気象業務法（e-Gov）: https://elaws.e-gov.go.jp/document?lawid=327AC1000000165
