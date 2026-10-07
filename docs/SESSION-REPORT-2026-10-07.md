# SESSION-REPORT-2026-10-07 — the licence-system session, from this storefront's side

> **Class: SUBJECTIVE (this project only).** One unique document per working
> day per related project; this is WEB-STR-001's record of the 2026-10-07
> `blogger-license-system` session. The full record lives in that repo
> (`docs/SESSION-REPORT-2026-10-07.md`); the machine-level record lives in
> `../the-machine/docs/SESSION-REPORT-2026-10-07.md`.

**Operator:** kuldeep Kamble · **Machine:** N24S1 · **Change:**
WEBSTR001-C017 (docs)

## What happened in the licence system this day

Three sessions on machine N24S1, all pushed to that repo's `main`:

| Commit | What |
|---|---|
| `3e28dbd` | sharp overridden to 0.35.5, clearing CVE-2026-96889 in the wrangler dev toolchain |
| `7000bcb` | Serial Manager Issue-tab redesign (generate, check and track in one place), full docs sync, deploy-readiness, and the free-plan database decision: **Workers KV, for the repo and for the live Worker** — already the only store that system uses |
| `aa913f1` + `d0fcfc3` | **One guard (task B20 / decision BLG-C261):** the Guard tab now serves `shipped-guard.txt` — the guard extracted byte-for-byte from the template product XML — verbatim, instead of generating a divergent snippet; a contract verifier pins byte equality three ways, and `.gitattributes` pins the file to LF so the byte contract holds on every machine (B-045 / GOTCHAS 25) |

## Why none of it changed this storefront

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

## The standing convention this day sets

Every project related to `blogger-license-system` carries one unique
`docs/SESSION-REPORT-YYYY-MM-DD.md` per working day, registered by its own
conventions, and **updated whenever the licence repo changes** — this file is
that document for WEB-STR-001. `blogger-new-template` deliberately carries
none: it is the unstarted scaffold, kept byte-identical to
`machine/project-starter` by the machine's own gate.

## Verification

- Licence repo offline chain, re-run this day on N24S1: `node
  tools/smoke-page.cjs` **218 passed, 0 failed**; `cd worker && npm test`
  **487 passed, 0 failed** across 10 suites (guard contract 15, binding 36,
  blogId flow 78, crypto 86, api 73, licensing 103, forgery 29, kv helper 27,
  rotation 33, docs 7); `npm run guard` **6 passed, 0 failed**.
- This repo with this change: `npm test` (typecheck, oxlint, registry,
  `sitemap:check`, `id:check`, `capsule:check`) green — see the C017 ledger
  row.
- Nothing that ships changed in this repo: every edit is a document recording
  what the licence system already does.
