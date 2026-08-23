# Changelog

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
