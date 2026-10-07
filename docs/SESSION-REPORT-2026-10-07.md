# SESSION-REPORT-2026-10-07 — the storefront session (C009 through C016), and the same day's licence-system session

> **Class: SUBJECTIVE (this project only).** One unique document per working
> day per related project; this is WEB-STR-001's record of 2026-10-07. The
> storefront session (WEBSTR001-C009 through C016) is recorded here as
> WEBSTR001-C017; the same day's `blogger-license-system` sessions, and the
> concurrent-session collision that folded them into this file, are recorded
> as WEBSTR001-C018.

**Operator:** kuldeep Kamble · **Machine:** N24S1 · **Changes:**
WEBSTR001-C017 (docs) and WEBSTR001-C018 (docs)

## Scope

This is WEB-STR-001's unique record of the 2026-10-07 storefront session,
WEBSTR001-C009 through C016: what each change delivered with the verified
fact behind each claim, the five patterns the session named, the
operator-owned leftovers, and the commit table. The same session wrote
companion records in the sibling repos, each through that repo's own
mechanism: `the-machine`'s B-044 (its bug-catalog entry, referenced from
its SYNC log), the Blogger project's BLG-C302 (that repo's 2026-10-07 docs
change, whose own ledger row records this storefront cross-check as its
origin), and a read-only cross-check entry in `blogger-license-system`
`docs/WORKLOG.md`. The mechanism table that makes the practice repeatable
lives in [RELATIONSHIPS.md](RELATIONSHIPS.md) -> "Session records".

The same day also saw three sessions in `blogger-license-system` (the
Serial Manager redesign and KV decision, and the one-guard delivery). C017
as authored deliberately kept them out of this file, because they have
their own three sibling reports. C018 reverses that deliberately: the
operator's same-day standing rule is that **every licence-repo change is
reflected in every sibling's daily record**, and the collision described at
the end of this file is why both halves now share one document.

## The storefront session, change by change

**C009 — the redeem AUDIENCE (`ceb5c36`).** The `redeem` body carries
`{ serial, email, domain, templateId }`, the paste must sit in the rendered
page for the guard to read it, and Blogger's `hidden='true'` is precisely
what stops a widget rendering — so the serial lives in the served HTML and
a redeem on the ordinary page-load path fires once per visitor of that
buyer's blog. `sessionStorage` caps the repetition and does nothing about
the audience, which is why the old guidance read as defensible in review.
`ARCHITECTURE.md` gained a "Who may call it" column — `redeem` reads
*owner dashboard only*, `validate` is deliberately ungated because it
carries no credential. Fixed upstream in the template project as BLG-C425
(`if (document.body.id !== 'layout') { return; }`); this change made the
storefront say so, and re-verified the AUTHOR_URL bug at its new line
before citing it, because the task box's line number had gone stale.

**C010 — paste the serial alone, and the callouts that collapsed
(`e735211`).** The serial is `HMAC(SECRET, blogId:templateId)` and the
worker recomputes it from the blog's own domain, so a pasted email is never
an input — the optional-email guard and the `computeSerial` call in
`worker/src/index.js` prove it — yet every buyer-facing page said "paste
your email and serial", inviting the buyer's address into their own
published markup. Every page now says paste the serial alone; the optional
email group in the paste regex is kept as documented compatibility
tolerance. The `Pro Tip` and `Note` callouts collapsed to one character per
line on a phone: the label measured **22x48 at 360px** before and **59x16
at every width from 320 to 1280px** after `shrink-0` + `min-w-0`, with
`scrollWidth > clientWidth` null at all five — proof by measurement, not by
eye. `src/data/templates.ts` was deliberately untouched: its eleven
"license key" strings belong to placeholder fixtures no buyer reaches.

**C011 + C012 — gate the ledger; stop the guide hand-editing a generated
file (`ca2bf0c`).** The append-only ledger had no gate at all: not that a
referenced id resolves to a row, not that the counter is dense, not that a
seal points at a commit. `tests/check-ids.cjs` (wired into `npm test` as
`id:check`) checks all three, with the prefix derived from `PROJECT_ID`
rather than pinned (B-041). Two bugs in the gate itself made it measure
nothing while looking healthy — the seal was read from the empty cell after
the row's trailing pipe, and a `Set` of full shas was looked up by 7-char
prefixes so four genuine seals were reported as lies — both fixed, and the
gate proven by three mutations that each had to apply before being judged
caught. C012 fixed two doc claims at the source: three instructions told a
reader to hand-edit `public/sitemap.xml`, which C005 had made generated
with `sitemap:check` inside `npm test`.

