'use strict';

/**
 * POST /api/portfolio   { partnerCode, password }
 *
 * AUTHENTICATION IS MANDATORY AND THE METHOD IS POST BY DESIGN.
 *
 * On the purpose-led build this endpoint was originally a GET that served named
 * individual results to anyone holding the partner code. That was a privacy
 * breach and it is a non-negotiable boundary here: the partner code alone gets
 * you nothing. Code plus dashboard password, or 401.
 *
 * POST is used so credentials never land in a URL, a browser history, a referrer
 * header or a Netlify access log.
 *
 * WHAT THE DASHBOARD RECEIVES (and why)
 *   Each subject (brand or company) is returned ONCE — its most recent
 *   assessment — with the previous assessment's headline figures attached as
 *   `previous` so the dashboard can show movement since baseline. Without this,
 *   a re-run brand would appear as two tiles and inflate every count.
 *
 *   The context the respondent supplied about the brand (retail-sales band,
 *   licence count, concentration, years in portfolio) is returned as well.
 *   These are unscored, but a portfolio owner reads an index movement very
 *   differently on a large brand than on a small one, and an income
 *   concentration figure is the nearest thing the instrument holds to a
 *   revenue-at-risk flag. They are self-reported bands and are labelled as such.
 */

const { findOne, list, esc } = require('../../lib/airtable');
const { verifySecret } = require('../../lib/auth');
const { applyConstraintState } = require('../../lib/constraints');
const T_MOVES = process.env.AIRTABLE_MOVES_TABLE || 'Moves';
const { INSTRUMENTS, getInstrument, bandFor } = require('../../lib/instruments');
const { ok, badRequest, unauthorized, tooMany, serverError, preflight, rateLimit, clientKey } = require('../../lib/http');

