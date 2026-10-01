import type { Metadata } from "next";
import config from "./site-config.json";
import { categories, getProjects, type Category } from "./portfolio";

// Set the production origin here before deploying to a custom domain.
// Never derive canonical URLs from an untrusted request Host header.
export const siteUrl = new URL(config.url).origin;
export const absoluteUrl = (path = "/") => new URL(path, `${siteUrl}/`).href;
export const homeTitle = "Rakindu Fernando | Software Engineer, UI UX Designer & Creative Designer";
export const homeDescription = "Explore Rakindu Fernando’s portfolio of software development, UI UX design, graphic design, videography and photography. Based in Sri Lanka.";
export const publicPages = ["/", ...categories.map(({ slug }) => `/work/${slug}`)];
export const personId = absoluteUrl("/#person");
export const websiteId = absoluteUrl("/#website");

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    title, description, alternates: { canonical: absoluteUrl(path) },
    openGraph: { type: "website", locale: "en_US", siteName: "Rakindu Fernando", url: absoluteUrl(path), title, description,
      images: [{ url: absoluteUrl("/media/profile/rakindu-fernando.webp"), width: 1000, height: 1000, alt: "Rakindu Fernando portrait" }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: absoluteUrl("/media/profile/rakindu-fernando.webp"), alt: "Rakindu Fernando portfolio" }] },
  };
}

export const identityGraph = [
  {
    "@type": "Person", "@id": personId, name: "Rakindu Fernando", alternateName: "Rakindu Ferando",
    url: absoluteUrl(), image: absoluteUrl("/media/profile/rakindu-fernando.webp"),
    description: "UI/UX designer, creative designer and software engineering student in Sri Lanka.",
    // These exact public profile links already appear in the Contact section.
    sameAs: ["https://github.com/rakindufernando", "https://www.linkedin.com/in/rakindu-fernando-78a665233", "https://www.instagram.com/_rakinduu_/", "https://web.facebook.com/rakindu.fernando", "https://www.youtube.com/@rakistudios"],
  },
  { "@type": "WebSite", "@id": websiteId, url: absoluteUrl(), name: "Rakindu Fernando", inLanguage: "en", publisher: { "@id": personId } },
];

export function homeGraph() {
  return {
    "@type": "WebPage", "@id": absoluteUrl("/#webpage"), url: absoluteUrl(), name: homeTitle, description: homeDescription,
    isPartOf: { "@id": websiteId }, about: { "@id": personId }, inLanguage: "en",
    hasPart: categories.map((category) => ({ "@type": "CollectionPage", url: absoluteUrl(`/work/${category.slug}`), name: category.name })),
  };
}

export function categoryGraph(category: Category) {
  const path = `/work/${category.slug}`;
  const collection = getProjects(category);
  const works = collection.map((project) => ({
    "@type": project.category === "Software Development" ? "SoftwareSourceCode" : "CreativeWork",
    "@id": absoluteUrl(`${path}#${project.id}`), url: absoluteUrl(`${path}#${project.id}`),
    name: project.title, description: project.description, genre: project.category, identifier: project.id,
    creator: { "@id": personId }, image: project.images.map((src) => absoluteUrl(src)),
    ...(project.href ? { subjectOf: { "@type": "WebPage", url: project.href } } : {}),
  }));
  return [
    { "@type": ["WebPage", "CollectionPage"], "@id": absoluteUrl(`${path}#webpage`), url: absoluteUrl(path), name: `${category.name} | Rakindu Fernando`, description: category.introduction,
      isPartOf: { "@id": websiteId }, about: { "@id": personId }, inLanguage: "en", breadcrumb: { "@id": absoluteUrl(`${path}#breadcrumbs`) },
      mainEntity: { "@type": "ItemList", numberOfItems: works.length, itemListElement: works.map((work, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": work["@id"] } })) },
      hasPart: works.map((work) => ({ "@id": work["@id"] })),
    },
    { "@type": "BreadcrumbList", "@id": absoluteUrl(`${path}#breadcrumbs`), itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl() },
      { "@type": "ListItem", position: 2, name: category.name, item: absoluteUrl(path) },
    ] },
    ...works,
  ];
}
