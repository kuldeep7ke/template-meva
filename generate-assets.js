import fs from 'fs';
import path from 'path';

// Generates one browser-mockup SVG per catalog product into public/images/.
//
// WHY THIS READS THE REGISTRY
// ---------------------------
// It used to hold a hardcoded array of ten hand-picked palettes. That is fine at
// ten and unmaintainable at a hundred: every new template would need a hand-written
// entry here AND a hand-written entry in src/data/templates.ts AND a hand-written
// entry in public/sitemap.xml, which is three places that can disagree and no gate
// that notices.
//
// So the palette is derived from the slug, deterministically. The same slug always
// gets the same colours, so regenerating never churns an image a buyer has already
// cached, and adding template #101 needs no edit to this file at all.
//
// A product can still override the palette explicitly -- see `palette` in
// docs/products.json -- which is what you want for a flagship whose brand colours
// matter.
//
// WHY THE BADGES ARE CONDITIONAL
// ------------------------------
// Every mockup used to draw a "PageSpeed 99" chip and a "5.0 stars" chip, both
// hardcoded. On a real product that is a false claim rendered into a purchasable
// image: a template measured at 78 with no reviews would still ship a 99 and a
// five-star badge. A badge is now drawn only when the registry actually carries the
// number. Absence is honest; a default is not.

const ROOT = path.resolve('.');
const outDir = path.join(ROOT, 'public', 'images');
const registryPath = path.join(ROOT, 'docs', 'products.json');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// --- palette ------------------------------------------------------------------
// Deterministic from the slug. Same slug -> same palette, forever.
function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function derivePalette(slug) {
  const h = hashString(slug);
  // Pull three well-separated hues off the hash so two adjacent slugs do not land
  // on visually identical gradients.
  const h1 = h % 360;
  const h2 = (h1 + 18 + ((h >> 8) % 40)) % 360;
  const accent = (h1 + 200 + ((h >> 16) % 30)) % 360;
  const dark = (l, s) => `hsl(${h1} ${s}% ${l}%)`;
  const dark2 = (l, s) => `hsl(${h2} ${s}% ${l}%)`;
  return {
    color1: dark(22, 45),
    color2: dark2(34, 50),
    accent: `hsl(${accent} 72% 58%)`,
  };
}

// --- mockup --------------------------------------------------------------------
function makeTemplateSvg({ title, tag, slug, color1, color2, accent, pageSpeed, rating, reviewCount }) {
  // Text injected into <text> nodes must be XML-escaped. An unescaped `&`
  // (e.g. "Tech & Gadgets") makes the whole document malformed, and browsers
  // then render a broken image instead of the mockup.
  const esc = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const brand = esc(title.toUpperCase());
  const label = esc(tag || '');
  const slugText = esc(slug);

  // A badge is drawn only when the number is real. See the header comment.
  const speedChip = pageSpeed
    ? `<g transform="translate(60, 430)">
    <rect width="130" height="28" rx="14" fill="#0F172A" fill-opacity="0.9"/>
    <circle cx="16" cy="14" r="5" fill="#22C55E"/>
    <text x="75" y="18" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">PageSpeed ${esc(pageSpeed)}</text>
  </g>`
    : '';

  const starsChip = rating && reviewCount
    ? `<g transform="translate(600, 430)">
    <rect width="140" height="28" rx="14" fill="#1E293B" fill-opacity="0.9"/>
    <text x="70" y="18" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">${'★'.repeat(Math.round(Number(rating)))}${'☆'.repeat(5 - Math.round(Number(rating)))} (${esc(rating)})</text>
  </g>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500" fill="none">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="800" y2="500" gradientUnits="userSpaceOnUse">
        <stop stop-color="${color1}"/>
        <stop offset="1" stop-color="${color2}"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#ffffff"/>
        <stop offset="1" stop-color="#f8fafc"/>
      </linearGradient>
      <filter id="shadow" x="-10" y="-5" width="820" height="520" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.15"/>
      </filter>
    </defs>
    <rect width="800" height="500" rx="16" fill="url(#bgGrad)"/>

    <g transform="translate(40, 35)" filter="url(#shadow)">
      <rect width="720" height="430" rx="12" fill="#ffffff"/>
      <path d="M0 12C0 5.37258 5.37258 0 12 0H708C714.627 0 720 5.37258 720 12V36H0V12Z" fill="#0F172A"/>
      <circle cx="20" cy="18" r="5" fill="#EF4444"/>
      <circle cx="36" cy="18" r="5" fill="#F59E0B"/>
      <circle cx="52" cy="18" r="5" fill="#10B981"/>
      <rect x="180" y="10" width="360" height="16" rx="8" fill="#1E293B"/>
      <text x="360" y="22" font-family="system-ui, sans-serif" font-size="10" fill="#94A3B8" text-anchor="middle">templatemeva.com/templates/${slugText}</text>

      <rect x="0" y="36" width="720" height="48" fill="#FFFFFF" stroke="#E2E8F0"/>
      <line x1="0" y1="84" x2="720" y2="84" stroke="#E2E8F0"/>
      <rect x="30" y="50" width="100" height="20" rx="4" fill="${accent}"/>
      <text x="80" y="64" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">${brand}</text>

      <rect x="160" y="56" width="45" height="8" rx="4" fill="#64748B"/>
      <rect x="220" y="56" width="55" height="8" rx="4" fill="#94A3B8"/>
      <rect x="290" y="56" width="50" height="8" rx="4" fill="#94A3B8"/>
      <rect x="355" y="56" width="60" height="8" rx="4" fill="#94A3B8"/>

      <rect x="630" y="48" width="60" height="24" rx="12" fill="#F1F5F9"/>
      <circle cx="670" cy="60" r="6" fill="${accent}"/>

      <rect x="30" y="100" width="420" height="180" rx="8" fill="#EEF2F6"/>
      <rect x="50" y="120" width="70" height="16" rx="4" fill="${accent}"/>
      <text x="85" y="132" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">TRENDING</text>
      <text x="50" y="165" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#0F172A">Next-Gen Blogger Experience</text>
      <text x="50" y="190" font-family="system-ui, sans-serif" font-size="12" fill="#64748B">Optimized for Core Web Vitals, AdSense, and Instant Speed</text>
      <rect x="50" y="225" width="90" height="26" rx="6" fill="${accent}"/>
      <text x="95" y="242" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">READ ARTICLE</text>

      <rect x="470" y="100" width="220" height="85" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="485" y="115" width="90" height="10" rx="3" fill="#0F172A"/>
      <rect x="485" y="135" width="180" height="6" rx="2" fill="#CBD5E1"/>
      <rect x="485" y="150" width="140" height="6" rx="2" fill="#CBD5E1"/>

      <rect x="470" y="195" width="220" height="85" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="485" y="210" width="110" height="10" rx="3" fill="${accent}"/>
      <rect x="485" y="230" width="170" height="6" rx="2" fill="#CBD5E1"/>
      <rect x="485" y="245" width="120" height="6" rx="2" fill="#CBD5E1"/>

      <rect x="30" y="300" width="210" height="110" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="45" y="315" width="180" height="40" rx="4" fill="#E2E8F0"/>
      <rect x="45" y="365" width="140" height="8" rx="2" fill="#0F172A"/>
      <rect x="45" y="380" width="90" height="6" rx="2" fill="#94A3B8"/>

      <rect x="255" y="300" width="210" height="110" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="270" y="315" width="180" height="40" rx="4" fill="#E2E8F0"/>
      <rect x="270" y="365" width="150" height="8" rx="2" fill="#0F172A"/>
      <rect x="270" y="380" width="100" height="6" rx="2" fill="#94A3B8"/>

      <rect x="480" y="300" width="210" height="110" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="495" y="315" width="180" height="40" rx="4" fill="#E2E8F0"/>
      <rect x="495" y="365" width="130" height="8" rx="2" fill="#0F172A"/>
      <rect x="495" y="380" width="85" height="6" rx="2" fill="#94A3B8"/>
    </g>

    ${speedChip}
    ${label ? `<g transform="translate(200, 430)">
    <rect width="110" height="28" rx="14" fill="${accent}" fill-opacity="0.95"/>
    <text x="55" y="18" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">${label}</text>
  </g>` : ''}
    ${starsChip}
  </svg>`;
}

