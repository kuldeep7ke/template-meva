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
- Gates: `npm test` runs six -- `typecheck` (tsc -b), `lint` (oxlint),
  `registry` (`tests/check-registry.cjs`), `sitemap:check`, `id:check`
  (`tests/check-ids.cjs`), `capsule:check` (`tests/check-capsule-staleness.cjs`).
  `npm run build` is separate and not part of `npm test`.

## The three facts most likely to be forgotten

1. **All 9 catalog products are invented.** `spotlight`, `smartmag`, `techpulse`,
   `foodiebite`, `minimalgrid`, `chrononews`, `novastore`, `lumenlife`,
   `traveltrove` exist nowhere in the workspace. They are `status: 'placeholder'`
   and are excluded from the sitemap. Do not let one ship.
2. **The real product cannot be listed yet.** `BLG-GEL-001` is a real, finished
   template, but its README says it was built for one specific blog and is not
   for resale. `resale` is recorded per product in `docs/REGISTRY.md` and the
   gate refuses to `publish` anything that is not `allowed`.
3. **Licensing is singular and server-side.** The client-side `MEVA-` validator
   was deleted in C002 -- it was inverted, accepting invented keys and rejecting
   real serials. `blogger-license-system` owns the model: a serial is five groups
   of five hex characters, an HMAC of `SECRET_KEY` over `blogId:templateId`,
   recomputed server-side from the blog's own domain. The buyer pastes the
   serial alone, never their email (C010). The storefront's copy describes this
   model and calls nothing. See `docs/TASKS.md` -> Licensing.

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


### 2026-10-06 -- WEBSTR001-C008 (backfilled 2026-10-07)

Four live-page defects, every one found by opening a browser while the suite was
green: mockups generated 800x500 landscape into an `aspect-[3/4]` card, so
`object-cover` cropped the headline to "...gger Experience"; four strings
sitting directly under the Buy button still told buyers to paste into a Blogger
"License Key" widget that does not exist; and the homepage hard-coded
`99 / 100`, `12,500+ Active Bloggers` and `4.96 / 5.0 Customer Rating` over a
catalog listing nothing.

Remembered for: a green suite was not evidence here. Three of the four are the
kind of lie a page tells about itself, and nothing in the repo asserts "the
number on screen corresponds to anything".

### 2026-10-07 -- WEBSTR001-C009 and C010 (backfilled 2026-10-07)

C009 -- the licence-redeem AUDIENCE. The `redeem` body is
`{ serial, email, domain, templateId }`, which is buyer data rather than an
anonymous proof; the serial sits in the served HTML because the guard has to read
it; and a redeem reachable on the ordinary page-load path fires once per visitor
of that buyer's blog. `sessionStorage` caps repetition and does nothing about
the audience, which is exactly why the old guidance read as defensible in review
-- every individual fact in it was correct and the conclusion still was not.

C010 -- the storefront told buyers to paste their email and serial together. The
serial is `HMAC(SECRET, blogId:templateId)` and the worker recomputes it from
the blog's own domain, so the email is never an input (the `isValidEmail` guard
at `worker/src/index.js:425`); asking for it invites the buyer's address into
their own published markup, which is what the outbound-call rule exists to
prevent. Same change: the `Pro Tip` and `Note` callouts collapsed to one
character per line on a phone, because a flex label needs `shrink-0` *and* the
body needs `min-w-0` -- measured 22x48 at 360px before, 59x16 at every width
from 320 to 1280 after.

Remembered for: the leak is who can trigger a call, not what it returns; and
"paste your email" is a design defect even when nothing uses the email.

### 2026-10-07 -- WEBSTR001-C013

Staleness watermark added: `tests/check-capsule-staleness.cjs`, run as
`npm run capsule:check`, inside `npm test`. This closes the deferral written
at the foot of the C011/C012 entry above, which named the gap and said it was
"worth its own change rather than three paragraphs written in passing" -- so it
is one now, and the three missed entries (C008, C009, C010) are backfilled above.

The rule is ORDER, not coverage: the highest `| WEBSTR001-C### |` row in
`docs/CHANGES.md` must be <= the highest id named in this file. Coverage stays
deliberately unchecked, because this capsule holds a selective history and
demanding every row would force retroactive entries for state that has already
moved on. BLG-C207 in the sibling project settled that, and BLG-C081 records a
check being deleted for firing on rows it never owed.

