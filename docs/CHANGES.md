# CHANGES.md -- change-ID ledger for WEB-STR-001

> **Class: SUBJECTIVE (this project only).** The master register of every
> session, change and update in TemplateMeva. One ID per change, carried through
> the changelog entry, the capsule line and the commit message, so any stretch of
> work stays traceable (plan -> code -> docs -> commit -> deploy).
> Append-only: an ID is never reused, renumbered or deleted, even if its change
> is rolled back -- the record of having happened is the point.

This project is **SECONDARY** to `the-machine` and **supports** every Blogger
template project. See `docs/RELATIONSHIPS.md` for the relationship model and
`docs/REGISTRY.md` for the ProjectID contract.

## ID scheme

The prefix is **derived from `PROJECT_ID`, never typed by hand.**

| Part | Value for this project |
|------|------------------------|
| PLATFORM | `WEB` |
| BASETHEME | `STR` |
| NNN | `001` |

| Series | Meaning |
|--------|---------|
| `WEBSTR001-S###` | session ID. One per working session. |
| `WEBSTR001-C###` | change ID. One per discrete change: feature, fix, docs update, policy decision or chore. Allocated with `npm run id:next` BEFORE any file is touched. |

### Why the prefix is derived

The prefix used to be a literal. `BLG-C###` was hardcoded in `tests/next-id.cjs`
and hand-copied into `docs/id-bands.json`, so a second Blogger project would have
started its own ledger at `BLG-C001` and collided with the first project's 421
rows. There was no rule against it -- the prefix simply was never a function of
the ProjectID.

The rule is now: **the ProjectID with its dashes removed**, with one frozen
exception.

| ProjectID | Prefix | Why |
|-----------|--------|-----|
| `BLG-GEL-001` | `BLG-C###` | frozen: its 421 existing rows are already in a shipped ledger, a frozen id-bands map, `bug-catalog.md` and the commit history |
| `BLG-GEL-002` | `BLGGEL002-C###` | second project on the same base -- cannot reach `BLG-C001` |
| `BLG-BLSO-001` | `BLGBLSO001-C###` | a different base on the same platform -- also cannot reach `BLG-C001` |
| `WEB-STR-001` | `WEBSTR001-C###` | this project |

Unique by construction: the ProjectID is unique, and the prefix is a function of
it, so no two projects can land on the same series.

An earlier version of this rule said "PLATFORM for the first project on a base".
It was still wrong -- `BLG-GEL-002` and `BLG-BLSO-001` are both first on their
base, so both came out as `BLG`. That is recorded in
`../the-machine/machine/MACHINE-SPEC.md` §4a so it is not reintroduced.

A different platform can never collide regardless of numbering, because the
platform segment is part of the prefix.

### Bands

This project is single-machine, so it has no `docs/id-bands.json` and owns the
whole `WEBSTR001-C001`-`WEBSTR001-C999` space. When a second machine joins, claim a band
before either machine allocates further -- see `the-machine/build-plan/RULES.md`
("Adding a machine to a project that already has one").

## Changes

