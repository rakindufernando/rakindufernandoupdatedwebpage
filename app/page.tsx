"use client";

import { useEffect, useRef, useState } from "react";
import archiveProjects from "./portfolio-data.json";

type Project = {
  id: string;
  title: string;
  category: string;
  date: string;
  year: string;
  description: string;
  accent: string;
  code: string;
  images: string[];
  sourceImages: string[];
  href?: string;
};

const projects = archiveProjects as Project[];

const experience = [
  { year: "2025–Now", role: "Junior Creative Designer", place: "SAS Creative", logo: "/media/logos/sas-creative.webp", text: "Contributing to branding and design projects for international clients while strengthening my skills in the Adobe Creative Suite and collaborative creative work." },
  { year: "2023–2024", role: "Banking Intern", place: "Hatton National Bank PLC", logo: "/media/logos/hnb.webp", text: "Handled account and fixed deposit opening, resolved customer mobile-banking issues and supported secure fund transfers to ensure efficient service." },
  { year: "2021–Now", role: "Vice President, Photographer, Editor and Livestreamer", place: "St. Joseph’s Church Uyana Media Unit", logo: "/media/logos/sjc-media.webp", text: "Oversee media operations, livestream holy masses and events, capture and edit photography, and produce social content for the parish community." },
  { year: "2020–Now", role: "Owner and Photographer", place: "Raki Studios", logo: "/media/logos/raki-studios.webp", text: "Manage photography, video editing and content creation, covering events and producing polished visual work for clients and social media." },
  { year: "2020–Now", role: "Editor and Co-Founder", place: "ReD Productions", logo: "/media/logos/red-productions.webp", text: "Edit and produce video content, create visual effects, record footage and shape the YouTube channel’s branding and visual identity." },
];

const skills = ["Figma", "Photoshop", "Illustrator", "After Effects", "Premiere Pro", "HTML", "CSS", "JavaScript", "Java", "3ds Max", "UI/UX", "Visual Storytelling"];
const categories = ["All", "UI/UX Design", "Software Development", "Graphic Design", "Videography", "Photography"];

