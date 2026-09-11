#!/usr/bin/env node
/**
 * Query the GA4 Data API using the OAuth refresh token in .ga-creds.json.
 * Free, keyless, dependency-free. Run `node scripts/ga-auth.mjs` once first.
 *
 * Usage:
 *   node scripts/ga-report.mjs realtime            # events in the last 30 min
 *   node scripts/ga-report.mjs events [range]      # event counts
 *   node scripts/ga-report.mjs sources [range]     # sessions + key events by source/medium
 *   node scripts/ga-report.mjs pages [range]       # top pages by views
 * range = 7d (default) | 28d | today | YYYY-MM-DD..YYYY-MM-DD
 */
import { readFile } from 'node:fs/promises';

const CREDS = new URL('../.ga-creds.json', import.meta.url);
const creds = JSON.parse(await readFile(CREDS, 'utf8'));
const propertyId = process.env.GA4_PROPERTY_ID || creds.property_id;
if (!propertyId) { console.error('Set property_id in .ga-creds.json (numeric GA4 property id).'); process.exit(1); }
if (!creds.refresh_token) { console.error('No refresh_token — run: node scripts/ga-auth.mjs'); process.exit(1); }

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

async function api(method, body) {
  const t = await token();
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:${method}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${t}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`${method} ${r.status}: ${JSON.stringify(j).slice(0, 500)}`);
  return j;
}

function range(arg) {
  if (!arg || arg === '7d') return { startDate: '7daysAgo', endDate: 'today' };
  if (arg === '28d') return { startDate: '28daysAgo', endDate: 'today' };
  if (arg === 'today') return { startDate: 'today', endDate: 'today' };
  if (arg.includes('..')) { const [s, e] = arg.split('..'); return { startDate: s, endDate: e }; }
  return { startDate: arg, endDate: 'today' };
}

const rows = (j) => (j.rows || []).map((r) => [
  ...(r.dimensionValues || []).map((d) => d.value),
  ...(r.metricValues || []).map((m) => m.value),
]);
const print = (title, table) => {
  console.log('\n' + title);
  if (!table.length) return console.log('  (no rows)');
  for (const r of table) console.log('  ' + r.join('  ·  '));
};

const cmd = process.argv[2] || 'realtime';
const arg = process.argv[3];

if (cmd === 'realtime') {
  const j = await api('runRealtimeReport', { dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }] });
  print('Realtime events (last 30 min):', rows(j));
} else if (cmd === 'events') {
  const j = await api('runReport', {
    dateRanges: [range(arg)],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
  });
  print(`Events (${range(arg).startDate}→${range(arg).endDate}):`, rows(j));
} else if (cmd === 'sources') {
  const j = await api('runReport', {
    dateRanges: [range(arg)],
    dimensions: [{ name: 'sessionSourceMedium' }],
    metrics: [{ name: 'sessions' }, { name: 'keyEvents' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 15,
  });
  print(`Top sources — sessions · key events (${range(arg).startDate}→${range(arg).endDate}):`, rows(j));
} else if (cmd === 'pages') {
  const j = await api('runReport', {
    dateRanges: [range(arg)],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 20,
  });
  print(`Top pages (${range(arg).startDate}→${range(arg).endDate}):`, rows(j));
} else {
  console.error('Unknown command. Use: realtime | events | sources | pages');
  process.exit(1);
}
