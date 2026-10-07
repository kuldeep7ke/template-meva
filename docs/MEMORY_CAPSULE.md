# MEMORY_CAPSULE.md -- what a fresh session needs to know about WEB-STR-001

> **Class: SUBJECTIVE (this project only).** The short brief. Read this, then
> `docs/CHANGES.md` for detail. Reusable platform rules live in
> `../the-machine/build-plan/` and are never copied here.

## Identity

| | |
|---|---|
| ProjectID | `WEB-STR-001` |
| Repo | `template-meva` |
| Role | Storefront. **Supports** every Blogger template project in the workspace |
| Tier | SECONDARY to `the-machine` |
| Change IDs | `WEBSTR001-C###` (change), `WEBSTR001-S###` (session) -- derived from ProjectID, never typed |
| Base code | `STR` = storefront shell, registered in `the-machine/projects.md` |

## Baseline facts

- React 19 + Vite 8 + Tailwind CSS v4. No router dependency: `src/utils/router.ts`
  is a History API wrapper, and Cloudflare `_redirects` does the SPA rewrite.
- Content is static TypeScript in `src/data/`. Nothing is fetched at runtime, so
  a content change ships as a rebuild.
- Routes: `/`, `/templates/:slug`, `/showcase/:slug`, `/preview/:slug`,
  `/docs/:slug`, `/unlicensed`, `/contact`. Unknown paths fall back to `home`.
- Gates: `npm run typecheck` (tsc -b), `npm run lint` (oxlint),
  `npm run registry` (`tests/check-registry.cjs`), `npm test` (all four).

## The three facts most likely to be forgotten

1. **All 9 catalog products are invented.** `spotlight`, `smartmag`, `techpulse`,
   `foodiebite`, `minimalgrid`, `chrononews`, `novastore`, `lumenlife`,
   `traveltrove` exist nowhere in the workspace. They are `status: 'placeholder'`
   and are excluded from the sitemap. Do not let one ship.
2. **The real product cannot be listed yet.** `BLG-GEL-001` is a real, finished
   template, but its README says it was built for one specific blog and is not
   for resale. `resale` is recorded per product in `docs/REGISTRY.md` and the
   gate refuses to `publish` anything that is not `allowed`.
3. **The licensing model is split.** The storefront validates
   `MEVA-XXXX-XXXX-XXXX` client-side and calls nothing. The real system is
   `blogger-license-system`, whose serial is 5 groups of 5 hex characters with no
   prefix, validated server-side with `templateId` + `domain`. `src/data/docs.ts`
   currently describes the real system to buyers while the code does something
   else. See `docs/TASKS.md` -> Licensing.

## Read order

1. `docs/INDEX.md` -- what every document is for
2. `docs/TASKS.md` -- the open queue, with dispositions
3. `docs/CHANGES.md` -- the ID ledger
4. `docs/RELATIONSHIPS.md` -- how this store connects to template projects
5. `../the-machine/build-plan/` -- objective rules. Reference, never copy.

## Journal

### 2026-10-06 -- WEBSTR001-C001

Project identity established. Discovered and recorded three pre-existing
defects rather than inheriting them silently:

- The Machine's change-ID prefix was hardcoded, so a second Blogger project on
  the same base theme would have collided with `BLG-C001`-`BLG-C421`. Fixed in
  `the-machine` and documented in `docs/CHANGES.md` -> ID scheme.
- `the-machine/machine/check-repo.ps1` gate 10 was **already red**:
  `blogger-new-template` had drifted from `machine/project-starter` across 13 of
  26 files, which `the-machine/projects.md` claimed was byte-identical. Resynced
  one-way.
- `blogger-license-system` and this storefront disagree on serial format,
  endpoint and redirect domain. Recorded, not silently reconciled.

### 2026-10-06 -- WEBSTR001-C004 through C006

Session on this machine (DESKTOP-46HT2L6). Closed two self-inflicted gaps:

- The ledger told operators to allocate with `npm run id:next`, but the script
  did not exist. Added `tools/next-id.cjs` + the npm script. Its first answer
  (C1000) was wrong: the naive regex also matched the "C001-C999 space" band
  note. It now matches ledger row shape only.
