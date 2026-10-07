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
- [~] Prove the round trip end to end: generate a throwaway project with
  `-WhatIf`, then for real, and confirm the draft lands in the storefront and the
  registry row lands in `the-machine/projects.md`.
  - 2026-10-06 (WEBSTR001-C005 session): the `-WhatIf` half is proven.
    `new-project.ps1 -WhatIf` with `-SourceXml` pointed at the real
    `blogger-llianmeva-template` product XML allocates `BLG-GEL-002`,
    measures the base theme, and prints the full plan including the storefront
    draft step. The for-real half is DEFERRED, by decision: it would register
    a `BLG-GEL-002` row in `the-machine/projects.md` and a draft product in
    `docs/products.json` that we would then have to retract.
  - disposition: DEFERRED (owner chose "WhatIf only"; the SourceXml blocker is
    solved, so the real run only needs a decision to execute it)

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

- [x] **DECIDED 2026-10-06 — the product domain is `templatemeva.com`.** It is not
  live yet, which is fine: nothing depends on the domain resolving until a template
  is actually sold. The storefront already uses it in `siteConfig` and `index.html`.
  Only the shipped template disagrees.
  - decision: `templatemeva.com` is the product domain.
- [ ] **`AUTHOR_URL` in the shipped template still points at `mevatemplates.com`.**
  Re-verified 2026-10-07 against the current product, because a task box that
  reports a line number is only true until the file moves: it is now
  `template/product/Blogger LlianMeva Template v1.1.0.xml` **line 2752**, and the
  operator's contact email on line 3292 carries the same wrong domain. Every
  unlicensed trial blog redirects its visitors off this store to a domain that is
  not the store, and the contact address a buyer is given bounces. This is the
  highest-impact open bug: it is the exact path a frustrated buyer takes.
  - disposition: UNANSWERED — **raised again for a decision.** It is an edit to
    `blogger-llianmeva-template`'s product XML, which needs its own BLG-C### id, a
    `Backup/` snapshot and its validation cycle, so it cannot be made from this
    repository. It is a two-line change in that repo when approved. Note the
    second line: the operator email is the same string, so fixing only
    `AUTHOR_URL` leaves a wrong domain on the page.
  - [x] **The redeem audience gap is closed in both docs** (WEBSTR001-C009).
    `TEMPLATE_DEVELOPER_GUIDE.md` §2.3 and `ARCHITECTURE.md` now carry the
    `document.body.id === 'layout'` screen gate, the reason it is easy to ship
    broken (the carrier must stay in the *rendered* page, so the serial is in
    served HTML and an ungated redeem fires once per visitor), and a checklist
    item. `validate` is documented as deliberately ungated.
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

## Scaling past 10 templates

- [x] **DECIDED 2026-10-06 — the card keeps its trial download.** The redesigned
  card showed a "7-Day Trial" badge with no way to get the trial, which sent the
  buyer to the detail page for something the card had already promised. It is now
  a `Get Trial` download on the card itself. It is an `<a download>` rather than a
  route change, because a trial archive is a file and navigating to it would render
  a template detail page for a `.zip`.
  - decision: restore. Done in WEBSTR001-C007.
- [ ] **Store-wide marketing claims still assert things nobody has measured.** The
  top banner reads "99+ Core Web Vitals Blogger templates" and the feature cards
  read "99+ Google PageSpeed Score" and "100% Clean XML & No Encrypted Code". The
  fabricated *store metrics* were moved to `STORE_STATS` (WEBSTR001-C007), but these
  are product-positioning claims and deleting the whole section is a product
  decision, not a truth fix. They become defensible the moment one template has a
  measured PageSpeed score.
  - disposition: UNANSWERED (keep the section and make the claims true, or cut the section before launch)
  the bundle today: ~1.3 MB at 100 templates, ~1.6 MB total, ~400 kB gzipped, and
  up to 100 `<TemplateCard>`s with 100 image requests on first paint. Moving to
  static JSON keeps the bundle flat regardless of catalog size:
  `public/data/index.json` for the grid, `public/data/templates/<slug>.json` for
  detail, fetched on demand. No backend needed on Cloudflare Pages.
  - disposition: UNANSWERED (do it BEFORE template #20. It is far cheaper before 20 products are added by hand than after, and every product added now is one more thing to move. See "What to do before template #20" below.)
- [x] **Generate `sitemap.xml` from the registry.** Done in WEBSTR001-C005:
  `npm run sitemap` regenerates it, and `npm run sitemap:check` (wired into
  `npm test`) fails the suite when the file is stale. Product URLs are
  derived from `src/data/templates.ts`; the 9 core pages are the only
  human-owned part.
- [ ] **Decide the homepage for a large catalog.** Recommendation, not decided:
  a curated featured row of 4-6 (`badge: 'FEATURED'`), then the full catalog
  paginated at ~24/page, **default sort Newest**. NOT random rotation -- a
  returning buyer cannot tell whether the store has 9 or 900 products, and cannot
  bookmark one. NOT "Most Popular" until it is real: that sort reads `salesCount`,
  which is currently invented on all nine fixtures, and there are no download
  counts because the trial zips are placeholders and there is no analytics.
  - disposition: UNANSWERED (a product decision)
- [ ] **If "most downloaded" should ever be real**, it needs download events:
  Cloudflare Pages Functions or the existing Worker's KV. `salesCount` is currently
  a number in a source file, which is the same as no metric at all.
  - disposition: DEFERRED (a real project; only worth it once there is traffic)

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
