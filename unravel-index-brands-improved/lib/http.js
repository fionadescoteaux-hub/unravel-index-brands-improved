'use strict';

// Same-origin pages do not need a wildcard. Production deployments with a
// custom domain must set ALLOWED_ORIGIN explicitly.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://unravel-index-brands.netlify.app';

function headers(extra = {}) {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Cache-Control': 'no-store',
    ...extra,
  };
}

function json(statusCode, body, extra = {}) {
  return { statusCode, headers: headers(extra), body: JSON.stringify(body) };
}

function ok(body) { return json(200, body); }
function badRequest(message) { return json(400, { error: message }); }
function unauthorized(message = 'Not authorised') { return json(401, { error: message }); }
function notFound(message = 'Not found') { return json(404, { error: message }); }
function tooMany() { return json(429, { error: 'Too many requests. Wait a minute and try again.' }); }

/**
 * Server errors are surfaced to the user with a generic message but logged in
 * full. The user must never see a silent success when a write failed.
 */
function serverError(err, context, action) {
  console.error(`[${context}]`, err && err.stack ? err.stack : err);

  // Say what actually failed. "Something went wrong saving that" on a sign-in
  // is misleading — nothing was being saved.
  const msg = action === 'read'
    ? 'Could not load that just now. Nothing is wrong with your details — please try again, and tell us if it keeps happening.'
    : 'Something went wrong saving that. Nothing was lost — please try again, and tell us if it keeps happening.';

  // A missing environment variable is a configuration fault, not a user fault.
  // Name it in the response so it is diagnosable without opening the logs.
  const detail = err && /Missing required environment variable/.test(err.message || '')
    ? 'The service is not fully configured yet. This is on our side, not yours.'
    : undefined;

  return json(500, detail ? { error: msg, detail } : { error: msg });
}

function preflight() {
  return { statusCode: 204, headers: headers(), body: '' };
}

/**
 * In-memory rate limiter, per function instance.
 *
 * HONEST LIMITATION: Netlify runs multiple concurrent instances, so this is a
 * speed bump rather than a wall. It stops casual scripted abuse; it will not
 * stop a determined distributed attempt. If this endpoint ever gets seriously
 * hammered, move the counter into Airtable or a KV store.
 */
const buckets = new Map();

function rateLimit(key, { limit = 20, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;

  // Keep the map from growing without bound in a long-lived instance.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
  }
  return true;
}

function clientKey(event) {
  const h = event.headers || {};
  return h['x-nf-client-connection-ip'] || h['client-ip'] ||
         (h['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
}

module.exports = {
  headers, json, ok, badRequest, unauthorized, notFound, tooMany,
  serverError, preflight, rateLimit, clientKey,
};
