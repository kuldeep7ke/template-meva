# TemplateMeva — Architecture

How the store is built, how routing and data flow work, and what the Cloudflare edge layer does.

---

## 1. Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| Framework | React 19 + TypeScript (strict) | Type-safe components, no runtime router dependency |
| Build | Vite 8 + `@tailwindcss/vite` | Sub-second builds, HMR, small output |
| Styling | Tailwind CSS v4 | Zero-runtime CSS, utility-first |
| Icons | lucide-react + custom `AnimatedIcon` | Crisp vectors; `AnimatedIcon` covers the branded set |
| Routing | History API + Cloudflare `_redirects` | Client-side navigation with real deep links |
| Hosting | Cloudflare Pages | Edge caching, Brotli, free TLS |
| Lint | oxlint | Fast, zero-config rules for React and TS |
| SEO | JSON-LD + OpenGraph + per-route titles | Rich results and share previews |

Production output is roughly 394 kB of JS (108 kB gzipped) and 61 kB of CSS (10 kB gzipped), built in under 400ms.

---

## 2. Directory layout

```
public/            Static files copied verbatim into dist/
  _headers         Security + cache policy per path
  _redirects       SPA fallback rewrite
  download/        Trial .zip archives served to buyers
  images/          Generated SVG template mockups
src/
  components/      Reusable presentational units
  data/            Static catalog, docs articles, and site configuration
  pages/           One component per route
  types/           Shared TypeScript models
  utils/router.ts  Routing hook and route parser
tests/
  check-registry.cjs   Catalog / registry / sitemap parity gate
tools/
  register-product.cjs Auto-register a Machine project as a draft product
```

Data is static TypeScript, not fetched at runtime. Every page imports from `src/data/`, so content changes ship as a rebuild. That keeps the deployment a pure static bundle with no API dependency.

## 2a. Product visibility (the one gate everything else respects)

`src/data/templates.ts` carries every catalog row, and each row carries a
`status`:

| status | In the gallery | Reachable at `/templates/:slug` | In `sitemap.xml` |
|--------|----------------|---------------------------------|------------------|
| `published` | yes | yes | yes |
| `draft` | no | no | no |
| `placeholder` | dev builds only | dev builds only | no |

`LISTED_TEMPLATES`, `isListed()` and `findListed()` are the only places that
decide this. Pages do not re-implement the test: `TemplateDetail`,
`DemoShowcaseHub` and `LivePreviewFrame` each resolve their slug through
`findListed()` and render a "not published" panel when it returns nothing,
rather than falling back to the first row of the catalog. A fallback there is
how a draft or placeholder URL ends up serving another product's price and
reviews.

`Navbar`, `Footer` and the gallery callout resolve their product links through
`MULTI_DEMO_TEMPLATES` / `FEATURED_TEMPLATES` for the same reason. They used to
hardcode `/showcase/smartmag` and `/templates/spotlight`.

`npm run registry` enforces the same rule statically, so the invariant cannot be
lost by a page that forgets to ask:

1. `docs/products.json` parses; ProjectIDs are unique and well-formed.
2. Every registered product appears in `docs/REGISTRY.md`.
3. Every `placeholder` catalog slug is declared as a fixture.
4. Every catalog row carrying a `projectId` is registered.
5. `published` requires `resale: 'allowed'`.
6. A published row contains no `TODO(operator)` marker, and has a price and a `buyUrl`.
7. `sitemap.xml` and the catalog agree in **both** directions.
8. No buyer's email or serial can reach the served page (see §9).

**As of WEBSTR001-C001 a production build lists nothing.** All nine rows are fixtures
and `BLG-GEL-001` is a draft. That is the true state of the catalog. `npm run dev`
shows the fixtures so a fresh clone renders something.

---

## 3. Routing

`src/utils/router.ts` exposes `useRouter()` and `parseRoute()`.

`useRouter()` keeps a single `location` string in state, which is `pathname + search`. Tracking the query alongside the path is what makes category deep links work — `navigate('/?category=Tech')` updates both the URL and router state, and `App.tsx` reads the parameter back out with `getQueryParam(location, 'category')`.

`parseRoute()` normalizes trailing slashes, strips the query, and maps a path to a route name plus params:

| Route name | Paths | Page |
| :--- | :--- | :--- |
| `home` | `/` | `HomeGallery` |
| `template-detail` | `/template/:slug`, `/templates/:slug` | `TemplateDetail` |
| `demo-showcase` | `/showcase/:slug`, `/preview-hub/:slug` | `DemoShowcaseHub` |
| `live-preview` | `/preview/:slug` | `LivePreviewFrame` |
| `docs` | `/docs`, `/docs/:docSlug` | `HelpDocs` |
| `unlicensed` | `/unlicensed`, `/trial-expired` | `UnlicensedNotice` |
| `contact` | `/contact` | `ContactPage` |

Unknown paths resolve to `home` so a stale link lands on the store instead of a blank screen. `/preview/*` renders without the navbar and footer, filling the viewport.

`App.tsx` is the dispatcher. It sets `document.title` per route for tab and search relevance, and passes `navigate` down rather than importing the router in each page.

### State ownership

Pages derive state from the URL wherever possible instead of mirroring it with `useEffect`. `HomeGallery` computes the active category from `?category=` on every render, and its category pills navigate rather than set local state. `HelpDocs` reads the article from its route param. Both avoid the cascading-render pattern that a `setState`-in-effect introduces.

Search text is the one exception to URL-derived state: `App.tsx` owns `searchQuery` and passes it to `HomeGallery` as `initialSearchQuery` with `onSearchQueryChange`. There is deliberately exactly one search input in the product — the hero field on the store page, which filters the catalog grid directly beneath it. Keeping search and results in one visual field preserves the browse-scan-compare flow, and it leaves the navbar for navigation only, which matters because the header has no room to spare at narrower desktop widths.

