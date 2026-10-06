# ADDING-A-TEMPLATE.md — the canonical way to add a template

> **Class: SUBJECTIVE (this project only).** One procedure. If you follow this,
> every template ends up the same shape, traceable to a project, and passing
> `npm run registry`.
>
> Answering "how do I add a template?" is what this file is for. There is exactly
> one answer and it is here.

---

## 0. The one rule

**A product is a real project, registered by its ProjectID.** Not a hand-written
card. If a template has no `projectId`, it does not belong in the store — that is
exactly the state this project was found in, with nine invented products and
nothing saying so.

So the flow is always:

```
   a Blogger template project exists (or is generated)
        |
        |  new-project.ps1 calls register-product.cjs automatically
        v
   docs/products.json  gains a row   (status: draft)
        |
        |  you fill in the human decisions
        v
   src/data/templates.ts  gains the rendered row
        |
        |  npm run registry   -- refuses to publish an unfinished one
        v
   published -> visible in the catalog + sitemap
```

---

## 1. If the template is a Machine-generated project

**Do nothing by hand.** `the-machine/machine/new-project.ps1` already calls this
project's `tools/register-product.cjs` after it writes its own registry row. The
product appears as a draft automatically.

```bash
# what the generator runs, if you ever need to run it yourself:
npm run registry:add -- --project-id BLG-GEL-002 \
  --name "My Template" \
  --repo https://github.com/kuldeep7ke/my-template \
  --version v1.0.0
```

Add `--dry-run` first to see exactly what it would write without touching a file.

---

## 2. The brief — copy this to the agent

This project's house format is the 8-box brief from
`../blogger-llianmeva-template/docs/TASK-BRIEF.md`. Do not invent a new prompt
shape; use this one. If a box is genuinely unknown, write
`unknown -- ask me` rather than letting it be guessed.

```text
TASK: Add "<template name>" to the TemplateMeva store as a published product.

WHY IT MATTERS: <who buys it and what they need to see. One or two lines.>

PROJECT ID: <BLG-GEL-NNN>. The template MUST already exist as a project with a
  PROJECT_ID file and a repo. If it does not, stop and say so — do not create a
  product for a project that is not built yet.

DONE MEANS:
  - npm run registry passes with this template at status "published"
  - it is reachable at /templates/<slug> and /preview/<slug>
  - it has a price, a buyUrl, and a real preview thumbnail
  - it appears in public/sitemap.xml
  - it does NOT appear in dev-only fixtures

REAL DATA — never invent any of these. If you do not have it, write
  TODO(operator) and leave the status as "draft":
  - price / originalPrice       (a commercial decision)
  - buyUrl                      (a dead checkout link is worse than none)
  - salesCount / rating / reviewCount / review text   (currently FABRICATED on
    all nine placeholder products. Copying a plausible number here is how the
    store ends up selling a rating that never existed.)
  - PageSpeed scores            (measure it or leave it 0 / TODO)
  - liveDemoUrl                 (no demo, no link)
  - "rtlSupported", "adsenseOptimized" etc.  (measure the XML, do not assume)

IN SCOPE: docs/products.json, the one catalog row for this template,
  public/images/<slug>-thumb.svg, public/sitemap.xml.

OUT OF SCOPE: every other template row. The other nine fixtures. Any change to
  the router, the gate, or the page components. Do not "improve" anything you
  notice nearby.

VERIFIED BY: npm run registry  AND  npm run build  AND  a screenshot of
  /templates/<slug> in npm run dev.

PRIORITY: now.
```

---

## 3. The mechanical procedure

If you are doing it by hand, in this order:

1. **Register it.** `npm run registry:add -- --project-id <ID> --name "<name>" --repo <url> --version <v>`
2. **Generate its thumbnail.** See §4 — `npm run assets` writes every mockup from
   the catalog, so a registered template gets one.
3. **Fill in the `TODO(operator)` markers** in the new catalog row in
   `src/data/templates.ts`. Every one of them.
4. **Set `status: "published"` and `resale: "allowed"`** in `docs/products.json`.
   `resale: "allowed"` means *the owner agreed to sell it*. Do not set it because
   the template is finished.
5. **Add `/templates/<slug>` to `public/sitemap.xml`.**
6. **Verify:** `npm run registry` then `npm run build`.

Steps 4 and 5 are enforced in both directions: the gate fails if a published
product is missing from the sitemap, and if a sitemap URL points at something
unpublished.

---

## 4. Thumbnails at 100 templates

Every template needs one preview image in `public/images/`. Do **not** hand-write
these.

`npm run assets` (`generate-assets.js`) generates one browser-mockup SVG per
catalog entry, taking the palette from the template's own `color1`/`color2`/
`accent`. Adding a template adds its mockup on the next run.

Two things about the generator you should know:

- **The rating and PageSpeed badges are placeholders.** Every generated mockup
  currently draws a `PageSpeed 99` chip and a `★ ★ ★ ★ ★ (5.0)` chip. Those are
  hardcoded in `generate-assets.js`, not read from the catalog, so a template
  with a measured PageSpeed of 78 and no reviews still gets a 99-and-5-stars
  image. That is a false claim rendered as a purchasable product image. Recorded
  in `docs/TASKS.md`. Until it is fixed, do not treat the mockup as evidence of
  anything.
- **Mockups are not screenshots.** They are generated placeholders that look like
  a layout. When real templates ship, replace the important ones with real
  screenshots and keep the generated SVG for the long tail.

---

## 5. What "published" costs you

Publishing is not a checkbox, it is a set of promises. Every one of these is
visible to a buyer and none of them can be defaulted:

| Promise | Where a buyer sees it |
|---------|----------------------|
| The price is the real price | card + buy button |
| `buyUrl` completes a payment | the Buy button |
| The trial `.zip` is a real template | the Download Trial button |
| `liveDemoUrl` is framable and is that template | the device preview |
| The serial format in the docs is the real one | the activation guide |
| The rating, if shown, came from a buyer | the card and the reviews tab |

The first three currently point at placeholders for the nine fixtures. That is
why they are `status: 'placeholder'` and invisible in production.

---

## 6. Common mistakes

| Mistake | What it costs |
|---------|---------------|
| Adding a catalog row without a `projectId` | The gate rejects it. This is intentional. |
| Copying `salesCount: 1840` from a fixture | The store sells a number nobody measured |
| Setting `resale: "allowed"` to get it published | Selling a template without the owner's agreement |
| Setting `status: "published"` while TODOs remain | The gate rejects it |
| Forgetting the sitemap entry | Silent — the product is live but unindexed |
| Publishing before replacing `buyUrl` | A dead checkout button on a live page |
| Editing a nearby thing you noticed | The "in scope / out of scope" line exists to stop this |

---

## 7. One template, end to end — worked example

```bash
# 1. register (draft)
npm run registry:add -- --project-id BLG-GEL-002 --name "My Template" \
  --repo https://github.com/kuldeep7ke/my-template --version v1.0.0

# 2. see what it wrote, without writing anything
npm run registry:add -- --dry-run --project-id BLG-GEL-003 --name "Probe" \
  --repo https://github.com/o/probe --version v1.0.0

# 3. generate the mockup for everything registered
npm run assets

# 4. fill the TODOs in src/data/templates.ts, then flip both switches:
#    docs/products.json -> status: "published", resale: "allowed"

# 5. add /templates/my-template to public/sitemap.xml

# 6. verify
npm run registry && npm run build && npm run dev
```

If step 6 fails, read what it says. It names the file and the condition.
