/* THE UNRAVEL INDEX — BRAND-LICENSING VERTICAL
   Question text for both subjects. Nine canonical domains, canonical weights.

   This file carries QUESTION TEXT, the published domain weights, and the
   intervention playbooks. The scoring maths, the constraint rule and the
   verification rule live server-side in lib/ and are never shipped to the
   browser. Reading this file tells you what is asked, not how it is scored. */

var DOMAIN_META = [
  { key:'strategy',   name:'Strategy & Commercial Intent',   short:'Strategy',        role:'Enabler', weight:10 },
  { key:'model',      name:'Business Model & Revenue Mix',   short:'Revenue Mix',     role:'Primary', weight:15 },
  { key:'economics',  name:'Products & Unit Economics',      short:'Unit Economics',  role:'Primary', weight:15 },
  { key:'market',     name:'Market Focus & Demand',          short:'Market & Demand', role:'Enabler', weight:10 },
  { key:'gtm',        name:'Go-To-Market & Sales',           short:'Go-To-Market',    role:'Primary', weight:10 },
  { key:'operations', name:'Operations & Delivery Capacity', short:'Operations',      role:'Enabler', weight:10 },
  { key:'finance',    name:'Financial Management & Cash',    short:'Finance & Cash',  role:'Primary', weight:15 },
  { key:'governance', name:'Governance & Decision-Making',   short:'Governance',      role:'Enabler', weight:7.5 },
  { key:'systems',    name:'Systems & Data',                 short:'Systems & Data',  role:'Enabler', weight:7.5 }
];

/* ══ BRAND — the commercial engine of one licensed brand ══════════════════ */

var BRAND_DOMAIN_TEXT = {
  strategy:{ t:'Whether this brand is being run to a commercial plan, or to a renewal schedule',
    move:'Write a three-year commercial plan for the brand, with a revenue target and named categories',
    why:'A brand without a plan defaults to renewing what exists. Every decision becomes a reaction to whoever approached, and the brand grows only at the rate other people think of it.',
    when:'Plan in 6–8 weeks · effect from the next deal cycle',
    proof:'Decisions taken and declined against the plan, on record' },
  model:{ t:'Whether the income mix is diversified and predictable, or resting on a few guarantees',
    move:'Reduce dependency on the largest licensee before the next renewal, not during it',
    why:'A brand whose income is one licensee\u2019s guarantee has no negotiating position. Concentration is invisible while everyone is happy and decisive the moment they are not.',
    when:'Diversification is a 2–4 quarter play; the analysis takes a fortnight',
    proof:'Share of income from the largest licensee, and number of licensees above a material threshold' },
  economics:{ t:'Whether the true economics of each category are known, and priced accordingly',
    move:'Build a category-level margin view: rate earned against the real cost to serve',
    why:'Licensing looks like pure margin until you count approvals, creative, legal and management time. Some categories in most books lose money once serviced properly, and nobody can name which.',
    when:'Category economics in 6 weeks',
    proof:'Contribution per category after cost to serve, and rates changed on the evidence' },
  market:{ t:'Whether the customer for this brand is defined and demand is evidenced rather than assumed',
    move:'Establish a demand baseline before the next investment decision',
    why:'Heritage brands are especially prone to being sold on memory. Without a baseline, brand debate is opinion and investment goes where advocacy is loudest.',
    when:'Baseline in 6 weeks · direction visible within two quarters',
    proof:'Tracked demand signals moving against a fixed baseline' },
  gtm:{ t:'Whether new licensees and territories are pursued deliberately, or arrive by approach',
    move:'Map the white space and convert the pipeline from inbound to designed',
    why:'An inbound pipeline caps the brand at the rate other people think of it. Designed origination sets that rate yourself.',
    when:'Map in 8–10 weeks · pipeline effect from the next cycle',
    proof:'Share of signed deals originated rather than received' },
  operations:{ t:'Whether the brand can be serviced properly at its current size, and at the next one',
    move:'Set the service standard the licence book actually requires, and resource to it',
    why:'Capacity is the quietest constraint: nothing visibly fails, the important work simply never happens. Approvals slip, reviews are skipped, and quality drifts without a single decision being taken.',
    when:'Standard in 6 weeks · resourcing over one to two quarters',
    proof:'Approval turnaround time, and reviews held against reviews scheduled' },
  finance:{ t:'Whether royalty income is verified and forecastable, or self-reported and extrapolated',
    move:'Close the reporting lag and put the book on a standing audit programme',
    why:'Unverified self-reporting is money left on the table and a forecast nobody can defend. Audit recoveries are read beside the programme’s cost; the forecast is what makes the next renewal negotiable.',
    when:'Reporting cadence in one quarter · recoveries within two',
    proof:'Reporting lag in days, audit recovery value, overage as a share of royalty' },
  governance:{ t:'Whether renewal and investment decisions follow criteria, or follow the relationship',
    move:'Set renewal criteria in writing before the renewal conversation opens',
    why:'A book that renews by default accumulates its weakest partners. Criteria agreed in advance change the outcome; criteria discussed during a negotiation do not.',
    when:'Criteria in 4 weeks · effect over one renewal cycle',
    proof:'Renewals decided against written criteria, and exits executed on schedule' },
  systems:{ t:'Whether the data needed to run this brand is joined up, or assembled by hand each time',
    move:'Join royalty, sell-through and contract data into one current view',
    why:'When assembling a brand view takes days, it happens quarterly at best, so decisions run on memory and relationship instead of evidence.',
    when:'Single view in one to two quarters',
    proof:'Time to answer a standard brand question, and decisions carrying a data case' }
};

var BRAND_QUESTIONS = {
strategy:[
 ['Q1A · Commercial plan','Which best describes the commercial strategy for this brand?',[
  ['Reactive','There is no plan for this brand. Decisions follow whatever opportunity or renewal arrives.','No written plan for this brand'],
  ['Aspirational','Ambitions have been discussed but nothing is documented or agreed.','Plan discussed, not documented'],
  ['Documented','A plan exists but is not used to decide where time and money go.','Plan not referenced in the last major decision'],
  ['Active','A clear plan with revenue targets and named priority categories, used by the brand team.','Targets and priority categories named'],
  ['Embedded','Reviewed at least quarterly and directly driving where attention and investment go.','Quarterly review with recorded decisions']]],
 ['Q1B · Decision discipline','When a licensing opportunity arrives for this brand, how is the decision made?',[
  ['Say yes to what pays','If the guarantee is right, we take it. Fit is a secondary conversation.','Guarantee is the deciding factor'],
  ['Informal','Discussed case by case; the outcome depends on who is in the room.','No written criteria'],
  ['Loose priorities','A general sense of what fits, but exceptions are frequent on larger deals.','Criteria overridden on most large deals'],
  ['Tested against plan','Most opportunities are tested against the plan before commitment. We decline misfits.','Documented declines in the last twelve months'],
  ['Disciplined filter','Every opportunity scored against explicit criteria. We decline more than we sign.','More declined than signed, on record']]]],
model:[
 ['Q2A · Income structure','Which best describes this brand\u2019s income mix?',[
  ['Single dependency','Almost entirely one licensee or one territory. If it ended we would face immediate crisis.','One source is the majority of income'],
  ['Guarantee-reliant','Income is essentially the guaranteed minimums; overage is negligible.','Effectively no overage'],
  ['Genuine mix','A real spread across licensees, though income moves unpredictably between them.','Spread exists, forecasting unreliable'],
  ['Diversifying','Several material licensees with overage growing; forward visibility is reasonable.','Overage across most of the book'],
  ['Diversified and predictable','No single source dominates. Income is forecastable six-plus months out.','Largest licensee under a quarter of income']]],
 ['Q2B · Concentration risk','If this brand\u2019s largest licensee walked away tomorrow, what would happen?',[
  ['Existential','The brand would effectively stop earning.','Largest licensee is most of the income'],
  ['Serious damage','A major hole with no ready replacement.','No replacement identified'],
  ['Painful but survivable','We would cover a period while finding an alternative.','Alternative would take quarters'],
  ['Manageable','Other licensees would keep the brand stable while we adjusted.','Other partners can absorb it'],
  ['Absorbed','No single licensee is more than a quarter of income. We would absorb it.','No partner above a quarter of income']]]],
economics:[
 ['Q3A · Cost and margin visibility','For this brand, how well is the true economics of each licensed category understood?',[
  ['Not tracked','We look at royalty received. Cost to serve a category has never been calculated.','Cost to serve never calculated'],
  ['Rough sense','A feel for which categories are more work, but no analysis.','No category-level analysis'],
  ['Direct costs known','Royalty and direct costs understood; management, creative and legal time not allocated.','Overheads unallocated'],
  ['Fully costed','True contribution per category understood including cost to serve, and used in decisions.','Contribution per category calculated'],
  ['Evidence-based','Every category has a known contribution, and rates are set from it.','Rates justified by contribution evidence']]],
 ['Q3B · Portfolio decisions','How is it decided what to charge, and whether to keep, change or exit a category?',[
  ['Intuition','Rates come from precedent or negotiation. We rarely exit anything.','No category exited in three years'],
  ['Set but not reviewed','Rates were set once and are not reviewed against cost or market.','Rates unreviewed for over two years'],
  ['Occasional review','Reviewed sometimes, but exiting a category feels too difficult.','Review happens; action rarely follows'],
  ['Annual cycle','Rates reviewed annually against evidence. Underperforming categories have been dropped.','Category dropped or repriced in the last year'],
  ['Active management','Regular review, evidence-based rates, clear criteria for what stays, changes or goes.','Written criteria applied on a cycle']]]],
market:[
 ['Q4A · Customer definition','How clearly is the customer for this brand defined?',[
  ['Assumed','We describe the customer from heritage. No current evidence.','No current consumer data'],
  ['Broad','A general description everyone would state slightly differently.','Definition varies across the team'],
  ['Segmented on paper','Segments defined but not used to shape category or territory choices.','Segments not driving decisions'],
  ['Evidenced','A defined customer supported by current data, used in category decisions.','Definition backed by current data'],
  ['Tracked','The customer is defined, tracked, and changes in them change what we do.','Tracked on a cycle, decisions adjusted']]],
 ['Q4B · Demand evidence','Is demand for this brand growing, flat or declining — and can the team prove it?',[
  ['Declining, unexplained','Softening, and the causes are debated rather than diagnosed.','Cause not established'],
  ['Flat or unclear','Stable at best; any growth comes from new doors rather than demand.','Growth attributable to distribution only'],
  ['Pockets of growth','Growing somewhere, but not by design and not measured consistently.','Growth unplanned'],
  ['Growing, understood','Growing, and the team can attribute it to specific decisions.','Growth traced to named initiatives'],
  ['Compounding','Deliberate, attributable and repeatable growth against a tracked baseline.','Consecutive planned growth against target']]]],
gtm:[
 ['Q5A · Pipeline','Where does new income for this brand come from?',[
  ['Inbound only','Almost entirely from approaches made to us.','No outbound origination'],
  ['Relationship-led','From the network, as things surface.','Dependent on individual networks'],
  ['Partly targeted','Some categories or territories actively pursued; most deals reactive.','Minority of deals originated'],
  ['Designed','White space mapped and pursued deliberately, with a pipeline reviewed on a cycle.','Pipeline reviewed on a fixed cycle'],
  ['Engineered','Pipeline built from demand evidence, sequenced, and forecast with confidence.','Pipeline forecast and conversion tracked']]],
 ['Q5B · Route to market','Is this brand in the right channels and territories, and out of the wrong ones?',[
  ['Wherever it lands','Distribution is whatever each licensee achieves. No brand-level view.','No channel standard set'],
  ['Broad, unmanaged','Wide presence including channels that damage the positioning.','Known misfit channels, no exit plan'],
  ['Directionally right','Mostly appropriate, with known gaps or misfits unaddressed.','Standard exists, not enforced'],
  ['Managed','A channel plan per territory, with distribution approved and checked.','Approval required in material licences'],
  ['Curated','Actively managed, with exits from wrong channels and a pipeline into target ones.','Documented exits in the last year']]]],
operations:[
 ['Q6A · Capacity to service','Can this brand be serviced properly at its current size?',[
  ['Overstretched','Approvals and reviews slip. Work we know matters is not happening.','Work knowingly not being done'],
  ['Stretched','It gets done, but on individual effort and long hours.','Dependent on discretionary effort'],
  ['Adequate','Capacity meets current demand but nothing more.','No headroom for growth'],
  ['Resourced','Capacity is planned against the licence book, with a defined service standard.','Written service standard, resourced'],
  ['Scaled','Capacity is planned ahead of growth and does not depend on individuals.','Capacity planned ahead of the pipeline']]],
 ['Q6B · Delivery consistency','Do approvals, reviews and licensee support happen to a standard, or to availability?',[
  ['Ad hoc','Whenever someone gets to it. Turnaround varies widely.','No turnaround standard'],
  ['Reactive','Driven by whoever is chasing hardest.','Priority set by escalation'],
  ['Partly standardised','A process exists and is followed for larger licensees.','Standard applied to majors only'],
  ['Consistent','One standard applied across the book, with turnaround measured.','Turnaround measured against a target'],
  ['Managed','Standards met consistently and raised deliberately over time.','Standard raised in the last year']]]],
finance:[
 ['Q7A · Royalty visibility and verification','How current and how verified is the view of this brand\u2019s income?',[
  ['Lagged and trusted','Self-reported statements, months behind, rarely audited.','Lag over a quarter; no audits in two years'],
  ['Quarterly rear-view','Reliable but backward-looking. Surprises surface late.','Quarterly; audits ad hoc'],
  ['Timely for majors','Current on the largest licensees; the tail is opaque.','Tail lagging or unverified'],
  ['Current and verified','Timely across the book with a standing audit programme and tracked recoveries.','Standing audit programme with recoveries'],
  ['Assured','Near-live visibility, continuous verification, terms adjusted on the evidence.','Terms renegotiated on audit evidence']]],
 ['Q7B · Forecasting','How reliably can income from this brand be forecast twelve months out?',[
  ['Extrapolated','Last year plus a judgement.','No bottom-up forecast'],
  ['Minimums only','Confident on guarantees, blind on overage.','Overage not forecast'],
  ['Partly modelled','Modelled for the major licensees only.','Tail excluded from the forecast'],
  ['Modelled','Built bottom-up per licensee and tracked against actuals.','Forecast tracked against actuals'],
  ['Predictive','Driven by sell-through and demand signals, with variance understood.','Variance explained, not just reported']]]],
governance:[
 ['Q8A · Renewal discipline','What happens when a licensee on this brand underperforms, or comes up for renewal?',[
  ['Rollover','Renewals default to yes to protect the minimums.','No exits on record'],
  ['Reluctant','Discussed, rarely acted on. Renegotiation is avoided.','Discussed, not acted on'],
  ['Selective','Action taken in a crisis rather than to criteria.','Action only in crisis'],
  ['Criteria-led','Written criteria govern renewal and exit, applied consistently.','Written criteria applied at renewal'],
  ['Actively curated','The book improves each cycle by design; restructures and exits happen on schedule.','Scheduled exits or restructures']]],
 ['Q8B · Decision rhythm','Is there a standing rhythm at which this brand\u2019s performance is reviewed and decisions recorded?',[
  ['None','Reviewed when there is a reason to.','No scheduled review'],
  ['Annual','A yearly look, largely financial.','Annual, financial only'],
  ['Periodic','Regular but inconsistent in format and follow-through.','Format varies; actions untracked'],
  ['Standing rhythm','A defined cycle on consistent measures, with decisions recorded.','Same measures each cycle, decisions recorded'],
  ['Governed','A rhythm that actually reallocates attention and investment on the evidence.','Reallocation on record']]]],
systems:[
 ['Q9A · Data infrastructure','Can someone answer a question about this brand — by category, territory or licensee — without a manual exercise?',[
  ['No','It would take a project. Data sits in spreadsheets, inboxes and contracts.','Answer requires a project'],
  ['With effort','Possible, manually, over days.','Answer takes days'],
  ['Partly','Some questions answerable from a reporting pack; most are not.','Reporting covers part of the question set'],
  ['Single view','One current, trusted view across licensees, categories and channels.','One source used by the team'],
  ['Queried','An integrated layer interrogated routinely and driving decisions.','Answers by query, same day']]],
 ['Q9B · Decision use','Does data actually change decisions on this brand — rates, categories, renewals, investment?',[
  ['Instinct','Decisions rest on experience and relationship; data is added afterwards.','No data requirement in decisions'],
  ['Referenced','Data appears in the paper but rarely changes the outcome.','Outcome unchanged by data'],
  ['Some decisions','Certain decisions use it; others do not.','Applied inconsistently'],
  ['Standard input','Major decisions require a data case, and the team can point to calls it changed.','Reversals on record'],
  ['Data-led','Rate, category, renewal and investment decisions made against defined metrics, auditably.','Auditable decision trail']]]]
};

