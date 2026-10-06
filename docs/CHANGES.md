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
| WEBSTR001-C001 | 2026-10-06 | chore | **Project identity and registry contract established.** Added `PROJECT_ID` (`WEB-STR-001`), this ledger, `docs/TASKS.md`, `docs/MEMORY_CAPSULE.md`, `docs/INDEX.md`, `docs/RELATIONSHIPS.md`, `docs/REGISTRY.md`. Registered `STR` in `the-machine/projects.md`. Extended the catalog model with `status` (`published` / `draft` / `placeholder`) and `projectId`, added the auto-register entry point `tools/register-product.cjs`, and the parity gate `tests/check-registry.cjs`. Marked the 9 pre-existing catalog entries as `placeholder` so they can never be mistaken for real projects. | |
