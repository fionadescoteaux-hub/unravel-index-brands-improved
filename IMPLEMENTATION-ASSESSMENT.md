# Implementation assessment

## What is now implemented

| Area | Product behaviour | Verification |
|---|---|---|
| Scoring | Server-only, pinned 20–100 method and version | Unit tests for floor, ceiling, invalid input and confidence |
| Ties | All equal lowest domains persist and display; no first-item action is selected | Unit and UI build checks |
| Constraint lifecycle | `candidate` → `priority` → `validated` with explicit evidence gates | Constraint-state tests |
| Materiality | Brand candidates are placed on stable commercial-line IDs; company materiality uses affected brand patterns | Saved through `/api/context` |
| Ontology | Versioned brand status, portfolio relationship, offering, operating model, commercial status, territory and verification vocabularies | Required server-side for new brand and line assessments |
| Identity | Stable `brandId`, `lineId` and random `CompletionId` connect assessments, lines, line cuts and moves | Stored in `BrandContext` and `BrandID` |
| Governed registry | Optional source-checked Brands/CommercialLines tables can prefill the assessment | `/api/registry`; manual capture remains available |
| Provenance | Source label, URL, verification status/date and ontology/method versions travel with the snapshot | Visible in brand and line detail |
| Data quality | Missing score fields exclude the record and produce a warning instead of zero | Portfolio read validation |
| Actions | New moves require stable subject ID, owner, horizon and proof measure | Server validation |
| Delivery | Progress, dates, notes, outcomes and evidence are shared Airtable state | Cross-browser persistence after migration |
| Causality | A higher score alone does not validate; `Supported` requires outcome evidence | UI and server validation |
| Portfolio scenario | Index movement to 75 is a diagnostic scenario, weighted by royalty band with labelled sales fallback | No recoverable-revenue claim |
| Security | Tenant-owned move updates, scrypt password support, no wildcard default CORS, read-only demo | Auth tests and server checks |
| Demo | Generated deterministically from dashboard, instrument and checked JSON | `npm run build:demo`; stale build fails the gate |

## What requires deployment data work

The code can enforce structure, but it cannot make the illustrative Marquee mapping factual. The 19-brand walkthrough remains explicitly illustrative for scores, bands and contract details; brand relationships and 40 of 62 commercial lines are audit-sourced (22 Aug 2026), the Martha Stewart component map is source-backed and dated, and everything unverified stays marked `Requires verification` / `Unable to verify`.

Before presenting a “true representation” of a live portfolio:

1. Populate the optional Brands and CommercialLines tables from current primary sources.
2. Verify relationship, current/retired status, territory and commercial-line scope with Marquee.
3. Preserve one stable ID per real entity when names or ownership language changes.
4. Add `PortfolioBrandCount` so dashboard coverage shows assessed versus verified total.
5. Follow `MIGRATION.md`, including the Moves fields and password hashing.

## Acceptance test

The staging release is ready only when a reviewer can:

1. Load a governed brand and see ontology plus material lines prefilled.
2. Submit a complete assessment and see every tied candidate.
3. Place candidates on line IDs and retrieve the same placement in the dashboard.
4. Commit a move with owner, horizon and proof.
5. Save progress in one browser and read it in another.
6. Mark an outcome `Supported` only with written evidence and see status become `validated`.
7. Confirm incomplete historical scores are excluded with a warning.
8. Rebuild the walkthrough and pass `npm test` and `npm run check`.

