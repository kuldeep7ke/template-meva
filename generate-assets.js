import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public', 'images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function makeTemplateSvg({ title, tag, color1, color2, accent }) {
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
  const label = esc(tag);
  const slug = esc(title.toLowerCase().replace(/\s+/g, '-'));

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
    <!-- Background Frame -->
    <rect width="800" height="500" rx="16" fill="url(#bgGrad)"/>
    
    <!-- Browser Mockup Window -->
    <g transform="translate(40, 35)" filter="url(#shadow)">
      <!-- Browser Top Bar -->
      <rect width="720" height="430" rx="12" fill="#ffffff"/>
      <path d="M0 12C0 5.37258 5.37258 0 12 0H708C714.627 0 720 5.37258 720 12V36H0V12Z" fill="#0F172A"/>
      <!-- Window Controls -->
      <circle cx="20" cy="18" r="5" fill="#EF4444"/>
      <circle cx="36" cy="18" r="5" fill="#F59E0B"/>
      <circle cx="52" cy="18" r="5" fill="#10B981"/>
      <rect x="180" y="10" width="360" height="16" rx="8" fill="#1E293B"/>
      <text x="360" y="22" font-family="system-ui, sans-serif" font-size="10" fill="#94A3B8" text-anchor="middle">templatemeva-demo.blogspot.com/${slug}</text>

      <!-- Mockup Website Header -->
      <rect x="0" y="36" width="720" height="48" fill="#FFFFFF" border-bottom="1px solid #E2E8F0"/>
      <line x1="0" y1="84" x2="720" y2="84" stroke="#E2E8F0" stroke-width="1"/>
      <rect x="30" y="50" width="100" height="20" rx="4" fill="${accent}"/>
      <text x="80" y="64" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">${brand}</text>
      
      <!-- Nav items mock -->
      <rect x="160" y="56" width="45" height="8" rx="4" fill="#64748B"/>
      <rect x="220" y="56" width="55" height="8" rx="4" fill="#94A3B8"/>
      <rect x="290" y="56" width="50" height="8" rx="4" fill="#94A3B8"/>
      <rect x="355" y="56" width="60" height="8" rx="4" fill="#94A3B8"/>

      <rect x="630" y="48" width="60" height="24" rx="12" fill="#F1F5F9"/>
      <circle cx="670" cy="60" r="6" fill="${accent}"/>

      <!-- Mockup Hero / Featured Area -->
      <rect x="30" y="100" width="420" height="180" rx="8" fill="#EEF2F6"/>
      <rect x="50" y="120" width="70" height="16" rx="4" fill="${accent}"/>
      <text x="85" y="132" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">TRENDING</text>
      <text x="50" y="165" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#0F172A">Next-Gen Blogger Experience</text>
      <text x="50" y="190" font-family="system-ui, sans-serif" font-size="12" fill="#64748B">Optimized for Core Web Vitals, AdSense, and Instant Speed</text>
      <rect x="50" y="225" width="90" height="26" rx="6" fill="${accent}"/>
      <text x="95" y="242" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">READ ARTICLE</text>

      <!-- Sidebar widgets -->
      <rect x="470" y="100" width="220" height="85" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="485" y="115" width="90" height="10" rx="3" fill="#0F172A"/>
      <rect x="485" y="135" width="180" height="6" rx="2" fill="#CBD5E1"/>
      <rect x="485" y="150" width="140" height="6" rx="2" fill="#CBD5E1"/>

      <rect x="470" y="195" width="220" height="85" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
      <rect x="485" y="210" width="110" height="10" rx="3" fill="${accent}"/>
      <rect x="485" y="230" width="170" height="6" rx="2" fill="#CBD5E1"/>
      <rect x="485" y="245" width="120" height="6" rx="2" fill="#CBD5E1"/>

      <!-- 3 Grid Cards below -->
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

    <!-- Overlay Badges -->
    <g transform="translate(60, 430)">
      <rect width="130" height="28" rx="14" fill="#0F172A" fill-opacity="0.9"/>
      <circle cx="16" cy="14" r="5" fill="#22C55E"/>
      <text x="75" y="18" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">PageSpeed 99</text>
    </g>

    <g transform="translate(200, 430)">
      <rect width="110" height="28" rx="14" fill="${accent}" fill-opacity="0.95"/>
      <text x="55" y="18" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">${label}</text>
    </g>

    <g transform="translate(600, 430)">
      <rect width="140" height="28" rx="14" fill="#1E293B" fill-opacity="0.9"/>
      <text x="70" y="18" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#FBBF24" text-anchor="middle">★ ★ ★ ★ ★ (5.0)</text>
    </g>
  </svg>`;
}

const templates = [
  { name: 'spotlight-thumb.svg', title: 'Spotlight', tag: 'News & Magazine', color1: '#1E1B4B', color2: '#312E81', accent: '#4F46E5', layoutType: 'Magazine' },
  { name: 'spotlight-hero.svg', title: 'Spotlight Pro', tag: 'Mega Magazine', color1: '#0F172A', color2: '#1E293B', accent: '#6366F1', layoutType: 'Magazine' },
  { name: 'smartmag-thumb.svg', title: 'SmartMag', tag: 'Multi-Concept Mag', color1: '#022C22', color2: '#064E3B', accent: '#059669', layoutType: 'Magazine' },
  { name: 'techpulse-thumb.svg', title: 'TechPulse', tag: 'Tech & Gadgets', color1: '#082F49', color2: '#0C4A6E', accent: '#0284C7', layoutType: 'Tech' },
  { name: 'foodiebite-thumb.svg', title: 'FoodieBite', tag: 'Food & Recipe', color1: '#451A03', color2: '#78350F', accent: '#D97706', layoutType: 'Clean / Minimal' },
  { name: 'minimalgrid-thumb.svg', title: 'MinimalGrid', tag: 'Minimal Portfolio', color1: '#18181B', color2: '#27272A', accent: '#71717A', layoutType: 'Grid / Masonry' },
  { name: 'chrononews-thumb.svg', title: 'ChronoNews', tag: 'Editorial & News', color1: '#4C0519', color2: '#881337', accent: '#E11D48', layoutType: 'Magazine' },
  { name: 'novastore-thumb.svg', title: 'NovaStore', tag: 'Blogger E-Commerce', color1: '#2E1065', color2: '#581C87', accent: '#9333EA', layoutType: 'E-Commerce' },
  { name: 'lumenlife-thumb.svg', title: 'LumenLife', tag: 'Personal Journal', color1: '#1C1917', color2: '#44403C', accent: '#A8A29E', layoutType: 'Clean / Minimal' },
  { name: 'traveltrove-thumb.svg', title: 'TravelTrove', tag: 'Travel & Adventure', color1: '#0C4A6E', color2: '#155E75', accent: '#06B6D4', layoutType: 'Magazine' },
];

for (const t of templates) {
  const svg = makeTemplateSvg(t);
  // Explicit utf8: the rating row uses ★ glyphs, which corrupt under a
  // platform-default (latin1) write.
  fs.writeFileSync(path.join(outDir, t.name), svg, 'utf8');
  console.log('Created: ' + t.name);
}
