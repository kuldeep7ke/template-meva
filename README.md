# TemplateMeva — Modern Blogger Template Store & Gallery
> High-performance Blogger (Blogspot) template marketplace, built to deploy on **Cloudflare Pages**.

![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Lint](https://img.shields.io/badge/lint-oxlint%20clean-00C853)

---

## Identity and relationship to the rest of the workspace

| | |
| :--- | :--- |
| ProjectID | `WEB-STR-001` |
| Role | Storefront. It **owns no template** |
| Tier | SECONDARY to `the-machine` |
| Change IDs | `WEBSTR001-C###` / `WEBSTR001-S###`, derived from the ProjectID |
| Registry | [`docs/products.json`](docs/products.json) -> rendered to [`docs/REGISTRY.md`](docs/REGISTRY.md) |
| Relationship contract | [`docs/RELATIONSHIPS.md`](docs/RELATIONSHIPS.md) |

Every template this store sells is built, versioned and gated in its own repo.
When `the-machine` generates a new Blogger template project it calls
`tools/register-product.cjs` here, so the product appears automatically — as a
**draft**. The generator cannot know a price, a checkout URL, or whether the
owner consents to resale, so it never publishes anything, and
`npm run registry` fails if a product is published without `resale: 'allowed'`.

### Three things worth knowing before you change anything

1. **Nine catalog products are invented.** `spotlight`, `smartmag`,
   `techpulse`, `foodiebite`, `minimalgrid`, `chrononews`, `novastore`,
   `lumenlife` and `traveltrove` have no corresponding project anywhere in the
   workspace. They are `status: 'placeholder'`, they are hidden from production
   builds, and the sitemap excludes them. See [`docs/REGISTRY.md`](docs/REGISTRY.md).
2. **`BLG-GEL-001` is real and now published.** Its owner cleared resale and it
   went live in `WEBSTR001-C023` as `llianmeva` at $12.95, with checkout arranged
   through `/contact` while the store is pre-launch. It is the only row a
   production build lists. The gate still refuses any other product whose
   `resale` is not `allowed`.
3. **Licensing is owned by `blogger-license-system`, not by this store.** As of
   `WEBSTR001-C002` the Worker is the single source of truth. The storefront's
   old key box — which accepted any invented key and rejected every real one — is
   deleted. Serials look like `AB12C-34DEF-56789-0ABCD-EF012` and are bound to
   your domain server-side. The published free edition runs until a serial is
   activated. The shipped template v1.2.0 carries no baked redirect or support
   email at all (verified by grep in `WEBSTR001-C026`; the old BLG-C426 line
   citations no longer match the rebuilt file) — the redirect is served by the
   Worker, and the baked footer credit is explicitly DEMO wording. Confirming
   both match this store is an operator-side task in `docs/TASKS.md`.
   One deliberate limit remains: the guard sends the notice page no
   context, because R30 of the shared rules forbids a customer identifier
   travelling in a URL. See [`docs/TASKS.md`](docs/TASKS.md) -> *Licensing*.

---

## ✨ Features & Scope

- 🏪 **Curated Template Gallery (`/`)** — the single home of search. One search box sits in the hero and filters the catalog grid directly beneath it, so results stay in place to browse. Categories live in the URL (`/?category=Tech`) so a filtered view is shareable and survives reload. The full filter panel (column layout, trial-only, sorting) sits below `md`; mobile gets a compact Category + Sort bar instead.
- 📰 **Template Deep-Dive (`/templates/:slug`)** — long-form detail page with PageSpeed scores when measured, ad-slot details, a free-edition vs. activated comparison table, technical specifications, and customer reviews, in four tabs.
- 🎯 **Multi-Demo Showcase Hub (`/showcase/:slug`)** — concept demo switcher for templates that ship multiple layouts (SmartMag has six), with per-category demo filtering and one-click launch.
- 📱 **Responsive Device Frame (`/preview/:slug`)** — ThemeForest-style iframe tester for **Desktop (100%)**, **Tablet (768px)**, and **Mobile (375px)**, with a reload control and a direct-open fallback for demo hosts that refuse framing.
- 📚 **Help & Documentation Center (`/docs/:slug`)** — installation, activation, customization, AdSense placement, and troubleshooting guides.
- ⚠️ **Anti-Piracy Notice (`/unlicensed`)** — landing page for visitors redirected from unlicensed or modified trial installs. Accepts `?domain=`, `?reason=`, and `?template=` query params and maps attribution-tamper reasons to the correct message.
- ✉️ **Contact & Support (`/contact`)** — department-routed inquiry form that opens the visitor's mail client with the message filled in; no server endpoint yet.
- ☁️ **Cloudflare Pages edge setup** — `_redirects` SPA rewrite, `_headers` caching and security policy, `robots.txt`, and `sitemap.xml`.

### Pre-launch placeholders

Two features are intentionally non-functional until you connect a backend:

- The **contact form** composes a `mailto:` message to `SITE_CONFIG.supportEmail`; it does not submit to a server, and the success panel says so.
- The **newsletter form** still renders a success state but subscribes nowhere.

The old client-side `MEVA-` key validator is deleted (`WEBSTR001-C002`); `/unlicensed` describes the real server-side licence mechanism instead.

---

## 🚀 Quickstart

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173
```

### All commands

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Vite dev server with HMR. Dev builds show the published product plus the invented fixtures |
| `npm run build` | Typecheck (`tsc -b`) then build to `dist/`. Production builds list only `published` products |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | oxlint over source and scripts |
| `npm run typecheck` | TypeScript project check only |
| `npm run registry` | The registry gate: catalog, registry, sitemap and images must agree |
| `npm run registry:sync` | Regenerate `docs/REGISTRY.md` from `docs/products.json` |
| `npm run registry:add` | Register a new project as a draft product |
| `npm run test` | `typecheck` + `lint` + registry + sitemap + id + capsule gates |
| `npm run assets` | Generate preview + share images for every product, from the registry |

A production build completes in roughly 400ms and emits ~110 kB of gzipped JavaScript.

### Registering a template project

**The full procedure — and the prompt to hand the agent — is in
[`docs/ADDING-A-TEMPLATE.md`](docs/ADDING-A-TEMPLATE.md).** That is the canonical
answer; this is the short version.

Normally `the-machine` does this for you. By hand:

```bash
npm run registry:add -- --project-id BLG-GEL-002 \
  --name "My Template" \
  --repo https://github.com/kuldeep7ke/my-template \
  --version v1.0.0
npm run assets        # generates its preview + share images
```

It writes a **draft** to `docs/products.json` plus a draft catalog row, with
`TODO(operator)` markers wherever a value is a human decision. Add `--dry-run`
to see exactly what it would write without touching anything.

To publish one, fill in the price, `buyUrl`, trial archive and demo URL, set
`status: "published"` and `resale: "allowed"`, regenerate the sitemap with
`npm run sitemap`, then `npm run registry:sync && npm run registry`.

**Never invent a price, a sales count or a rating.** All nine fixtures have
fabricated numbers, which is exactly why they are invisible in production. The
published LlianMeva row carries a real $12.95 price, zero reviews and zero sales,
because that is the true state of a first listing.

---

## ☁️ Deploying to Cloudflare Pages

### Option 1: Git integration (auto-deploys)
1. Push the repository to GitHub or GitLab:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of TemplateMeva platform"
   git branch -M main
   git remote add origin https://github.com/your-username/templatemeva.git
   git push -u origin main
   ```
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/): **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Configure the build:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: `20` or newer

