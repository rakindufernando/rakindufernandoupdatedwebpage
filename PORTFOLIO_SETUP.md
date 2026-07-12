# Rakindu Fernando Immersive Portfolio

## Included technology

- React 19 and TypeScript
- Vinext and Vite
- Three.js for the interactive 3D background
- GSAP and ScrollTrigger for reveal and scroll-linked animation
- Responsive CSS with reduced-motion support

## Run locally

1. Install Node.js 22.13 or newer.
2. Open a terminal in the project folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local address displayed in the terminal.

## Main files

- `app/page.tsx` contains the portfolio content, interactions and Three.js scene.
- `app/globals.css` contains the complete visual system and responsive layouts.
- `app/layout.tsx` contains the page metadata and application shell.

## Personalize the content

Update the project, experience and skill arrays near the top of `app/page.tsx`. The same file also contains the About, Education and Contact content. Colours and spacing tokens are defined at the top of `app/globals.css`.

The 3D scene automatically falls back to the CSS visual treatment when WebGL is unavailable. Visitors who prefer reduced motion also receive a simplified experience.
