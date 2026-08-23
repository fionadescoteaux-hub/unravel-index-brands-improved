# Migration before deployment

Apply these steps to a staging branch and Airtable copy first. The new server code fails visibly if required context cannot be stored; it no longer reports a partial success.

1. **Back up the base** and export `Partners`, `Completions` and `Moves`.
2. **Partners:** add `DemoAccount` (checkbox) and `PortfolioBrandCount` (number) if absent. Code-only access must be limited to a non-sensitive illustrative account.
3. **Completions:** confirm `BrandContext` is a long-text field and all nine canonical score columns in `docs/airtable-schema.md` exist.
4. **Moves:** add `BrandID`, `Due`, `Progress`, `WorkingNote`, `OutcomeStatus`, `OutcomeEvidence` and `OutcomeUpdatedAt`. Seed blank outcomes as `Not tested`.
5. **Password at rest:** convert each client `DashboardPassword` to `scrypt$<salt>$<key>`. Generate hashes with `lib/auth.js` through a secure local workflow. Plaintext remains readable during transition but emits a server warning.
6. **Backfill stable IDs:** new assessments generate IDs automatically. For historical `BrandContext` records, assign one `brandId` per real subject and one `lineId` per commercial line; reconcile spelling variants before writing.
7. **Backfill ontology conservatively:** use `Unable to verify` / `Requires verification` when relationship, status, territory or source has not been checked. Do not convert illustrative demo mappings into factual registry data.
8. **Optional governed registry:** create the two tables described in `docs/airtable-schema.md`, populate only source-checked records, then set `AIRTABLE_BRANDS_TABLE` and `AIRTABLE_COMMERCIAL_LINES_TABLE`. If deferred, manual ontology capture continues to work.
9. **Environment:** keep `SCORING_SCALE` unset or `unravel`; any other value deliberately stops the function from loading. Confirm `AIRTABLE_*` table variables and `ALLOWED_ORIGIN`.
10. Run `npm test`, `npm run build:demo`, then `npm run check`.
11. In staging, load a governed brand record (if configured), submit a brand assessment, save affected lines, commit a move, save shared progress/outcome evidence, sign in as a second browser and confirm the shared state appears.

## Compatibility

- Historical records with valid scores continue to display.
- Historical records without ontology remain visible but show verification gaps.
- Name-based matching remains as a fallback for old moves; new records use `BrandID`.
- Existing plaintext dashboard passwords work only as a logged migration fallback.

## Rollback

The migration only adds fields and JSON keys. Roll back code by redeploying the prior commit; do not delete new Airtable fields. Older clients ignore unknown `BrandContext` keys.

## Optional: commercial components table

To give live dashboards the component depth shown in the demonstration, create a `Components` table (fields listed in docs/airtable-schema.md, including `PartnerCode`), add the rows, and set `AIRTABLE_COMPONENTS_TABLE` to the table name. No code change is needed; while unset, dashboards simply render without component mapping.
