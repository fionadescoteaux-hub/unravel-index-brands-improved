'use strict';

/**
 * Brand-page (five-tab) rendering tests. The dashboard script is executed in
 * a stubbed DOM; the renderers exposed on window.__renderers are then driven
 * with fixture rows covering ties, missing data and the three constraint
 * states. No external dependencies.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function element() {
  const el = {
    style:{}, dataset:{}, hidden:false, innerHTML:'', textContent:'', value:'',
    classList:{ add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    setAttribute(){}, getAttribute(){ return null; }, removeAttribute(){},
    addEventListener(){}, removeEventListener(){}, focus(){}, click(){},
    appendChild(){}, closest(){ return null; }, scrollIntoView(){},
    querySelector(){ return null; }, querySelectorAll(){ return []; },
  };
  return el;
}

function loadRenderers() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'dashboard.html'), 'utf8');
  const instrument = fs.readFileSync(path.join(__dirname, '..', 'public', 'instrument.js'), 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const main = scripts.sort((a, b) => b.length - a.length)[0];
  const doc = {
    getElementById(){ return element(); },
    querySelector(){ return element(); },
    querySelectorAll(){ return []; },
    addEventListener(){}, body: element(), documentElement: element(),
    createElement(){ return element(); },
  };
  const win = {
    document: doc, addEventListener(){}, removeEventListener(){},
    location:{ search:'', reload(){} }, history:{ replaceState(){} },
    matchMedia(){ return { matches:false, addEventListener(){}, addListener(){} }; },
    scrollTo(){}, print(){}, setTimeout, clearTimeout, navigator:{ clipboard:{} },
    localStorage:{ getItem(){ return null; }, setItem(){}, removeItem(){} },
  };
  win.window = win;
  const ctx = vm.createContext(Object.assign(Object.create(null), {
    window: win, document: doc, navigator: win.navigator, location: win.location,
    localStorage: win.localStorage, setTimeout, clearTimeout, console,
    URLSearchParams, fetch: () => new Promise(() => {}), FileReader: function(){},
  }));
  vm.runInContext(instrument, ctx, { filename: 'instrument.js' });
  vm.runInContext(main, ctx, { filename: 'dashboard-inline.js' });
  assert.ok(win.__renderers, 'window.__renderers is exposed');
  return win.__renderers;
}

function fixture(over) {
  const domains = { strategy:60, model:60, economics:60, market:60, gtm:60, operations:60, finance:60, governance:40, systems:60 };
  return Object.assign({
    id:'t1', brandId:'BR-TEST00000001', instrument:'brand', name:'Test Brand', platform:'Luxury',
    overall:58, band:'Emerging', constraintKey:'governance', constraintName:'Governance & Decision-Making',
    constraintScore:40, heldCount:0, heldForVerification:[], statedChallenge:'', statedGapAligned:false,
    weightingVersion:'unravel-v1.0-licensing', scoringVersion:'unravel-score-v1.0-20-100',
    submittedAt:'2026-08-01T10:00:00.000Z', cycle:'Baseline', imageUrl:'', domainScores:Object.assign({}, domains),
    assessments:1, previous:null,
    context:{ lines:[], salesBand:'$50–150M' }, constraintLines:[], constraintCandidates:['governance'],
    constraintTied:null, constraintStatus:'candidate',
    constraintTests:{ material:false, actionable:false, validated:false, affectedLines:[], affectedSubjects:[] },
    questionLevels:{},
  }, over || {});
}

const R = loadRenderers();

function withData(rows, moves, fn) {
  R.setData({ brands: rows, company: [], licensee: [], moves: moves || [], lineCuts: {}, summary: { count: rows.length }, readOnly: true });
  try { return fn(); } finally { R.setData({ brands: [], company: [], licensee: [], moves: [], lineCuts: {}, summary: {} }); }
}

test('five tabs render with Executive Audit as the default', () => {
  const b = fixture();
  withData([b], [], () => {
    const html = R.detailHTML(b, false);
    for (const t of ['exec', 'map', 'evidence', 'actions', 'history']) {
      assert.ok(html.includes('data-tab="' + t + '"'), 'tab ' + t + ' present');
      assert.ok(html.includes('data-tp="' + t + '"'), 'panel ' + t + ' present');
    }
    assert.ok(/data-tab="exec"[^>]*/.test(html), 'exec tab exists');
    assert.match(html, /id="tab-exec-[^"]+" aria-controls="panel-exec-[^"]+" aria-selected="true"/, 'exec selected by default');
    assert.ok(html.includes('role="tablist"') && html.includes('role="tabpanel"'), 'accessible tab markup');
    const hiddenCount = (html.match(/role="tabpanel"[^>]*hidden/g) || []).length;
    assert.strictEqual(hiddenCount, 4, 'only the default panel is visible');
  });
});

