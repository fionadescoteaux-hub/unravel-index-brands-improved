'use strict';

const crypto = require('crypto');

/**
 * Dashboard credentials may be stored as either:
 *   scrypt$<hex salt>$<hex derived key>
 * or, during migration only, the legacy plaintext value.
 *
 * New accounts should always use the scrypt form. Legacy support prevents an
 * Airtable migration from locking out existing users and is deliberately
 * surfaced to server logs so it can be removed once the table is migrated.
 */
function verifySecret(candidate, stored) {
  const supplied = String(candidate || '');
  const expected = String(stored || '');
  if (!supplied || !expected) return false;

  if (expected.startsWith('scrypt$')) {
    const parts = expected.split('$');
    if (parts.length !== 3 || !/^[0-9a-f]+$/i.test(parts[1]) || !/^[0-9a-f]+$/i.test(parts[2])) return false;
    try {
      const target = Buffer.from(parts[2], 'hex');
      const actual = crypto.scryptSync(supplied, Buffer.from(parts[1], 'hex'), target.length);
      return target.length === actual.length && crypto.timingSafeEqual(target, actual);
    } catch { return false; }
  }

  console.warn('[auth] legacy plaintext DashboardPassword in use; migrate this partner to a scrypt hash.');
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function hashSecret(secret, salt) {
  const value = String(secret || '');
  if (!value) throw new Error('A non-empty secret is required.');
  const s = salt ? Buffer.from(String(salt), 'hex') : crypto.randomBytes(16);
  const key = crypto.scryptSync(value, s, 32);
  return `scrypt$${s.toString('hex')}$${key.toString('hex')}`;
}

module.exports = { verifySecret, hashSecret };
