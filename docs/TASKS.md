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
- [x] Prove the round trip end to end (closed 2026-10-18, WEBSTR001-C019). The
  original plan was a throwaway project; the proof came from a real one instead:
  BLG-CHI-001 was generated through the full flow on N24S2, its draft landed in
  the storefront (`docs/products.json`, `docs/REGISTRY.md`,
  `src/data/templates.ts`), and its registry row landed in
  `the-machine/projects.md` (machine commit `7baed58`).
  - 2026-10-06 (WEBSTR001-C005 session): the `-WhatIf` half is proven.
    `new-project.ps1 -WhatIf` with `-SourceXml` pointed at the real
    `blogger-llianmeva-template` product XML allocates `BLG-GEL-002`,
    measures the base theme, and prints the full plan including the storefront
    draft step. The for-real half is DEFERRED, by decision: it would register
    a `BLG-GEL-002` row in `the-machine/projects.md` and a draft product in
    `docs/products.json` that we would then have to retract.
  - closed 2026-10-18 (WEBSTR001-C019) -- the real run happened, as a real
    project rather than a throwaway; the draft it produced is in this repo and
    its registry row is in `the-machine/projects.md` (commit `7baed58`). No
    retraction was needed.

## Catalog honesty

- [x] The 9 pre-existing catalog entries are flagged `placeholder` and excluded
  from `public/sitemap.xml`.
- [x] **DECIDED 2026-10-06 — the store stays in build/test mode until real launch.**
  The 9 placeholders stay as dev-only fixtures. A production build lists nothing,
  and that is intended: it is the honest state of the catalog while the real
  products are still being built. Do not "fix" the empty production catalog by
  publishing a fixture.
  - decision: keep as-is. Re-open only when a real template is ready to sell.
  - superseded 2026-10-23 (WEBSTR001-C023): `BLG-GEL-001` is the first real
    product and is published. A production build now lists exactly one product;
    the nine fixtures remain dev-only.
- [x] **DECIDED 2026-10-06 — `BLG-GEL-001` stays `not-for-resale`.** It is
  registered as a draft and the gate keeps refusing to publish it. That project
  was built for one specific blog; listing it as a product is a separate decision
  needing that owner's agreement, not a field edit.
  - decision: do not publish. Revisit only if the owner agrees to sell it.
  - superseded 2026-10-23 (WEBSTR001-C023): the owner cleared resale.
    `BLG-GEL-001` is now `resale: allowed` and published as `llianmeva` at
    $12.95, with `buyUrl: /contact` and the real v1.2.0 XML as the free-edition
    download. The gate still refuses any other product without `resale: allowed`.

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
  > Edit HTML > paste the serial.
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
- [x] **`AUTHOR_URL` in the shipped template pointed at `mevatemplates.com`. FIXED UPSTREAM (BLG-C426).**
  - disposition: RESOLVED UPSTREAM — fixed in `blogger-llianmeva-template` as
    BLG-C426 and shipped in template v1.2.0: `template/product/Blogger LlianMeva
    Template v1.2.0.xml` line 2758 now reads
    `var AUTHOR_URL = 'https://templatemeva.com/unlicensed'` and the operator
    email on line 3298 is `support@templatemeva.com` — both wrong-domain strings
    fixed together, as this task required. Re-verified 2026-10-07 on N24S1
    against the v1.2.0 product file; all three template trees point at
    templatemeva.com.
  - [x] **The redeem audience gap is closed in both docs** (WEBSTR001-C009).
    `TEMPLATE_DEVELOPER_GUIDE.md` §2.3 and `ARCHITECTURE.md` now carry the
    `document.body.id === 'layout'` screen gate, the reason it is easy to ship
    broken (the carrier must stay in the *rendered* page, so the serial is in
    served HTML and an ungated redeem fires once per visitor), and a checklist
    item. `validate` is documented as deliberately ungated.
- [x] **The guard sends no context to the notice page. DECIDED 2026-10-07 —
  deliberate, per R30.**
  - disposition: WON'T-FIX (by rule) — R30 of `the-machine/build-plan/RULES.md`
    ("Ship nothing that can get the owner's blog taken down") says: don't put a
    buyer's email, serial, or any customer identifier in an outbound call or a
    URL, because "query strings are logged by everyone." Appending
    `?domain=&template=&reason=` to the redirect would do exactly that on every
    unlicensed page view. The notice page stays generic; a buyer proves
    identity through the redeem flow with their serial instead.