/* ══ COMPANY — the same nine domains, asked of the licensing house ════════ */

var COMPANY_DOMAIN_TEXT = {
  strategy:{ t:'Whether there is a thesis for what belongs in this portfolio, and what does not',
    move:'Write the portfolio thesis as a filter, not a description',
    why:'A thesis describing what you own justifies every past decision and disciplines no future one. A thesis naming the capability each platform needs tells you what to decline.',
    when:'Thesis in 6–8 weeks · effect from the next acquisition decision',
    proof:'Opportunities declined on thesis grounds, and capability built rather than bought twice' },
  model:{ t:'Whether portfolio income is spread across brands and partners, or concentrated',
    move:'Map concentration across the whole book — by brand, by licensee, by territory',
    why:'Portfolio-level concentration hides inside brand-level comfort. Three brands can each look diversified while sharing one dominant licensee.',
    when:'Analysis in a fortnight; rebalancing is a multi-quarter play',
    proof:'Income share of the largest brand, largest licensee and largest territory' },
  economics:{ t:'Whether the true cost of running each brand is known, and whether each one earns its place',
    move:'Calculate contribution per brand after the real cost to service it',
    why:'Every brand in a portfolio consumes management, legal, creative and approval time. Without allocation, small brands look free and large ones look better than they are.',
    when:'Contribution model in 6–8 weeks',
    proof:'Contribution per brand after allocated cost, and decisions taken on the result' },
  market:{ t:'Whether the company knows which categories and territories the portfolio should be in',
    move:'Build the demand and white-space view once, centrally, and share it across brands',
    why:'Every brand team researching its own categories duplicates work and produces incomparable answers. Done once, it becomes an asset the whole portfolio draws on.',
    when:'One to two quarters',
    proof:'Category and territory decisions traceable to the central view' },
  gtm:{ t:'Whether new licensing revenue is designed and priced against evidence, or received',
    move:'Convert origination from inbound to designed, and price against category evidence',
    why:'An inbound pipeline caps growth at the rate others think of you. Evidence-based pricing stops the guarantee being the only lever in the room.',
    when:'Pipeline in one quarter · deal-flow effect within two',
    proof:'Share of deals originated rather than received, and rate achieved against benchmark' },
  operations:{ t:'Whether there is one operating machine for servicing brands and licensees, or many',
    move:'Build one licensee operating standard and apply it across every brand',
    why:'Managing licensees brand by brand makes the standard only as good as each brand lead. One machine makes capability portable and survives departures.',
    when:'Standard in one quarter · book quality over one renewal cycle',
    proof:'Share of the book on a common scorecard, and turnaround consistency across brands' },
  finance:{ t:'Whether royalty operations, audit and forecasting run as an operation rather than a reconciliation',
    move:'Run royalty as an operation: standing audit programme and bottom-up forecasting',
    why:'Unverified self-reporting across a portfolio compounds — the leakage is proportional to the number of licensees, and nobody owns the total.',
    when:'Programme in one quarter · recoveries within two',
    proof:'Portfolio audit recovery value, reporting lag, and forecast variance against actuals' },
  governance:{ t:'Whether portfolio decisions are made to a rhythm, against criteria that are written down',
    move:'Institute a standing portfolio review comparing brands on the same measures',
    why:'Without a rhythm, attention follows whoever asks loudest. A standing comparison is what lets investment be reallocated on evidence instead of advocacy.',
    when:'First cycle within one quarter',
    proof:'Investment or attention reallocated between brands as a recorded outcome' },
  systems:{ t:'Whether one data layer joins royalty, retail and contract data across every brand',
    move:'Build the single portfolio data layer before adding the next brand',
    why:'Each brand added without this multiplies the manual load. The cost of not doing it grows with the portfolio, which is why it is never the urgent thing until it is.',
    when:'One to two quarters',
    proof:'Time to answer a portfolio-wide question, and decisions carrying a data case' }
};

var COMPANY_QUESTIONS = {
strategy:[
 ['Q1A · Portfolio thesis','Is there an explicit thesis for what belongs in this portfolio and what does not?',[
  ['Opportunistic','Brands were acquired because they became available at the right price.','No written acquisition thesis'],
  ['Loose logic','A broad sense of fit, understood differently by different people.','Thesis unwritten; interpretations differ'],
  ['Written but static','A thesis exists on paper but does not drive what is pursued or declined.','Not referenced in the last acquisition'],
  ['Active filter','Acquisitions and disposals are tested against an explicit thesis and platform fit.','Documented declines on thesis grounds'],
  ['Sequenced','The thesis names the capability each platform needs and acquisitions are sequenced against it.','Acquisitions sequenced to a capability gap']]],
 ['Q1B · Platform coherence','Do the platforms function as strategy, or as reporting groups?',[
  ['Labels only','Platforms are how brands are grouped in reporting, nothing more.','No platform plan or budget'],
  ['Nominal','Some shared thinking within platforms, no shared plan or resource.','Shared thinking, no shared resource'],
  ['Partly operational','Platforms share some resource; strategy is still brand by brand.','Resource shared, strategy not'],
  ['Operational','Each platform has a plan, shared capability and a lead accountable for it.','Named accountable lead per platform'],
  ['Compounding','Platforms are where capability is built once and reused, with measurable cross-brand effect.','Capability built once, measurably reused']]]],
model:[
 ['Q2A · Portfolio income structure','How is portfolio income distributed across brands, licensees and territories?',[
  ['Highly concentrated','A small number of brands or licensees carry most of the income.','One brand or licensee dominates'],
  ['Guarantee-reliant','Income is largely guaranteed minimums; overage is thin across the book.','Overage immaterial portfolio-wide'],
  ['Uneven','A genuine spread, but growth comes from a narrow slice.','Growth from a minority of the book'],
  ['Diversifying','Income spread across brands and partners, with overage growing.','Overage across most of the book'],
  ['Diversified','No brand, licensee or territory dominates. Income is resilient to any single loss.','No single source above a quarter']]],
 ['Q2B · Portfolio concentration risk','If the largest single relationship in the portfolio ended, what would happen?',[
  ['Existential','It would materially threaten the business.','Largest relationship is most of income'],
  ['Serious damage','A major hole requiring rapid cost action.','No replacement identified'],
  ['Painful but survivable','Absorbable over a period while we replaced it.','Replacement would take quarters'],
  ['Manageable','The rest of the portfolio would hold while we adjusted.','Portfolio can absorb it'],
  ['Absorbed','No relationship is large enough to threaten the business.','No relationship above a quarter of income']]]],
economics:[
 ['Q3A · Cost to serve per brand','Is the true cost of running each brand known?',[
  ['Not tracked','We see royalty by brand. Cost to service a brand has never been calculated.','Cost to serve never calculated'],
  ['Rough sense','A feel for which brands are more work, but no allocation.','No allocation model'],
  ['Direct only','Direct costs attributed; management, legal and creative time is not.','Central time unallocated'],
  ['Fully allocated','Contribution per brand known after allocated cost, and used in decisions.','Contribution per brand calculated'],
  ['Evidence-based','Every brand has a known contribution, and portfolio decisions follow it.','Decisions taken on contribution evidence']]],
 ['Q3B · Portfolio decisions','How is it decided which brands get investment, and which are exited?',[
  ['Advocacy','Whoever makes the strongest case. We rarely exit anything.','No brand exited or restructured'],
  ['Implicit','Criteria understood but unwritten and inconsistently applied.','Criteria unwritten'],
  ['Partly explicit','Criteria exist for capital decisions but not for attention or capability.','Capital criteria only'],
  ['Explicit','Written criteria govern where investment and capability go.','Written criteria applied'],
  ['Auditable','Criteria explicit, applied, and reviewed against outcomes.','Decisions reviewed against outcomes']]]],
market:[
 ['Q4A · Category and territory view','Does the company hold a view of where the portfolio should be, beyond where it already is?',[
  ['None','Each brand works it out alone, if at all.','No central view'],
  ['Fragmented','Some brands have a view; they are not comparable.','Views not comparable across brands'],
  ['Partial','A central view exists for the larger platforms only.','Covers major platforms only'],
  ['Central view','One evidenced view of categories and territories, shared across brands.','Shared central view in use'],
  ['Portfolio asset','Maintained, current, and the starting point for every brand decision.','Maintained and routinely referenced']]],
 ['Q4B · Demand evidence','Can the company evidence demand across the portfolio, or is it asserted brand by brand?',[
  ['Asserted','Demand is described from heritage and instinct.','No demand data at portfolio level'],
  ['Patchy','Data exists for one or two brands.','Coverage limited to a few brands'],
  ['Inconsistent','Several brands measured, on different bases, so not comparable.','Measured on different bases'],
  ['Consistent','A common demand measure applied across brands and refreshed on a cycle.','Common measure, refreshed on a cycle'],
  ['Instrumented','Continuous demand signals across the portfolio, driving investment decisions.','Signals driving reallocation decisions']]]],
gtm:[
 ['Q5A · Origination','Where does new licensing revenue for the portfolio come from?',[
  ['Inbound','Almost entirely from approaches made to us.','No outbound origination function'],
  ['Relationship-led','From the network, as opportunities surface.','Dependent on individual networks'],
  ['Partly targeted','Some categories and territories pursued; most deals reactive.','Minority of deals originated'],
  ['Designed pipeline','White space mapped per brand and pursued deliberately, reviewed on a cycle.','Pipeline reviewed on a fixed cycle'],
  ['Engineered','Built from demand evidence, sequenced by architecture, forecast with confidence.','Pipeline forecast and conversion tracked']]],
 ['Q5B · Deal economics','How are deal terms set across the portfolio?',[
  ['Case by case','Terms depend on the counterparty and who is negotiating.','No internal rate benchmark'],
  ['Loosely benchmarked','Rough internal norms, frequently departed from.','Norms routinely departed from'],
  ['Templated','Standard terms exist; exceptions common on larger guarantees.','Exceptions common on large deals'],
  ['Priced against evidence','Rates and minimums set against category and territory evidence, with an approval bar.','Approval bar defined and applied'],
  ['Disciplined','Economics modelled, tested against strategy, and declined when they fail.','Deals declined on economics, on record']]]],
operations:[
 ['Q6A · One operating standard','Is there one way licensees and brands are serviced across the portfolio?',[
  ['Brand by brand','Each brand lead manages to their own standard.','No common standard documented'],
  ['Shared intent','Common expectations, inconsistently applied.','Expectations shared verbally only'],
  ['Partial framework','A framework exists and the larger brands use it.','Used by larger brands only'],
  ['One standard','One scorecard, review rhythm and escalation path across every brand.','One standard applied portfolio-wide'],
  ['Managed as a book','The whole base is managed as one portfolio, with capability shared across brands.','Managed as a single book']]],
 ['Q6B · Capacity and key-person risk','Does the team have the capacity the portfolio requires, and would it survive a departure?',[
  ['Overstretched and exposed','Key people carry too many brands, and their knowledge is not shared.','Work not done; no documented succession'],
  ['Stretched','Delivery depends on individual effort and long hours.','Dependent on discretionary effort'],
  ['Adequate','Capacity meets current demand but not growth; some cover exists.','No headroom; partial cover'],
  ['Resourced','Spans of control are deliberate and succession is identified for material roles.','Succession identified for material roles'],
  ['Scaled','Capacity planned ahead of growth; the model does not depend on individuals.','No single point of failure']]]],
finance:[
 ['Q7A · Royalty operations','How is royalty income verified across the portfolio?',[
  ['Trusted','Self-reported statements, rarely checked.','No audits in two years'],
  ['Reconciled','Checked arithmetically against contracts, not audited.','Arithmetic checks only'],
  ['Occasional audits','Audits happen when something looks wrong.','Audits triggered by suspicion'],
  ['Audit programme','A standing programme covering the book on a cycle, recoveries tracked.','Standing programme with recoveries'],
  ['Assured','Continuous verification with recovery, and terms adjusted on the evidence.','Terms renegotiated on audit evidence']]],
 ['Q7B · Forecasting','How reliably can the company forecast portfolio income twelve months out?',[
  ['Extrapolated','Last year plus a judgement.','No bottom-up forecast'],
  ['Minimums-based','Confident on guarantees, blind on overage.','Overage not forecast'],
  ['Partly modelled','Modelled for major licensees only.','Tail excluded'],
  ['Modelled','Built bottom-up per licensee and tracked against actuals.','Forecast tracked against actuals'],
  ['Predictive','Driven by sell-through and demand signals, with variance understood.','Variance explained, not just reported']]]],
governance:[
 ['Q8A · Decision rhythm','Is there a standing rhythm at which brands are compared against each other?',[
  ['None','Brands are reviewed against their own plan, when there is a reason to.','No cross-brand comparison'],
  ['Annual','A yearly cycle, largely financial.','Annual, financial only'],
  ['Periodic','Regular reviews, inconsistent format.','Format varies between reviews'],
  ['Standing rhythm','A defined cycle comparing brands on the same measures, decisions recorded.','Same measures each cycle, decisions recorded'],
  ['Governed','A rhythm that reallocates attention and investment across brands on the evidence.','Reallocation on record']]],
 ['Q8B · Renewal and exit discipline','Portfolio-wide, what happens when a licensee underperforms?',[
  ['Rollover','Renewals default to yes to protect the minimums.','No exits on record'],
  ['Case by case','Handled brand by brand, usually reluctantly.','Handling varies by brand'],
  ['Selective','Exits happen in a crisis rather than to criteria.','Action only in crisis'],
  ['Criteria-led','Published criteria govern renewal and exit, applied consistently across brands.','Published criteria applied at renewal'],
  ['Actively curated','The book improves every cycle by design; exits happen on schedule.','Scheduled exits or restructures']]]],
systems:[
 ['Q9A · One data layer','Can someone answer a portfolio-wide question — by category, territory or channel — without a manual exercise?',[
  ['No','It would take a project. Data lives in spreadsheets and inboxes.','Answer requires a project'],
  ['With effort','Possible, manually, over days.','Answer takes days'],
  ['Partly','Some questions answerable from a reporting pack; most are not.','Reporting covers part of the question set'],
  ['Single view','One current, trusted view across brands, licensees and channels.','One trusted view in use'],
  ['Queried','An integrated layer interrogated routinely and driving decisions.','Answers by query, same day']]],
 ['Q9B · Systems fit for the portfolio','Do the systems match the size of the business?',[
  ['Outgrown','Core operations run on spreadsheets and email.','Core operations on spreadsheets'],
  ['Patchwork','Multiple systems, poorly joined, with manual bridges.','Manual bridges between systems'],
  ['Adequate','Systems cope; integration is limited.','Integration limited'],
  ['Fit for purpose','Contract, royalty and reporting systems integrated and maintained.','Contract, royalty and reporting integrated'],
  ['Scalable','Systems support growth without added headcount, with data quality owned.','Named data-quality owner; growth absorbed']]]]
};


/* ══ PLAYBOOKS — what the team does once a constraint is named ═══════════
   One per domain, per subject. `lever` is the revenue lever the constraint is
   jamming; `actions` are the first four moves in order, each with an owner;
   `horizon` and `metric` are when to expect movement and what proves it.
   Shown only against the diagnosed constraint. Orientation, not prescription. */

