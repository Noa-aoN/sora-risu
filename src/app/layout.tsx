import type { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "そらリス｜気圧と体調のそばに、やさしい空を",
  description:
    "気圧・お天気・花粉・気温の変化を、服装・持ち物・行動の判断に変換するパートナー。",
  applicationName: "そらリス",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "そらリス",
  },
  icons: {
    icon: [
      { url: "/brand/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/brand/app-icon-512.png", sizes: "512x512" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#cfe4f3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
