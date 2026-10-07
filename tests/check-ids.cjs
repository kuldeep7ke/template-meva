/* tests/check-ids.cjs -- the change-ID integrity gate this project was missing.
 *
 * WHY IT EXISTS
 * -------------
 * `tools/next-id.cjs` was built (WEBSTR001-C004) and `docs/CHANGES.md` promises a
 * prefix "derived from PROJECT_ID, never typed by hand". That promise is about
 * COLLISION with another project. It says nothing about whether this project's own
 * ledger is intact -- that a referenced id has a row, that the counter has no gap,
 * that a row points at a commit which exists. All three were unchecked, and
 * `npm test` ran four gates that had nothing to do with the ledger, so the one
 * artefact that is append-only and load-bearing for traceability was the one with
 * no gate.
 *
 * The sibling project (blogger-llianmeva-template) has had this gate for hundreds
 * of changes. Porting it there was correct there; forgetting to port it here meant
 * this project was quietly the weaker one. The lesson is the KB's own R17: a file
 * nobody registered is invisible, and a promise nobody checks is not a promise.
 *
 * WHAT IT CHECKS
 * --------------
 *   1. Every `<PREFIX>-C###` referenced anywhere resolves to a ledger row.
 *   2. The C counter has no gap inside its band.
 *   3. Every SEALED row resolves to a real commit (a row that claims a commit hash
 *      nothing has is a lie that reads as history).
 *   4. The prefix actually derives from PROJECT_ID, so a copied PROMPT/prefix
 *      cannot start a second ledger in the same space.
 *
 * PREFIX IS READ, NEVER HARDCODED
 * ------------------------------
 * The whole point of the derived prefix is that it is not a literal. A gate that
 * hardcodes `WEBSTR001` would be right today and would keep passing after the
 * ProjectID changed -- which is exactly the failure B-041 recorded in the KB, where
 * a version literal was pinned in a tool and an assertion above it stopped
 * meaning anything. So the prefix is computed from PROJECT_ID here too, and a
 * mismatch is a failure rather than a silently-passing check.
 *
 *   node tests/check-ids.cjs --selftest
 *   node tests/check-ids.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const LEDGER = path.join(ROOT, 'docs', 'CHANGES.md');
const PROJECT_ID_FILE = path.join(ROOT, 'PROJECT_ID');

/** The prefix, derived. PROJECT_ID is "WEB-STR-001" -> "WEBSTR001". */
function derivedPrefix() {
  if (!fs.existsSync(PROJECT_ID_FILE)) return null;
  const id = fs.readFileSync(PROJECT_ID_FILE, 'utf8').trim();
  if (!/^[A-Z]{3,}-[A-Z]{3,}-\d{3}$/.test(id)) return null;
  return id.replace(/-/g, '');
}

/** Ledger rows: | WEBSTR001-C007 | 2026-10-07 | fix | ... | ... | */
function readRows(prefix) {
  if (!fs.existsSync(LEDGER)) return null;
  const text = fs.readFileSync(LEDGER, 'utf8');
  const rowRe = new RegExp(`^\\| (${prefix}-C\\d{3}) \\|([^\\n]*)$`, 'gm');
  const rows = [];
  let m;
  while ((m = rowRe.exec(text)) !== null) {
    const id = m[1];
    // Split the WHOLE row, not the tail: the trailing "|" produces an empty cell
    // at both ends, so `rest.split('|')` ends with '' and the seal is at
    // length-2, not length-1. Reading length-1 made every row look unsealed, which
    // is why the seal check reported "0 sealed rows" on a ledger that had seals --
    // a check that silently measures nothing.
    const cells = m[0].split('|').map((c) => c.trim());
    const last = cells[cells.length - 2] ?? '';
    const seal = /^[0-9a-f]{7,40}$/.test(last) ? last : null;
    rows.push({
      id,
      num: parseInt(id.slice(-3), 10),
      line: text.slice(0, m.index).split('\n').length,
      seal,
      lastCell: last,
    });
  }
  return rows;
}

function listCommitShas() {
  let text;
  try {
    text = execSync('git rev-list --all', { cwd: ROOT, encoding: 'utf8' });
  } catch (e) {
    return null;
  }
  // A ledger records SHORT shas (7 hex), so an exact-match Set never contains one
  // and every real seal reads as fake. That is not a small bug: it reports four
  // genuine, correct seals as lies, and the rational response is to delete the
  // seals. So index by PREFIX as well and accept a match on any prefix length
  // git itself would accept.
  const full = new Set();
  const prefixes = new Set();
  for (const sha of text.split(/\r?\n/).filter(Boolean)) {
    full.add(sha);
    for (let n = 7; n <= Math.min(sha.length, 12); n++) prefixes.add(sha.slice(0, n));
  }
  return {
    has: (short) => full.has(short) || prefixes.has(short),
    count: full.size,
  };
}

