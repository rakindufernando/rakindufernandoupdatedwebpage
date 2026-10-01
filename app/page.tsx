/* eslint-disable @next/next/no-img-element -- Local WebP assets are already optimized and served unchanged. */

import StructuredData from "./components/StructuredData";
import DeveloperVisual from "./components/DeveloperVisual";
import HeroName from "./components/HeroName";
import { homeTitle, homeDescription, homeGraph, pageMetadata } from "./lib/seo";

export const metadata = pageMetadata(homeTitle, homeDescription, "/");

import PortfolioShell from "./components/PortfolioShell";
import CategoryGateway from "./components/CategoryGateway";
import { projects } from "./lib/portfolio";

const experience = [
  { year: "2025–Now", role: "Junior Creative Designer", place: "SAS Creative", logo: "/media/logos/sas-creative.webp", text: "Contributing to branding and design projects for international clients while strengthening my skills in the Adobe Creative Suite and collaborative creative work." },
  { year: "2023–2024", role: "Banking Intern", place: "Hatton National Bank PLC", logo: "/media/logos/hnb.webp", text: "Handled account and fixed deposit opening, resolved customer mobile-banking issues and supported secure fund transfers to ensure efficient service." },
  { year: "2021–Now", role: "Vice President, Photographer, Editor and Livestreamer", place: "St. Joseph’s Church Uyana Media Unit", logo: "/media/logos/sjc-media.webp", text: "Oversee media operations, livestream holy masses and events, capture and edit photography, and produce social content for the parish community." },
  { year: "2020–Now", role: "Owner and Photographer", place: "Raki Studios", logo: "/media/logos/raki-studios.webp", text: "Manage photography, video editing and content creation, covering events and producing polished visual work for clients and social media." },
  { year: "2020–Now", role: "Editor and Co-Founder", place: "ReD Productions", logo: "/media/logos/red-productions.webp", text: "Edit and produce video content, create visual effects, record footage and shape the YouTube channel’s branding and visual identity." },
];

const skills = ["Figma", "Photoshop", "Illustrator", "After Effects", "Premiere Pro", "HTML", "CSS", "JavaScript", "Java", "3ds Max", "UI/UX", "Visual Storytelling"];