Two traps are encoded in the gate rather than left for a reader to rediscover.
The ledger is parsed as rows, never as prose, because line 61 of
`docs/CHANGES.md` reserves the band with `WEBSTR001-C001`-`WEBSTR001-C999` and
a prose scan reads that as a real C999 -- a failure that reads as plausible, and
`docs/MEMORY_CAPSULE.md:77` records an earlier naive regex hitting it. And this
file's own span forms are parsed: it writes `WEBSTR001-C004 through C006` and
`WEBSTR001-C011 and C012`, so a gate matching only the prefixed id would stop
at 011 and report this capsule stale on an entry that says 012 in plain sight --
the same defect as the sibling's first version reading `BLG-C200-C206` as 200.

The prefix is derived from `PROJECT_ID` rather than written here, as established
in C011, so a pinned literal cannot outlive the project id (B-041).

### 2026-10-07 -- WEBSTR001-C014

**A fix that was itself wrong, caught by re-reading it instead of trusting it.**

C012 replaced "Nine products render" with "30 products render" because it read
"30 slugs" in `src/data/templates.ts` and took that to disprove the guide.
Measured: **9** products, **28** slug fields, 36 `id:` in total because 27 of
them belong to nested `demos:`. So the doc was right, the number was wrong, and
the reasoning that produced the wrong number was counting a different unit than
the sentence it was correcting.

That is the recurring shape in this project -- R26 again: **the observation was
true, the conclusion drawn from it was not.** There really are 30-ish slug
looking strings in that file, and it really is true that they are not products.
A gate cannot catch this, because every check that could run was green: the file
parsed, the guide rendered, the registry printed rows, `npm test` passed. What
found it was going back and reading the claim against a fresh measurement.

The delivered sentence was also self-defeating -- a hard figure followed
immediately by "read it from there rather than trusting this sentence" -- and
C012's ledger row still says "the count now reads from the file that holds it",
which the diff shows it does not. Ledger rows are written by the session that
made the change, so they inherit that session's belief. **A row is a record of
what was intended, not proof of what shipped.** When the two disagree, measure.

Fix is to remove the figure rather than correct it to 9. "Nine" was correct the
first time and is still not worth restoring: it rots the instant the catalog
changes, and it has already rotted once inside a single change. `src/data/templates.ts`
is the source, `npm run registry` prints the count, and any sentence that wants
a number should point at those rather than restate one.

### 2026-10-07 -- WEBSTR001-C015

**I built a gate to warn about a trap, then walked straight into the same trap
one gate over.**

The C013 work is about one sentence: `docs/CHANGES.md` line 61 reserves
`WEBSTR001-C001`-`WEBSTR001-C999`, and a prose scan reads that as a real row
at 999. My new gate documents it, tests it, and quotes the band in three places.
Then `check-ids.cjs` -- which scans every tracked file for unresolved ids --
found `WEBSTR001-C999` in those comments and failed the build.

Notably, `check-ids.cjs` already handles this exact content, by exempting
`docs/CHANGES.md` wholesale at line 171, because that file has the same
sentence on line 61. That is a file-level exemption standing in for a rule
nobody wrote down, and it worked only because the file happened to be on the
list. The rule itself -- *a band reservation is not a reference* -- was never
encoded. It is now, narrowly: strip spans that open at `PREFIX-C001`.

Two things worth keeping:

**First, the process one.** Every `npm test` I ran before committing was green,
and not by luck: the file was untracked, and a gate built on `git ls-files`
literally cannot see it. Staging changed the input. So the failure appeared only
on the post-push re-run. If the workflow said "commit, push, done" instead of
"commit, push, re-run", `main` would now be red. **A gate over `git ls-files`
sees a different repository before and after `git add`.**

**Second, on exemptions.** The temptation was to exempt `tests/` outright --
"test files legitimately contain fake ids". Rejected: that would also blind the
gate to a test asserting against a change nobody recorded, which is exactly the
thing worth catching. An exemption stated as a *shape* (a span opening at C001)
keeps the signal; an exemption stated as a *location* (`tests/`, one filename)
loses it. The same logic is why C013 parses the ledger by row structure rather
than skipping `docs/CHANGES.md`.

Also worth recording because it cost a false alarm: my first mutation probe for
"corrupt the seal" silently no-opped -- it matched `/f3105f9\s*\$/` against a
markdown row that ENDS in a pipe -- so the gate reported exit 0 and looked like
a miss. **A mutation that fails to apply is indistinguishable from a gate that
failed to fire** unless you assert the mutation applied first. The probe now
aborts when `badLine === sealedLine`.

### 2026-10-07 -- WEBSTR001-C016

