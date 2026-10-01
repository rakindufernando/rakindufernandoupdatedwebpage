"use client";

import { useContext, useEffect, useRef } from "react";
import type gsap from "gsap";
import { MotionPreference } from "./MotionPreference";

const NAME = "RAKINDU FERNANDO";
const LETTERS = NAME.replaceAll(" ", "");
const GLYPHS = "ABCDEFGHJKLNOPRSTUVXYZ0123456789";

export default function HeroName() {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const played = useRef(false);
  const paused = useContext(MotionPreference);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || played.current) return;
    const glyphs = Array.from(root.querySelectorAll<HTMLElement>("[data-name-glyph]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let context: gsap.Context | undefined;
    const resolve = () => {
      glyphs.forEach((glyph, index) => { glyph.textContent = LETTERS[index]; });
      root.dataset.nameState = "resolved";
    };
    const stop = () => {
      cancelled = true;
      played.current = true;
      context?.revert();
      resolve();
    };
    if (paused || reduced.matches || document.hidden) {
      stop();
      return;
    }
    const onPreference = () => { if (reduced.matches) stop(); };
    const onVisibility = () => { if (document.hidden) stop(); };
    reduced.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);

    // The server and first client render both contain the real name. Only this
    // decorative, aria-hidden layer changes after hydration. No React frame loop.
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled) return;
      played.current = true;
      const progress = { value: 0 };
      let lastTick = -1;
      const render = () => {
        const tick = Math.floor(progress.value * 22);
        if (tick === lastTick) return;
        lastTick = tick;
        glyphs.forEach((glyph, index) => {
          // Interleave the lock-in order across both words, rather than typing
          // left to right. Every position is present throughout the transition.
          const lockAt = 0.36 + (((index * 7) % LETTERS.length) / LETTERS.length) * 0.58;
          glyph.textContent = progress.value >= lockAt
            ? LETTERS[index]
            : GLYPHS[(index * 11 + tick * 7) % GLYPHS.length];
        });
      };
      root.dataset.nameState = "scrambling";
      context = gsap.context(() => {
        render();
        gsap.fromTo(glyphs, { y: 5, rotationX: -16, scaleX: 0.88, opacity: 0.65 }, {
          y: 0, rotationX: 0, scaleX: 1, opacity: 1,
          duration: 0.65, stagger: { amount: 0.16, from: "center" },
          ease: "power3.out", clearProps: "transform,opacity",
        });
        gsap.to(progress, { value: 1, duration: 1.15, ease: "none", onUpdate: render, onComplete: resolve });
      }, root);
    }).catch(stop);

    return () => {
      cancelled = true;
      context?.revert();
      resolve();
      reduced.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused]);

  return (
    <p ref={rootRef} className="hero-name" data-name-state="resolved">
      <span className="sr-only">{NAME}</span>
      <span className="hero-name-visual" aria-hidden="true">
        {NAME.split(" ").map((word) => (
          <span className="hero-name-word" key={word}>
            {Array.from(word).map((letter, index) => (
              <span className="hero-name-cell" key={index}><span data-name-glyph>{letter}</span></span>
            ))}
          </span>
        ))}
      </span>
    </p>
  );
}