var BRAND_PLAYS = {
  strategy:{ lever:'Grow the base: deliberate category and territory choices instead of renewal-by-default',
    actions:[
      {t:'Write a three-year commercial plan for the brand: revenue target, three priority categories, two priority territories, and the categories you will decline',owner:'Brand lead'},
      {t:'Agree written deal criteria (fit, economics, channel) and a decline rule before the next approach arrives',owner:'Brand lead · Commercial'},
      {t:'Run the next three inbound opportunities through the criteria on paper and record the outcome, including declines',owner:'Commercial'},
      {t:'Put the plan on the quarterly brand review agenda with decisions recorded against it',owner:'Platform lead'}],
    horizon:'Plan in 6–8 weeks · effect from the next deal cycle', metric:'Decisions taken and declined against the plan, on record' },
  model:{ lever:'Protect and diversify income: reduce single-licensee dependence and convert guarantees into overage',
    actions:[
      {t:'Map income by licensee and by category for the last eight quarters; name the share from the largest and the share that is guarantee rather than overage',owner:'Finance'},
      {t:'For the largest licensee, write the replacement scenario now — who else could hold the category, at what terms, on what timeline',owner:'Commercial'},
      {t:'Open two new licensee conversations in categories adjacent to the dominant one before its renewal window, not during it',owner:'Commercial'},
      {t:'Restructure the next renewal toward a lower guarantee and a higher rate or tiered overage so income tracks sell-through',owner:'Commercial · Legal'}],
    horizon:'Analysis in a fortnight · diversification over 2–4 quarters', metric:'Share of income from the largest licensee; number of licensees above a material threshold; overage as a share of royalty' },
  economics:{ lever:'Improve rate and mix: price every category on its true contribution and exit the ones that lose money',
    actions:[
      {t:'Build a category-level contribution view: royalty earned less approvals, creative, legal and management time allocated per category',owner:'Finance · Brand lead'},
      {t:'Rank categories by contribution; identify the bottom quartile and the ones where rate is below cost to serve',owner:'Finance'},
      {t:'Set a rate floor and an exit rule in writing, and apply them to every category up for renewal in the next twelve months',owner:'Commercial'},
      {t:'Reprice or exit the first two categories on the evidence and record the decision',owner:'Brand lead'}],
    horizon:'Category economics in 6 weeks · first repricing at the next renewal', metric:'Contribution per category after cost to serve; rates changed or categories exited on the evidence' },
  market:{ lever:'Protect equity and pricing power: a defined consumer and an evidenced demand baseline',
    actions:[
      {t:'Write the consumer definition in one page from current data (sell-through, retailer data, search, social), not heritage',owner:'Brand lead · Insight'},
      {t:'Set a demand baseline: three tracked signals (e.g. branded search, sell-through rate, retailer reorder) with a fixed start date',owner:'Insight'},
      {t:'Test the next category and territory decisions against the consumer definition on paper; record the misfits',owner:'Commercial'},
      {t:'Review the baseline quarterly and attribute movement to named initiatives',owner:'Brand lead'}],
    horizon:'Baseline in 6 weeks · direction visible within two quarters', metric:'Tracked demand signals moving against a fixed baseline; decisions traced to the definition' },
  gtm:{ lever:'Add licences: originate white-space deals and get out of channels that erode the rate',
    actions:[
      {t:'Map white space: categories and territories the brand could credibly hold versus where it is licensed today',owner:'Commercial'},
      {t:'Prioritise five targets by demand evidence and contribution potential; name the licensee candidates for each',owner:'Commercial · Insight'},
      {t:'Set a channel standard per territory and list the current doors that breach it, with an exit plan and date',owner:'Brand lead'},
      {t:'Run a monthly pipeline review: originated versus inbound, stage, expected terms',owner:'Platform lead'}],
    horizon:'Map in 8–10 weeks · pipeline effect from the next cycle', metric:'Share of signed deals originated rather than received; documented channel exits' },
  operations:{ lever:'Grow the base by servicing it properly: approvals, reviews and licensee support to a standard',
    actions:[
      {t:'Define the service standard the licence book actually requires: approval turnaround, review cadence, escalation path',owner:'Platform lead'},
      {t:'Measure current turnaround and review completion against it for one quarter; name the gap',owner:'Operations'},
      {t:'Resource to the standard — headcount, shared services or tooling — and remove the dependence on one individual',owner:'Platform lead'},
      {t:'Publish turnaround and review metrics to licensees and hold them in the quarterly review',owner:'Operations'}],
    horizon:'Standard in 6 weeks · resourcing over 1–2 quarters', metric:'Approval turnaround time; reviews held against reviews scheduled' },
  finance:{ lever:'Stop the leakage: verified royalties, audit recovery and a forecast that survives a renewal negotiation',
    actions:[
      {t:'Close the reporting lag: move every licensee to a fixed reporting cadence with a defined format and a late-report clause enforced',owner:'Finance'},
      {t:'Start a standing audit programme — the two largest licensees first, then the tail on a rolling cycle — and track recoveries',owner:'Finance · Legal'},
      {t:'Build a bottom-up forecast per licensee from minimums, sell-through and overage, and track it against actuals monthly',owner:'Finance'},
      {t:'Take audit findings into the next renewal as the basis for terms',owner:'Commercial'}],
    horizon:'Reporting cadence in one quarter · recoveries within two', metric:'Reporting lag in days; audit recovery value; overage as a share of royalty; forecast variance' },
  governance:{ lever:'Improve the book at every renewal: criteria before the conversation, exits on schedule',
    actions:[
      {t:'Write renewal criteria for the brand — performance, fit, economics, compliance — and a default for what happens when they are not met',owner:'Brand lead · Legal'},
      {t:'List every renewal in the next 18 months with the criteria applied now, so the outcome is known before the conversation opens',owner:'Commercial'},
      {t:'Set a standing brand review rhythm on fixed measures with decisions and owners recorded',owner:'Platform lead'},
      {t:'Execute the first exit or restructure on the evidence and on schedule',owner:'Brand lead'}],
    horizon:'Criteria in 4 weeks · effect over one renewal cycle', metric:'Renewals decided against written criteria; exits or restructures executed on schedule' },
  systems:{ lever:'Make every other lever faster: one current view of royalty, sell-through and contract data',
    actions:[
      {t:'List the ten questions the brand team needs answered routinely (by licensee, category, territory) and how long each takes today',owner:'Brand lead'},
      {t:'Join royalty, sell-through and contract data into one maintained view — a single source, however simple',owner:'Systems · Finance'},
      {t:'Require a data case for rate, category and renewal decisions, and record the cases that changed the outcome',owner:'Platform lead'},
      {t:'Automate the quarterly brand pack from the view so it is produced, not assembled',owner:'Systems'}],
    horizon:'Single view in 1–2 quarters', metric:'Time to answer a standard brand question; decisions carrying a data case' }
};

var COMPANY_PLAYS = {
  strategy:{ lever:'Portfolio discipline: a thesis that tells you what to decline and what capability to build',
    actions:[
      {t:'Write the portfolio thesis as a filter: the capability each platform needs, and the brands that would and would not fit',owner:'CEO · Strategy'},
      {t:'Test the last three acquisitions and the next three candidates against it on paper',owner:'Strategy'},
      {t:'Give each platform a plan, a budget and an accountable lead',owner:'CEO'},
      {t:'Record declines on thesis grounds',owner:'Strategy'}],
    horizon:'Thesis in 6–8 weeks · effect from the next acquisition decision', metric:'Opportunities declined on thesis grounds; capability built once rather than bought twice' },
  model:{ lever:'Portfolio resilience: concentration by brand, licensee and territory mapped and managed',
    actions:[
      {t:'Map income share by brand, by licensee and by territory across the whole book — including licensees that span several brands',owner:'Finance'},
      {t:'Name the largest single relationship and write the replacement scenario',owner:'Commercial'},
      {t:'Set a concentration ceiling and a rebalancing plan over 2–4 quarters',owner:'CEO · Finance'},
      {t:'Report concentration quarterly alongside royalty',owner:'Finance'}],
    horizon:'Analysis in a fortnight · rebalancing over several quarters', metric:'Income share of the largest brand, licensee and territory' },
  economics:{ lever:'Reallocate to contribution: know what each brand costs and whether it earns its place',
    actions:[
      {t:'Allocate central cost (management, legal, creative, approvals) to brands and calculate contribution per brand',owner:'Finance'},
      {t:'Rank brands by contribution after cost; identify those below the line',owner:'Finance · CEO'},
      {t:'Decide restructure, reprice or exit for the bottom of the ranking, with criteria written down',owner:'CEO'},
      {t:'Re-run the allocation annually and record decisions taken on it',owner:'Finance'}],
    horizon:'Contribution model in 6–8 weeks', metric:'Contribution per brand after allocated cost; decisions taken on the result' },
  market:{ lever:'Build the demand and white-space view once, centrally, and let every brand draw on it',
    actions:[
      {t:'Commission one category-and-territory view for the portfolio, comparable across brands',owner:'Strategy · Insight'},
      {t:'Apply one demand measure across all brands on a fixed cycle',owner:'Insight'},
      {t:'Make the central view the starting point for every brand category decision',owner:'Platform leads'},
      {t:'Refresh it twice a year and record the decisions it changed',owner:'Insight'}],
    horizon:'One to two quarters', metric:'Category and territory decisions traceable to the central view' },
  gtm:{ lever:'Design the pipeline and price against evidence, so the guarantee is not the only lever',
    actions:[
      {t:'Stand up a central origination function with white-space maps per brand',owner:'Commercial'},
      {t:'Set internal rate and minimum benchmarks by category and territory, and an approval bar for exceptions',owner:'Commercial · Finance'},
      {t:'Review the portfolio pipeline monthly: originated versus inbound, stage, terms against benchmark',owner:'CEO · Commercial'},
      {t:'Decline deals that fail the economics and record it',owner:'Commercial'}],
    horizon:'Pipeline in one quarter · deal-flow effect within two', metric:'Share of deals originated; rate achieved against benchmark; deals declined on economics' },
  operations:{ lever:'One operating machine: capability built once, applied to every brand, surviving departures',
    actions:[
      {t:'Write one licensee operating standard — scorecard, review rhythm, escalation path — and apply it across brands',owner:'Operations'},
      {t:'Identify key-person dependence per brand and name succession for material roles',owner:'CEO · People'},
      {t:'Move approvals and reporting onto shared services where brands duplicate work',owner:'Operations'},
      {t:'Track turnaround and standard adherence across brands and publish internally',owner:'Operations'}],
    horizon:'Standard in one quarter · book quality over one renewal cycle', metric:'Share of the book on a common scorecard; turnaround consistency across brands' },
  finance:{ lever:'Run royalty as an operation: standing audit, bottom-up forecasting, recoveries that compound',
    actions:[
      {t:'Institute a portfolio audit programme on a rolling cycle, largest licensees first, with recovery tracked centrally',owner:'Finance · Legal'},
      {t:'Standardise reporting cadence and format across every licence, with late-report clauses enforced',owner:'Finance'},
      {t:'Build a bottom-up portfolio forecast per licensee and track variance monthly',owner:'Finance'},
      {t:'Feed audit findings into renewal terms as standard',owner:'Commercial'}],
    horizon:'Programme in one quarter · recoveries within two', metric:'Portfolio audit recovery value; reporting lag; forecast variance against actuals' },
  governance:{ lever:'A rhythm that reallocates: brands compared on the same measures, renewals to criteria',
    actions:[
      {t:'Institute a standing portfolio review comparing brands on fixed measures, decisions recorded',owner:'CEO'},
      {t:'Publish renewal and exit criteria that apply across brands',owner:'CEO · Legal'},
      {t:'List every renewal in the next 18 months portfolio-wide with criteria applied now',owner:'Commercial'},
      {t:'Reallocate attention and investment between brands at least once on the evidence, and record it',owner:'CEO'}],
    horizon:'First cycle within one quarter', metric:'Investment or attention reallocated between brands as a recorded outcome; renewals decided to criteria' },
  systems:{ lever:'One data layer before the next brand: the cost of not having it grows with the portfolio',
    actions:[
      {t:'Specify the portfolio data layer: royalty, retail sell-through and contract terms joined by brand, licensee, category, territory',owner:'Systems'},
      {t:'Name a data-quality owner and a reporting standard every licensee must meet',owner:'Systems · Finance'},
      {t:'Build it for the two largest platforms first, then extend',owner:'Systems'},
      {t:'Require a data case for portfolio decisions and record the reversals',owner:'CEO'}],
    horizon:'One to two quarters', metric:'Time to answer a portfolio-wide question; decisions carrying a data case' }
};

/* ══ LICENSEE — the lead licensee's view of the same brand, nine questions ══
   One question per domain, written from the licensee's vantage point. Scored
   on the same scale so it can be laid beside the brand team's answers; where
   the two disagree, that gap is the finding. About ten minutes. */

var LICENSEE_DOMAIN_TEXT = {
  strategy:{ t:'Whether the licensor has given you a plan for this brand you can build against' },
  model:{ t:'How dependent the licensing relationship is on minimums rather than real sell-through' },
  economics:{ t:'Whether the rate and terms feel priced to the category’s real economics' },
  market:{ t:'Whether the licensor can tell you who the consumer is and show demand evidence' },
  gtm:{ t:'Whether the licensor manages channel and territory, or leaves it to you' },
  operations:{ t:'How approvals and support actually work from your side' },
  finance:{ t:'How royalty reporting and verification work from your side' },
  governance:{ t:'Whether renewal and performance conversations follow criteria you know in advance' },
  systems:{ t:'Whether data flows both ways, or is assembled by hand each quarter' }
};

var LICENSEE_QUESTIONS = {
strategy:[['L1 · Plan from the licensor','Has the licensor shared a commercial plan for this brand that your own plans can build against?',[
  ['None','We have never seen a brand plan. We plan around our own category.','No plan shared'],
  ['Informal','Ambitions are discussed in meetings but nothing is written.','Discussed, not documented'],
  ['Shared once','A plan was shared but is not referenced in decisions between us.','Not referenced since'],
  ['Active','A clear plan with priorities that shapes what we are asked to do.','Priorities visible in decisions'],
  ['Joint','We plan against it together and review it quarterly.','Joint quarterly review']]]],
model:[['L2 · Minimums versus sell-through','How does the relationship work economically — are you earning out the minimum, or is overage the norm?',[
  ['Minimums only','We pay the guarantee; overage is rare or never.','No overage'],
  ['Mostly minimums','Overage some years, not most.','Overage occasional'],
  ['Around the line','We land near the minimum; overage is small.','Marginal overage'],
  ['Overage most years','Sell-through regularly exceeds the minimum.','Regular overage'],
  ['Well above','Minimums are immaterial to us; royalty tracks sell-through.','Minimum a formality']]]],
economics:[['L3 · Terms and category economics','Do the rate and terms feel priced to the real economics of the category?',[
  ['Arbitrary','Rates seem set by precedent or negotiation, not the category.','No evidence behind the rate'],
  ['Unreviewed','Set once, never revisited against cost or market.','Rate unchanged for years'],
  ['Roughly right','Broadly fair but never discussed on evidence.','No contribution conversation'],
  ['Evidenced','The licensor has discussed category economics with us and adjusted on it.','Rate adjusted on evidence'],
  ['Jointly modelled','We share contribution data and set terms from it.','Shared economics']]]],
market:[['L4 · Consumer and demand','Can the licensor tell you who the consumer is and show current demand evidence for the brand?',[
  ['Heritage only','The brand is described from its history. No data.','No consumer data shared'],
  ['Vague','A broad description that varies by who we talk to.','Definition varies'],
  ['On paper','A defined consumer exists but does not shape our joint decisions.','Not used in decisions'],
  ['Evidenced','A defined consumer with current data, used in category and range decisions.','Data-backed definition'],
  ['Tracked together','Demand signals are tracked and shared with us on a cycle.','Shared demand tracking']]]],
gtm:[['L5 · Channel and territory management','Does the licensor manage channel and territory for this brand, or leave it to you?',[
  ['Left to us','Distribution is whatever we achieve. No brand-level standard.','No channel standard'],
  ['Loose','Expectations exist but are not enforced.','Standard not enforced'],
  ['Partly','Channel rules for some doors or territories; gaps elsewhere.','Partial standard'],
  ['Managed','A channel plan per territory, approvals required and checked.','Approvals enforced'],
  ['Curated','Active management including exits from misfit doors, with a pipeline into target ones.','Exits and targets visible']]]],
operations:[['L6 · Approvals and support','How do product approvals and licensor support work from your side?',[
  ['Slow and unpredictable','Approvals take weeks and vary widely. We chase.','Turnaround unpredictable'],
  ['Reactive','Faster if we escalate; otherwise slow.','Escalation-driven'],
  ['Adequate','A process exists and mostly works; no measured standard.','Unmeasured'],
  ['Consistent','One standard, turnaround measured, support reliable.','Measured turnaround'],
  ['Excellent','Fast, predictable, and the licensor raises the standard over time.','Standard improving']]]],
finance:[['L7 · Royalty reporting','How does royalty reporting and verification work from your side?',[
  ['Minimal','We report on our own format when asked. No audits in memory.','No defined cadence or audit'],
  ['Periodic','A quarterly report, reconciled by the licensor rarely if at all.','Reconciled rarely'],
  ['Defined','Fixed cadence and format; audits occasional.','Cadence set, audits ad hoc'],
  ['Programme','Fixed cadence, and we have been audited on a programme with findings discussed.','Standing audit'],
  ['Integrated','Near-live reporting and continuous verification; terms adjusted on evidence.','Continuous verification']]]],
governance:[['L8 · Renewal conversations','When renewal or underperformance comes up, do you know the criteria in advance?',[
  ['No idea','Renewal is a negotiation with no stated criteria.','Criteria unknown'],
  ['Implicit','We can guess what matters; nothing is written.','Unwritten'],
  ['Partly','Some criteria stated; others appear during the conversation.','Partial'],
  ['Known','Written criteria we know in advance and are reviewed against.','Criteria known in advance'],
  ['Scheduled','Criteria known, reviews on a rhythm, outcomes predictable.','Predictable outcomes']]]],
systems:[['L9 · Data both ways','Does data flow between you and the licensor, or is it assembled by hand each quarter?',[
  ['By hand','We compile spreadsheets on request. Nothing comes back.','Manual, one-way'],
  ['One-way','We report; we see nothing of the brand picture.','No data returned'],
  ['Some','Some shared reporting, not current or complete.','Partial sharing'],
  ['Shared view','A current, trusted view both sides use.','Shared current view'],
  ['Integrated','Systems connected; data flows without manual work.','Integrated systems']]]]
};

