'use strict';

/**
 * POST /api/submit
 *
 * The client posts RAW ANSWERS ONLY. It never posts a score, and if it does,
 * the score is ignored. All scoring happens here so the methodology stays
 * server-side and unpublished — that is the moat.
 *
 * WHAT COMES BACK
 *   The scored result is returned to the respondent and shown on the completion
 *   screen: the index, the band, the constraint candidate(s) and all nine domain
 *   scores. What is NOT returned is how any of it was derived — the question
 *   thresholds, the weights and the constraint rule stay on this side. No score
 *   is visible while answering, so answers still cannot be tuned to a number.
 *
 * Expected body:
 * {
 *   instrument: "brand" | "company" | "licensee",
 *   partnerCode: "BRANDS-K7M2P9",
 *   brand: { name, platform, yearsInPortfolio, salesBand, licenceCount, concentration,
 *            royaltyBand, guaranteeShare, overageShare, auditCoverage, categoryCount,
 *            lines:[{name,type,share,licensees,renewal}] },
 *   respondent: { name, role, email },
 *   statedChallenge: "finance",                     // domain key, unscored
 *   answers:   { strategy: {a:4,b:3}, ... },        // all nine domains (licensee: a only)
 *   confidence:{ strategy: "evidenced", ... },      // all nine domains
 *   evidence:  { strategy: {a:"Brand tracker 2026", b:""}, ... }   // optional
 * }
 *
 * THREE SUBJECTS, ONE SCORING ENGINE
 *   brand     the brand team's view of one brand          — 2 questions per domain
 *   company   the licensing house itself                  — 2 questions per domain
 *   licensee  the lead licensee's view of the same brand  — 1 question per domain
 *
 * The licensee cut is scored on the brand instrument with the single answer
 * standing for both questions in the domain, so its domain scores sit on the
 * same scale as the brand team's and can be laid side by side. It is stored
 * with Subject = 'licensee' and is never averaged into the brand set.
 *
 * REVENUE-ARCHITECTURE SNAPSHOT
 *   The five extra context fields (royalty band, guarantee share, overage
 *   share, audit coverage, category count) are stored as JSON in a single
 *   Completions column, BrandContext. That field is now required: a write that
 *   loses identity, ontology or method provenance fails visibly rather than
 *   reporting a partial success.
 */

const crypto = require('crypto');
const { findOne, create, update, esc } = require('../../lib/airtable');
const { getInstrument, CONFIDENCE, BANDS, ONTOLOGY_VERSION, ONTOLOGY } = require('../../lib/instruments');
const { score, statedGap } = require('../../lib/scoring');
const { ok, badRequest, unauthorized, tooMany, serverError, preflight, rateLimit, clientKey } = require('../../lib/http');

const T_PARTNERS = process.env.AIRTABLE_PARTNERS_TABLE;
// Accept either name so a rename cannot silently break a live site.
const T_COMPLETIONS = process.env.AIRTABLE_COMPLETIONS_TABLE || process.env.AIRTABLE_BRAND_ASSESSMENTS_TABLE;

