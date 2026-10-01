import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { default as worker } from '../dist/server/index.js';

const projects = JSON.parse(await readFile(new URL('../app/portfolio-data.json', import.meta.url), 'utf8'));
const categories = [
  ['ui-ux-design', 'UI/UX Design', 'UI UX Design'],
  ['software-development', 'Software Development', 'Software Development'],
  ['graphic-design', 'Graphic Design', 'Graphic Design'],
  ['videography', 'Videography', 'Videography'],
  ['photography', 'Photography', 'Photography'],
];
const env = { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const render = (path) => worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: 'text/html' } }), env, ctx);
const decode = (text) => text.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&#39;', "'").replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>');

test('homepage is a category gateway without individual project entries', async () => {
  const response = await render('/');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<span class="sr-only">RAKINDU FERNANDO<\/span>/, 'the real name is available before JavaScript');
  assert.match(html, /class="hero-name-visual" aria-hidden="true"/, 'scrambled characters are not announced');
  for (const [slug] of categories) assert.ok(html.includes(`href="/work/${slug}"`), slug);
  assert.equal((html.match(/class="category-portal /g) ?? []).length, categories.length);
  assert.doesNotMatch(html, /class="project-grid"|aria-label="Filter projects"|id="project-\d+"/);
  assert.ok(html.replaceAll("<!-- -->", "").includes(`${projects.length} projects`));
});

for (const [slug, value, title] of categories) {
  test(`${slug} renders precisely its own complete collection and metadata`, async () => {
    const response = await render(`/work/${slug}`);
    assert.equal(response.status, 200);
    const html = decode(await response.text());
    const found = [...html.matchAll(/<article[^>]+id="(project-\d+)"/g)].map((match) => match[1]);
    const expected = projects.filter((project) => project.category === value);
    assert.deepEqual(found, expected.map((project) => project.id));
    assert.ok(html.includes(`<title>${title} | Rakindu Fernando</title>`));
    assert.ok(html.includes('name="description"'));
    for (const project of expected) {
      assert.ok(html.includes(project.title), project.title);
      assert.ok(html.includes(project.description), `${project.id} description`);
      assert.ok(html.includes(project.images[0]), `${project.id} image`);
    }
  });
}

test('invalid categories and nonexistent pages return HTTP 404', async () => {
  for (const path of ['/work/invalid-category', '/work/UI-UX-Design', '/missing-page']) {
    const response = await render(path);
    assert.equal(response.status, 404, path);
    assert.ok((await response.text()).includes('Back to Work'));
  }
});

test('all 27 projects retain unique IDs, valid categories and local images', async () => {
  assert.equal(projects.length, 27);
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
  for (const project of projects) {
    assert.ok(categories.some(([,value]) => value === project.category));
    assert.ok(project.images.length > 0);
    assert.equal(project.sourceImages.length, project.images.length);
    for (const image of project.images) await access(resolve('public', `.${image}`));
    if (project.href) assert.equal(new URL(project.href).protocol, 'https:');
  }
});