var UI_CONFIDENCE = [
  { k:'evidenced', label:'Evidenced', desc:'A document, system or report exists that someone outside the team could check.' },
  { k:'reasoned',  label:'Reasoned',  desc:'No single source, but the team could reconstruct it from what it knows.' },
  { k:'estimated', label:'Estimated', desc:'Best judgement. Nothing underlying it we could produce on request.' }
];



/* ── Tier 3: the line cut ─────────────────────────────────────────────────
   A brand-level constraint has no owner until it is placed against a line.
   The line cut is six questions — two each from the three domains where
   lines genuinely diverge — plus the contract facts that cannot be inferred.
   It produces THREE DOMAIN READS AND A WEAKEST LINK, never an index: an
   index at line level would invite comparison against brand indices, which
   would be a category error. About eight minutes, answered by whoever owns
   the line.                                                              */
var LINE_DOMAINS = [
  { key:'model', name:'Income quality & dependency', short:'Income', role:'Primary', weight:0, field:'BusinessModelScore',
    t:'How this line earns and who it depends on. A line floored by a minimum with one counterparty is a different asset from one earned on sell-through with options held.' },
  { key:'economics', name:'Line economics & terms', short:'Economics', role:'Primary', weight:0, field:'ProductsScore',
    t:'Whether the true contribution of this line is known, and whether its current terms were priced or inherited.' },
  { key:'gtm', name:'Channel fit & growth path', short:'Channel', role:'Primary', weight:0, field:'GoToMarketScore',
    t:'Whether the line is distributed by design, and where its next unit of income comes from.' }
];

var LINE_QUESTIONS = {
  model:[
    ['LQ1 · Income quality','How does this line actually earn — floored by a contractual minimum, or earned on real sales?',[
      ['Guarantee only','Income is the minimum. Sales would have to multiply before anything more was owed.','No overage ever paid on this line'],
      ['Mostly floor','Occasional overage in a good year; the guarantee is the plan.','Overage in fewer than one year in three'],
      ['Mixed','Guarantee and overage both matter; neither dominates.','Overage between 10% and half of line income'],
      ['Earned','The minimum is a formality; income tracks sell-through.','Overage is most of line income'],
      ['Priced on evidence','Terms are reset on sell-through evidence at each renewal.','Rate or minimum changed on evidence at last renewal']]],
    ['LQ2 · Counterparty dependency','If the counterparty holding this line walked away at term end, what would happen to the line?',[
      ['Line dies','No one else could hold it; the income would stop.','No alternative identified'],
      ['Long rebuild','An alternative might exist; finding and signing one would take a year or more.','Rebuild would take beyond a year'],
      ['Painful but survivable','A period of lost income while a known alternative was signed.','Alternative known, terms not explored'],
      ['Replaceable','Credible alternatives are known and their likely terms understood.','Replacement scenario written down'],
      ['Optionality held','More than one party could hold this line tomorrow, and the terms are benchmarked.','Competing interest at the last renewal']]]
  ],
  economics:[
    ['LQ3 · Line contribution','Is the true contribution of this line known — the income earned against the cost to serve it?',[
      ['Unknown','Income is known; the cost of approvals, samples, marketing and management time is not.','No cost-to-serve view for this line'],
      ['Anecdotal','A sense of whether the line pays its way, nothing written.','Judgement only'],
      ['Estimated annually','A yearly estimate, not maintained between cycles.','Estimate over a year old'],
      ['Measured','Contribution for this line is calculated and reported.','Contribution reported for this line'],
      ['Managed','Contribution drives decisions on this line.','A term or price changed on contribution evidence']]],
    ['LQ4 · Terms discipline','How were this line\u2019s current terms set?',[
      ['Inherited','Rolled over from the previous term; no one priced them.','Terms unchanged over two renewals'],
      ['Negotiated blind','Set in negotiation without a view of contribution or comparables.','No pricing basis on file'],
      ['Referenced','Set with some reference to comparable deals.','Comparables cited, no model'],
      ['Priced','Modelled against contribution and comparables before signing.','Pricing model on file'],
      ['Tested','Priced, and tested against a walk-away position and an alternative counterparty.','Walk-away recorded before the negotiation']]]
  ],
  gtm:[
    ['LQ5 · Channel fit','Is this line in the channels and territories where it should be, and out of the wrong ones?',[
      ['Wherever it landed','Distribution is the accumulated history of past deals.','No channel review on record'],
      ['Known gaps','The misfit channels are known; nothing has been done.','Misfits named, unaddressed'],
      ['Partly managed','The largest channels are deliberate; the tail is not.','Tail unreviewed'],
      ['Deliberate','The channel list is actively managed and erosive channels exited.','A channel exited in the last two years'],
      ['Designed','A channel and territory plan drives the counterparty\u2019s distribution.','Distribution plan agreed annually']]],
    ['LQ6 · Growth path','Where does the next unit of income on this line come from?',[
      ['Nowhere named','The line earns what it earns.','No growth plan for the line'],
      ['Hope','More of the same, if the market allows.','Growth assumed, not planned'],
      ['Identified','Growth levers are named but not resourced.','Levers listed, no owner'],
      ['Planned','A growth plan exists with an owner and a date.','Plan with owner and date'],
      ['In motion','Growth actions are underway and measured against the plan.','Measured progress against the plan']]]
  ]
};

/* The contract facts. Captured, never scored — a fact is not a maturity. */
var LINE_CONTRACT = {
  rateBasis:['Royalty on wholesale','Royalty on retail','Fixed fee','Revenue or profit share','Owned margin — no licence'],
  minimum:['No minimum','Minimum below likely earnings','Minimum at about likely earnings','Minimum above likely earnings — it floors the income'],
  territory:['Single country','One region','Multi-region','Global'],
  exclusivity:['Exclusive in category and territory','Exclusive in category only','Non-exclusive'],
  renewal:['Within 12 months','1\u20132 years','2\u20133 years','Over 3 years','No fixed term'],
  audit:['Never audited','Audited over two years ago','Audited within two years','Standing audit programme','Not applicable \u2014 no royalty'],
  trademark:['Not checked','Gaps known in licensed territories','Registered in core territories only','Registered in all licensed territories and categories','Not applicable']
};

/* ── Operating modes ──────────────────────────────────────────────────────
   A brand is not always a licensing book. The mode is declared at the start
   of the assessment and does two things: it swaps the questions that presume
   a royalty for operated-economy variants of the SAME construct, and it
   gates which context rules can fire. The domains, weights and scoring are
   untouched — an operated brand and a licensed brand remain comparable
   because each is asked the version of the question that is true of it.  */
var BRAND_MODES = [
  { key:'single',   label:'Single core licence',
    hint:'One operating partner holds the book (e.g. a global core licensee)' },
  { key:'multi',    label:'Multi-licence',
    hint:'Several licensees across categories or territories' },
  { key:'breadth',  label:'Licensing at breadth',
    hint:'A large licensee book — tens of partners across many categories' },
  { key:'multiline',label:'Multi-line',
    hint:'Product plus media, publishing, services or hospitality lines' },
  { key:'operated', label:'Operated',
    hint:'Owned retail or operations rather than licensed manufacture' }
];

/* Question variants, keyed domain:index. Only the operated mode swaps text —
   the licensing wording is correct for the other four. Each variant holds
   the same construct at the same five thresholds, so a level 3 answer means
   the same maturity whichever wording was asked.                          */
var BRAND_QUESTION_VARIANTS = {
  operated: {
    'strategy:1': ['Q1B · Decision discipline',
      'When an expansion opportunity arrives for this brand — a site, a category, a channel — how is the decision made?',
      [['Say yes to what pays','If the headline revenue is right, we take it. Fit is a secondary conversation.','Projected revenue is the deciding factor'],
       ['Informal','Discussed case by case; the outcome depends on who is in the room.','No written criteria'],
       ['Loose priorities','A general sense of what fits, but exceptions are frequent on larger commitments.','Criteria overridden on most large decisions'],
       ['Tested against plan','Most opportunities are tested against the plan before commitment. We decline misfits.','Documented declines in the last twelve months'],
       ['Disciplined filter','Every opportunity scored against explicit criteria. We decline more than we approve.','More declined than approved, on record']]],
    'model:1': ['Q2B · Concentration risk',
      'If this brand’s largest revenue channel or location was lost tomorrow, what would happen?',
      [['Existential','The brand would effectively stop earning.','Largest channel is most of the income'],
       ['Serious damage','A major hole with no ready replacement.','No replacement identified'],
       ['Painful but survivable','We would cover a period while rebuilding elsewhere.','Rebuild would take quarters'],
       ['Manageable','Other channels would keep the brand stable while we adjusted.','Other channels can absorb it'],
       ['Absorbed','No single channel or location is more than a quarter of income.','No channel above a quarter of income']]],
    'operations:1': ['Q6B · Delivery consistency',
      'Does the operation run to a standard, or to availability?',
      [['Ad hoc','Whenever someone gets to it. Standards vary by site and by week.','No operating standard'],
       ['Reactive','Driven by whoever is chasing hardest.','Priority set by escalation'],
       ['Partly standardised','A standard exists and is followed at the largest sites or channels.','Standard applied to majors only'],
       ['Consistent','One standard applied across the operation, with performance measured.','Performance measured against a target'],
       ['Managed','Standards met consistently and raised deliberately over time.','Standard raised in the last year']]],
    'finance:0': ['Q7A · Revenue visibility and verification',
      'How current and how verified is the view of this brand’s income?',
      [['Lagged and unreconciled','Revenue is known when the accounts close; channels are rarely reconciled against source.','Close later than day 15; no reconciliation cycle'],
       ['Monthly rear-view','A reliable monthly close. Margin and shrink are checked occasionally.','Monthly close; spot checks only'],
       ['Current for majors','Daily sales visible on the main channels; the tail — marketplaces, wholesale — lags.','A channel lagging or unverified'],
       ['Current and verified','Timely across every channel, with standing reconciliation and margin verification.','Reconciliation calendar with tracked variances'],
       ['Assured','Near-live revenue and margin by channel, continuously verified; prices and terms adjusted on the evidence.','Prices or terms changed on verification evidence']]],
    'governance:0': ['Q8A · Underperformance discipline',
      'What happens when a category, site or channel on this brand underperforms?',
      [['Rollover','Underperformers are carried to protect the top line.','No closures or exits on record'],
       ['Reluctant','Discussed, rarely acted on. Closure is avoided.','Discussed, not acted on'],
       ['Selective','Action taken in a crisis rather than to criteria.','Action only in crisis'],
       ['Criteria-led','Written criteria govern fix, shrink or exit, applied consistently.','Written criteria applied to underperformers'],
       ['Actively curated','The estate improves each cycle by design; closures and repositions happen on schedule.','Scheduled closures or repositions']]]
  }
};

/* Resolve the question set for a mode. Returns a NEW object; the base set
   is never mutated, so two calls with different modes cannot bleed.      */
function questionsForMode(baseQuestions, mode){
  var v = BRAND_QUESTION_VARIANTS[mode];
  if (!v) return baseQuestions;
  var out = {};
  for (var k in baseQuestions){
    out[k] = baseQuestions[k].map(function(q, i){
      return v[k + ':' + i] || q;
    });
  }
  return out;
}

/* ── Level-conditioned playbooks ──────────────────────────────────────────
   The static play says what good looks like. These say what to do NEXT,
   from where the subject actually is. The key is the CURRENT level; the
   actions carry it to the next observable threshold in the instrument.
     1 → 2  make it exist        2 → 3  make it consistent
     3 → 4  make it evidenced    4 → 5  make it decide things
   Level 5 has no band: there is nothing to close.                        */
