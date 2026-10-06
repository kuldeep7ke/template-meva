# TemplateMeva — Modern Blogger Template Store & Gallery
> High-performance Blogger (Blogspot) template marketplace, built to deploy on **Cloudflare Pages**.

![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Lint](https://img.shields.io/badge/lint-oxlint%20clean-00C853)

---

## ✨ Features & Scope

- 🏪 **Curated Template Gallery (`/`)** — the single home of search. One search box sits in the hero and filters the catalog grid directly beneath it, so results stay in place to browse. Categories live in the URL (`/?category=Tech`) so a filtered view is shareable and survives reload. The full filter panel (column layout, trial-only, sorting) sits below `md`; mobile gets a compact Category + Sort bar instead.
- 📰 **Template Deep-Dive (`/templates/:slug`)** — long-form detail page with PageSpeed scores, AdSense highlights, a Free-trial vs. Activated comparison table, technical specifications, and customer reviews, in four tabs.
- 🎯 **Multi-Demo Showcase Hub (`/showcase/:slug`)** — concept demo switcher for templates that ship multiple layouts (SmartMag has six), with per-category demo filtering and one-click launch.
- 📱 **Responsive Device Frame (`/preview/:slug`)** — ThemeForest-style iframe tester for **Desktop (100%)**, **Tablet (768px)**, and **Mobile (375px)**, with a reload control and a direct-open fallback for demo hosts that refuse framing.
- 📚 **Help & Documentation Center (`/docs/:slug`)** — installation, activation, customization, AdSense placement, and troubleshooting guides.
- ⚠️ **Anti-Piracy Notice (`/unlicensed`)** — landing page for visitors redirected from unlicensed or modified trial installs. Accepts `?domain=`, `?reason=`, and `?template=` query params and maps attribution-tamper reasons to the correct message.
- ✉️ **Contact & Support (`/contact`)** — department-routed inquiry form with SLA expectations and pre-requisite guidance.
- ☁️ **Cloudflare Pages edge setup** — `_redirects` SPA rewrite, `_headers` caching and security policy, `robots.txt`, and `sitemap.xml`.

### Pre-launch placeholders

Two features are intentionally non-functional until you connect a backend. Both are marked in code:

- The **contact form** and **newsletter form** render success states but submit nowhere.
- The **license-key validator** on `/unlicensed` only checks the `MEVA-XXXX-XXXX-XXXX` shape client-side.

---

## 🚀 Quickstart

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173
```

### All commands

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck (`tsc -b`) then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | oxlint over source and scripts |
| `npm run typecheck` | TypeScript project check only |
| `npm run assets` | Regenerate the SVG template mockups in `public/images/` |

A production build completes in roughly 400ms and emits ~108 kB of gzipped JavaScript.

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

> Before going live: replace the placeholder files in `public/download/` with the real trial `.xml` archives, and point `buyUrl` values in `src/data/templates.ts` at your live checkout.

---

## 📂 Project Structure

```
template-meva/
├── public/
│   ├── _headers                    # Cloudflare security + cache headers
│   ├── _redirects                  # SPA rewrite: /* /index.html 200
│   ├── favicon.svg, logo.svg       # Brand assets
│   ├── icons.svg                   # SVG symbol sprite
│   ├── robots.txt, sitemap.xml     # Crawler directives
│   ├── download/                   # 7-day trial .zip archives (placeholders)
│   └── images/                     # Generated SVG template mockups
├── src/
│   ├── components/
│   │   ├── AnimatedIcon.tsx        # Animated inline SVG icons
│   │   ├── Navbar.tsx              # Header: nav links, dropdowns, mobile drawer
│   │   ├── Footer.tsx              # Carded footer + newsletter
│   │   ├── TemplateCard.tsx        # Catalog card: rating, price, preview triggers
│   │   └── TrialVsActiveTable.tsx  # Trial vs. Activated comparison
│   ├── data/
│   │   ├── templates.ts            # Template catalog + demo definitions
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
├── generate-assets.js              # SVG mockup generator (npm run assets)
├── docs/
│   ├── ARCHITECTURE.md             # Stack, routing, SEO, edge setup
│   ├── USER_GUIDE.md               # Store administration & catalog editing
│   └── TEMPLATE_DEVELOPER_GUIDE.md # Blogger XML + licensing integration
└── README.md
```

---

## 📖 Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — stack, route map, data flow, SEO, and Cloudflare edge configuration.
- [docs/USER_GUIDE.md](docs/USER_GUIDE.md) — add templates and demos, edit prices, update docs articles, manage branding, and deploy.
- [docs/TEMPLATE_DEVELOPER_GUIDE.md](docs/TEMPLATE_DEVELOPER_GUIDE.md) — integrate Blogger XML themes with the licensing script and `/unlicensed` redirect.

---

## 📄 License

Commercial License © TemplateMeva. All Rights Reserved.