const T_PARTNERS = process.env.AIRTABLE_PARTNERS_TABLE;
const T_COMPLETIONS = process.env.AIRTABLE_COMPLETIONS_TABLE || process.env.AIRTABLE_BRAND_ASSESSMENTS_TABLE;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return badRequest('Use POST.');

  // Tight limit: this is the endpoint someone would brute-force.
  if (!rateLimit(`portfolio:${clientKey(event)}`, { limit: 8, windowMs: 60_000 })) return tooMany();

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return badRequest('Could not read that request.'); }

  const partnerCode = String(body.partnerCode || '').trim();
  const password = String(body.password || '');
  if (!partnerCode) return unauthorized('Access code is required.');

  try {
    const partner = await findOne(T_PARTNERS, 'PartnerCode', partnerCode);

    // Same response for wrong code and wrong password — do not leak which
    // partner codes exist.
    if (!partner || partner.fields.Active !== true) return unauthorized('Access code or password not recognised.');

    // DEMONSTRATION ACCOUNTS ONLY: a partner explicitly flagged DemoAccount
    // in Airtable opens on the code alone — its data is illustrative and its
    // credentials are printed in the concept note anyway. Every other account
    // keeps the full rule: code plus dashboard password, or 401. The flag
    // lives server-side in the Partners table; nothing client-sent can set it.
    const isDemo = partner.fields.DemoAccount === true;
    if (!isDemo) {
      if (!password) return unauthorized('Access code and password are both required.');
      const expected = partner.fields.DashboardPassword || '';
      if (!verifySecret(password, expected)) {
        return unauthorized('Access code or password not recognised.');
      }
    }

    const records = await list(T_COMPLETIONS, {
      formula: `{PartnerCode} = '${esc(partnerCode)}'`,
    });

    // Field names are the Completions schema — the same columns that hold every
    // purpose-led assessment. Reading anything else returns silent zeros.
    const dataWarnings = [];
    const all = records.map(r => {
      const f = r.fields || {};
      const subject = f.Subject === 'company' ? 'company' : f.Subject === 'licensee' ? 'licensee' : f.Subject === 'line' ? 'line' : 'brand';
      const instKey = subject === 'company' ? 'company' : 'brand';   // licensee scores on the brand instrument
      const inst = getInstrument(instKey);
      let snapshot = {};
      if (f.BrandContext) {
        try { snapshot = JSON.parse(f.BrandContext) || {}; }
        catch { dataWarnings.push({ recordId:r.id, code:'invalid-brand-context', message:'Commercial context could not be read.' }); snapshot = {}; }
      }

      // A line cut intentionally has no nine-domain index. Return only the
      // context needed to group it later; do not manufacture zero scores.
      if (subject === 'line') {
        return {
          id:r.id, completionId:f.CompletionId||'', instrument:'line', name:f.Organisation||'',
          brandId:snapshot.brandId||'', overall:null, band:'',
          constraintKey:f.ConstraintDomain||'', constraintName:f.WeakestDomain1||'', constraintScore:null,
          submittedAt:f.CompletedAt||'', cycle:f.Cycle||'Baseline',
          context:{ lineCut:snapshot.lineCut||null },
        };
      }

      const domainScores = {};
      const missing = [];
      for (const d of inst.domains) {
        const raw = f[d.field], n = Number(raw);
        if (raw === undefined || raw === null || raw === '' || !Number.isFinite(n) || n < 20 || n > 100) missing.push(d.key);
        else domainScores[d.key] = n;
      }

      const overall = Number(f.OverallScore);
      if (!Number.isFinite(overall) || overall < 20 || overall > 100 || missing.length) {
        dataWarnings.push({
          recordId:r.id, completionId:f.CompletionId||'', code:'incomplete-score',
          message:'Assessment excluded because required score fields are missing or outside the 20–100 scale.',
          domains:missing,
        });
        return null;
      }
      const held = String(f.HeldForVerification || '')
        .split(',').map(x => x.trim()).filter(Boolean);
      const constraintKey = f.ConstraintDomain || '';
      const constraintDomain = inst.domains.find(d => d.key === constraintKey);
      const storedCandidates = snapshot.method && Array.isArray(snapshot.method.constraintCandidates)
        ? snapshot.method.constraintCandidates.filter(k => inst.domains.some(d => d.key === k)) : [];
      const fieldCandidates = String(f.ConstraintTied || '').split(',').map(x=>x.trim()).filter(k=>inst.domains.some(d=>d.key===k));
      const constraintCandidates = storedCandidates.length ? storedCandidates : (fieldCandidates.length ? fieldCandidates : (constraintKey ? [constraintKey] : []));

      return {
        id: r.id,
        completionId: f.CompletionId || '',
        brandId: snapshot.brandId || '',
        instrument: subject,
        name: f.Organisation || '',
        platform: f.Sector || '',
        overall,
        band: f.MaturityLevel || bandFor(overall),
        constraintKey,
        constraintName: f.WeakestDomain1 || (constraintDomain ? constraintDomain.name : constraintKey),
        constraintScore: Number.isFinite(Number(f.ConstraintScore))
          ? Number(f.ConstraintScore)
          : (constraintCandidates.length ? Math.min(...constraintCandidates.map(k => domainScores[k]).filter(Number.isFinite)) : null),
        constraintCandidates,
        constraintTied: constraintCandidates.length > 1 ? constraintCandidates : null,
        constraintStatus: 'candidate',
        heldCount: held.length,
        heldForVerification: held,
        statedChallenge: f.BiggestChallenge || '',
        statedGapAligned: constraintCandidates.includes(f.BiggestChallenge),
        weightingVersion: f.WeightingVersion || '',
        scoringScale: (snapshot.method && snapshot.method.scoringScale) || f.ScoringScale || 'unravel',
        scoringVersion: (snapshot.method && snapshot.method.scoringVersion) || f.ScoringVersion || 'legacy-unversioned',
        submittedAt: f.CompletedAt || '',
        cycle: f.Cycle || 'Baseline',
        imageUrl: /^https:\/\//.test(f.BrandImageURL || '') ? f.BrandImageURL : '',
        domainScores,
        // Respondent-supplied context about the brand. Unscored, self-reported
        // bands — stored by submit-assessment in the generic Completions columns.
        context: {
          salesBand: f.Turnover || '',          // retail-sales band
          licenceCount: f.TeamSize || '',       // number of active licences
          concentration: f.TradedIncome || '',  // share of income from the largest licensee / category
          yearsInPortfolio: f.OrgAge || '',
          // Revenue-architecture snapshot (BrandContext JSON column; empty until added)
          royaltyBand: snapshot.royaltyBand || '',
          royaltyTargetBand: snapshot.royaltyTargetBand || '',
          targetHorizon: snapshot.targetHorizon || '',
          guaranteeShare: snapshot.guaranteeShare || '',
          overageShare: snapshot.overageShare || '',
          auditCoverage: snapshot.auditCoverage || '',
          categoryCount: snapshot.categoryCount || '',
          // Revenue lines — how this brand actually earns. Absent on older
          // completions and on company/licensee subjects; always an array so
          // the dashboard never has to null-check before iterating.
          lines: Array.isArray(snapshot.lines) ? snapshot.lines : [],
          mode: snapshot.mode || '',
          trademark: snapshot.trademark || '',
          lineCut: snapshot.lineCut || null,
          ontologyVersion: snapshot.ontologyVersion || '',
          canonicalName: snapshot.canonicalName || f.Organisation || '',
          brandFamily: snapshot.brandFamily || '',
          portfolioStatus: snapshot.portfolioStatus || '',
          relationshipToPortfolio: snapshot.relationshipToPortfolio || '',
          primaryTerritories: snapshot.primaryTerritories || '',
          registrySource: snapshot.registrySource || '',
          registrySourceUrl: snapshot.registrySourceUrl || '',
          registryVerificationStatus: snapshot.registryVerificationStatus || '',
          registryVerifiedAt: snapshot.registryVerifiedAt || '',
        },
        constraintLines: Array.isArray(snapshot.constraintLines) ? snapshot.constraintLines : [],
        constraintPlacements: snapshot.constraintPlacements && typeof snapshot.constraintPlacements==='object' ? snapshot.constraintPlacements : {},
        constraintLineIds: Array.isArray(snapshot.constraintLineIds) ? snapshot.constraintLineIds : [],
        constraintPlacementIds: snapshot.constraintPlacementIds && typeof snapshot.constraintPlacementIds==='object' ? snapshot.constraintPlacementIds : {},
        constraintPlacementStatus: (snapshot.constraintPlacement||{}).status || '',
        evidenceReviewStatus: snapshot.evidenceReviewStatus || 'pending',
        evidenceStatusByDomain: snapshot.evidenceStatusByDomain || {},
        // Numeric answer levels (1–5) per question, per domain — what the
        // improvement steps trace back to. Levels only, never answer text.
        questionLevels: (function () {
          try {
            var qa = JSON.parse(f.DomainAnswers || '{}');
            var out = {};
            Object.keys(qa).forEach(function (k) {
              var v = qa[k] || {};
              var a = Number(v.a), b = Number(v.b);
              if (a >= 1 && a <= 5) out[k] = { a: a, b: (b >= 1 && b <= 5) ? b : a };
            });
            return out;
          } catch (e) { return {}; }
        })(),
        // Deliberately NOT returned: Email, Evidence, and the free-text side
        // of any answer. Free-text evidence often names individuals and
        // internal systems.
      };
    }).filter(Boolean);

    // One row per subject. A brand that has been re-assessed keeps its latest
    // result and carries the previous one as `previous` so movement is visible.
    const brandSet = collapseToLatest(all.filter(b => b.instrument === 'brand'));
    const companySet = collapseToLatest(all.filter(b => b.instrument === 'company'));
    // Licensee perspectives: latest per brand name, returned as a separate set
    // and never averaged into the brand figures.
    const licenseeSet = collapseToLatest(all.filter(b => b.instrument === 'licensee'));

    // Tier 3 line cuts: latest per (brand, line), grouped by brand. The raw
    // rows carry the cut inside the BrandContext blob; everything the
    // dashboard needs is inside it.
    const lineCuts = {};
    all.filter(b => b.instrument === 'line').forEach(b => {
      const cut = (b.context && b.context.lineCut) || null;
      if (!cut || !cut.lineName) return;
      const key = b.brandId || b.name;
      lineCuts[key] = lineCuts[key] || {};
      const prev = lineCuts[key][cut.lineName];
      if (!prev || (b.submittedAt || '') > (prev.submittedAt || '')) {
        lineCuts[key][cut.lineName] = {
          lineId:cut.lineId||'', lineName: cut.lineName, reads: cut.reads || {}, flags: cut.flags || [],
          contract: cut.contract || {}, weakestKey: b.constraintKey || '',
          weakestCandidates:Array.isArray(cut.weakestCandidates)&&cut.weakestCandidates.length?cut.weakestCandidates:(b.constraintKey?[b.constraintKey]:[]),
          submittedAt: b.submittedAt || '',
          offeringType:cut.offeringType||'', operatingModel:cut.operatingModel||'', commercialStatus:cut.commercialStatus||'',
          territory:cut.territory||'', partner:cut.partner||'', channel:cut.channel||'', sourceLabel:cut.sourceLabel||'',
          sourceUrl:cut.sourceUrl||'', verificationStatus:cut.verificationStatus||'', verifiedAt:cut.verifiedAt||'',
        };
      }
    });

    // Committed moves. The table may not exist yet — that is not an error for
    // the dashboard, it simply has no moves to show.
    let moves = [];
    try {
      const mrecs = await list(T_MOVES, { formula: `{PartnerCode} = '${esc(partnerCode)}'` });
      moves = mrecs.map(r => {
        const m = r.fields || {};
        return {
          id: r.id, subject: m.Subject || '', brand: m.Brand || '', brandId:m.BrandID||'', domainKey: m.DomainKey || '',
          move: m.Move || '', owner: m.Owner || '', office: m.Office || '', person: m.Person || '',
          horizon: m.Horizon || '', metric: m.Metric || '',
          status: m.Status || 'Committed', note: m.Note || '',
          baselineScore: Number(m.BaselineScore) || null, baselineIndex: Number(m.BaselineIndex) || null,
          createdAt: m.CreatedAt || '', updatedAt: m.UpdatedAt || '',
          due:m.Due||'', progress:parseJsonArray(m.Progress), workingNote:m.WorkingNote||'',
          outcomeStatus:m.OutcomeStatus||'Not tested', outcomeEvidence:m.OutcomeEvidence||'', outcomeUpdatedAt:m.OutcomeUpdatedAt||'',
        };
      });
    } catch (err) {
      console.error('[get-portfolio] moves not loaded (table missing or unreadable):', err.message);
      dataWarnings.push({ code:'moves-unavailable', message:'Committed moves could not be loaded.' });
    }

    // Commercial components — registry-mapped offerings beneath the assessed
    // lines. Optional: the table may not exist yet (AIRTABLE_COMPONENTS_TABLE
    // unset, or the table absent). Like moves, that is not an error — the
    // dashboard simply shows no component depth until the registry carries it.
    let components = [];
    const T_COMPONENTS = process.env.AIRTABLE_COMPONENTS_TABLE;
    if (T_COMPONENTS) {
      try {
        const crecs = await list(T_COMPONENTS, { formula: `{PartnerCode} = '${esc(partnerCode)}'` });
        components = crecs
          .map(r => {
            const c = r.fields || {};
            return {
              componentId: c.ComponentId || '', brandId: c.BrandId || '',
              commercialLineId: c.CommercialLineId || null, name: c.Name || '',
              offeringClass: c.OfferingClass || '', domain: c.Domain || '',
              coverageExamples: c.CoverageExamples || '', commercialStatus: c.CommercialStatus || '',
              audience: c.Audience || '', commercialModel: c.CommercialModel || '',
              routeToMarket: c.RouteToMarket || '', unravelNode: c.UnravelNode || '',
              suggestedEvidence: c.SuggestedEvidence || '', sourceUrl: c.SourceUrl || '',
              sourceAccessedAt: c.SourceAccessedAt || '', verificationStatus: c.VerificationStatus || '',
              includedInAssessment: c.IncludedInAssessment === true,
            };
          })
          .filter(c => c.componentId && c.brandId); // IDs are stored, never derived — a row without them is not served
      } catch (err) {
        console.error('[get-portfolio] components not loaded (table missing or unreadable):', err.message);
        dataWarnings.push({ code:'components-unavailable', message:'Commercial components could not be loaded.' });
      }
    }

    brandSet.forEach(b => applyConstraintState(b, moves));
    companySet.forEach(c => {
      const sole=(c.constraintCandidates||[]).length===1?c.constraintCandidates[0]:'';
      c.constraintPortfolioSubjects=sole ? brandSet.filter(b => Number((b.domainScores||{})[sole]) < 60).map(b => b.brandId||b.name) : [];
      applyConstraintState(c, moves);
    });

    // Brand and company assessments answer different questions and must never be
    // averaged together. They are returned as separate sets, each summarised
    // against its own instrument.
    return ok({
      partnerName: partner.fields.PartnerName || '',
      badgeLabel: partner.fields.BadgeLabel || '',
      readOnly: isDemo,
      portfolioBrandCount: Number(partner.fields.PortfolioBrandCount) || null,
      vertical: partner.fields.Vertical || 'brand-licensing',
      instruments: INSTRUMENTS,
      domains: getInstrument('brand').domains,   // back-compat for the brand view
      brands: brandSet,
      company: companySet,
      licensee: licenseeSet,
      lineCuts,
      moves,
      components,
      summary: summarise(brandSet, 'brand'),
      companySummary: companySet.length ? summarise(companySet, 'company') : null,
      totalAssessments: records.length,         // every submission, including invalid/superseded cycles
      dataWarnings,
      methodVersions: [...new Set(brandSet.concat(companySet).map(b => `${b.weightingVersion||'legacy-unversioned'}|${b.scoringVersion||'legacy-unversioned'}|${(b.context||{}).ontologyVersion||'legacy-no-ontology'}`))],
    });
  } catch (err) {
    return serverError(err, 'get-portfolio', 'read');
  }
};

