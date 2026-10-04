/* eslint-disable @next/next/no-img-element -- Original screen images must remain unchanged. */
"use client";

import { useContext, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import type gsap from "gsap";
import { MotionPreference } from "../MotionPreference";
import { screens } from "../../lib/techtrend-screens.json";

function ScreenViewer({ active, select, close }: { active: number; select: (index: number) => void; close: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const screen = screens[active];
  const step = (direction: number) => select((active + direction + screens.length) % screens.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    dialog.showModal();
    document.body.classList.add("modal-open");
    return () => { dialog.close(); document.body.classList.remove("modal-open"); opener?.focus({ preventScroll: true }); };
  }, []);

  return (
    <dialog ref={dialogRef} className="tt-viewer" aria-labelledby="tt-viewer-title" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); }
    }}>
      <div className="tt-viewer-panel">
        <header><div><small>TechTrend / Original design</small><h2 id="tt-viewer-title">{screen.label}</h2></div><button type="button" autoFocus onClick={close} aria-label="Close screen viewer">Close ×</button></header>
        <div className="tt-viewer-image" onTouchStart={(event) => { swipe.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={(event) => {
          if (swipe.current) {
            const dx = event.changedTouches[0].clientX - swipe.current.x;
            const dy = event.changedTouches[0].clientY - swipe.current.y;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
          }
          swipe.current = null;
        }}><img src={screen.src} alt={`TechTrend ${screen.label}, complete original screen`} width={screen.width} height={screen.height} decoding="async" /></div>
        <div className="tt-viewer-controls"><button type="button" onClick={() => step(-1)}>Previous</button><span aria-live="polite" aria-atomic="true">{active + 1} / {screens.length}</span><button type="button" onClick={() => step(1)}>Next</button><a href={screen.src} target="_blank" rel="noopener noreferrer">Open original<span className="sr-only"> in a new tab</span></a></div>
      </div>
    </dialog>
  );
}