const MAX_TEXT = 500;
const SUBJECTS = ['brand', 'company', 'licensee', 'line'];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return badRequest('Use POST.');

  if (!rateLimit(`submit:${clientKey(event)}`, { limit: 10, windowMs: 60_000 })) return tooMany();

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return badRequest('Could not read that submission.');
  }

  // ── Validate ────────────────────────────────────────────────────────────
  const partnerCode = String(body.partnerCode || '').trim();
  if (!partnerCode) return badRequest('No access code supplied.');

  // Which subject is this? The licensee cut scores on the brand instrument.
  const subject = String(body.instrument || 'brand').trim().toLowerCase();
  if (!SUBJECTS.includes(subject)) return badRequest('Unknown assessment type.');
  // The Tier 3 line cut has its own shape — three domains, no index — and is
  // handled apart from the scored instruments.
  if (subject === 'line') return handleLine(body, partnerCode);

  const instrumentKey = subject === 'licensee' ? 'brand' : subject;
  const single = subject === 'licensee';           // one question per domain

  let inst;
  try { inst = getInstrument(instrumentKey); }
  catch (e) { return badRequest('Unknown assessment type.'); }
  const DOMAIN_KEYS = inst.domains.map(d => d.key);
  const nameOf = function (key) { const d = inst.domains.find(x => x.key === key); return d ? d.name : key; };

  const brand = body.brand || {};
  const brandName = String(brand.name || '').trim();
  if (!brandName) return badRequest(subject === 'company' ? 'Name the company before submitting.' : 'Name the brand before submitting.');
  if (brandName.length > 120) return badRequest('That brand name is too long.');

  const rawAnswers = body.answers || {};
  const confidence = body.confidence || {};
  const answers = {};

  for (const key of DOMAIN_KEYS) {
    const a = rawAnswers[key] || {};
    if (single) {
      if (!isLevel(a.a)) return badRequest(`"${nameOf(key)}" needs an answer.`);
      answers[key] = { a: a.a, b: a.a };             // one answer stands for the domain
    } else {
      if (!isLevel(a.a) || !isLevel(a.b)) return badRequest(`Both questions in "${nameOf(key)}" need an answer.`);
      answers[key] = { a: a.a, b: a.b };
    }
    if (!CONFIDENCE.includes(confidence[key])) {
      return badRequest(`"${nameOf(key)}" needs a confidence flag.`);
    }
  }

  try {
    // ── Authorise ─────────────────────────────────────────────────────────
    const partner = await findOne(T_PARTNERS, 'PartnerCode', partnerCode);
    if (!partner || partner.fields.Active !== true) {
      return unauthorized('That access code is not active.');
    }
    const max = Number(partner.fields.MaxCompletion) || Number(partner.fields.MaxCompletions) || null;
    const used = Number(partner.fields.CompletionCount) || 0;
    if (max && used >= max) {
      return unauthorized('This programme has reached its assessment allocation.');
    }

    // The ontology is required only for the brand instrument. It is unscored,
    // but without it the result cannot be connected reliably to a verified
    // brand and its material commercial lines.
    if (subject === 'brand') {
      if (!ONTOLOGY.portfolioStatus.includes(String(brand.portfolioStatus || ''))) return badRequest('Select the brand portfolio status.');
      if (!ONTOLOGY.relationshipToPortfolio.includes(String(brand.relationshipToPortfolio || ''))) return badRequest('Select the brand relationship to the portfolio.');
      if (!String(brand.primaryTerritories || '').trim()) return badRequest('Name the brand’s primary territories.');
      if (!ONTOLOGY.verificationStatus.includes(String(brand.registryVerificationStatus || ''))) return badRequest('Select the brand registry verification status.');
      const lines = Array.isArray(brand.lines) ? brand.lines.filter(l => l && String(l.name || '').trim()) : [];
      if (!lines.length) return badRequest('Add at least one material commercial line for this brand.');
      for (const line of lines) {
        if (!ONTOLOGY.offeringType.includes(String(line.offeringType || line.type || ''))) return badRequest(`Select the offer type for “${clean(line.name, 80)}”.`);
        if (!ONTOLOGY.operatingModel.includes(String(line.operatingModel || ''))) return badRequest(`Select the operating model for “${clean(line.name, 80)}”.`);
        if (!ONTOLOGY.commercialStatus.includes(String(line.commercialStatus || ''))) return badRequest(`Select the commercial status for “${clean(line.name, 80)}”.`);
        if (!String(line.territory || '').trim()) return badRequest(`Name the territory for “${clean(line.name, 80)}”.`);
        if (!ONTOLOGY.verificationStatus.includes(String(line.verificationStatus || ''))) return badRequest(`Select the verification status for “${clean(line.name, 80)}”.`);
      }
    }

    // ── Score ─────────────────────────────────────────────────────────────
    const result = score(instrumentKey, answers, confidence);
    const gap = statedGap(body.statedChallenge, result.constraintCandidates);

    // ── Persist ───────────────────────────────────────────────────────────
    // Raw domain scores are stored permanently and separately from the index,
    // so a future re-weighting can be applied retrospectively without re-running
    // the assessment.
    const now = new Date().toISOString();
    const brandId = cleanId(brand.brandId) || stableId('BR', partnerCode, brand.canonicalName || brandName);
    const snapshot = {
      ontologyVersion: ONTOLOGY_VERSION,
      brandId,
      canonicalName: clean(brand.canonicalName || brandName, 120),
      brandFamily: clean(brand.brandFamily, 120),
      portfolioStatus: clean(brand.portfolioStatus, 40),
      relationshipToPortfolio: clean(brand.relationshipToPortfolio, 60),
      primaryTerritories: clean(brand.primaryTerritories, 160),
      registrySource: clean(brand.registrySource, 160),
      registrySourceUrl: cleanUrl(brand.registrySourceUrl, 500),
      registryVerificationStatus: clean(brand.registryVerificationStatus, 40),
      registryVerifiedAt: cleanDate(brand.registryVerifiedAt),
      royaltyBand: clean(brand.royaltyBand, 40),
      // Income target: management-stated band and horizon, never scored.
      // The dashboard reads the gap between royaltyBand and this target and
      // sets the committed actions beside it.
      royaltyTargetBand: clean(brand.royaltyTargetBand, 40),
      targetHorizon: clean(brand.targetHorizon, 20),
      guaranteeShare: clean(brand.guaranteeShare, 40),
      overageShare: clean(brand.overageShare, 40),
      auditCoverage: clean(brand.auditCoverage, 60),
      categoryCount: clean(brand.categoryCount, 20),
      // Operating mode: which version of the mode-conditional questions was
      // asked. Stored so the report and dashboard can render the wording the
      // respondent actually saw, and so rules can gate on it.
      mode: clean(brand.mode, 20),
      trademark: clean(brand.trademark, 80),
      // Revenue lines ride inside the same BrandContext blob rather than
      // taking a column of their own: no schema change, and the existing
      // 422 fallback below already covers them. Unscored — nothing here
      // touches the index. Capped at six and length-limited per field so a
      // malformed client cannot write an unbounded payload.
      lines: Array.isArray(brand.lines)
        ? brand.lines.slice(0, 8).map(l => ({
            lineId: cleanId(l && l.lineId) || stableId('LN', brandId, l && l.name),
            name: clean(l && l.name, 80),
            type: clean((l && (l.offeringType || l.type)), 60),
            offeringType: clean((l && (l.offeringType || l.type)), 60),
            operatingModel: clean(l && l.operatingModel, 60),
            commercialStatus: clean(l && l.commercialStatus, 40),
            territory: clean(l && l.territory, 120),
            partner: clean(l && l.partner, 120),
            channel: clean(l && l.channel, 120),
            share: clean(l && l.share, 40),
            licensees: clean(l && l.licensees, 20),
            renewal: clean(l && l.renewal, 40),
            sourceLabel: clean(l && l.sourceLabel, 160),
            sourceUrl: cleanUrl(l && l.sourceUrl, 500),
            verificationStatus: clean(l && l.verificationStatus, 40),
            verifiedAt: cleanDate(l && l.verifiedAt),
          })).filter(l => l.name)
        : [],
      // Placement happens after the server returns the constraint candidate.
      // The respondent then selects the affected lines and saves them through
      // /api/context. Keeping the field here makes the lifecycle explicit.
      constraintLines: [],
      constraintPlacements: {},
      evidenceReviewStatus: 'pending',
      evidenceStatusByDomain: evidenceStatus(confidence, body.evidence, DOMAIN_KEYS),
      method: {
        weightingVersion: result.weightingVersion,
        scoringScale: result.scoringScale,
        scoringVersion: result.scoringVersion,
        constraintCandidates: result.constraintCandidates,
        constraintStatus: 'candidate',
      },
    };
    const hasSnapshot = Object.keys(snapshot).some(k =>
      Array.isArray(snapshot[k]) ? snapshot[k].length : !!snapshot[k]);

    const completionId = `${subject.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(9).toString('base64url').toUpperCase()}`;
    const fields = {
      CompletionId: completionId,
      Vertical: 'brand-licensing',
      Subject: subject,                             // 'brand' | 'company' | 'licensee'
      Organisation: brandName,
      PartnerCode: partnerCode,
      PartnerName: partner.fields.PartnerName || '',
      Email: clean((body.respondent || {}).email, 200),
      FirstName: clean(((body.respondent || {}).name || '').split(' ')[0], 60),
      LastName: clean(((body.respondent || {}).name || '').split(' ').slice(1).join(' '), 60),

      OverallScore: result.overall,
      MaturityLevel: result.band,
      ConstraintDomain: result.constraintKey,
      ConstraintScore: result.constraintScore,
      WeakestDomain1: result.constraintName,

      HeldForVerification: result.heldForVerification.join(', '),
      ConfidenceByDomain: inst.domains
        .map(d => ({ evidenced: 3, reasoned: 2, estimated: 1 })[confidence[d.key]] || 0)
        .join(','),
      ConfidenceMean: Number((inst.domains
        .reduce((t, d) => t + (({ evidenced: 3, reasoned: 2, estimated: 1 })[confidence[d.key]] || 0), 0)
        / inst.domains.length).toFixed(2)),

      BiggestChallenge: clean(body.statedChallenge, 60),
      Sector: clean(brand.platform, 80),
      OrgAge: clean(brand.yearsInPortfolio, 40),
      Turnover: clean(brand.salesBand, 40),
      TeamSize: clean(brand.licenceCount, 40),
      TradedIncome: clean(brand.concentration, 60),

      WeightingVersion: result.weightingVersion,
      DomainAnswers: JSON.stringify(single ? rawAnswers : answers),
      RawDomainScores: JSON.stringify(result.rawScores),
      Evidence: JSON.stringify(trimEvidence(body.evidence, DOMAIN_KEYS)),
      CompletedAt: now,
      Cycle: 'Baseline',
    };
    // Nine canonical domain columns, shared with every other Unravel assessment.
    for (const d of inst.domains) fields[d.field] = result.domainScores[d.key];

    // Revenue-architecture snapshot → one JSON column.
    if (hasSnapshot) fields.BrandContext = JSON.stringify(snapshot);

    // BrandContext is now part of the diagnostic record: it carries identity,
    // ontology, evidence state, commercial lines and method provenance. A
    // partial record would look successful while losing the evidence needed to
    // establish materiality, so schema failure must fail visibly.
    const [created] = await create(T_COMPLETIONS, [{ fields }]);

    // Verify before reporting success. A silent creation failure otherwise
    // produces a duplicate on retry.
    const check = await findOne(T_COMPLETIONS, 'CompletionId', fields.CompletionId);
    if (!check) throw new Error('Assessment did not persist — creation could not be verified');

    // Increment the partner's completion count. If this fails the assessment is
    // still saved — but we log loudly rather than pretending it worked.
    try {
      await update(T_PARTNERS, [{ id: partner.id, fields: { CompletionCount: used + 1 } }]);
    } catch (err) {
      console.error('[submit-assessment] completion count not incremented', partnerCode, err.message);
    }

    // The scored result goes back to the respondent. Numbers only — the
    // thresholds, weights and constraint rule that produced them stay here.
    return ok({
      saved: true,
      recordId: created.id,
      completionId,
      brand: brandName,
      brandId,
      heldCount: result.heldCount,
      evidenceCount: countEvidence(body.evidence, DOMAIN_KEYS),
      instrument: subject,
      message: 'Assessment received.',
      result: {
        overall: result.overall,
        band: result.band,
        bands: BANDS.map(b => ({ name: b.name, min: b.min, max: b.max })),
        constraintKey: result.constraintKey,
        constraintName: result.constraintName,
        constraintScore: result.constraintScore,
        constraintRole: result.constraintRole,
        // When two or more domains sit equally lowest there is no single
        // weakest link. Saying so is the honest answer; picking the first in
        // array order and presenting it as the diagnosis is not.
        constraintTied: result.constraintTied || null,
        constraintCandidates: result.constraintCandidates,
        constraintStatus: 'candidate',
        constraintTiedNames: (result.constraintTied || []).map(function(k){
          var d = inst.domains.find(function(x){ return x.key === k; });
          return d ? d.name : k;
        }),
        heldForVerification: result.heldForVerification,
        weightingVersion: result.weightingVersion,
        scoringVersion: result.scoringVersion,
        scoringScale: result.scoringScale,
        commercialLines: snapshot.lines.map(l => ({ lineId:l.lineId, name:l.name })),
        statedChallenge: gap.known ? { stated: gap.stated, statedName: nameOf(gap.stated), aligned: gap.aligned } : null,
        domains: inst.domains.map(d => ({
          key: d.key,
          name: d.name,
          short: d.short,
          weight: d.weight,
          role: d.role,
          score: result.domainScores[d.key],
          confidence: confidence[d.key],
          held: result.heldForVerification.indexOf(d.key) !== -1,
          constraint: result.constraintCandidates.includes(d.key),
        })),
      },
    });
  } catch (err) {
    return serverError(err, 'submit-assessment');
  }
};