// --- load ----------------------------------------------------------------------
if (!fs.existsSync(registryPath)) {
  console.error('generate-assets: docs/products.json is missing. Run: npm run registry:sync');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

// Fixtures and registered products both get a mockup. Only registered products are
// ever published, but generating for both keeps `npm run dev` populated.
const entries = [
  ...(db.fixtures || []).map((f) => ({
    slug: f.slug,
    title: f.productName,
    tag: f.tag,
    palette: f.palette,
    pageSpeed: f.pageSpeed,
    rating: f.rating,
    reviewCount: f.reviewCount,
    invented: true,
  })),
  ...(db.products || []).map((p) => ({
    slug: p.slug,
    title: p.productName,
    tag: p.category,
    palette: p.palette,
    pageSpeed: p.pageSpeed,
    rating: p.rating,
    reviewCount: p.reviewCount,
    invented: false,
  })),
];

if (entries.length === 0) {
  console.log('generate-assets: registry is empty -- nothing to generate.');
  process.exit(0);
}

let made = 0;
let skippedBadges = 0;
for (const e of entries) {
  const derived = derivePalette(e.slug);
  const pal = e.palette || {};
  const common = {
    title: e.title,
    tag: e.tag || '',
    slug: e.slug,
    color1: pal.color1 || derived.color1,
    color2: pal.color2 || derived.color2,
    accent: pal.accent || derived.accent,
    pageSpeed: e.pageSpeed || null,
    rating: e.rating || null,
    reviewCount: e.reviewCount || null,
  };

  // Two variants per product:
  //
  //   -thumb.svg  the catalog card. Carries the PageSpeed and rating chips,
  //               because that is where a buyer compares products.
  //   -hero.svg   the share card. NO chips: it is used as og:image and
  //               twitter:image, and a PageSpeed number baked into a social
  //               preview outlives any correction to the page it came from.
  //
  // Both are emitted for every product, deterministically, so index.html and any
  // catalog entry can point at a path that exists rather than one that used to.
  const variants = [
    { file: `${e.slug}-thumb.svg`, svg: makeTemplateSvg(common), isHero: false },
    { file: `${e.slug}-hero.svg`, svg: makeTemplateSvg({ ...common, pageSpeed: null, rating: null, reviewCount: null }), isHero: true },
  ];

  for (const v of variants) {
    // Explicit utf8: the stars row uses glyphs, which corrupt under a
    // platform-default (latin1) write.
    fs.writeFileSync(path.join(outDir, v.file), v.svg, 'utf8');
    made++;
  }

  if (!e.pageSpeed || !e.rating || !e.reviewCount) skippedBadges++;
  console.log(
    `  ${e.slug}-thumb.svg + ${e.slug}-hero.svg${e.invented ? '  (fixture)' : `  (${e.status || 'draft'})`}` +
      (e.pageSpeed ? '' : '   no PageSpeed badge - not measured')
  );
}
console.log(`\ngenerate-assets: ${made} file(s) written to public/images/`);
if (skippedBadges > 0) {
  console.log(`  ${skippedBadges} product(s) show no PageSpeed or rating badge because the registry carries no measured value. That is deliberate -- see the header comment.`);
}
