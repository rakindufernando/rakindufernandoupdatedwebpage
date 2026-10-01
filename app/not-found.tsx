import type { Metadata } from "next";
export const metadata: Metadata = { title: "Page not found | Rakindu Fernando", description: "Return to Rakindu Fernando’s portfolio and explore software, design and visual projects.", robots: { index: false, follow: true } };
import Link from "./components/SiteLink";

export default function NotFound() {
  return <><title>Page not found | Rakindu Fernando</title><meta name="description" content="Return to Rakindu Fernando’s portfolio and explore software, design and visual projects." /><main className="not-found-page"><Link className="brand" href="/" aria-label="Rakindu Fernando home"><span>R</span>F</Link><p className="eyebrow"><span>404 / Off the map</span></p><h1>This page is<br /><em>out of frame.</em></h1><p>The page you’re looking for could not be found. Explore one of the five creative disciplines instead.</p><Link className="button button-primary" href="/#work">Back to Work <span aria-hidden="true">↗</span></Link></main></>;
}