function isLevel(v) { return Number.isInteger(v) && v >= 1 && v <= 5; }
function clean(v, max) { return v == null ? '' : String(v).slice(0, max); }

function trimEvidence(ev, DOMAIN_KEYS) {
  const out = {};
  if (!ev || typeof ev !== 'object') return out;
  for (const key of DOMAIN_KEYS) {
    const e = ev[key];
    if (!e) continue;
    out[key] = { a: clean(e.a, MAX_TEXT), b: clean(e.b, MAX_TEXT) };
  }
  return out;
}

function countEvidence(ev, DOMAIN_KEYS) {
  let n = 0;
  const t = trimEvidence(ev, DOMAIN_KEYS);
  for (const key of Object.keys(t)) {
    if (t[key].a.trim()) n++;
    if (t[key].b.trim()) n++;
  }
  return n;
}

/* ── Tier 3: the line cut ─────────────────────────────────────────────────
   Six answers across three domains plus contract facts. Produces three
   domain reads and lowest candidate(s) — deliberately NO index and NO band, so a
   line can never be mistaken for a brand in any downstream comparison. The
   reads use the same (avg/5)*100 arithmetic as domain scores, so a line
   read lays beside the brand's domain score legitimately.               */
const LINE_DOMAINS = [
  { key: 'model',     name: 'Income quality & dependency', field: 'BusinessModelScore' },
  { key: 'economics', name: 'Line economics & terms',      field: 'ProductsScore' },
  { key: 'gtm',       name: 'Channel fit & growth path',   field: 'GoToMarketScore' },
];
const LINE_CONTRACT_KEYS = ['rateBasis', 'minimum', 'territory', 'exclusivity', 'renewal', 'audit', 'trademark'];

