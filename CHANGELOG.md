# Changelog

## 0.3.10 — the live dashboard's delivery board fills in

- get-portfolio now passes each move's `Office` and `Person` through to the dashboard, so the delivery board groups live accounts by real offices instead of "Office not recorded". The two fields were added to the Airtable Moves table (additive — nothing existing touched), and the demonstration account was seeded with the eight illustrative actions so the live board matches the walkthrough.

## 0.3.9 — who is fixing what, where: delivery board on the company page

- **The company page now answers "who is actually delivering this".** Below the company audit sits "Who is fixing what, where": every committed action across the book, grouped by the office delivering it, each carrying the team, the person responsible, the action itself, its status and its horizon — because a bottleneck is only alleviated by work someone owns.
- **One progress band for the whole programme.** Actions, done, underway, committed, blocked and offices as headline counts, a stacked progress bar (gold done, steel underway, red blocked, unfilled committed), and the date of the latest update — the general "where are we" screen, on the page where the bottlenecks are named.
- **Office and person now ride on the move record.** The eight illustrative demo actions carry offices (New York, London, Milan, Los Angeles) and role-titled owners. A live move without these fields still renders, grouped honestly under "Office not recorded" — and an account with no moves at all gets a plain explanation of what will appear, not an empty box.
- Step-by-step tracking, notes and exports stay on the Action plan; this board is the management read of the same record.

## 0.3.8 — the brands as pictures, and each one opens as a live wheel

- **The block strip is gone.** "The engine, drawn" compressed nineteen brands into proportional slivers whose constraint chips overprinted their names — unreadable at exactly the sizes most brands got. Replaced with a brand gallery: one card per brand carrying its mark (the stored brand image, with a designed monogram fallback when none exists or it fails to load), its headline income, its share of the engine, its index and maturity band, in Marquee navy and gold.
- **Selecting a brand opens an interactive wheel, not a static list.** The brand sits at the centre; each commercial line is an arc sized by the income it feeds in (derived from band midpoints and labelled as derived); the products and services under each line sit on the outer ring. Hovering any ring reads it into a live readout; clicking a line or a segment pins its full detail — offering type, operating model, partner, territory, renewal, verification, sources — beside the wheel; clicking a component chip inside a line's detail drills one layer further; the centre and the button open the full audit. Everything is keyboard-operable and the entrance animation respects reduced-motion.
- **Honesty preserved in the geometry.** Outer segments subdivide their line's arc by membership only — components deliberately carry no invented value split, and the caption under the wheel says so. Lines whose share is not stated get a minimum arc and are labelled "share not stated" rather than sized by a guess.
- Fixed in testing before ship: a function-name collision with the Commercial Map tab's own line renderer meant clicking a line arc threw instead of pinning the detail; caught by the scripted click-through, renamed, and re-verified end to end (hover, line click, component click, centre &rarr; audit) with zero console errors.

## 0.3.7 — the menu reads down the ontology's own spine

- **"Brand Engine" named two different entities.** On the home page it meant the whole portfolio machine ("every brand feeding one commercial engine"); in the menu and on its own page it meant the company assessed as a subject ("the commercial engine every brand feeds"). Two entities, one name, and two subtitles that were near-inversions of each other. The term now means one thing only — the whole machine — and the company subject is named for what the ontology calls it: the menu says **The company**, the page is **The company engine**, and the home page links to "the company audit".
- **Menu order follows the entity spine.** Portfolio (Overview) &rarr; the company that runs the book &rarr; the brands beneath it &rarr; what is derived from them (action plan, insights, reports, method). The company previously sat below Brands while every line of copy described it as the house those brands run inside.
- **No dead menu item.** An account that has never assessed the house itself was still offered the company page, leading to an empty screen; that item is now hidden unless a company subject exists. The same `display`-outranks-`hidden` trap that broke the access screens in 0.3.4 applied here too, and is guarded explicitly.
- The count badge is gone from the company item &mdash; a permanent "1" beside a single subject was noise.
- Commercial lines and components stay off the menu deliberately: they are levels 3 and 4 of the spine and exist only in the context of a brand, so they are reached by opening one.