var BRAND_PLAY_BANDS = {
strategy:{
 1:{focus:'Nothing is written, so every deal is judged on its own merits and the book drifts by accretion. The first job is a stated position, not a strategy document.',
    actions:[{t:'Write one page: what this brand is for commercially, the three categories it should be in, and the two it should not',how:'A two-hour session, brand lead and commercial in the room, one page out: the sentence, three categories in, two out. If it needs a deck it is not yet clear.',owner:'Brand lead'},
             {t:'Mark every live licence against that list — fit, tolerate, exit',how:'Take the licence list, add one column, mark each fit / tolerate / exit in a single sitting. Disagreements go on the page — they are the finding.',owner:'Commercial'},
             {t:'Take the page to the next platform review and get the category list agreed rather than admired',how:'Ten minutes on the agenda, decision requested: is this the category list, yes or no. Amendments recorded on the page; from then on it is the reference.',owner:'Platform lead'}],
    horizon:'One page in two weeks · agreed at the next review', metric:'A written category position exists and the live book is marked against it'},
 2:{focus:'The intent exists in people’s heads and holds while they are in the room. It becomes useful the moment it is written down and can be argued with.',
    actions:[{t:'Turn the working assumptions into a three-year plan with a revenue target for each priority category',how:'Half-day working session: the brand lead puts a revenue number and a date against each priority category on one page; circulate inside a week; sign off at the next platform review.',owner:'Brand lead'},
             {t:'Write the deal criteria — fit, economics, channel — and the decline rule, before the next approach arrives',how:'Five tests on one page — fit, minimum economics, channel — plus the sentence used to decline. Agree it with commercial before the next inbound arrives, not after.',owner:'Brand lead · Commercial'},
             {t:'Record the next three inbound decisions against the criteria, including the declines',how:'A one-line log per decision: opportunity, criterion applied, taken or declined, by whom. Three entries builds the habit; the log lives with commercial.',owner:'Commercial'}],
    horizon:'Plan in 6–8 weeks · effect from the next deal cycle', metric:'Decisions taken and declined against written criteria, on record'},
 3:{focus:'The plan is stated but nothing yet proves it is being followed. Attach numbers and dates to it, and make the declines visible.',
    actions:[{t:'Attach a revenue number, a date and a named owner to each priority category',owner:'Brand lead'},
             {t:'Review the plan quarterly against actual royalty by category and record what changed as a result',owner:'Platform lead'},
             {t:'Publish the declines: which opportunities were refused, and on which criterion',owner:'Commercial'}],
    horizon:'From the next quarterly review', metric:'Plan-to-actual by category, with declines recorded against criteria'},
 4:{focus:'The plan works and is reviewed. The remaining gain is making it drive origination and budget rather than describe them afterwards.',
    actions:[{t:'Build next year’s licensee approach list from the category plan, not from last year’s inbound',owner:'Commercial'},
             {t:'Run an annual white-space review against the plan and move origination effort to the gaps',owner:'Commercial'},
             {t:'Explain plan-to-actual variance by decision taken, not by market conditions',owner:'Brand lead'}],
    horizon:'Next planning cycle', metric:'Origination effort allocated against plan gaps and traceable to it'}},
model:{
 1:{focus:'The income structure is unknown, so dependency cannot be managed — only discovered, usually at renewal. The first job is to see it.',
    actions:[{t:'Pull royalty by licensee and by category for the last eight quarters into one sheet',how:'Finance exports what exists — royalty by licensee by quarter — into one sheet, gaps left visible. Two days of assembly, no new system.',owner:'Finance'},
             {t:'Name two numbers: how much income depends on the largest licensee, and how much is guaranteed minimums rather than sales above them',how:'Two cells on that sheet: the largest licensee’s share of income, and guaranteed minimums as a share of income. Write them on the cover — they are the brand’s risk position in two numbers.',owner:'Finance'},
             {t:'Put both in front of the brand lead and the platform lead this quarter',how:'Fifteen minutes at the next brand review: the two numbers, the trend, one question — are we comfortable? Minute the answer.',owner:'Brand lead'}],
    horizon:'Four weeks', metric:'Reliance on the largest licensee, and the guarantee share, known and reported'},
 2:{focus:'The shape is roughly known but nothing acts on it. Set the limit you will not cross, and build the alternative before you need it.',
    actions:[{t:'Set a limit on how much income can come from one licensee, and a date by which the limit is met',how:'One sentence agreed at platform level: no licensee above a set share of brand income by a set date. The number matters less than its existence — it forces the next two moves.',owner:'Platform lead'},
             {t:'Write the replacement scenario for the largest licensee — who else could hold it, at what terms, on what timeline',how:'One page, written cold: three candidate licensees, realistic terms, time to first shipment. Commercial drafts, the brand lead pressure-tests, and it is filed where renewal planning happens.',owner:'Commercial'},
             {t:'Name two neighbouring categories that could carry income if the biggest licence ended',how:'An hour against the category plan: name two neighbouring categories with real demand behind them, and the type of licensee that could hold each.',owner:'Commercial'}],
    horizon:'One quarter', metric:'A stated limit on single-licensee reliance, and a written replacement scenario'},
 3:{focus:'Dependency is managed, but income is still floored by guarantees rather than earned through sell-through. Guarantees pay the same whether the brand sells or not.',
    actions:[{t:'Model the next renewal both ways — lower guarantee with a real overage rate, against the current structure — before opening it',owner:'Commercial · Finance'},
             {t:'Open two new licensee conversations before the dominant renewal window, not during it',owner:'Commercial'},
             {t:'Track overage as a share of royalty quarterly; it is the measure that says the brand is actually selling',owner:'Finance'}],
    horizon:'Ahead of the next renewal window', metric:'Overage share of royalty rising against a fixed baseline'},
 4:{focus:'Income is diversified and earned. The remaining work is designing the shape you want rather than defending the one you have.',
    actions:[{t:'Set target income shape by category and territory three years out, and originate against the gap',owner:'Commercial'},
             {t:'Stress-test the book: model the loss of the two largest licensees and hold the plan that survives it',owner:'Finance'},
             {t:'Use concentration and overage share as standing inputs to renewal terms',owner:'Commercial'}],
    horizon:'Annual', metric:'Book survives a modelled loss of the two largest licensees'}},
economics:{
 1:{focus:'No category-level view exists, so the brand cannot tell a profitable licence from a busy one. Royalty income and profit after support costs are not the same number.',
    actions:[{t:'Build the first category profit view: royalty earned by category against what it costs to support it',how:'One sheet, one row per category: royalty in, then hours and direct costs against it — estimates marked as estimates. Finance owns the sheet; a week of effort.',owner:'Finance'},
             {t:'Count the approvals, samples and reviews each category consumed last year',how:'Pull twelve months from the approvals inbox or tracker and tally per category. A day of counting that usually reorders the whole profit ranking.',owner:'Ops'},
             {t:'Rank categories by profit and show the bottom three to the brand lead',how:'Sort the sheet and take the bottom three to the brand lead with one question each: fix the price, fix the cost, or exit? Minute the answers.',owner:'Finance'}],
    horizon:'Six weeks', metric:'Profit by category exists and the bottom three are named'},
 2:{focus:'Part of the picture exists but nothing is decided on it. Complete it, then set the line below which a category is not worth carrying.',
    actions:[{t:'Work out the support cost for every live category, including the small ones that eat review time',how:'Extend the sheet to every live category with one method — same cost lines, same period — so small licences stop hiding inside the average. Two to three weeks alongside the day job.',owner:'Finance · Ops'},
             {t:'Set a minimum profit line: any category earning less after costs is fixed, repriced or exited',how:'Agree one number with the platform lead: the profit below which a category cannot carry on as it is. Write it into the deal criteria so new signings inherit it.',owner:'Brand lead'},
             {t:'Test every current category against that line and list the ones that fail',how:'Run every category against the number and write the failure list with a proposed action per line — reprice, restructure or exit. That list is next quarter’s agenda.',owner:'Finance'}],
    horizon:'One quarter', metric:'A stated threshold, and the failing categories listed'},
 3:{focus:'The view exists and is trusted, but decisions still happen beside it rather than from it. Bring it into the room where terms are set.',
    actions:[{t:'Take contribution by category into the next three renewal conversations as the opening position',owner:'Commercial'},
             {t:'Reprice or restructure the two lowest-contributing categories and record what changed',owner:'Commercial'},
             {t:'Report contribution alongside royalty in the quarterly pack so both are seen together',owner:'Finance'}],
    horizon:'Next three renewals', metric:'Terms changed on contribution evidence, on record'},
 4:{focus:'Decisions already use it. The gain now is pricing forward rather than reviewing backward.',
    actions:[{t:'Model rate scenarios by category before renewal opens, and set the walk-away in advance',owner:'Commercial · Finance'},
             {t:'Exit or renegotiate every below-threshold category on a published schedule',owner:'Brand lead'},
             {t:'Let contribution decide which categories receive origination effort next year',owner:'Commercial'}],
    horizon:'Annual', metric:'No category below threshold without a dated decision against it'}},
market:{
 1:{focus:'The brand is being sold on memory. Without a defined consumer and a baseline, category debate is opinion and investment follows whoever argues hardest.',
    actions:[{t:'Write the consumer definition in one page from current data — sell-through, retailer data, branded search, social — not from heritage',how:'Half a day with the data that exists — sell-through, retailer feedback, branded search, social: write who buys this brand today, on one page, dated. Heritage claims stay out unless the data supports them.',owner:'Brand lead · Insight'},
             {t:'Choose three demand signals to track and fix a start date',how:'Pick three signals you can actually pull monthly — branded search volume, sell-through at the largest retailer, reorder rate are the usual candidates. Owner and start date on the page.',owner:'Insight'},
             {t:'Show the definition to the two largest licensees and record where they disagree',how:'A thirty-minute call with each: here is who we say the consumer is — where do you disagree? Their sell-through data usually settles it; record the differences.',owner:'Commercial'}],
    horizon:'Definition in four weeks · baseline start dated', metric:'A written consumer definition and three signals with a fixed start date'},
 2:{focus:'A definition exists but nothing measures against it, so movement cannot be told from noise.',
    actions:[{t:'Set the baseline: three tracked signals, a fixed start date and a named owner',how:'One dashboard row per signal: value, date, owner. The first reading is the baseline — it does not need to be good, it needs to be fixed and dated.',owner:'Insight'},
             {t:'Test the next category and territory decisions against the definition on paper; record the misfits',how:'Before the next category or territory signing, one paragraph: does this fit the definition on paper? File the misfits — they are the evidence the definition works, or the case for changing it.',owner:'Commercial'},
             {t:'Review the baseline quarterly and attribute movement to named initiatives',how:'Fifteen minutes at the quarterly review: what moved, which initiative claims it, what claims nothing. Unattributed movement is noise — say so on the record.',owner:'Brand lead'}],
    horizon:'Baseline in six weeks · direction visible within two quarters', metric:'Tracked signals moving against a fixed baseline'},
 3:{focus:'The baseline is real but advisory. Make it a gate rather than a chart.',
    actions:[{t:'Require the consumer definition in every new category submission, and refuse those that miss it',owner:'Brand lead'},
             {t:'Compare signal movement against licensee sell-through and name the divergences',owner:'Insight'},
             {t:'Bring the baseline into pricing and positioning conversations, not only marketing ones',owner:'Commercial'}],
    horizon:'From the next submission cycle', metric:'Category submissions gated on the consumer definition'},
 4:{focus:'Demand is evidenced and used. The gain now is using it to hold price and to plan with partners.',
    actions:[{t:'Use the baseline to define the price positioning the brand defends by territory \u2014 tier and channel, never resale prices, which are the licensee\u2019s to set',owner:'Commercial'},
             {t:'Forecast category demand and hold licensees to it in the sell-in plan',owner:'Insight · Commercial'},
             {t:'Publish the baseline to the licensee book so partners plan against the same picture',owner:'Brand lead'}],
    horizon:'Next sell-in cycle', metric:'Positioning held \u2014 premium tier maintained, discount-channel exposure falling \u2014 and licensee plans built on the shared baseline'}},
gtm:{
 1:{focus:'The pipeline is whoever happened to call. A brand that only answers the phone gets the categories other people thought of.',
    actions:[{t:'Map the white space: the categories and territories this brand could hold and does not',how:'A grid on one page: categories down, territories across, each cell marked held, within reach, or empty. Commercial drafts it in a day from the licence list and the category plan.',owner:'Commercial'},
             {t:'Build a first target list of ten licensees against those gaps',how:'For each gap, name licensees already shipping that category at the right price point — trade shows, retail shelves and competitors’ books are the sources. Ten names, one reason each.',owner:'Commercial'},
             {t:'Set a monthly routine for approaching new licensees, with a named owner',how:'One hour, same day each month, named owner: who was approached, who replied, the next ten to contact. Without a fixed slot in the diary this dries up within a quarter.',owner:'Platform lead'}],
    horizon:'Map in four weeks · first approaches within the quarter', metric:'A target list against named gaps, worked monthly'},
 2:{focus:'New licensees are found ad hoc, and keen partners get further than good ones.',
    actions:[{t:'Test every prospect against the deal criteria and drop the ones that do not fit, however keen they are',how:'Run every live prospect through the deal criteria in one sitting and cut the ones that fail, however keen the other side is. A short true pipeline converts better than a long hopeful one.',owner:'Commercial'},
             {t:'Set conversion targets by stage and review them monthly',how:'Define the stages once — approach, meeting, term sheet, signed — and set a target rate per stage from last year’s actuals. Review the funnel against them monthly.',owner:'Commercial'},
             {t:'Name the two sales channels that drag the royalty rate down and stop offering the brand there',how:'Rank channels by the royalty rate they actually deliver and how they fit the brand; name the two worst; stop offering the brand there, and put the decision in writing so it survives the next tempting approach.',owner:'Brand lead'}],
    horizon:'One quarter', metric:'Pipeline qualified against criteria, with stage conversion tracked'},
 3:{focus:'Origination is systematic but still shaped by who is available rather than by the plan.',
    actions:[{t:'Rebuild the target list from the three-year category plan rather than from who has approached',owner:'Commercial'},
             {t:'Run structured approaches into the top five gaps with a defined pitch and terms range',owner:'Commercial'},
             {t:'Track origination cost per closed licence and use it to size next year’s effort',owner:'Finance'}],
    horizon:'Next origination cycle', metric:'Closed licences traceable to named plan gaps'},
 4:{focus:'Origination is designed and converting. Sequence it by value and take the friction out of closing.',
    actions:[{t:'Sequence origination by contribution potential, highest-value gap first',owner:'Commercial'},
             {t:'Pre-agree terms ranges by category so deals close without renegotiating principles each time',owner:'Legal · Commercial'},
             {t:'Feed closed-deal learning back into the category plan quarterly',owner:'Brand lead'}],
    horizon:'Annual', metric:'Time to close falling with terms held inside pre-agreed ranges'}},
operations:{
 1:{focus:'There is no stated standard, so licensees cannot meet one and cannot fairly complain. Approval drag is a commercial cost that never appears as one.',
    actions:[{t:'Measure current approval turnaround for one month; count the queue and the age of the oldest item',how:'Log every approval in and out for one month — a shared sheet is enough. Report three numbers: median days, queue length, age of the oldest item. No process change yet; just the measure.',owner:'Ops'},
             {t:'Write the service standard the licence book actually requires — turnaround times, review schedule, escalation',how:'One page: turnaround targets by submission type, review schedule, escalation route. Written by whoever runs approvals, agreed by the brand lead.',owner:'Ops · Brand lead'},
             {t:'Tell the licensees what the standard is',how:'A short note to every licensee: the standard, when it starts, the escalation route. Service failures licensees cannot see look like indifference.',owner:'Brand lead'}],
    horizon:'Six weeks', metric:'A published standard and a measured baseline turnaround'},
 2:{focus:'A standard exists but is not resourced, so it is met for the loudest licensees and missed for the rest.',
    actions:[{t:'Resource against the standard and show the gap in people or process terms',how:'Turn the month of measurement into a load statement — submissions per week against hours available. State the gap in people or process terms and put the ask to the platform lead.',owner:'Platform lead'},
             {t:'Put approval turnaround on the monthly pack with a target and an actual',how:'One line on the monthly pack: target, actual, trend. What leadership sees monthly gets fixed; what is measured privately gets deferred.',owner:'Ops'},
             {t:'Triage: define which submissions are fast-tracked and which need full review',how:'Two lanes, defined in writing: fast-track for repeat products and packaging that has already passed, full review for the rest. Most queues are full of items that never needed full review.',owner:'Ops'}],
    horizon:'One quarter', metric:'Turnaround inside standard for the whole book, not the largest partners'},
 3:{focus:'The standard is met, but the function is reactive — it approves what arrives instead of shaping what is submitted.',
    actions:[{t:'Move from approving submissions to briefing categories ahead of them',owner:'Brand lead'},
             {t:'Run a structured review with the top five licensees twice a year against agreed measures',owner:'Commercial'},
             {t:'Track where approvals are rejected and fix the brief that produced them',owner:'Ops'}],
    horizon:'Two review cycles', metric:'Rejection rate falling against an unchanged standard'},
 4:{focus:'Service is proactive. Use what it knows about licensee capability commercially.',
    actions:[{t:'Publish a forward brief per category so licensees design to it rather than submitting into it',owner:'Brand lead'},
             {t:'Use approval and rework data to separate licensees who need support from those who need replacing',owner:'Ops · Commercial'},
             {t:'Make service performance a renewal criterion on both sides',owner:'Legal'}],
    horizon:'Annual', metric:'Licensee capability judgements evidenced by service data at renewal'}},
finance:{
 1:{focus:'Income is self-reported, late and unverified. Everything downstream — forecasting, renewal terms, category decisions — is being built on a number nobody has checked.',
    actions:[{t:'Get a complete statement from every licensee for the last four quarters, in one format',how:'Send every licensee the same template with a return date; log what comes back and what does not. The non-returns are the first finding.',owner:'Finance'},
             {t:'Commission one audit on the largest licensee; it is the fastest way to learn what the statements leave out',how:'Instruct a royalty specialist on the largest licensee — contingency terms are common. Instruction to findings is usually a quarter, and the findings letter teaches you what every other statement leaves out.',owner:'Finance'},
             {t:'Set the reporting schedule and format in writing and send it to every licensee',how:'One page to the whole book: format, due dates, and the late-statement consequences already in the contract. Enforcement can be gentle; the standard cannot be unwritten.',owner:'Finance · Legal'}],
    horizon:'One quarter · first audit findings within two', metric:'Complete statements in one format, and one audit completed'},
 2:{focus:'Statements arrive but are rarely checked, so what the contract says is owed and what was actually paid are never compared.',
    actions:[{t:'Check every royalty statement against the contract’s rates and minimums, and list every difference',how:'Line each statement against the contract’s rate, minimums and territory in one sheet, quarterly. Every difference gets a line and an owner — most are honest errors, which is the point.',owner:'Finance'},
             {t:'Start a rolling audit programme covering the largest licensees on a two-year cycle',how:'Rank licensees by royalty and schedule the top tier over two years, two audits a year. Announce the programme to the book — announced audits change statements before anyone visits.',owner:'Finance'},
             {t:'Track money recovered as its own line, so the programme’s cost is read beside what it returns',how:'One line in the brand P&L: audit recoveries year to date. When leadership can read recoveries beside the programme’s cost, continuing it becomes an evidence-based decision rather than a discretionary one.',owner:'Finance'}],
    horizon:'Programme running within a quarter', metric:'Differences listed and money recovered tracked'},
 3:{focus:'The majors are current and the tail is opaque — which is where unverified income usually sits.',
    actions:[{t:'Close the tail: bring the smaller licensees onto the same cadence and format',owner:'Finance'},
             {t:'Set audit triggers — underperformance against forecast, category expansion, pre-renewal',owner:'Finance'},
             {t:'Report royalty against forecast monthly for the top ten, not quarterly',owner:'Finance'}],
    horizon:'Two quarters', metric:'Whole book on one cadence, with audit triggers defined'},
 4:{focus:'Income is verified across the book. Turn verification from a recovery exercise into a negotiating position.',
    actions:[{t:'Use audit findings to renegotiate terms, not only to recover — reporting clauses, audit rights, interest on underpayment',owner:'Legal · Commercial'},
             {t:'Move the largest licensees to data feeds rather than statements',owner:'Systems · Finance'},
             {t:'Forecast royalty by licensee with a variance range that survives a renewal negotiation',owner:'Finance'}],
    horizon:'Next renewal cycle', metric:'Terms improved on audit evidence, on record'}},
governance:{
 1:{focus:'Renewal is a negotiation with no stated criteria, which means it is decided by relationship and timing. Licences renew because nobody built the case not to.',
    actions:[{t:'Write the renewal criteria — performance, investment, service, fit — before the next renewal opens',how:'One page, four headings — performance, investment, service, fit — with a pass mark per heading. Drafted by the brand lead, agreed with legal, in force before the next renewal window opens.',owner:'Brand lead · Legal'},
             {t:'Put every licence and its expiry date on one calendar',how:'One list: licensee, category, expiry, notice date. An afternoon with the contract files — and the notice-date column is the one that prevents renewals by default.',owner:'Legal'},
             {t:'Name who decides renewal and who is consulted',how:'Write the decision rule: who decides, who is consulted, who is informed — one line per renewal size. Ambiguity here is how renewals roll over unexamined.',owner:'Platform lead'}],
    horizon:'Four weeks', metric:'Written criteria, a single expiry calendar and a named decision owner'},
 2:{focus:'The criteria are understood but unwritten, so they cannot be cited in a conversation or defended after one.',
    actions:[{t:'Publish the criteria to the licensee book so partners know what they are reviewed against',how:'Send the criteria page to every licensee with one covering line: this is what renewal is decided against. Partners who know the test invest toward it.',owner:'Brand lead'},
             {t:'Review every licence expiring in the next eighteen months against the criteria now',how:'One sitting: every licence expiring inside eighteen months, scored against the criteria now, while terms are still open. Output is three lists — renew, renegotiate, exit.',owner:'Commercial'},
             {t:'Record the decision and the reason for each; a renewal with no recorded reason is a default',how:'One line per decision in the renewal log: outcome, criterion, decider, date. The log is what turns governance from opinion into record.',owner:'Legal'}],
    horizon:'One quarter', metric:'Every near-term renewal reviewed with a recorded reason'},
 3:{focus:'Criteria are stated but applied unevenly, and criteria never enforced are not criteria.',
    actions:[{t:'Put renewal decisions on a fixed calendar, with the decision date twelve months before expiry',owner:'Legal'},
             {t:'Require an evidenced score on each criterion; opinion alone does not carry a renewal',owner:'Brand lead'},
             {t:'Execute at least one non-renewal where the criteria fail',owner:'Platform lead'}],
    horizon:'Next renewal cycle', metric:'Decisions dated twelve months out and evidenced against each criterion'},
 4:{focus:'Renewal is predictable and evidenced. Use it as the moment the diagnosed constraint actually gets fixed.',
    actions:[{t:'Treat the constraint diagnosis as a renewal input — renew into the fix rather than around it',owner:'Brand lead'},
             {t:'Set terms differentially by criterion performance rather than by precedent',owner:'Commercial'},
             {t:'Review annually which criteria actually predicted licensee performance, and drop the ones that did not',owner:'Platform lead'}],
    horizon:'Annual', metric:'Terms differentiated by evidenced criterion performance'}},
systems:{
 1:{focus:'Everything is assembled by hand each quarter, so the view is always out of date by the time it is read. This domain rarely binds on its own — it makes every other fix slower.',
    actions:[{t:'List where royalty, sell-through and contract data live today, and who holds each',how:'One page: each data type, where it sits, who owns it, how current it is. Two days of asking — the gaps and duplications on that page are the systems strategy.',owner:'Systems'},
             {t:'Standardise the royalty statement template across the book; one format is worth more than one system',how:'Pick the best statement format in the book, make it the template, and phase it in at each renewal or quarter-end.',owner:'Finance'},
             {t:'Put contract key terms — rate, minimum, territory, expiry — into one structured record',how:'A table with one row per licence: rate, minimum, territory, expiry, audit right. About a week from the contract files — it becomes the reference everything else joins to.',owner:'Legal'}],
    horizon:'One quarter', metric:'One structured contract record and one statement format'},
 2:{focus:'Systems exist but do not talk to each other, so what is owed and what was paid are compared by hand, if at all.',
    actions:[{t:'Join royalty and contract records so what each licensee owes and what they paid compare automatically',how:'Put the royalty statements beside the contract table so what was owed and what was paid sit in one view — a spreadsheet is fine to start. Every mismatch it finds is money to chase, and the argument for better tooling.',owner:'Systems · Finance'},
             {t:'Set one definition of each measure so brand, finance and platform report the same number',how:'A one-page dictionary: each measure, how it is calculated, where the number comes from — agreed once between brand, finance and platform. The recurring arguments it ends are themselves the return.',owner:'Finance'},
             {t:'Automate the quarterly pack; the effort of assembly is what stops it being current',how:'Template the pack against the joined view so refresh is hours, not days. The test: an analyst can produce it on the first morning of the quarter.',owner:'Systems'}],
    horizon:'Two quarters', metric:'Owed-versus-paid differences flagged automatically'},
 3:{focus:'The data is joined but not current, and a view someone has to request is not a current view.',
    actions:[{t:'Move the top licensees to structured data submission rather than documents',owner:'Systems'},
             {t:'Set a refresh cadence per source and show staleness on the view itself',owner:'Systems'},
             {t:'Give brand leads self-service access',owner:'Systems'}],
    horizon:'Two quarters', metric:'Self-service access with visible data age'},
 4:{focus:'The view is current and shared. Make it act rather than report.',
    actions:[{t:'Feed sell-through data back to licensees so the shared view improves both sides’ planning',owner:'Commercial'},
             {t:'Add alerting on royalty variance, approval ageing and renewal windows',owner:'Systems'},
             {t:'Connect the view to the assessment so re-assessment reads from data rather than recall',owner:'Systems'}],
    horizon:'Annual', metric:'Alerts firing on the measures that matter, acted on and closed'}}
};

