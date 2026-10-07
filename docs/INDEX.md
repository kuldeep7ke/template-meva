# INDEX.md -- what every document in this project is for

> **Class: SUBJECTIVE (this project only).** The router. Start here.

## Start here

| Document | What it answers |
|----------|-----------------|
| [MEMORY_CAPSULE.md](MEMORY_CAPSULE.md) | The short brief: what this is, and the three facts most likely to be forgotten |
| [ADDING-A-TEMPLATE.md](ADDING-A-TEMPLATE.md) | **How to add a template**, and the prompt to give the agent |
| [TASKS.md](TASKS.md) | What is open right now, and who owns each next step |
| [CHANGES.md](CHANGES.md) | The `WEBSTR001-C###` ledger -- what happened, in order |
| [RELATIONSHIPS.md](RELATIONSHIPS.md) | How this store connects to `the-machine` and to every template project |
| [REGISTRY.md](REGISTRY.md) | Every product registered from a ProjectID, and its status |

## Session records

| Document | What it answers |
|----------|-----------------|
| [SESSION-REPORT-2026-10-07.md](SESSION-REPORT-2026-10-07.md) | What the 2026-10-07 working day changed -- the storefront session (WEBSTR001-C009 through C016) plus, per C018, the same day's licence-system sessions and the concurrent-session collision that shaped this file -- how each claim was verified, and where the companion records live in the sibling repos |

One report per working day, named `SESSION-REPORT-<date>.md`. The sibling repos'
companion records are listed in [RELATIONSHIPS.md](RELATIONSHIPS.md) -> "Session records".

## Build and code

| Document | What it answers |
|----------|-----------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, routing, data flow, SEO, Cloudflare edge config |
| [USER_GUIDE.md](USER_GUIDE.md) | Adding templates, editing prices, editing docs articles, branding, deploying |
| [TEMPLATE_DEVELOPER_GUIDE.md](TEMPLATE_DEVELOPER_GUIDE.md) | Integrating a Blogger XML template with the licensing script and `/unlicensed` |

## Outside this repository

| Document | What it answers |
|----------|-----------------|
| `../the-machine/projects.md` | The registry of every project in the workspace, including this one |
| `../the-machine/machine/MACHINE-SPEC.md` | How ProjectIDs are allocated, and why |
| `../the-machine/build-plan/` | Objective rules shared by every template project. Referenced, never copied |
| `../blogger-license-system/docs/REFERENCE.md` | The licensing API this storefront's `/unlicensed` page has to agree with |

## Generated, not written

| File | Produced by |
|------|-------------|
| `public/images/*.svg` | `npm run assets` (`generate-assets.js`) -- reads `docs/products.json`, one `-thumb` and one `-hero` per product |
| `docs/REGISTRY.md` | `npm run registry:sync` (reads `docs/products.json`) |
| catalog rows in `src/data/templates.ts` | `npm run registry:add` (`tools/register-product.cjs`) |
| `public/sitemap.xml` | **generated** -- `npm run sitemap` (`tools/generate-sitemap.cjs`); `npm test` runs `--check` |
