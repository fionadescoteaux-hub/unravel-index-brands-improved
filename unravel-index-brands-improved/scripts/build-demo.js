'use strict';

/**
 * Deterministically builds the self-contained walkthrough from the live
 * dashboard, instrument and a checked demonstration payload. The payload is
 * illustrative: ontology fields that have not been source-verified are marked
 * as such instead of being inferred as fact.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dashboardPath = path.join(root, 'public', 'dashboard.html');
const instrumentPath = path.join(root, 'public', 'instrument.js');
const dataPath = path.join(root, 'data', 'marquee-demo.json');
const outPath = path.join(root, 'public', 'marquee-demo.html');

const dashboard = fs.readFileSync(dashboardPath, 'utf8');
const instrument = fs.readFileSync(instrumentPath, 'utf8');
const source = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function id(prefix, ...parts) {
  return `${prefix}-${crypto.createHash('sha256').update(parts.join('|').toLowerCase()).digest('hex').slice(0, 12).toUpperCase()}`;
}

function offerType(type) {
  return ({
    'Licensed product':'Product',
    'Services & experiences':'Experience',
    'Retail & concession':'Retail & concession',
    'Publishing':'Publishing',
    'Media & entertainment':'Media & entertainment',
    'Digital & content':'Digital & content',
  })[type] || 'Product';
}

function operatingModel(type) {
  if (type === 'Retail & concession') return 'Retail / concession';
  if (type === 'Services & experiences') return 'Partner-operated';
  if (type === 'Media & entertainment' || type === 'Digital & content') return 'Media / advertising';
  return 'Licensed';
}

function candidates(row) {
  const scores = row.domainScores || {};
  const min = Math.min(...Object.values(scores).filter(Number.isFinite));
  return Object.keys(scores).filter(k => scores[k] === min);
}

function moveMatches(move, row) {
  return (move.brandId && row.brandId) ? move.brandId === row.brandId : String(move.brand || '').toLowerCase() === String(row.name || '').toLowerCase();
}

function normaliseRow(row, portfolioName, moves) {
  row.brandId = row.brandId || id(row.instrument === 'company' ? 'CO' : 'BR', portfolioName, row.name);
  row.scoringScale = 'unravel';
  row.scoringVersion = 'unravel-score-v1.0-20-100';
  row.constraintCandidates = candidates(row);
  row.constraintTied = row.constraintCandidates.length > 1 ? row.constraintCandidates : null;
  row.context = row.context || {};
  row.context.ontologyVersion = 'unravel-brand-ontology-v1.0';
  row.context.canonicalName = row.name;
  if (row.instrument === 'brand') {
    // Audit-populated registry facts in the source data are preserved; the
    // honest defaults apply only where nothing was supplied.
    row.context.portfolioStatus = row.context.portfolioStatus || 'Unable to verify';
    row.context.relationshipToPortfolio = row.context.relationshipToPortfolio || 'Other';
    row.context.primaryTerritories = row.context.primaryTerritories || 'Not supplied — illustrative demo';
    row.context.registrySource = row.context.registrySource || 'Illustrative demonstration payload';
    row.context.registrySourceUrl = row.context.registrySourceUrl || '';
    row.context.registryVerificationStatus = row.context.registryVerificationStatus || 'Requires verification';
    row.context.registryVerifiedAt = row.context.registryVerifiedAt || '';
  }
  row.context.lines = (row.context.lines || []).map(line => ({
    ...line,
    lineId: line.lineId || id('LN', row.brandId, line.name),
    offeringType: line.offeringType || offerType(line.type),
    operatingModel: line.operatingModel || operatingModel(line.type),
    commercialStatus: line.commercialStatus || 'Unable to verify',
    territory: line.territory || 'Not supplied — illustrative demo',
    partner: line.partner || '',
    channel: line.channel || '',
    sourceLabel: line.sourceLabel || 'Illustrative demonstration payload',
    sourceUrl: line.sourceUrl || '',
    verificationStatus: line.verificationStatus || 'Requires verification',
    verifiedAt: line.verifiedAt || '',
  }));
  const idsByName = new Map(row.context.lines.map(l => [l.name, l.lineId]));
  row.constraintLineIds = (row.constraintLines || []).map(n => idsByName.get(n)).filter(Boolean);
  row.constraintPlacements = row.constraintPlacements || {};
  row.constraintPlacementIds = row.constraintPlacementIds || {};
  if ((row.constraintLines || []).length && !row.constraintPlacements[row.constraintKey]) {
    row.constraintPlacements[row.constraintKey] = row.constraintLines.slice();
    row.constraintPlacementIds[row.constraintKey] = row.constraintLineIds.slice();
  }
  // Assessment timeline, oldest first. The demo payload carries at most one
  // prior cycle, so the timeline is derived; a live account returns every cycle.
  row.history = row.history || (row.previous ? [
    { submittedAt:row.previous.submittedAt, overall:row.previous.overall, band:row.previous.band,
      constraintKey:row.previous.constraintKey, constraintName:row.previous.constraintName,
      constraintScore:row.previous.constraintScore, cycle:'Baseline' },
    { submittedAt:row.submittedAt, overall:row.overall, band:row.band, constraintKey:row.constraintKey,
      constraintName:row.constraintName, constraintScore:row.constraintScore, cycle:row.cycle||'Cycle 2' },
  ] : [ { submittedAt:row.submittedAt, overall:row.overall, band:row.band, constraintKey:row.constraintKey,
      constraintName:row.constraintName, constraintScore:row.constraintScore, cycle:row.cycle||'Baseline' } ]);
  const sole = row.constraintCandidates.length === 1 ? row.constraintCandidates[0] : '';
  const placed = sole ? (row.constraintPlacements[sole] || []) : [];
  const affectedSubjects = sole && row.instrument === 'company' ? (row.constraintPortfolioSubjects || []) : [];
  const action = sole ? moves.find(m => moveMatches(m, row) && m.domainKey === sole && m.status !== 'Dropped') : null;
  const actionable = !!(action && action.owner && action.horizon && action.metric);
  const material = placed.length > 0 || affectedSubjects.length > 0;
  const validated = !!(material && actionable && action && action.outcomeStatus === 'Supported' && action.outcomeEvidence);
  row.constraintStatus = validated ? 'validated' : (material && actionable ? 'priority' : 'candidate');
  row.constraintTests = { material, actionable, validated, affectedLines:placed, affectedSubjects };
  return row;
}

function summarise(rows) {
  const keys = ['strategy','model','economics','market','gtm','operations','finance','governance','systems'];
  const tally = Object.fromEntries(keys.map(k => [k, 0]));
  let heldTotal=0, ambiguousCount=0, reassessed=0, movement=0;
  rows.forEach(row => {
    if ((row.constraintCandidates || []).length > 1) ambiguousCount++;
    else if (tally[row.constraintKey] !== undefined) tally[row.constraintKey]++;
    heldTotal += Number(row.heldCount) || 0;
    if (row.previous) { reassessed++; movement += row.overall - row.previous.overall; }
  });
  const max = Math.max(0, ...Object.values(tally));
  const top = keys.filter(k => max && tally[k] === max);
  return {
    count:rows.length,
    meanIndex:rows.length ? Math.round(rows.reduce((t,r) => t + r.overall, 0) / rows.length) : null,
    constraintTally:tally,
    mostCommonConstraint:top.length ? top : null,
    mostCommonCount:max,
    heldTotal,
    ambiguousCount,
    reassessed,
    meanMovement:reassessed ? Math.round(movement / reassessed * 10) / 10 : null,
    aggregateReliable:rows.length >= 20,
  };
}

function normalisePayload(input) {
  const data = JSON.parse(JSON.stringify(input));
  data.moves = (data.moves || []).map(move => ({
    ...move,
    brandId:move.brandId || '',
    due:move.due || '',
    progress:Array.isArray(move.progress) ? move.progress : [],
    workingNote:move.workingNote || move.note || '',
    outcomeStatus:move.outcomeStatus || 'Not tested',
    outcomeEvidence:move.outcomeEvidence || '',
    outcomeUpdatedAt:move.outcomeUpdatedAt || '',
  }));
  const portfolioName = data.partnerName || 'Illustrative portfolio';
  data.brands = (data.brands || []).map(row => normaliseRow(row, portfolioName, data.moves));
  data.company = (data.company || []).map(row => normaliseRow(row, portfolioName, data.moves));
  data.moves.forEach(move => {
    const row = data.brands.concat(data.company).find(r => String(r.name).toLowerCase() === String(move.brand).toLowerCase());
    if (row) move.brandId = row.brandId;
  });
  data.company.forEach(row => {
    const sole=(row.constraintCandidates||[]).length===1?row.constraintCandidates[0]:'';
    row.constraintPortfolioSubjects=sole ? data.brands.filter(b => Number((b.domainScores||{})[sole]) < 60).map(b => b.brandId) : [];
  });
  // Re-evaluate states now that moves carry stable brand IDs.
  data.brands = data.brands.map(row => normaliseRow(row, portfolioName, data.moves));
  data.company = data.company.map(row => normaliseRow(row, portfolioName, data.moves));
  const cuts = data.lineCuts || {};
  data.brands.forEach(row => {
    const group=cuts[row.name]||cuts[row.brandId];
    if (!group) return;
    Object.values(group).forEach(cut => {
      const line=(row.context.lines||[]).find(l=>l.name===cut.lineName)||{};
      const values=Object.values(cut.reads||{}).filter(Number.isFinite), low=values.length?Math.min(...values):null;
      cut.weakestCandidates=low===null?[]:Object.keys(cut.reads||{}).filter(k=>cut.reads[k]===low);
      Object.assign(cut,{
        lineId:line.lineId||cut.lineId||'', offeringType:line.offeringType||'', operatingModel:line.operatingModel||'',
        commercialStatus:line.commercialStatus||'', territory:line.territory||'', partner:line.partner||'', channel:line.channel||'',
        sourceLabel:line.sourceLabel||'', sourceUrl:line.sourceUrl||'', verificationStatus:line.verificationStatus||'', verifiedAt:line.verifiedAt||'',
      });
    });
    if (!cuts[row.brandId]) cuts[row.brandId]=group;
  });
  /* Commercial components: registry-mapped offerings beneath the assessed
     commercial lines. IDs are stored in the SOURCE data and never derived
     from names — a renamed display label must not change an identity. Each
     linked component must reference a real stored line ID. */
  data.components = (data.components || []).map(cp => {
    if (!cp.componentId) throw new Error(`component "${cp.name}" has no stored componentId — IDs live in data/marquee-demo.json, never generated at build`);
    if (!cp.brandId) throw new Error(`component ${cp.componentId} has no brandId`);
    return { ...cp, commercialLineId: cp.commercialLineId || null, includedInAssessment: cp.includedInAssessment === true };
  });
  const compIds = data.components.map(cp => cp.componentId);
  if (new Set(compIds).size !== compIds.length) throw new Error('duplicate componentId in data.components');
  const knownLineIds = new Set(data.brands.flatMap(b => (b.context.lines || []).map(l => l.lineId)));
  const knownBrandIds = new Set(data.brands.map(b => b.brandId));
  data.components.forEach(cp => {
    if (!knownBrandIds.has(cp.brandId)) throw new Error(`component ${cp.componentId} references unknown brandId ${cp.brandId}`);
    if (cp.commercialLineId && !knownLineIds.has(cp.commercialLineId)) throw new Error(`component ${cp.componentId} references unknown commercialLineId ${cp.commercialLineId}`);
    if (cp.includedInAssessment && !cp.commercialLineId) throw new Error(`component ${cp.componentId} is includedInAssessment but has no commercialLineId`);
  });
  data.summary = summarise(data.brands);
  data.companySummary = summarise(data.company);
  data.portfolioBrandCount = data.portfolioBrandCount || null;
  data.readOnly = true;
  data.dataWarnings = data.dataWarnings || [{code:'illustrative-ontology',message:'Brand relationships, territories and commercial-line ontology require primary-source verification.'}];
  data.methodVersions = ['unravel-v1.0-licensing|unravel-score-v1.0-20-100|unravel-brand-ontology-v1.0'];
  return data;
}

