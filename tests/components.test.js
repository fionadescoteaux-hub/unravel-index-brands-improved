'use strict';

/**
 * Commercial-component tests — the Martha Stewart reference brand.
 * Three layers: the SOURCE data carries the identities and counts; the
 * GENERATED payload must preserve them; the RENDERERS must present them
 * without letting a committed move on another domain advance the candidate,
 * and without silently resolving the renewal contradiction.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'data', 'marquee-demo.json'), 'utf8'));
const demoHtml = fs.readFileSync(path.join(root, 'public', 'marquee-demo.html'), 'utf8');
const payloadLine = demoHtml.split('\n').find(l => l.includes('window.__DEMO_PAYLOAD__ = '));
const payload = JSON.parse(payloadLine.replace('<script>window.__DEMO_PAYLOAD__ = ', '').replace(/;<\/script>\s*$/, ''));

const MARTHA_BRAND = 'BR-8D018DFF333A';
const MARTHA_LINES = {
  'Cookware & kitchen': 'LN-AECF39C990AC',
  'Home & furniture': 'LN-C6D9340670F5',
  'Publishing & books': 'LN-999A2820BC42',
  'Garden & outdoor': 'LN-0D2505E44AA7',
  'Television & media': 'LN-F2ED44A02EC4',
  'Digital & content': 'LN-6D5C300BA240',
};
const srcMartha = source.brands.find(b => b.name === 'Martha Stewart');
const payMartha = payload.brands.find(b => b.name === 'Martha Stewart');
const comps = source.components.filter(c => c.brandId === MARTHA_BRAND);

test('Martha retains six assessed commercial lines with their stored IDs', () => {
  const lines = srcMartha.context.lines;
  assert.strictEqual(lines.length, 6);
  for (const [name, id] of Object.entries(MARTHA_LINES)) {
    const l = lines.find(x => x.name === name);
    assert.ok(l, name + ' present');
    assert.strictEqual(l.lineId, id, name + ' keeps its stored ID');
  }
});

test('Martha carries exactly 17 mapped components: 13 linked, 4 outside the assessment', () => {
  assert.strictEqual(comps.length, 17);
  const linked = comps.filter(c => c.includedInAssessment);
  const outside = comps.filter(c => !c.includedInAssessment);
  assert.strictEqual(linked.length, 13);
  assert.strictEqual(outside.length, 4);
  linked.forEach(c => assert.ok(Object.values(MARTHA_LINES).includes(c.commercialLineId),
    c.componentId + ' links to a real assessed line'));
  outside.forEach(c => assert.strictEqual(c.commercialLineId, null,
    c.componentId + ' outside the assessment carries no line'));
  assert.deepStrictEqual(outside.map(c => c.componentId).sort(),
    ['OFF-0040', 'OFF-0044', 'OFF-0045', 'OFF-0047']);
});

test('component IDs are stored in source data, unique, and preserved by the build', () => {
  const ids = comps.map(c => c.componentId);
  assert.strictEqual(new Set(ids).size, 17, 'IDs unique');
  ids.forEach(id => assert.match(id, /^OFF-\d{4}$/));
  const payComps = (payload.components || []).filter(c => c.brandId === MARTHA_BRAND);
  assert.strictEqual(payComps.length, 17, 'payload preserves all 17');
  payComps.forEach(pc => {
    const sc = comps.find(c => c.componentId === pc.componentId);
    assert.ok(sc, pc.componentId + ' exists in source — never generated at build');
    assert.strictEqual(pc.commercialLineId, sc.commercialLineId, pc.componentId + ' keeps its linkage');
    assert.strictEqual(pc.name, sc.name);
  });
});

test('a renamed display label would not change an identity — IDs never derive from names', () => {
  // The build refuses components without a stored ID (see build-demo.js), and
  // no ID in the data encodes its display name.
  comps.forEach(c => {
    assert.ok(!c.componentId.toLowerCase().includes(c.name.split(' ')[0].toLowerCase()),
      c.componentId + ' does not encode its name');
  });
  const buildSrc = fs.readFileSync(path.join(root, 'scripts', 'build-demo.js'), 'utf8');
  assert.ok(buildSrc.includes('no stored componentId'), 'build fails on missing stored ID');
});

test('three lines remain affected by Systems & Data; two line cuts remain', () => {
  assert.deepStrictEqual(srcMartha.constraintLines.sort(),
    ['Cookware & kitchen', 'Home & furniture', 'Publishing & books']);
  assert.strictEqual(srcMartha.constraintKey, 'systems');
  const cuts = source.lineCuts['Martha Stewart'];
  assert.strictEqual(Object.keys(cuts).length, 2);
  assert.ok(cuts['Cookware & kitchen'] && cuts['Home & furniture']);
});

test('the Business Model move does not make Systems & Data actionable', () => {
  const moves = payload.moves.filter(m => m.brandId === MARTHA_BRAND && m.status !== 'Dropped');
  assert.ok(moves.length >= 1, 'the royalty-audit move exists');
  assert.ok(moves.every(m => m.domainKey !== 'systems'), 'no committed Systems & Data move');
  assert.strictEqual(payMartha.constraintStatus, 'candidate',
    'a move on another domain never advances the candidate');
  assert.strictEqual(payMartha.constraintTests.actionable, false);
  assert.strictEqual(payMartha.constraintTests.material, true, 'placement on three lines shows materiality');
});

test('the cookware renewal contradiction is present in the data, unresolved', () => {
  const line = srcMartha.context.lines.find(l => l.name === 'Cookware & kitchen');
  const cut = source.lineCuts['Martha Stewart']['Cookware & kitchen'];
  assert.strictEqual(line.renewal, '1–2 years');
  assert.strictEqual(cut.contract.renewal, 'Within 12 months');
  assert.notStrictEqual(line.renewal, cut.contract.renewal, 'neither side silently chosen');
});

test('Martha remains baseline-only and no other brand or line disappeared', () => {
  assert.strictEqual(srcMartha.previous, null);
  assert.strictEqual(srcMartha.cycle, 'Baseline');
  assert.strictEqual(source.brands.length, 19, '19 assessed brands retained');
  const lineCount = source.brands.reduce((t, b) => t + ((b.context || {}).lines || []).length, 0);
  assert.strictEqual(lineCount, 62, '62 commercial lines retained');
  assert.strictEqual(payload.brands.length, 19, 'generated demo matches');
});
