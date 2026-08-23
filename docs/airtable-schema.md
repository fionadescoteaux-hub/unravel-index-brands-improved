# Airtable schema used by this repository

This build uses the existing `Partners`, `Completions` and `Moves` tables. It does **not** write to a separate `BrandAssessments` table. Configure table names with environment variables and apply the migration in `MIGRATION.md` before deploying.

## Partners

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `PartnerCode` | Single line text | yes | Non-guessable tenant/access key |
| `PartnerName` | Single line text | yes | Portfolio display name |
| `BadgeLabel` | Single line text | no | UI label |
| `Active` | Checkbox | yes | Access gate |
| `Vertical` | Single select | yes | `brand-licensing` |
| `MaxCompletions` | Number | yes | Submission allocation |
| `CompletionCount` | Number | yes | Current usage |
| `DashboardPassword` | Single line text | client accounts | Prefer `scrypt$<salt hex>$<key hex>`; legacy plaintext is migration-only |
| `DemoAccount` | Checkbox | yes | Code-only access only for non-sensitive illustrative data |
| `PortfolioBrandCount` | Number | no | Verified denominator for assessment coverage |

## Completions

Existing canonical fields used directly:

- Identity: `CompletionId`, `Vertical`, `Subject`, `Organisation`, `PartnerCode`, `PartnerName`
- Respondent: `Email`, `FirstName`, `LastName` (never returned by the dashboard)
- Output: `OverallScore`, `MaturityLevel`, `ConstraintDomain`, `ConstraintScore`, `WeakestDomain1`
- Context: `Sector`, `OrgAge`, `Turnover`, `TeamSize`, `TradedIncome`
- Method and audit: `WeightingVersion`, `DomainAnswers`, `RawDomainScores`, `Evidence`, `HeldForVerification`, `ConfidenceByDomain`, `ConfidenceMean`, `CompletedAt`, `Cycle`, `BiggestChallenge`
- Canonical domain numbers: `ScoreStrategy`, `ScoreRevenueModel`, `ScoreUnitEconomics`, `ScoreMarketFocus`, `ScoreSales`, `ScoreOperations`, `ScoreFinancial`, `ScoreGovernance`, `ScoreSystems`
- `BrandContext` (long text): versioned JSON described below

The complete assessment scale is 20–100. A missing or out-of-range domain field makes the record incomplete; the portfolio endpoint excludes it and returns a data warning. Missing values are never converted to zero.

### BrandContext JSON

`BrandContext` is required on new brand assessments and contains:

- stable identity: `ontologyVersion`, `brandId`, `canonicalName`, `brandFamily`
- portfolio facts: `portfolioStatus`, `relationshipToPortfolio`, `primaryTerritories`
- source provenance: `registrySource`, `registrySourceUrl`, `registryVerificationStatus`, `registryVerifiedAt`
- revenue architecture: royalty, guarantee, overage, audit, category, mode and trademark fields
- `lines[]`: stable `lineId`, name, offering type, operating model, commercial status, territory, partner, channel, income band, renewal and verification/source metadata
- post-score placement: `constraintLines`/`constraintPlacements` for readable names and `constraintLineIds`/`constraintPlacementIds` for governed links
- evidence review state: `evidenceReviewStatus`, `evidenceStatusByDomain`
- method provenance: weighting, scoring scale/version, all tied candidates and the initial `candidate` status

`/api/context` performs a narrow update of the placement fields only, and validates every supplied line ID against the same completion.

## Moves

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `PartnerCode` | Single line text | yes | Tenant ownership |
| `Subject` | Single select | yes | `brand` or `company` |
| `Brand` | Single line text | yes | Display label |
| `BrandID` | Single line text | yes for new records | Stable subject link |
| `DomainKey` | Single line text | yes | Canonical domain |
| `Move` | Long text | yes | Intervention |
| `Owner` | Single line text | yes | Accountable owner |
| `Horizon` | Single line text | yes | Decision horizon |
| `Metric` | Long text | yes | Proof measure |
| `Status` | Single select | yes | `Committed`, `In progress`, `Done`, `Dropped` |
| `BaselineScore`, `BaselineIndex` | Number | no | Pre-intervention readings |
| `Due` | Date | no | Shared working date |
| `Progress` | Long text | no | JSON array of completed playbook action indexes |
| `WorkingNote` | Long text | no | Shared working note |
| `OutcomeStatus` | Single select | yes | `Not tested`, `In test`, `Supported`, `Not supported` |
| `OutcomeEvidence` | Long text | required for Supported | Commercial evidence against baseline |
| `OutcomeUpdatedAt`, `CreatedAt`, `UpdatedAt` | Date/time | yes | Audit trail |
| `Note` | Long text | no | Legacy summary field |

Updates verify both Airtable record ID and `PartnerCode`; authentication is not treated as authority to edit another tenant's record.

## Optional governed registry

Set both `AIRTABLE_BRANDS_TABLE` and `AIRTABLE_COMMERCIAL_LINES_TABLE` to enable assessment prefilling. If either is absent, `/api/registry` returns `available:false` and respondents complete the same ontology manually.

`Brands` fields: `PartnerCode`, `BrandID`, `CanonicalName`, `BrandFamily`, `Platform`, `PortfolioStatus`, `RelationshipToPortfolio`, `PrimaryTerritories`, `RegistrySource`, `SourceURL`, `VerificationStatus`, `VerifiedAt`.

`CommercialLines` fields: `PartnerCode`, `BrandID`, `LineID`, `Name`, `OfferingType`, `OperatingModel`, `CommercialStatus`, `Territory`, `Partner`, `Channel`, `IncomeShare`, `LicenseeCount`, `Renewal`, `Source`, `SourceURL`, `VerificationStatus`, `VerifiedAt`.

Registry records without stable IDs are omitted rather than returned under a name-only identity. The assessment stores a snapshot so later registry edits do not rewrite historical evidence.

## Version rules

- `WeightingVersion`: `unravel-v1.0-licensing`
- `ScoringVersion`: `unravel-score-v1.0-20-100`
- `OntologyVersion`: `unravel-brand-ontology-v1.0`
- Never edit weights, scale arithmetic or ontology meanings in place once records exist. Add a new version and document the migration.

## Commercial components (optional table — wired, not yet created)

The demonstration stores commercial components in `data/marquee-demo.json` (`components[]`). The live path is already wired: set `AIRTABLE_COMPONENTS_TABLE` to the table name and `get-portfolio` serves its rows (filtered by `PartnerCode`); while the variable is unset the dashboard simply shows no component depth. Create a `Components` table with: `PartnerCode` (single line — the owning account), `ComponentId` (single line, unique, `OFF-####`), `BrandId`, `CommercialLineId` (blank when the component sits outside the assessed lines), `Name`, `OfferingClass`, `Domain`, `CoverageExamples`, `CommercialStatus`, `Audience`, `CommercialModel`, `RouteToMarket`, `UnravelNode`, `SuggestedEvidence`, `SourceUrl`, `SourceAccessedAt` (date), `VerificationStatus` (same vocabulary as lines), `IncludedInAssessment` (checkbox). IDs are supplied, never derived from names; renames must not touch `ComponentId`.
