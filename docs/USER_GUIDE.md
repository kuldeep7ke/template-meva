# TemplateMeva — Store Owner & Administrator Guide

How to manage the template catalog, documentation, branding, and deployments. No build tooling knowledge required.

---

## 1. Adding or editing a template

Everything about a product lives in `src/data/templates.ts`, in the `TEMPLATES` array.

### Editing an existing template

Find the object by `slug` and change the fields. Prices, `lastUpdated`, `version`, and `rating` are the ones buyers see most often.

| Field | Notes |
| :--- | :--- |
| `price` / `originalPrice` | The storefront shows the discount automatically when `originalPrice > price`. |
| `trialDownloadUrl` | Path to the trial archive in `public/download/`. |
| `buyUrl` | Live checkout URL (Gumroad, LemonSqueezy, Stripe). |
| `category` | Must match a value in `CATEGORIES` in `src/data/siteConfig.ts`, or the template will not appear under any category filter. |
| `thumbnail` | Path to an SVG in `public/images/`. |
| `hasTrial` | Controls whether trial badges and download buttons render. |

### Adding a new template

Append an object to `TEMPLATES`. This is the complete required shape:

```typescript
{
  id: 'my-new-template',
  slug: 'my-new-template',
  title: 'My New Template Name',
  tagline: 'Short punchy description for catalog cards',
  description: 'One-line summary used in listings',
  fullOverview: `Longer overview text shown on the detail page.
Spreads across multiple lines.`,
  price: 12.95,
  originalPrice: 29.00,
  hasTrial: true,
  trialDuration: '7 Days Free Trial',
  trialDownloadUrl: '/download/my-new-template-7day-trial.zip',
  buyUrl: 'https://gumroad.com/l/your-link',
  rating: 4.95,
  reviewCount: 45,
  salesCount: 520,
  version: 'v1.0.0',
  releaseDate: '2026-10-01',
  lastUpdated: '2026-10-05',
  category: 'Magazine', // must match a CATEGORIES entry
  tags: ['Magazine', 'Dark Mode', 'AdSense Ready'],
  columns: '2 Columns', // '1 Column' | '2 Columns' | '3 Columns' | 'Grid / Masonry'
  layout: 'Magazine', // 'Magazine' | 'Clean / Minimal' | 'Personal' | 'Tech' | 'E-Commerce' | 'Portfolio'
  pageSpeedScore: { mobile: 98, desktop: 100 },
  thumbnail: '/images/my-new-thumb.svg',
  galleryImages: ['/images/my-new-thumb.svg'],
  liveDemoUrl: 'https://my-demo-blog.blogspot.com',
  badge: 'NEW', // 'HOT' | 'NEW' | 'FEATURED' | 'BESTSELLER'
  rtlSupported: true,
  darkModeSupported: true,
  adsenseOptimized: true,
  seoReady: true,
  specifications: [
    { label: 'Platform', value: 'Google Blogger (Blogspot)' },
    { label: 'Layout Version', value: 'Version 3 (Blogger Latest)' }
  ],
  features: [
    {
      title: 'Mobile Responsive',
      description: 'Works on all screens.',
      iconName: 'Smartphone',
      isHighlight: true
    }
  ],
  demos: [
    {
      id: 'my-new-template-default',
      title: 'Default Demo',
      slug: 'my-new-template-default',
      description: 'The standard layout.',
      thumbnail: '/images/my-new-thumb.svg',
      demoUrl: 'https://my-demo-blog.blogspot.com',
      category: 'Magazine',
      badge: 'DEFAULT'
    }
  ],
  comparisonTable: [
    { feature: 'Core Layout', trial: true, active: true },
    { feature: 'Remove Footer Credits', trial: false, active: true },
    { feature: 'Evaluation Period', trial: '7 Days Free Trial', active: 'Lifetime Unlimited Access' }
  ],
  reviews: []
}
```

After adding it:

1. Drop the trial archive at `public/download/<slug>-7day-trial.zip`, matching `trialDownloadUrl`.
2. Add a thumbnail to `public/images/`, or generate one with `npm run assets`.
3. Add the page to `public/sitemap.xml` under the Template Products section.

The template is then live at `/templates/my-new-template`, `/preview/my-new-template`, and `/showcase/my-new-template`.

> **Licensing model:** there is no free version. Every template ships as a **7-Day Free Trial** (fully functional, footer attribution required) and a **Premium version** that requires a license key. Trial XML must include the anti-tamper redirect described in [TEMPLATE_DEVELOPER_GUIDE.md](TEMPLATE_DEVELOPER_GUIDE.md).