/* ── Context rules ────────────────────────────────────────────────────────
   A domain score says where the brand is. The revenue architecture says
   what that costs. These fire only where the two combine into something
   neither says alone. Conditions are index-based against UI_CONTEXT, so
   they cannot drift when option wording changes; levels are score/20, and
   fractional values are allowed because a domain averages two questions.  */
var BRAND_RULES = [
{ id:'guarantee-floor', severity:'high',
  title:'Income is contractually floored, not earned',
  ctx:{ guarantee:{min:3} }, lvl:{ economics:{max:2.5} },
  says:'Most royalty arrives because a minimum was signed, not because product sold, and category economics are too weak to say which categories would earn without the floor. The exposure is not this year’s income. It is the renewal, when the guarantee is reset against evidence the brand does not currently hold.',
  actions:[{t:'Build contribution by category before the next renewal window opens, not during it',owner:'Finance'},
           {t:'Model each major licence with the guarantee removed and name which categories still earn',owner:'Finance · Commercial'},
           {t:'Open the renewal on contribution evidence rather than on precedent',owner:'Commercial'}],
  metric:'Guarantee share falling with overage share rising against a fixed baseline' },

{ id:'unverified-income', severity:'high',
  title:'No verification and no visibility compound',
  ctx:{ audit:{max:0} }, lvl:{ finance:{max:3} },
  says:'No audit in two years and a reporting view that is not current are not two separate problems. The second conceals the first: nothing in the process would surface an under-report, so the absence of findings is not evidence of accuracy.',
  actions:[{t:'Audit the largest licensee now; it is the fastest way to learn what the statements leave out',owner:'Finance'},
           {t:'Reconcile the last four quarters against contracted rates and minimums',owner:'Finance'},
           {t:'Set audit triggers — underperformance, category expansion, pre-renewal — in writing',owner:'Finance · Legal'}],
  metric:'One audit completed and variances listed against contracted entitlement' },

{ id:'single-point', severity:'high',
  title:'One licensee, and nothing in the pipeline behind it',
  ctx:{ concentration:{min:3} }, lvl:{ gtm:{max:3}, model:{max:3.5} },
  says:'More than half of income sits with one licensee while origination is largely reactive. That is a single point of failure with no replacement being built. The moment it matters is the renewal, and by then the counterparty knows it too.',
  actions:[{t:'Write the replacement scenario — who else could hold the category, at what terms, on what timeline',owner:'Commercial'},
           {t:'Open two licensee conversations in adjacent categories before the dominant renewal window',owner:'Commercial'},
           {t:'Set a concentration limit with a date by which it must be met',owner:'Platform lead'}],
  metric:'A written replacement scenario and two live adjacent conversations' },

{ id:'overage-dead', severity:'watch',
  title:'Nothing is earning above the minimum',
  ctx:{ overage:{max:0} }, lvl:{ market:{max:3.5} },
  says:'No licence has paid overage. Either the minimums sit above what the brand can actually sell, or sell-through is not being reported in a way that would show it. Both are findings, and with no demand baseline there is currently no way to tell which.',
  actions:[{t:'Establish whether overage is genuinely absent or simply unreported',owner:'Finance'},
           {t:'Compare contracted minimums against actual sell-through by category',owner:'Finance · Insight'},
           {t:'Set the demand baseline before the next minimum is negotiated',owner:'Insight'}],
  metric:'Minimums set against evidenced sell-through rather than negotiation history' },

{ id:'wide-book-thin-ops', severity:'watch',
  title:'The book is wider than the service standard can carry',
  ctx:{ categories:{min:3} }, lvl:{ operations:{max:3} },
  says:'Approvals, samples and reviews scale with categories. A book this wide on a reactive service function produces drag that never appears as a cost — it appears later as licensee underperformance, and gets attributed to the licensee.',
  actions:[{t:'Measure approval turnaround and queue age by category for one month',owner:'Ops'},
           {t:'Triage: define which submissions are fast-tracked and which need full review',owner:'Ops'},
           {t:'Resource to the standard, or narrow the book to what can be serviced',owner:'Platform lead'}],
  metric:'Turnaround inside standard across the whole book, not only the largest partners' },

{ id:'manual-at-scale', severity:'watch',
  title:'A book this size cannot be run by hand',
  ctx:{ licences:{min:2} }, lvl:{ systems:{max:2.5} },
  says:'Sixteen or more licences reconciled manually means the view is out of date before it is read, and entitlement is compared against receipt only when someone has time. This rarely binds on its own; it makes every other fix slower.',
  actions:[{t:'Put contract key terms — rate, minimum, territory, expiry — into one structured record',owner:'Legal'},
           {t:'Standardise the royalty statement format across the book',owner:'Finance'},
           {t:'Automate the quarterly pack; the effort of assembly is what stops it being current',owner:'Systems'}],
  metric:'Entitlement against receipt compared automatically rather than on request' },

{ id:'renewal-without-criteria', severity:'high',
  title:'The dependency renews without criteria',
  ctx:{ concentration:{min:2} }, lvl:{ governance:{max:2.5} },
  says:'A third or more of income sits with one licensee and there are no written renewal criteria. The single conversation that could reset those terms will be conducted on relationship and timing. A licence renews because nobody built the case not to.',
  actions:[{t:'Write the renewal criteria before the window opens, not once it has',owner:'Brand lead · Legal'},
           {t:'Date the decision twelve months before expiry and put it on one calendar',owner:'Legal'},
           {t:'Build the case against renewal first, then decide',owner:'Commercial'}],
  metric:'Written criteria, a dated decision point, and a recorded reason for each renewal' },

{ id:'integration-baseline', severity:'watch',
  title:'The one clean measurement point is being spent',
  ctx:{ years:{max:0} }, lvl:{ market:{max:3.5} },
  says:'A brand inside its first year is at the only moment where inherited performance can be separated from what the new owner did. Without a baseline taken now, every later result is arguable, and the argument usually favours whoever is in the room.',
  actions:[{t:'Set the demand baseline and the income structure record now, dated',owner:'Insight · Finance'},
           {t:'Record inherited licence terms and category economics as at transfer',owner:'Finance · Legal'},
           {t:'Re-run the assessment at twelve months against this record',owner:'Brand lead'}],
  metric:'A dated baseline that a twelve-month re-assessment can be read against' },

{ id:'scale-leakage', severity:'high',
  title:'At this scale, a point of leakage is a large number',
  ctx:{ royalty:{min:3} }, lvl:{ finance:{max:3.5} },
  says:'Royalty income at this level means that a single percentage point of under-reporting is worth more than most improvement projects the brand could run. The case for verification here is arithmetic, not principle.',
  actions:[{t:'Quantify the exposure: royalty income against a plausible under-reporting range',owner:'Finance'},
           {t:'Audit the three largest licensees on a defined sequence',owner:'Finance'},
           {t:'Report recoveries against programme cost so the case renews itself',owner:'Finance'}],
  metric:'Recoveries tracked against the cost of the audit programme' },

{ id:'tm-gaps', severity:'high',
  title:'The mark has known gaps where it is licensed',
  ctx:{ trademark:{min:1,max:1} }, lvl:{},
  says:'Licences are being sold under a mark with known registration gaps in the territories they sell into. Everything else in this report assumes the brand owns what it is licensing; in the gap territories that is not yet established, and every licence sold there prices in a risk nobody has quantified.',
  actions:[{t:'Map every live licence territory against the trademark register and list the gaps',owner:'Legal'},
           {t:'File in the gap territories the licences actually earn in, priority by income',owner:'Legal'},
           {t:'Check the licence agreements for whose problem an invalid mark is — it is usually the licensor\u2019s',owner:'Legal'}],
  metric:'No live licence selling in a territory where the mark is unregistered' },

{ id:'tm-unchecked', severity:'watch',
  title:'Trademark coverage has never been checked against the licence map',
  ctx:{ trademark:{max:0} }, lvl:{},
  says:'Nobody has laid the trademark register against the territories and categories the licences actually sell into. The check costs days; a gap found by an infringer instead costs the category.',
  actions:[{t:'Lay the register against the licence map — every territory and Nice class a licence sells into',owner:'Legal'},
           {t:'Date-stamp the check and put it on the renewal calendar to re-run annually',owner:'Legal'}],
  metric:'A dated register-to-licence-map comparison on file' },

{ id:'accretion', severity:'watch',
  title:'A large book with no written position renews by accretion',
  ctx:{ licences:{min:2} }, lvl:{ strategy:{max:2.5} },
  says:'Sixteen or more licences and no stated category position means the shape of the book is the sum of past opportunities rather than a decision. Each individual renewal looks reasonable; the aggregate is nobody’s intent.',
  actions:[{t:'Write the category position — in, out, and the ones to exit — on one page',owner:'Brand lead'},
           {t:'Mark every live licence against it: fit, tolerate, exit',owner:'Commercial'},
           {t:'Take the exit list into the next three renewal decisions',owner:'Platform lead'}],
  metric:'Live book marked against a written position, with exits dated' }
];

/* Evaluate: every ctx condition and every lvl condition must hold.
   ctx uses the option INDEX so wording changes cannot silently break a rule.
   lvl is domain score / 20, so 40 is level 2 and 50 is level 2.5.        */
function brandRulesFired(domainScores, context, ctxOptions){
  var opts = ctxOptions || {};
  function idx(field, value){
    var list = opts[field]; if (!list) return -1;
    return list.indexOf(value);
  }
  var matched = BRAND_RULES.filter(function(r){
    var ok = true;
    for (var f in (r.ctx||{})) {
      var i = idx(f, (context||{})[f]);
      if (i < 0) { ok = false; break; }
      var c = r.ctx[f];
      if (c.min != null && i < c.min) { ok = false; break; }
      if (c.max != null && i > c.max) { ok = false; break; }
    }
    if (!ok) return false;
    for (var d in (r.lvl||{})) {
      var sc = (domainScores||{})[d];
      if (sc == null) { ok = false; break; }
      var lv = sc / 20, c2 = r.lvl[d];
      if (c2.min != null && lv < c2.min) { ok = false; break; }
      if (c2.max != null && lv > c2.max) { ok = false; break; }
    }
    return ok;
  });
  /* high before watch, original order within each — a report that opens with
     ten findings has ranked nothing. Consumers should cap; four is plenty. */
  return matched.sort(function(x,y){
    return (x.severity==='high'?0:1) - (y.severity==='high'?0:1);
  });
}

