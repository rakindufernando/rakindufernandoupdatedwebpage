/* eslint-disable @next/next/no-img-element -- These are the unmodified original UI designs. */
import type screenData from "../../lib/techtrend-screens.json";

export type TechTrendScreen = (typeof screenData.screens)[number];

export default function ScreenFigure({ screen, className = "" }: { screen: TechTrendScreen; className?: string }) {
  return (
    <figure className={`tt-screen ${className}`} id={screen.id} data-case-screen={screen.id}>
      <a className="tt-device" href={screen.src} data-screen-open={screen.id} target="_blank" rel="noopener noreferrer" aria-label={`Open TechTrend ${screen.label} screen at full size`}>
        <img src={screen.src} alt={`TechTrend ${screen.label} mobile interface, original UI design`} width={screen.width} height={screen.height} loading="lazy" decoding="async" />
        <span className="tt-screen-open" aria-hidden="true">Open screen <span>+</span></span>
      </a>
      <figcaption><span className="tt-screen-number">{screen.id.slice(-2)}</span><h3>{screen.label}</h3></figcaption>
    </figure>
  );
}
