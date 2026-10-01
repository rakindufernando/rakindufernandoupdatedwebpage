"use client";

import { useEffect, type RefObject } from "react";

export function usePortfolioMotion(rootRef: RefObject<HTMLDivElement | null>, paused = false) {
  useEffect(() => {
    if (paused) return;
    let cancelled = false;
    let dispose = () => {};
    const initialize = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const root = rootRef.current;
      const mm = gsap.matchMedia();
      mm.add({ reduced: "(prefers-reduced-motion: reduce)", desktop: "(min-width: 901px)", fine: "(hover: hover) and (pointer: fine)" }, (context) => {
        const { reduced, desktop, fine } = context.conditions!;
        if (reduced) return;
        const select = gsap.utils.selector(root);
        const cleanups: (() => void)[] = [];
        // Keep the LCP heading and essential text visible from the first paint.
        gsap.from(select(".hero-interface, .category-hero-image"), { y: desktop ? 26 : 12, duration: 1.1, ease: "power3.out", clearProps: "transform" });
        select(".reveal").forEach((item: HTMLElement) => {
          // Do not re-hide content already read or restored by browser Back.
          if (item.getBoundingClientRect().top < window.innerHeight) return;
          gsap.from(item, { y: desktop ? 36 : 16, opacity: 0.2, duration: 0.8, ease: "power3.out", clearProps: "opacity,transform", scrollTrigger: { trigger: item, start: "top 96%", once: true } });
        });
        select(".media-reveal").forEach((item: HTMLElement) => {
          if (item.getBoundingClientRect().top < window.innerHeight) return;
          gsap.from(item, { y: desktop ? 35 : 16, opacity: 0.5, duration: 1, ease: "power3.out", clearProps: "opacity,transform", scrollTrigger: { trigger: item, start: "top 96%", once: true } });
        });
        if (desktop) {
          select("[data-parallax-image]").forEach((item: HTMLElement) => {
            gsap.fromTo(item, { yPercent: -4, scale: 1.09 }, { yPercent: 4, scale: 1.09, ease: "none", scrollTrigger: { trigger: item.parentElement, start: "top bottom", end: "bottom top", scrub: 0.7 } });
          });
          select(".parallax-text").forEach((item: HTMLElement) => {
            gsap.to(item, { xPercent: -12, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1 } });
          });
          select(".category-hero-number, [data-depth]").forEach((item: HTMLElement) => {
            gsap.to(item, { y: -45, rotationX: 5, transformPerspective: 1200, ease: "none", scrollTrigger: { trigger: item.closest("section"), start: "top top", end: "bottom top", scrub: 0.8 } });
          });
          select(".section-heading h2, .category-title").forEach((item: HTMLElement) => {
            gsap.from(item, { rotationX: 7, transformPerspective: 1200, transformOrigin: "center bottom", duration: 1.1, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: item, start: "top 96%", once: true } });
          });
        }
        gsap.to(select(".scroll-progress"), { scaleX: 1, ease: "none", transformOrigin: "left", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });
        if (desktop && fine) {
          select("[data-tilt], .portal-visual").forEach((card: HTMLElement) => {
            // quickTo reuses tweens rather than allocating one on every pointer event.
            const rx = gsap.quickTo(card, "rotationX", { duration: 0.55, ease: "power3.out" });
            const ry = gsap.quickTo(card, "rotationY", { duration: 0.55, ease: "power3.out" });
            let rect: DOMRect | null = null;
            const enter = () => { rect = card.getBoundingClientRect(); gsap.set(card, { transformPerspective: 1100 }); };
            const move = (event: PointerEvent) => {
              if (!rect) enter();
              if (!rect) return;
              ry(((event.clientX - rect.left) / rect.width - 0.5) * 7);
              rx(((event.clientY - rect.top) / rect.height - 0.5) * -7);
            };
            const leave = () => { rx(0); ry(0); rect = null; };
            card.addEventListener("pointerenter", enter);
            card.addEventListener("pointermove", move);
            card.addEventListener("pointerleave", leave);
            cleanups.push(() => { card.removeEventListener("pointerenter", enter); card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); rx.tween.kill(); ry.tween.kill(); gsap.set(card, { clearProps: "transform" }); });
          });
          select(".magnetic, .button-primary").forEach((button: HTMLElement) => {
            const x = gsap.quickTo(button, "x", { duration: 0.4, ease: "power3.out" });
            const y = gsap.quickTo(button, "y", { duration: 0.4, ease: "power3.out" });
            let rect: DOMRect;
            const enter = () => { rect = button.getBoundingClientRect(); };
            const move = (event: PointerEvent) => { if (!rect) enter(); x((event.clientX - rect.left - rect.width / 2) * 0.09); y((event.clientY - rect.top - rect.height / 2) * 0.12); };
            const leave = () => { x(0); y(0); };
            button.addEventListener("pointerenter", enter); button.addEventListener("pointermove", move); button.addEventListener("pointerleave", leave);
            cleanups.push(() => { button.removeEventListener("pointerenter", enter); button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", leave); x.tween.kill(); y.tween.kill(); gsap.set(button, { clearProps: "transform" }); });
          });
        }
        // Coalesce image-load refreshes so a large collection cannot thrash layout.
        let refreshFrame = 0;
        const refresh = () => { cancelAnimationFrame(refreshFrame); refreshFrame = requestAnimationFrame(() => { if (!cancelled) ScrollTrigger.refresh(); }); };
        root.addEventListener("load", refresh, true);
        document.fonts?.ready.then(() => { if (!cancelled) refresh(); });
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => entry.target.classList.toggle("ambient-active", entry.isIntersecting));
        });
        select(".developer-visual").forEach((item: HTMLElement) => observer.observe(item));
        const visibility = () => root.classList.toggle("document-hidden", document.hidden);
        document.addEventListener("visibilitychange", visibility);
        return () => {
          cancelAnimationFrame(refreshFrame); root.removeEventListener("load", refresh, true);
          observer.disconnect(); document.removeEventListener("visibilitychange", visibility);
          cleanups.forEach((cleanup) => cleanup());
        };
      }, root);
      dispose = () => mm.revert();
    };
    void initialize().catch(() => { /* HTML and controls stay usable without animation. */ });
    return () => { cancelled = true; dispose(); };
  }, [rootRef, paused]);
}
