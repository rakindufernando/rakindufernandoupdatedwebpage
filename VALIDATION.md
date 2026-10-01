# Validation record

Verified on 22 September 2026.

## Automated checks

- Production build succeeds with the existing Vinext/Vite Cloudflare Worker adapter.
- TypeScript checks pass for both app and Worker.
- ESLint passes.
- All 14 Node tests pass against the production Worker and motion components.
- Worker artifact validation confirms the ESM fetch entry and hosting manifest.
- The six public pages return HTTP 200 with unique titles/descriptions, one H1, correct canonical origin, Open Graph and Twitter metadata, and connected JSON-LD.
- Sitemap contains exactly the homepage and five category pages. Robots permits crawling and references that sitemap.
- Invalid categories and unknown pages return HTTP 404 with a useful title and noindex, without an inherited index instruction or canonical.
- Manifest icons exist. All 27 project IDs, categories, descriptions and image references render in the correct collections.
- Reduced-motion tests confirm that neither Three.js nor GSAP is imported or initialized under the reduced-motion preference.
- Original `app/portfolio-data.json` and all 46 original WebP assets are byte identical to the prior source. Every image also passes decoder validation.

## Browser checks

- Reviewed the electric blue homepage, category gateway and category hero/project layouts in Chrome.
- Opened all 27 project dialogs across the five categories. Checked complete descriptions and available external link attributes.
- Tested next/previous image controls, thumbnail selection and keyboard wrapping on the ten-image chessboard gallery.
- Tested Escape, Close, browser Back and Forward, and mobile gallery opening/closing.
- Tested the motion pause/resume control and the mobile menu.
- Inspected all six pages in responsive frames at 320, 390, 768, 1024 and 1440 pixels. No horizontal document overflow, missing image alt attributes or failed loaded images were found. The browser frame's scrollbar occupies 15 pixels of each requested width.
- Captured actual desktop and mobile screenshots in `preview/`.

The browser's own extension generated metadata/cursor logs, including one hydration attribute warning explicitly limited to its injected `data-oai-browser-agent-*` HTML attributes. No application-origin exception was observed in the tested interactions. No suppression was added to conceal those extension messages.

## Limits

Third-party project/profile links and the original resume path are preserved. Their availability, authentication requirements and third-party content are outside this package. No external account login or profile edits were performed.

The build retains a nonfatal large-chunk warning for the dynamically imported Three.js library. It is optional and deferred; no additional animation dependency was introduced. Core Web Vitals, device-specific FPS and an exhaustive screen-reader or physical-device audit have not been measured. Reduced motion was verified in component tests and CSS review, not by changing the remote browser's operating-system preference.

Google Search Console ownership verification and sitemap submission remain owner steps described in `SEO_SETUP.md`. Google indexing and ranking are not asserted.

The main accent is exactly `#00F0FF` through `--electric-blue`; the existing `--cyan` alias follows the same token.
