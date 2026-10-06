#!/usr/bin/env node
// Registry / catalog parity gate.
//
// WHY THIS EXISTS
// ---------------
// This store shipped nine products that do not exist. Every one of them rendered
// a price, a rating, a `buyUrl` and a sitemap entry, and nothing in the data said
// "this is invented". That is the failure this gate closes: a catalog entry must
// be traceable to a real Machine project, and anything that cannot be traced must
// be provably unreachable to a buyer.
//
// The checks, and what each one stops:
//
//   1. products.json parses and its ProjectIDs are unique and well-formed
//      -- stops two projects claiming one ID.
//   2. every registered product appears in docs/REGISTRY.md
//      -- stops the human-readable registry silently going stale.
//   3. every `placeholder` catalog slug is declared as a fixture
//      -- stops a new invented product being added without being labelled.
//   4. every catalog row carrying a `projectId` is registered in products.json
//      -- stops a draft being invented outside the registry.
//   5. `published` requires `resale: 'allowed'`
//      -- stops a finished-but-not-for-resale project being sold. This is not
//         theoretical: BLG-GEL-001 is exactly that case.
//   6. a published catalog row contains no `TODO(operator)`
//      -- stops a draft being published with generator-written placeholders.
//   7. public/sitemap.xml lists no slug that is not `published`
//      -- stops an unpublished product staying in the index after being withdrawn.
//   8. the credential invariant holds in src/
//      -- see below.
//
//   8 exists because the Machine states as a strict invariant that a buyer's email
//   and serial must never reach the served page, the XML, or an `action=validate`
//   URL. Nothing in this repository enforced it, so it is enforced here.
//
// Exits 0 when clean, 1 on any FAIL, 2 on a usage error.

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS = path.join(ROOT, 'docs', 'products.json');
const CATALOG = path.join(ROOT, 'src', 'data', 'templates.ts');
const REGISTRY_MD = path.join(ROOT, 'docs', 'REGISTRY.md');
const SITEMAP = path.join(ROOT, 'public', 'sitemap.xml');
const INDEX_HTML = path.join(ROOT, 'index.html');
const SRC = path.join(ROOT, 'src');

const VALID_PRODUCT_STATUS = new Set(['draft', 'published', 'withdrawn']);
const VALID_RESALE = new Set(['allowed', 'not-for-resale', 'undecided']);
const PROJECT_ID_RE = /^[A-Z0-9]{2,6}-[A-Z0-9]{2,6}-\d{3}$/;

const failures = [];
const notes = [];
function fail(msg) { failures.push(msg); }
function note(msg) { notes.push(msg); }

// --- load ---------------------------------------------------------------------
if (!fs.existsSync(PRODUCTS)) {
  console.error('check-registry: docs/products.json is missing.');
  process.exit(2);
}
let db;
try {
  db = JSON.parse(fs.readFileSync(PRODUCTS, 'utf8'));
} catch (e) {
  console.error(`check-registry: docs/products.json is not valid JSON: ${e.message}`);
  process.exit(2);
}

// --- 1. products.json shape ----------------------------------------------------
const products = Array.isArray(db.products) ? db.products : [];
const fixtures = Array.isArray(db.fixtures) ? db.fixtures : [];

const seen = new Map();
for (const p of products) {
  if (!PROJECT_ID_RE.test(p.projectId || '')) {
    fail(`products.json: projectId "${p.projectId}" is not <PLATFORM>-<BASETHEME>-<NNN>`);
    continue;
  }
  if (seen.has(p.projectId)) {
    fail(`products.json: projectId ${p.projectId} appears ${seen.get(p.projectId) + 1} times -- IDs are never reused`);
  } else {
    seen.set(p.projectId, 0);
  }
  if (!VALID_PRODUCT_STATUS.has(p.status)) {
    fail(`products.json: ${p.projectId} has status "${p.status}"; expected one of ${[...VALID_PRODUCT_STATUS].join(', ')}`);
  }
  if (!VALID_RESALE.has(p.resale)) {
    fail(`products.json: ${p.projectId} has resale "${p.resale}"; expected one of ${[...VALID_RESALE].join(', ')}`);
  }
}
if (!products.length) note('no products registered yet');
if (!fixtures.length) note('no fixtures declared');