| ID | Date | Class | Summary | Commit(s) |
|----|------|-------|---------|-----------|
| WEBSTR001-C001 | 2026-10-06 | chore | **Project identity and registry contract established.** Added `PROJECT_ID` (`WEB-STR-001`), this ledger, `docs/TASKS.md`, `docs/MEMORY_CAPSULE.md`, `docs/INDEX.md`, `docs/RELATIONSHIPS.md`, `docs/REGISTRY.md`. Registered `STR` in `the-machine/projects.md`. Extended the catalog model with `status` (`published` / `draft` / `placeholder`) and `projectId`, added the auto-register entry point `tools/register-product.cjs`, and the parity gate `tests/check-registry.cjs`. Marked the 9 pre-existing catalog entries as `placeholder` so they can never be mistaken for real projects. | 239f91d |
| WEBSTR001-C002 | 2026-10-06 | fix | **Licensing aligned to `blogger-license-system` (Option A).** Deleted the client-side key validator, which accepted any invented `MEVA-XXXX-XXXX-XXXX` and rejected every real serial (`AB12C-34DEF-56789-0ABCD-EF012`, five groups of five hex) — it was inverted, not merely unfinished. Removed all email/serial input from the public notice page and replaced it with the real activation path (Blogger > Layout > Licence Activation gadget > Edit HTML). The page stopped asserting a specific cause: the shipped guard redirects to a bare `AUTHOR_URL` with no query parameters, so `?domain=`/`?reason=`/`?template=` never arrive. Rewrote the activation guide to the real carrier and serial format, including the silent-failure trap that Blogger's `hidden` attribute stops the paste rendering. Rewrote `TEMPLATE_DEVELOPER_GUIDE.md`, which documented a client-side `MEVA-` prefix check and footer inspector that are **absent** from the product XML (`meva-license-key`, `meva-credit`, `meva-link`, `meva-footer`, `indexOf('MEVA-')` all zero occurrences) — a guide that taught a check any string beginning `MEVA-` defeats. Remaining blockers recorded in `docs/TASKS.md`: the `mevatemplates.com` vs `templatemeva.com` domain split, and the guard supplying no context to the notice page. | 39ff69f |
| WEBSTR001-C003 | 2026-10-06 | feat | **Canonical add-a-template workflow, and a mockup generator that scales.** Added `docs/ADDING-A-TEMPLATE.md` — the one procedure, using the house 8-box brief rather than a new prompt shape — covering the brief to hand the agent, the mechanical steps, the real-data rules, and the mistakes that cost the most. Rewrote `generate-assets.js` to read `docs/products.json` instead of a hardcoded array of ten palettes: the palette is now derived from the slug by hash (deterministic, so regenerating never churns a cached image), and a product can override it explicitly. Template #101 now needs no edit to that file. The `PageSpeed 99` and `★ 5.0` chips that every mockup hardcoded are now conditional on the registry carrying a measured value, because a template measured at 78 with no reviews was still shipping an image claiming 99 and five stars. Emits a `-hero` variant per product for `og:image`/`twitter:image` with no chips, so a social preview cannot outlive a correction. New gate check: every `/images/` path referenced from the catalog or `index.html` must exist — proven by breaking it, because dropping `spotlight-hero.svg` had silently broken every social share while the build stayed green. Recorded `templatemeva.com` as the product domain, and the scaling work for a 100-template catalog in `docs/TASKS.md`. | |
| WEBSTR001-C004 | 2026-10-06 | fix | **The documented id-allocation command now exists.** `docs/CHANGES.md` told operators to allocate with `npm run id:next`, but no such script was wired up -- the only way to get an ID was reading the last row and adding one by hand, the read-then-write race the Machine's bands work exists to kill. Added `tools/next-id.cjs` (single-machine form: max of local + origin ledgers, derived prefix from `PROJECT_ID`, prints the id, never writes the row) and the `npm run id:next` script. First run mattered: the naive `WEBSTR001-C\d+` match also read the "C001-C999 space" band note as an allocated row and answered C1000; the tool now matches ledger row shape (`\| WEBSTR001-Cnnn \|`) only. | 7b6498d |
| WEBSTR001-C005 | 2026-10-06 | feat | **The sitemap is generated, never hand-edited.** `public/sitemap.xml` was maintained by hand behind a parity gate (rule 7 checked slug/status agreement, but not format, domain, or a stale edit on a single line). Added `tools/generate-sitemap.cjs`: core pages are the only human-owned part, product URLs are derived from the same catalog the gate reads, and `--check` is wired into `npm test` as `sitemap:check`, so an unregenerated sitemap fails the suite instead of drifting quietly. The committed sitemap is the generator's output byte-for-byte. | |
