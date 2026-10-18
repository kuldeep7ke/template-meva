#!/usr/bin/env node
// Register a Machine-generated Blogger template project as a storefront product.
//
// WHY THIS EXISTS
// ---------------
// `the-machine/machine/new-project.ps1` allocates a ProjectID and scaffolds a new
// template project. Before this tool existed, nothing carried that ProjectID into
// the storefront, so a new product only appeared if a human remembered to add it.
// That is the definition of a step that gets skipped.
//
// WHAT IT WRITES, AND WHY IT WRITES SO LITTLE
// -------------------------------------------
// The generator knows a ProjectID, a repo, a name and a version. It does not know
// a price, a checkout URL, a trial archive, a demo URL, or whether the owner
// consents to resale. So it writes a DRAFT with explicit TODO(operator) markers
// and `resale: 'undecided'`, never a published product.
//
// This matters because of what was actually found in this store: nine products,
// every one of them invented, with nothing in the data saying so, and a `buyUrl`
// pointing at a Gumroad listing nobody had verified. A generator that filled in
// plausible values would have produced nine more of exactly that.
//
// USAGE
//   node tools/register-product.cjs --project-id BLG-GEL-002 \
//     --name "My Template" --repo https://github.com/o/my-template \
//     --version v1.0.0 [--category Magazine] [--dry-run]
//
//   node tools/register-product.cjs --selftest     prove the catalog insert still bites
//
// Exits 0 on success, 1 on a bad argument or a duplicate ProjectID.

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS = path.join(ROOT, 'docs', 'products.json');
const CATALOG = path.join(ROOT, 'src', 'data', 'templates.ts');
const REGISTRY_MD = path.join(ROOT, 'docs', 'REGISTRY.md');

const PROJECT_ID_RE = /^[A-Z0-9]{2,6}-[A-Z0-9]{2,6}-\d{3}$/;

function die(msg) {
  console.error('register-product: ' + msg);
  process.exit(1);
}

const FLAGS = new Set(['--dry-run', '--sync', '--selftest']);

function parseArgs(argv) {
  const out = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (FLAGS.has(a)) { out[a === '--dry-run' ? 'dryRun' : a.slice(2)] = true; continue; }
    if (!a.startsWith('--')) die(`unexpected argument "${a}"`);
    const key = a.slice(2);
    const val = argv[++i];
    if (val === undefined) die(`--${key} needs a value`);
    out[key] = val;
  }
  return out;
}

