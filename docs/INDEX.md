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
| `public/sitemap.xml` | **currently hand-maintained** -- see `TASKS.md` -> *Scaling past 10 templates* |
