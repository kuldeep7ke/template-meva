#!/usr/bin/env node
/*
 * MEMORY-CAPSULE STALENESS GATE (WEBSTR001-C013)
 *
 * The problem this exists for. docs/MEMORY_CAPSULE.md is this project's living
 * memory -- the file a fresh session reads to learn what the project decided and
 * what it was in the middle of. It is also the file most likely to be quietly
 * abandoned, because nothing fails when it is.
 *
 * It was abandoned here, and the record says so. The entry for WEBSTR001-C011
 * and C012 closes with this, written at the time rather than discovered later:
 *
 *     "Also found while auditing, and NOT fixed here: C008, C009 and C010 are in
 *      docs/CHANGES.md and committed, but this capsule's journal stops at C007.
 *      The record went quiet while the work kept landing. The sibling project has
 *      a staleness watermark for exactly this; this one does not, which is a gap
 *      worth its own change rather than three paragraphs written in passing."
 *
 * This is that change. The three missed entries are backfilled in the capsule,
 * and the watermark below is what stops the fourth one from being needed.
 *
 * WHY NOT "every ledger row must appear in the capsule"
 * That is the obvious check and it is the wrong one. The capsule holds a
 * SELECTIVE dated history: it covers C001, C004-C007 and C011 onward, while
 * C002, C003, C008, C009 and C010 had no entry until the backfill above. The
 * sibling project settled this exact question in BLG-C207 -- demanding full
 * coverage would force retroactive entries describing state that has since been
 * superseded, and "a gate that fires on 59 pre-existing rows on its first day is
 * a gate that gets deleted."
 *
 * So the property is not coverage. It is ORDER. The capsule must not be BEHIND
 * the ledger:
 *
 *     highest id in docs/CHANGES.md  <=  highest id named in MEMORY_CAPSULE.md
 *
 * It is one comparison, it is true the moment a session does its job, and it is a
 * rolling watermark rather than a debt: you satisfy it by appending the entry for
 * the change you just made, which is what you were going to do anyway.
 *
 * WHY A DATE CANNOT BE THE TEST
 * The capsule and the ledger were both dated 2026-10-07 when this was written and
 * the capsule was still a change behind. A date comparison cannot see a row added
 * later the same day, which is the common case in a project that commits
 * repeatedly within one session. Ids are the only ordering that survives a
 * same-day merge, and a merge is precisely when file order and time order stop
 * agreeing.
 *
 * HOW THIS PROJECT WRITES A SPAN -- AND WHY THAT MATTERS MORE THAN IT LOOKS
 * The capsule does not repeat the prefix on every number. It writes
 *
 *     WEBSTR001-C004 through C006      (a range, in words)
 *     WEBSTR001-C011 and C012          (a list of the ids in one session)
 *
 * A gate that only matched `PREFIX-C\d{3}` would stop at 011, report the capsule
 * as one change behind, and be wrong -- the entry names 012 in plain sight. The
 * only fix a reader could apply would be to stop writing the prose span, which is
 * how the sibling project's first version of this gate failed on its own example:
 * it read `BLG-C200-C206` as 200 and told the author the capsule was stale on a
 * heading that said 206. So the span's far end is parsed here, and the selftest
 * below fails the build if it stops being parsed.
 *
 * What deliberately does NOT count: a bare `C999` with no prefix and no span in
 * front of it. A bare id anywhere in the prose is a coincidence of wording, not
 * evidence that the memory knows about that change. Only a prefixed id, or the
 * far end of a span that starts with one, is a candidate.
 *
 * And a candidate only counts if it is a real LEDGER ROW. The capsule quotes
 * things: the C013 entry cites the reserved band as `WEBSTR001-C001`-`WEBSTR001-C999`
 * in order to warn about it, and a gate that took the capsule's highest mention at
 * face value would read 999, satisfy `999 >= 13`, and report the capsule as
 * current while it was a change behind. That is the shape of every "green for the
 * wrong reason" defect this repo has found: the observation is true (the file does
 * contain `C999`) and the conclusion drawn from it is not (the memory is aware of
 * C999). So the prose parse and the row filter are two separate steps, and the
 * pass message reports both when they disagree.
 *
 * WHAT IT DOES NOT DO
 * It does not check that the capsule is CORRECT, only that it is CURRENT. A stale
 * memory and a wrong memory both pass here; correctness is a review question,
 * currency is a mechanical one.
 *
 * The prefix is READ from PROJECT_ID, never written as a literal here -- the same
 * rule WEBSTR001-C011 established for check-ids.cjs. A hardcoded WEBSTR001 would
 * be right today and would keep passing after PROJECT_ID changed, which is the
 * failure B-041 records in the knowledge base.
 *
 * Exit 0 when current, 1 when behind. --selftest proves it fails on the real
 * shape, because a gate that cannot fail on the defect it names should not ship.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LEDGER = path.join(ROOT, 'docs', 'CHANGES.md');
const CAPSULE = path.join(ROOT, 'docs', 'MEMORY_CAPSULE.md');
const PROJECT_ID_FILE = path.join(ROOT, 'PROJECT_ID');

const read = (p) => fs.readFileSync(p, 'utf8');

/** The prefix, derived. PROJECT_ID is "WEB-STR-001" -> "WEBSTR001". */
function derivedPrefix() {
  if (!fs.existsSync(PROJECT_ID_FILE)) return null;
  const id = fs.readFileSync(PROJECT_ID_FILE, 'utf8').trim();
  if (!/^[A-Z]{3,}-[A-Z]{3,}-\d{3}$/.test(id)) return null;
  return id.replace(/-/g, '');
}

