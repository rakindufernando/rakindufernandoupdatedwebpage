"use client";

import Link from "./SiteLink";
import { useEffect, useRef, useState } from "react";

export default function Navigation({ categoryPage = false }: { categoryPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", escape); };
  }, [open]);

  return (
    <nav className="nav-wrap" aria-label="Primary navigation" ref={navRef}>
      <Link className="brand magnetic" href="/#home" aria-label="Rakindu Fernando home" onClick={() => setOpen(false)}><span>R</span>F</Link>
      <button ref={buttonRef} className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="nav-links"><span>{open ? "Close" : "Menu"}</span><i aria-hidden="true" /></button>
      <div id="nav-links" className={`nav-links ${open ? "is-open" : ""}`}>
        {["Home", "Work", "About", "Experience", "Contact"].map((item) => (
          <Link key={item} href={`/#${item.toLowerCase()}`} aria-current={categoryPage && item === "Work" ? "page" : undefined} onClick={() => setOpen(false)}>{item}</Link>
        ))}
      </div>
      <a className="availability" href="mailto:rakindufernando@gmail.com"><i /> Available for opportunities</a>
    </nav>
  );
}
