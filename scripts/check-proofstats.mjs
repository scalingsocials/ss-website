#!/usr/bin/env node
/**
 * check:stats — the proof-stat drift gate.
 *
 * The aggregate proof numbers (managed ad spend, brand counts) live ONLY in
 * src/data/proofStats.ts. This gate fails the build if a hardcoded crore/Cr
 * AD-SPEND figure, or an "N+ brands" string, appears anywhere else — which is
 * how those numbers used to drift between pages (₹10.4 Cr vs ₹10 Cr+, 100+ vs
 * 400+ brands) and quietly destroy their own credibility.
 *
 * Precise by design: it targets the AGGREGATE stats, not every rupee figure.
 * Per-account case-study results (₹1.19 Cr revenue, the ₹2.77 Cr documented
 * across the case studies, ₹1 crore revenue bands in a form) are legitimate and
 * are NOT flagged — the ad-spend pattern requires an "ad spend" context, and the
 * brand pattern requires the literal word "brands".
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'src';
const ALLOW = new Set(['src/data/proofStats.ts'.replace(/\//g, sepAware())]);

function sepAware() { return process.platform === 'win32' ? '\\' : '/'; }

const RULES = [
  {
    id: 'brand-count',
    // "400+ brands", "100+ D2C brands", "150+ ecommerce brands"
    re: /\b\d{2,3}\+\s*(?:D2C\s+|ecommerce\s+|D2C and ecommerce\s+)?brands\b/i,
    msg: 'hardcoded "N+ brands" figure — import brandsServed/brandsPast10L/brandsPast1Cr from src/data/proofStats.ts',
  },
  {
    id: 'ad-spend-crore',
    // "₹10 Cr+ ad spend", "₹10 crore+ in Meta ad spend", "₹5 crore Google ad spend"
    re: /₹\s?\d{1,3}(?:[.,]\d+)?\s?(?:Cr|crore)s?\+?\s*(?:in\s+)?(?:Meta\s+|Google\s+)?ad[\s-]?spend/i,
    msg: 'hardcoded crore/Cr ad-spend figure — import adSpendManaged from src/data/proofStats.ts (no channel-specific spend figures)',
  },
  {
    id: 'retired-spend',
    // the retired all-channel figure, in any phrasing
    re: /₹\s?10\.4\s?Cr\b/i,
    msg: 'retired ₹10.4 Cr all-channel figure — the site-wide stat is adSpendManaged (₹10 Cr+) in src/data/proofStats.ts',
  },
];

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(astro|ts|tsx|mdx)$/.test(e)) files.push(p);
  }
})(ROOT);

const violations = [];
for (const f of files) {
  const rel = relative('.', f);
  if (ALLOW.has(rel)) continue;
  const lines = readFileSync(f, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      const m = line.match(rule.re);
      if (m) violations.push({ rel, line: i + 1, id: rule.id, text: m[0].trim(), msg: rule.msg });
    }
  });
}

if (violations.length) {
  console.error(`check:stats FAILED — ${violations.length} hardcoded proof figure(s) outside src/data/proofStats.ts:\n`);
  for (const v of violations) {
    console.error(`  ${v.rel}:${v.line}  [${v.id}] "${v.text}"`);
    console.error(`      → ${v.msg}`);
  }
  process.exit(1);
}
console.log(`check:stats passed — no hardcoded proof figures outside proofStats.ts (${files.length} files scanned).`);