/**
 * Group assessments by subject name (case/whitespace-insensitive), keep the most
 * recent as the current row, and attach the one before it as `previous`.
 * `assessments` is the total number of cycles seen for that subject.
 */
function collapseToLatest(rows) {
  const groups = new Map();
  for (const r of rows) {
    const key = r.brandId || String(r.name || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  const out = [];
  for (const list of groups.values()) {
    list.sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)));
    const cur = list[0];
    const prev = list[1] || null;
    cur.assessments = list.length;
    cur.previous = prev ? {
      id: prev.id,
      overall: prev.overall,
      band: prev.band,
      constraintKey: prev.constraintKey,
      constraintName: prev.constraintName,
      constraintScore: prev.constraintScore,
      constraintCandidates: prev.constraintCandidates,
      constraintStatus: prev.constraintStatus,
      submittedAt: prev.submittedAt,
      cycle: prev.cycle,
      domainScores: prev.domainScores,
    } : null;
    // The complete timeline, oldest first — every assessment cycle's headline
    // figures, so History can show more than one step of movement.
    cur.history = list.slice().reverse().map(r => ({
      id: r.id,
      submittedAt: r.submittedAt,
      overall: r.overall,
      band: r.band,
      constraintKey: r.constraintKey,
      constraintName: r.constraintName,
      constraintScore: r.constraintScore,
      constraintCandidates: r.constraintCandidates,
      heldCount: r.heldCount,
      cycle: r.cycle,
    }));
    out.push(cur);
  }
  return out;
}