---

## 2. Adding multiple concept demos

Give a template several demos by extending its `demos` array:

```typescript
demos: [
  {
    id: 'spotlight-tech',
    title: 'Tech & Gadgets Demo',
    slug: 'spotlight-tech',
    description: 'High-contrast theme for tech reviews.',
    thumbnail: '/images/techpulse-thumb.svg',
    demoUrl: 'https://spotlight-tech.blogspot.com',
    category: 'Tech',
    badge: 'POPULAR'
  }
]
```

Buyers reach these at `/showcase/<template-slug>`, where the demo filter pills are generated automatically from the distinct `category` values in the array. A template with more than one demo also gets a "N Demos" button on its catalog card.

---

## 3. Editing documentation articles

Articles live in `src/data/docs.ts` in the `DOCS_ARTICLES` array. Each has numbered steps:

```typescript
{
  id: 'article-1',
  slug: 'installation',          // route: /docs/installation
  title: 'How to Install the Template',
  category: 'Installation',      // 'Installation' | 'Activation' | 'Customization' | 'Troubleshooting' | 'Licensing'
  excerpt: 'One-line summary shown under the title.',
  readingTime: '4 min read',
  updatedAt: 'October 2026',
  steps: [
    {
      stepNumber: 1,
      title: 'Download the XML file',
      content: 'Explain the step in plain language.',
      codeSnippet: 'Optional code block with a copy button',
      tip: 'Optional highlighted advice',
      warning: 'Optional caution'
    }
  ]
}
```

Adding an article with a new `slug` makes it reachable at `/docs/<slug>` and appears in the left sidebar. The previous-guide link at the bottom of each page follows the array order, so keep articles in the sequence you want readers to move through.

The navbar, footer, and `public/sitemap.xml` each hardcode links to the five standard guides. If you rename a `slug`, update those three places too.

---

## 4. Branding and store settings

`src/data/siteConfig.ts` drives everything global:

| Key | Used by |
| :--- | :--- |
| `siteName` | Footer copyright, license notice header |
| `siteTitle` | Default `document.title`, meta description baseline |
| `supportEmail` | Footer `@support` link, contact page SLA card |
| `workingHours` | Contact page SLA card **and** footer support column |
| `contactAddress` | Available for your own footer or legal pages |
| `socials` | Available for a social row — not currently rendered |
| `currencySymbol` | Available for multi-currency pricing — not currently rendered |

> Two deliberate notes: `currencySymbol` and `socials` are defined but unused. Prices are hardcoded as `$` in the components, and there is no social row in the footer. If you change the currency, grep for `$${` in `src/components/` and `src/pages/` and update those call sites, otherwise the configured symbol is silently ignored. The footer support hours now read from `workingHours`, so changing that key updates both places at once.

To change logos, replace `public/logo.svg` and `public/favicon.svg`. To change the store name, update `siteName`, `siteTitle`, `index.html` meta tags, and the JSON-LD block — `index.html` is not generated from config.

---

## 5. Regenerating template mockups

`public/images/*.svg` are generated by `generate-assets.js`:

```bash
npm run assets
```

Edit the `templates` array at the bottom of that file to change titles, tags, or color palettes. Manual edits to the generated SVGs will be overwritten on the next run.

---

## 6. Deploying

### Method A: Git integration (recommended)

```bash
git add .
git commit -m "Update catalog"
git push origin main
```

Then in [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > your project > **Settings** > **Builds & deployments**:

- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: `20` or newer

### Method B: Wrangler CLI

```bash
npm run build
npx wrangler pages deploy dist --project-name=templatemeva
```

### Pre-launch checklist

- [ ] Replace placeholder archives in `public/download/` with real trial XMLs
- [ ] Replace placeholder `buyUrl` values with live checkout links
- [ ] Update `siteUrl` in `src/data/siteConfig.ts` plus the canonical, OpenGraph, and JSON-LD URLs in `index.html` if the domain differs from `templatemeva.com`
- [ ] Update `robots.txt` and `sitemap.xml` for the final domain
- [ ] Connect the contact form and newsletter to a real endpoint (both currently show success without sending anything)
- [ ] Connect the license-key validator on `/unlicensed` to your licensing backend
- [ ] Verify each `liveDemoUrl` allows being framed, or confirm the fallback overlay appears