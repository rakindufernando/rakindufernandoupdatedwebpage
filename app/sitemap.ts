import type { MetadataRoute } from "next";
import { absoluteUrl, publicPages } from "./lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  // Anchors, the /work redirect, and error pages are not distinct indexable pages.
  return publicPages.map((path) => ({ url: absoluteUrl(path) }));
}
