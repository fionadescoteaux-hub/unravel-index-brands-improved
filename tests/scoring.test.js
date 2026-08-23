'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { score, pctFromAvg } = require('../lib/scoring');
const { getInstrument, SCORING_VERSION } = require('../lib/instruments');

function answers(levels) {
  return Object.fromEntries(getInstrument('brand').domains.map(d => [d.key, { a:levels[d.key] || 1, b:levels[d.key] || 1 }]));
}

function confidence(value='evidenced') {
  return Object.fromEntries(getInstrument('brand').domains.map(d => [d.key, value]));
}

test('complete assessment scale is 20 to 100', () => {
  assert.equal(pctFromAvg(1), 20);
  assert.equal(pctFromAvg(5), 100);
  assert.equal(score('brand', answers({}), confidence()).overall, 20);
  const allFive=Object.fromEntries(getInstrument('brand').domains.map(d => [d.key, 5]));
  assert.equal(score('brand', answers(allFive), confidence()).overall, 100);
});

test('ties return every lowest-scoring candidate', () => {
  const levels=Object.fromEntries(getInstrument('brand').domains.map(d => [d.key, 4]));
  levels.strategy=2; levels.systems=2;
  const result=score('brand',answers(levels),confidence());
  assert.deepEqual(result.constraintCandidates,['strategy','systems']);
  assert.deepEqual(result.constraintTied,['strategy','systems']);
  assert.equal(result.constraintStatus,'candidate');
  assert.equal(result.scoringVersion,SCORING_VERSION);
});

test('estimated high scores are flagged but not reduced', () => {
  const levels=Object.fromEntries(getInstrument('brand').domains.map(d => [d.key, 4]));
  const conf=confidence(); conf.market='estimated';
  const result=score('brand',answers(levels),conf);
  assert.equal(result.domainScores.market,80);
  assert.deepEqual(result.heldForVerification,['market']);
});

test('invalid or incomplete answers fail closed', () => {
  const a=answers({}); delete a.finance;
  assert.throws(() => score('brand',a,confidence()),/finance/);
});

