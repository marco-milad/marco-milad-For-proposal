# Comprehensive SEO optimization plan

A topic-by-topic checklist so no SEO area is forgotten. For each topic it says:
- **Check:** how to audit it, which tool, which evidence label applies.
- **Plan:** what goes into the proposal or action plan.
- **Needs from user:** data only the user or the client can provide. **"None"** means you can do it from public data alone.
- **If missing:** how to proceed honestly without it.

**Deep-dive modules** (each can be run on its own, by name):

| Module | File |
|---|---|
| Technical audit | [modules/technical-seo.md](modules/technical-seo.md) |
| Schema | [modules/schema.md](modules/schema.md) |
| GEO / AEO / AI SEO | [modules/geo-ai-seo.md](modules/geo-ai-seo.md) |
| E-E-A-T and content | [modules/eeat-content.md](modules/eeat-content.md) |
| Local SEO | [modules/local-seo.md](modules/local-seo.md) |
| Backlinks | [modules/backlinks.md](modules/backlinks.md) |
| CRO and tracking | [modules/cro.md](modules/cro.md) |
| Scoring and the PDF report | [modules/report.md](modules/report.md) |

This file stays the overview and the batch data request; the modules hold the detailed checks.

Use it in two ways:
- **Inside Track W.** It feeds P1 (audit), P2 (keyword map and the off-page/local checklist) and the P5 pages "Technical SEO foundation", "Content, knowledge hub & local SEO" and "Monthly SEO plan".
- **Standalone.** For an SEO plan on an existing site with no redesign, run S1 → S2 below and skip the platform and prototype phases.

Every rule in SKILL.md and evidence-and-qa.md still applies: no ranking promises, no traffic forecasts, no search volumes without a cited tool.

## Order of work

Fix in this order. Each layer depends on the one before it:

1. **Technical:** can Google crawl, render and index the site?
2. **On-page:** does each page clearly target one query?
3. **Local:** for businesses with a physical location or service area.
4. **Content, AEO and GEO:** answer the questions buyers ask.
5. **Off-page:** earn mentions and links.

Measurement runs through all five.

## Collect the data first: one batch request

