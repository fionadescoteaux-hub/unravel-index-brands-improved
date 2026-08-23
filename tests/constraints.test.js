'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { applyConstraintState } = require('../lib/constraints');

function subject(overrides={}) {
  return Object.assign({
    brandId:'BR-ONE', name:'Example', constraintKey:'market',
    constraintCandidates:['market'], constraintLines:[], constraintPlacements:{},
  },overrides);
}

function action(overrides={}) {
  return Object.assign({
    brandId:'BR-ONE', brand:'Example', domainKey:'market', status:'Committed',
    owner:'Commercial lead', horizon:'Q1', metric:'Sell-through against baseline',
    outcomeStatus:'Not tested', outcomeEvidence:'',
  },overrides);
}

test('a low score alone remains a candidate', () => {
  assert.equal(applyConstraintState(subject(),[]).constraintStatus,'candidate');
});

test('ties never auto-select the first domain', () => {
  const b=subject({constraintCandidates:['market','systems'],constraintPlacements:{market:['Line A']}});
  assert.equal(applyConstraintState(b,[action()]).constraintStatus,'candidate');
  assert.equal(b.constraintTests.material,false);
});

test('placed materiality plus complete intervention advances to priority', () => {
  const b=subject({constraintPlacements:{market:['Line A']}});
  assert.equal(applyConstraintState(b,[action()]).constraintStatus,'priority');
});

test('supported outcome requires written evidence to become validated', () => {
  const b=subject({constraintPlacements:{market:['Line A']}});
  assert.equal(applyConstraintState(b,[action({outcomeStatus:'Supported'})]).constraintStatus,'priority');
  assert.equal(applyConstraintState(b,[action({outcomeStatus:'Supported',outcomeEvidence:'Reorder rate rose 8pp versus baseline.'})]).constraintStatus,'validated');
});

test('stable ID takes precedence over a matching display name', () => {
  const b=subject({constraintPlacements:{market:['Line A']}});
  const wrong=action({brandId:'BR-TWO',brand:'Example',outcomeStatus:'Supported',outcomeEvidence:'Evidence'});
  assert.equal(applyConstraintState(b,[wrong]).constraintStatus,'candidate');
});

test('company materiality can be established by affected portfolio subjects', () => {
  const company=subject({instrument:'company',brandId:'CO-ONE',name:'Portfolio',constraintPortfolioSubjects:['BR-ONE']});
  const move=action({brandId:'CO-ONE',brand:'Portfolio'});
  assert.equal(applyConstraintState(company,[move]).constraintStatus,'priority');
});
