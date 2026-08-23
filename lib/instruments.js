'use strict';

/**
 * The instrument registry, server-side.
 *
 * WEIGHTING_VERSION is stamped onto every completion so results remain
 * comparable if weights ever change. Never edit a weight in place once
 * assessments exist.
 */

const WEIGHTING_VERSION = 'unravel-v1.0-licensing';
const SCORING_VERSION = 'unravel-score-v1.0-20-100';
const ONTOLOGY_VERSION = 'unravel-brand-ontology-v1.0';
const ONTOLOGY = {
  portfolioStatus: ['Current','Announced','Market-specific','Associated / not operated','Retired','Unable to verify'],
  relationshipToPortfolio: ['Owned brand','Managed brand','Licensed master rights','Partner-operated association','Minority / joint venture','Other'],
  verificationStatus: ['Verified — primary source','Supported — reliable secondary source','Respondent-reported','Requires verification','Unable to verify'],
  offeringType: ['Product','Service','Experience','Media & entertainment','Publishing','Digital & content','Subscription / membership','Retail & concession','Hospitality / real estate','Collaboration'],
  operatingModel: ['Licensed','Owned and operated','Partner-operated','Retail / concession','Subscription / membership','Media / advertising','Joint venture','Other'],
  commercialStatus: ['Current','Announced','Market-specific','Associated / not operated','Retired','Unable to verify'],
};

/**
 * role:
 *   'primary' — carries revenue directly
 *   'enabler' — sets the ceiling on what the primaries can achieve
 * An enabler can be the lowest-scoring constraint candidate despite a lower weight.
 */
/**
 * `field` maps each domain to its existing column in the Completions table.
 * Those columns already exist and already hold purpose-led scores — brand and
 * company assessments write to the same nine, which is what keeps one dataset
 * instead of three.
 */
const DOMAINS = [
  { key:'strategy',   name:'Strategy & Commercial Intent',   short:'Strategy',        weight:10,  role:'enabler', field:'ScoreStrategy' },
  { key:'model',      name:'Business Model & Revenue Mix',   short:'Revenue Mix',     weight:15,  role:'primary', field:'ScoreRevenueModel' },
  { key:'economics',  name:'Products & Unit Economics',      short:'Unit Economics',  weight:15,  role:'primary', field:'ScoreUnitEconomics' },
  { key:'market',     name:'Market Focus & Demand',          short:'Market & Demand', weight:10,  role:'enabler', field:'ScoreMarketFocus' },
  { key:'gtm',        name:'Go-To-Market & Sales',           short:'Go-To-Market',    weight:10,  role:'primary', field:'ScoreSales' },
  { key:'operations', name:'Operations & Delivery Capacity', short:'Operations',      weight:10,  role:'enabler', field:'ScoreOperations' },
  { key:'finance',    name:'Financial Management & Cash',    short:'Finance & Cash',  weight:15,  role:'primary', field:'ScoreFinancial' },
  { key:'governance', name:'Governance & Decision-Making',   short:'Governance',      weight:7.5, role:'enabler', field:'ScoreGovernance' },
  { key:'systems',    name:'Systems & Data',                 short:'Systems & Data',  weight:7.5, role:'enabler', field:'ScoreSystems' },
];

const INSTRUMENTS = {
  brand: {
    key: 'brand',
    name: 'Brand Commercial Engine',
    subject: 'a single licensed brand',
    subjectLabel: 'Brand',
    weightingVersion: WEIGHTING_VERSION,
    domains: DOMAINS,
  },
  company: {
    key: 'company',
    name: 'Portfolio Operating Engine',
    subject: 'the licensing house',
    subjectLabel: 'Company',
    weightingVersion: WEIGHTING_VERSION,
    domains: DOMAINS,
  },
};

const BANDS = [
  // The canonical Unravel scale is (answer / 5) * 100. Because the lowest
  // selectable answer is 1, a complete assessment can score 20–100. Values
  // below 20 therefore signal incomplete or corrupt data, not "Fragile".
  { name: 'Fragile',   min: 20, max: 39 },
  { name: 'Emerging',  min: 40, max: 59 },
  { name: 'Defined',   min: 60, max: 74 },
  { name: 'Embedded',  min: 75, max: 89 },
  { name: 'Optimised', min: 90, max: 100 },
];

const CONFIDENCE = ['evidenced', 'reasoned', 'estimated'];

const sum = DOMAINS.reduce((s, d) => s + d.weight, 0);
if (Math.abs(sum - 100) > 1e-9) {
  throw new Error(`Domain weights must sum to 100, got ${sum} (${WEIGHTING_VERSION})`);
}
if (new Set(DOMAINS.map(d => d.key)).size !== DOMAINS.length) {
  throw new Error('Duplicate domain keys');
}

function getInstrument(key) {
  const inst = INSTRUMENTS[key];
  if (!inst) throw new Error(`Unknown instrument "${key}". Valid: ${Object.keys(INSTRUMENTS).join(', ')}`);
  return inst;
}

function bandFor(score) {
  const b = BANDS.find(x => score >= x.min && score <= x.max);
  return b ? b.name : 'Incomplete';
}

module.exports = {
  WEIGHTING_VERSION, SCORING_VERSION, ONTOLOGY_VERSION, ONTOLOGY,
  DOMAINS, INSTRUMENTS, BANDS, CONFIDENCE, getInstrument, bandFor,
};
