import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Rakindu Fernando Portfolio", short_name: "Rakindu", description: "Software, design and visual storytelling by Rakindu Fernando.", start_url: "/", scope: "/", display: "browser", lang: "en", background_color: "#05070b", theme_color: "#05070b", icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
  ] };
}
