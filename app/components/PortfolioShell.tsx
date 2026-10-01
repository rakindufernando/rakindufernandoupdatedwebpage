"use client";

import Link from "./SiteLink";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Scene from "./Scene";
import Navigation from "./Navigation";
import { MotionPreference } from "./MotionPreference";
import { usePortfolioMotion } from "./usePortfolioMotion";

export default function PortfolioShell({ children, categoryPage = false, personality = "" }: { children: ReactNode; categoryPage?: boolean; personality?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  usePortfolioMotion(rootRef, paused);
  useEffect(() => {
    // Streaming and font loading can finish after the browser's first anchor jump.
    let cancelled = false;
    const hash = window.location.hash.slice(1);
    if (!hash || hash.startsWith("project-")) return;
    const restore = () => {
      if (cancelled || window.location.hash.slice(1) !== hash) return;
      document.getElementById(hash)?.scrollIntoView({ behavior: "instant", block: "start" });
    };
    const frame = requestAnimationFrame(restore);
    const timer = window.setTimeout(restore, 150);
    void document.fonts.ready.then(restore);
    window.addEventListener("load", restore, { once: true });
    return () => { cancelled = true; cancelAnimationFrame(frame); window.clearTimeout(timer); window.removeEventListener("load", restore); };
  }, []);
  return (
    <div ref={rootRef} data-motion={paused ? "paused" : "enabled"} className={`site-shell ${categoryPage ? "category-page" : ""} ${personality}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Scene paused={paused} />
      <button className="motion-toggle" aria-pressed={paused} onClick={() => setPaused((value) => !value)} aria-label="Pause animations"><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span> {paused ? "Resume motion" : "Pause motion"}</button>
      <div className="noise" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <Navigation categoryPage={categoryPage} />
      <main id="main-content" tabIndex={-1}><MotionPreference.Provider value={paused}>{children}</MotionPreference.Provider></main>
      <footer><Link className="brand" href="/#home" aria-label="Rakindu Fernando home"><span>R</span>F</Link><p>Designed and developed by Rakindu Fernando</p><a href={categoryPage ? "#category-top" : "#home"}>Back to top ↑</a></footer>
    </div>
  );
}