const payload = normalisePayload(source);
const sourceHash = crypto.createHash('sha256').update(dashboard).update(instrument).update(JSON.stringify(payload)).digest('hex').slice(0, 16);
const meta = {
  generatedFrom:'dashboard.html',
  embedded:['instrument.js','data/marquee-demo.json (get-portfolio shape)'],
  sourceHash,
  instrumentBytes:Buffer.byteLength(instrument),
  brands:payload.brands.length,
  company:payload.company.length,
  moves:payload.moves.length,
  components:(payload.components||[]).length,
  note:'Static walkthrough. No API calls or credentials; remote fonts and brand images may load.',
};

const marker = '<script src="instrument.js"></script>';
if (!dashboard.includes(marker)) throw new Error('dashboard no longer contains the instrument marker');
let built = dashboard.replace(marker,
  '<!-- __bundler: generated by scripts/build-demo.js. Do not hand-edit this file. -->\n'
  + `<script>/* __bundler */ window.__bundler = ${JSON.stringify(meta)};</script>\n`
  + `<script>window.__DEMO_PAYLOAD__ = ${JSON.stringify(payload)};</script>\n`
  + `<script>/* instrument.js — inlined */\n${instrument}\n</script>`);

const close = '\n})();\n</script>';
if (!built.includes(close)) throw new Error('dashboard bootstrap marker changed');
built = built.replace(close,
  '\n  /* Walkthrough mode: use the embedded API-shaped payload. */\n'
  + '  if (window.__DEMO_PAYLOAD__) {\n'
  + '    DATA=window.__DEMO_PAYLOAD__; CREDS=null;\n'
  + "    $('gate').hidden=true; $('app').hidden=false; render();\n"
  + '  }\n' + close);

if (process.argv.includes('--check')) {
  const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
  if (current !== built) {
    console.error('public/marquee-demo.html is stale. Run npm run build:demo.');
    process.exit(1);
  }
  console.log(`Walkthrough is current (${sourceHash}).`);
} else {
  fs.writeFileSync(outPath, built);
  console.log(`Built public/marquee-demo.html (${payload.brands.length} brands, ${sourceHash}).`);
}