/** Escape a literal for use inside a RegExp. */
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * The separator this project puts between the two ends of a span. Kept in one
 * place so the selftest can enumerate exactly what is understood.
 */
const SPAN_SEP = String.raw`(?:-|through|and|to|\.\.?)`;

/* Highest PREFIX-C### id named anywhere in a document.
 *
 * "Anywhere", not "in a dated heading", on purpose: the capsule cites ids in
 * prose as well as headings ("C012: the guide told you to hand-edit a generated
 * file"), and a check that read only headings would report a session's work as
 * missing because it summarised the change instead of heading it. Awareness is a
 * mention.
 *
 * A span counts as covering its whole far end, in any of the forms above.
 */
function maxId(text, prefix) {
  if (!prefix) return 0;
  let max = 0;
  const take = (n) => { const v = Number(n); if (v > max) max = v; };
  const head = new RegExp(`${esc(prefix)}-C(\\d{3})`, 'g');
  for (const m of text.matchAll(head)) {
    take(m[1]);
    const tail = text.slice(m.index + m[0].length);
    const far = tail.match(new RegExp(`^\\s*${SPAN_SEP}\\s*(?:${esc(prefix)}-)?C(\\d{3})\\b`, 'i'));
    if (far) take(far[1]);
  }
  return max;
}

/** Ids present, with spans expanded. Used by the message and the selftest. */
function idsIn(text, prefix) {
  const s = new Set();
  if (!prefix) return s;
  const head = new RegExp(`${esc(prefix)}-C(\\d{3})`, 'g');
  for (const m of text.matchAll(head)) {
    s.add(Number(m[1]));
    const tail = text.slice(m.index + m[0].length);
    const far = tail.match(new RegExp(`^\\s*${SPAN_SEP}\\s*(?:${esc(prefix)}-)?C(\\d{3})\\b`, 'i'));
    if (far) s.add(Number(far[1]));
  }
  return s;
}

/* Highest id that is an actual LEDGER ROW.
 *
 * The ledger is read as rows -- `| WEBSTR001-C012 | 2026-10-07 | ...` -- and not
 * as prose, for the same reason check-ids.cjs does: line 61 of docs/CHANGES.md
 * reserves the band by writing
 *
 *     whole `WEBSTR001-C001`-`WEBSTR001-C999` space. When a second machine joins...
 *
 * That is a declaration that the id SPACE runs to 999, not a row claiming C999
 * exists. Scanning prose raises the watermark to 999, the capsule can never
 * reach it, and the gate fails on day one for a reason that has nothing to do
 * with staleness -- a failure that reads as plausible, because "the ledger is at
 * C999" is a sentence the file really does contain. docs/MEMORY_CAPSULE.md:77
 * records this exact trap being hit by an earlier naive regex.
 *
 * The capsule has no rows at all -- it is free-form prose -- so the prose reader
 * above is correct for it and wrong for the ledger. The two sides are read
 * differently on purpose.
 */
