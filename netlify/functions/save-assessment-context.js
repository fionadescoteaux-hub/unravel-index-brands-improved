'use strict';

/**
 * POST /api/context
 * { partnerCode, completionId, action:'place-constraint', constraintLines:[] }
 *
 * A brand-level constraint candidate is only known after server-side scoring.
 * This endpoint lets the respondent place that candidate onto the commercial
 * lines it actually affects, immediately after the result is returned.
 *
 * The write is deliberately narrow. It can update only BrandContext on the
 * exact completion belonging to the supplied partner, and only stable line
 * IDs already captured on that completion can be selected.
 */

const { list, update, esc } = require('../../lib/airtable');
const { ok, badRequest, unauthorized, tooMany, serverError, preflight, rateLimit, clientKey } = require('../../lib/http');

const T_COMPLETIONS = process.env.AIRTABLE_COMPLETIONS_TABLE || process.env.AIRTABLE_BRAND_ASSESSMENTS_TABLE;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return badRequest('Use POST.');
  if (!rateLimit(`context:${clientKey(event)}`, { limit: 20, windowMs: 60_000 })) return tooMany();

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return badRequest('Could not read that request.'); }

  const partnerCode = String(body.partnerCode || '').trim();
  const completionId = String(body.completionId || '').trim();
  const action = String(body.action || '').trim();
  if (!partnerCode || !completionId) return unauthorized('The assessment link is no longer available.');
  if (action !== 'place-constraint') return badRequest('Unknown context action.');

  try {
    const formula = `AND({PartnerCode} = '${esc(partnerCode)}', {CompletionId} = '${esc(completionId)}')`;
    const records = await list(T_COMPLETIONS, { formula, maxRecords: 1 });
    const rec = records[0];
    if (!rec) return unauthorized('That assessment could not be matched to this access link.');

    let snapshot = {};
    try { snapshot = JSON.parse((rec.fields || {}).BrandContext || '{}') || {}; }
    catch { return badRequest('The commercial context on this assessment needs repair before it can be updated.'); }

    const lines = Array.isArray(snapshot.lines) ? snapshot.lines : [];
    const allowedById = new Map(lines.map(l => [String(l.lineId || '').trim(), String(l.name || '').trim()]).filter(x => x[0] && x[1]));
    const allowedByName = new Map(lines.map(l => [String(l.name || '').trim(), String(l.lineId || '').trim()]).filter(x => x[0] && x[1]));
    const candidates = (((snapshot.method || {}).constraintCandidates) || []).map(String);
    const rawPlacements = body.constraintPlacements && typeof body.constraintPlacements === 'object'
      ? body.constraintPlacements : {};
    const placementIds = {}, placements = {};
    for (const domainKey of candidates) {
      const requested = Array.isArray(rawPlacements[domainKey]) ? rawPlacements[domainKey] : [];
      placementIds[domainKey] = []; placements[domainKey] = [];
      for (const raw of requested) {
        const supplied = String(raw || '').trim();
        const id = allowedById.has(supplied) ? supplied : allowedByName.get(supplied); // legacy name submissions
        if (!id || placementIds[domainKey].includes(id)) continue;
        placementIds[domainKey].push(id);
        placements[domainKey].push(allowedById.get(id));
      }
    }
    const selectedIds = [...new Set(Object.values(placementIds).flat())];
    const selected = [...new Set(Object.values(placements).flat())];
    if (!allowedById.size) return badRequest('No commercial lines were captured on this assessment.');
    if (!selected.length) return badRequest('Select at least one affected commercial line.');

    snapshot.constraintLines = selected; // back-compat union
    snapshot.constraintPlacements = placements;
    snapshot.constraintLineIds = selectedIds;
    snapshot.constraintPlacementIds = placementIds;
    snapshot.constraintPlacement = {
      status: 'respondent-placed',
      updatedAt: new Date().toISOString(),
    };

    await update(T_COMPLETIONS, [{ id: rec.id, fields: { BrandContext: JSON.stringify(snapshot) } }]);
    return ok({ saved: true, completionId, constraintLineIds:selectedIds, constraintPlacementIds:placementIds, constraintLines: selected, constraintPlacements: placements, placementStatus: 'respondent-placed' });
  } catch (err) {
    return serverError(err, 'save-assessment-context');
  }
};
