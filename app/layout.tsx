import type { Metadata, Viewport } from "next";
import StructuredData from "./components/StructuredData";
import { identityGraph, siteUrl } from "./lib/seo";
import config from "./lib/site-config.json";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Rakindu Fernando Portfolio", creator: "Rakindu Fernando",
  authors: [{ name: "Rakindu Fernando", url: siteUrl }],
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  ...(config.googleSiteVerification ? { verification: { google: config.googleSiteVerification } } : {}),
  other: { "codex-preview": "development" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#05070b", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head><link rel="preload" href="/fonts/geist-8ac0455e797f/geist-98bbbccb.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head>
      <body className="antialiased"><StructuredData data={identityGraph} />{children}</body>
    </html>
  );
}
