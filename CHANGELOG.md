# Changelog

## 0.3.18 — the KPI monitor and the Action plan are one record, linked both ways

- **Monitor &rarr; plan.** Every row on the operations table carries "steps &amp; notes &rarr;": one click lands on the Action plan with that exact card opened, scrolled to and briefly highlighted. Rows also show how many steps are already ticked.
- **Plan &rarr; monitor.** Every Action-plan card carries "See this in the governance view &rarr;": one click lands on the company page with that exact row highlighted, filters cleared so it can never arrive hidden. The card's detail grid now shows Team and the <b>Accountable</b> person (or a red unassigned) in place of the old single Owner field.
- **The KPI numbers are filters.** Click done, underway, committed, blocked, stalled or unassigned on the monitor and the table filters to exactly those rows, with the chip row staying in sync. Unassigned joined the filter chips.
- **Act from the monitor.** On a signed-in account the Status column is a live control — change it there and the whole engine (cascade, monitor, delivery lens, verdict, plan) updates in the same breath; the read-only demonstration keeps the status chips.

## 0.3.17 — every commitment is governance-ready, and every commit feeds the engine in the same breath

An operational review of the company engine against one rule — all actions from the brands MUST feed into this, with a responsible person on each — found four defects. All four are fixed.

- **The engine went stale after a commit.** Committing from any audit updated the action plan but not the governance page; the cascade, operations table, delivery lens, verdict and home-page plan only caught up on reload. Every commit and status change now re-renders all of them in the same breath.
- **The commitment moment captured no accountability.** The commit form asked for team, horizon and measure — no person, no office, no line. It now captures the <b>accountable person or role</b> (required: "unowned work stalls" — the rule fires even on the read-only demonstration, so it teaches), the <b>office delivering it</b>, and <b>where the action lands</b> — the whole brand, or a specific commercial line chosen from that brand's own lines. save-move writes all three; the record is born governance-ready.
- **Nothing could ever be marked Blocked.** The KPI monitor and boards rendered a blocked state no one could set. "Blocked" is now a status everywhere a status is chosen, and the server accepts it.
- **Open work with no owner hid in plain sight.** The operations table now leads each row with the accountable person — or a red <b>unassigned</b> flag on any open action without one — and the KPI monitor counts unassigned alongside stalled. Due dates surface on the row when set.

## 0.3.16 — first-look guidance that retires itself, and a polish pass

- **First look.** Eleven slim guidance strips narrate the ontology in plain language exactly where a first-time reader meets it — the money answer, the brand cards, the radar, the governance page, the five altitudes, the operations table, comparison, the action plan, scenario uplift, the report builder. Each appears the first three times its page is opened, then retires itself; "Got it" retires one immediately. Stored per browser, like the tour; nothing leaves the page.
- **The welcome tour caught up with the product.** Its four cards now describe what ships today: the money answer and the brand cards that unfold, the menu as the map of how the business is built (with the governance page and operations table named), and acting from any audit — landing work on the plan, the table and the KPI monitor.
- **Polish pass.** Cards gain a soft two-layer shadow; section titles carry the gold tick the navy bands already use; tables get row hover and tabular numerals; pages fade in gently and scrolling is smooth — both stilled under reduced-motion.

## 0.3.15 — the cascade clicks into a full operations table with a KPI monitor

- **The rungs are now filters.** Selecting any level of the operational engine — portfolio, the company engine, brands, commercial lines, products &amp; services — focuses the new operations table below on exactly that altitude, and carries the reader to it. Keyboard-operable; the selected rung is marked.
- **The operations table: every action, one row each.** What it is, the team · person · measure beneath it, the project it serves, the level it works at (with the actual line names as chips), the office, the status and the last update. Filter chips for state; sortable by project, office, status and updated.
- **The KPI monitor, with computed freshness.** Alongside done / underway / committed / blocked, the monitor now reads what is actually moving: an open action updated within a week is <i>moving</i>, quiet at 8–21 days, and <b>stalled</b> beyond three weeks — computed from the record's own updates, never asserted, whatever the status field says. The distinction between "committed" and "moving" is exactly what this table exists to show.
- The programme-level KPI band moved up from the delivery lens onto the table, so state is counted once; the by-office / by-project cards keep their per-group bars.