/* ── Company-level playbook bands ─────────────────────────────────────────
   The same escalation as the brand bands, addressed to the licensing house
   rather than any one brand: 1→2 make it exist · 2→3 make it consistent ·
   3→4 make it evidenced · 4→5 make it decide things.                    */
var COMPANY_PLAY_BANDS = {
strategy:{
 1:{focus:'There is no stated portfolio thesis, so the book is the sum of the deals that were available. Each acquisition looked reasonable; the aggregate is nobody’s intent.',
    actions:[{t:'Write the thesis on one page: what kind of brand this platform owns, what it declines, and what capability it compounds',how:'A leadership session, one page out: what this platform owns, what it declines, the capability it compounds. If two leaders write different pages, that is the finding.',owner:'CEO'},
             {t:'Mark every brand in the book against it — core, hold, exit',how:'One sitting with the leadership team: every brand marked core, hold or exit against the page. Disagreements are recorded, not resolved in the corridor.',owner:'Leadership'},
             {t:'Test the next acquisition target against the page before the process starts, not during it',how:'Before the next process opens, one paragraph: does the target pass the page? The discipline is testing before the banker’s book arrives, not during.',owner:'CEO · Corp dev'}],
    horizon:'One page in four weeks', metric:'A written thesis and the book marked against it'},
 2:{focus:'The thesis lives in the founders’ heads and holds while they are in the room. Written down, it can be argued with, applied by others, and survive a departure.',
    actions:[{t:'Publish the thesis internally with the decline rules made explicit',how:'Circulate the page with the decline rules explicit, and say it aloud at the next leadership forum. A thesis people have not heard cannot filter anything.',owner:'CEO'},
             {t:'Set the capability plan against it: what gets built centrally next, and for which brands',how:'One page against the thesis: the two capabilities built centrally next year, and which brands they serve first. Budget follows the page, or the page is decoration.',owner:'Leadership'},
             {t:'Record acquisition and pass decisions against the thesis, including the passes',how:'A one-line log per decision — target, thesis test, proceed or pass, by whom. The passes are the evidence the thesis is real.',owner:'Corp dev'}],
    horizon:'One quarter', metric:'Decisions and passes recorded against stated criteria'},
 3:{focus:'The thesis is stated but the portfolio does not yet answer to it. Attach numbers and review dates, and let it drive what is bought, built and exited.',
    actions:[{t:'Set a target portfolio shape — platforms, concentration, operated versus licensed — three years out',owner:'Leadership'},
             {t:'Review the book against the shape twice a year and record what changed as a result',owner:'CEO'},
             {t:'Kill one thing per cycle that the thesis says should not be there',owner:'Leadership'}],
    horizon:'Two review cycles', metric:'Portfolio shape moving toward the stated target'},
 4:{focus:'The thesis works and is reviewed. The remaining gain is letting it originate — sourcing what the thesis wants rather than choosing among what arrives.',
    actions:[{t:'Build the acquisition pipeline from the thesis gaps, not from inbound bankers’ books',owner:'Corp dev'},
             {t:'Price capability synergies explicitly in every deal model — what the platform adds, evidenced from past deals',owner:'Corp dev · Finance'},
             {t:'Report thesis drift annually to the board in one page',owner:'CEO'}],
    horizon:'Annual', metric:'Deals sourced against named thesis gaps'}},
model:{
 1:{focus:'Reliance is not mapped, so the platform cannot say what share of income depends on one licensee, one brand or one territory. It is usually discovered at a renewal.',
    actions:[{t:'Map income by brand, by licensee group and by territory for the last eight quarters, in one sheet',how:'Finance assembles one sheet from what exists — brand by licensee group by territory, by quarter — gaps marked. Two weeks, no new system.',owner:'Finance'},
             {t:'Name the three largest single points of failure across the book',how:'From the map, name the three cells whose loss would hurt most across the book, written as sentences with numbers attached. They brief themselves.',owner:'Finance'},
             {t:'Put the map in front of the leadership team this quarter',how:'Twenty minutes on the next leadership agenda: the map, the three exposures, one question — which do we act on this year? Minute it.',owner:'CFO'}],
    horizon:'Four weeks', metric:'A reliance map naming the three largest exposures'},
 2:{focus:'The shape is roughly known but nothing acts on it. Set the limits the platform will not cross, and build the alternatives before they are needed.',
    actions:[{t:'Set limits on how much income can depend on any one licensee group, brand or territory — with dates to reach them',how:'Three sentences agreed at leadership: a ceiling and a date per licensee group, per brand, per territory. Existence matters more than precision.',owner:'Leadership'},
             {t:'Write the replacement scenario for the largest licensee group across every brand it holds',how:'One page per brand the group holds — candidate replacements, terms, time to shipment — assembled once centrally, so no brand discovers it alone at renewal.',owner:'Commercial'},
             {t:'Spread the risk deliberately: the next two new licences go where the map is thinnest',how:'Point the next two originations at the thinnest cells on the map and say so in the origination plan. Diversification that is not scheduled does not happen.',owner:'Commercial'}],
    horizon:'One quarter', metric:'Stated limits and a written replacement scenario'},
 3:{focus:'Dependency is managed but income is still floored by guarantees rather than earned on sell-through — stable in good years, and untested in bad ones.',
    actions:[{t:'Track overage share of royalty for the whole book quarterly; it is the number that says the portfolio actually sells',owner:'Finance'},
             {t:'Model the two largest licensee groups leaving in the same year; hold the plan that survives it',owner:'Finance'},
             {t:'Reset one major renewal per cycle from guarantee-led to evidence-led terms',owner:'Commercial'}],
    horizon:'Ahead of the next renewal cycle', metric:'Overage share rising against a fixed baseline'},
 4:{focus:'Income is diversified and earned. Design the shape you want rather than defending the one you have.',
    actions:[{t:'Set target income shape by platform and territory three years out and originate against the gap',owner:'Leadership'},
             {t:'Use the concentration map as a standing input to acquisition and renewal pricing',owner:'Corp dev · Commercial'},
             {t:'Stress-test annually and publish the result to the board',owner:'CFO'}],
    horizon:'Annual', metric:'Book survives the modelled loss of its two largest counterparties'}},
economics:{
 1:{focus:'Nobody can say what each brand costs to support, so the platform cannot tell a profitable brand from a busy one. Central effort is allocated by noise, not by what each brand actually earns.',
    actions:[{t:'Build the first cost-to-serve view: central time and spend against each brand, however rough',how:'Allocate central time and spend to brands with one crude method — headcount time estimates are fine, marked as estimates. A rough true view beats a precise partial one.',owner:'Finance'},
             {t:'Rank brands by what each earns after the cost of supporting it, and show the bottom three to leadership',how:'Sort the book and take the bottom three to leadership with one question each: fix, restructure or exit? Minute the answers and set a re-check date.',owner:'Finance'},
             {t:'Count where the central team’s time actually went last quarter',how:'One quarter of time-tracking at half-day granularity, or a structured recall across the team. Where time actually went is the platform’s real strategy.',owner:'Chief of Staff'}],
    horizon:'Six weeks', metric:'Profit after support costs, per brand, however rough'},
 2:{focus:'A partial view exists but nothing is decided on it. Complete it and set the line below which a brand must change.',
    actions:[{t:'Complete cost to serve across the book, including deal time and legal',how:'Extend the method to every brand including deal time and legal — same lines, same period — run by central finance as a standing quarterly view, not a study.',owner:'Finance'},
             {t:'Set a minimum profit line: any brand earning less after central costs is fixed, restructured or exited',how:'One number agreed at leadership: the profit below which a brand cannot carry on as it is. Write it into the acquisition thesis so new deals inherit it.',owner:'Leadership'},
             {t:'Test every brand against that line and name the ones that fail',how:'Run every brand against the number and publish the failures internally, an owner and a proposed action per line. The list, not the number, changes behaviour.',owner:'Finance'}],
    horizon:'One quarter', metric:'A stated threshold and the failing brands named'},
 3:{focus:'The view is trusted but decisions still happen beside it. Bring it into the room where effort and capital are allocated.',
    actions:[{t:'Allocate next year’s central capacity on contribution, not history or advocacy',owner:'Leadership'},
             {t:'Restructure the two lowest-contributing brands and record what changed',owner:'Leadership'},
             {t:'Report contribution beside retail sales in every portfolio review, so both are always seen together',owner:'Finance'}],
    horizon:'Next planning cycle', metric:'Capacity reallocated on contribution evidence, on record'},
 4:{focus:'Contribution drives allocation. The gain now is pricing forward — every new deal and renewal priced on what it will really cost the platform to serve.',
    actions:[{t:'Price cost to serve into every acquisition model and major renewal',owner:'Corp dev · Finance'},
             {t:'Publish an internal price list for central services so brands consume them deliberately',owner:'CFO'},
             {t:'Exit or restructure every below-threshold brand on a published schedule',owner:'Leadership'}],
    horizon:'Annual', metric:'No brand below threshold without a dated decision against it'}},
market:{
 1:{focus:'Every brand answers its own demand questions, or does not. There is no central view of the consumer, so category calls are made on advocacy brand by brand.',
    actions:[{t:'Stand up the shared demand baseline: three tracked signals per brand, one method, one owner',how:'Pick three signals every brand can pull monthly, one method sheet, one named central owner. Start with the four largest brands; backfill the rest by quarter-end.',owner:'Insight'},
             {t:'Write a one-page consumer definition for the four largest brands from current data',how:'Half a day per brand with existing data: one page each, dated, heritage claims excluded unless evidenced. The four pages set the method for the book.',owner:'Insight'},
             {t:'Put the gaps on one map: categories and territories you hold, could reach, or have left empty — across every brand',how:'One grid across every brand — categories by territories, marked held, within reach, or empty — drafted centrally from the licence lists in a week.',owner:'Commercial'}],
    horizon:'One quarter', metric:'A shared baseline live for the largest brands'},
 2:{focus:'Pockets of insight exist but each was built once and differently. Make the method common so brands can be compared and the work compounds.',
    actions:[{t:'Standardise the demand method across every brand and backfill the book',how:'Publish the method sheet, backfill every brand to the same three-signal baseline, and put the refresh on a named central owner’s calendar.',owner:'Insight'},
             {t:'Review category submissions against the definitions and refuse the misfits',how:'Every category submission carries one added paragraph: fit against the consumer definition. Misfits are refused in writing — the refusals teach the book what the definitions mean.',owner:'Brand leads'},
             {t:'Refresh the gap map quarterly and point the search for new licensees at the gaps',how:'A standing quarterly refresh, thirty minutes with commercial: what filled, what opened, where the search for new licensees moves next. The map drives the target list or it is wallpaper.',owner:'Commercial'}],
    horizon:'Two quarters', metric:'Every brand on the same demand method'},
 3:{focus:'The central view exists and is credible. Make it a gate rather than a chart — nothing significant is signed against it silently.',
    actions:[{t:'Require the demand read in every major deal and renewal paper',owner:'Leadership'},
             {t:'Name the divergences between central signals and licensee sell-through, brand by brand',owner:'Insight'},
             {t:'Feed the map into acquisition screening — buy where the white space is real',owner:'Corp dev'}],
    horizon:'From the next deal cycle', metric:'Major papers carrying the demand read as standard'},
 4:{focus:'Demand evidence gates decisions. The remaining gain is selling it — the shared view priced into partner negotiations and offered to licensees as a service.',
    actions:[{t:'Publish the category outlook to the licensee book annually so partners plan on the same picture',owner:'Insight'},
             {t:'Use demand evidence to hold price positioning by territory across brands \u2014 tier and channel discipline, never resale prices',owner:'Commercial'},
             {t:'Track forecast-to-actual on demand calls and publish the hit rate',owner:'Insight'}],
    horizon:'Annual', metric:'Partners planning against the platform’s published outlook'}},
gtm:{
 1:{focus:'Finding new licensees means answering the phone, at portfolio scale. The platform signs from what arrives, so the book’s shape is the market’s choice rather than its own.',
    actions:[{t:'Build one target list of gaps across all brands — category by territory by brand',how:'Merge the brand grids into one list — category by territory by brand — ranked by evidence of demand. Commercial owns it as the single origination reference.',owner:'Commercial'},
             {t:'Set a monthly routine for approaching new licensees, with named owners per platform',how:'One hour per platform, same day monthly, named owner: approaches, responses, the next ten. The fixed slot in the diary is the mechanism; without it the list is a document.',owner:'Commercial'},
             {t:'Log every inbound against the list so signal is separated from noise',how:'Every inbound gets one line: source, brand, category, on-list or off, outcome. A quarter of logging shows whether the book is being built or merely accepted.',owner:'Commercial'}],
    horizon:'First approaches within the quarter', metric:'A worked target list across the book'},
 2:{focus:'New licences get signed but each deal is hand-made. Standardise the machinery so it scales past the people who currently carry it.',
    actions:[{t:'Write the deal playbook: qualification, terms ranges by category, decline rules',how:'One document, three sections: qualification tests, terms ranges by category, decline rules with the decline sentence. Drafted by commercial, agreed at platform level, used from the next deal.',owner:'Commercial · Legal'},
             {t:'Set stage conversion targets and review monthly',how:'Define the stages once across the book, set target rates from last year’s actuals, and review the funnel monthly per platform.',owner:'Commercial'},
             {t:'Pull out of the two sales channels that drag royalty rates down across the most brands',how:'Rank channels by the royalty rate they actually deliver across brands; name the two worst; put the exit in writing with a date. An exit without a date is a preference, not a decision.',owner:'Leadership'}],
    horizon:'One quarter', metric:'Pipeline qualified against a written playbook'},
 3:{focus:'The machine is systematic but still shaped by availability. Point it at the plan and measure what a closed deal really costs.',
    actions:[{t:'Rebuild the target list from the portfolio thesis rather than from who has approached',owner:'Commercial'},
             {t:'Track origination cost per closed licence and use it to size next year’s effort',owner:'Finance'},
             {t:'Pre-agree terms ranges by category so closing does not renegotiate principles each time',owner:'Legal'}],
    horizon:'Next origination cycle', metric:'Closed deals traceable to named plan gaps'},
 4:{focus:'Origination is designed and converting. Sequence by value across the whole book — the next unit of effort goes to the highest-paying gap on any brand.',
    actions:[{t:'Rank every open gap across the portfolio by contribution potential and work them in order',owner:'Commercial'},
             {t:'Move origination people to where the ranked gaps are, not where they have always sat',owner:'Leadership'},
             {t:'Feed closed-deal learning back into the thesis and the terms ranges quarterly',owner:'Commercial'}],
    horizon:'Annual', metric:'Effort allocation matching the ranked gap list'}},
operations:{
 1:{focus:'Each brand is serviced by heroics. There is no stated standard, so capacity problems appear as licensee complaints and get attributed to the licensee.',
    actions:[{t:'Measure approval and support turnaround across the book for one month',how:'One shared log for a month across brands: submission in, decision out. Report median, queue and oldest item per brand — no process change yet.',owner:'Ops'},
             {t:'Write the service standard the whole book requires — turnaround times, review schedule, escalation',how:'One page: turnaround by submission type, review schedule, escalation — written centrally, agreed with brand leads. One standard applied everywhere replaces nine local habits.',owner:'Ops · Leadership'},
             {t:'Count brands per director and name where the load is heaviest',how:'A one-line census: each director, the brands they carry, the licences under each. The overload usually explains half the turnaround data by itself.',owner:'Chief of Staff'}],
    horizon:'Six weeks', metric:'A published standard and a measured baseline'},
 2:{focus:'A standard exists but is met for whoever shouts loudest. Resource it, and build the capability once rather than brand by brand.',
    actions:[{t:'Resource against the standard and state the gap in people terms',how:'Convert the measured load into hours against hours available, per team, and state the gap in people terms to leadership with the service standard beside it.',owner:'Leadership'},
             {t:'Centralise the two functions every brand duplicates worst',how:'Pick the two functions the measurement shows every brand duplicating worst — commonly approvals tooling and statement processing — and stand each up once, centrally, with a named lead.',owner:'Ops'},
             {t:'Put turnaround on the monthly pack, target against actual, per brand',how:'One row per brand on the pack: target, actual, trend. Publication is the enforcement mechanism; nothing else needs saying monthly.',owner:'Ops'}],
    horizon:'One quarter', metric:'Turnaround inside standard across the book, not just the majors'},
 3:{focus:'The standard is met but the machine is reactive, and it depends on named people. Make it proactive and survivable.',
    actions:[{t:'Move from approving what arrives to briefing categories ahead of submissions, portfolio-wide',owner:'Brand leads'},
             {t:'Document the machine so it survives a departure — the test is a two-week handover',owner:'Ops'},
             {t:'Run structured reviews with the top licensee groups twice a year across all their brands',owner:'Commercial'}],
    horizon:'Two cycles', metric:'Rejection and rework falling against an unchanged standard'},
 4:{focus:'The machine is proactive and documented. Use what it knows commercially — service data is capability evidence nobody else has.',
    actions:[{t:'Use service data to separate partners who need support from partners who need replacing, at renewal',owner:'Commercial'},
             {t:'Publish forward category briefs so licensees design to them rather than submitting into them',owner:'Brand leads'},
             {t:'Price platform service explicitly in new deals — it is part of what the royalty buys',owner:'Commercial'}],
    horizon:'Annual', metric:'Capability judgements evidenced by service data at renewal'}},
finance:{
 1:{focus:'Royalty is collected, not operated. Statements arrive in every format, reconciliation is manual, and nothing would surface an under-report.',
    actions:[{t:'Standardise the statement format and schedule across every licensee',how:'One template, one due date, sent to the whole book with a start quarter. Track returns centrally — the non-returns list is the first agenda item.',owner:'Finance'},
             {t:'Audit the largest licensee group now — findings there repeat everywhere',how:'Instruct a royalty specialist across the group’s licences in one engagement — findings in one usually price the exposure everywhere. A quarter from instruction to findings.',owner:'Finance'},
             {t:'Check last year’s statements against contracted rates and minimums; list every difference',how:'One central sheet: every statement against contracted rate, minimum and territory. Add up what the differences are worth — that number is the case for the audit programme.',owner:'Finance'}],
    horizon:'One quarter · first findings within two', metric:'One format, one schedule, one audit completed'},
 2:{focus:'Reporting is regular but verification is occasional. A standing programme is read against its recoveries, and its announcement alone tends to sharpen licensee reporting.',
    actions:[{t:'Start the rolling audit programme: every major licensee group on a two-year cycle',how:'Rank licensee groups by royalty, schedule the top tier over two years, and announce the programme to the book. An announced programme tends to sharpen statement discipline before anyone visits.',owner:'Finance'},
             {t:'Track money recovered as its own line — read recoveries beside the programme’s cost',how:'One line in the portfolio pack: recoveries year to date against programme cost. The line lets the budget be defended with evidence rather than assertion.',owner:'Finance'},
             {t:'Set audit triggers: underperformance, expansion, pre-renewal',how:'Three triggers in writing: underperformance against minimums, sudden expansion, pre-renewal. Triggered audits catch what the rolling cycle misses between visits.',owner:'Finance · Legal'}],
    horizon:'Programme running within a quarter', metric:'Recoveries tracked against programme cost'},
 3:{focus:'The majors are verified; the tail is opaque — and at portfolio scale the tail is a business. Close it, and make the forecast bottom-up.',
    actions:[{t:'Bring the tail onto the same cadence and format as the majors',owner:'Finance'},
             {t:'Build the royalty forecast bottom-up from licence terms, not top-down from last year',owner:'Finance'},
             {t:'Report forecast-to-actual monthly for the top licensee groups',owner:'Finance'}],
    horizon:'Two quarters', metric:'Whole book on one cadence with a bottom-up forecast'},
 4:{focus:'Income is verified and forecast. Turn verification into negotiating position and feed it forward into pricing.',
    actions:[{t:'Renegotiate terms on audit evidence — reporting clauses, audit rights, interest on underpayment',owner:'Legal · Commercial'},
             {t:'Move the largest groups to data feeds rather than statements',owner:'Systems · Finance'},
             {t:'Price historic under-reporting patterns into new deal minimums',owner:'Commercial'}],
    horizon:'Next renewal cycle', metric:'Terms improved on audit evidence, on record'}},
governance:{
 1:{focus:'Each brand is reviewed in its own meeting on its own numbers, so the portfolio is never actually compared and renewals are decided by relationship and timing.',
    actions:[{t:'Put every brand on one review rhythm with the same measures',how:'One calendar, one template, the same measures per brand. The first cycle will be uneven — run it anyway; comparability starts on the second.',owner:'Leadership'},
             {t:'Write renewal criteria that apply across the book, before the next window opens',how:'One page, four headings, a pass mark per heading — drafted centrally, agreed with brand leads, in force before the next window opens.',owner:'Legal · Leadership'},
             {t:'Put every licence expiry on one calendar',how:'One list across the book: licensee, brand, category, expiry, notice date. An afternoon per platform with the contract files; the notice column prevents defaults.',owner:'Legal'}],
    horizon:'Four weeks', metric:'One rhythm, written criteria, one expiry calendar'},
 2:{focus:'The rhythm exists but decisions are not recorded against it, so the same conversation repeats and nothing binds.',
    actions:[{t:'Record decisions and reasons at every review; a renewal with no recorded reason is a default',how:'A renewal log, one line per decision: outcome, criterion, decider, date. Reviewed quarterly for blanks — a blank is a default that has not happened yet.',owner:'Chief of Staff'},
             {t:'Review every licence expiring within eighteen months against the criteria now',how:'One sitting per platform: every licence inside eighteen months scored against the criteria, sorted renew / renegotiate / exit, owners attached.',owner:'Commercial'},
             {t:'Publish the criteria to the licensee book so partners know what they are reviewed against',how:'Send the criteria to every licensee with one covering line: this is what renewal is decided against. Partners who know the test invest toward it.',owner:'Commercial'}],
    horizon:'One quarter', metric:'Every near-term renewal reviewed with a recorded reason'},
 3:{focus:'Criteria exist but are applied unevenly across brands — and criteria never enforced anywhere are criteria nowhere.',
    actions:[{t:'Date every renewal decision twelve months before expiry, portfolio-wide',owner:'Legal'},
             {t:'Require evidenced scores on each criterion; advocacy alone does not carry a renewal',owner:'Leadership'},
             {t:'Execute the exits the criteria call for, and say why internally',owner:'Leadership'}],
    horizon:'Next renewal cycle', metric:'Decisions dated and evidenced across the book'},
 4:{focus:'Governance is consistent. Make it reallocate — the review rhythm is where the portfolio thesis meets the evidence, brand by brand.',
    actions:[{t:'Let the review rhythm move capacity and capital between brands on the recorded evidence',owner:'Leadership'},
             {t:'Treat each brand’s diagnosed constraint as a standing agenda item until it moves',owner:'Leadership'},
             {t:'Audit annually which criteria actually predicted performance, and drop the ones that did not',owner:'Chief of Staff'}],
    horizon:'Annual', metric:'Capacity or capital moved on review evidence, on record'}},
systems:{
 1:{focus:'Every brand question is a project. Royalty, sell-through and contract data live in different places per brand, and the platform’s scale multiplies the cost of finding anything.',
    actions:[{t:'Inventory where royalty, sell-through and contract data live for every brand',how:'One page per brand rolled into one register: data type, location, owner, currency. Two weeks of asking — the register is the systems roadmap in raw form.',owner:'Systems'},
             {t:'Put contract key terms — rate, minimum, territory, expiry — into one structured record for the whole book',how:'One structured table across the book: rate, minimum, territory, expiry, audit right per licence. A few weeks from the contract files; everything else joins to this.',owner:'Legal'},
             {t:'Standardise the royalty statement format; one format is worth more than one system',how:'Adopt the best format in the book as the template and phase it in at renewals and quarter-ends. One format beats one system, and costs nothing.',owner:'Finance'}],
    horizon:'One quarter', metric:'One contract record and one statement format, book-wide'},
 2:{focus:'Records exist but do not join, so what is owed and what was paid are compared by hand, brand by brand, when anyone has time.',
    actions:[{t:'Join royalty and contract records so what each licensee owes and what they paid compare automatically, for every brand',how:'Put the royalty statements beside the contract table so what was owed and what was paid sit in one view, for every brand. A maintained spreadsheet is a fine first version; the mismatch list pays for the second.',owner:'Systems · Finance'},
             {t:'Define each measure once so every brand reports the same number the same way',how:'A one-page dictionary — each measure, how it is calculated, where the number comes from — agreed once between finance, platforms and brands. Every recurring argument it ends is a meeting returned.',owner:'Finance'},
             {t:'Automate the portfolio pack — assembly effort is why it is never current',how:'Template the pack against the joined view so refresh becomes hours. The test: available on the first morning of the quarter without heroics.',owner:'Systems'}],
    horizon:'Two quarters', metric:'Owed-versus-paid differences flagged automatically, for every brand'},
 3:{focus:'The data is joined but not current, and a view that has to be requested is not a view. Give the platform and its brand leads the same live picture.',
    actions:[{t:'Move the top licensee groups to structured data submission rather than documents',owner:'Systems'},
             {t:'Show data age on the view itself and set a refresh cadence per source',owner:'Systems'},
             {t:'Open self-service to brand leads — a question answered without a project changes behaviour',owner:'Systems'}],
    horizon:'Two quarters', metric:'Self-service portfolio view with visible data age'},
 4:{focus:'The view is current and shared. Make it act — alerts, feedback to partners, and the assessment itself reading from data rather than recall.',
    actions:[{t:'Alert on royalty variance, approval ageing and renewal windows, portfolio-wide',owner:'Systems'},
             {t:'Feed sell-through back to licensees so both sides plan on the same picture',owner:'Commercial'},
             {t:'Connect the data layer to re-assessment so cycle-on-cycle movement reads from evidence',owner:'Systems'}],
    horizon:'Annual', metric:'Alerts firing on the measures that matter, acted on and closed'}}
};