function maxRowId(text, prefix) {
  if (!prefix) return 0;
  let max = 0;
  const rowRe = new RegExp(`^\\| ${esc(prefix)}-C(\\d{3}) \\|`, 'gm');
  for (const m of text.matchAll(rowRe)) {
    const v = Number(m[1]);
    if (v > max) max = v;
  }
  return max;
}

/** Every id the ledger has a real ROW for. Used by the gap message. */
function rowIds(text, prefix) {
  const s = new Set();
  if (!prefix) return s;
  const rowRe = new RegExp(`^\\| ${esc(prefix)}-C(\\d{3}) \\|`, 'gm');
  for (const m of text.matchAll(rowRe)) s.add(Number(m[1]));
  return s;
}

/* The capsule's watermark: the highest id that is BOTH named in the capsule AND
 * an actual ledger row.
 *
 * Extracted so the selftest exercises this exact function rather than a copy of
 * it -- a selftest that reimplements the rule tests nothing when the rule changes.
 *
 * The intersection is what keeps a quotation from counting as awareness. See the
 * header: docs/MEMORY_CAPSULE.md quotes the reserved band `WEBSTR001-C001`-`WEBSTR001-C999`
 * in order to warn about it, and taking the capsule's highest mention at face
 * value would report "current" on that number while the ledger head went
 * unmentioned.
 */
function watermark(capsuleText, ledgerText, prefix) {
  const rows = rowIds(ledgerText, prefix);
  const named = idsIn(capsuleText, prefix);
  let capMax = 0;
  for (const n of named) if (rows.has(n) && n > capMax) capMax = n;
  return { rows, named, capMax, rawMax: maxId(capsuleText, prefix) };
}

function run() {
  const prefix = derivedPrefix();
  if (!prefix) {
    console.error(`  [FAIL] cannot derive a prefix from PROJECT_ID -- ${path.relative(ROOT, PROJECT_ID_FILE)}`);
    console.error('         is missing or not shaped like WEB-STR-001. Every other check in this');
    console.error('         repo derives from it too, so failing here rather than guessing is right.');
    return 1;
  }

  let ledger;
  let capsule;
  try {
    ledger = read(LEDGER);
  } catch {
    console.error(`  [FAIL] ${path.relative(ROOT, LEDGER)} not found, so capsule staleness cannot be checked`);
    return 1;
  }
  try {
    capsule = read(CAPSULE);
  } catch {
    console.error(`  [FAIL] ${path.relative(ROOT, CAPSULE)} not found -- it is this project's living memory,`);
    console.error('         and its absence is the failure.');
    return 1;
  }

  const ledMax = maxRowId(ledger, prefix);

  // The capsule side is read as prose, but only ids that are REAL LEDGER ROWS
  // are allowed to raise the watermark. See watermark() above for why -- a
  // quotation of the reserved band must not read as awareness of C999.
  const { rows, capMax, rawMax } = watermark(capsule, ledger, prefix);

  if (ledMax === 0) {
    console.error(`  [FAIL] no ${prefix}-C### rows in ${path.relative(ROOT, LEDGER)}; the ledger looks wrong,`);
    console.error('         so this check cannot be trusted and must not report a pass.');
    return 1;
  }

  const fmt = (n) => 'C' + String(n).padStart(3, '0');

  if (capMax >= ledMax) {
    console.log(`  [ok]   capsule is current with the ledger (${fmt(ledMax)})`);
    console.log(`         prefix ${prefix} (derived from PROJECT_ID), ledger ${ledMax} / capsule ${capMax}`);
    // Say so when the capsule's highest mention is NOT a ledger row, so a reader
    // can see the band being ignored rather than have to reconstruct why 999
    // did not appear in the number above.
    if (rawMax > capMax) {
      console.log(`         [note] capsule prose reaches ${fmt(rawMax)}, which is not a ledger row; ignored`);
    }
    return 0;
  }

  // Name the specific gap, capped, so the message is a to-do and stays short.
  const missing = [...rows]
    .filter((n) => n > capMax)
    .sort((a, b) => a - b);
  const shown = missing.slice(-8).map(fmt);

  console.error(`  [FAIL] capsule is BEHIND the ledger by ${ledMax - capMax} id(s)`);
  console.error(`         ledger  reaches ${fmt(ledMax)}; capsule reaches ${fmt(capMax)}`);
  console.error(`         not in the capsule: ${shown.join(', ')}${missing.length > 8 ? ` (+${missing.length - 8} more)` : ''}`);
  console.error('         Append a dated entry to docs/MEMORY_CAPSULE.md for the change you just');
  console.error('         recorded. This is not full coverage -- you owe an entry for the work in');
  console.error('         this session, not for the ids that were never written up.');
  return 1;
}