## 0.3.14 — the company page is a governance dashboard

- **The five-tab audit no longer fronts the company page.** At company level it forced brand furniture onto the screen (a Commercial Map tab that could only say "this belongs to individual brands"). The page now reads as governance: **the house verdict** — one band with the index, the weakest link at its score, and what is committed against the house — then the operational engine cascade, then delivery. The full nine-domain audit is intact beneath, collapsed behind one click, so the scorecard, evidence and the commit controls all still work exactly as before.
- **Delivery groups two ways: by office, or by project.** The same records read through either lens — the office doing the work, or the project it serves (each brand, and the house itself). The progress band's last KPI follows the lens (offices / projects).
- Menu drop-down for The company updated to match: the house verdict · the operational engine · delivery per project · the full audit.

## 0.3.13 — the menu opens into its sections

- Every menu item is now a drop-down group that opens into the sections its page actually holds, so nothing is more than two clicks from anywhere: Overview (the money answer / the brands, pictured / portfolio in one shape / the plan, live), The company (audit / operational engine / delivery around the globe), Brands (brand by brand / ranked table / compare), Action plan (the work / the record / renewals), Insights (scenario uplift / domain performance / benchmarks / portfolio shape), Reports (one per subject / builder / portfolio report), Method (the questions asked).
- The active page's group is the open one (accordion); a child jumps straight to its section. The grouping follows the ontology's spine, and commercial lines and components stay off the menu deliberately — they exist only in the context of a brand and are reached by opening one.
- The company group still disappears entirely for an account that has never assessed the house.

## 0.3.12 — the operational engine: every plan feeding one line of sight

- **The company page now opens its delivery story with the cascade.** "The operational engine" reads the ontology spine bottom-up as delivery: products &amp; services &rarr; commercial lines &rarr; brands &rarr; the company engine &rarr; one portfolio, with the named oversight owner at the top. Each rung carries its own KPI read — actions at that altitude, done / underway / blocked as a bar, and coverage (7 of 19 brands carry a committed action; which lines are named). An action lives at exactly one altitude — the level whose constraint it addresses — and rolls up by counting, never duplication.
- **The action record can now attach to commercial lines.** `lines` on the move (Airtable `LineNames`, additive), and the two demo actions whose text already names lines — Martha Stewart's cookware royalty audit, Cavalli's fragrance-and-eyewear renewal criteria — now carry them. No action was invented to make the cascade look fuller; the products-and-services rung says plainly that nothing is committed at that depth yet, and deepens through use (commit-from-the-line is the next phase).
- **One person has oversight.** `OversightOwner` on the account (demo: Chief Commercial Officer), surfaced at the portfolio rung; an account without one is told to name one.
- The full assessment — target operating model, gaps, phases, Airtable deltas — is in `docs/operational-engine.md`.

## 0.3.11 — compare brands where the brands are, and build your own report

- **Compare brands moved to the Brands page** — it existed, but at the top of Insights where nobody thought to look for it. Select up to five brands and they draw as one radar (one colour per brand, matched in the legend) above the side-by-side domain table with its spread column and transfer read. Relocated and upgraded, not rebuilt: the spread analysis and its honest caveat are unchanged.
- **Report builder under Reports.** Choose any subjects (the company and/or any brands) and any of the five sections (Executive Audit, Commercial Map, Evidence, Actions, History), and build one document: a cover stating exactly what was chosen and when, then each subject's audit with only the chosen sections, page-broken per subject, previewed on screen and printable to PDF. It assembles the same audit the screens render — nothing is written for the report that is not in the product, and leaving a section out never changes the rest. Workspace furniture (tab strips, guidance banners, print buttons) is stripped from the built document.

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
