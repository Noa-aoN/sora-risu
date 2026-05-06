import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  // 大きい・利用頻度の低いアセットは precache から除外し、
  // 必要時に runtimeCaching (StaleWhileRevalidate) で取得する。
  // node-glob の負パターンは patterns 配列内では効かないので、
  // include したい public/ アセットを正リストで列挙する。
  globPublicPatterns: [
    "manifest.webmanifest",
    "brand/acorn-face.png",
    "brand/app-icon-*.png",
    "brand/apple-touch-icon.png",
    "brand/favicon-*.png",
    "brand/logo-mark*.png",
    "brand/mini-mascot-v2.png",
  ],
});

const config: NextConfig = {
  reactStrictMode: true,
  // メタデータは静的でストリーミング化の利得が無い一方、Next 16.2 の
  // MetadataWrapper は streaming / blocking で出力 (<div hidden>) が
  // 切り替わり、特定 UA で hydration mismatch を起こすことがある。
  // 全 UA を blocking 経路に倒して回避する。
  htmlLimitedBots: /.*/i,
};

export default withSerwist(config);
