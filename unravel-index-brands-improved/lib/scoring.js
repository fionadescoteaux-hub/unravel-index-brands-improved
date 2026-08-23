'use strict';

const { getInstrument, bandFor, SCORING_VERSION } = require('./instruments');

/**
 * THE SCORING ENGINE IS CANONICAL AND SERVER-SIDE.
 * Clients post raw answers (1–5 per question) plus a confidence flag per domain.
 * Client-posted scores are never trusted or stored.
 *
 * SCORING SCALE:
 *   pct = (avg / 5) * 100 — identical to the canonical Unravel scale, so
 *   brand and company scores sit on one method. It is versioned and cannot be
 *   changed with an environment variable after assessments exist.
 *
 * CONFIDENCE — REPORTED, NEVER APPLIED TO THE SCORE
 *
 * This matches the canonical Unravel Index rule and the ConfidenceByDomain field
 * already in the Completions table: confidence never changes the score.
 *
 * A domain scored 4 or 5 but flagged 'estimated' is recorded in
 * heldForVerification and surfaced in the report as requiring evidence before
 * the score can be relied on. The number itself is untouched.
 *
 * Why not cap it. Capping would silently produce two incompatible scales — a
 * brand assessed with honest low-confidence flags would score lower than an
 * identical brand whose respondent flagged everything as evidenced, and neither
 * would be comparable with the purpose-led completions already held. Low
 * confidence is a prompt for a conversation, not a penalty, and the flag does
 * that job without corrupting the measure.
 */

// Do not allow an environment variable to change the arithmetic while leaving
// the method version untouched. That would mix incompatible scores inside one
// portfolio. A future scale must ship as a new SCORING_VERSION and migration.
const SCALE = 'unravel';
if (process.env.SCORING_SCALE && process.env.SCORING_SCALE.toLowerCase() !== SCALE) {
  throw new Error('SCORING_SCALE is versioned and cannot be changed at runtime. Publish a new scoring version instead.');
}

function pctFromAvg(avg) {
  return (avg / 5) * 100;
}

function isLevel(v) { return Number.isInteger(v) && v >= 1 && v <= 5; }

/**
 * @param {string} instrumentKey  'brand' | 'company'
 * @param {Object} answers        { domainKey: {a:1-5, b:1-5} }
 * @param {Object} confidence     { domainKey: 'evidenced'|'reasoned'|'estimated' }
 */
function score(instrumentKey, answers, confidence) {
  const inst = getInstrument(instrumentKey);
  const domainScores = {}, rawScores = {}, held = [];
  let weighted = 0;

  for (const d of inst.domains) {
    const a = answers[d.key];
    if (!a || !isLevel(a.a) || !isLevel(a.b)) {
      throw new Error(`Missing or invalid answers for domain "${d.key}"`);
    }
    // A high score resting on judgement rather than evidence is flagged, not
    // reduced. The score stands; the report says it needs verifying.
    if (confidence[d.key] === 'estimated' && (a.a > 3 || a.b > 3)) held.push(d.key);

    const pct = pctFromAvg((a.a + a.b) / 2);
    rawScores[d.key] = Math.round(pct);
    domainScores[d.key] = Math.round(pct);
    weighted += pct * (d.weight / 100);
  }

  const overall = Math.round(weighted);

  // The lowest-scoring domain(s) are constraint CANDIDATES. Materiality,
  // actionability and outcome evidence are evaluated downstream before the
  // product is allowed to call one a priority or validated constraint.
  let constraintKey = inst.domains[0].key, lowest = Infinity;
  for (const d of inst.domains) {
    if (domainScores[d.key] < lowest) { lowest = domainScores[d.key]; constraintKey = d.key; }
  }
  const tied = inst.domains.filter(d => domainScores[d.key] === lowest).map(d => d.key);
  const constraint = inst.domains.find(d => d.key === constraintKey);

  return {
    instrument: inst.key,
    instrumentName: inst.name,
    overall,
    band: bandFor(overall),
    domainScores,
    rawScores,          // identical to domainScores under the current rule;
                        // retained so a future rule change stays auditable
    constraintKey,
    constraintName: constraint.name,
    constraintScore: lowest,
    constraintRole: constraint.role,
    constraintTied: tied.length > 1 ? tied : null,
    constraintCandidates: tied,
    constraintStatus: 'candidate',
    heldForVerification: held,
    heldCount: held.length,
    weightingVersion: inst.weightingVersion,
    scoringScale: SCALE,
    scoringVersion: SCORING_VERSION,
  };
}

/**
 * The stated-vs-diagnosed gap. Not a score — a finding. Where the team's own
 * stated challenge differs from the diagnosed constraint, that divergence is
 * usually the most useful line in the report.
 */
function statedGap(statedChallengeKey, constraintKey) {
  if (!statedChallengeKey) return { known: false };
  const diagnosed=Array.isArray(constraintKey)?constraintKey:[constraintKey];
  return { known: true, aligned: diagnosed.includes(statedChallengeKey),
           stated: statedChallengeKey, diagnosed };
}

module.exports = { score, statedGap, pctFromAvg, SCALE };