## 0.3.6 — the home page is the company's page

The Overview carried nine competing blocks and made the reader assemble the answer. It now leads with the answer and layers the detail beneath it.

- **The money answer, first.** Income today &rarr; stated target &rarr; what is still to bring in, read left to right with one bar carrying the distance. The gap is measured against the same figure shown as "today" so both ends of the bar share one basis; the company's own stated band is reported beside it rather than mixed into the arithmetic. Beneath it, three cards: what stands in the way (the licensing house's own weakest link), what is failing now, and how it gets there (live commitments).
- **The portfolio in one shape.** A nine-domain radar drawing every assessed brand faintly, the portfolio mean over the top, and the licensing house's own engine as a dashed overlay. The spread is deliberately visible &mdash; an average alone hides it. The written read states whether the brands' shared weakness is the same one the house has, which is what decides between a group-level capability fix and a brand-by-brand one.
- **The plan, on the home page.** The live commitments close the page, each with owner, horizon and the measure it will be judged on.
- **Three honest layers.** Portfolio &rarr; select any brand to unfold its commercial lines, each line's share of income and the components beneath it &rarr; open the full audit. The audit now lives once, on Brands, instead of twice.
- Constraint tally, band distribution, the portfolio readout and the KPI strip moved to Insights, where the rest of the cross-portfolio analysis already sat. The brand-by-brand grid moved to Brands. Nothing was deleted.
- Disclosure pills tightened so they no longer push the money figures below the fold.

## 0.3.5 — the access screens no longer block the page they let you into

- Regression fix from 0.3.4: the redesigned access screens used a `display` rule strong enough to outrank the browser's own `hidden` behaviour, so on the questionnaire and the line review the gate stayed painted over the page after the access code checked out — a valid coded link appeared to fail. All three gates now hide explicitly, verified by rendering each page in both states.
- Questionnaire opening rewritten: the heading now says what the assessment is for ("Find what is holding this brand back") under a "Brand assessment · nine domains" label, rather than restating the product name already in the header bar.
- The four orientation tiles now sit as an even 2&times;2 block instead of breaking three-then-one.

## 0.3.4 — fixed the front door's dead ends and the access screens' bare-dialog look

- home.html's cards ("Complete an assessment", "Open the dashboard", "Review a commercial line") could lead to a dead page if you clicked one before confirming a programme code — the code comment already promised "never a dead end" via the demonstration account, but the code didn't do that. Fixed: every card now opens on the demonstration account by default when no code has been entered.
- dashboard.html, index.html and line.html each showed their sign-in / access-code screen as a bare white box on a plain page — no branding, no visual weight, out of step with the rest of the product. Brought all three into the same visual system as the home page and dashboard: a branded background, a small wordmark, and a properly weighted card with shadow and an accent border.
- The "This account needs its dashboard password" message on an unrecognised or unreachable account was confusing when it actually meant the server couldn't be reached — this surfaces as a real password prompt only once the account is actually confirmed to need one.

## 0.3.3 — design pass: real bugs found by rendering every screen, not just reading the code

- Fixed a rendering bug that shipped raw `’`/`—`/`×` escape text on-screen instead of punctuation: the Reports page subtitle, and the "How to read this audit" guidance panel that appears on every brand and Brand Engine page. Both now render proper apostrophes, dashes and a close glyph.
- The engine, drawn (the home-page money map): brands below the labelling threshold used to render as a row of identical, unlabeled slivers — reading like a broken chart rather than the long tail of the portfolio. Each now carries its own initials, so every block still reads as one specific, clickable brand.
- Reports table: the Assessed date column now stays on one line instead of wrapping mid-date and raggedizing row heights.
- Questionnaire (index.html) was set in a different typeface (Poppins/Lora) from every other page in the product (Jost/Source Sans 3 — home page, dashboard, line review, printed reports). Brought it into the same type system so the tool brand teams actually fill in matches the one executives read.

## 0.3.2 — the answer first, contradictions closed, integration-ready actions