- [ ] **The nine fixture slugs are not registered template IDs.** The server
  requires `templateId`, and its registry is keyed on repo name
  (`blogger-llianmeva-template`). `BLG-GEL-001` is now real and registered, but
  validating it end-to-end against the Worker is still the remaining step; the
  fixture slugs cannot be validated until they are real products.
  - disposition: OPERATOR (validate `BLG-GEL-001`; the list shrinks as fixtures are replaced)
- [ ] Should the notice page call `?action=validate` itself? The endpoint is
  deliberately open to any origin (BLG-C408) and takes `templateId` + `domain`,
  but the guard deliberately ships neither to the page (see the R30 decision
  above), and the only remaining source — the visitor's own browser via
  `document.referrer` — is unreliable and would still be extracting a customer
  identifier to send back over the network.
  - disposition: DEFERRED (its stated form is unanswerable under R30; revisit
    only if the operator wants a signed, non-identifier token design)

## Scaling past 10 templates

- [x] **DECIDED 2026-10-06 — the card keeps its trial download.** The redesigned
  card showed a "7-Day Trial" badge with no way to get the trial, which sent the
  buyer to the detail page for something the card had already promised. It is now
  a download link on the card itself. It is an `<a download>` rather than a route
  change, because the artifact is a file and navigating to it would render a
  template detail page for a `.zip`.
  - decision: restore. Done in WEBSTR001-C007; label generalized to `Download`
    in WEBSTR001-C023 so the same card serves a free edition and a time-limited
    trial.
- [x] **Store-wide marketing claims asserted things nobody had measured.** The
  banner read "99+ Core Web Vitals", the feature cards read "99+ Google PageSpeed
  Score" and "Google AdSense Auto & In-Feed Ads", and the activation card promised
  "lifetime updates and priority customer support". Closed in WEBSTR001-C023: the
  99+ claims and the priority-support promise are gone from the banner, navbar,
  footer and feature cards, the ad card now says the theme ships slots but no ad
  code, the JSON-LD card names the schemas the template actually ships, and the
  fabricated payment badges were replaced by "Checkout: By contact". The
  measured-stat strip still renders only when `STORE_STATS` holds real numbers.
  - decision: make the claims true rather than delete the section. Re-open only if
    a measured PageSpeed score or real support policy is added.
- [ ] **The catalog bundle grows linearly with the template count.** It is ~1.3 MB
  at 100 templates, ~1.6 MB total, ~400 kB gzipped, and up to 100
  `<TemplateCard>`s with 100 image requests on first paint. Moving to static JSON
  keeps the bundle flat regardless of catalog size: `public/data/index.json` for
  the grid, `public/data/templates/<slug>.json` for detail, fetched on demand. No
  backend needed on Cloudflare Pages.
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

- [ ] Replace the nine placeholder `.zip` archives in `public/download/` with real
  trial XMLs. Each fixture archive currently contains only
  `README-PLACEHOLDER.txt`. `BLG-GEL-001` routes its download buttons via the
  blog download page (C025); `llianmeva-v1.2.0.xml` is retained as the release
  artifact.
  - disposition: OPERATOR (the trial XML is built per template project)
- [ ] Replace the nine fixture `buyUrl` values, which point at
  `gumroad.com/l/<slug>-blogger-template` and are unverified. The published
  LlianMeva row uses `/contact` by decision (C023) and needs the same replacement
  once a checkout exists.
  - disposition: OPERATOR (needs the real checkout)
- [ ] Move the published LlianMeva `buyUrl` from `/contact` to a real checkout.
  The licence Worker validates serials but does not process payments, so the
  current path is a contact conversation, not a purchase.
  - disposition: OPERATOR (C023 deliberately launched with contact-only checkout)
- [ ] Wire the newsletter form; it still renders a success state and subscribes
  nowhere. The contact form now opens the visitor's mail client (C023) but still
  has no server endpoint, so a real inbox copy depends on the visitor pressing
  Send in their own mail app.
  - disposition: UNANSWERED (newsletter and contact endpoints -- Cloudflare Worker, Formspree, or a hosted form)
- [ ] Add prerendering for `/templates/:slug`. The store is a client-rendered
  SPA, so individual template pages currently index as an empty shell.
  - disposition: DEFERRED (largest single SEO win, but a real build decision)
