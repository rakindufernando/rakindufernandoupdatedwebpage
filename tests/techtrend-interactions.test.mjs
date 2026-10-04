import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const data = JSON.parse(await readFile(new URL('../app/lib/techtrend-screens.json', import.meta.url), 'utf8'));
const source = await readFile(new URL('../app/components/techtrend/TechTrendExperience.tsx', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } });

function harness(hash = '#screens') {
  let selected = null;
  let mounted = false;
  let pointer = 0;
  const entries = [{ hash, state: { preservedRouterState: true } }];
  const events = new Map();
  const cleanups = [];
  const location = { hash, pathname: '/work/ui-ux-design/techtrend', search: '' };
  const apply = () => { location.hash = entries[pointer].hash; events.get('popstate')?.(); };
  const history = {
    get state() { return entries[pointer].state; },
    pushState(state, _title, url) { entries.splice(pointer + 1); entries.push({ state, hash: new URL(url, 'https://preview.example').hash }); pointer++; location.hash = entries[pointer].hash; },
    replaceState(state, _title, url) { entries[pointer] = { state, hash: new URL(url, 'https://preview.example').hash }; location.hash = entries[pointer].hash; },
    back() { if (pointer > 0) pointer--; apply(); },
    forward() { if (pointer < entries.length - 1) pointer++; apply(); },
  };
  const jsx = (type, props) => ({ type, props });
  const modules = {
    react: { useRef: () => ({ current: null }), useContext: () => true, useState: () => [selected, value => { selected = value; }], useEffect: effect => { if (!mounted) cleanups.push(effect()); } },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    '../MotionPreference': { MotionPreference: {} },
    '../../lib/techtrend-screens.json': data,
  };
  const exports = {};
  vm.runInNewContext(outputText, { exports, window: { location, history, addEventListener: (name, effect) => events.set(name, effect), removeEventListener: name => events.delete(name) }, require: name => { assert.ok(name in modules, name); return modules[name]; } });
  const render = () => { const result = exports.default({ children: null }); mounted = true; return result; };
  return { render, history, location, entries, events, get selected() { return selected; }, dispose() { cleanups.forEach(cleanup => cleanup?.()); } };
}

test('all 28 screens share one viewer history entry and browser back and forward restore it', () => {
  const app = harness();
  const root = app.render();
  let prevented = false;
  let focused = false;
  const link = { dataset: { screenOpen: 'screen-04' }, focus: () => { focused = true; } };
  const event = { button: 0, target: { closest: () => link }, preventDefault: () => { prevented = true; } };
  root.props.onClick({ ...event, ctrlKey: true });
  assert.equal(prevented, false, 'modified clicks must retain the original image link');
  assert.equal(app.entries.length, 1);
  root.props.onClick(event);
  assert.ok(prevented && focused);
  assert.equal(app.selected, 3);
  assert.equal(app.history.state.preservedRouterState, true);
  for (let index = 0; index < 28; index++) {
    app.render().props.children[1].props.select(index);
    assert.equal(app.selected, index);
    assert.equal(app.location.hash, `#${data.screens[index].id}`);
  }
  assert.equal(app.entries.length, 2, 'moving through screens must not flood browser history');
  app.history.back();
  assert.equal(app.selected, null);
  assert.equal(app.location.hash, '#screens');
  app.history.forward();
  assert.equal(app.selected, 27);
  app.render().props.children[1].props.close();
  assert.equal(app.selected, null);
  assert.equal(app.location.hash, '#screens');
  app.dispose();
  assert.equal(app.events.size, 0);
});

test('a direct screen URL opens and closes without leaving the case study', () => {
  const app = harness('#screen-18');
  app.render();
  assert.equal(app.selected, 17);
  app.render().props.children[1].props.close();
  assert.equal(app.selected, null);
  assert.equal(app.location.hash, '');
  assert.equal(app.location.pathname, '/work/ui-ux-design/techtrend');
  assert.equal(app.entries.length, 1);
  app.dispose();
});