### Option 2: Wrangler CLI
```bash
npm run build
npx wrangler pages deploy dist --project-name=templatemeva
```

> Before going live: the nine fixture archives in `public/download/` are still placeholders. The published LlianMeva download buttons route via the blog download page (`https://llianmeva.blogspot.com/p/download.html`); `public/download/llianmeva-v1.2.0.xml` is retained as the release artifact. Its `buyUrl` points at `/contact` by decision, and should move to a real checkout when one exists.

---

## 📂 Project Structure

```
template-meva/
├── PROJECT_ID                    # WEB-STR-001
├── public/
│   ├── _headers                    # Cloudflare security + cache headers
│   ├── _redirects                  # SPA rewrite: /* /index.html 200
│   ├── favicon.svg, logo.svg       # Brand assets
│   ├── icons.svg                   # SVG symbol sprite
│   ├── robots.txt, sitemap.xml     # Crawler directives (published products only)
│   ├── download/                   # free-edition XML + nine fixture placeholders
│   └── images/                     # Generated SVG template mockups
├── src/
│   ├── components/
│   │   ├── AnimatedIcon.tsx        # Animated inline SVG icons
│   │   ├── Navbar.tsx              # Header: nav links, dropdowns, mobile drawer
│   │   ├── Footer.tsx              # Carded footer + newsletter
│   │   ├── TemplateCard.tsx        # Catalog card: rating, price, preview triggers
│   │   └── TrialVsActiveTable.tsx  # Trial vs. Activated comparison
│   ├── data/
│   │   ├── templates.ts            # Catalog + LISTED_TEMPLATES / findListed gates
│   │   ├── docs.ts                 # Help articles
│   │   └── siteConfig.ts           # Branding, categories, sort options
│   ├── pages/                      # One component per route
│   │   ├── HomeGallery.tsx         # Store gallery
│   │   ├── TemplateDetail.tsx      # Single template page
│   │   ├── DemoShowcaseHub.tsx     # Multi-demo showcase
│   │   ├── LivePreviewFrame.tsx    # Device switcher
│   │   ├── HelpDocs.tsx            # Documentation center
│   │   ├── UnlicensedNotice.tsx    # License notice
│   │   └── ContactPage.tsx         # Contact form
│   ├── types/index.ts              # TypeScript models
│   ├── utils/router.ts             # Client-side router + query helpers
│   ├── App.tsx                     # Route dispatcher
│   ├── index.css                   # Tailwind CSS v4 entry
│   └── main.tsx                    # React entry
├── tests/
│   └── check-registry.cjs          # Catalog / registry / sitemap parity gate
├── tools/
│   └── register-product.cjs        # Auto-register a new project as a draft
├── generate-assets.js              # SVG mockup generator (npm run assets)
├── docs/
│   ├── INDEX.md                    # Router: what every document is for
│   ├── MEMORY_CAPSULE.md           # The short brief
│   ├── TASKS.md                    # Open queue, with dispositions
│   ├── CHANGES.md                  # WEBSTR001-C### change ledger
│   ├── RELATIONSHIPS.md            # How this store connects to the Machine
│   ├── products.json               # Registry source of truth
│   ├── REGISTRY.md                 # Generated from products.json
│   ├── ARCHITECTURE.md             # Stack, routing, SEO, edge setup
│   ├── USER_GUIDE.md               # Store administration & catalog editing
│   └── TEMPLATE_DEVELOPER_GUIDE.md # Blogger XML + licensing integration
└── README.md
```

