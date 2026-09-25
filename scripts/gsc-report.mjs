#!/usr/bin/env node
/**
 * Query Google Search Console with the OAuth token in .ga-creds.json (the same
 * one ga-report.mjs uses — run `node scripts/ga-auth.mjs` once to grant the
 * webmasters.readonly scope as well). Free, keyless, dependency-free.
 *
 * Usage:
 *   node scripts/gsc-report.mjs totals [range]   # clicks/impr/CTR/position
 *   node scripts/gsc-report.mjs queries [range]  # top queries
 *   node scripts/gsc-report.mjs pages [range]    # top pages
 *   node scripts/gsc-report.mjs days [range]     # day by day
 *   node scripts/gsc-report.mjs compare A..B C..D   # two windows side by side
 * range = 7d | 28d (default) | 90d | YYYY-MM-DD..YYYY-MM-DD
 *
 * Replaces the Supermetrics connector for this site: that trial expired on
 * 2026-09-16, and the GSC baseline in docs/baseline/ came from it.
 *
 * NOTE ON DATES: GSC lags 2-3 days. A window ending today will look weak simply
 * because the last days are incomplete — compare like-for-like windows.
 */
import { readFile } from 'node:fs/promises';

const SITE = 'https://scalingsocials.com/'; // URL-prefix property, as verified
const creds = JSON.parse(await readFile(new URL('../.ga-creds.json', import.meta.url), 'utf8'));

async function token() {
  const r = await (await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      refresh_token: creds.refresh_token,
      grant_type: 'refresh_token',
    }),
  })).json();
  if (!r.access_token) throw new Error('token: ' + JSON.stringify(r));
  return r.access_token;
}

const iso = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => iso(new Date(Date.now() - n * 864e5));

function range(arg = '28d') {
  if (arg.includes('..')) { const [s, e] = arg.split('..'); return { startDate: s, endDate: e }; }
  const n = { '7d': 7, '28d': 28, '90d': 90 }[arg];
  if (!n) throw new Error(`Unknown range "${arg}" — use 7d, 28d, 90d or YYYY-MM-DD..YYYY-MM-DD`);
  return { startDate: daysAgo(n), endDate: daysAgo(1) };
}

async function query(body) {
  const t = await token();
  const r = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    { method: 'POST', headers: { authorization: `Bearer ${t}`, 'content-type': 'application/json' }, body: JSON.stringify(body) }
  );
  const j = await r.json();
  if (!r.ok) throw new Error(`${r.status}: ${JSON.stringify(j).slice(0, 400)}`);
  return j.rows ?? [];
}

const fmt = (row) =>
  `${String(row.clicks).padStart(5)} clicks · ${String(row.impressions).padStart(6)} impr · ` +
  `${(row.ctr * 100).toFixed(2)}% CTR · pos ${row.position.toFixed(1)}`;

const totals = async (r) => (await query({ ...r, dimensions: [] }))[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };

const cmd = process.argv[2] || 'totals';
const arg = process.argv[3];

if (cmd === 'totals') {
  const r = range(arg);
  console.log(`\n${r.startDate} → ${r.endDate}\n  ${fmt(await totals(r))}`);
} else if (cmd === 'compare') {
  const [a, b] = [range(process.argv[3]), range(process.argv[4])];
  const [ra, rb] = [await totals(a), await totals(b)];
  console.log(`\n${a.startDate} → ${a.endDate}\n  ${fmt(ra)}`);
  console.log(`${b.startDate} → ${b.endDate}\n  ${fmt(rb)}`);
  const pc = (x, y) => (y === 0 ? 'n/a' : `${(((x - y) / y) * 100).toFixed(0)}%`);
  console.log(`\nchange: clicks ${pc(ra.clicks, rb.clicks)} · impressions ${pc(ra.impressions, rb.impressions)} · position ${(ra.position - rb.position).toFixed(1)}`);
} else if (cmd === 'queries' || cmd === 'pages' || cmd === 'days') {
  const dim = { queries: 'query', pages: 'page', days: 'date' }[cmd];
  const r = range(arg);
  const rows = await query({ ...r, dimensions: [dim], rowLimit: cmd === 'days' ? 100 : 25 });
  console.log(`\n${cmd} (${r.startDate} → ${r.endDate}):`);
  for (const row of rows) console.log(`  ${row.keys[0].padEnd(cmd === 'pages' ? 60 : 45)} ${fmt(row)}`);
  if (!rows.length) console.log('  (no rows)');
} else {
  console.error('Use: totals | queries | pages | days | compare A..B C..D');
  process.exit(1);
}
