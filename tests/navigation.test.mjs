import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import worker from '../dist/server/index.js';

const paths = ['/', ...['ui-ux-design', 'software-development', 'graphic-design', 'videography', 'photography'].map(slug => `/work/${slug}`)];
const env = { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const render = path => worker.fetch(new Request(`https://portfolio.example${path}`, { headers: { accept: 'text/html' } }), env, ctx);

test('every rendered internal link reaches a page, real anchor or packaged asset', async () => {
  const pages = new Map();
  for (const path of paths) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    pages.set(path, await response.text());
  }
  let checked = 0;
  for (const [path, html] of pages) {
    for (const [, attributes, href] of html.matchAll(/<a\b([^>]*?)href="([^"]*)"[^>]*>/g)) {
      checked++;
      assert.ok(href && href !== '#', `Empty link on ${path}`);
      if (/^(https:|mailto:|tel:)/.test(href)) continue;
      assert.ok(!/javascript:/i.test(href));
      const url = new URL(href, `https://portfolio.example${path}`);
      if (pages.has(url.pathname)) {
        if (url.hash) assert.ok(pages.get(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path} -> ${href}`);
      } else {
        assert.ok((await stat(new URL(`../dist/client${url.pathname}`, import.meta.url))).isFile(), `${path} -> ${href}`);
      }
      assert.ok(!/disabled/.test(attributes));
    }
    for (const tag of html.match(/<a\b[^>]*>/g) ?? []) {
      if (tag.includes('target="_blank"')) {
        assert.match(tag, /rel="[^"]*noopener/);
        assert.match(tag, /rel="[^"]*noreferrer/);
      }
    }
  }
  assert.ok(checked >= 90);
});

test('Work shortcut redirects to the existing homepage anchor', async () => {
  const response = await render('/work');
  assert.ok([301, 302, 307, 308].includes(response.status));
  assert.equal(new URL(response.headers.get('location'), 'https://portfolio.example').href, 'https://portfolio.example/#work');
});

test('the production resume and every gallery image retain their original bytes', async () => {
  const projects = JSON.parse(await readFile(new URL('../app/portfolio-data.json', import.meta.url), 'utf8'));
  const assets = new Set(['/Rakindu-Fernando-Resume.pdf', ...projects.flatMap(project => project.images)]);
  for (const asset of assets) {
    const original = await readFile(new URL(`../public${asset}`, import.meta.url));
    const built = await readFile(new URL(`../dist/client${asset}`, import.meta.url));
    assert.deepEqual(built, original, asset);
  }
  const pdf = await readFile(new URL('../dist/client/Rakindu-Fernando-Resume.pdf', import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
});
