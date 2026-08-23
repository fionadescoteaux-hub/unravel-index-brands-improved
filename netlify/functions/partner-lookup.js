'use strict';

/**
 * GET /api/partner?code=BRANDS-K7M2P9
 *
 * Validates a partner code AT RUNTIME.
 *
 * This is the fix for the build-time lookup on the purpose-led site, where
 * adding an Airtable record required a manual "clear cache and deploy" before
 * the link would work. Here, a new row in Partners is live immediately.
 *
 * Returns only what the questionnaire needs to render — never the dashboard
 * password, never anything about other partners.
 */

const { findOne } = require('../../lib/airtable');
const { ok, badRequest, notFound, tooMany, serverError, preflight, rateLimit, clientKey } = require('../../lib/http');

const T_PARTNERS = process.env.AIRTABLE_PARTNERS_TABLE;
const CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9-]{2,39}$/;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return badRequest('Use GET.');

  if (!rateLimit(`partner:${clientKey(event)}`, { limit: 30, windowMs: 60_000 })) return tooMany();

  const code = ((event.queryStringParameters || {}).code || '').trim();
  if (!code) return badRequest('No access code supplied.');
  if (!CODE_PATTERN.test(code)) return badRequest('That access code is not in a valid format.');

  try {
    const rec = await findOne(T_PARTNERS, 'PartnerCode', code);
    if (!rec) return notFound('That access code was not recognised. Check it with whoever sent you the link.');

    const f = rec.fields || {};
    if (f.Active !== true) {
      return notFound('That access code is no longer active. Contact your programme lead for a current link.');
    }

    const max = Number(f.MaxCompletions) || null;
    const used = Number(f.CompletionCount) || 0;
    if (max && used >= max) {
      return ok({
        valid: true, atCapacity: true,
        partnerName: f.PartnerName || '',
        message: 'This programme has reached its assessment allocation. Contact your programme lead.',
      });
    }

    return ok({
      valid: true,
      atCapacity: false,
      partnerCode: f.PartnerCode,
      partnerName: f.PartnerName || '',
      badgeLabel: f.BadgeLabel || '',
      region: f.Region || '',
      regionCode: f.RegionCode || '',
      vertical: f.Vertical || 'brand-licensing',
      remaining: max ? max - used : null,
    });
  } catch (err) {
    return serverError(err, 'partner-lookup', 'read');
  }
};