function summarise(brands, instrumentKey) {
  const inst = getInstrument(instrumentKey || 'brand');
  if (!brands.length) {
    return { count: 0, meanIndex: null, constraintTally: {}, mostCommonConstraint: null, heldTotal: 0, aggregateReliable: false, reassessed: 0, meanMovement: null };
  }
  const tally = {};
  inst.domains.forEach(d => { tally[d.key] = 0; });
  let heldTotal = 0, reassessed = 0, movement = 0, ambiguousCount = 0;
  brands.forEach(b => {
    if ((b.constraintCandidates||[]).length > 1) ambiguousCount++;
    else if (tally[b.constraintKey] !== undefined) tally[b.constraintKey]++;
    heldTotal += b.heldCount;
    if (b.previous) { reassessed++; movement += (b.overall - b.previous.overall); }
  });
  const max = Math.max(...Object.values(tally));
  const top = inst.domains.filter(d => tally[d.key] === max && max > 0).map(d => d.key);

  return {
    count: brands.length,
    meanIndex: Math.round(brands.reduce((s, b) => s + b.overall, 0) / brands.length),
    constraintTally: tally,
    mostCommonConstraint: top.length ? top : null,
    mostCommonCount: max,
    heldTotal,
    ambiguousCount,
    reassessed,
    meanMovement: reassessed ? Math.round((movement / reassessed) * 10) / 10 : null,
    // Aggregate views need a floor before they mean anything. Below 20 the
    // distribution is noise — say so rather than drawing a chart of it.
    aggregateReliable: brands.length >= 20,
  };
}

function parseJsonArray(v) {
  if (Array.isArray(v)) return v;
  try { const x=JSON.parse(v||'[]'); return Array.isArray(x)?x:[]; } catch { return []; }
}
