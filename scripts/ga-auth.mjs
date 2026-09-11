#!/usr/bin/env node
/**
 * One-time GA4 OAuth (keyless — works under the org policy that blocks
 * service-account key downloads). Reads client_id/client_secret from
 * .ga-creds.json, runs a localhost loopback consent flow, and writes the
 * long-lived refresh_token back into that file. Dependency-free.
 *
 * Setup before running:
 *   1. Google Cloud → APIs & Services → Credentials → Create OAuth client ID →
 *      Application type: Desktop app. Copy the Client ID + Client secret.
 *   2. Put them in .ga-creds.json (client_id, client_secret) — this file is
 *      gitignored; never commit it.
 *   3. Ensure the Google Analytics Data API is enabled and your Google account
 *      has at least Viewer on the GA4 property.
 * Then: node scripts/ga-auth.mjs   → approve in the browser when prompted.
 */
import { readFile, writeFile } from 'node:fs/promises';
import http from 'node:http';

const CREDS = new URL('../.ga-creds.json', import.meta.url);
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const PORT = 5858;
const REDIRECT = `http://localhost:${PORT}`;

const creds = JSON.parse(await readFile(CREDS, 'utf8'));
if (!creds.client_id || !creds.client_secret) {
  console.error('Fill client_id and client_secret in .ga-creds.json first.');
  process.exit(1);
}

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: creds.client_id,
    redirect_uri: REDIRECT,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  });

console.log('\nOpen this URL in your browser and approve access:\n\n' + authUrl + '\n');

const code = await new Promise((resolve, reject) => {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, REDIRECT);
    const c = u.searchParams.get('code');
    const err = u.searchParams.get('error');
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('<h2>' + (c ? 'Done — close this tab and return to the terminal.' : 'Failed: ' + err) + '</h2>');
    server.close();
    c ? resolve(c) : reject(new Error(err || 'no code'));
  });
  server.on('error', reject);
  server.listen(PORT, () => console.log(`Waiting for approval on ${REDIRECT} …`));
});

const res = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    code,
    client_id: creds.client_id,
    client_secret: creds.client_secret,
    redirect_uri: REDIRECT,
    grant_type: 'authorization_code',
  }),
});
const tok = await res.json();
if (!tok.refresh_token) {
  console.error('No refresh_token returned:', JSON.stringify(tok));
  process.exit(1);
}
creds.refresh_token = tok.refresh_token;
await writeFile(CREDS, JSON.stringify(creds, null, 2) + '\n');
console.log('\n✓ Saved refresh_token to .ga-creds.json. Now run: node scripts/ga-report.mjs realtime');
