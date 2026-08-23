'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashSecret, verifySecret } = require('../lib/auth');

test('dashboard passwords can be stored as scrypt hashes', () => {
  const stored=hashSecret('correct horse battery staple','00112233445566778899aabbccddeeff');
  assert.match(stored,/^scrypt\$[0-9a-f]+\$[0-9a-f]+$/);
  assert.equal(verifySecret('correct horse battery staple',stored),true);
  assert.equal(verifySecret('wrong',stored),false);
});

