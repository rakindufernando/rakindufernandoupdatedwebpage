/* eslint-disable @next/next/no-img-element -- Preserve every original TechTrend image without transformation. */
import type { Metadata } from "next";
import PortfolioShell from "../../../components/PortfolioShell";
import Link from "../../../components/SiteLink";
import StructuredData from "../../../components/StructuredData";
import TechTrendExperience from "../../../components/techtrend/TechTrendExperience";
import ScreenFigure from "../../../components/techtrend/ScreenFigure";
import content from "../../../lib/techtrend-content.json";
import { screens, cover } from "../../../lib/techtrend-screens.json";
import { projects } from "../../../lib/portfolio";
import { techTrendPath } from "../../../lib/project-routes";
import { absoluteUrl, pageMetadata, personId, websiteId } from "../../../lib/seo";
import "./techtrend.css";

const project = projects.find((item) => item.id === "project-01")!;
const title = "TechTrend E-commerce App UI UX Case Study | Rakindu Fernando";
const description = "Explore Rakindu Fernando’s TechTrend UI UX case study, with all 28 original mobile screens, user-centered design decisions, key features and interactive Figma prototype.";
const pageMeta = pageMetadata(title, description, techTrendPath);
export const metadata: Metadata = { ...pageMeta, openGraph: { ...pageMeta.openGraph, images: [{ url: absoluteUrl(project.images[0]), alt: "TechTrend e-commerce mobile application UI UX design" }] }, twitter: { ...pageMeta.twitter, images: [{ url: absoluteUrl(project.images[0]), alt: "TechTrend mobile application" }] } };
const [overview, landscape, audience, principles, process] = content.sections;
const discovery = [11, 12, 13, 14, 26, 27, 28].map((number) => screens[number - 1]);
const purchase = [19, 20, 22, 25].map((number) => screens[number - 1]);
const statuses = [21, 23, 24].map((number) => screens[number - 1]);
const videoUrl = content.videoEmbed.replace("/embed/", "/watch?v=");
const figmaUrl = content.figmaEmbed.replace("https://embed.figma.com/", "https://www.figma.com/").replace("&embed-host=share", "");

function SectionHeading({ number, eyebrow, title, id }: { number: string; eyebrow: string; title: string; id: string }) {
  return <header className="tt-section-heading"><p className="tt-kicker"><span>{number}</span> {eyebrow}</p><h2 id={id} className="tt-section-title">{title}</h2></header>;
}