test('tied candidates are preserved — no auto-selected intervention', () => {
  const b = fixture({
    domainScores:{ strategy:60, model:40, economics:60, market:60, gtm:60, operations:60, finance:60, governance:40, systems:60 },
    constraintCandidates:['model','governance'], constraintTied:['model','governance'],
  });
  withData([b], [], () => {
    const html = R.executiveAuditHTML(b, false);
    assert.ok(/tied/i.test(html), 'tie is named');
    assert.ok(html.includes('Business Model &amp; Revenue Mix') && html.includes('Governance &amp; Decision-Making'), 'both candidates named');
    const actions = R.brandActionsHTML(b, false);
    assert.ok(/no intervention is auto-selected/i.test(actions) || /No intervention is auto-selected/.test(actions), 'no auto-selected move');
  });
});

test('no commercial lines produces an honest empty state, not fabrication', () => {
  const b = fixture();
  withData([b], [], () => {
    const html = R.commercialMapHTML(b, false);
    assert.ok(/No commercial lines captured/i.test(html), 'empty state present');
    assert.ok(!html.includes('mapped component'), 'no invented counts');
  });
});

test('single assessment shows a history empty state; reassessment shows movement', () => {
  const single = fixture();
  withData([single], [], () => {
    assert.ok(/baseline/i.test(R.brandHistoryHTML(single, false)), 'baseline empty state');
  });
  const re = fixture({
    previous:{ overall:52, band:'Emerging', constraintKey:'governance', constraintName:'Governance & Decision-Making', constraintScore:30, submittedAt:'2026-02-01T10:00:00.000Z' },
    assessments:2, cycle:'Cycle 2',
  });
  withData([re], [], () => {
    const html = R.brandHistoryHTML(re, false);
    assert.ok(html.includes('52') && html.includes('58'), 'both index readings shown');
    assert.ok(/not by itself proof|causal/i.test(html), 'no causal overclaim');
  });
});

test('candidate, priority and validated states carry distinct badges and explanations', () => {
  const mk = (status, tests) => fixture({ constraintStatus: status, constraintTests: tests });
  const cand = mk('candidate', { material:false, actionable:false, validated:false, affectedLines:[], affectedSubjects:[] });
  const prio = mk('priority',  { material:true,  actionable:true,  validated:false, affectedLines:['Line A'], affectedSubjects:[] });
  const val  = mk('validated', { material:true,  actionable:true,  validated:true,  affectedLines:['Line A'], affectedSubjects:[] });
  withData([cand], [], () => {
    assert.ok(R.brandDetailShellHTML(cand, false).includes('sbadge candidate'), 'candidate badge');
    assert.ok(/candidate/i.test(R.brandEvidenceHTML(cand, false)), 'candidate explained');
  });
  withData([prio], [], () => {
    assert.ok(R.brandDetailShellHTML(prio, false).includes('sbadge priority'), 'priority badge');
  });
  withData([val], [], () => {
    assert.ok(R.brandDetailShellHTML(val, false).includes('sbadge validated'), 'validated badge');
    assert.ok(/validated/i.test(R.brandEvidenceHTML(val, false)), 'validated explained');
  });
});

test('severity and evidence confidence are separate, transparent labels', () => {
  const held = fixture({ heldCount:1, heldForVerification:['governance'] });
  const sev = R.severityOf(held), ev = R.evidenceConfidenceOf(held);
  assert.strictEqual(sev.label, 'Significant');
  assert.strictEqual(ev.label, 'Low');
  assert.ok(/judgement/.test(ev.m), 'confidence explains itself');
  assert.ok(/40/.test(sev.m), 'severity cites the score');
});

test('missing question levels are labelled derived, never silently verified', () => {
  const b = fixture({ questionLevels: undefined });
  withData([b], [], () => {
    const html = R.brandEvidenceHTML(b, false);
    assert.ok(/derived from the domain score|Per-question levels were not stored/.test(html), 'derived levels are labelled');
  });
});

/* ── Commercial components and the reference-brand behaviours ── */

