# Module: Technical SEO audit

**Call it when** the user asks for a technical audit, or as part of Track W P1 and the standalone SEO plan.

**Inputs**
- The site URL (D1).
- Search Console (D2) for the Pages, Sitemaps, Core Web Vitals and Crawl stats reports. Optional.

**Scripts**
- `crawl.mjs` → `extract.py` (pages.json)
- Lighthouse mobile
- `ux_check.mjs` (mobile rendering)
- `ai_access.py` (robots groups)
- `schema_check.py` (JSON-LD found in the raw HTML)

**Output**
- `audit/technical-findings.md`: W-records plus a scored summary (see [report.md](report.md) for scoring).

## Rules

- **Deterministic first, judgment second.**
  - A script measures the facts.
  - You decide whether a fact is a problem. For example, `noindex` on a thank-you page is intended, not a defect.
- **"Not checked" is never "passed".** List every check you could not run, with the reason.
- **Bot-blocked responses.** A 403, 429 or WAF challenge is **O-inc**, never a defect (SKILL.md ground rules).

## Checks

### Crawl and index

| Check | Threshold / rule | Source of the fact |
|---|---|---|
| robots.txt reachable | 200 = rules apply. 4xx = Google treats it as no restrictions (except 429). 5xx = Google treats it as "disallow all". A 429 is reported as "not tested" | `curl -sI` |
| Important paths not disallowed | Products, categories, CSS/JS and images must be crawlable | `ai_access.py` + manual read |
| XML sitemap | ≤ 50,000 URLs and ≤ 50 MB uncompressed per file; no index nested in an index; only 200, canonical, indexable URLs; valid W3C `lastmod`; **suspiciously uniform `lastmod`** (most values identical) means the dates are not real | sitemap file + crawl log |
| Sitemap ↔ crawl agreement | URLs in the sitemap that redirect, 404, are noindex or canonicalize elsewhere | crawl log + pages.json |
| Status codes | Internal links to 3xx/4xx; redirect chains > 1 hop; unknown URLs must return a **real 404**, not 200 (soft 404) | crawl + one request to a made-up URL |
| Canonical | Self-canonical on indexable pages; absolute URL; one per page; not pointing to a redirect or noindex page; `og:url` matches the canonical | pages.json |
| Duplicate hosts | http/https, www/non-www, trailing slash, uppercase, parameters, the CMS default subdomain: one canonical host with 301s | `curl -sI` on each variant |
| Pagination | Crawlable `<a href>` per page with a self-canonical. Google has ignored `rel=next/prev` since 2019. Infinite scroll needs paginated URLs behind it | DOM |
| hreflang | Reciprocal, self-referencing, valid codes (`ar-EG`, `en`), plus `x-default`; each target is 200 and canonical | pages.json |

### Rendering

| Check | Rule |
|---|---|
| **Raw vs rendered** | Fetch the raw HTML (`crawl.mjs` file) and the rendered DOM (headless). Flag any difference in title, canonical, meta robots, H1 or JSON-LD. Google can use either version. A `noindex` in the raw HTML may be honored even if JS removes it. Google does not render non-200 pages |
| Critical tags in server HTML | Title, description, canonical, robots, hreflang and Product/Offer JSON-LD must be in the server response, not injected by JS |
| HTML size | Googlebot reads the **first 2 MB** of an HTML file. Inline base64 images or bloated inline CSS/JS can push content and JSON-LD past it |
| Content without JS | Main content and links exist in the raw HTML (also needed by AI agents, see [geo-ai-seo.md](geo-ai-seo.md)) |

### Performance and mobile

- **Core Web Vitals thresholds (Google "good"):**

  | Metric | Good |
  |---|---|
  | LCP | ≤ 2.5 s |
  | CLS | ≤ 0.1 |
  | INP | ≤ 200 ms (INP replaced FID in Mar 2024) |

  Lab data comes from Lighthouse. Field data comes from CrUX or PageSpeed Insights, only when the site has enough traffic. **Always say which one you are reporting.**
- **LCP image:**
  - not lazy-loaded
  - `fetchpriority="high"`
  - served as WebP/AVIF (check the **served** type with a browser `Accept` header, not the file extension)
  - has width/height
  - **Image size bands as a guide:** hero < 200 KB, content < 100 KB, thumbnails < 50 KB
- **Mobile parity:** the same content, title, robots and structured data on mobile and desktop. No intrusive interstitials. No key content that only appears after interaction.
- **Tap targets and viewport:** see `ux_check.mjs`. 24×24 px is the WCAG minimum. 44–48 px is comfort guidance, not a Google rule.

### Security and hygiene (trust, not ranking)

- HTTPS everywhere, a valid certificate, HSTS. HTTPS is a lightweight ranking signal; the security headers (CSP, X-Content-Type-Options, Referrer-Policy) are trust and safety, not ranking. Say so.
- **Back-button hijacking** is in Google's spam policies since April 2026: scripts that break or rewrite the back button, often third-party ad scripts. Treat it as critical.
- **URL hygiene:** lowercase, hyphens, no session IDs, ≤ ~100 characters, no double slashes.
- **IndexNow.** Use it for Bing (and Yandex/Naver) when the platform supports it. Google does not use it.

## What to hand back

- The W-records.
- A table of checks: pass / fail / not checked (with the reason).
- The technical score from [report.md](report.md): health and coverage.

Every fix carries:
- its effort class;
- what it depends on;
- **"How we'd know it failed"**: the metric to watch, e.g. "GSC Pages report: 'Duplicate without user-selected canonical' count does not fall within 4 weeks".

Canonical fixes can take about two weeks to show, so don't call them failed earlier.
