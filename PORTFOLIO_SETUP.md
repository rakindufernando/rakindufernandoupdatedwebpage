# Rakindu Fernando Portfolio

The complete portfolio, with a five-category homepage gateway and dedicated project collections. The uploaded Next.js App Router structure is preserved. The existing Vinext and Vite runtime remains in place, with React 19, TypeScript, GSAP, ScrollTrigger and Three.js.

## Run in VS Code

1. Install Node.js 22.13 or newer.
2. Extract this ZIP and open the `rakindufernandoupdatedwebpage-main` folder in VS Code.
3. Open the terminal in that folder and run `npm ci`.
4. Run `npm run dev`.
5. Open the local address printed in the terminal.

These commands work in a normal Windows, macOS or Linux terminal. Do not use Live Server or open the TSX files directly in a browser. Dependencies and build output are intentionally not bundled. The package manifest and lockfile install the exact required dependencies.

## Production and validation

- `npm run build` creates the production application.
- `npm start` serves the production build.
- `npm run lint` runs ESLint.
- `npm run typecheck` checks both application and Cloudflare Worker types.
- `npm test` builds the application and runs the production route, data, metadata, 404 and reduced-motion checks.

## Project data and routes

`app/portfolio-data.json` is the only project-data source. All 27 original records are unchanged. Edit this file to add or update projects. Counts and collections update automatically from the category values.

| Route | Exact data category |
| --- | --- |
| `/work/ui-ux-design` | `UI/UX Design` |
| `/work/software-development` | `Software Development` |
| `/work/graphic-design` | `Graphic Design` |
| `/work/videography` | `Videography` |
| `/work/photography` | `Photography` |

`app/lib/portfolio.ts` maps routes to categories and holds the category introduction text and cover-project IDs. Cover images are resolved from the original data. No project descriptions, image paths or counts are duplicated in this configuration. `/work` returns to the homepage Work section. Invalid routes return HTTP 404.

## Main files

- `app/page.tsx` retains the original personal content and homepage sections.
- `app/components/CategoryGateway.tsx` displays the five homepage category sections.
- `app/work/[category]/page.tsx` selects each collection and supplies SEO metadata.
- `app/components/CategoryExperience.tsx` displays the category hero and project layouts.
- `app/components/ProjectGallery.tsx` provides the accessible project dialog, thumbnails, arrows and touch swipes.
- `app/components/PortfolioShell.tsx`, `Navigation.tsx` and `SiteLink.tsx` provide consistent navigation and page framing.
- `app/components/usePortfolioMotion.ts` and `Scene.tsx` manage motion and cleanup.
- `app/globals.css` holds the visual system and responsive styles.
- `app/fonts.css` and `public/fonts` serve the original Geist typefaces locally.
- `public/media` contains every original optimized project image, portrait and logo.

## Galleries and accessibility

Open a project using its image or Explore project button. Use the thumbnails, previous and next buttons, arrow keys or a horizontal touch swipe to move between images. Escape, Close or the backdrop closes the gallery. Browser Back closes an opened project and Forward reopens it. A project can also be opened directly using its original ID as the category URL fragment.

The native dialog traps keyboard focus, makes the page behind it inert and returns focus on close. Reduced-motion preference disables the 3D scene and GSAP animations. Touch layouts do not depend on hover effects. Animation and scene listeners are removed when their page unmounts.

## Preview

Open `preview/index.html` to view captured desktop and mobile screenshots without installing dependencies. Run the app to experience the live scrolling, hover, parallax and gallery interactions.

See `VALIDATION.md` for the checks performed.