// --- 2. REGISTRY.md carries every product --------------------------------------
if (!fs.existsSync(REGISTRY_MD)) {
  fail('docs/REGISTRY.md is missing. Run: npm run registry:sync');
} else {
  const md = fs.readFileSync(REGISTRY_MD, 'utf8');
  for (const p of products) {
    if (!md.includes(p.projectId)) {
      fail(`docs/REGISTRY.md does not mention ${p.projectId}. Run: npm run registry:sync`);
    }
  }
}

// --- catalog scan ---------------------------------------------------------------
const catalogSrc = fs.readFileSync(CATALOG, 'utf8');
const rows = [];
const rowRe = /slug:\s*'([^']+)',[\s\r\n]*status:\s*'([^']+)'/g;
let m;
while ((m = rowRe.exec(catalogSrc)) !== null) {
  // projectId is optional; grab the tail of the same entry.
  const tail = catalogSrc.slice(m.index, m.index + 400);
  const pid = /projectId:\s*'([^']+)'/.exec(tail);
  rows.push({ slug: m[1], status: m[2], projectId: pid ? pid[1] : null, index: m.index });
}

const catalogSlugs = new Set();
for (const r of rows) {
  if (catalogSlugs.has(r.slug)) fail(`catalog: duplicate slug "${r.slug}" in src/data/templates.ts`);
  catalogSlugs.add(r.slug);

  const statusInDb = !VALID_PRODUCT_STATUS.has(r.status);
  if (r.status === 'placeholder') continue; // fixtures are checked by rule 3
  if (!VALID_PRODUCT_STATUS.has(r.status)) {
    fail(`catalog: ${r.slug} has status "${r.status}", which is neither placeholder nor a product status`);
    void statusInDb;
  }
  if (!r.projectId) {
    fail(`catalog: ${r.slug} is neither a declared fixture nor a registered product (no projectId). Add it to docs/products.json, or mark it status: 'placeholder'`);
  }
}

// --- 3. every placeholder is declared a fixture --------------------------------
const fixtureSlugs = new Set(fixtures.map((f) => f.slug));
for (const r of rows) {
  if (r.status === 'placeholder' && !fixtureSlugs.has(r.slug)) {
    fail(`catalog: ${r.slug} is status 'placeholder' but is not declared in docs/products.json fixtures`);
  }
}
for (const f of fixtures) {
  if (!catalogSlugs.has(f.slug)) {
    fail(`docs/products.json declares fixture "${f.slug}" but the catalog has no such slug`);
  }
}

// --- 4. every projectId in the catalog is registered -----------------------------
for (const r of rows) {
  if (r.projectId && !seen.has(r.projectId)) {
    fail(`catalog: ${r.slug} claims projectId ${r.projectId}, which is not in docs/products.json`);
  }
}

// --- 5 + 6. publication preconditions -------------------------------------------
for (const p of products) {
  if (p.status !== 'published') continue;
  if (p.resale !== 'allowed') {
    fail(`${p.projectId} is published but resale is "${p.resale}". Publishing requires resale: "allowed" -- a finished template is not automatically a sellable one.`);
  }
  const row = rows.find((r) => r.projectId === p.projectId);
  if (!row) {
    fail(`${p.projectId} is published but has no catalog row in src/data/templates.ts`);
  } else if (row.status !== 'published') {
    fail(`${p.projectId} is published in products.json but its catalog row is "${row.status}"`);
  }
}

for (const r of rows) {
  if (r.status !== 'published') continue;
  const tail = catalogSrc.slice(r.index, r.index + 1200);
  if (tail.includes('TODO(operator)')) {
    fail(`catalog: published entry ${r.slug} still contains TODO(operator) markers -- fill them in or set status back to 'draft'`);
  }
  if (/price:\s*0\b/.test(tail) || /buyUrl:\s*''/.test(tail)) {
    fail(`catalog: published entry ${r.slug} has no price or no buyUrl -- the storefront would render a dead link`);
  }
}

