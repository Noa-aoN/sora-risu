import nextConfig from "eslint-config-next";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import tsConfig from "eslint-config-next/typescript";

const config = [
  ...nextConfig,
  ...coreWebVitals,
  ...tsConfig,
  {
    ignores: [
      ".next/**",
      "public/sw.js",
      "public/sw.js.map",
      "public/swe-worker-*.js",
      "next-env.d.ts",
    ],
  },
];

export default config;
