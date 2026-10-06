# TASKS.md -- task ledger for WEB-STR-001

> **Class: SUBJECTIVE (this project only).** The build queue for TemplateMeva.
> Read alongside `docs/CHANGES.md`, which carries the ID for anything done.
> Legend: `[x]` done - `[~]` in progress - `[ ]` queued.

## Rules for this file

- Every open task (`- [ ]`) carries a `disposition:` line saying who owns the
  next step. Allowed values: `UNANSWERED`, `OPERATOR`, `DEFERRED`.
  **A disposition with no reason fails the gate** -- see
  `tests/check-registry.cjs`.
- A task is not closed by deleting it. Close it by ticking it and giving the
  change ID in `docs/CHANGES.md` that closed it.
- Never close a task by suppressing the gate that was failing.

## Done

- [x] Establish project identity, ID ledger and registry contract (WEBSTR001-C001).

## Registry and auto-registration

- [x] `tools/register-product.cjs` accepts a ProjectID and writes a `draft`
  catalog entry plus a `docs/REGISTRY.md` row.
- [x] `tests/check-registry.cjs` fails when the registry and the catalog
  disagree, when a `projectId` is duplicated, or when a non-`allowed` resale
  entry is `published`.
- [x] `the-machine/machine/new-project.ps1` calls the auto-register step after it
  writes its own registry row.
- [ ] Prove the round trip end to end: generate a throwaway project with
  `-WhatIf`, then for real, and confirm the draft lands in the storefront and the
  registry row lands in `the-machine/projects.md`.
  - disposition: UNANSWERED (needs a base theme XML to point `-SourceXml` at, which no throwaway has)

## Catalog honesty

- [x] The 9 pre-existing catalog entries are flagged `placeholder` and excluded
  from `public/sitemap.xml`.
- [x] **DECIDED 2026-10-06 — the store stays in build/test mode until real launch.**
  The 9 placeholders stay as dev-only fixtures. A production build lists nothing,
  and that is intended: it is the honest state of the catalog while the real
  products are still being built. Do not "fix" the empty production catalog by
  publishing a fixture.
  - decision: keep as-is. Re-open only when a real template is ready to sell.
- [x] **DECIDED 2026-10-06 — `BLG-GEL-001` stays `not-for-resale`.** It is
  registered as a draft and the gate keeps refusing to publish it. That project
  was built for one specific blog; listing it as a product is a separate decision
  needing that owner's agreement, not a field edit.
  - decision: do not publish. Revisit only if the owner agrees to sell it.

## Licensing

**DECIDED 2026-10-06 — Option A: `blogger-license-system` is the source of
truth.** The Worker is real, finished and tested; the storefront's placeholder is
adopted-to, not the reverse.

### Done (WEBSTR001-C002)

- [x] **The fake key validator is deleted.** It ran a client-side regex against an
  invented `MEVA-XXXX-XXXX-XXXX` shape, so it accepted any made-up key and
  rejected every real serial (`AB12C-34DEF-56789-0ABCD-EF012`, five groups of five
  hex). It could not validate anything: a key pasted into a web page has nowhere to
  go, because activation is bound server-side by domain.
- [x] **No email/serial input on the public page.** Collecting them there is exactly
  what the licensing model forbids, and it implied a check that never existed.
  Replaced with the real instructions: Blogger > Layout > Licence Activation gadget
  > Edit HTML > paste `email SERIAL` on one line.
- [x] **The notice page stopped inventing a cause.** The shipped guard redirects to
  a bare `AUTHOR_URL` and sends **no query parameters at all**, so `?domain=`,
  `?reason=` and `?template=` never arrive. The page now says so instead of
  confidently asserting one of three causes it cannot know.
- [x] **The activation guide describes the real mechanism** — the real serial
  format, the real carrier gadget, and the silent-failure trap (Blogger's `hidden`
  attribute stops the paste ever rendering).
- [x] **`TEMPLATE_DEVELOPER_GUIDE.md` no longer documents a DRM that is not
  shipped.** `meva-license-key`, `meva-credit`, `meva-link`, `meva-footer` and
  `indexOf('MEVA-')` all return **zero** occurrences in the product XML. The guide
  taught a `MEVA-` prefix check that any string beginning `MEVA-` defeats.
  Rewritten to the verified server-side contract.

### Blocked — needs a decision from the operator

- [ ] **Which domain is the product?** The shipped template hardcodes
  `https://mevatemplates.com/unlicensed`; the storefront is
  `https://templatemeva.com`. An unlicensed blog currently redirects visitors off
  this store entirely.
  - disposition: UNANSWERED (fixing it means editing `AUTHOR_URL` in the shipped XML, which belongs to blogger-llianmeva-template and needs its own change ID there)
- [ ] **The guard sends no context to the notice page.** Either the guard appends
  `?domain=&template=&reason=`, or the server's `policy` redirect URL carries them.
  Until one happens, the notice page cannot name the blog or template.
  - disposition: UNANSWERED (a design choice between editing the guard and configuring the server)
- [ ] **The 9 catalog slugs are not registered template IDs.** The server requires
  `templateId`, and its registry is keyed on repo name (`blogger-llianmeva-template`).
  Until real products exist, nothing can be validated against it.
  - disposition: OPERATOR (unblocked by building a real template)
- [ ] Should the notice page call `?action=validate` itself? The endpoint is
  deliberately open to any origin (BLG-C408) and takes `templateId` + `domain`, so
  it would work — but only once the guard supplies a domain. Not attempted until
  the previous item is settled.
  - disposition: DEFERRED (blocked by the guard-context decision)

## Pre-launch

- [ ] Replace the 9 placeholder `.zip` archives in `public/download/` with real
  trial XMLs. Each currently contains only `README-PLACEHOLDER.txt`.
  - disposition: OPERATOR (the trial XML is built per template project)
- [ ] Replace the 9 `buyUrl` values, which point at `gumroad.com/l/<slug>-blogger-template`
  and are unverified.
  - disposition: OPERATOR (needs the real checkout)
- [ ] Wire the contact form and the newsletter form. Both render a success state
  and send nothing.
  - disposition: UNANSWERED (which endpoint -- Cloudflare Worker, Formspree, or a mailto?)
- [ ] Add prerendering for `/templates/:slug`. The store is a client-rendered
  SPA, so individual template pages currently index as an empty shell.
  - disposition: DEFERRED (largest single SEO win, but a real build decision)