---

## 4. Data model

`src/types/index.ts` defines `Template`, `TemplateDemo`, `DocArticle`, `ComparisonItem`, and `SiteConfig`.

A `Template` carries everything its pages render: pricing (`price`, `originalPrice`), trial metadata (`hasTrial`, `trialDuration`, `trialDownloadUrl`), PageSpeed scores, `features`, `specifications`, `comparisonTable`, `reviews`, and a `demos` array. Because the pages read only from this shape, adding a product means adding one object.

`src/data/siteConfig.ts` holds `SITE_CONFIG` (branding, support email, working hours, socials), `CATEGORIES` (first entry is the no-filter sentinel), and `SORT_OPTIONS`. Category values must match the `category` strings used in `TEMPLATES`.

---

## 5. SEO

- `index.html` carries a `WebSite` + `SearchAction` JSON-LD block, canonical link, and full OpenGraph/Twitter card tags with absolute image URLs.
- `App.tsx` rewrites `document.title` on every route change.
- `public/sitemap.xml` lists the store root, contact, unlicensed notice, `/docs` and the five doc guides. It lists **no product URLs**, because no product is `published` — see §2a. Add `/templates/<slug>` only when that product is published; `npm run registry` fails in both directions if the two disagree.
- `public/robots.txt` allows crawling and points at the sitemap.
- The `SearchAction` in `index.html` targets `/?search=`, which **no route reads**. Search state is not in the URL in this build (the hero input owns it in `App.tsx`). Either implement `?search=` or drop the `SearchAction`, or the structured data advertises a feature that does not exist.

The store is a client-rendered SPA, so crawlers index the shell plus the sitemap. If organic search on individual template pages becomes a priority, add server-side prerendering for `/templates/:slug` — that is the single highest-impact SEO change available here.

---

## 6. Cloudflare edge configuration

`_redirects` is the SPA fallback:

```
/*    /index.html   200
```

Without it, a direct hit on `/templates/spotlight` returns a 404 from the edge.

`_headers` sets the baseline policy:

```
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
```

Vite emits content-hashed filenames into `assets/`, so the year-long immutable cache is safe. Files under `download/` are intentionally not cached this way — trial archives get replaced, and buyers should not receive a stale copy.

---

## 7. Asset generation

`generate-assets.js` writes the SVG template mockups in `public/images/`. Run it with `npm run assets` after changing the palette or layout definitions near the bottom of that file. Each entry produces a browser-mockup SVG with a gradient frame, simulated site header, hero block, sidebar widgets, and score badges.

---

## 8. Responsive behavior

- The gallery filter bar is hidden below `md`; search remains available on mobile.
- The navbar collapses to a drawer below `md`, and desktop nav links appear at `lg`.
- `LivePreviewFrame` constrains the iframe to 375px or 768px for device modes and shows a simulated address bar for those viewports.
- The footer drops credit and payment badges below `sm`.

## 9. Licensing boundary

This store is a **visitor-facing storefront**. It is not the licensing system.
`../blogger-license-system` is, and since WEBSTR001-C002 it is the single source of
truth. What the real system does:

| Step | Call | Carries |
|------|------|---------|
| Bind the licence (once per serial) | `POST /?action=redeem` | `{ serial, email, domain, templateId }` in a **JSON body** |
| Check the licence (every load) | `GET /?action=validate` | `templateId`, `domain`, `footer` fingerprint — **nothing else** |

The serial is 25 hex characters in five groups of five (`AB12C-34DEF-56789-0ABCD-EF012`).
It is **bound to the buyer's domain**, and the domain is what is checked from then
on. The 7-day trial also runs on the server clock, so clearing `localStorage`
cannot extend it. `validate` and `redeem` deliberately allow any CORS origin
(BLG-C408) because they run on buyers' own sites; every other action is
dashboard-only.

### What changed here, and what did not

| | Before | After |
| :--- | :--- | :--- |
| Key box on `/unlicensed` | client-side regex on a fictional `MEVA-XXXX-XXXX-XXXX` | **removed** |
| Accepted a fake key | yes | n/a |
| Rejected a real key | yes | n/a |
| Cause shown | three causes asserted regardless of what was known | says plainly when it was told nothing |
| Activation guide | fictional key + a `MEVA_LICENSE_CONFIG` snippet | real gadget, real serial format |
| Developer guide | legacy client-side `MEVA-` prefix check, not in the product | verified server-side contract |

The old box was worse than unfinished: it was inverted. It accepted any invented
key and rejected every genuine serial, so it told the truth about exactly the
wrong cases.

### Still divergent

The shipped template hardcodes `AUTHOR_URL = 'https://mevatemplates.com/unlicensed'`
while this store is `templatemeva.com`, and the guard redirects to a bare URL
with no query parameters — so this page cannot name the blog or template it was
served to. Both are recorded in `docs/TASKS.md` and neither is fixed here: the
first means editing the shipped XML in `blogger-llianmeva-template`, which needs
its own change ID.

### The invariant, enforced

A buyer's email and serial must never appear in the served markup, the template
XML, or the URL of a validation request. The validation call carries the template
id, the site's domain and a non-identifying footer fingerprint. Activation is
server-side, and the guard must fail **open** on silence — blocking only on an
explicit refusal.

`npm run registry` check 8 enforces this across `src/`, failing on
`BUYER_EMAIL_HERE`, `BUYER_SERIAL_HERE`, `data-email`, `data-serial`, or an
email/serial-bearing `action=validate` URL.