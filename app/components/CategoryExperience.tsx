/* eslint-disable @next/next/no-img-element -- Local WebP assets are already optimized and require no transformation service. */
"use client";

import Link from "./SiteLink";
import { lazy, Suspense, useEffect, useState } from "react";
import type { Category, Project } from "../lib/portfolio";
import { projectCount } from "../lib/format";
import PortfolioShell from "./PortfolioShell";
const ProjectGallery = lazy(() => import("./ProjectGallery"));

type Props = { category: Category; projects: Project[]; cover?: Project; nextCategory: Category; nextCount: number };

export default function CategoryExperience({ category, projects, cover, nextCategory, nextCount }: Props) {
  const [selected, setSelected] = useState<Project | null>(null);
  useEffect(() => {
    const sync = () => { setSelected(projects.find((project) => `#${project.id}` === window.location.hash) ?? null); };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, [projects]);

  const openProject = (project: Project) => {
    window.history.pushState({ ...window.history.state, portfolioProject: project.id }, "", `#${project.id}`);
    setSelected(project);
  };
  const closeProject = () => {
    if (window.history.state?.portfolioProject === selected?.id) window.history.back();
    else { window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search); setSelected(null); }
  };

  return (
    <PortfolioShell key={category.slug} categoryPage personality={category.personality}>
      <section id="category-top" className="category-hero section-pad" aria-labelledby="category-title">
        <Link href="/#work" className="back-to-work hero-reveal"><span aria-hidden="true">↖</span> Back to Work</Link>
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{category.name}</span></nav>
        <div className="category-hero-top hero-reveal"><span>Selected work / {category.number}</span><span>{projectCount(projects.length)}</span></div>
        <div className="category-hero-image hero-reveal" aria-hidden="true">{cover && <img src={cover.images[0]} alt="" decoding="async" fetchPriority="high" data-parallax-image />}<div /></div>
        <h1 id="category-title" className="category-title" aria-label={category.name}>{category.lines.map((line, index) => <span key={line} className="title-line"><span className="hero-reveal" aria-hidden="true">{index === 1 ? <em>{line}</em> : line}</span></span>)}</h1>
        <div className="category-hero-bottom"><p className="hero-reveal">{category.introduction}</p><a className="category-scroll hero-reveal" href="#category-projects"><span className="scroll-cue"><i aria-hidden="true" /> Scroll to explore</span><span aria-hidden="true">↓</span></a></div>
        <span className="category-hero-number" aria-hidden="true">{category.number}</span>
      </section>

      <section id="category-projects" className={`category-projects section-pad ${projects.length === 1 ? "single-project" : ""}`} aria-labelledby="collection-heading">
        <header className="collection-heading reveal"><h2 id="collection-heading">The collection</h2><span>{projectCount(projects.length)} / {category.name}</span></header>
        {projects.map((project, index) => (
          <article key={project.id} id={project.id} className={`editorial-project layout-${index % 3}`} aria-labelledby={`title-${project.id}`}>
            <div className="editorial-index reveal"><span>{String(index + 1).padStart(2, "0")}</span><span>{project.year}</span></div>
            <button className="editorial-image media-reveal" data-tilt onClick={() => openProject(project)} aria-label={`View details for ${project.title}`}>
              <div className="editorial-image-inner"><img src={project.images[0]} alt={`${project.title}, ${project.category} project from ${project.year}`} loading="lazy" decoding="async" /></div>
              <span className="image-gallery-count">{project.images.length} {project.images.length === 1 ? "image" : "images"}</span><span className="image-open arrow-circle" aria-hidden="true">↗</span>
              {category.personality === "cinematic" && <span className="film-play" aria-hidden="true">▷</span>}
            </button>
            <div className="editorial-copy reveal"><p className="editorial-category">{project.category} <span>/ {project.code}</span></p><h3 id={`title-${project.id}`}>{project.title}</h3><p className="editorial-description">{project.description}</p><button className="editorial-open" onClick={() => openProject(project)}>Explore project <span aria-hidden="true">↗</span></button></div>
          </article>
        ))}
      </section>

      <section className="next-category section-pad" aria-label="Continue exploring"><div className="next-category-top reveal"><span>Next discipline</span><Link href="/#work">All work <span aria-hidden="true">↗</span></Link></div><Link className="next-category-link reveal" href={`/work/${nextCategory.slug}`}><span><small>{nextCategory.number} / {projectCount(nextCount)}</small>{nextCategory.name}</span><span className="arrow-circle" aria-hidden="true">↗</span></Link></section>
      {selected && <Suspense fallback={<p className="gallery-loading" role="status">Opening project…</p>}><ProjectGallery key={selected.id} project={selected} onClose={closeProject} /></Suspense>}
    </PortfolioShell>
  );
}
