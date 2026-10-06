#!/usr/bin/env node
// Generate public/sitemap.xml from the registry, never by hand.
//
// WHY THIS EXISTS
// ---------------
// public/sitemap.xml was a hand-maintained file protected by a parity gate
// (tests/check-registry.cjs rule 7): the gate caught a slug that was listed
// but unpublished, or a published slug that was missing. It could not catch a
// typo in <changefreq>, a stale domain, or a core page that drifted, because
// there was nothing canonical to compare it against. At one template the
// discipline is survivable; at the hundred templates the catalog is planned
// for, it is a shard. So the file is derived: the catalog rows come from the
// same data the gate reads, and the core pages are the only thing a human
// keeps in this file.
//
//   node tools/generate-sitemap.cjs          rewrite public/sitemap.xml
//   node tools/generate-sitemap.cjs --check  exit 1 if the file is stale
//
// --check is wired into `npm test`, so a sitemap that was not regenerated
// after a publish/unpublish fails the suite instead of drifting quietly.

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATALOG = path.join(ROOT, 'src', 'data', 'templates.ts');
const SITEMAP = path.join(ROOT, 'public', 'sitemap.xml');
const DOMAIN = 'https://templatemeva.com';

// Core pages a human owns. Every product URL is derived, never listed here.
const CORE_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/unlicensed', changefreq: 'monthly', priority: '0.6' },
  { path: '/docs', changefreq: 'weekly', priority: '0.8' },
  { path: '/docs/installation', changefreq: 'monthly', priority: '0.8' },
  { path: '/docs/activation', changefreq: 'monthly', priority: '0.8' },
  { path: '/docs/customization', changefreq: 'monthly', priority: '0.8' },
  { path: '/docs/adsense', changefreq: 'monthly', priority: '0.8' },
  { path: '/docs/troubleshooting', changefreq: 'monthly', priority: '0.8' },
];

function publishedSlugs() {
  const catalog = fs.readFileSync(CATALOG, 'utf8');
  const slugs = [];
  const rowRe = /slug:\s*'([^']+)',[\s\r\n]*status:\s*'([^']+)'/g;
  let m;
  while ((m = rowRe.exec(catalog)) !== null) {
    if (m[2] === 'published') slugs.push(m[1]);
  }
  return slugs.sort();
}

function render() {
  const slugs = publishedSlugs();
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<!-- GENERATED FILE -- do not edit by hand.');
  lines.push('     Source: tools/generate-sitemap.cjs (core pages listed there,');
  lines.push('     product URLs derived from src/data/templates.ts + docs/products.json).');
  lines.push('     Regenerate with: npm run sitemap');
  lines.push('     tests/check-registry.cjs rule 7 still gates slug/status parity,');
  lines.push('     and `npm test` runs --check so this file cannot go stale. -->');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  lines.push('');
  lines.push('  <!-- Core Pages -->');
  for (const p of CORE_PAGES) {
    lines.push('  <url>');
    lines.push(`    <loc>${DOMAIN}${p.path}</loc>`);
    lines.push(`    <changefreq>${p.changefreq}</changefreq>`);
    lines.push(`    <priority>${p.priority}</priority>`);
    lines.push('  </url>');
    if (p.path === '/unlicensed') {
      lines.push('');
      lines.push('  <!-- Help & Docs Pages -->');
    }
  }
  lines.push('');
  if (slugs.length === 0) {
    lines.push('  <!-- Template Products: none published yet. See docs/REGISTRY.md. -->');
  } else {
    lines.push('  <!-- Template Products (derived: status published only) -->');
    for (const slug of slugs) {
      lines.push('  <url>');
      lines.push(`    <loc>${DOMAIN}/templates/${slug}</loc>`);
      lines.push('    <changefreq>weekly</changefreq>');
      lines.push('    <priority>0.9</priority>');
      lines.push('  </url>');
    }
  }
  lines.push('');
  lines.push('</urlset>');
  lines.push('');
  return lines.join('\n');
}

const checkOnly = process.argv.includes('--check');
const content = render();

if (checkOnly) {
  const current = fs.existsSync(SITEMAP) ? fs.readFileSync(SITEMAP, 'utf8') : '';
  if (current !== content) {
    console.error('public/sitemap.xml is stale -- regenerate with: npm run sitemap');
    process.exit(1);
  }
  console.log('public/sitemap.xml is up to date');
  process.exit(0);
}

fs.writeFileSync(SITEMAP, content, 'utf8');
console.log(`wrote public/sitemap.xml (${publishedSlugs().length} product URL(s), ${CORE_PAGES.length} core pages)`);
