'use strict';

/**
 * Thin Airtable client.
 *
 * TWO NON-NEGOTIABLES, both learned the hard way on the purpose-led build:
 *
 * 1. NEVER interpolate user input into a filterByFormula without escaping.
 *    esc() below handles it. A partner code arriving as  x') OR 1=1 ('
 *    must not become a working query.
 *
 * 2. NEVER swallow errors. No `.catch(() => {})`. A failed write that looks
 *    like a success silently undercounts completions and loses leads. Every
 *    failure here throws, and the calling function returns a real status code
 *    so the user sees something went wrong.
 */

const API = 'https://api.airtable.com/v0';

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

/** Escape a value for safe use inside an Airtable filterByFormula string literal. */
function esc(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function request(path, options = {}) {
  const baseId = env('AIRTABLE_BASE_ID');
  const key = env('AIRTABLE_API_KEY');
  const url = `${API}/${baseId}/${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  if (!res.ok) {
    // Log the detail server-side; the caller decides what the user sees.
    console.error('Airtable error', res.status, path, text.slice(0, 500));
    const err = new Error(`Airtable request failed with status ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return text ? JSON.parse(text) : {};
}

/** Find one record by an exact field match. Returns null if not found. */
async function findOne(tableId, fieldName, value, extra = {}) {
  const formula = `{${fieldName}} = '${esc(value)}'`;
  const params = new URLSearchParams({
    filterByFormula: formula,
    maxRecords: '1',
    ...extra,
  });
  const data = await request(`${encodeURIComponent(tableId)}?${params}`);
  return data.records && data.records.length ? data.records[0] : null;
}

/** List records matching an optional formula. Handles pagination. */
async function list(tableId, { formula, fields, maxRecords, view } = {}) {
  const out = [];
  let offset;
  do {
    const params = new URLSearchParams();
    if (formula) params.set('filterByFormula', formula);
    if (view) params.set('view', view);
    if (maxRecords) params.set('maxRecords', String(maxRecords));
    if (offset) params.set('offset', offset);
    if (fields) fields.forEach(f => params.append('fields[]', f));

    const data = await request(`${encodeURIComponent(tableId)}?${params}`);
    out.push(...(data.records || []));
    offset = data.offset;
    if (maxRecords && out.length >= maxRecords) break;
  } while (offset);
  return out;
}

/** Create records. Throws on failure — no silent catch. */
async function create(tableId, records, { typecast = true } = {}) {
  const data = await request(encodeURIComponent(tableId), {
    method: 'POST',
    body: JSON.stringify({ records, typecast }),
  });
  if (!data.records || data.records.length !== records.length) {
    throw new Error('Airtable create returned an unexpected record count');
  }
  return data.records;
}

async function update(tableId, records, { typecast = true } = {}) {
  const data = await request(encodeURIComponent(tableId), {
    method: 'PATCH',
    body: JSON.stringify({ records, typecast }),
  });
  return data.records;
}

module.exports = { request, findOne, list, create, update, esc };