function selftest() {
  const cases = [];
  const ok = (name, cond) => {
    cases.push({ name, pass: !!cond });
    console.log(`  ${cond ? '[ok]  ' : '[FAIL]'}   ${name}`);
  };

  const P = 'WEBSTR001';
  const spanHyphen = `| ${P}-C010 | x | fix | a |\n| ${P}-C011 | x | fix | b |\n| ${P}-C012 | x | fix | c |\n`;

  ok('maxId reads the highest id, not the last one', maxId(`| ${P}-C010 | x |\n| ${P}-C012 | x |`, P) === 12);
  ok('maxId ignores a lower id that appears later', maxId(`${P}-C200 then ${P}-C050`, P) === 200);
  ok('maxId is 0 for a document with no ids', maxId('nothing here', P) === 0);
  ok('a bare C999 with no prefix is not an id', maxId(`see C999`, P) === 0);
  ok('a bare C999 is not an id even next to prose', maxId(`see C999 in passing`, P) === 0);

  // The three span forms this capsule actually uses. If any of these stop
  // parsing, the gate reports the capsule as stale on an entry that names the id.
  ok('span in words: "WEBSTR001-C004 through C006" reads as 6',
    maxId(`## 2026-10-06 -- ${P}-C004 through C006`, P) === 6);
  ok('span as a list: "WEBSTR001-C011 and C012" reads as 12',
    maxId(`## 2026-10-07 -- ${P}-C011 and C012`, P) === 12);
  ok('span with a hyphen: "WEBSTR001-C011-C012" reads as 12',
    maxId(`## ${P}-C011-C012`, P) === 12);
  ok('span with "to": "WEBSTR001-C011 to C012" reads as 12',
    maxId(`${P}-C011 to C012`, P) === 12);
  ok('a repeated prefix in a span is understood', maxId(`${P}-C034-${P}-C040`, P) === 40);

  // The separator must not run away into the next sentence.
  ok('a span does not swallow the following sentence',
    maxId(`${P}-C007\n\nCatalog card redesigned (this machine).`, P) === 7);
  ok('"to" inside a later word is not a span',
    maxId(`${P}-C007\n\nTopics and tables follow.`, P) === 7);
  ok('a far-away bare id is not pulled in by a span',
    maxId(`${P}-C011 and C012. Later: C999 appears.`, P) === 12);

  // The band trap. docs/CHANGES.md:61 reserves the id SPACE in prose, and a
  // prose scan reads that as a real C999 row -- a gate that then fails forever
  // for a reason unrelated to staleness. The ledger is read as rows.
  const ledgerWithBand = `whole \`${P}-C001\`-\`${P}-C999\` space. When a second machine joins, claim a band\n`
    + `| ${P}-C011 | 2026-10-07 | fix | a |\n`
    + `| ${P}-C012 | 2026-10-07 | fix | b |\n`;
  ok('the C001-C999 band declaration does NOT become a ledger row',
    maxRowId(ledgerWithBand, P) === 12);
  ok('...even though a prose scan would have read it as C999',
    maxId(ledgerWithBand, P) === 999);
  ok('a real row IS read: | WEBSTR001-C012 | counts',
    maxRowId(`| ${P}-C012 | 2026-10-07 | fix | x |`, P) === 12);
  ok('an id mentioned in a row DESCRIPTION is not a row',
    maxRowId(`| ${P}-C011 | 2026-10-07 | fix | fixes ${P}-C999 |`, P) === 11);
  ok('rowIds reports only ids that have rows',
    [...rowIds(ledgerWithBand, P)].sort((a, b) => a - b).join(',') === '11,12');

  // The two sides are deliberately read differently.
  ok('the capsule side still reads prose and spans',
    maxId(`### 2026-10-07 -- ${P}-C011 and C012`, P) === 12);

  // The trap this gate actually shipped with. The C013 capsule entry quotes the
  // reserved band to warn about it, which lifted the capsule watermark to 999 and
  // made the gate pass at "999 >= 13" while the ledger head went unmentioned.
  const band = `whole \`${P}-C001\`-\`${P}-C999\` space.`;
  const ledNow = `| ${P}-C012 | d | fix | a |\n| ${P}-C013 | d | fix | b |\n`;
  const capCurrent = `### 2026-10-07 -- ${P}-C013\n\nQuoting the band: \`${P}-C001\`-\`${P}-C999\`.\n`;
  const capStale = `### 2026-10-07 -- ${P}-C012\n\nQuoting the band: \`${P}-C001\`-\`${P}-C999\`.\n`;

  ok('a capsule that quotes the band reaches C013, not C999',
    watermark(capCurrent, ledNow, P).capMax === 13);
  ok('the quotation IS still visible to the parser (so the note can report it)',
    watermark(capCurrent, ledNow, P).rawMax === 999);
  ok('and it is exactly that disagreement the [note] line explains',
    watermark(capCurrent, ledNow, P).rawMax > watermark(capCurrent, ledNow, P).capMax);
  ok('CRITICAL: a capsule that is stale and quotes the band still FAILS',
    watermark(capStale, ledNow, P).capMax === 12
      && watermark(capStale, ledNow, P).capMax < maxRowId(ledNow, P));
  ok('...even though the unfiltered prose max would have passed it',
    watermark(capStale, ledNow, P).rawMax >= maxRowId(ledNow, P));
  ok('a band quote cannot substitute for naming the ledger head',
    watermark(`${band} ${P}-C012`, ledNow, P).capMax < maxRowId(ledNow, P));
  ok('watermark reports the ledger rows for the gap message',
    [...watermark(capCurrent, ledNow, P).rows].sort((a, b) => a - b).join(',') === '12,13');

  // The defect this gate exists for: capsule behind ledger must be detectable.
  const capsuleOld = `### 2026-10-06 -- ${P}-C007\n`;
  const capsuleNew = capsuleOld + `\n### 2026-10-07 -- ${P}-C011 and C012\n`;
  ok('the real quiet-stretch shape is BEHIND and must fail', maxId(capsuleOld, P) < maxId(spanHyphen, P));
  ok('appending the entry for the new work makes it CURRENT', maxId(capsuleNew, P) >= maxId(spanHyphen, P));

  // The check must not demand coverage it never owed.
  ok('it does NOT require every id: a capsule at C007 with the ledger at C012 is one'
    + ' staleness question, not five coverage failures',
    idsIn(spanHyphen, P).size > idsIn(capsuleOld, P).size);

  // Same-day is the common case and the reason dates cannot be used.
  ok('both documents can share a date and still be behind',
    maxId(capsuleOld, P) < maxId(spanHyphen, P));

  // The prefix must be derived, never a literal in this file.
  const self = fs.readFileSync(__filename, 'utf8');
  ok('the prefix is derived from PROJECT_ID, not typed here',
    self.includes('derivedPrefix()') && !/const\s+PREFIX\s*=\s*'/.test(self));
  ok('WEBSTR001 appears only in comments/examples, never as an assigned prefix',
    !/prefix\s*=\s*'WEBSTR001'/.test(self));

  const bad = cases.filter((c) => !c.pass).length;
  console.log('');
  console.log(`check-capsule-staleness selftest: ${cases.length - bad} pass, ${bad} fail`);
  process.exit(bad === 0 ? 0 : 1);
}

if (process.argv.includes('--selftest')) {
  console.log('== Memory-capsule staleness gate :: selftest ==');
  selftest();
} else {
  console.log('== Memory-capsule staleness gate ==');
  process.exit(run());
}
