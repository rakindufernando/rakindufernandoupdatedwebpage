"use client";

import { useEffect, useRef } from "react";

export default function Scene({ paused = false }: { paused?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let generation = 0;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposeScene = () => {};

    const initializeScene = async () => {
      const version = ++generation;
      disposeScene();
      if (motionQuery.matches || paused) { canvas.classList.add("webgl-unavailable"); return; }
      const THREE = await import("three");
      if (cancelled || version !== generation) return;
      canvas.classList.remove("webgl-unavailable");

      const mobile = window.innerWidth < 760;
      let renderer: import("three").WebGLRenderer;
      try {
        const context = canvas.getContext("webgl2", { alpha: true, antialias: !mobile, powerPreference: "low-power" });
        if (!context) { canvas.classList.add("webgl-unavailable"); return; }
        renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: !mobile, powerPreference: "low-power" });
      } catch {
        canvas.classList.add("webgl-unavailable");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 8);

      const group = new THREE.Group();
      scene.add(group);

      const geometry = new THREE.IcosahedronGeometry(2.05, 2);
      const material = new THREE.MeshStandardMaterial({
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
      const shellMaterial = new THREE.MeshStandardMaterial({ color: 0x090b14, roughness: 0.25, metalness: 0.75, transparent: true, opacity: 0.66 });
      group.add(new THREE.Mesh(shellGeometry, shellMaterial));

      const ringGeometry = new THREE.TorusGeometry(2.55, 0.015, 10, 160);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.55 });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI * 0.42;
      ring.rotation.y = Math.PI * 0.12;
      group.add(ring);

      const count = mobile ? 80 : 320;
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
      const particleMaterial = new THREE.PointsMaterial({ color: 0x9df8ff, size: 0.012, transparent: true, opacity: 0.5, sizeAttenuation: true });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // One batched line buffer gives the particle field a network structure.
      const connections: number[] = [];
      const networkCount = mobile ? 22 : 75;
      for (let i = 0; i < networkCount; i++) {
        for (let j = i + 1; j < networkCount; j++) {
          const dx = points[i * 3] - points[j * 3];
          const dy = points[i * 3 + 1] - points[j * 3 + 1];
          const dz = points[i * 3 + 2] - points[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < 7) connections.push(...points.slice(i * 3, i * 3 + 3), ...points.slice(j * 3, j * 3 + 3));
        }
      }
      const networkGeometry = new THREE.BufferGeometry();
      networkGeometry.setAttribute("position", new THREE.Float32BufferAttribute(connections, 3));
      const networkMaterial = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.13 });
      const network = new THREE.LineSegments(networkGeometry, networkMaterial);
      scene.add(network);
      const nodeGeometry = new THREE.IcosahedronGeometry(2.07, 1);
      const nodeMaterial = new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.045, transparent: true, opacity: 0.7 });
      group.add(new THREE.Points(nodeGeometry, nodeMaterial));

      const electricBlue = new THREE.PointLight(0x00f0ff, 18, 16);
      electricBlue.position.set(3, 2, 4);
      scene.add(electricBlue);
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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));
      };

      window.addEventListener("pointermove", pointer, { passive: true });
      window.addEventListener("scroll", scroll, { passive: true });
      window.addEventListener("resize", resize);

      let frame = 0;
      let lastFrame = 0;
      const clock = new THREE.Clock();
      const animate = (now = 0) => {
        if (document.hidden || cancelled) return;
        frame = requestAnimationFrame(animate);
        if (now - lastFrame < (mobile ? 1000 / 30 : 1000 / 60 - 0.8)) return;
        lastFrame = now;
        const time = clock.getElapsedTime();
        const ease = 1;
        group.rotation.y += ((mouseX * 0.24 + time * 0.08) * ease - group.rotation.y) * 0.025;
        group.rotation.x += ((-mouseY * 0.16 + time * 0.035) * ease - group.rotation.x) * 0.025;
        group.position.x += ((window.innerWidth > 900 ? 2.65 : 0.8) + mouseX * 0.24 * ease - group.position.x) * 0.035;
        group.position.y += ((scrollY * -0.00055) + mouseY * -0.18 * ease - group.position.y) * 0.035;
        particles.rotation.y = time * 0.008 * ease;
        particles.rotation.x = scrollY * 0.00004 * ease;
        network.rotation.copy(particles.rotation);
        renderer.render(scene, camera);
      };
      const visibility = () => { cancelAnimationFrame(frame); if (!document.hidden) animate(); };
      const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); canvas.classList.add("webgl-unavailable"); };
      document.addEventListener("visibilitychange", visibility);
      canvas.addEventListener("webglcontextlost", lost);
      animate();

      disposeScene = () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("visibilitychange", visibility);
        canvas.removeEventListener("webglcontextlost", lost);
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
        networkGeometry.dispose(); networkMaterial.dispose();
        nodeGeometry.dispose(); nodeMaterial.dispose();
        renderer.dispose();
      };
    };

    const start = () => { void initializeScene().catch(() => canvas.classList.add("webgl-unavailable")); };
    motionQuery.addEventListener("change", start);
    canvas.addEventListener("webglcontextrestored", start);
    // Defer optional WebGL until the browser has painted the useful content.
    const idle = !motionQuery.matches && !paused && "requestIdleCallback" in window ? window.requestIdleCallback(start, { timeout: 1800 }) : null;
    const timer = !motionQuery.matches && !paused && idle === null ? window.setTimeout(start, 350) : null;
    if (motionQuery.matches || paused) canvas.classList.add("webgl-unavailable");
    return () => { if (idle !== null) window.cancelIdleCallback(idle); if (timer !== null) window.clearTimeout(timer); cancelled = true; generation++; motionQuery.removeEventListener("change", start); canvas.removeEventListener("webglcontextrestored", start); disposeScene(); };
  }, [paused]);

  return <canvas ref={canvasRef} className="webgl-scene" aria-hidden="true" />;
}

