# Deploy runbook — Cloudflare Pages

_Last updated 2026-09-04. Decision (PENDING-WORK §A1): **deploy to Cloudflare Pages.**_

This is the step-by-step for taking the repo live. You can complete steps 1–4 now
and work on the free `*.pages.dev` URL for as long as you like; the live domain
(`scalingsocials.com`) is untouched until step 5.

## Why this setup fits the repo

- `astro.config.mjs` already uses `output: 'static'` + `adapter: @astrojs/cloudflare`.
  Astro emits static pages **plus** a `dist/_worker.js` for the one on-demand route
  (`/api/lead`). Cloudflare Pages auto-detects `_worker.js` and runs it — no rewrite.
- `imageService: 'compile'` means images are processed at build time, so there's no
  runtime image binding to configure.
- Secrets (Supabase service key, Turnstile, Resend) live in the Pages project env,
  never in the repo (CLAUDE.md §17).

---

## Step 1 — Create the Pages project (Git integration)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the repo **`scalingsocials/ss-website`**, production branch **`main`**.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (the repo root *is* the Astro app)
4. Save and deploy. You get a permanent URL like **`ss-website.pages.dev`**, and every
   push/branch gets its own preview URL. Build, review and test there freely.

> The build runs `astro build`, then Pagefind (search index) and the llms.txt
> generator — all npm deps, so they run fine on Cloudflare's build image.

## Step 2 — Runtime settings (do this once, or the function 500s)

In **Settings → Functions** (a.k.a. Runtime):

- **Compatibility flag:** add `nodejs_compat` (the Cloudflare adapter needs Node APIs).
- **Compatibility date:** set a recent date, e.g. `2024-11-01` or later.
- **Node version for builds:** add an env var **`NODE_VERSION = 20`** (or 22). There's
  no `.nvmrc` in the repo, and Astro 5 needs Node ≥ 18.20; pin it so builds are stable.

Set the compatibility flag for **both Production and Preview** environments.

## Step 3 — Environment variables / secrets

In **Settings → Environment variables**, add these (mark the keys as **encrypted /
Secret**). Set them on **Production**; optionally add a separate test set on **Preview**.

These are the **exact names `src/pages/api/lead.ts` reads**. Every one of them is
read through an `if (… && env.X)` guard, so a missing value produces **no error,
no log and no retry** — the feature just silently does nothing. Check this table
against the Cloudflare dashboard before cutover; a typo here is invisible.

| Variable | Required? | What breaks if it is missing |
|---|---|---|
| `SUPABASE_URL` | **Yes** | No lead is stored. |
| `SUPABASE_SERVICE_KEY` | **Yes** | No lead is stored. Service-role key — server-only, never in the client. |
| `RESEND_API_KEY` | **Yes** | No alert email. With Supabase also missing, `/api/lead` returns 503 and the visitor is told the enquiry failed (by design — see below). |
| `TURNSTILE_SECRET_KEY` | Recommended | Spam protection is skipped entirely; leads still store. |
| `GA4_MP_API_SECRET` | **Yes, for conversions** | The server-side `generate_lead` never fires. GA4 records no conversions at all, so Google Ads has nothing to optimise against. |
| `META_CAPI_TOKEN` | **Yes, for conversions** | The Conversions API `Lead` never fires. Only the browser Pixel reports, so iOS/ad-blocked conversions are lost. |
| `META_TEST_EVENT_CODE` | **Must be UNSET in Production** | If left set from testing, every live Meta conversion is routed to Events Manager → Test Events and **reports nothing**. |
| `GA4_MEASUREMENT_ID` | Optional | Defaults to the public `G-DQH1656N5W` in code. |
| `META_PIXEL_ID` | Optional | Defaults to the public `2381316206031576` in code. |
| `LEAD_ALERT_FROM` / `LEAD_ALERT_TO` | Optional | Default to `leads@scalingsocials.com` → `support@scalingsocials.com`. |

The Turnstile **site** key is public and hardcoded in `src/components/blocks/LeadForm.astro`
(`data-sitekey`). There is no `PUBLIC_TURNSTILE_SITE_KEY` env var — earlier revisions
of this document listed one and nothing reads it.