**C013 + C014 — gate the capsule's staleness; drop the hand-typed product
count (`f3105f9`).** The capsule journal had stopped at C007 while the
ledger advanced through C012 — the record went quiet while the work kept
landing. `tests/check-capsule-staleness.cjs` (`capsule:check`, inside
`npm test`) enforces ORDER, not coverage: the highest ledger row must be
named in the capsule. Two traps are encoded rather than left for a reader
to rediscover: the ledger is parsed as rows because the band-reservation
note reads as a real row to a prose scan, and the capsule's own span forms
("C004 through C006") are parsed so the gate cannot report the capsule
stale on an entry that says the number in plain sight. C014 then caught
C012's own fix being wrong: "30 products render" was measured as **9
products, 28 slug fields, 36 `id:` in total** (27 nested in `demos:`) — the
figure was removed rather than corrected, because a count in prose is a
claim with nothing behind it and it had already rotted once inside a single
change.

**C015 — a band reservation is not a reference (`1687473`).** `id:check`
found the band reservation's upper bound quoted as a literal id in the new
capsule gate's own comments and failed the build — the gate built to warn about the trap walked into the
same trap one gate over. The exemption is encoded as a SHAPE (strip spans
that open at `C001`), not a location, so the signal survives; and the
failure only appeared post-push because a gate over `git ls-files` cannot
see an untracked file — the pre-commit runs were green against a different
repository than the post-push one. (The trap is still live: while writing
this very paragraph, C018 quoted that reserved id as a literal and
`id:check` failed the chain on this file — the gate catching the lesson's
own retelling.)

**C016 — the licensing record, three facts behind the product it
describes (`7209117`).** A full cross-repo verification sweep found the
storefront's words about the template had drifted while the template moved:
the AUTHOR_URL bug was already fixed upstream (BLG-C426, shipped in v1.2.0)
while README and TASKS still sold it as open; the guard-context question
filed as UNANSWERED was closed by R30 arriving (a question can be closed by
a rule, not only by code); and the registry said v1.1.0 while the trees
ship v1.2.0. All three closed by hand with citations, re-verified against
the v1.2.0 files before being written down.

## The five patterns the session named

1. **A green suite is not evidence.** Four live-page defects (C008,
   backfilled) were found by opening a browser while every gate was green;
   the same shape recurred across C009 and C010.
2. **The observation was true, the conclusion drawn from it was not
   (R26).** There really are 30-ish slug-shaped strings in
   `src/data/templates.ts`, and there really are 9 products — C014's
   correction of C012 was itself the pattern.
3. **A gate over `git ls-files` sees a different repository before and
   after `git add`.** C015's failure appeared only post-push, because the
   new gate file was untracked during every pre-commit run.
4. **A question can be closed by a rule arriving.** C016's guard-context
   question moved from UNANSWERED to WON'T-FIX not because code landed but
   because R30 forbade a customer identifier in a URL outright.
5. **The leak is the audience, not the repetition.** C009: `sessionStorage`
   caps how often the redeem fires and does nothing about who can trigger
   it — once per visitor of the buyer's blog.

## Operator-owned leftovers

The queue with dispositions is [TASKS.md](TASKS.md). The ones this session
left open or with the operator:

- The 9 catalog slugs are not registered template IDs — nothing can be
  validated server-side until real products exist (OPERATOR).
- Store-wide marketing claims ("99+ Core Web Vitals", "99+ PageSpeed",
  "100% Clean XML") assert things nobody has measured (UNANSWERED).
- The static-JSON catalog move should happen before template #20
  (UNANSWERED, with the cost argument recorded).
- Pre-launch: placeholder trial `.zip` archives, unverified `buyUrl`
  values, unwired contact/newsletter forms, no prerendering for
  `/templates/:slug` (OPERATOR / UNANSWERED / DEFERRED).
- `src/data/templates.ts` needs its "license key" pass the day a real
  product is published (recorded in C010).

## Commit table

| Change | Commit | Sealed by |
|---|---|---|
| WEBSTR001-C009 | `ceb5c36` | — |
| WEBSTR001-C010 | `e735211` | — |
| WEBSTR001-C011 + C012 | `ca2bf0c` | `f171df9` |
| WEBSTR001-C013 + C014 | `f3105f9` | `74a1fb7` |
| WEBSTR001-C015 | `1687473` | `fd3a579` |
| WEBSTR001-C016 | `7209117` | `ea52ea7` |
| WEBSTR001-C017 (this report) | `13b657f` | `ea52ea7` |
| WEBSTR001-C018 (the reconciliation below) | this change | this change's seal chore |

