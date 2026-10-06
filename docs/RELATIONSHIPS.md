# RELATIONSHIPS.md -- how TemplateMeva connects to the rest of the workspace

> **Class: SUBJECTIVE (this project only).** TemplateMeva is a storefront. It owns
> no template. Every product it shows is built, versioned and gated somewhere else,
> and this document is the contract for that.

## The shape

```
the-machine/                        PRIMARY. Owns the rules, the ProjectID allocator,
  projects.md                         the build plan, and every project's registry row.
  machine/new-project.ps1             Generates a template project, registers it in
                                      projects.md, THEN registers it here as a draft.
  build-plan/                         Objective rules. Referenced, never copied.
  machine/project-starter/            Canonical scaffold, byte-identical to
                                      blogger-new-template (gate 10).

blogger-<rebrand>-template/         SECONDARY. One real template product.
  PROJECT_ID = BLG-GEL-NNN            Owns its XML, its docs, its change ledger.
                                      Never edits this store.

blogger-new-template/               SECONDARY. The scaffold every new project is
                                      born from.

blogger-license-system/             The serial manager + licence API. Source of truth
                                      for serial format and the /unlicensed redirect.

template-meva/                      THIS PROJECT -- WEB-STR-001. SECONDARY to
  docs/products.json                   the-machine. DEPENDS ON the template projects
                                      and on blogger-license-system. Owns no template.
```

## The two directions

**In: registration.** `the-machine/machine/new-project.ps1` allocates the
ProjectID, scaffolds the project, writes the `the-machine/projects.md` row, and
then calls `tools/register-product.cjs` here with the same ProjectID. That writes
a `draft` product into `docs/products.json` and a matching draft catalog row.
Nothing is published. Publication is a separate, deliberate act.

**Out: read-only reference.** A template project never edits this repository. If a
product's facts are wrong here, the fix belongs in the template project, and the
correction lands here on the next registration or a manual `registry:sync`.

## Why registration is draft-first

`new-project.ps1` can know a ProjectID, a repo, a name and a version. It cannot
know a price, a `buyUrl`, a trial archive, a demo URL, or whether the owner
consents to resale. A generator that invents those produces a storefront that
publishes fiction -- which is exactly the state this project was found in, where
all nine products were invented and nothing in the data said so.

So the generated draft carries `TODO(operator)` markers instead of values, is
excluded from the catalog and the sitemap, and fails
`tests/check-registry.cjs` if anyone publishes it without filling those markers
and recording `resale: allowed`.

## What auto-registration deliberately does NOT do

- It does not set `price` or `originalPrice`. Inventing a price is a commercial
  decision.
- It does not set `buyUrl`. A dead checkout link is worse than none.
- It does not set `liveDemoUrl`. There is no demo until someone builds one.
- It does not mark a product `published`.
- It does not create a trial archive.
- It does not touch the other template projects. It writes only into this
  repository, and only the two files named above.

## Cross-references

| Need | Where |
|------|-------|
| How a ProjectID is allocated | `../the-machine/machine/MACHINE-SPEC.md` section 4 |
| Whether this project is registered | `../the-machine/projects.md` (tier PRIMARY row, `WEB-STR-001`) |
| Which base codes exist | `../the-machine/projects.md` -> "Base theme codes" (`STR`) |
| A real product's facts | `../blogger-llianmeva-template/docs/PROJECT_SPEC.md` |
| The licensing API this store must match | `../blogger-license-system/docs/REFERENCE.md` |
| Rules for the XML itself | `../the-machine/build-plan/` |

Per R11, cross-repository references in committed docs should be repository URLs;
the sibling paths above are offered as a labelled convenience because every repo
lives in the same workspace.
