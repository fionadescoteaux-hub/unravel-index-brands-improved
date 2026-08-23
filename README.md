# Unravel Index — brand commercialisation

> **Deploying? Four steps.** (1) Read this file. (2) Apply MIGRATION.md to a staging
> Airtable base first. (3) Run `npm test`, `npm run build:demo` and `npm run check`.
> (4) Deploy the **complete repository** — never upload selected files individually;
> the build gate now fails on any file it does not recognise, on purpose.

This Netlify/Airtable product assesses the operating engine that converts a brand into commercial income, locates the lowest-scoring constraint candidate, connects it to material commercial lines and manages an evidence-backed intervention.

It is **not** a brand valuation or demand tracker. Lowest score means candidate, not automatically a binding constraint. The product advances a finding only when materiality, actionability and outcome evidence exist.

## Run locally

Requires Node 20 and Netlify CLI for the full API flow.

```bash
npm test
npm run build:demo
npm run check
npm run dev
```

Useful routes: `/try-brand`, `/try-company`, `/try-licensee`, `/try-line`, `/dashboard`, `/demo` and `/report`.

## Source map

- `lib/instruments.js` — canonical domains, weights, scale bands and ontology vocabularies
- `lib/scoring.js` — server-side scoring and tie detection
- `lib/constraints.js` — candidate/priority/validated state rules
- `netlify/functions/submit-assessment.js` — validate, score and persist
- `netlify/functions/save-assessment-context.js` — persist affected-line placement
- `netlify/functions/get-brand-registry.js` — optional governed brand/line prefill
- `netlify/functions/get-portfolio.js` — authenticated portfolio read and data-quality controls
- `netlify/functions/save-move.js` — governed move/action/outcome writes
- `public/instrument.js` — browser question text and playbooks; no scoring arithmetic
- `data/marquee-demo.json` + `scripts/build-demo.js` — reproducible illustrative walkthrough (19 assessed brands; Martha Stewart is the fully developed reference brand with 17 source-backed commercial components under its six assessed lines)

Read [the ontology](docs/ontology.md), [Airtable schema](docs/airtable-schema.md) and [migration steps](MIGRATION.md) before deployment.
The [implementation assessment](IMPLEMENTATION-ASSESSMENT.md) separates completed code from the source verification still required for a true portfolio representation.

## Security and data boundaries

- Portfolio reads and move writes use POST so credentials do not enter URLs.
- Client dashboards require code plus password; code-only access is server-flagged demo data only.
- Password hashes use scrypt; plaintext is a migration fallback.
- Move updates verify tenant ownership.
- Respondent contacts and free-text evidence are not returned to the dashboard.
- API responses are not cached and dashboard pages are not indexed.