// --- 7. sitemap agrees with the catalog in BOTH directions ----------------------
if (fs.existsSync(SITEMAP)) {
  const sitemap = fs.readFileSync(SITEMAP, 'utf8');
  const inSitemap = new Set();
  for (const m2 of sitemap.matchAll(/\/templates\/([a-z0-9-]+)/g)) {
    const slug = m2[1];
    inSitemap.add(slug);
    const row = rows.find((r) => r.slug === slug);
    if (!row) {
      fail(`public/sitemap.xml lists /templates/${slug}, which is not in the catalog at all`);
    } else if (row.status !== 'published') {
      fail(`public/sitemap.xml lists /templates/${slug}, but its status is "${row.status}". Only published products belong in the sitemap.`);
    }
  }
  // The other direction: a product that IS live but missing from the sitemap is
  // just as wrong as an unlisted one that is, because it silently disappears from
  // search without anybody deciding to remove it.
  for (const r of rows) {
    if (r.status === 'published' && !inSitemap.has(r.slug)) {
      fail(`catalog: ${r.slug} is published but has no URL in public/sitemap.xml -- add /templates/${r.slug} there`);
    }
  }
}

// --- 8. every referenced image exists -----------------------------------------
// Not hypothetical: `generate-assets.js` was rewritten to read the registry and
// stopped emitting `spotlight-hero.svg`, which `index.html` names as its
// `og:image` and `twitter:image`. Nothing caught it, so every social share of the
// store would have rendered with no preview image, and `npm run build` stayed
// green. Asset paths are data, and data that points at nothing is a broken page.
const imgRefs = new Set();
for (const m of catalogSrc.matchAll(/'(\/images\/[^']+)'/g)) imgRefs.add(m[1]);
if (fs.existsSync(INDEX_HTML)) {
  for (const m of fs.readFileSync(INDEX_HTML, 'utf8').matchAll(/(\/images\/[A-Za-z0-9._-]+\.svg)/g)) {
    imgRefs.add(m[1]);
  }
}
for (const ref of imgRefs) {
  const target = path.join(ROOT, 'public', ref.replace(/^\//, ''));
  if (!fs.existsSync(target)) {
    fail(`image ${ref} is referenced but public/${ref.replace(/^\//, '')} does not exist -- run: npm run assets`);
  }
}
if (imgRefs.size === 0) note('no image references found to check');

// --- 9. credential invariant ----------------------------------------------------
// A buyer's email and serial must never reach the served page, the template XML,
// or the URL of a validation request. If any of these strings appears in src/,
// the guarantee the licensing model is sold on has been broken.
const FORBIDDEN = [
  { re: /BUYER_EMAIL_HERE/i, why: 'a buyer-email placeholder' },
  { re: /BUYER_SERIAL_HERE/i, why: 'a buyer-serial placeholder' },
  { re: /data-email\s*=/i, why: 'a data-email attribute' },
  { re: /data-serial\s*=/i, why: 'a data-serial attribute' },
  { re: /action=validate[^"'\s]*(&amp;|&)email/i, why: 'an email on an action=validate URL' },
  { re: /action=validate[^"'\s]*(&amp;|&)serial/i, why: 'a serial on an action=validate URL' },
];

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx?|css|html|json|js|cjs)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const srcFiles = walk(SRC, []);
for (const file of srcFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  for (const { re, why } of FORBIDDEN) {
    if (re.test(text)) fail(`${rel} contains ${why} -- license credentials must never reach the served page`);
  }
}

// --- report ---------------------------------------------------------------------
console.log('== Registry gate: WEB-STR-001');
console.log(`   catalog rows: ${rows.length} (${rows.filter((r) => r.status === 'placeholder').length} fixture, ${rows.filter((r) => r.status === 'published').length} published)`);
console.log(`   registered products: ${products.length}`);
console.log(`   src files scanned for credential leaks: ${srcFiles.length}`);

for (const n of notes) console.log(`   [note]  ${n}`);

if (failures.length === 0) {
  console.log('   [ok]    registry, catalog and sitemap agree; no unpublished product is reachable');
  console.log('');
  console.log('CLEAN');
  process.exit(0);
}
console.log('');
for (const f of failures) console.log(`   [FAIL]  ${f}`);
console.log('');
console.log(`${failures.length} FAILURE(S)`);
process.exit(1);
