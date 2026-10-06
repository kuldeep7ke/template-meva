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
// PORTRAIT, 3:4, on purpose.
//
// These used to be 800x500 landscape to match a card that was `aspect-16/10`. The
// card was then redesigned to `aspect-[3/4]` and the generator was not told, so
// `object-cover` cropped every mockup down to an unreadable horizontal sliver --
// "Next-Gen Blogger Experience" rendered as "...gger Experience". A green build, a
// green registry gate, and a broken shop.
//
// The asset matches the surface that displays it. If the card's aspect changes
// again, change it here in the same commit, or the gate in tests/check-registry.cjs
// should be extended to compare the two.
const W = 800;
const H = 1066;

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
    ? `<g transform="translate(56, 966)">
    <rect width="150" height="34" rx="17" fill="#0F172A" fill-opacity="0.92"/>
    <circle cx="18" cy="17" r="6" fill="#22C55E"/>
    <text x="88" y="22" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">PageSpeed ${esc(pageSpeed)}</text>
  </g>`
    : '';

  const tagChip = label
    ? `<g transform="translate(220, 966)">
    <rect width="${Math.max(110, label.length * 7 + 28)}" height="34" rx="17" fill="${accent}" fill-opacity="0.95"/>
    <text x="${(Math.max(110, label.length * 7 + 28)) / 2}" y="22" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">${label}</text>
  </g>`
    : '';

  const starsChip = rating && reviewCount
    ? `<g transform="translate(600, 966)">
    <rect width="144" height="34" rx="17" fill="#1E293B" fill-opacity="0.92"/>
    <text x="72" y="22" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">${'★'.repeat(Math.round(Number(rating)))}${'☆'.repeat(5 - Math.round(Number(rating)))}</text>
  </g>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
        <stop stop-color="${color1}"/>
        <stop offset="1" stop-color="${color2}"/>
      </linearGradient>
      <filter id="shadow" x="-10" y="-5" width="840" height="1086" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.15"/>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" rx="16" fill="url(#bgGrad)"/>

    <g transform="translate(40, 35)" filter="url(#shadow)">
      <rect width="720" height="996" rx="12" fill="#ffffff"/>

      <!-- Browser top bar -->
      <path d="M0 12C0 5.37258 5.37258 0 12 0H708C714.627 0 720 5.37258 720 12V40H0V12Z" fill="#0F172A"/>
      <circle cx="20" cy="20" r="5" fill="#EF4444"/>
      <circle cx="36" cy="20" r="5" fill="#F59E0B"/>
      <circle cx="52" cy="20" r="5" fill="#10B981"/>
      <rect x="180" y="12" width="360" height="16" rx="8" fill="#1E293B"/>
      <text x="360" y="24" font-family="system-ui, sans-serif" font-size="10" fill="#94A3B8" text-anchor="middle">templatemeva.com/templates/${slugText}</text>

      <!-- Site header -->
      <rect x="0" y="40" width="720" height="56" fill="#FFFFFF"/>
      <line x1="0" y1="96" x2="720" y2="96" stroke="#E2E8F0"/>
      <rect x="24" y="58" width="112" height="22" rx="4" fill="${accent}"/>
      <text x="80" y="73" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">${brand}</text>
      <rect x="160" y="64" width="46" height="9" rx="4.5" fill="#64748B"/>
      <rect x="216" y="64" width="56" height="9" rx="4.5" fill="#94A3B8"/>
      <rect x="282" y="64" width="50" height="9" rx="4.5" fill="#94A3B8"/>
      <rect x="342" y="64" width="62" height="9" rx="4.5" fill="#94A3B8"/>
      <circle cx="678" cy="68" r="9" fill="#F1F5F9"/>
      <circle cx="678" cy="68" r="4" fill="${accent}"/>

      <!-- Hero -->
      <rect x="24" y="116" width="672" height="270" rx="10" fill="#EEF2F6"/>
      <rect x="44" y="140" width="78" height="20" rx="4" fill="${accent}"/>
      <text x="83" y="154" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">TRENDING</text>
      <text x="44" y="200" font-family="system-ui, sans-serif" font-size="26" font-weight="800" fill="#0F172A">Next-Gen Blogger</text>
      <text x="44" y="232" font-family="system-ui, sans-serif" font-size="26" font-weight="800" fill="#0F172A">Experience</text>
      <text x="44" y="262" font-family="system-ui, sans-serif" font-size="13" fill="#64748B">Optimized for Core Web Vitals, AdSense, and Instant Speed</text>
      <rect x="44" y="296" width="120" height="34" rx="6" fill="${accent}"/>
      <text x="104" y="318" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">READ ARTICLE</text>

      <!-- Two stacked sidebar-style widgets -->
      <rect x="24" y="406" width="672" height="94" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="44" y="428" width="120" height="12" rx="3" fill="#0F172A"/>
      <rect x="44" y="452" width="600" height="8" rx="2" fill="#CBD5E1"/>
      <rect x="44" y="472" width="440" height="8" rx="2" fill="#CBD5E1"/>

      <rect x="24" y="516" width="672" height="94" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="44" y="538" width="150" height="12" rx="3" fill="${accent}"/>
      <rect x="44" y="562" width="560" height="8" rx="2" fill="#CBD5E1"/>
      <rect x="44" y="582" width="380" height="8" rx="2" fill="#CBD5E1"/>

      <!-- Two rows of two cards -->
      <rect x="24" y="630" width="328" height="150" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="44" y="650" width="288" height="56" rx="4" fill="#E2E8F0"/>
      <rect x="44" y="722" width="180" height="9" rx="2" fill="#0F172A"/>
      <rect x="44" y="744" width="120" height="7" rx="2" fill="#94A3B8"/>

      <rect x="368" y="630" width="328" height="150" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="388" y="650" width="288" height="56" rx="4" fill="#E2E8F0"/>
      <rect x="388" y="722" width="200" height="9" rx="2" fill="#0F172A"/>
      <rect x="388" y="744" width="140" height="7" rx="2" fill="#94A3B8"/>

      <rect x="24" y="796" width="328" height="150" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="44" y="816" width="288" height="56" rx="4" fill="#E2E8F0"/>
      <rect x="44" y="888" width="160" height="9" rx="2" fill="#0F172A"/>
      <rect x="44" y="910" width="110" height="7" rx="2" fill="#94A3B8"/>

      <rect x="368" y="796" width="328" height="150" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="388" y="816" width="288" height="56" rx="4" fill="#E2E8F0"/>
      <rect x="388" y="888" width="190" height="9" rx="2" fill="#0F172A"/>
      <rect x="388" y="910" width="130" height="7" rx="2" fill="#94A3B8"/>
    </g>

    ${speedChip}
    ${tagChip}
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
