import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import worker from '../dist/server/index.js';

const path = '/work/ui-ux-design/techtrend';
const readJson = async file => JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8'));
const { screens, cover } = await readJson('../app/lib/techtrend-screens.json');
const content = await readJson('../app/lib/techtrend-content.json');
const config = await readJson('../app/lib/site-config.json');
const projects = await readJson('../app/portfolio-data.json');
const env = { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const render = route => worker.fetch(new Request(`https://preview.example${route}`, { headers: { accept: 'text/html' } }), env, ctx);
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&#39;', "'").replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const normalize = value => value.replace(/\s+/g, ' ').trim();
const labels = ['Loading', 'Welcome', 'Login', 'Login Success', 'Password Reset', 'Signup', 'Signup Form', 'Google Login', 'Facebook Login', 'Apple Login', 'Home', 'Search', 'Categories', 'QR Scanner', 'Notifications', 'Messages', 'Account', 'Settings', 'Cart', 'Checkout', 'Payment Loading', 'Payment Success', 'Order Confirmation and Status', 'Order Cancellation', 'Order Tracking', 'Product Screen 01', 'Product Screen 02', 'Earphones and Headphones'];

test('TechTrend renders all 28 original screens and the full case study before JavaScript', async () => {
  const response = await render(path);
  assert.equal(response.status, 200);
  const html = decode(await response.text());
  const semantic = html.replace(/<script\b[^>]*>.*?<\/script>/gs, '').replace(/<style\b[^>]*>.*?<\/style>/gs, '');
  const text = normalize(semantic.replace(/<[^>]+>/g, ' '));
  const figures = [...semantic.matchAll(/<figure\b[^>]*data-case-screen="([^"]+)"/g)].map(match => match[1]);
  assert.equal(figures.length, 28);
  assert.equal(new Set(figures).size, 28);
  assert.deepEqual([...figures].sort(), screens.map(screen => screen.id).sort());
  assert.deepEqual(screens.map(screen => screen.label), labels);
  assert.equal((semantic.match(/<h1[ >]/g) ?? []).length, 1);
  for (const screen of screens) {
    assert.ok(semantic.includes(`href="${screen.src}"`), screen.label);
    assert.ok(semantic.includes(`alt="TechTrend ${screen.label} mobile interface, original UI design"`), screen.label);
    assert.ok(text.includes(screen.label));
  }
  assert.ok(text.includes(content.subtitle));
  assert.ok(text.includes(normalize(projects.find(project => project.id === 'project-01').description)));
  for (const section of content.sections) {
    for (const paragraph of [...section.paragraphs, ...section.after]) assert.ok(text.includes(normalize(paragraph)), paragraph.slice(0, 70));
    for (const item of section.items) {
      assert.ok(text.includes(item.title), item.title);
      assert.ok(text.includes(normalize(item.description)), item.title);
    }
  }
  assert.equal(content.featureGroups.flatMap(group => group.items).length, 18);
  for (const group of content.featureGroups) {
    assert.ok(text.includes(group.title));
    for (const item of group.items) {
      assert.ok(text.includes(item.title));
      assert.ok(text.includes(normalize(item.description)), item.title);
    }
  }
  assert.ok(semantic.includes(`src="${content.videoEmbed}"`));
  assert.ok(semantic.includes(`src="${content.figmaEmbed}"`));
  assert.ok(semantic.includes('href="https://www.youtube.com/watch?v=mfne3iy8b4Q"'));
  assert.ok(semantic.includes('href="https://www.figma.com/design/qOxPxrN0djjVSwvBCW0I1j/Protltypes-Of-TechTrend-70793?node-id=0-1"'));
  for (const iframe of semantic.match(/<iframe\b[^>]*>/g) ?? []) {
    assert.match(iframe, /title="[^"]+"/);
    assert.match(iframe, /loading="lazy"/);
  }
});

test('all 29 TechTrend image files match the original repository Git blobs and packaged assets', async () => {
  for (const asset of [...screens, cover]) {
    const original = await readFile(new URL(`../public${asset.src}`, import.meta.url));
    const built = await readFile(new URL(`../dist/client${asset.src}`, import.meta.url));
    const blobHash = createHash('sha1').update(`blob ${original.length}\0`).update(original).digest('hex');
    assert.equal(blobHash, asset.sha, asset.original);
    assert.deepEqual(built, original, asset.src);
    assert.equal(original.subarray(0, 2).toString('hex'), 'ffd8', asset.src);
  }
});

test('the case study is linked from its category and preserves legacy URL access', async () => {
  const category = await render('/work/ui-ux-design');
  const html = await category.text();
  assert.equal((html.match(/href="\/work\/ui-ux-design\/techtrend"/g) ?? []).length, 2);
  const legacy = await render('/ecommerce-app.html');
  assert.equal(legacy.status, 308);
  assert.equal(new URL(legacy.headers.get('location'), 'https://preview.example').pathname, path);
  const missing = await render('/work/ui-ux-design/missing-project');
  assert.equal(missing.status, 404);
});

test('TechTrend has its own canonical metadata and connected CreativeWork and breadcrumbs', async () => {
  const html = await (await render(path)).text();
  assert.ok(html.includes('<title>TechTrend E-commerce App UI UX Case Study | Rakindu Fernando</title>'));
  assert.ok(html.includes(`rel="canonical" href="${config.url + path}"`));
  assert.ok(html.includes(`property="og:url" content="${config.url + path}"`));
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  const graph = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(match => JSON.parse(match[1])['@graph']);
  const work = graph.find(item => item['@type'] === 'CreativeWork');
  assert.equal(work.identifier, 'project-01');
  assert.equal(work.description, projects.find(project => project.id === 'project-01').description);
  assert.equal(work.image.length, 28);
  assert.deepEqual(graph.find(item => item['@type'] === 'BreadcrumbList').itemListElement.map(item => item.item), ['/', '/work/ui-ux-design', path].map(route => config.url + route));
});