- `public/sitemap.xml` was hand-maintained. Now derived by
  `tools/generate-sitemap.cjs` (`npm run sitemap`), with `sitemap:check`
  failing `npm test` on a stale file. Core pages stay human-owned; product
  URLs are derived from the catalog.

Open-task dispositions updated: the for-real `new-project.ps1` round trip is
DEFERRED by owner decision ("WhatIf only" — the dry run proves everything up
to the write); the old blocker (no base theme XML) is solved, the real
`blogger-llianmeva-template` product XML works as `-SourceXml`.

### 2026-10-07 -- WEBSTR001-C011 and C012

  - **The ID system here was half a system.** `npm run id:next` existed (C004) and
    `docs/CHANGES.md` promised that the prefix is "derived from PROJECT_ID, never
    typed by hand" so a second project could not collide with the first. That
    promise is about *collision across projects*. Nothing checked whether the
    ledger was intact *within* this one: not that a referenced id had a row, not
    that the counter had no gap, not that a seal pointed at a commit. And
    `npm test` ran four gates - typecheck, lint, registry, sitemap - none of which
    touches the ledger. **The one append-only artefact that carries traceability
    was the only one with no gate.** The sibling Blogger project has had one for
    hundreds of changes, which is exactly how this stayed invisible.
  - **The prefix is derived here too, on purpose.** A gate hardcoding `WEBSTR001`
    would be right today and would keep passing after the ProjectID changed. That
    is B-041 in the KB: a literal pinned in a tool while the assertion above it
    quietly stopped meaning anything. Reading `PROJECT_ID` means a copied prefix
    cannot start a second ledger in the same space.
  - **Two bugs in the gate itself, both of which made it measure nothing while
    looking perfectly healthy.** It read the seal from the *last* cell of a row
    that ends in `|`, so `cells[length-1]` was always empty and **every row looked
    unsealed**; the fix is `length-2`. Then it built a `Set` of full 40-char shas
    and looked up 7-char ones, so **four genuine seals were reported as lies** --
    and the rational response to that would have been to delete the seals. Both
    failures are indistinguishable from a passing gate, which is why the mutations
    below matter more than the code.
  - **Proven by three mutations:** an id referenced with no row (red, and names
    every dangling id, not just the last one iterated); a middle row deleted (red
    on the gap *and* on the dangling reference -- the same fact caught twice from
    two directions); and a seal rewritten to `deadbee` (red, naming file and line).
    A real 7-char prefix is still accepted, because git accepts it.
  - **C012: the guide told you to hand-edit a generated file.** Three separate
    instructions said "add it to `public/sitemap.xml`", and C005 had already made
    that file generated with `sitemap:check` inside `npm test`. So the documented
    procedure produced a change the next `npm run sitemap` silently undid -- the
    worst kind of wrong, because the guide is how you find out what to do.
  - **"Nine products render" against 30 slugs.** Fixed at the source rather than
    the number: the sentence now reads the count from `src/data/templates.ts` and
    says to trust that file rather than the sentence. **A count in prose is a
    claim with nothing behind it** -- the same defect as BLG-C432's five wrong
    gate counts, and the same fix.
  - **Also found while auditing, and NOT fixed here:** C008, C009 and C010 are in
    `docs/CHANGES.md` and committed, but this capsule's journal stops at C007. The
    record went quiet while the work kept landing. The sibling project has a
    staleness watermark for exactly this; this one does not, which is a gap worth
    its own change rather than three paragraphs written in passing.
### 2026-10-06 -- WEBSTR001-C007

Catalog card redesigned (this machine). `src/components/TemplateCard.tsx` is
now a full-bleed portrait preview card (Option 4 of 7 showcase): floating
price chip with discount, badge/category/trial chips, bottom gradient with
rating, sales, version, PageSpeed/Dark/AdSense pills, always-visible Preview
+ Details buttons. Other machines: pull `main`, run `npm.cmd run dev` — no
migration, no registry change, placeholders untouched.
