import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
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
