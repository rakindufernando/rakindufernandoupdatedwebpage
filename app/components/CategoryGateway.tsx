/* eslint-disable @next/next/no-img-element -- Pre-optimized local WebP imagery needs no image server. */
import Link from "./SiteLink";
import { categories, getCover, getProjects, projectCount, projects } from "../lib/portfolio";

export default function CategoryGateway() {
  return (
    <section id="work" className="work section-pad category-gateway" aria-labelledby="work-heading">
      <header className="section-heading reveal"><span>03 / Selected work</span><h2 id="work-heading">Five perspectives.<br />One <em>creative mind.</em></h2></header>
      <div className="work-intro reveal"><p>Explore the intersections of design, technology and visual storytelling.</p><span>{projects.length} projects / {String(categories.length).padStart(2, "0")} disciplines</span></div>
      <div className="category-list">
        {categories.map((category) => {
          const cover = getCover(category);
          return (
            <Link href={`/work/${category.slug}`} key={category.slug} className={`category-portal ${category.personality}`} aria-label={`Explore ${category.name}, ${projectCount(getProjects(category).length)}`}>
              <div className="portal-copy reveal">
                <div className="portal-kicker"><span>{category.number} /</span><span>{projectCount(getProjects(category).length)}</span></div>
                <h3>{category.name}</h3><p>{category.description}</p>
                <span className="portal-action">View Projects <span className="arrow-circle" aria-hidden="true">↗</span></span>
              </div>
              <div className="portal-visual media-reveal">
                {cover && <img src={cover.images[0]} alt={`${category.name} selection, ${cover.title}`} loading="lazy" decoding="async" data-parallax-image />}
                <div className="portal-image-shade" />
                <span className="portal-image-label">{category.caption}</span>
                <span className="portal-number" aria-hidden="true">{category.number}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