**The verification sweep found this repo's licensing record three facts behind
the product it describes, and every one was checkable rather than arguable.**

A full cross-repo verification session (this machine, N24S1) read the shipped
template's guard against what this store claims about it. Three stale facts:

1. The README and TASKS.md both still sold the AUTHOR_URL bug as open. It was
   fixed upstream as BLG-C426 and shipped in v1.2.0. The lesson repeated from
   C009: a task citing a line number is true until the file moves, so the fix
   here re-verified lines 2758 and 3298 in the v1.2.0 product before writing
   them down.
2. The guard-context question was filed as UNANSWERED. It isn't unanswered any
   more -- the takedown on 2026-10-06 produced R30, and R30 forbids a customer
   identifier in a URL outright. A question can be closed by a rule arriving,
   not just by code landing. Disposition rewritten from UNANSWERED to
   WON'T-FIX with the rule quoted.
3. The registry said BLG-GEL-001 was v1.1.0; the trees all ship v1.2.0.

The pattern across all three: the store's words about the template drifted
while the template moved, and nothing in this repo's gates can see another
repository. The registry:sync tool catches version drift in products.json,
but only because the version is data it owns -- the prose claims in README
and TASKS have no gate, which is why they rotted. Closed by hand, with
citations.

### 2026-10-07 -- WEBSTR001-C017

**One session, one record per repo -- and a standing practice so it stays that
way.**

`docs/SESSION-REPORT-2026-10-07.md` is this project's unique record of the
C009 through C016 storefront session: what each change delivered, the verified
facts behind each claim, the five patterns the session named (a green suite is
not evidence; R26's observation-true-conclusion-wrong; a gate over `git
ls-files` sees a different repository before and after `git add`; a question
can be closed by a rule arriving; the leak is the audience, not the
repetition), the operator-owned leftovers, and the commit table. It is not
about the same day's separate one-guard session (B20 / BLG-C261), which has
its own three sibling reports.

The companion records live in the sibling repos, each through that repo's own
mechanism: `the-machine` SYNC entry B-044 (the registry rows that had gone
stale, this project's change prefix among them), the Blogger project's SYNC
entry BLG-C302 (whose own text records the storefront cross-check as its
origin), and a read-only cross-check entry in `blogger-license-system`
`docs/WORKLOG.md`. `RELATIONSHIPS.md` now carries "Session records: one
document here, one pointer per sibling" -- the table of where each repo's
record lives and how it is written -- so the next session repeats the practice
mechanically instead of rediscovering it.

**Standing practice, recorded here as the rule:** every change to this
repository updates its session record and the sibling pointers the same
session. The template-meva half is enforced by `capsule:check`; the sibling
halves are enforced by each sibling's own gates.

Two statements in this capsule were corrected while writing the report, both
predating the work they misdescribed: the "three facts" item 3 still described
the deleted client-side `MEVA-` validator and a split licensing model, and the
baseline Gates line said "all four" when `npm test` has run six gates since
C011 and C013. Both are the same failure this capsule exists to catch, in
miniature -- prose about the code, outliving the code. Also re-measured:
C014's "28 slug fields" holds (28 data assignments + 2 function-signature
parameters is the raw 30).

### 2026-10-07 -- WEBSTR001-C018

**Two sessions, one working tree, one id: the C017 collision.**

The C009-C016 storefront session and the licence-system session ran
concurrently on this machine. Both read the same ledger maximum -- the
storefront session's C017 row was written but not yet committed -- so
`npm run id:next` returned the same C017 to both, and both wrote
`docs/SESSION-REPORT-2026-10-07.md`. The licence-system session's write
replaced the storefront session's uncommitted file; the storefront session
then committed `13b657f`, capturing the other session's content under its
own C017 row, which `ea52ea7` sealed. The sealed row described a file that
was never committed; the committed file was described by no row. C018
reconciles: the file now carries the storefront record the C017 row
promises (reconstructed from the row, this capsule's C017 entry and the
commit message) plus the licence-system day the operator's standing rule
requires -- licence-repo changes are reflected in every sibling's daily
record. The C017 entry's "not about the one-guard session" sentence above
described the file as authored and is superseded by that rule; recorded
here, never by editing an append-only row.

This is C008's collision recurring intra-machine: `id:next` protects
against writers it can see in the ledger, and an uncommitted row is
invisible to it. Single-machine is not single-writer. Allocate, write and
commit in one stretch; when a tree is shared, re-read the file you are
about to `git add` -- the storefront session committed a file it had
written, and the file it committed was not the file it wrote.
