# Unravel brand-commercialisation ontology v1.0

The ontology connects an assessment to the real brand, the commercial lines through which it earns, the evidence supporting those facts and the intervention intended to change an outcome. It is separate from the nine scored domains: ontology fields describe **what exists and how it is connected**; assessment answers measure **how capable the commercial engine is**.

## Entity spine

| Entity | Stable key | Connects to | Required provenance |
|---|---|---|---|
| Portfolio | `PartnerCode` | Brands, assessments, moves | Airtable partner record |
| Brand/company | `brandId` | Assessments, commercial lines, moves, line cuts | Canonical name plus portfolio relationship/source |
| Commercial line | `lineId` | One brand; constraint placements; line cuts | Offering, model, status, territory and verification |
| Commercial component | `componentId` | One brand; optionally one commercial line | Offering class, model, route to market, source URL and access date |
| Assessment | `CompletionId` | One subject and method version | Answers, domain scores, confidence and timestamp |
| Constraint finding | Assessment + domain key | Candidate lines and moves | All tied candidates and three-test status |
| Move | Airtable record ID | Subject + domain | Owner, horizon, metric, progress and outcome evidence |

Generated fallback IDs are deterministic within a portfolio. They prevent punctuation or spacing changes from immediately fragmenting the data, but a verified registry should supply and preserve IDs before large-scale import.

## Commercial components

The full chain is **Portfolio → Brand → Commercial line → Commercial component/offering → Partner/channel → Evidence → Constraint → Action → Outcome**.

A commercial component sits beneath a material commercial line and provides the detailed commercial map. Components are **source-backed registry facts**: each carries `componentId` (stored in source data, `OFF-####`, never generated from a name — a renamed display label must not change an ID), `brandId`, `commercialLineId` (or null), `name`, `offeringClass`, `domain`, `coverageExamples`, `commercialStatus`, `audience`, `commercialModel`, `routeToMarket`, `unravelNode`, `suggestedEvidence`, `sourceUrl`, `sourceAccessedAt`, `verificationStatus` and `includedInAssessment`.

Components are **not scored** and are never questionnaire subjects. A component that no assessed commercial line responsibly represents is marked `includedInAssessment: false` and displayed under "Additional mapped components — not included in this assessment" — it is never forced into an unsuitable line, and no constraint finding is implied against it. The assessment snapshot is historical; the component map may reflect the current registry, and the two are labelled separately where they differ.

## Controlled vocabularies

### Portfolio status

`Current` · `Announced` · `Market-specific` · `Associated / not operated` · `Retired` · `Unable to verify`

This prevents an association, historical brand or market-specific relationship from being presented as a current operated portfolio brand.

### Relationship to portfolio

`Owned brand` · `Managed brand` · `Licensed master rights` · `Partner-operated association` · `Minority / joint venture` · `Other`

Relationship and portfolio status are separate. “Current” does not explain whether the business owns, manages or licenses the brand.

### Commercial offering

`Product` · `Service` · `Experience` · `Media & entertainment` · `Publishing` · `Digital & content` · `Subscription / membership` · `Retail & concession` · `Hospitality / real estate` · `Collaboration`

### Operating model

`Licensed` · `Owned and operated` · `Partner-operated` · `Retail / concession` · `Subscription / membership` · `Media / advertising` · `Joint venture` · `Other`

Offering and operating model are separate: hospitality may be licensed, owned, partner-operated or a joint venture.

### Verification status

`Verified — primary source` · `Supported — reliable secondary source` · `Respondent-reported` · `Requires verification` · `Unable to verify`

Every registry and line fact can carry a source label, source URL and verification date. Unknown data remains unknown; it is not inferred from a brand name or image.

## Constraint state model

| State | Minimum evidence |
|---|---|
| `candidate` | One or more equally lowest domain scores. Ties remain explicit. |
| `priority` | Exactly one candidate, placed on at least one material commercial line, plus a move with owner, horizon and proof measure. |
| `validated` | Priority criteria plus a supported post-intervention commercial outcome and written outcome evidence. |

A higher reassessment score does not by itself establish causality. The named outcome measure must be reviewed against baseline. A `Not supported` result sends the finding back for diagnosis rather than being hidden.

## Data-quality rules

- At least one material commercial line is required for a new brand assessment.
- Core ontology values and the line territory/verification status are required.
- Incomplete scored records are excluded, never scored as zero.
- Portfolio summaries count only unambiguous candidates; tied assessments are reported separately.
- Income bands are displayed as bands. Midpoints may support a clearly labelled scenario weight, but are not added to claim recoverable revenue.
- Illustrative demo ontology is marked `Requires verification` or `Unable to verify` throughout.