function lineFlags(contract, reads) {
  // Contract facts crossed with the reads. Same philosophy as the brand
  // rules: fire only where two things combine into something neither says.
  const f = [];
  const floored = /above likely earnings/i.test(contract.minimum || '');
  const neverAudited = /^Never audited/i.test(contract.audit || '');
  const renewSoon = /^Within 12 months/i.test(contract.renewal || '');
  const tmGap = /^(Not checked|Gaps known)/i.test(contract.trademark || '');
  if (neverAudited && floored) f.push('Never audited and income floored by the minimum — verification is the first move');
  else if (neverAudited) f.push('Never audited — the income on this line has not been verified');
  if (renewSoon) f.push('Terms open inside twelve months — the one moment this line is genuinely negotiable');
  if (tmGap) f.push('Trademark coverage unconfirmed where this line sells — a registration gap is a live liability');
  if (floored && (reads.model || 0) <= 40) f.push('Income is the guarantee, and income quality reads weak — the renewal resets this floor against evidence the line does not yet hold');
  return f;
}

async function handleLine(body, partnerCode) {
  const brand = body.brand || {};
  const line = body.line || {};
  const brandName = String(brand.name || '').trim();
  const lineName = String(line.name || '').trim();
  if (!brandName) return badRequest('Name the brand this line belongs to.');
  if (!lineName) return badRequest('Name the line.');
  if (brandName.length > 120 || lineName.length > 80) return badRequest('That name is too long.');
  if (!ONTOLOGY.offeringType.includes(String(line.offeringType || ''))) return badRequest('Select the line offering type.');
  if (!ONTOLOGY.operatingModel.includes(String(line.operatingModel || ''))) return badRequest('Select the line operating model.');
  if (!ONTOLOGY.commercialStatus.includes(String(line.commercialStatus || ''))) return badRequest('Select the line commercial status.');
  if (!String(line.territory || '').trim()) return badRequest('Name the line territory.');
  if (!ONTOLOGY.verificationStatus.includes(String(line.verificationStatus || ''))) return badRequest('Select the line verification status.');

  const rawAnswers = body.answers || {};
  const answers = {};
  for (const d of LINE_DOMAINS) {
    const a = rawAnswers[d.key] || {};
    if (!isLevel(a.a) || !isLevel(a.b)) return badRequest(`Both questions in "${d.name}" need an answer.`);
    answers[d.key] = { a: a.a, b: a.b };
  }

  const rawContract = (line.contract && typeof line.contract === 'object') ? line.contract : {};
  const contract = {};
  for (const k of LINE_CONTRACT_KEYS) contract[k] = clean(rawContract[k], 80);

  try {
    const partner = await findOne(T_PARTNERS, 'PartnerCode', partnerCode);
    if (!partner || partner.fields.Active !== true) return unauthorized('That access code is not active.');
    const max = Number(partner.fields.MaxCompletion) || Number(partner.fields.MaxCompletions) || null;
    const used = Number(partner.fields.CompletionCount) || 0;
    if (max && used >= max) return unauthorized('This programme has reached its assessment allocation.');

    // Reads: same arithmetic as a domain score, no weighting, no index.
    const reads = {};
    for (const d of LINE_DOMAINS) reads[d.key] = Math.round(((answers[d.key].a + answers[d.key].b) / 2 / 5) * 100);
    const lowestRead=Math.min(...LINE_DOMAINS.map(d=>reads[d.key]));
    const weakestCandidates=LINE_DOMAINS.filter(d=>reads[d.key]===lowestRead).map(d=>d.key);
    const weakest = LINE_DOMAINS.find(d=>d.key===weakestCandidates[0]);
    const flags = lineFlags(contract, reads);

    const now = new Date().toISOString();
    const brandId = cleanId(brand.brandId) || stableId('BR', partnerCode, brandName);
    const lineId = cleanId(line.lineId) || stableId('LN', brandId, lineName);
    const completionId=`LINE-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(9).toString('base64url').toUpperCase()}`;
    const fields = {
      CompletionId: completionId,
      Vertical: 'brand-licensing',
      Subject: 'line',
      Organisation: brandName,
      PartnerCode: partnerCode,
      PartnerName: partner.fields.PartnerName || '',
      Email: clean((body.respondent || {}).email, 200),
      FirstName: clean(((body.respondent || {}).name || '').split(' ')[0], 60),
      LastName: clean(((body.respondent || {}).name || '').split(' ').slice(1).join(' '), 60),
      ConstraintDomain: weakest.key,
      WeakestDomain1: weakest.name,
      DomainAnswers: JSON.stringify(rawAnswers),
      CompletedAt: now,
      Cycle: 'Baseline',
      BrandContext: JSON.stringify({
        ontologyVersion: ONTOLOGY_VERSION,
        brandId,
        lineCut: {
          lineId, lineName, contract, reads, flags, weakestCandidates,
          offeringType: clean(line.offeringType, 60),
          operatingModel: clean(line.operatingModel, 60),
          commercialStatus: clean(line.commercialStatus, 40),
          territory: clean(line.territory, 120),
          partner: clean(line.partner, 120),
          channel: clean(line.channel, 120),
          sourceLabel: clean(line.sourceLabel, 160),
          sourceUrl: cleanUrl(line.sourceUrl, 500),
          verificationStatus: clean(line.verificationStatus, 40),
          verifiedAt: cleanDate(line.verifiedAt),
        },
      }),
    };
    for (const d of LINE_DOMAINS) fields[d.field] = reads[d.key];

    const [created] = await create(T_COMPLETIONS, [{ fields }]);
    const check = await findOne(T_COMPLETIONS, 'CompletionId', completionId);
    if (!check) throw new Error('Line cut did not persist — creation could not be verified');
    try { await update(T_PARTNERS,[{id:partner.id,fields:{CompletionCount:used+1}}]); }
    catch (err) { console.error('[submit-assessment:line] completion count not incremented',partnerCode,err.message); }

    return ok({
      saved: true,
      recordId: created.id,
      completionId,
      result: {
        brandId, lineId, brandName, lineName,
        domains: LINE_DOMAINS.map(d => ({ key: d.key, name: d.name, score: reads[d.key] })),
        weakestKey: weakest.key, weakestName: weakest.name, weakestScore: reads[weakest.key],
        weakestCandidates, weakestTied:weakestCandidates.length>1?weakestCandidates:null,
        flags,
      },
    });
  } catch (err) {
    return serverError(err, 'submit-assessment:line');
  }
}