Send this to the user **in one message** at the start, in their language. Label each item **Blocking** (the topic can't be done without it) or **Strengthens** (the topic is done with public data, but this makes it better). Never stall the plan waiting for one item.

| # | Data / access | Feeds topics | Type | If missing |
|---|---|---|---|---|
| D1 | Website URL + the market (countries/cities) and languages | Everything | Blocking | — |
| D2 | **Google Search Console** access (a restricted user is enough) | Indexing, queries, CTR, Core Web Vitals field data, links, the **Generative AI performance report** (AI Overviews/AI Mode) and the **"Search generative AI" control** setting | Strengthens | Lab data only; no query, click or ranking numbers; "baseline set in discovery" |
| D3 | **GA4** access (viewer) | Organic traffic and conversions baseline, landing pages | Strengthens | No traffic or conversion numbers anywhere |
| D4 | **Ahrefs / Semrush** (or similar) access | Search volume, keyword difficulty, backlink profile, competitor gaps | Strengthens | Keywords prioritized by relevance (labelled as such); backlinks from GSC "Links" + Bing Webmaster Tools if verified; no volumes or DR figures |
| D5 | **Keyword map**: primary keyword per URL (`url,keyword` CSV), or approval of the P2 map | Title, H1, keyword placement, cannibalization | Blocking for placement checks | Build it in P2 first; placement is checked after Gate B |
| D6 | **Google Business Profile** link + manager access | GBP audit, reviews, categories, NAP | Blocking for GBP optimization | GBP section becomes a discovery item; NAP check uses the website only |
| D7 | **Official NAP**: legal/brand name, address per branch, phone(s), WhatsApp, working hours, map pin | NAP consistency, LocalBusiness schema, contact page | Blocking for local SEO | Local section = discovery questions |
| D8 | List of existing directory / marketplace / social listings the client knows about, with logins if they want them corrected | Local listings cleanup, sameAs | Strengthens | We list what we find publicly as "candidate" |
| D9 | Brand assets for off-page: real case studies, partner/supplier relationships, associations, events, press mentions | Backlink building, digital PR, guest posting | Strengthens | Off-page plan stays generic (method only, no named targets) |
| D10 | Who can write or approve content (subject-matter expert, language), and the publishing frequency the client can sustain | Content plan, guest posts, forum participation, AEO/GEO | Strengthens | Plan shows the method and an illustrative cadence, not a commitment |
| D11 | Hosting/CMS access or the developer's contact | Fixing speed, redirects, robots, sitemap, schema | Blocking for implementation (not for the plan) | Plan lists fixes with effort class; implementation waits |
| D12 | Real product/service photos (originals, not compressed) | Image alt text, image SEO, speed | Strengthens | Use existing images; flag stock images |
| D13 | Any past SEO work: previous agency reports, disavow file, manual actions, a domain or URL change history | Risk check, link cleanup, migration | Strengthens | Noted as "not verified" |

## 1. Technical SEO

| Topic | Check | Plan | Needs from user | If missing |
|---|---|---|---|---|
| **Site speed** | Lighthouse mobile (lab) on home, category, product, contact. From the raw JSON: Performance, LCP element, total weight, render-blocking time, unused CSS/JS, image formats | Fixes ranked by impact on LCP: hero image priority (no lazy-loading above the fold), WebP/AVIF with sizes, defer non-critical JS/CSS, caching/CDN, fonts | None for the audit. D11 to implement | — |
| **Core Web Vitals** | Lab: LCP, CLS, TBT as a proxy for INP. Field: GSC Core Web Vitals report or CrUX, only if the site has enough traffic. Thresholds: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms. INP replaced FID in March 2024 | Same fixes, plus a before/after measurement plan using the same tool | D2 for field data | Report lab data only and say so ("lab, not real visitors") |
| **Mobile friendliness** | Lighthouse mobile, screenshots at 390 px, horizontal overflow (`shot.mjs`), tap target size, font size, viewport meta. Google retired its Mobile-Friendly Test in Dec 2023, so don't cite it | Mobile-first templates; fixes per finding | None | — |
| **Sitemap.xml & robots.txt** | Fetch both. Sitemap: only 200, canonical, indexable URLs? Includes thin, duplicate or redirected URLs? `lastmod` sane? Robots: blocks anything that should rank? References the sitemap? | Dynamic sitemap (per language), robots rules, submission in GSC and Bing | D2 to submit and read the Pages report | Plan only; submission happens after access |
| **Canonical URLs** | `extract.py` canonical columns: self-canonical, missing, pointing elsewhere, conflicting with hreflang or redirects. Also check duplicate hosts (http/https, www/non-www, a CMS default subdomain, trailing slash, parameters) | One canonical host via 301; self-canonical on every indexable page; parameter handling | None | — |
| **Indexing & crawl** *(beyond the mind map)* | noindex pages, non-200 in sitemap, redirect chains, 404s linked internally, soft-404 thin pages, HTTPS | Clean-up list; 301 map for anything moved | D2 for the Pages/indexing report | Crawl-based indicators only |
| **Structured data** *(beyond the mind map)* | `extract.py` JSON-LD types per template; validate with Google's Rich Results Test manually (the user runs it, no upload of client files) | Schema per template: Organization + WebSite, BreadcrumbList, Product/Service, Article, LocalBusiness. Check Google's current support first (modules/schema.md); FAQ rich results and the sitelinks search box are retired | D7 for LocalBusiness | Organization only, with fields from the site |
| **Multilingual / hreflang** *(beyond the mind map)* | `hreflang` present, reciprocal, matching canonicals; `lang`/`dir` attributes; real Arabic content vs machine-translated stubs | URL policy (e.g. `/ar/`), reciprocal hreflang, x-default | None | — |

## 2. On-page SEO

Run `scripts/extract.py`, then `scripts/keyword_check.py` once the keyword map (D5) exists.

| Topic | Check | Plan | Needs from user | If missing |
|---|---|---|---|---|
| **Title tags** | Missing, duplicated, > 60 chars, the CMS default suffix, the keyword near the start (`keyword_check.py` title column) | Title pattern per template: `{primary keyword} – {differentiator} \| {brand}` | D5 | Pattern only, with examples on 3 pages |
| **Meta descriptions** | Missing, < 70 or > 160 chars, duplicated, mentions the CMS, contains the keyword | One unique description per page with the keyword + a reason to click + a CTA. Google may rewrite it; it affects clicks, not ranking | D5 | Pattern + the top 20 pages written as samples |
| **Header tags (H1, H2…)** | H1 count (0 / >1 / empty), H1 vs title alignment, H3 without H2, headings used for styling | One H1 per page with the primary keyword; H2s for sub-topics and questions (AEO) | D5 | — |
| **Keyword placement** | `keyword_check.py`: title, H1, description, first 100 words, URL slug, H2, image alt. Plus cannibalization: the same primary keyword on several URLs | Placement rules per template; fix the cannibalized pairs (merge, re-target or canonical) | **D5 (blocking)** | Do it after P2 / Gate B |
| **Image alt text** | `extract.py`: alt missing vs empty (empty is correct for decorative images); file names; image weight | Descriptive alt for product and content images, in the page's language, keyword only where natural; decorative = `alt=""` | D12 helps | — |
| **Internal linking** | `extract.py`: internal links out per page, inlinks per page, orphans (0 inlinks among crawled pages), `#` links; anchor text quality | Hub → spoke structure (category ↔ product ↔ article), breadcrumbs, related items, descriptive anchors, every important page ≤ 3 clicks from home | None | — |
| **Content quality** *(beyond the mind map)* | Thin pages (word count), boilerplate, duplicate copy across products, missing specs/FAQ, author or expertise signals (E-E-A-T) | Content brief per template; a priority list of pages to expand | D10 | Briefs only; writing waits |
| **URL structure** *(beyond the mind map)* | Readable slugs, language folders, parameters, depth | URL policy; any change goes through the 301 redirect map | None | — |

## 3. Local SEO

Only when the business has a physical location or serves defined areas. Otherwise skip, and say so.

| Topic | Check | Plan | Needs from user | If missing |
|---|---|---|---|---|
| **Google Business Profile** (formerly Google My Business, renamed 2021) | Public view: exists? verified-looking? category, hours, photos, reviews count and replies, posts, website link with UTM. Never claim or edit it ourselves | Correct primary/secondary categories, services/products, photos, Q&A, review request and reply routine, UTM on the website link | **D6 (blocking for changes)**, D7 | "Discovery item: GBP access"; public observations only, labelled O |
| **Local listings / citations** | Search brand name + phone; list directories, maps (Google, Apple, Bing), marketplaces and industry directories where the business appears or should appear | Priority list of listings to claim or fix; the market's top directories | D8 | Listed as "candidate" findings |
| **NAP consistency** | Compare name, address, phone and hours across the website (header, footer, contact, schema), GBP and the listings found | One canonical NAP; a fix list per source; LocalBusiness schema with the same values | **D7 (blocking)** | We can only report the inconsistencies we observe; no "correct" version is proposed |
| **Local content** *(beyond the mind map)* | City/area pages: do they exist, or are they thin doorway pages? | Real location or service-area pages only where the business genuinely serves them | D7 | — |

## 4. Content, AEO and GEO *(beyond the mind map; increasingly part of organic reach)*

- **AEO** (Answer Engine Optimization) means being the direct answer: featured snippets, People Also Ask, voice.
- **GEO** (Generative Engine Optimization) means being understood and cited by AI search: Google AI Overviews, ChatGPT search, Perplexity, Copilot.

| Check | Plan | Needs from user |
|---|---|---|
| Do pages answer real buyer questions? FAQ present and marked up? Answer-first paragraphs? Consistent entity facts (name, what they sell, where) across the site and profiles? Is AI crawler access blocked in robots.txt? Does an `llms.txt` exist (optional, low cost)? | Question bank from the keyword map's question tier; answer-first structure (the question as H2, a 40–60 word direct answer, then the detail); Organization schema with `sameAs` to official profiles (Google says its AI features need no special markup; clear visible answers matter more); a knowledge hub; robots policy for AI crawlers decided **with the client** | D10 (writer or expert), D8 (official profiles for `sameAs`) |

**Honesty rule:** for Google, the only first-party AI-visibility data is the Search Console Generative AI performance report (D2). For other engines there is no reliable public measurement. Sample prompts are an **indicator**: repeated runs, with the date, engine and language named (method in [modules/geo-ai-seo.md](modules/geo-ai-seo.md)). Never promise citations.

## 5. Off-page SEO

**Read before planning:** Google's spam policies treat link schemes as violations. That includes buying or selling links, excessive link exchanges, large-scale guest posting with keyword-rich anchors, and automated link building. Plan only what a client could show openly. Never buy links, use PBNs or run automated submissions.

| Topic | Check | Plan | Needs from user | If missing |
|---|---|---|---|---|
| **Backlink building** | Current profile: referring domains, top linked pages, anchor mix, toxic patterns. From D4, or GSC "Links", or Bing Webmaster Tools. Competitor link gaps (D4 only) | Earned links: suppliers/brands they carry, partners, associations, chambers of commerce, local press, case studies, linkable assets (guides, data, tools), broken-link reclamation, unlinked brand mentions | D4 or D2; **D9** for real relationships | Method only; no counts, no DR/DA figures |
| **Guest posting** | Industry publications and blogs that accept expert articles; are their links nofollow/sponsored? | A small number of genuinely expert articles for relevant audiences; branded or natural anchors; disclose sponsored placements with `rel="sponsored"` | **D10** (an expert who can write or approve), D9 | Shown as a later-phase option, not scheduled |
| **Social bookmarking** | Which platforms the audience actually uses | **Low SEO value today**: these links are nofollow and the old bookmarking sites are mostly spam. Reframe as distributing content on real channels (LinkedIn, Facebook groups, industry communities) for reach and brand searches, not for links | Official social profiles (D8) | Say plainly that it is not a ranking lever |
| **Forum participation** | Where the audience asks questions: Reddit, Quora, Facebook groups, industry forums, Arabic communities | Helpful answers from a named team member; link only when it truly answers the question. The value is brand awareness and mentions (also seen by AI search), not the link | **D10** (who will answer, in which language) | Method only |
| **Brand mentions / digital PR** *(beyond the mind map)* | Search for unlinked mentions, news, events | Reclaim links on existing mentions; PR around real news (with client facts and proof) | D9 | — |

## 6. Tools

| Tool | Use | Access | Cost |
|---|---|---|---|
| **Google Search Console** | Indexing, queries, CTR, CWV field data, links, sitemap submission, URL inspection | Client grants it (D2), or set it up on launch for greenfield | Free |
| **Bing Webmaster Tools** | Second index (it also feeds some AI assistants), backlinks, IndexNow, can import from GSC | Client grants it, or import from GSC | Free |
| **GA4** | Organic sessions, landing pages, conversions | D3 | Free |
| **Ahrefs / Semrush** | Volumes, difficulty, backlinks, competitor gaps | D4; ask, never assume. Ahrefs Webmaster Tools offers a free tier for a site the client verifies | Paid (some free tiers) |
| **Lighthouse / PageSpeed Insights** | Lab speed, CWV proxies. PSI also shows CrUX field data when it exists | None (PSI's keyless quota may be exhausted: the user runs pagespeed.web.dev manually) | Free |
| **pa11y / axe** | Accessibility (WCAG 2 AA) | Install with approval only | Free |
| **Bundled scripts** | `crawl.mjs` → `extract.py` → `keyword_check.py` | None | Free |

## Deliverable: the SEO action plan

One row per finding or action. Internal labels stay out of client copy.

| Area | Topic | Current state (evidence) | Action | Priority (أ/ب/ج) | Owner (agency / client / both) | Effort (small / medium / large) | Depends on data | How we'll measure |
|---|---|---|---|---|---|---|---|---|

- **Priority.**
  - أ: blocks crawling or indexing, or affects every page.
  - ب: affects key templates.
  - ج: polish.
- **Effort** is a class, never hours or a price.
- **Measure** names the tool and metric, e.g. "GSC impressions for the page group" or "Lighthouse LCP, same URL, same settings". Write no target number unless the client's own baseline exists.
- **"Depends on data"** cites the D-number, so the client sees exactly what they need to send.
- Add an **illustrative monthly cycle**, labelled "illustrative, not a commitment":
  - Week 1: technical checks and fixes
  - Week 2: on-page and content
  - Week 3: local and off-page
  - Week 4: report

## Standalone mode (SEO plan without a redesign)

| Phase | Output | Gate |
|---|---|---|
| **S0** | Batch data request (table above) sent; tool approvals | — |
| **S1 Audit** | Technical + on-page + local + AEO/GEO + off-page findings with evidence, using the bundled scripts and the tools available | **Gate S1**: the user approves the findings |
| **S2 Plan** | The SEO action plan + keyword map (if not already done) + the list of open data requests | **Gate S2**: the user approves; the plan is then exported (PDF or doc) per SKILL.md QA |

**At the end, always list what was not checked and why.** For example: "GSC not available → no query data" or "no GBP access → public view only".
