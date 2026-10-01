import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const name = 'RAKINDUFERNANDO';
const source = await readFile(new URL('../app/components/HeroName.tsx', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
});
const flush = () => new Promise(setImmediate);

function harness({ reduced = false, paused = false, hidden = false } = {}) {
  const target = (properties = {}) => {
    const listeners = new Map();
    return { ...properties, listeners,
      addEventListener: (event, handler) => listeners.set(event, handler),
      removeEventListener: (event) => listeners.delete(event),
      dispatch: (event) => listeners.get(event)?.(),
    };
  };
  const media = target({ matches: reduced });
  const document = target({ hidden });
  const glyphs = Array.from(name, (textContent) => ({ textContent }));
  const root = { dataset: { nameState: 'resolved' }, querySelectorAll: () => glyphs };
  const refs = [{ current: root }, { current: false }];
  let refIndex = 0;
  let cleanup;
  let currentPaused = paused;
  let imports = 0;
  let contexts = 0;
  let reverts = 0;
  let tween;
  const gsap = {
    context: (callback) => { contexts++; callback(); return { revert: () => { reverts++; } }; },
    fromTo() {},
    to: (progress, options) => { tween = { progress, options }; },
  };
  const modules = {
    react: { useContext: () => currentPaused, useRef: () => refs[refIndex++], useEffect: (effect) => { cleanup = effect(); } },
    'react/jsx-runtime': { jsx: () => null, jsxs: () => null },
    './MotionPreference': { MotionPreference: {} },
    gsap: { __esModule: true, default: gsap },
  };
  const exports = {};
  vm.runInNewContext(outputText, { exports, document, window: { matchMedia: () => media }, require: (id) => {
    assert.ok(id in modules, `Unexpected import ${id}`);
    if (id === 'gsap') imports++;
    return modules[id];
  } });
  const render = () => { refIndex = 0; exports.default(); };
  render();
  return {
    root, media, document, glyphs,
    text: () => glyphs.map((glyph) => glyph.textContent).join(''),
    counts: () => ({ imports, contexts, reverts }),
    cleanup: () => cleanup?.(),
    pause: () => { cleanup?.(); currentPaused = true; render(); },
    resume: () => { cleanup?.(); currentPaused = false; render(); },
    advance: (value) => { assert.ok(tween); tween.progress.value = value; tween.options.onUpdate(); if (value === 1) tween.options.onComplete(); },
  };
}

test('hero name scrambles every position and resolves without a typewriter reveal', async () => {
  const hero = harness();
  assert.equal(hero.text(), name, 'hydration begins with the real name');
  await flush();
  assert.equal(hero.root.dataset.nameState, 'scrambling');
  assert.notEqual(hero.text(), name);
  assert.equal(hero.text().length, name.length);
  hero.advance(0.45);
  assert.equal(hero.glyphs[13].textContent, name[13], 'letters at the end can settle before the beginning');
  assert.notEqual(hero.glyphs[1].textContent, name[1]);
  hero.advance(1);
  assert.equal(hero.text(), name);
  assert.equal(hero.root.dataset.nameState, 'resolved');
  hero.cleanup();
  assert.equal(hero.counts().reverts, 1);
  assert.equal(hero.media.listeners.size + hero.document.listeners.size, 0);
});

for (const preference of [{ reduced: true }, { paused: true }, { hidden: true }]) {
  test(`hero keeps its final name without importing animations when ${Object.keys(preference)[0]}`, async () => {
    const hero = harness(preference);
    await flush();
    assert.equal(hero.text(), name);
    assert.equal(hero.root.dataset.nameState, 'resolved');
    assert.equal(hero.counts().imports, 0);
    assert.equal(hero.media.listeners.size + hero.document.listeners.size, 0);
  });
}

test('hero cancels a pending animation import on unmount', async () => {
  const hero = harness();
  hero.cleanup();
  await flush();
  assert.equal(hero.counts().contexts, 0);
  assert.equal(hero.text(), name);
  assert.equal(hero.media.listeners.size + hero.document.listeners.size, 0);
});

test('hero settles immediately when reduced motion is enabled mid-animation', async () => {
  const hero = harness();
  await flush();
  hero.media.matches = true;
  hero.media.dispatch('change');
  assert.equal(hero.text(), name);
  assert.equal(hero.root.dataset.nameState, 'resolved');
  assert.equal(hero.counts().reverts, 1);
  hero.cleanup();
  assert.equal(hero.media.listeners.size + hero.document.listeners.size, 0);
});

test('Pause Motion settles the name and Resume Motion does not replay it', async () => {
  const hero = harness();
  await flush();
  hero.pause();
  assert.equal(hero.text(), name);
  hero.resume();
  await flush();
  assert.equal(hero.counts().contexts, 1);
  assert.equal(hero.counts().reverts, 1);
  assert.equal(hero.media.listeners.size + hero.document.listeners.size, 0);
});
