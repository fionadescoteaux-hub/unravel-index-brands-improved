'use strict';

/**
 * POST /api/move   { partnerCode, password, action, move }
 *
 * Writes the portfolio team's COMMITTED MOVES — the intervention they have
 * decided to make against a diagnosed constraint — so the next assessment can
 * be read against what was actually done.
 *
 * Same authentication as the dashboard: access code AND dashboard password,
 * or 401. POST so credentials never land in a URL or a log.
 *
 *   action: 'create'  move: { subject, brand, domainKey, move, owner, horizon, metric,
 *                             baselineScore, baselineIndex, person, office, lineNames, due }
 *   action: 'update'  move: { id, status, due, progress, workingNote,
 *                             outcomeStatus, outcomeEvidence }
 *
 * Storage: Airtable table named by AIRTABLE_MOVES_TABLE (default "Moves") with
 * fields PartnerCode, Subject, Brand, BrandID, DomainKey, Move, Owner, Horizon,
 * Metric, Status, Due, Progress, WorkingNote, OutcomeStatus, OutcomeEvidence,
 * BaselineScore, BaselineIndex, CreatedAt and UpdatedAt.
 */

const { findOne, list, create, update, esc } = require('../../lib/airtable');
const { verifySecret } = require('../../lib/auth');
const { DOMAINS } = require('../../lib/instruments');
const { ok, badRequest, unauthorized, tooMany, serverError, preflight, rateLimit, clientKey } = require('../../lib/http');

const T_PARTNERS = process.env.AIRTABLE_PARTNERS_TABLE;
const T_MOVES = process.env.AIRTABLE_MOVES_TABLE || 'Moves';
const STATUSES = ['Committed', 'In progress', 'Blocked', 'Done', 'Dropped'];
const OUTCOMES = ['Not tested', 'In test', 'Supported', 'Not supported'];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return badRequest('Use POST.');
  if (!rateLimit(`move:${clientKey(event)}`, { limit: 30, windowMs: 60_000 })) return tooMany();

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return badRequest('Could not read that request.'); }

  const partnerCode = String(body.partnerCode || '').trim();
  const password = String(body.password || '');
  if (!partnerCode) return unauthorized('Access code and password are both required.');

  const action = String(body.action || '').trim();
  const m = body.move || {};
  if (!['create', 'update'].includes(action)) return badRequest('Unknown action.');

  try {
    const partner = await findOne(T_PARTNERS, 'PartnerCode', partnerCode);
    if (!partner || partner.fields.Active !== true) return unauthorized('Access code or password not recognised.');
    if (partner.fields.DemoAccount === true) return unauthorized('The shared demonstration dashboard is read-only. Use a client account to save moves.');
    if (!password) return unauthorized('Access code and password are both required.');
    const expected = partner.fields.DashboardPassword || '';
    if (!verifySecret(password, expected)) return unauthorized('Access code or password not recognised.');

    const now = new Date().toISOString();

    if (action === 'create') {
      const brand = clean(m.brand, 120), domainKey = clean(m.domainKey, 40), move = clean(m.move, 500);
      if (!brand || !domainKey || !move) return badRequest('A brand, a domain and the move itself are required.');
      if (!DOMAINS.some(d => d.key === domainKey)) return badRequest('That domain is not part of this instrument.');
      const brandId=cleanId(m.brandId);
      if (!brandId) return badRequest('A stable brand or company ID is required for a new move.');
      const owner=clean(m.owner,120), horizon=clean(m.horizon,120), metric=clean(m.metric,300);
      if (!owner || !horizon || !metric) return badRequest('Owner, horizon and proof measure are required before a move can become actionable.');
      // Governance fields: the accountable person, the delivering office and
      // the commercial line(s) the action lands on. Optional at the API so
      // older clients and quick-adds still save; the operations table shows
      // an open action without a person as unassigned rather than hiding it.
      const person=clean(m.person,120), office=clean(m.office,120), lineNames=clean(m.lineNames,240);
      const fields = {
        PartnerCode: partnerCode,
        Subject: clean(m.subject, 20) || 'brand',
        Brand: brand,
        BrandID: brandId,
        DomainKey: domainKey,
        Move: move,
        Owner: owner,
        Person: person,
        Office: office,
        LineNames: lineNames,
        Horizon: horizon,
        Metric: metric,
        Status: 'Committed',
        Note: '',
        BaselineScore: num(m.baselineScore),
        BaselineIndex: num(m.baselineIndex),
        CreatedAt: now,
        UpdatedAt: now,
        Due: cleanDate(m.due),
        Progress: '[]',
        WorkingNote: '',
        OutcomeStatus: 'Not tested',
        OutcomeEvidence: '',
      };
      const [rec] = await create(T_MOVES, [{ fields }]);
      return ok({ saved: true, id: rec.id, move: { id: rec.id, ...toMove(fields) } });
    }

    // update
    const id = clean(m.id, 40);
    if (!id) return badRequest('Which move?');
    // Authentication alone is not authorisation to mutate an arbitrary Airtable
    // record id. Confirm this move belongs to the signed-in partner first.
    const owned = await list(T_MOVES, {
      formula: `AND(RECORD_ID() = '${esc(id)}', {PartnerCode} = '${esc(partnerCode)}')`,
      maxRecords: 1,
    });
    if (!owned.length) return unauthorized('That move is not part of this portfolio.');
    const fields = { UpdatedAt: now };
    if (m.status !== undefined) {
      const st = clean(m.status, 20);
      if (!STATUSES.includes(st)) return badRequest('Unknown status.');
      fields.Status = st;
    }
    if (m.note !== undefined) fields.Note = clean(m.note, 500);
    if (m.owner !== undefined) fields.Owner = clean(m.owner, 120);
    if (m.horizon !== undefined) fields.Horizon = clean(m.horizon, 120);
    if (m.metric !== undefined) fields.Metric = clean(m.metric, 300);
    if (m.due !== undefined) fields.Due = cleanDate(m.due);
    if (m.progress !== undefined) fields.Progress = JSON.stringify(cleanProgress(m.progress));
    if (m.workingNote !== undefined) fields.WorkingNote = clean(m.workingNote, 1000);
    if (m.outcomeStatus !== undefined) {
      const os=clean(m.outcomeStatus,30);
      if (!OUTCOMES.includes(os)) return badRequest('Unknown outcome status.');
      fields.OutcomeStatus=os;
      fields.OutcomeUpdatedAt=now;
    }
    if (m.outcomeEvidence !== undefined) fields.OutcomeEvidence=clean(m.outcomeEvidence,1000);
    const nextOutcome=fields.OutcomeStatus || owned[0].fields.OutcomeStatus || 'Not tested';
    const nextEvidence=fields.OutcomeEvidence !== undefined ? fields.OutcomeEvidence : (owned[0].fields.OutcomeEvidence || '');
    if (nextOutcome==='Supported' && !String(nextEvidence).trim()) return badRequest('Outcome evidence is required before a constraint can be marked supported.');
    const [rec] = await update(T_MOVES, [{ id, fields }]);
    return ok({ saved: true, id: rec.id, move: { id: rec.id, ...toMove(rec.fields || {}) } });
  } catch (err) {
    // A missing Moves table is the likeliest first failure. Say so plainly.
    if (err && err.status === 404) {
      return badRequest('The Moves table has not been created yet. Create a table named "' + T_MOVES + '" in the Airtable base (see deploy notes) and try again.');
    }
    return serverError(err, 'save-move');
  }
};

