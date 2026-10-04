import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

async function loadComponent(path, globals, modules) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } });
  const exports = {};
  vm.runInNewContext(outputText, { ...globals, exports, require: (name) => {
    assert.ok(name in modules, `Unexpected import during reduced motion: ${name}`);
    return modules[name];
  } });
  return exports;
}

test('reduced motion never initializes or imports the Three.js renderer', async () => {
  let cleanup;
  let fallback = false;
  const events = new Set();
  const canvas = { classList: { add: () => { fallback = true; }, remove() {} }, addEventListener: (name) => events.add(name), removeEventListener: (name) => events.delete(name) };
  const motion = { matches: true, addEventListener: (name) => events.add(name), removeEventListener: (name) => events.delete(name) };
  const { default: Scene } = await loadComponent('../app/components/Scene.tsx', { window: { matchMedia: () => motion } }, {
    react: { useRef: () => ({ current: canvas }), useEffect: (effect) => { cleanup = effect(); } },
    'react/jsx-runtime': { jsx: () => null },
  });
  Scene();
  await new Promise(setImmediate);
  assert.equal(fallback, true);
  cleanup();
  assert.equal(events.size, 0);
});

test('reduced motion creates no GSAP tweens or ScrollTriggers and cleans up', async () => {
  let cleanup;
  let reverted = false;
  let reducedBranch = false;
  const gsap = {
    registerPlugin() {},
    matchMedia: () => ({ add: (_queries, effect) => { reducedBranch = true; effect({ conditions: { reduced: true, desktop: true, fine: true } }); }, revert: () => { reverted = true; } }),
    from: () => assert.fail('Animation must not run'),
    to: () => assert.fail('Animation must not run'),
    fromTo: () => assert.fail('Animation must not run'),
  };
  const { usePortfolioMotion } = await loadComponent('../app/components/usePortfolioMotion.ts', {}, {
    react: { useEffect: (effect) => { cleanup = effect(); } },
    gsap: { __esModule: true, default: gsap },
    'gsap/ScrollTrigger': { ScrollTrigger: {} },
  });
  usePortfolioMotion({ current: {} });
  await new Promise(setImmediate);
  assert.equal(reducedBranch, true);
  cleanup();
  assert.equal(reverted, true);
});

for (const paused of [false, true]) {
  test(`TechTrend ${paused ? 'Pause motion' : 'reduced motion'} skips GSAP imports and removes history listeners`, async () => {
    const cleanups = [];
    const events = new Set();
    const imports = [];
    const source = await readFile(new URL('../app/components/techtrend/TechTrendExperience.tsx', import.meta.url), 'utf8');
    const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } });
    const modules = {
      react: { useRef: () => ({ current: {} }), useState: () => [null, () => {}], useContext: () => paused, useEffect: effect => cleanups.push(effect()) },
      'react/jsx-runtime': { jsx: () => null, jsxs: () => null },
      '../MotionPreference': { MotionPreference: {} },
      '../../lib/techtrend-screens.json': { screens: [{ id: 'screen-01' }] },
    };
    const exports = {};
    vm.runInNewContext(outputText, {
      exports,
      window: { location: { hash: '' }, matchMedia: () => ({ matches: true }), addEventListener: name => events.add(name), removeEventListener: name => events.delete(name) },
      cancelAnimationFrame() {},
      require: name => { imports.push(name); assert.ok(name in modules, name); return modules[name]; },
    });
    exports.default({ children: null });
    await new Promise(setImmediate);
    assert.ok(!imports.some(name => name.startsWith('gsap')));
    assert.equal(events.size, 2);
    for (const cleanup of cleanups) cleanup?.();
    assert.equal(events.size, 0);
  });
}
