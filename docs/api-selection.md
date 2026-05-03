# API 選定メモ

最終確認: 2026-05-03

このドキュメントは、現時点の MVP がどの天気・地点検索・花粉プロバイダを使っているか、なぜそれを選んだかを残すための内部メモ。法務的アドバイスではない。本番運用・商用利用・広告 / 課金導入・大量トラフィックを行う前には、必ず各プロバイダの利用規約を再確認すること。

## サマリ

そらリス は今のところ「セットアップが軽いこと」「ブラウザだけで動くこと」「個人 MVP として必要十分なデータが揃うこと」を優先している。Open-Meteo は forecast / 地点検索 / 大気質（花粉）のすべてを API キー不要（非商用）で賄えるので、デフォルトプロバイダにしている。BigDataCloud はリバースジオコーディング専用。Open-Meteo Geocoding は forward search しか持たないため、現在地（緯度経度）から地名を引くために組み合わせている。

商用化フェーズでは構成を見直す前提。コア天気データは Open-Meteo の有償プランへの移行が一番摩擦が少ない。花粉を売りにするなら Google Pollen API が最有力候補だが、Google Cloud のセットアップ・API キー管理・課金・依存先の偏りを引き受ける必要がある。

## 現在の構成

| 用途 | 採用プロバイダ | 採用理由 | 主な注意点 |
| --- | --- | --- | --- |
| 天気予報・気圧・降水・天気コード | Open-Meteo Forecast API | 非商用 MVP なら API キー不要、予報の項目が広く、REST が素直 | Free API は非商用 + レート制限あり |
| 地点検索 | Open-Meteo Geocoding API | 同じプロバイダで揃う。キー不要で MVP には十分 | 日本語の地名検索は完全一致寄りなので、アプリ側でクエリ変形とローカルフォールバックを足している |
| 花粉 | Open-Meteo Air Quality API | キー不要で、花粉トレンドのカードとグラフを成立させるだけのデータが取れる | 専用プロダクトに比べると対応範囲・予報日数が短い |
| 現在地の表示名（reverse geocode） | BigDataCloud reverse-geocode-client | キー不要、ブラウザから直接呼べる、Open-Meteo に無い reverse 機能を補える | 無料 client-side エンドポイントは「ユーザの現在地をデバイスから直接引く」用途向け。サーバ側処理や保存済み座標のバッチ処理には使わない |

## 検討した代替案

| プロバイダ | 強み | トレードオフ | 判断 |
| --- | --- | --- | --- |
| Open-Meteo 有償 API | リクエスト形式が MVP のままで、商用利用 OK・専用キャパ | 有料プラン + API キー管理 | コア天気データの商用移行先として最有力 |
| Google Pollen API | 5 日間の日次花粉予報、Universal Pollen Index、植物詳細、ヒートマップタイル、対応国が広い | Google Cloud プロジェクト・API キー・課金、独自の花粉データモデル | 花粉特化フェーズの候補 |
| Google Maps / Places / Geocoding | 検索精度・reverse の品質が高い | 課金、キー制約、規約レビュー、依存面が広い | 検索品質がプロダクト課題になったら検討 |
| Mapbox Geocoding | Fuzzy search・reverse の品質が良い、地図エコシステムが強い | 課金 / トークン管理 | Google の代替候補 |
| 気象庁オープンデータ | 日本特化のデータソース、公的データ | 取り込み・利用条件 / クレジットの整理が重い、花粉は対象外 | 将来研究テーマ。MVP デフォルトには採用しない |
| Weathernews / 日本気象協会 API | 日本市場向けプロダクト・商用サポート | 問い合わせ → 審査 → 契約フローが重く、コストが営業前提 | 国内で本気で商用化する段階での候補 |

## 選定基準

- ローカル開発が、私的なクレデンシャルなしで動くこと。
- MVP はバックエンド / プロキシなしで、ブラウザだけで完結すること。
- 気温・気圧・降水・天気コード・花粉が、アドバイスカードを成立させる粒度で取れること。
- 各プロバイダの規約が現在のユースケースと整合していること。
- 有償 / 商用プロバイダへ移行する際、ドメインモデルを書き直さずに差し替えられること。

## 既知の制約

- Open-Meteo の Free API は**非商用利用**専用。レート制限は 10,000 calls/day, 5,000 calls/hour, 600 calls/minute。
- Free API はアップタイム / 精度の保証なし。CC BY 4.0 の表示要件がある。
- BigDataCloud の無料 client-side reverse geocoding は「ユーザの現在地を、本人の同意のもとで直接ブラウザ / モバイルから引く」用途想定。サーバ側処理・保存済み座標・バッチ用途には使わない。
- Google Pollen API は API キーと Google Cloud のセットアップが必要。forecast エンドポイントは最大 5 日の日次花粉情報を返すが、地域・植物種ごとに対応状況が異なる。
- そらリス は予報を「判断」に変換するアプリなので、日本国内で商用展開する前には、気象業務法・広告・健康関連表記・責任関係について有資格者にレビューを依頼すること。

## 推奨される移行ステップ

1. 収益化なしの MVP / デモのうちは Open-Meteo + BigDataCloud のまま運用。
2. 非商用のままトラフィックが増えるなら、規約を確認した上でリクエストキャッシュ / プロキシを足す。
3. 商用化するなら、コア天気データを Open-Meteo 有償プラン（または別の商用プロバイダ）に移す。
4. 花粉を主軸の差別化要素にするなら、Google Pollen API を内部アダプタの裏で試作し、Open-Meteo Air Quality と網羅性 / 品質を比較する。
5. 本番運用時には、明示的なクレジット表記、モニタリング、レート制限ハンドリング、プロバイダエラー時の UI、規約 / プライバシーページを揃える。

## 参考リンク

- Open-Meteo Terms: https://open-meteo.com/en/terms
- Open-Meteo Pricing: https://open-meteo.com/en/pricing
- Google Pollen API overview: https://developers.google.com/maps/documentation/pollen/overview
- Google Pollen API forecast endpoint: https://developers.google.com/maps/documentation/pollen/forecast
- BigDataCloud free client-side reverse geocoding: https://www.bigdatacloud.com/support/why-is-reverse-geocoding-api-free
- BigDataCloud API domains: https://www.bigdatacloud.com/docs/api-domains
