#!/usr/bin/env node
// Allocate the next change id for this project, safely.
//
// WHY THIS EXISTS
// ---------------
// docs/CHANGES.md tells operators to allocate with `npm run id:next`, but the
// script did not exist -- the ledger could only be advanced by reading the last
// number and adding one by hand. That is the same read-then-write race the
// multi-machine projects hit (three collisions in blogger-llianmeva-template),
// and it is exactly the operation that belongs in a tool.
//
// This project is single-machine (no docs/id-bands.json), so this is the short
// form: read the max C-number in the LOCAL ledger and in origin/main, take the
// successor, and say which side supplied it. It prints the id; it does not
// write the row -- the row is a judgement, an id is only a promise once
// something real is written under it.

'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LEDGER = path.join(ROOT, 'docs', 'CHANGES.md');
const PROJECT_ID_FILE = path.join(ROOT, 'PROJECT_ID');
const QUIET = { stdio: ['ignore', 'pipe', 'pipe'] };

function prefix() {
  const id = fs.readFileSync(PROJECT_ID_FILE, 'utf8').trim();
  // PREFIX = ProjectID with its dashes removed (derived, never typed).
  return id.replace(/-/g, '') + '-C';
}

function maxIn(text, pre) {
  let max = 0;
  // Ledger rows are table rows: `| WEBSTR001-C001 | 2026-10-06 | ...`. Matching
  // only row shape stops the "C001-C999 space" prose in the band note from
  // being read as an allocated id (it would otherwise push the counter to 1000).
  for (const m of text.matchAll(new RegExp(`\\|\\s*${pre}(\\d+)\\s*\\|`, 'g'))) {
    max = Math.max(max, Number(m[1]));
  }
  return max;
}

const pre = prefix();
const local = maxIn(fs.readFileSync(LEDGER, 'utf8'), pre);

let remote = 0;
let remoteNote = 'origin unreachable -- allocating from local only';
try {
  execFileSync('git', ['fetch', 'origin', '--quiet'], QUIET);
  const remoteLedger = execFileSync('git', ['show', 'origin/main:docs/CHANGES.md'], QUIET).toString('utf8');
  remote = maxIn(remoteLedger, pre);
  remoteNote = remote > local ? 'origin is ahead -- allocating from origin' : 'local is ahead or equal';
} catch {
  // no remote is fine for a fresh project; the tool still answers
}

const next = Math.max(local, remote) + 1;
console.log(`${pre}${String(next).padStart(3, '0')}`);
console.error(`(local max ${local}, origin max ${remote}: ${remoteNote})`);
