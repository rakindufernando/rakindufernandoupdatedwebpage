/* eslint-disable @next/next/no-img-element -- The gallery uses the original pre-optimized local images. */
"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "../lib/portfolio";

export default function ProjectGallery({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const count = project.images.length;
  const step = (direction: number) => setActiveImage((current) => (current + direction + count) % count);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>(".modal-topbar button")?.focus({ preventScroll: true });
    document.body.classList.add("modal-open");
    return () => {
      dialog.close();
      document.body.classList.remove("modal-open");
      opener?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="project-modal" aria-labelledby="project-modal-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={(event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); }
    }}>
      <article className="modal-panel">
        <div className="modal-topbar"><span>{project.code} / {project.category}</span><button onClick={onClose} aria-label="Close project details" autoFocus>Close ×</button></div>
        <div className="modal-layout">
          <div className="modal-gallery">
            <div className="gallery-stage" onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => {
              if (touchStart.current !== null) { const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 45) step(distance < 0 ? 1 : -1); }
              touchStart.current = null;
            }}>
              <img src={project.images[activeImage]} alt={`${project.title}, ${project.category}, image ${activeImage + 1} of ${count}`} decoding="async" />
            </div>
            <div className="gallery-controls"><span aria-live="polite" aria-atomic="true">Image {activeImage + 1} of {count}</span>{count > 1 && <div><button onClick={() => step(-1)} aria-label="Previous image">←</button><button onClick={() => step(1)} aria-label="Next image">→</button></div>}</div>
            {count > 1 && <div className="modal-thumbs" aria-label="Project images">{project.images.map((image, index) => <button key={image} className={activeImage === index ? "active" : ""} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1} of ${count}`} aria-pressed={activeImage === index}><img src={image} alt="" loading="lazy" decoding="async" /></button>)}</div>}
          </div>
          <div className="modal-copy"><span>{project.category} / {project.year}</span><h2 id="project-modal-title">{project.title}</h2><p>{project.description}</p>{project.href && <a className="button button-primary" href={project.href} target="_blank" rel="noopener noreferrer">View project link <span aria-hidden="true">↗</span><span className="sr-only">opens in a new tab</span></a>}</div>
        </div>
      </article>
    </dialog>
  );
}