function marthaFixture() {
  return fixture({
    brandId:'BR-MARTHA000001', name:'Ref Brand', overall:73, band:'Defined',
    constraintKey:'systems', constraintName:'Systems & Data', constraintScore:50,
    heldCount:1, heldForVerification:['market'],
    domainScores:{ strategy:80, model:70, economics:70, market:90, gtm:80, operations:70, finance:80, governance:60, systems:50 },
    constraintCandidates:['systems'],
    constraintLines:['Cookware & kitchen'],
    constraintTests:{ material:true, actionable:false, validated:false, affectedLines:['Cookware & kitchen'], affectedSubjects:[] },
    context:{ lines:[
      { name:'Cookware & kitchen', lineId:'LN-TEST0001', type:'Licensed product', share:'26–50%', renewal:'1–2 years', verificationStatus:'Supported — reliable secondary source' },
      { name:'Digital & content', lineId:'LN-TEST0002', type:'Licensed product', share:'Under 10% of brand income', renewal:'Over 3 years', verificationStatus:'Requires verification' },
    ], salesBand:'$150–500M' },
  });
}
const testComponents = [
  { componentId:'OFF-9001', brandId:'BR-MARTHA000001', commercialLineId:'LN-TEST0001', name:'Cookware and bakeware', offeringClass:'Product', commercialModel:'Licensed product', routeToMarket:'Retail', commercialStatus:'Current', verificationStatus:'Verified — primary source', includedInAssessment:true, sourceUrl:'https://example.com', sourceAccessedAt:'2026-08-22', unravelNode:'x', coverageExamples:'pots', audience:'cooks', suggestedEvidence:'licence' },
  { componentId:'OFF-9002', brandId:'BR-MARTHA000001', commercialLineId:null, name:'Branded stores', offeringClass:'Retail & concession', commercialModel:'Retail / concession', routeToMarket:'Physical retail', commercialStatus:'Current', verificationStatus:'Supported — reliable secondary source', includedInAssessment:false, sourceUrl:'https://example.com', sourceAccessedAt:'2026-08-22', unravelNode:'x', coverageExamples:'stores', audience:'shoppers', suggestedEvidence:'agreements' },
];
function withFullData(b, moves, cuts, comps, fn) {
  R.setData({ brands:[b], company:[], licensee:[], moves:moves||[], lineCuts:cuts||{}, components:comps||[], summary:{ count:1 }, readOnly:true });
  try { return fn(); } finally { R.setData({ brands:[], company:[], licensee:[], moves:[], lineCuts:{}, components:[], summary:{} }); }
}

test('commercial map nests components under lines and separates the unassessed', () => {
  const b = marthaFixture();
  withFullData(b, [], {}, testComponents, () => {
    const html = R.commercialMapHTML(b, false);
    assert.ok(html.includes('2</b> commercial components mapped'), 'component count in summary');
    assert.ok(html.includes('1</b> linked to assessed lines'), 'linked count');
    assert.ok(html.includes('Cookware and bakeware'), 'nested component rendered');
    assert.ok(html.includes('Additional mapped components — not included in this assessment'), 'unassessed section present');
    assert.ok(html.includes('Branded stores'), 'unassessed component listed');
    assert.ok(html.includes('OFF-9001'), 'stable component ID reachable in expansion');
    assert.ok(/source-backed/.test(html), 'components visibly labelled source-backed');
    assert.ok(/no assessed commercial line responsibly represents/.test(html), 'no forced placement implied');
  });
});

test('a snapshot-versus-cut renewal conflict is surfaced, never silently resolved', () => {
  const b = marthaFixture();
  const cuts = { 'Ref Brand': { 'Cookware & kitchen': { lineName:'Cookware & kitchen', reads:{ model:40 }, weakestKey:'model', contract:{ renewal:'Within 12 months' }, flags:[] } } };
  withFullData(b, [], cuts, [], () => {
    const map = R.commercialMapHTML(b, false);
    assert.ok(/Renewal information conflicts/.test(map), 'conflict shown on the map');
    assert.ok(map.includes('1–2 years') && map.includes('Within 12 months'), 'both dates shown');
    const exec = R.executiveAuditHTML(b, false);
    assert.ok(/reconcile the conflicting/.test(exec), 'conclusion asks for reconciliation');
    assert.ok(/Renewal information conflicts/.test(R.brandEvidenceHTML(b, false)), 'conflict on the Evidence tab');
  });
});

test('a committed move on another domain never advances the candidate', () => {
  const b = marthaFixture();
  const moves = [{ id:'m1', subject:'brand', brand:'Ref Brand', brandId:'BR-MARTHA000001', domainKey:'model', move:'Commission a royalty audit on the cookware licensee', owner:'Finance', horizon:'Findings within a quarter', metric:'Variance list and tracked recoveries', status:'Committed' }];
  withFullData(b, moves, {}, [], () => {
    const exec = R.executiveAuditHTML(b, false);
    assert.ok(/No intervention has yet been committed against <b>Systems/.test(exec), 'mismatch stated in the conclusion');
    const actions = R.brandActionsHTML(b, false);
    assert.ok(/intervention not yet committed/.test(actions), 'candidate shown uncommitted first');
    assert.ok(/does not advance this candidate|not against the/.test(actions), 'other action clearly separated');
    const evid = R.brandEvidenceHTML(b, false);
    assert.ok(/does not make this candidate actionable/.test(evid), 'actionability test stays open');
  });
});

test('baseline-only history is honest: snapshot, no fabricated second cycle', () => {
  const b = marthaFixture();
  withFullData(b, [], {}, [], () => {
    const html = R.brandHistoryHTML(b, false);
    assert.ok(/One assessment on record — the baseline/.test(html), 'baseline framing');
    assert.ok(/initial candidate/.test(html), 'initial candidate marked');
    assert.ok(/Current verification gaps/.test(html), 'gaps listed');
    assert.ok(!/Movement since the previous assessment/.test(html), 'no fabricated movement');
  });
});
