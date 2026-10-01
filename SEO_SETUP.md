# SEO and Cloudflare deployment

## Production origin

`app/lib/site-config.json` is the single origin configuration for canonical URLs, social metadata, JSON-LD, robots and sitemap. It currently uses the published portfolio address. If you deploy this source to your own domain, change `url` to that domain's HTTPS origin, without a trailing slash, then rebuild. Redirect alternate hostnames to your chosen origin at Cloudflare. Do not leave preview domains as the canonical origin of a different production site.

## Google Search Console

1. Add your production property in Google Search Console. A domain property uses DNS verification. For a URL-prefix property you can instead copy the Google HTML verification token into `googleSiteVerification` in `app/lib/site-config.json` and rebuild.
2. Deploy, then complete the ownership verification in your Google account.
3. Submit `/sitemap.xml`. It lists the homepage and the five category pages. Homepage sections and project gallery fragments belong to these pages, rather than being duplicate sitemap entries.
4. Inspect the homepage and category URLs in Search Console and request indexing when appropriate.
5. Monitor indexing, structured data and Core Web Vitals after real visitors supply enough field data.

No Google account credentials or verification tokens are included. Ownership verification and sitemap submission must be completed by the site owner. The implementation prepares discovery and indexing; neither indexing nor search position can be guaranteed.

The primary name is Rakindu Fernando. The alternate spelling Rakindu Ferando appears once as the Person schema's `alternateName`. Only the public profiles already linked in the portfolio are used as `sameAs` values.

## Metadata and semantic content

Each collection has its own title, description, canonical, Open Graph and Twitter metadata. The homepage has the requested branded title. JSON-LD connects Person, WebSite, WebPage, collection breadcrumbs and original CreativeWork records; the software project uses SoftwareSourceCode. Project information still comes only from `app/portfolio-data.json`.

All headings, project names, descriptions and navigation are rendered as HTML. WebGL is decorative. Missing URLs return HTTP 404 and `noindex`. `/work` redirects to the homepage Work section. Favicons, Apple touch icon and a web app manifest are provided.

## Cloudflare Workers

The existing Next.js App Router source runs through the existing Vinext/Vite Cloudflare adapter. This is a Cloudflare Workers deployment, not a static Pages export. No Node server process, database or new server dependency is required in production.

For a separate Cloudflare account, authenticate Wrangler and use

```sh
npm ci
npm run build
npx wrangler deploy --config dist/server/wrangler.json
```

The generated config bundles the Worker and its static assets. Set your Cloudflare Worker name/domain as needed and update the origin configuration above. Account authentication and a deployment to a separate Cloudflare account have not been performed on your behalf. The existing hosted portfolio uses its original Sites deployment workflow.

## Performance and motion

GSAP and Three.js load dynamically. Gallery code loads on demand. Local WebP images and fonts are retained. WebGL startup is deferred, pixel ratio is capped, mobile particle counts are reduced and animation pauses in hidden tabs. Desktop renders target approximately 60 FPS and the lighter mobile scene targets 30 FPS; actual rates depend on the device. Reduced motion skips WebGL and GSAP entirely, while a visible pause control can stop motion manually. Mouse perspective and magnetic effects are limited to fine pointers on larger screens.

No lab score or field Core Web Vitals result is claimed by this source package. Measure your deployed domain with PageSpeed Insights and Search Console once available.
