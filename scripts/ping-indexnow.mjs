#!/usr/bin/env node
/**
 * Tell IndexNow (Bing, Yandex, Naver, Seznam — not Google) that pages changed.
 *
 *   npm run indexnow                  # every URL in the built sitemap
 *   npm run indexnow -- /audit/ /work/   # just these paths
 *
 * Run it AFTER Cloudflare has finished deploying, never as part of `build`:
 * the engines fetch each URL on notification, and a build-time ping would point
 * them at the version that is still live.
 *
 * The key is the filename of public/<key>.txt, which is also the keyLocation the
 * API verifies — so rotating the key means dropping in a new file, nothing else.
 * Search Console covers Google; Google has never joined IndexNow.
 */
import { readFile, readdir } from 'node:fs/promises';

const SITE = 'https://scalingsocials.com';
const HOST = new URL(SITE).host;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

const keyFile = (await readdir('public')).find((f) => /^[0-9a-f]{8,128}\.txt$/i.test(f));
if (!keyFile) {
  console.error('No IndexNow key file in public/ (expected <32-hex>.txt). Generate one in Bing Webmaster Tools → IndexNow.');
  process.exit(1);
}
const key = (await readFile(`public/${keyFile}`, 'utf8')).trim();
const keyLocation = `${SITE}/${keyFile}`;

const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const urlList = args.length
  ? args.map((p) => (p.startsWith('http') ? p : new URL(p, SITE + '/').href))
  : [...(await readFile('dist/sitemap-0.xml', 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!urlList.length) {
  console.error('No URLs to submit (build first, or pass paths).');
  process.exit(1);
}
if (urlList.length > 10000) {
  console.error(`IndexNow accepts 10,000 URLs per request; got ${urlList.length}.`);
  process.exit(1);
}

// The key file must be reachable, or every submission is rejected as unverified.
const probe = await fetch(keyLocation);
const probeBody = probe.ok ? (await probe.text()).trim() : '';
if (!probe.ok || probeBody !== key) {
  console.error(`Key file check FAILED: ${keyLocation} → HTTP ${probe.status}${probe.ok ? `, body "${probeBody.slice(0, 40)}" ≠ key` : ''}`);
  console.error('Deploy the key file first, then run this again.');
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
});
// 200 = accepted, 202 = accepted but the key is still being validated. Both fine.
if (res.status !== 200 && res.status !== 202) {
  console.error(`IndexNow returned HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
console.log(`IndexNow: submitted ${urlList.length} URL(s) — HTTP ${res.status}${res.status === 202 ? ' (key pending validation)' : ''}`);