function toMove(f) {
  return {
    subject: f.Subject || '', brand: f.Brand || '', brandId:f.BrandID||'', domainKey: f.DomainKey || '', move: f.Move || '',
    owner: f.Owner || '', person: f.Person || '', office: f.Office || '',
    lines: String(f.LineNames || '').split(',').map(s => s.trim()).filter(Boolean),
    horizon: f.Horizon || '', metric: f.Metric || '', status: f.Status || 'Committed',
    note: f.Note || '', baselineScore: f.BaselineScore == null ? null : Number(f.BaselineScore),
    baselineIndex: f.BaselineIndex == null ? null : Number(f.BaselineIndex),
    createdAt: f.CreatedAt || '', updatedAt: f.UpdatedAt || '',
    due:f.Due||'', progress:parseProgress(f.Progress), workingNote:f.WorkingNote||'',
    outcomeStatus:f.OutcomeStatus||'Not tested', outcomeEvidence:f.OutcomeEvidence||'', outcomeUpdatedAt:f.OutcomeUpdatedAt||'',
  };
}
function clean(v, max) { return v == null ? '' : String(v).trim().slice(0, max); }
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : null; }
function cleanId(v){ const s=clean(v,80).toUpperCase(); return /^[A-Z0-9][A-Z0-9_-]{2,79}$/.test(s)?s:''; }
function cleanDate(v){ const s=clean(v,20); return /^\d{4}-\d{2}-\d{2}$/.test(s)?s:''; }
function cleanProgress(v){ return [...new Set((Array.isArray(v)?v:[]).map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<20))].sort((a,b)=>a-b); }
function parseProgress(v){ try{const x=JSON.parse(v||'[]');return cleanProgress(x)}catch{return[]} }