/* --------------------------------------------------------------------------- */
function selftest() {
  const cases = [];

  // prefix derivation
  const p = derivedPrefix();
  if (p === 'WEBSTR001') cases.push(['PROJECT_ID derives the prefix', true]);
  else cases.push([`PROJECT_ID derives the prefix (got ${p})`, false]);

  // row parsing
  const rows = readRows(p);
  if (rows && rows.length > 0) {
    cases.push([`ledger rows parse (${rows.length})`, true]);
    const nums = rows.map((r) => r.num);
    cases.push(['ids are unique', new Set(nums).size === nums.length]);
    const sorted = [...nums].sort((a, b) => a - b);
    const dense = sorted.every((n, i) => i === 0 || n === sorted[i - 1] + 1);
    cases.push(['the counter is dense with no gap', dense]);
  } else {
    cases.push(['ledger rows parse', false]);
  }

  let fail = 0;
  for (const [name, ok] of cases) {
    console.log(`  [${ok ? 'ok' : 'FAIL'}]   ${name}`);
    if (!ok) fail += 1;
  }
  console.log(fail === 0 ? '== SELFTEST PASS ==' : `== SELFTEST FAIL: ${fail} ==`);
  return fail === 0;
}

if (process.argv.includes('--selftest')) process.exit(selftest() ? 0 : 1);

/* --------------------------------------------------------------------------- */
const prefix = derivedPrefix();
if (!prefix) {
  console.error(`[FAIL] PROJECT_ID is missing or not <PLATFORM>-<BASETHEME>-<NNN>; cannot derive the id prefix.`);
  console.error(`       ${path.relative(ROOT, PROJECT_ID_FILE)} should hold e.g. WEB-STR-001.`);
  process.exit(1);
}

const rows = readRows(prefix);
if (!rows || rows.length === 0) {
  console.error(`[FAIL] ${path.relative(ROOT, LEDGER)} has no rows like "| ${prefix}-C001 | ...".`);
  console.error('       Allocate the first id with: npm run id:next');
  process.exit(1);
}

console.log(`== Change-ID integrity (${path.relative(ROOT, LEDGER)}) ==`);
console.log(`   prefix derived from PROJECT_ID: ${prefix}`);
console.log(`   rows: ${rows.length}`);

let problems = 0;
const byId = new Map(rows.map((r) => [r.id, r]));

// 1. every referenced id resolves
const tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  // Append-only history legitimately names retired ids, exactly as
  // check-gate-counts exempts history: a row that was true when written stays true.
  .filter((f) => !/(^|\/)(CHANGES|CHANGELOG|MEMORY_CAPSULE|SYNC)\.md$/.test(f));

const refRe = new RegExp(`${prefix}-C\\d{3}`, 'g');
const dangling = new Map();
for (const rel of tracked) {
  let text;
  try {
    text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  } catch (e) {
    continue;
  }
  let m;
  while ((m = refRe.exec(text)) !== null) {
    if (!byId.has(m[0])) {
      if (!dangling.has(m[0])) dangling.set(m[0], []);
      if (dangling.get(m[0]).length < 4) dangling.get(m[0]).push(rel);
    }
  }
}
if (dangling.size) {
  problems += dangling.size;
  for (const [id, where] of dangling) {
    console.log(`  [FAIL] ${id} is referenced but has no ledger row`);
    for (const w of where) console.log(`         referenced in ${w}`);
  }
  // Name every dangling id, not just the last one iterated. The earlier version
  // printed the repair hint inside the loop but the hint text interpolated the
  // loop variable after the loop had moved on, so it only ever named one of them
  // -- which reads as "there is one problem" when there may be five.
  console.log(`         Append a row for each, or fix the reference: ${[...dangling.keys()].join(', ')}`);
} else {
  console.log(`  [ok]   every referenced ${prefix}-C### resolves to a row`);
}

// 2. the counter is dense
const nums = [...byId.values()].map((r) => r.num).sort((a, b) => a - b);
const gaps = [];
for (let i = 1; i < nums.length; i++) {
  if (nums[i] !== nums[i - 1] + 1) {
    for (let n = nums[i - 1] + 1; n < nums[i]; n++) gaps.push(n);
  }
}
if (gaps.length) {
  problems += 1;
  console.log(`  [FAIL] the counter has ${gaps.length} gap(s): ${gaps.map((n) => `${prefix}-C${String(n).padStart(3, '0')}`).join(', ')}`);
  console.log('         An id that was allocated and never recorded cannot be allocated again safely.');
} else {
  console.log(`  [ok]   the counter is dense (C${String(nums[0]).padStart(3, '0')}..C${String(nums[nums.length - 1]).padStart(3, '0')})`);
}

// 3. sealed rows resolve to a real commit
const shas = listCommitShas();
let sealed = 0;
let unsealed = 0;
const badSeals = [];
for (const r of byId.values()) {
  if (!r.seal) {
    unsealed += 1;
    continue;
  }
  sealed += 1;
  if (shas && !shas.has(r.seal)) badSeals.push(r);
}
if (badSeals.length) {
  problems += badSeals.length;
  for (const r of badSeals) {
    console.log(`  [FAIL] ${r.id} is sealed with ${r.seal}, which is not a commit in this repository (line ${r.line})`);
  }
  console.log('         A seal that points at nothing is a claim of history with no history behind it.');
} else if (shas) {
  console.log(`  [ok]   all ${sealed} sealed row(s) resolve to a real commit`);
} else {
  console.log('  [note] git history unavailable, so seals were not verified');
}

if (unsealed) {
  console.log(`  [note] ${unsealed} row(s) carry a stated reason instead of a commit seal`);
  console.log('         (a "PENDING" or similar last cell is a reason, not a pass -- read it as a to-do)');
}

console.log(problems === 0 ? '== CLEAN: change-ID ledger consistent ==' : `== ${problems} PROBLEM(S) ==`);
process.exit(problems === 0 ? 0 : 1);