## The same day's licence-system sessions (added by C018)

Three sessions on machine N24S1, all pushed to that repo's `main`:

| Commit | What |
|---|---|
| `3e28dbd` | sharp overridden to 0.35.5, clearing CVE-2026-96889 in the wrangler dev toolchain |
| `7000bcb` | Serial Manager Issue-tab redesign (generate, check and track in one place), full docs sync, deploy-readiness, and the free-plan database decision: **Workers KV, for the repo and for the live Worker** — already the only store that system uses |
| `aa913f1` + `d0fcfc3` | **One guard (task B20 / decision BLG-C261):** the Guard tab now serves `shipped-guard.txt` — the guard extracted byte-for-byte from the template product XML — verbatim, instead of generating a divergent snippet; a contract verifier pins byte equality three ways, and `.gitattributes` pins the file to LF so the byte contract holds on every machine (B-045 / GOTCHAS 25) |

### Why none of it changed this storefront

- **The licensing API contract did not move.** `REFERENCE.md` — the API this
  store's `/unlicensed` page has to agree with — changed in wording and
  counts only ("Validate tab" became "check card on the Issue tab"; the
  per-browser template defaults table lists blogger-llianmeva-template
  v1.2.0; suite counts re-stated). No endpoint, request, response or policy
  fact changed, so the alignments recorded in WEBSTR001-C002, C009 and C016
  still hold as written.
- **The guard buyers run did not change either.** `shipped-guard.txt` is the
  same guard the template XML has carried since v1.2.0; the licence repo
  stopped generating a second, divergent variant (no trial, no expiry wall)
  and now hands out the real one. The activation carrier, serial format and
  call contract this store documents in `TEMPLATE_DEVELOPER_GUIDE.md` are
  unchanged.
- **The registry version agrees with ours.** The licence system's template
  defaults now list blogger-llianmeva-template v1.2.0 — the same version
  C016 corrected `docs/products.json` to, so the two registries no longer
  disagree.

## Why this file carries two sessions — the C017 collision (C018)

Two agent sessions ran concurrently in this one working tree on 2026-10-07:
the storefront session (C009 through C016, wrapping up as C017) and the
licence-system session. Both read the same ledger maximum — the storefront
session's C017 row was written but not yet committed — so `npm run
id:next` returned **the same C017 to both**. Both wrote
`docs/SESSION-REPORT-2026-10-07.md`; the licence-system session's write
replaced the storefront session's uncommitted file. The storefront session
then ran `git add` and committed `13b657f`, capturing the other session's
content under its own C017 row, which `ea52ea7` sealed. Result: **the
sealed row described a file that was never committed, and the committed
file was described by no row.** The storefront session's report as authored
was lost from disk; this reconstruction is built from the sealed row, the
capsule's C017 entry, and the commit message of `13b657f`, all three of
which describe it in detail.

**The reconciliation.** The file now carries the storefront record the
C017 row promises *and* the licence-system day the operator's standing rule
requires (licence-repo changes are reflected in every sibling's daily
record — the rule this day set, recorded in the licence repo's and the
machine's session reports). The C017 row's "deliberately NOT about the
same day's separate one-guard session" sentence described the file as
authored; it is superseded by that rule, and recorded as superseded here
rather than by editing an append-only row.

**The lesson, same shape as C008's collision but intra-machine.** C008
recorded two machines allocating the same id; this is two sessions on one
machine doing exactly the same thing, because `id:next`'s read-then-write
race only protects against writers it can see in the ledger, and an
uncommitted row is invisible to it. Single-machine is not single-writer.
Allocate, write and commit in one stretch; and when a tree is shared,
re-read the file you are about to `git add` — the storefront session
committed a file it had written, and the file it committed was not the file
it wrote.

## Verification

- Licence repo offline chain, re-run this day on N24S1: `node
  tools/smoke-page.cjs` **218 passed, 0 failed**; `cd worker && npm test`
  **487 passed, 0 failed** across 10 suites (guard contract 15, binding 36,
  blogId flow 78, crypto 86, api 73, licensing 103, forgery 29, kv helper 27,
  rotation 33, docs 7); `npm run guard` **6 passed, 0 failed**.
- This repo with this change: `npm test` (typecheck, oxlint, registry,
  `sitemap:check`, `id:check`, `capsule:check`) green — see the C018 ledger
  row.
- Nothing that ships changed in this repo: every edit is a document
  recording work already done and verified elsewhere.