function buildDomains(text, plays, bands){
  return DOMAIN_META.map(function(m){
    var x = text[m.key] || {}, p = (plays||{})[m.key] || null;
    var b = (bands||{})[m.key] || null;
    if (p && b) { var q = {}; for (var kk in p) q[kk] = p[kk]; q.bands = b; p = q; }
    return { key:m.key, name:m.name, short:m.short, role:m.role, weight:m.weight,
             t:x.t||'', move:x.move||'', why:x.why||'', when:x.when||'', proof:x.proof||'',
             play:p };
  });
}

window.UI = {
  brand: {
    key:'brand', name:'Brand Commercial Engine', subject:'this brand', subjectLabel:'Brand',
    headline:'The commercial engine behind the brand',
    lede:'Nine domains, eighteen questions, roughly thirty minutes with the people who run the brand day to day. This is not a review of the brand\u2019s creative or its heritage — it is a diagnostic of how the brand is run as a business. The output identifies the lowest-scoring constraint candidate or genuine tie, then places it against material commercial lines so it can be tested.',
    domains: buildDomains(BRAND_DOMAIN_TEXT, BRAND_PLAYS, BRAND_PLAY_BANDS),
    questions: BRAND_QUESTIONS,
    context: {
      platforms:['Luxury','Home & Culinary','Fashion & Lifestyle','Active & Outdoor'],
      years:['Under 1 year','1–3 years','4–7 years','Over 7 years'],
      sales:['Under $50M','$50–150M','$150–500M','Over $500M'],
      licences:['1–5','6–15','16–40','Over 40'],
      concentration:['Under 15% from largest licensee','15–30%','31–50%','Over 50%'],
      /* Revenue-architecture snapshot — unscored, self-reported, used by the
         portfolio view to size and sequence, never to score. */
      royalty:['Under $1M','$1–5M','$5–15M','$15–50M','Over $50M'],
      guarantee:['Under 25% of royalty','25–50%','51–75%','76–90%','Over 90%'],
      overage:['None','Under 10% of royalty','10–25%','26–50%','Over 50%'],
      audit:['None in two years','Largest licensee only','Some licensees','Rolling programme covering the book','Continuous verification'],
      categories:['1–3','4–8','9–15','16–30','Over 30'],
      /* In a licensing business the asset is the registration. Captured and
         reported, never scored — a fact is not a maturity. */
      trademark:['Not checked against the licence map','Gaps known in licensed territories','Registered in core territories only','Registered in all licensed territories and categories'],
      /* Revenue lines — the ways this brand actually earns. A brand is still
         assessed once, on one instrument; the lines locate the constraint
         inside it. Unscored: they size and place, they never move the index. */
      ontology:{
        portfolioStatus:['Current','Announced','Market-specific','Associated / not operated','Retired','Unable to verify'],
        relationshipToPortfolio:['Owned brand','Managed brand','Licensed master rights','Partner-operated association','Minority / joint venture','Other'],
        verificationStatus:['Verified — primary source','Supported — reliable secondary source','Respondent-reported','Requires verification','Unable to verify']
      },
      lineTypes:['Product','Service','Experience','Media & entertainment','Publishing','Digital & content','Subscription / membership','Retail & concession','Hospitality / real estate','Collaboration'],
      lineOperatingModels:['Licensed','Owned and operated','Partner-operated','Retail / concession','Subscription / membership','Media / advertising','Joint venture','Other'],
      lineStatuses:['Current','Announced','Market-specific','Associated / not operated','Retired','Unable to verify'],
      lineShare:['Under 10% of brand income','10–25%','26–50%','Over 50%'],
      lineLicensees:['1','2–3','4–10','Over 10'],
      lineRenewal:['Within 12 months','1–2 years','2–3 years','Over 3 years','No fixed term'],
      linesMax:8
    }
  },
  company: {
    key:'company', name:'Portfolio Operating Engine', subject:'the company', subjectLabel:'Company',
    headline:'The commercial engine behind the portfolio',
    lede:'The same nine-domain framework, with questions tailored to the licensing house rather than a single brand. The cross-read is directional: where the same candidate appears here and across several brands, it points to a shared capability worth testing once at portfolio level.',
    domains: buildDomains(COMPANY_DOMAIN_TEXT, COMPANY_PLAYS, COMPANY_PLAY_BANDS),
    questions: COMPANY_QUESTIONS,
    context: {
      platforms:['Whole portfolio'],
      years:['Under 3 years','3–7 years','8–12 years','Over 12 years'],
      sales:['Under $500M','$500M–1B','$1–3B','Over $3B'],
      licences:['Under 50','50–150','150–400','Over 400'],
      concentration:['Under 15% from largest brand','15–30%','31–50%','Over 50%'],
      royalty:['Under $25M','$25–75M','$75–150M','$150–300M','Over $300M'],
      guarantee:['Under 25% of royalty','25–50%','51–75%','76–90%','Over 90%'],
      overage:['None','Under 10% of royalty','10–25%','26–50%','Over 50%'],
      audit:['None in two years','Largest licensees only','Some licensees','Rolling programme covering the book','Continuous verification'],
      categories:['Under 20','20–50','51–100','101–200','Over 200']
    }
  },
  licensee: {
    key:'licensee', name:'Licensee Perspective', subject:'this brand, from the licensee', subjectLabel:'Brand',
    headline:'The brand, from the licensee\u2019s side',
    lede:'Nine questions, about ten minutes, answered by the lead licensee for this brand. They mirror the nine domains the brand team has answered, from your vantage point. Where the two views differ, that difference is the most useful thing the portfolio team will learn — so answer as you actually experience it.',
    questionsPerDomain: 1,
    domains: buildDomains(LICENSEE_DOMAIN_TEXT),
    questions: LICENSEE_QUESTIONS,
    context: {
      platforms:['Luxury','Home & Culinary','Fashion & Lifestyle','Active & Outdoor'],
      years:['Under 1 year','1–3 years','4–7 years','Over 7 years'],
      sales:['Under $5M','$5–25M','$25–100M','Over $100M'],
      licences:['1','2–3','4–6','Over 6'],
      concentration:['Under 15% of our business','15–30%','31–50%','Over 50%']
    },
    contextLabels:{ years:'Years holding this licence', sales:'Your retail sales on this brand', licences:'Categories you hold', concentration:'This brand as a share of your business' }
  },
  confidence: UI_CONFIDENCE
};

/* Back-compat */
window.UI_DOMAINS = window.UI.brand.domains;
window.UI_QUESTIONS = BRAND_QUESTIONS;
window.UI_CONTEXT = window.UI.brand.context;
window.UI_MODES = BRAND_MODES;
window.UI_LINE = { domains: LINE_DOMAINS, questions: LINE_QUESTIONS, contract: LINE_CONTRACT };
window.uiQuestionsForMode = function(mode){ return questionsForMode(window.UI.brand.questions, mode); };
window.UI_RULES = BRAND_RULES;
window.uiRulesFired = function(domainScores, context){
  return brandRulesFired(domainScores, context, window.UI.brand.context);
};
window.UI_CONFIDENCE = UI_CONFIDENCE;
window.UI_COMPANY_QUESTIONS = COMPANY_QUESTIONS;
