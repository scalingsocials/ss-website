# 12 — Crawl Findings and Rewrite Targets

Screaming Frog crawl of scalingsocials.com, 2 September 2026, merged with 12 months of Google
Search Console data. **45,058 impressions across 23 URLs** are protected by
`redirect-map.csv`.

---

## 1. Three things the crawl found that GSC could not

### 1.1 `/shopify-web-development/` is a live 404 — and the homepage links to it

Your homepage "What We Do" section has a Shopify development card pointing at
`/shopify-web-development/`. That URL returns **404**. It has 251 impressions in GSC, so
Google indexed it before it broke.

Every visitor who clicks Shopify development on your homepage hits a dead page. It is in the
redirect map, so the rebuild fixes it — but it is broken in production right now.

### 1.2 Five pages are orphaned — indexed but linked from nowhere

`/careers/` (2,147 impressions), `/new-terms-conditions/` (246), `/thank_you/` (420),
`/thank-you/` (153), `/category/blog/` (268).

The crawler cannot reach them because nothing on the site links to them. Only the GSC export
found them. This is why both sources were needed — a crawl alone would have dropped 3,234
impressions from the redirect map.

`/careers/` is the notable one. 2,147 impressions and 77 clicks, and no internal link anywhere.

### 1.3 LiteSpeed Cache is running alongside Elementor

Seventeen of the 34 crawled URLs are LiteSpeed-generated CSS files. Combined with Elementor
3.22 that is a lot of moving parts, and it explains some of the render behaviour in the audit.
Irrelevant after migration — noted so nobody wastes time tuning it.

---

## 2. Meta descriptions: 2 of 23 pages have one

| Page | Meta description |
|---|---|
| `/performance-marketing-agency-bangalore/` | 148 chars — the only correct one on the site |
| `/shopify-development-company-bangalore/` | 174 chars — over the 158 limit, will truncate |
| **Everything else** | **Empty** |

Google is auto-generating snippets for 21 pages, which is why the homepage share preview reads
`"...Precision-targeted ads for instant visibility and maximum … Home Read More »"`.

The Meta component fails the build on a missing or duplicate description. This gets fixed by
construction.

---

## 3. H1 problems

| Page | Current H1 | Problem |
|---|---|---|
| `/about-us/` | *(none)* | 7,670 impressions and no H1 at all |
| `/₹1-million-in-90-days/` | *(none)* | No H1 |
| `/₹1-4-million-in-3-months/` | *(none)* | No H1, 1,490 impressions |
| `/₹44-3-million-in-90-days/` | *(none)* | No H1 |
| `/new-privacy-policy/` | Ready to Transform Your Online Store? | CTA band rendering as the H1 |
| `/new-disclaimer/` | Ready to Transform Your Online Store? | Same, identical across three pages |
| `/terms-and-conditions/` | Ready to Transform Your Online Store? | Same |
| `/web-development/` | Our Services | Generic, no keyword, 2,428 impressions |
| `/social-media-handling/` | Elevate Your Brand With | Truncated mid-sentence |
| `/seo/` | Our SEO Services | Weak, and the H1 is rendered as an `<h2>` |
| `/` | Unleash Your Brand's Potential with Scaling Socials! | Brand fluff, targets nothing |

Four pages with no H1, three pages sharing a CTA as their H1. `check:perf` fails the build on
anything other than exactly one `<h1>` per page.

---

## 4. Title rewrites — priority order by impressions

Locked targets for the rebuild. 50–60 characters, primary keyword first, brand last.

| Page | New title | Chars |
|---|---|---|
| `/` | `Performance Marketing & Shopify Agency in Bangalore \| Scaling Socials` | 68 → trim brand to `\| Scaling Socials` and shorten to fit 60 |
| `/about/` | `About Scaling Socials \| D2C Growth Agency in Bengaluru` | 53 |
| `/contact/` | `Contact Scaling Socials \| Bengaluru Marketing Agency` | 51 |
| `/performance-marketing-agency-bangalore/` | `Performance Marketing Agency in Bangalore \| Scaling Socials` | 58 |
| `/web-development-company-bangalore/` | `Web Development Company in Bangalore \| Scaling Socials` | 54 |
| `/social-media-marketing-agency-bangalore/` | `Social Media Marketing Agency Bangalore \| Scaling Socials` | 57 |
| `/seo-agency-bangalore/` | `SEO Agency in Bangalore for D2C Brands \| Scaling Socials` | 56 |
| `/shopify-development-company-bangalore/` | `Shopify Development Company in Bangalore \| Scaling Socials` | 58 |
| `/team/` | `Our Team \| Scaling Socials, Bengaluru` | 37 |
| `/audit/` | `Free Meta & Google Ads Audit \| Scaling Socials` | 46 |

Current homepage title is `Home - Scaling Socials`. That is 22 characters of nothing on the
most authoritative page you own.

---

## 5. What the redirect map protects

| Band | URLs | Impressions |
|---|---|---|
| Over 2,000 | 6 | 32,527 |
| 250–2,000 | 8 | 6,373 |
| Under 250 | 9 | 6,158 |
| **Total** | **23** | **45,058** |

The top six URLs carry 72% of it. If the map is only partially validated at cutover, validate
those six first: `/`, `/about-us/`, `/contact-us/`,
`/performance-marketing-agency-bangalore/`, `/web-development/`, `/performance-marketing/`.

---

## 6. Excluded from the map, deliberately

- **17 LiteSpeed CSS files** under `/wp-content/litespeed/css/`. Build artefacts of the old
  stack. They disappear with WordPress and need no redirect.
- **`/wp-content/uploads/*`** — not in this crawl, but if any image URLs have inbound links,
  add them. Check GSC → Performance → Search type: Image before cutover.

---

## 7. Pre-cutover validation

```bash
# every source in the map must resolve to a live 200 on the new site
while IFS=, read -r old new status rest; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -L "https://scalingsocials.com${new}")
  [ "$code" != "200" ] && echo "FAIL $old -> $new ($code)"
done < <(tail -n +2 docs/spec/redirect-map.csv)
```

Run against the preview URL before DNS, then against production immediately after. Zero
failures is the hold condition.