function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let disposeScene = () => {};

    const initializeScene = async () => {
      const THREE = await import("three");
      if (cancelled) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        canvas.classList.add("webgl-unavailable");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 8);

      const group = new THREE.Group();
      scene.add(group);

      const geometry = new THREE.IcosahedronGeometry(2.05, 2);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x071b28,
        emissive: 0x003d55,
        emissiveIntensity: 0.25,
        roughness: 0.18,
        metalness: 0.82,
        wireframe: true,
        transparent: true,
        opacity: 0.46,
      });
      group.add(new THREE.Mesh(geometry, material));

      const shellGeometry = new THREE.IcosahedronGeometry(1.72, 1);
      const shellMaterial = new THREE.MeshPhysicalMaterial({ color: 0x090b14, roughness: 0.25, metalness: 0.75, transparent: true, opacity: 0.66 });
      group.add(new THREE.Mesh(shellGeometry, shellMaterial));

      const ringGeometry = new THREE.TorusGeometry(2.55, 0.015, 10, 160);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.55 });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI * 0.42;
      ring.rotation.y = Math.PI * 0.12;
      group.add(ring);

      const count = window.innerWidth < 700 ? 420 : 950;
      const points = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const radius = 3.2 + Math.random() * 7;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        points[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        points[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        points[i * 3 + 2] = radius * Math.cos(phi);
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
      const particleMaterial = new THREE.PointsMaterial({ color: 0x74f1ff, size: 0.012, transparent: true, opacity: 0.5, sizeAttenuation: true });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      const cyan = new THREE.PointLight(0x00e5ff, 18, 16);
      cyan.position.set(3, 2, 4);
      scene.add(cyan);
      const violet = new THREE.PointLight(0x8b5cf6, 12, 14);
      violet.position.set(-4, -2, 2);
      scene.add(violet);

      let mouseX = 0;
      let mouseY = 0;
      let scrollY = 0;
      const pointer = (event: PointerEvent) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
      };
      const scroll = () => { scrollY = window.scrollY; };
      const resize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      };

      window.addEventListener("pointermove", pointer, { passive: true });
      window.addEventListener("scroll", scroll, { passive: true });
      window.addEventListener("resize", resize);

      let frame = 0;
      const clock = new THREE.Clock();
      const animate = () => {
        const time = clock.getElapsedTime();
        const ease = reduced ? 0 : 1;
        group.rotation.y += ((mouseX * 0.24 + time * 0.08) * ease - group.rotation.y) * 0.025;
        group.rotation.x += ((-mouseY * 0.16 + time * 0.035) * ease - group.rotation.x) * 0.025;
        group.position.x += ((window.innerWidth > 900 ? 2.65 : 0.8) + mouseX * 0.24 * ease - group.position.x) * 0.035;
        group.position.y += ((scrollY * -0.00055) + mouseY * -0.18 * ease - group.position.y) * 0.035;
        particles.rotation.y = time * 0.008 * ease;
        particles.rotation.x = scrollY * 0.00004 * ease;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };
      animate();

      disposeScene = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", pointer);
        window.removeEventListener("scroll", scroll);
        window.removeEventListener("resize", resize);
        geometry.dispose();
        material.dispose();
        shellGeometry.dispose();
        shellMaterial.dispose();
        ringGeometry.dispose();
        ringMaterial.dispose();
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.dispose();
      };
    };

    void initializeScene().catch(() => canvas.classList.add("webgl-unavailable"));
    return () => { cancelled = true; disposeScene(); };
  }, []);

  return <canvas ref={canvasRef} className="webgl-scene" aria-hidden="true" />;
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let disposeAnimations = () => {};

    const initializeAnimations = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const context = gsap.context(() => {
        gsap.from(".hero-reveal", { y: 70, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power4.out", delay: 0.15 });
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((item) => {
          gsap.fromTo(item, { y: 56, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 86%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>(".parallax-text").forEach((item) => {
          gsap.to(item, { xPercent: -12, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1.2 } });
        });
        gsap.to(".scroll-progress", { scaleX: 1, ease: "none", transformOrigin: "left", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });
      }, rootRef);

      const tiltCards = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
      const cleanups = tiltCards.map((card) => {
        const move = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 900, duration: 0.45, ease: "power2.out" });
        };
        const leave = () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "elastic.out(1, .5)" });
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); };
      });

      disposeAnimations = () => {
        context.revert();
        cleanups.forEach((cleanup) => cleanup());
      };
    };

    void initializeAnimations().catch(() => document.documentElement.classList.add("motion-fallback"));
    return () => { cancelled = true; disposeAnimations(); };
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedProject]);

  const visibleProjects = filter === "All" ? projects : projects.filter((project) => project.category === filter);

  return (
    <main ref={rootRef} className="site-shell">
      <Scene />
      <div className="noise" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />

      <nav className="nav-wrap" aria-label="Primary navigation">
        <a className="brand magnetic" href="#home" aria-label="Rakindu Fernando home"><span>R</span>F</a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="nav-links">
          <span>{menuOpen ? "Close" : "Menu"}</span><i />
        </button>
        <div id="nav-links" className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          {["About", "Work", "Experience", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
          ))}
        </div>
        <a className="availability" href="mailto:rakindufernando@gmail.com"><i /> Available for opportunities</a>
      </nav>

      <section id="home" className="hero section-pad">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow hero-reveal"><span>Creative Software Engineer</span><b>Colombo, Sri Lanka</b></p>
            <h1 className="hero-reveal">I design digital <em>experiences</em> that feel alive.</h1>
            <p className="hero-intro hero-reveal">UI/UX designer, creative designer and software engineering student blending clean code, visual storytelling and interaction design.</p>
            <div className="hero-actions hero-reveal">
              <a className="button button-primary magnetic" href="#work">Explore selected work <span>↘</span></a>
              <a className="text-link" href="#contact">Let’s create together <span>→</span></a>
            </div>
          </div>
          <div className="hero-interface hero-reveal" aria-hidden="true">
            <div className="orbit orbit-one"><span>UI</span></div>
            <div className="orbit orbit-two"><span>3D</span></div>
            <div className="hud-card hud-top"><i /> System online <b>2026</b></div>
            <div className="hud-card hud-bottom"><small>Current focus</small><strong>DESIGN × CODE × MOTION</strong></div>
            <div className="coordinates">6.9271° N<br />79.8612° E</div>
          </div>
        </div>
        <div className="hero-footer hero-reveal">
          <span className="scroll-cue"><i /> Scroll to explore</span>
          <div className="hero-metrics"><span><b>27</b> portfolio projects</span><span><b>05+</b> years creating</span><span><b>∞</b> curiosity</span></div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true"><div className="parallax-text">DESIGN · DEVELOP · CREATE · IMAGINE · DESIGN · DEVELOP · CREATE · IMAGINE ·</div></div>

      <section id="about" className="about section-pad">
        <header className="section-heading reveal"><span>01 / About</span><h2>Creative thinking with an engineering <em>mindset.</em></h2></header>
        <div className="about-layout">
          <div className="about-art reveal" data-tilt>
            <div className="portrait-frame"><img src="/media/profile/rakindu-fernando.webp" alt="Rakindu Fernando" /><div className="scan-line" /></div>
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

      <section id="work" className="work section-pad">
        <header className="section-heading reveal"><span>03 / Selected work</span><h2>Projects built across <em>pixels and logic.</em></h2></header>
        <div className="filters reveal" role="group" aria-label="Filter projects">
          {categories.map((category) => <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>{category}</button>)}
        </div>
        <div className="project-grid">
          {visibleProjects.map((project) => {
            return (
              <article key={project.id} className="project-card reveal" data-tilt style={{ "--accent": project.accent } as React.CSSProperties}>
                <button className="project-card-button" onClick={() => { setSelectedProject(project); setActiveImage(0); }} aria-label={`View details for ${project.title}`}>
                  <div className="project-visual">
                    <img src={project.images[0]} alt={project.title} loading="lazy" />
                    <span className="project-code">{project.code}</span>
                    <span className="project-year">{project.year}</span>
                    {project.images.length > 1 && <span className="image-count">+{project.images.length - 1} images</span>}
                  </div>
                  <div className="project-meta"><span>{project.category}</span><h3>{project.title}</h3><p>{project.description}</p><b>View full project ↗</b></div>
                </button>
              </article>
            );
          })}
        </div>
      </section>

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
        <div className="contact-details reveal"><a href="tel:+94712009223">071 200 9223</a><a href="tel:+94722009223">072 200 9223</a><span>Moratuwa, Sri Lanka</span></div>
        <div className="contact-row reveal"><span>Find me online</span><div><a href="https://github.com/rakindufernando" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/rakindu-fernando-78a665233" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://www.instagram.com/_rakinduu_/" target="_blank" rel="noreferrer">Instagram</a><a href="https://web.facebook.com/rakindu.fernando" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.youtube.com/@rakistudios" target="_blank" rel="noreferrer">YouTube</a></div></div>
      </section>

      <footer><a className="brand" href="#home"><span>R</span>F</a><p>Designed and developed by Rakindu Fernando</p><a href="#home">Back to top ↑</a></footer>

      {selectedProject && (
        <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
          <button className="modal-backdrop" onClick={() => setSelectedProject(null)} aria-label="Close project details" />
          <article className="modal-panel">
            <div className="modal-topbar"><span>{selectedProject.code} / {selectedProject.category}</span><button onClick={() => setSelectedProject(null)}>Close ×</button></div>
            <div className="modal-layout">
              <div className="modal-gallery">
                <img src={selectedProject.images[activeImage]} alt={`${selectedProject.title} image ${activeImage + 1}`} />
                {selectedProject.images.length > 1 && <div className="modal-thumbs">{selectedProject.images.map((image, index) => <button key={image} className={activeImage === index ? "active" : ""} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`}><img src={image} alt="" loading="lazy" /></button>)}</div>}
              </div>
              <div className="modal-copy"><span>{selectedProject.year}</span><h2 id="project-modal-title">{selectedProject.title}</h2><p>{selectedProject.description}</p>{selectedProject.href && <a className="button button-primary" href={selectedProject.href} target="_blank" rel="noreferrer">View project link <span>↗</span></a>}</div>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
