# The operational engine — assessment and build plan

*How every action plan, at every level of the book, feeds one engine with one line of sight. Written against v0.3.11; Phase 1 ships in v0.3.12.*

## The target operating model

The ontology already defines the spine: **Portfolio → Brand → Commercial line → Component (product/service) → Partner → Evidence → Constraint → Action → Outcome**. The operational engine is that spine read bottom-up as delivery:

1. **Products & services** (components) are where work physically happens.
2. **Commercial lines** are where that work becomes money — actions committed against a line's constraint.
3. **Brands** roll their lines' actions into one brand plan.
4. **The company engine** carries the actions that fix the house itself — the capabilities every brand inherits.
5. **The portfolio** is the single view of all of it, with **one named person holding oversight** and the whole programme read like a KPI engine: how many actions, how far along, what is blocked, what moved.

Two principles keep it honest. An action only ever lives at ONE altitude — the level whose constraint it addresses — and rolls UP by counting, never by duplication. And a rung with nothing on it says so plainly; the cascade never invents coverage.

## What exists today (v0.3.11)

- Actions ("moves") bind to a **subject** (brand or company) and a **domain**. They carry owner, office, person, horizon, metric, status, working notes, step progress, baseline scores and outcome evidence.
- Delivery is visible two ways: the **Action plan** page (steps, ticks, exports) and the company page's **delivery board** (grouped by office, with the programme progress band).
- **Lines and components carry no actions.** The audit names which lines a constraint bites, but a committed action does not record which line or product it lands on.
- **No oversight owner exists anywhere** — the account has a name, not an accountable person.
- Rollup exists only as flat counts. Nothing reads the spine as a cascade.

## The gaps, in order of consequence

1. **Actions cannot attach below brand level.** Without `lines` / `component` on the action record, "every product and service's plan feeds upward" cannot be true — there is nothing to feed. *Data-model change, small.*
2. **No single line of sight.** Oversight is a field on the account (`OversightOwner`), surfaced at the top of the cascade. *One field.*
3. **No cascade read.** A view that walks the five rungs with per-rung KPIs: actions at that altitude, done / underway / committed / blocked, coverage (how many subjects at that rung carry any committed action), latest update. *Pure UI over existing + new fields.*
4. **KPI trending** (movement against baseline per rung, time-to-done, blocked-age) needs history the record already partly carries (`BaselineScore`, `CreatedAt`, `UpdatedAt`, outcome fields) but no view computes yet.

## The phases

**Phase 1 — ships in v0.3.12.** `lines` on the action record (Airtable `LineNames`, comma-separated; demo data as arrays), `OversightOwner` on the partner record, both mapped through get-portfolio. The two demo actions that already name lines in their text (Martha Stewart's cookware royalty audit; Cavalli's fragrance-and-eyewear renewal criteria) attach to those lines — no action is invented. **"The operational engine"** renders at the top of the company page: five rungs, portfolio first with the oversight owner named, each rung with its action count, status bar and coverage, each feeding the one above. Products & services rung reports honestly that no action is attached at that depth yet.

**Phase 2.** Commit-from-the-line: the line audit and the wheel's line detail gain the same "add to plan" control the domain audit has, writing `LineNames` (and `ComponentId` when committed from a product) at commitment time — so depth fills in from real use, not backfill.

**Phase 3.** The KPI engine proper: per-rung movement (constraint score now vs baseline on done actions), time-to-done, blocked-age, and outcome-supported rate; trend arrows on the cascade.

## Airtable deltas (all additive)

| Table | Field | Type | Purpose |
|---|---|---|---|
| Partners | `OversightOwner` | text | The one person with oversight of the whole engine (role title in the demo). |
| Moves | `LineNames` | text | Comma-separated commercial line name(s) the action lands on; empty = brand/company altitude. |
| Moves | `ComponentId` | text | Phase 2: `OFF-####` when committed from a product/service. |
