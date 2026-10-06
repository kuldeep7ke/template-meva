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
- [ ] Decide what happens to the 9 placeholders at launch. Options: delete them,
  or keep them behind a `?demo=1` flag so the storefront has content without
  asserting fictional products.
  - disposition: UNANSWERED (a product decision, not a code one -- the storefront currently ships no real product)
- [ ] Register `BLG-GEL-001` in `docs/REGISTRY.md` with its real facts
  (name, version, 2-column, dark mode) and an explicit resale status.
  - disposition: OPERATOR (that project is `BLG-GEL-001`; its README states "Built for the City Politics blog -- do not distribute or resell without permission", so resale must be recorded as `not-for-resale` unless you say otherwise)

## Licensing

- [ ] Reconcile the storefront with `blogger-license-system`. The real serial is
  `FC29B-8FE59-A967D-430B4-73E9F` (5 groups of 5 hex, no prefix) validated
  server-side at `meva-licence-api.kuldeep7ke.workers.dev` with `templateId` +
  `domain`. The storefront instead validates `MEVA-XXXX-XXXX-XXXX` with a
  client-side regex and calls nothing.
  - disposition: UNANSWERED (pick one source of truth: adopt the Worker's format and endpoint, or replace the Worker)
- [ ] Fix the redirect domain split. The shipped guard bakes
  `https://mevatemplates.com/unlicensed`; this storefront is
  `https://templatemeva.com`. One of them is wrong and the notice page a buyer
  sees depends on which.
  - disposition: OPERATOR (which domain is the product's?)
- [ ] Correct `src/data/docs.ts`, which currently tells buyers their key "will
  instantly connect to our Cloudflare edge licensing server". Nothing is wired.
  - disposition: DEFERRED (blocked by the two decisions above)
- [ ] Never let a registry or generator write a buyer's email or serial into the
  served page, the XML, or an `action=validate` URL. `the-machine` states this
  as a strict invariant; the gate must assert it.
  - disposition: UNANSWERED (which file should own the assertion -- the Worker already has `worker/tools/verify-guard-contract.mjs`)

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