**Code gotcha:** on the Cloudflare adapter, runtime secrets are **not** on
`process.env`. `/api/lead.ts` reads them from the request context
(`context.locals.runtime.env.SUPABASE_SERVICE_KEY`); `import.meta.env` only holds
build-time/`PUBLIC_` values. This is already implemented — the endpoint does the
Supabase upsert, the Resend alert, the GA4 Measurement Protocol hit and the Meta
CAPI hit.

**Deliberate behaviour to know about before you test:** a completed enquiry that
reaches **neither** the store **nor** the inbox returns **503**, and the visitor
sees an error instead of `/thank-you/`. That is intentional. It replaced a silent
`200 {"ok":true}` that redirected people to the thank-you page while the lead was
discarded. If you see 503s after deploying, the env table above is wrong — do not
"fix" it by restoring the silent success.

## Step 4 — Keep the staging URL private (so it can't be indexed)

The `*.pages.dev` URL is public by default, and a repo `_headers` noindex would also
hit the real domain later — so don't use that. Instead, lock the preview with
**Cloudflare Access** (free, and it makes indexing impossible because the page is
behind a login):

1. **Settings → General → Access policy** on the Pages project (or Zero Trust →
   Access → add the `*.pages.dev` hostname).
2. Add a policy allowing **your team's emails** (email one-time-PIN is easiest).
3. Now the preview asks for a login; Google can't crawl it, and neither can anyone
   you haven't invited.

Belt-and-suspenders: every page already emits a canonical pointing at
`scalingsocials.com`, so even a leaked preview URL wouldn't compete. When you go
live you can keep Access on the `.pages.dev` hostname and remove it from the custom
domain.

---

## Step 5 — Go live (only when the §A blockers are cleared)

### 5a. Add the custom domain
Pages project → **Custom domains → Set up a domain → `scalingsocials.com`** (add
`www.scalingsocials.com` too). Cloudflare shows the DNS record it needs.

### 5b. DNS — two paths
- **Move DNS to Cloudflare (recommended).** Add the site in Cloudflare, change the
  nameservers at your registrar/Hostinger. Pages then wires the record automatically,
  and you also get edge redirects, security headers and analytics in one place.
- **Keep DNS at Hostinger.** Add the CNAME target Cloudflare gives you (apex uses
  CNAME flattening / the ALIAS record Hostinger provides). Slightly more manual; no
  edge rules.

### 5c. Non-www canonical + www → apex 301
`astro.config` sets non-www as canonical. Enforce it with a redirect that works on
either DNS path — add `public/_redirects`:

```
https://www.scalingsocials.com/*  https://scalingsocials.com/:splat  301
```

(If DNS is on Cloudflare you can instead use a Redirect Rule in the dashboard.)

### 5d. Old-site 301s
Add the WordPress → new-site redirect map to the same `public/_redirects`, built from
`docs/reference/screaming-frog-crawl-2026-09-02.csv` + `docs/spec/redirect-map.csv`
(PENDING §D). Every indexed old URL must land on a live 200, no chains.

---

## Step 6 — Right after launch (verification, PENDING §D/§F)

- **Search Console:** add `scalingsocials.com`, submit `sitemap-index.xml`.
- **Rich Results Test:** confirm the JSON-LD `@graph` is eligible on 2–3 live URLs.
- **Core Web Vitals:** run PageSpeed Insights on mobile + desktop; record real LCP,
  INP, CLS, FCP, TTFB (replaces the "cannot score" note in the audit).
- Confirm the `.pages.dev` staging URL is still Access-locked / not indexed.
- Spot-check `/api/lead`: submit a real test lead and confirm it lands in Supabase
  and the emails send.

## Rollback

Cloudflare Pages keeps every deployment. If a launch build misbehaves, use
**Deployments → (a previous good build) → Rollback** for an instant revert. DNS
stays pointed at Pages; only the served build changes.

---

_Cross-refs: PENDING-WORK §A (go-live blockers), §D (launch-gate infra), §E (old-site
cleanup). Secrets policy: CLAUDE.md §17._