- Executive Audit now opens with four unmistakable headings generated from the data — The problem, Why it matters, Recommended solution, Decision required — and one "Add recommended plan" button; the full reasoning, severity, confidence and portfolio context collapse beneath it.
- Contradictions corrected: status card says "material — awaiting commitment only" once placement exists; line-evidence counts use one verification rule everywhere; registry "verified vs pending" message keyed off the actual status; "equally lowest" said only for genuine ties; tour and tab explainers call the lowest domain the first place to investigate, not the thing to fix; Television & media and Digital & content lines now carry their source URLs.
- Commercial Map opens exactly one line automatically — the one with the nearest-renewal constraint placement; everything else expands deliberately.
- Action plan copy fixed: dynamic action counts, and progress ticks say plainly that Save shared progress stores them (no premature "Saved").
- Integration-ready action export: CSV and new JSON export with stable actionId / parentActionId / taskId, brand and commercial-line IDs, priority, owner (email field reserved), timestamps and source-record link — repeated imports update rather than duplicate.
- get-portfolio now serves commercial components from an optional AIRTABLE_COMPONENTS_TABLE, so live accounts gain component depth the moment the table exists; absent table degrades silently.
- Questionnaire: one section per page — the brand and its details first, then each domain, then review and submit, with back/forward, a view-all escape hatch, and full print unaffected. Constraint-candidates chart now explains what it is for.

## 0.3.1 — Martha Stewart reference brand and commercial components

- Introduced the commercial-component entity: Portfolio > Brand > Commercial line > Component > Partner/channel > Evidence. Components are source-backed registry facts with stored stable IDs (`OFF-####`) in `data/marquee-demo.json`; they are never scored, never questionnaire subjects, and never generated from names at build.
- Mapped 17 Martha Stewart components: 13 nested under the six assessed commercial lines, 4 shown under "Additional mapped components — not included in this assessment" rather than forced into an unsuitable line.
- Commercial Map redesigned around progressive disclosure: line rows stay concise (name, share band, renewal, verification, component count, placement, cut status); expanding a line reveals ontology, nested components, cut findings, sources and line-specific actions; expanding a component reveals its stable ID, coverage, audience, Unravel node, suggested evidence, source URL and access date.
- Three information layers are visually attributable everywhere: source-backed registry facts (green "source-backed" tag, URL and access date), respondent-reported assessment answers, and illustrative demonstration data.
- The cookware renewal contradiction (snapshot 1–2 years vs line cut within 12 months) is surfaced on the Commercial Map, the Evidence tab, What remains to verify and the executive conclusion — never silently resolved.
- The executive conclusion now states deterministically when the only committed action addresses a different domain than the constraint candidate, and the Actions tab shows the uncommitted candidate intervention first, clearly separated from other committed actions.
- Honest baseline History tab for single-assessment brands: baseline scores, initial candidate, decisions and evidence since baseline, current verification gaps — no fabricated second cycle.
- Five-tab brand page (0.3.0): Executive Audit default, Commercial Map, Evidence, Actions, History; welcome tour and per-tab explainers; open demonstration entry with client codes unchanged.
- Build gate extended: component counts, stored IDs, linkage integrity and the preserved contradiction all fail the deploy if violated. 30 tests.

## 0.2.0 — ontology and governed constraints

- Added versioned brand/commercial-line ontology and stable IDs.
- Added an optional governed brand/line registry that prefills the assessment while preserving a historical snapshot.
- Required ontology completeness on new brand assessments.
- Persisted affected-line placement after scoring, including genuine ties.
- Introduced candidate → priority → validated constraint states.
- Excluded incomplete scores instead of manufacturing zeros.
- Pinned the 20–100 scoring method and stamped its version.
- Connected moves to stable brand IDs and enforced tenant ownership on updates.
- Moved delivery progress, notes, dates and outcome evidence into the shared record.
- Reframed uplift as diagnostic index scenario, not recoverable revenue.
- Added deterministic walkthrough generation from checked data.
- Added scoring, constraint-state and password-hash tests.
- Tightened walkthrough CSP and added scrypt password support.