export default function Home() {
  return (
    <PortfolioShell>
      <StructuredData data={homeGraph()} />
      <section id="home" className="hero section-pad">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow hero-reveal"><span>Creative Software Engineer</span><b>Colombo, Sri Lanka</b></p>
            <HeroName />
            <h1 className="hero-reveal">I design digital <em>experiences</em> that feel alive.</h1>
            <p className="hero-intro hero-reveal">UI/UX designer, creative designer and software engineering student blending clean code, visual storytelling and interaction design.</p>
            <div className="hero-actions hero-reveal">
              <a className="button button-primary magnetic" href="#work">Explore selected work <span>↘</span></a>
              <a className="text-link" href="#contact">Let’s create together <span>→</span></a>
            </div>
          </div>
          <div className="hero-interface hero-reveal" aria-hidden="true">
            <DeveloperVisual />
            <div className="orbit orbit-one"><span>UI</span></div>
            <div className="orbit orbit-two"><span>3D</span></div>
            <div className="hud-card hud-top"><i /> System online <b>2026</b></div>
            <div className="hud-card hud-bottom"><small>Current focus</small><strong>DESIGN × CODE × MOTION</strong></div>
            <div className="coordinates">6.9271° N<br />79.8612° E</div>
          </div>
        </div>
        <div className="hero-footer hero-reveal">
          <span className="scroll-cue"><i /> Scroll to explore</span>
          <div className="hero-metrics"><span><b>{projects.length}</b> portfolio projects</span><span><b>05+</b> years creating</span><span><b>∞</b> curiosity</span></div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true"><div className="parallax-text">DESIGN · DEVELOP · CREATE · IMAGINE · DESIGN · DEVELOP · CREATE · IMAGINE ·</div></div>

      <section id="about" className="about section-pad">
        <header className="section-heading reveal"><span>01 / About</span><h2>Creative thinking with an engineering <em>mindset.</em></h2></header>
        <div className="about-layout">
          <div className="about-art reveal" data-tilt>
            <div className="portrait-frame"><img src="/media/profile/rakindu-fernando.webp" alt="Rakindu Fernando" loading="lazy" decoding="async" /><div className="scan-line" /></div>
            <div className="about-art-label"><span>Based in</span><b>Sri Lanka</b></div>
          </div>
          <div className="about-copy reveal">
            <p className="lead">I’m Rakindu Fernando, a multidisciplinary creator who turns complex ideas into clear, useful and memorable digital experiences.</p>
            <p>I completed a Pearson BTEC Higher National Diploma in Computing and now pursue a BSc in Software Engineering. My work connects interface design, frontend development, branding, photography and motion, giving every project both technical structure and a strong visual voice.</p>
            <div className="about-facts"><span><b>Design</b>Human-centred interfaces</span><span><b>Code</b>Practical web systems</span><span><b>Create</b>Visual stories and brands</span></div>
          </div>
        </div>
      </section>

      <section className="skills section-pad">
        <header className="section-heading reveal"><span>02 / Toolkit</span><h2>Ideas move faster with the <em>right tools.</em></h2></header>
        <div className="skill-cloud reveal">
          {skills.map((skill, index) => <span key={skill} style={{ "--i": index } as React.CSSProperties}>{skill}<i /></span>)}
        </div>
      </section>

      <CategoryGateway />

      <section id="experience" className="experience section-pad">
        <header className="section-heading reveal"><span>04 / Experience</span><h2>A path shaped by making, learning and <em>leading.</em></h2></header>
        <div className="timeline">
          {experience.map((item, index) => (
            <article className="timeline-row reveal" key={item.place}>
              <span className="timeline-index">0{index + 1}</span><span className="timeline-year">{item.year}</span>
              <div className="experience-role"><img src={item.logo} alt="" loading="lazy" /><div><h3>{item.role}</h3><h4>{item.place}</h4></div></div><p>{item.text}</p><i className="timeline-dot" />
            </article>
          ))}
        </div>
      </section>

      <section className="education section-pad">
        <header className="section-heading reveal"><span>05 / Education</span><h2>Always learning. Always <em>building forward.</em></h2></header>
        <div className="education-grid">
          <article className="education-card reveal" data-tilt><span>Now</span><h3>BSc (Hons) Software Engineering</h3><p>ICBT Campus · Cardiff Metropolitan University. Advanced study in programming, analytics, professional issues and a software engineering dissertation.</p><small>2025 to present</small></article>
          <article className="education-card reveal" data-tilt><span>Completed</span><h3>HND in Computing</h3><p>Software Engineering · Pearson BTEC at Achievers International Campus. Covered programming, web development, databases, UI/UX and agile methods.</p><small>2023 to 2025</small></article>
          <article className="education-card reveal" data-tilt><span>Creative</span><h3>Advanced Graphic Design</h3><p>Wijeya Graphics Institute. Developing skills in visual communication, Photoshop, CorelDRAW, digital animation, branding and editorial design.</p><small>2025 to present</small></article>
          <article className="education-card reveal" data-tilt><span>Commerce</span><h3>G.C.E. Advanced Level</h3><p>St. Sebastian’s College, Moratuwa. Commerce stream with Economics, Accounting, Business Studies and English.</p><small>2019 to 2022 · 1 A, 1 B and 2 C grades</small></article>
          <article className="education-card reveal" data-tilt><span>Foundation</span><h3>G.C.E. Ordinary Level</h3><p>St. Sebastian’s College, Moratuwa. Built a strong academic foundation across core subjects.</p><small>2019 · 7 A, 1 B and 1 C grades</small></article>
          <article className="education-card reveal" data-tilt><span>Certificates</span><h3>Professional Certifications</h3><p>Certificate in Microsoft Applications and the British Council Skills Plus English Course.</p><small>2020 to 2023</small></article>
        </div>
      </section>

      <section className="resume-band section-pad reveal">
        <div><span>Complete profile</span><h2>Want the full story behind my experience</h2><p>Download my latest resume with education, skills and professional background.</p></div>
        <a className="button button-primary" href="/Rakindu-Fernando-Resume.pdf" download>Download resume <span>↓</span></a>
      </section>

      <section id="contact" className="contact section-pad">
        <div className="contact-orb" aria-hidden="true" />
        <p className="eyebrow reveal"><span>Start a conversation</span><b>Open to collaborations</b></p>
        <h2 className="reveal">Have an idea in mind<br /><em>Let’s make it real.</em></h2>
        <a className="contact-email reveal" href="mailto:rakindufernando@gmail.com">rakindufernando@gmail.com <span>↗</span></a>
        <div className="contact-details reveal"><a href="tel:+94712009223">071 200 9223</a><a href="tel:+94705506150">070 550 6150</a><span>Moratuwa, Sri Lanka</span></div>
        <div className="contact-row reveal"><span>Find me online</span><div><a href="https://github.com/rakindufernando" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://www.linkedin.com/in/rakindu-fernando-78a665233" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://www.instagram.com/_rakinduu_/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.facebook.com/rakindu.fernando" target="_blank" rel="noopener noreferrer">Facebook</a><a href="https://www.youtube.com/@rakistudios" target="_blank" rel="noopener noreferrer">YouTube</a></div></div>
      </section>

    </PortfolioShell>
  );
}