---

## 📖 Documentation

- [docs/INDEX.md](docs/INDEX.md) — the router: what every document is for.
- [docs/MEMORY_CAPSULE.md](docs/MEMORY_CAPSULE.md) — the short brief for a fresh session.
- [docs/ADDING-A-TEMPLATE.md](docs/ADDING-A-TEMPLATE.md) — **how to add a template**, and the prompt to give the agent.
- [docs/TASKS.md](docs/TASKS.md) — the open build queue.
- [docs/CHANGES.md](docs/CHANGES.md) — the `WEBSTR001-C###` change ledger.
- [docs/RELATIONSHIPS.md](docs/RELATIONSHIPS.md) — how this store connects to `the-machine` and every template project.
- [docs/REGISTRY.md](docs/REGISTRY.md) — every product this store represents, and its status.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — stack, route map, data flow, SEO, and Cloudflare edge configuration.
- [docs/USER_GUIDE.md](docs/USER_GUIDE.md) — add templates and demos, edit prices, update docs articles, manage branding, and deploy.
- [docs/TEMPLATE_DEVELOPER_GUIDE.md](docs/TEMPLATE_DEVELOPER_GUIDE.md) — integrate Blogger XML themes with the licensing script and `/unlicensed` redirect.

---

## 📄 License

Commercial License © TemplateMeva. All Rights Reserved.