export default function TechTrendExperience({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const paused = useContext(MotionPreference);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => {
      const index = screens.findIndex((screen) => `#${screen.id}` === window.location.hash);
      setSelected(index < 0 ? null : index);
    };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, []);

  useEffect(() => {
    if (paused) return;
    let cancelled = false;
    let media: gsap.MatchMedia | undefined;
    let refreshFrame = 0;
    const initialize = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const root = rootRef.current;
      media = gsap.matchMedia();
      media.add({ reduced: "(prefers-reduced-motion: reduce)", wide: "(min-width: 1100px) and (min-height: 800px)", fine: "(hover: hover) and (pointer: fine)" }, (context) => {
        const { reduced, wide, fine } = context.conditions!;
        if (reduced) return;
        const cinematic = wide && fine;
        const cleanup: (() => void)[] = [];
        const select = gsap.utils.selector(root);

        gsap.from(select(".tt-hero-title > span"), { y: 25, rotationX: 5, transformPerspective: 1000, duration: 1, stagger: 0.09, ease: "power3.out", clearProps: "transform" });
        gsap.from(select(".tt-hero-phone"), { y: cinematic ? 55 : 20, duration: 1.15, stagger: 0.1, ease: "power3.out", clearProps: "transform" });
        select(".tt-reveal, .tt-section-title").forEach((item: HTMLElement) => {
          if (item.getBoundingClientRect().top < window.innerHeight) return;
          gsap.from(item, { y: cinematic ? 30 : 14, opacity: 0.25, duration: 0.8, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: item, start: "top 94%", once: true } });
        });
        select(".tt-phone-group").forEach((group: HTMLElement) => {
          if (group.getBoundingClientRect().top < window.innerHeight) return;
          gsap.from(group.querySelectorAll(".tt-screen"), { y: cinematic ? 52 : 16, rotationX: cinematic ? 6 : 0, opacity: 0.3, transformPerspective: 1000, duration: 0.85, stagger: 0.065, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: group, start: "top 94%", once: true } });
        });
        select(".tt-media-reveal").forEach((item: HTMLElement) => {
          gsap.from(item, { clipPath: cinematic ? "inset(8% 5% 8% 5% round 24px)" : "inset(2% 0% 2% 0% round 16px)", y: cinematic ? 24 : 10, duration: 1.2, ease: "power3.out", clearProps: "clipPath,transform", scrollTrigger: { trigger: item, start: "top 90%", once: true } });
        });

        if (cinematic) {
          select(".tt-hero-phone").forEach((phone: HTMLElement, index: number) => {
            gsap.to(phone, { y: index === 1 ? -38 : 30, ease: "none", scrollTrigger: { trigger: root.querySelector(".tt-hero"), start: "top top", end: "bottom top", scrub: 0.8 } });
          });
          const discovery = root.querySelector<HTMLElement>(".tt-discovery-stage");
          const track = root.querySelector<HTMLElement>(".tt-discovery-track");
          const viewport = root.querySelector<HTMLElement>(".tt-discovery-viewport");
          if (discovery && track && viewport) {
            discovery.classList.add("tt-motion-wide");
            const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
            const tween = gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: discovery, start: "top 105px", end: () => `+=${Math.max(distance() * 1.12, 1)}`, pin: true, scrub: 0.65, anticipatePin: 1, invalidateOnRefresh: true } });
            const focus = (event: FocusEvent) => {
              const item = (event.target as HTMLElement).closest<HTMLElement>(".tt-screen");
              const trigger = tween.scrollTrigger;
              if (!item || !trigger || distance() <= 0) return;
              const fraction = Math.min(1, Math.max(0, (item.offsetLeft - (viewport.clientWidth - item.offsetWidth) / 2) / distance()));
              window.scrollTo({ top: trigger.start + fraction * (trigger.end - trigger.start), behavior: "instant" });
            };
            track.addEventListener("focusin", focus);
            cleanup.push(() => { track.removeEventListener("focusin", focus); discovery.classList.remove("tt-motion-wide"); });
            gsap.fromTo(discovery.querySelector(".tt-horizontal-progress span"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: discovery, start: "top 105px", end: () => `+=${Math.max(distance() * 1.12, 1)}`, scrub: 0.3 } });
          }
          const purchase = root.querySelector<HTMLElement>(".tt-purchase-shell");
          const frames = purchase?.querySelectorAll<HTMLElement>(".tt-purchase-stack .tt-screen");
          if (purchase && frames?.length) {
            purchase.classList.add("tt-purchase-motion");
            gsap.set(frames, { autoAlpha: 0 });
            gsap.set(frames[0], { autoAlpha: 1 });
            const timeline = gsap.timeline({ scrollTrigger: { trigger: purchase, start: "top 105px", end: "+=1900", pin: true, scrub: 0.65, anticipatePin: 1 } });
            frames.forEach((frame, index) => {
              if (index === 0) return;
              timeline.to(frames[index - 1], { autoAlpha: 0, y: -25, scale: 1.025, duration: 0.55 }, index);
              timeline.fromTo(frame, { autoAlpha: 0, y: 35, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: "power2.out" }, index);
            });
            timeline.to({}, { duration: 0.45 });
            cleanup.push(() => purchase.classList.remove("tt-purchase-motion"));
          }
        }
        const refresh = () => {
          cancelAnimationFrame(refreshFrame);
          refreshFrame = requestAnimationFrame(() => { if (!cancelled) ScrollTrigger.refresh(); });
        };
        // Expanded context and screen indexes change every subsequent trigger position.
        root.addEventListener("toggle", refresh, true);
        cleanup.push(() => root.removeEventListener("toggle", refresh, true));
        refresh();
        return () => { cancelAnimationFrame(refreshFrame); cleanup.forEach((dispose) => dispose()); };
      }, root);
    };
    void initialize().catch(() => {
      // Restore the complete vertical layout even if an enhancement fails partway through.
      media?.revert();
      rootRef.current?.querySelectorAll(".tt-motion-wide, .tt-purchase-motion").forEach((item) => item.classList.remove("tt-motion-wide", "tt-purchase-motion"));
    });
    return () => { cancelled = true; cancelAnimationFrame(refreshFrame); media?.revert(); };
  }, [paused]);

  const openScreen = (event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-screen-open]");
    if (!link) return;
    const index = screens.findIndex((screen) => screen.id === link.dataset.screenOpen);
    if (index < 0) return;
    event.preventDefault();
    link.focus({ preventScroll: true });
    window.history.pushState({ ...window.history.state, techTrendScreen: true }, "", `#${screens[index].id}`);
    setSelected(index);
  };

  const selectScreen = (index: number) => {
    window.history.replaceState(window.history.state, "", `#${screens[index].id}`);
    setSelected(index);
  };
  const closeScreen = () => {
    if (window.history.state?.techTrendScreen) window.history.back();
    else {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
      setSelected(null);
    }
  };

  return <div ref={rootRef} className="tt-case" onClick={openScreen}>{children}{selected !== null && <ScreenViewer active={selected} select={selectScreen} close={closeScreen} />}</div>;
}