export default function TechTrendPage() {
  const graph = [
    { "@type": "WebPage", "@id": absoluteUrl(`${techTrendPath}#webpage`), url: absoluteUrl(techTrendPath), name: title, description, isPartOf: { "@id": websiteId }, breadcrumb: { "@id": absoluteUrl(`${techTrendPath}#breadcrumbs`) }, mainEntity: { "@id": absoluteUrl(`${techTrendPath}#case-study`) }, inLanguage: "en" },
    { "@type": "CreativeWork", "@id": absoluteUrl(`${techTrendPath}#case-study`), name: "TechTrend E-commerce App", identifier: project.id, description: project.description, dateCreated: project.date, genre: project.category, creator: { "@id": personId }, url: absoluteUrl(techTrendPath), image: screens.map((screen) => absoluteUrl(screen.src)), subjectOf: [{ "@type": "WebPage", url: videoUrl }, { "@type": "WebPage", url: figmaUrl }] },
    { "@type": "BreadcrumbList", "@id": absoluteUrl(`${techTrendPath}#breadcrumbs`), itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl() },
      { "@type": "ListItem", position: 2, name: "UI UX Design", item: absoluteUrl("/work/ui-ux-design") },
      { "@type": "ListItem", position: 3, name: "TechTrend", item: absoluteUrl(techTrendPath) },
    ] },
  ];
  return <><StructuredData data={graph} /><PortfolioShell categoryPage personality="interface techtrend-page"><TechTrendExperience>
    <section id="category-top" className="tt-hero section-pad" aria-labelledby="tt-title">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/work/ui-ux-design">UI UX Design</Link><span aria-hidden="true">/</span><span aria-current="page">TechTrend</span></nav>
      <div className="tt-hero-layout">
        <div className="tt-hero-copy"><p className="tt-kicker">UI UX case study <span>/ {project.year}</span></p><h1 id="tt-title" className="tt-hero-title"><span>Tech</span><span>Trend</span></h1><p className="tt-hero-subtitle">{content.subtitle}</p><p className="tt-hero-intro">An end-to-end mobile shopping journey, from the first welcome to the next delivery.</p><div className="tt-actions"><a className="button button-primary" href="#screens">Explore all {screens.length} screens</a><a className="text-link" href="#prototype-video">Watch the prototype</a></div></div>
        <div className="tt-hero-art" aria-hidden="true"><div className="tt-hero-glow" />{[screens[1], screens[10], screens[25]].map((screen, index) => <div className="tt-hero-phone" key={screen.id}><img src={screen.src} alt="" width={screen.width} height={screen.height} fetchPriority={index === 1 ? "high" : "auto"} decoding="async" /></div>)}<span className="tt-art-label">Interface / Interaction / Experience</span></div>
      </div>
      <dl className="tt-facts"><div><dt>Discipline</dt><dd>UI UX Design</dd></div><div><dt>Design tool</dt><dd>Figma</dd></div><div><dt>Platform</dt><dd>Mobile commerce</dd></div><div><dt>Designed screens</dt><dd>{String(screens.length).padStart(2, "0")}</dd></div></dl>
      <nav className="tt-chapter-nav" aria-label="TechTrend case study sections">{[["overview","Overview"],["audience","Audience"],["screens","Screens"],["features","Features"],["process","Process"],["prototype-video","Prototype"],["figma","Figma"]].map(([id,label])=><a href={`#${id}`} key={id}>{label}</a>)}</nav>
    </section>

    <section id="overview" className="tt-section section-pad" aria-labelledby="tt-overview-heading">
      <SectionHeading number="01" eyebrow="The project" title="An intuitive way to discover what’s next." id="tt-overview-heading" />
      <div className="tt-overview-layout"><div className="tt-overview-summary tt-reveal"><p className="tt-lead">{project.description}</p><figure className="tt-original-cover tt-media-reveal"><img src={cover.src} alt="Original TechTrend project artwork showing the app’s mobile shopping interfaces" width={cover.width} height={cover.height} loading="lazy" decoding="async" /><figcaption>TechTrend / Original project artwork</figcaption></figure></div><div className="tt-prose tt-reveal"><h3>{overview.title}</h3>{overview.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
      <details className="tt-context tt-reveal"><summary>{landscape.title}<span aria-hidden="true">+</span></summary><div className="tt-prose">{landscape.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</div></details>
    </section>

    <section id="audience" className="tt-section section-pad tt-bordered" aria-labelledby="tt-audience-heading">
      <SectionHeading number="02" eyebrow="People and expectations" title="Designed for tech enthusiasts." id="tt-audience-heading" />
      <div className="tt-audience-layout"><div className="tt-sticky-copy tt-reveal"><p className="tt-big-stat">18–45<span>Tech-savvy, urban, curious.</span></p>{audience.paragraphs.map((paragraph)=><p className="tt-body" key={paragraph}>{paragraph}</p>)}</div><dl className="tt-expectations">{audience.items.map((item,index)=><div className="tt-reveal" key={item.title}><dt><span>0{index+1}</span>{item.title}</dt><dd>{item.description}</dd></div>)}</dl></div>
    </section>

    <section id="screens" className="tt-section section-pad tt-screen-intro" aria-labelledby="tt-screens-heading">
      <SectionHeading number="03" eyebrow={`${screens.length} original interfaces`} title="Every screen. One connected experience." id="tt-screens-heading" />
      <div className="tt-screen-intro-bottom"><p className="tt-body">Explore the complete journey through onboarding, product discovery, checkout and ongoing support. Open any screen to inspect its original design.</p><details className="tt-screen-index"><summary>Browse all {screens.length} screens <span aria-hidden="true">+</span></summary><ol>{screens.map(screen=><li key={screen.id}><a href={screen.src} data-screen-open={screen.id} target="_blank" rel="noopener noreferrer"><span>{screen.id.slice(-2)}</span>{screen.label}</a></li>)}</ol></details></div>
    </section>

    <section className="tt-section section-pad tt-onboarding" aria-labelledby="tt-onboarding-heading">
      <header className="tt-chapter-heading tt-reveal"><div><p className="tt-kicker">Journey 01 <span>/ 10 screens</span></p><h2 id="tt-onboarding-heading">A welcoming first step.</h2></div><p>Secure login and registration, social sign-in and password recovery create a clear way into the shopping experience.</p></header>
      <div className="tt-onboarding-lead tt-phone-group">{screens.slice(0,3).map(screen=><ScreenFigure key={screen.id} screen={screen} />)}</div>
      <div className="tt-auth-gallery tt-phone-group">{screens.slice(3,10).map(screen=><ScreenFigure key={screen.id} screen={screen} />)}</div>
    </section>

    <section id="discovery" className="tt-section section-pad tt-discovery" aria-labelledby="tt-discovery-heading">
      <div className="tt-discovery-stage"><header className="tt-chapter-heading tt-reveal"><div><p className="tt-kicker">Journey 02 <span>/ {discovery.length} screens</span></p><h2 id="tt-discovery-heading">Find it. Explore it. Make it yours.</h2></div><p>Browse categories, search for products, scan a QR code and look closer at the details that help make a decision.</p></header><div className="tt-gallery-note"><span className="tt-desktop-scroll">Scroll to explore the collection</span><span className="tt-touch-scroll">Open a screen to look closer</span><a href="#purchase">Continue to checkout</a></div><div className="tt-discovery-viewport"><div className="tt-discovery-track">{discovery.map(screen=><ScreenFigure key={screen.id} screen={screen} />)}</div></div><div className="tt-horizontal-progress" aria-hidden="true"><span /></div></div>
    </section>

    <section id="purchase" className="tt-section section-pad tt-purchase" aria-labelledby="tt-purchase-heading">
      <header className="tt-chapter-heading tt-reveal"><div><p className="tt-kicker">Journey 03 <span>/ {purchase.length + statuses.length} screens</span></p><h2 id="tt-purchase-heading">Confidence at every step.</h2></div><p>From cart to delivery, each stage keeps the shopper informed and in control.</p></header>
      <div className="tt-purchase-shell"><div className="tt-purchase-copy"><p className="tt-kicker">The purchase journey</p><h3>Less uncertainty.<br /><span>More clarity.</span></h3><ol>{[{name:"Review the cart",text:"See the selected products before moving to checkout."},{name:"Complete checkout",text:"Move through delivery and payment details."},{name:"Confirm the payment",text:"A clear success state completes the transaction."},{name:"Follow the delivery",text:"Order tracking keeps the next step visible."}].map((step,index)=><li key={step.name}><span>0{index+1}</span><div><h4>{step.name}</h4><p>{step.text}</p></div></li>)}</ol><a className="text-link" href="#purchase-states">Explore payment and order states</a></div><div className="tt-purchase-stack">{purchase.map(screen=><ScreenFigure key={screen.id} screen={screen} />)}</div></div>
      <div id="purchase-states" className="tt-state-gallery"><div className="tt-state-heading tt-reveal"><h3>Keep the shopper informed.</h3><p className="tt-body">Payment loading, order confirmation and cancellation are part of the complete experience.</p></div><div className="tt-status-screens tt-phone-group">{statuses.map(screen=><ScreenFigure key={screen.id} screen={screen} />)}</div></div>
    </section>

    <section className="tt-section section-pad tt-service" aria-labelledby="tt-service-heading"><div className="tt-service-layout"><div className="tt-sticky-copy tt-reveal"><p className="tt-kicker">Journey 04 <span>/ 4 screens</span></p><h2 id="tt-service-heading">A connection beyond checkout.</h2><p className="tt-body">Notifications, messages, the user account and settings give shoppers a place to stay informed, get help and manage their experience.</p></div><div className="tt-service-screens tt-phone-group">{screens.slice(14,18).map(screen=><ScreenFigure key={screen.id} screen={screen} />)}</div></div></section>

    <section id="features" className="tt-section section-pad tt-bordered" aria-labelledby="tt-features-heading"><SectionHeading number="04" eyebrow="Key features" title="A complete shopping toolkit." id="tt-features-heading" /><div className="tt-features">{content.featureGroups.map((group,index)=><section className="tt-feature-group tt-reveal" key={group.title} aria-labelledby={`tt-feature-${index}`}><h3 id={`tt-feature-${index}`}><span>0{index+1}</span>{group.title}</h3><ul>{group.items.map(item=><li key={item.title}><h4>{item.title}</h4><p>{item.description}</p></li>)}</ul></section>)}</div></section>

    <section id="principles" className="tt-section section-pad tt-principles" aria-labelledby="tt-principles-heading"><SectionHeading number="05" eyebrow="The design foundation" title={principles.title} id="tt-principles-heading" />{principles.paragraphs.map(p=><p className="tt-body tt-section-intro tt-reveal" key={p}>{p}</p>)}<div className="tt-principle-list">{principles.items.map((item,index)=><article className="tt-reveal" key={item.title}><span>0{index+1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>

    <section id="process" className="tt-section section-pad" aria-labelledby="tt-process-heading"><SectionHeading number="06" eyebrow="User-centered design" title={process.title} id="tt-process-heading" />{process.paragraphs.map(p=><p className="tt-body tt-section-intro tt-reveal" key={p}>{p}</p>)}<ol className="tt-process-list">{process.items.map((item,index)=><li className="tt-reveal" key={item.title}><span className="tt-process-number">0{index+1}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol></section>

    <section id="prototype-video" className="tt-section section-pad tt-prototype" aria-labelledby="tt-video-heading"><SectionHeading number="07" eyebrow="From screens to interactions" title="See the journey in motion." id="tt-video-heading" /><div className="tt-embed-intro tt-reveal"><p className="tt-body">Watch the original TechTrend prototype walkthrough.</p><a className="button tt-outline-button" href={videoUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube<span className="sr-only"> in a new tab</span></a></div><div className="tt-video-frame tt-media-reveal"><iframe src={content.videoEmbed} title="TechTrend original e-commerce app prototype video" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></section>

    <section id="figma" className="tt-section section-pad tt-figma" aria-labelledby="tt-figma-heading"><SectionHeading number="08" eyebrow="Explore the design" title="Take a closer look in Figma." id="tt-figma-heading" /><div className="tt-embed-intro tt-reveal"><p className="tt-body">Explore the original interactive TechTrend design and prototype.</p><a className="button button-primary" href={figmaUrl} target="_blank" rel="noopener noreferrer">Explore Figma design<span className="sr-only"> in a new tab</span></a></div><div className="tt-figma-frame tt-media-reveal"><div className="tt-embed-bar"><span>TechTrend / Figma</span><span>Interactive preview</span></div><iframe src={content.figmaEmbed} title="TechTrend interactive Figma design and prototype" loading="lazy" allowFullScreen /></div><p className="tt-embed-fallback">Prefer a larger workspace? <a href={figmaUrl} target="_blank" rel="noopener noreferrer">Open the original Figma file in a new tab.</a></p></section>

    <section className="tt-section section-pad tt-reflection" aria-labelledby="tt-reflection-heading"><p className="tt-kicker">Design reflection</p><h2 id="tt-reflection-heading" className="tt-section-title">A thoughtful journey from discovery to delivery.</h2><div className="tt-prose tt-reveal">{process.after.map(p=><p key={p}>{p}</p>)}</div><div className="tt-closing-links"><Link className="button tt-outline-button" href="/work/ui-ux-design">Back to UI UX Design</Link><Link className="text-link" href="/#work">Explore all work</Link></div></section>
  </TechTrendExperience></PortfolioShell></>;
}