// --- the catalog insert --------------------------------------------------------
// One new element before the closing `];` of TEMPLATES, and the comma is the
// whole reason this is a function. The element that was LAST before an insert
// carries no trailing comma -- it did not need one -- so inserting after it
// REQUIRES adding one. The first real run of this tool (BLG-CHI-001,
// 2026-10-18) did not, and wrote `}\n  {`: src/data/templates.ts stopped
// parsing, which makes `tsc` -- the first step of `npm test` -- fail on the very
// registration this tool exists to make. A registration tool whose success
// state is a red suite is worse than one that refuses.
function insertCatalogEntry(catalog, entryText) {
  const anchor = catalog.lastIndexOf('\n];');
  if (anchor === -1) die('could not find the end of TEMPLATES in src/data/templates.ts');
  const before = catalog.slice(0, anchor);
  // No comma when the previous element already has one, or when there is no
  // element to separate from (an empty array ends with its own '[').
  const needsComma = !/[,[]\s*$/.test(before);
  const head = needsComma ? before.replace(/\s+$/, '') + ',' : before;
  return head + catalog.slice(anchor, anchor + 1) + entryText + '\n' + catalog.slice(anchor + 1);
}

const args = parseArgs(process.argv.slice(2));

// --- selftest ------------------------------------------------------------------
// The fixture is the exact shape that broke in the field (a comma-less last
// element), the assertion is a real PARSE of the result, and the PRE-FIX
// algorithm is re-run beside it and must fail the same parse -- otherwise the
// test could pass for a reason unrelated to the bug. No argument parsing, no
// files touched.
if (args.selftest) {
  const entry = '  { b: 2 },';
  const parseLength = (text) => {
    try { return new Function('return ' + text)().length; } catch { return null; }
  };
  let failCount = 0;
  const check = (name, ok, detail) => {
    console.log((ok ? 'PASS  ' : 'FAIL  ') + name);
    if (!ok) { console.log('        ' + detail); failCount++; }
  };

  // 1. the bug as it happened: last element WITHOUT a comma must gain one.
  const bare = '[\n  { a: 1 }\n];\n';
  const inserted = insertCatalogEntry(bare, entry);
  check('an element appended after a comma-less last element still parses',
    parseLength(inserted) === 2, JSON.stringify(inserted));

  // 2. the pre-fix algorithm, byte for byte, fails the same parse.
  const oldWay = ((cat, e) => {
    const a = cat.lastIndexOf('\n];');
    return cat.slice(0, a + 1) + e + '\n' + cat.slice(a + 1);
  })(bare, entry);
  check('  ...and the pre-fix algorithm fails it, so this test bites',
    parseLength(oldWay) === null, JSON.stringify(oldWay));

  // 3. an element that already has its comma must not get a second.
  const trailing = '[\n  { a: 1 },\n];\n';
  const inserted2 = insertCatalogEntry(trailing, entry);
  check('an already-comma-terminated element does not get a double comma',
    parseLength(inserted2) === 2 && !inserted2.includes(',,'), JSON.stringify(inserted2));

  // 4. an empty array must not start with a comma.
  const empty = '[\n];\n';
  const inserted3 = insertCatalogEntry(empty, entry);
  check('an empty array gains the element without a leading comma',
    parseLength(inserted3) === 1, JSON.stringify(inserted3));

  console.log('');
  console.log(failCount === 0 ? 'register-product selftest: all passed' : 'register-product selftest: ' + failCount + ' FAILED');
  process.exit(failCount === 0 ? 0 : 1);
}

if (args.sync) {
  const db0 = JSON.parse(fs.readFileSync(PRODUCTS, 'utf8'));
  if (args['dry-run']) {
    console.log('DRY RUN -- REGISTRY.md not written.');
  } else {
    writeRegistryMd(db0);
    console.log(`  REGISTRY.md     <- regenerated from docs/products.json (${db0.products.length} product(s))`);
  }
  process.exit(0);
}

for (const req of ['project-id', 'name', 'repo', 'version']) {
  if (!args[req]) die(`--${req} is required`);
}
if (!PROJECT_ID_RE.test(args['project-id'])) {
  die(`--project-id must look like <PLATFORM>-<BASETHEME>-<NNN>, got "${args['project-id']}"`);
}
if (!/^https:\/\//.test(args.repo)) die('--repo must be an https repository URL');

const projectId = args['project-id'];
const slug = args['project-id'].toLowerCase() + '-template';
const productName = args.name;
const category = args.category || 'Magazine';
const today = new Date().toISOString().slice(0, 10);

const db = JSON.parse(fs.readFileSync(PRODUCTS, 'utf8'));
if (db.products.some((p) => p.projectId === projectId)) {
  die(`${projectId} is already registered. Edit docs/products.json instead -- an ID is never reused.`);
}

// --- the draft -----------------------------------------------------------------
// Every value a generator cannot know is a TODO marker rather than a plausible
// value. `tests/check-registry.cjs` fails while any TODO remains in a published
// entry, so the marker cannot be forgotten by being overwritten with a guess.
const entry = {
  projectId,
  slug,
  productName,
  repo: args.repo,
  version: args.version,
  status: 'draft',
  resale: 'undecided',
  category,
  columns: null,
  darkModeSupported: null,
  rtlSupported: null,
  adsenseOptimized: null,
  liveUrl: null,
  trialArtifact: null,
  registeredAt: today,
  notes: `Auto-registered by new-project.ps1 on ${today}. Needs: price, buyUrl, trial artifact, demo URL, and a resale decision.`,
};

if (args['dry-run']) {
  console.log('DRY RUN -- nothing written.');
  console.log('  products.json row: ' + JSON.stringify(entry));
  console.log('  catalog slug:      ' + slug);
  console.log('  registry row:      ' + projectId);
  process.exit(0);
}

db.products.push(entry);
fs.writeFileSync(PRODUCTS, JSON.stringify(db, null, 2) + '\n');
console.log(`  products.json   <- ${projectId} (draft)`);

// --- the catalog draft ---------------------------------------------------------
// Appended to TEMPLATES so the product exists in the app's own data shape. It is
// `draft`, so nothing routes to it, HomeGallery filters it out, and the sitemap
// omits it -- see `isListed` in src/data/templates.ts.
const catalogEntry = `  {
    // AUTO-REGISTERED from ${projectId}. Do not fill these in by guessing --
    // TODO(operator): price, originalPrice, buyUrl, trialDownloadUrl, liveDemoUrl.
    id: '${slug}',
    slug: '${slug}',
    status: 'draft',
    projectId: '${projectId}',
    title: '${productName.replace(/'/g, "\\'")}',
    tagline: 'TODO(operator): one line for the catalog card',
    description: 'TODO(operator): one-line summary used in listings',
    fullOverview: 'TODO(operator): long overview for the detail page.',
    price: 0,
    originalPrice: 0,
    hasTrial: false,
    trialDuration: '7 Days Free Trial',
    trialDownloadUrl: '',
    buyUrl: '',
    rating: 0,
    reviewCount: 0,
    salesCount: 0,
    version: '${args.version}',
    releaseDate: '${today}',
    lastUpdated: '${today}',
    category: '${category}',
    tags: [],
    columns: '2 Columns',
    layout: 'Magazine',
    pageSpeedScore: { mobile: 0, desktop: 0 },
    features: [],
    specifications: [],
    demos: [],
    comparisonTable: [],
    reviews: [],
    thumbnail: '',
    galleryImages: [],
    liveDemoUrl: '',
    rtlSupported: false,
    darkModeSupported: false,
    adsenseOptimized: false,
    seoReady: false,
  },`;

const catalog = fs.readFileSync(CATALOG, 'utf8');
fs.writeFileSync(CATALOG, insertCatalogEntry(catalog, catalogEntry));
console.log(`  templates.ts    <- ${slug} (status: 'draft')`);

// --- the human-readable registry ----------------------------------------------
writeRegistryMd(db);
console.log(`  REGISTRY.md     <- ${projectId}`);
console.log('');
console.log('registered as a DRAFT. Nothing is published. To publish:');
console.log(`  1. fill the TODOs in the '${slug}' catalog row`);
console.log(`  2. set docs/products.json -> products[].status = "published"`);
console.log(`  3. set docs/products.json -> products[].resale  = "allowed"`);
console.log('  4. npm run registry:sync   (regenerates REGISTRY.md)');
console.log('  5. npm run registry        (the gate refuses any of the above missing)');

function writeRegistryMd(database) {
  const lines = [];
  lines.push('# REGISTRY.md -- products this storefront represents');
  lines.push('');
  lines.push('> **Class: SUBJECTIVE (this project only).** GENERATED by');
  lines.push('> `npm run registry:sync` from `docs/products.json`. Edit that file, not this');
  lines.push('> one. `tests/check-registry.cjs` fails if the two disagree.');
  lines.push('');
  lines.push('## Registered products');
  lines.push('');
  lines.push('| ProjectID | Product | Version | Status | Resale | Repo |');
  lines.push('|-----------|---------|---------|--------|--------|------|');
  for (const p of database.products) {
    lines.push(
      `| \`${p.projectId}\` | ${p.productName} | ${p.version} | **${p.status}** | ${p.resale} | [repo](${p.repo}) |`
    );
  }
  lines.push('');
  lines.push('`published` is the only status that appears in the storefront catalog and in');
  lines.push('`public/sitemap.xml`. The gate refuses to publish an entry whose `resale` is');
  lines.push('anything other than `allowed`, and refuses a published entry that still');
  lines.push('contains a `TODO(operator)` marker.');
  lines.push('');
  lines.push('## Invented fixtures');
  lines.push('');
  lines.push('These have no corresponding project anywhere in the workspace. They exist so');
  lines.push('the storefront has something to render, and they are `status: \'placeholder\'`');
  lines.push('so the sitemap can exclude them and nothing can mistake them for products.');
  lines.push('');
  lines.push('| Slug | Name |');
  lines.push('|------|------|');
  for (const f of database.fixtures) lines.push(`| \`${f.slug}\` | ${f.productName} |`);
  lines.push('');
  fs.writeFileSync(REGISTRY_MD, lines.join('\n'));
}