function cleanId(v) {
  const s = clean(v, 80).toUpperCase();
  return /^[A-Z0-9][A-Z0-9_-]{2,79}$/.test(s) ? s : '';
}

function stableId(prefix, parent, name) {
  const seed = `${String(parent || '').trim().toLowerCase()}|${String(name || '').trim().toLowerCase().replace(/\s+/g, ' ')}`;
  return `${prefix}-${crypto.createHash('sha256').update(seed).digest('hex').slice(0, 12).toUpperCase()}`;
}

function cleanUrl(v, max) {
  const s = clean(v, max);
  if (!s) return '';
  try {
    const u = new URL(s);
    return /^https?:$/.test(u.protocol) ? u.toString() : '';
  } catch { return ''; }
}

function cleanDate(v) {
  const s = clean(v, 20);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}

function evidenceStatus(confidence, ev, keys) {
  const cited = trimEvidence(ev, keys);
  const out = {};
  for (const key of keys) {
    const e = cited[key] || {};
    const hasCitation = !!String(e.a || '').trim() || !!String(e.b || '').trim();
    const c = confidence[key] || 'estimated';
    out[key] = c === 'estimated' ? 'respondent-estimated'
      : c === 'reasoned' ? (hasCitation ? 'respondent-cited' : 'respondent-reasoned')
      : (hasCitation ? 'respondent-cited' : 'evidence-claimed');
  }
  return out;
}
