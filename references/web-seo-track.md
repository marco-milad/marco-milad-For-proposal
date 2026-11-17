# Track W: Web + SEO technical/strategic proposal

**SEO coverage.** Use [seo-optimization-plan.md](seo-optimization-plan.md) as the checklist for every SEO topic (technical, on-page, local, content/AEO/GEO, off-page, tools) and for its batch data request. P1 uses its Check columns, P2 its keyword and off-page/local rows, P5 its action-plan table.

**UI/UX coverage.** Use [ui-ux-plan.md](ui-ux-plan.md) for the UX audit (P1), the IA, templates and design system (P4), the prototype validation (P4/P6) and the design-decisions table (P5).

**Goal.** A technical and strategic proposal that the agency's web lead will implement. It answers four questions:
- Where does the client's site stand today, with measured evidence?
- What search opportunity exists?
- Which platform should the site be built on?
- What will the new site look like (IA + prototype)?

No prices. The format is **one Arabic-led bilingual PDF**: Arabic body text, English technical terms kept verbatim and explained in Arabic, plus a glossary.

If the user has a past proposal they like (for example with services, a why-choose-us section, keyword tiers, an xmind sitemap), analyse it first. Write `web-seo/inputs/reference-analysis.md` covering what to keep and which gaps to close, then match its format.

## Two starting points: existing site or greenfield

At intake, ask whether the client has a website. The phases stay the same; what changes is their content.

| Phase | **Existing site** | **Greenfield (no site yet)** |
|---|---|---|
| P1 | Audit of the current site (below) | **Market & search baseline**:<br>- competitor sites on the 14 criteria from the Track M competitor matrix (in marketing-track.md), without the business-claims columns<br>- SERP sampling for the client's main categories: who ranks today (directories, marketplaces, competitors)<br>- the client's existing footprint (Google Business Profile, social, marketplaces, directory listings, branded search)<br>- an inventory of the content the client already has |
| P2 | Keyword map | Same. It is even more central here, because it defines the site |
| P3 | Options: improve / extend / rebuild, plus URL migration and a redirect map | **Platform choice only**: options weighted by the same matrix, with no "keep current platform" option unless they run an ERP/shop that has a web module. **No redirect map.** Instead: a domain & launch plan (domain, email, analytics and Search Console set up from day 1, Google Business Profile, sitemap submission) |
| P4 | IA + prototype | Same. The sitemap shows the full launch scope; mark phase-2 pages |
| P5 | The PDF opens with "where the current site stands today" | The PDF opens with **"the opportunity in the market"**: what searchers look for, who currently captures it, and where the gap is. Replace the audit and migration pages with:<br>- "market & competitor landscape"<br>- "launch foundation": domain, analytics, Search Console, Google Business Profile, schema from day 1<br>- "content to create before launch" |
| P6 | QA as usual | QA as usual. Number checks run against the SERP sample and competitor data instead of the crawl |

**Greenfield honesty rule.** With no site there is no baseline. Frame the KPIs as "measured from launch". Never imply expected traffic or rankings.

## Phases and gates

| Phase | Output | Gate |
|---|---|---|
| **P0 Tools** | Confirm the toolset. Candidates: Lighthouse, Unlighthouse, pa11y/axe, advertools, each installed only with approval into an isolated scratchpad folder. Ask whether Ahrefs/Semrush access exists; if not, make no search-volume claims | Approval for each install |
| **P1 Audit** | `audit/data/` (crawl, `pages.json`, Lighthouse mobile CSV, pa11y JSON, sitemap, robots) → `audit/gate-a-audit-report.md` | **Gate A** |
| **P2 Keywords** | `research/keyword-map.md` | **Gate B** |
| **P3 Platform** | `research/platform-decision.md` + `redirect-map-draft.csv` | **Gate C** |
| **P4 IA + prototype** | Sitemap mind-map PNG, `p4/ia-sitemap.md`, home + product prototype in EN/AR, screenshots at 390/768/1440 | **Checkpoint D**: expect feedback such as "home feels thin" → add sections |
| **P5 Proposal** | Fixed-A4 HTML pages → PDF | User reviews content |
| **P6 QA + final PDF** | `proposal/qa/` (number verification, language scan, QA report) and the final tagged PDF | Final. The user decides on sending |
| **Extras** | Separate sitemap image; the prototype as one HTML file | On request |

## P1 audit: how

- **Crawl.**
  - Fetch robots.txt and sitemap.xml.
  - Run `scripts/crawl.mjs`. Exclude large repetitive sections such as directories or tag pages, but keep a few samples.
  - Run `scripts/extract.py` → `pages.json`.
  - This gives, per page: meta description (and length), duplicate titles, H1/H2/H3, canonical, noindex, hreflang, JSON-LD, alt text, Arabic presence, `#` links, CMS boilerplate, and internal links out/in (orphans).
  - After Gate B, run `scripts/keyword_check.py` with the keyword map as `url,keyword` CSV to check keyword placement and cannibalization on the current pages.
- **Lighthouse (mobile, lab).** Run it on representative URLs: home, a category, a product, a brand, contact. From the raw JSON, record Performance, LCP, total weight, render-blocking time and the LCP image load delay.
- **Accessibility and UX.** Run pa11y on about 5 pages (WCAG2AA) and report the error counts. Run `scripts/ux_check.mjs` on the same pages at 390 (mobile) and 1440, and do the heuristic walk in ui-ux-plan.md §1.
- **Indexing hygiene.** Check:
  - robots, sitemap, HTTPS/www
  - duplicate hosts (e.g. a CMS's default subdomain: is it noindex + canonical?)
  - thin or empty pages in the sitemap
  - typos
- **Gate A report outline:**
  1. Scope & method
  2. Summary in lines
  3. Lighthouse scoreboard + causes
  4. Indexing & crawl
  5. On-page across N pages
  6. Quality & content
  7. Accessibility
  8. What this means for the proposal: biggest SEO opportunities ranked; platform-decision inputs
  9. What we did not verify
  10. Questions for the gate

## P2 keyword map: how

- **Keyword tiers.**

  | Tier | What it is | Where it goes |
  |---|---|---|
  | Head (category) | — | H1, menu, URL |
  | Product/Brand | — | Product H1, title, URL |
  | Long-tail commercial | Category + use/place/buyer, e.g. "{category} supplier {city}" / «مورد {الفئة} في {المدينة}» | Meta and first paragraph |
  | Questions | — | Knowledge articles + FAQ schema |
  | Local/commercial modifiers | Country, city, «سعر», «مورد» / supplier, price | Added to the tiers above |

- **Rules:**
  - One primary keyword per page, to avoid cannibalization.
  - Titles ≤ 60 characters.
  - Every page in AR + EN, with hreflang.
  - Never use «وكيل» / "authorized/exclusive" without a document from the client.
- **Group the keywords by product family** and give each family a priority (أ/ب/ج). Tie families to the team's campaigns where they exist.
- **SERP sampling.** Run 10–15 real queries and note who ranks: directories, competitors, and whether the client appears. Label it an *indicator*, because WebSearch is not a local index.
- **Also include:**
  - a "keyword per page" table (this feeds the sitemap)
  - topic clusters
  - an off-page/local checklist: Google Business Profile, directories, NAP consistency
  - a validation plan
  - Gate B questions

## P3 platform decision: how

- **Facts first:**
  - current platform and edition: public CMS info pages, version strings, plan limits (e.g. a hosted SaaS tier may forbid custom modules or gate its API behind a plan)
  - the ERP's role: products, stock, CRM
  - what the client said they want: look, SEO, Arabic
- **Three options**, for example:
  - A: improve within the current platform
  - B: the platform's self-hosted or extensible tier
  - C: a new headless front end, with the ERP staying

  Don't assume a rebuild.
- **Weighted decision matrix.** Weights come from the client's stated goals and must sum to 100%. Recompute the totals in QA. Starting weights:

  | Criterion | Weight |
  |---|---|
  | Design freedom | 15 |
  | Technical SEO control | 20 |
  | Core Web Vitals | 15 |
  | Arabic RTL & bilingual | 10 |
  | ERP integration | 10 |
  | Client content editing | 10 |
  | Cost & ops complexity | 10 |
  | Time & risk | 10 |

  Add an **honest reading**: what the losing option wins on, and which weight changes would flip the result.
- **A recommendation that has worked:** Next.js + Payload CMS (open source, localization) + next-intl, with the ERP kept as the system of record.
  - Phase 0: a standalone quick-fix step on the current site.
  - Phase 1: web leads go into the ERP's CRM by email alias.
  - Phase 2: sync through the ERP's API.
- **URL policy.**
  - Existing English URLs stay as they are; Arabic goes under `/ar/`.
  - Every current sitemap URL goes into `redirect-map-draft.csv` with an action: keep / 301 / 410 / remove / rename. Count the actions in QA.
  - Add a go-live checklist and a risks table.
- **List the discovery items** that would change the decision.

## P4 IA + prototype: how

- **Sitemap image.** A JS mind-map HTML page: root → L1 sections → L2 → leaves, bilingual labels, `NEW` badges, URL chips. Screenshot it with `shot.mjs` at about 4200 px wide.
- **`ia-sitemap.md`** covers:
  - principles and navigation
  - the template inventory:

    | Template | Schema |
    |---|---|
    | Home | Organization + WebSite + SearchAction |
    | Category | BreadcrumbList + ItemList |
    | Product | Product + FAQPage |
    | Brand | — |
    | Article / Knowledge hub | Article + FAQPage |
    | Quote + thank-you | — |
    | Static | — |

    Give each template its page count, URL pattern, primary keyword and schema.
  - components per template
  - internal-linking rules
  - measurement: GA4 + Search Console
  - what is real vs illustrative in the prototype
  - open questions for the client
- **B2B product page components:**
  - breadcrumb
  - H1
  - gallery + brand badge
  - two-sentence summary
  - 4 quick facts
  - quantity + **Add to Quote** + **Ask on WhatsApp**
  - datasheet link
  - an explicit line: "we don't show prices; the team sends a quote"
  - tabs: Overview / Features / Specs / Applications / FAQ
  - "who it's for"
  - help card
  - related article
  - related products
- **Home page with 16 sections.** A 9-section home tends to feel thin.
  1. Hero with product search + popular chips + WhatsApp
  2. Brand strip
  3. "In numbers": from the catalog itself; founding year attributed to the brand
  4. Product families
  5. Featured products + Add to Quote
  6. Why us: the team's advantages, verbatim; confirm with the client any claim about expertise
  7. A signature-category spotlight
  8. "Start from your use case" paths
  9. By industry
  10. 3 knowledge articles
  11. 3-step quote explainer
  12. About
  13. Find us: map + NAP, for local SEO
  14. FAQ + FAQPage schema, for GEO / AI Overviews
  15. Final CTA
  16. Newsletter
- **Build from one Python generator** (`build.py`) that holds the EN/AR strings plus `header()`, `footer()`, `home()` and `pdp()`.
  - Use logical CSS properties.
  - Set `html dir/lang` per page.
  - Wrap mixed Latin+number tokens in `<bdi>`.
- **Screenshots** at 390 mobile, 768 and 1440, in both languages.
- **`ux_check.mjs`** on every prototype view at 390 and 1440. The target is 0 contrast failures, 0 crowded tap targets, 0 unnamed controls and 0 unlabelled fields. Quote the numbers in the handover.

### Single-file prototype (when the user wants one shareable file)

- **Views.** Four views (en/home, en/product, ar/home, ar/product), each a `.view` div with `data-lang` and `data-page`. Inactive views carry `hidden`.
- **Routing.** Hash routes `#/en|ar/home|product`. A small router sets `html lang/dir` and `document.title`, and scrolls to the top.
- **Assets.**
  - Base64-embed each image once in a JS map, referenced by `data-img`.
  - Inline the CSS.
  - Google Fonts needs internet, so set a system-font fallback.
- **Navigation uses only the site's own elements:**
  - header ع/EN button and top-bar/footer language links → the same page in the other language
  - logo and first breadcrumb → home
  - featured product card, popular chip and hero image → product
  - other `href="#"` placeholders do nothing
- **No "prototype" bar.** Users want it to look like a real site.
- **Test** with `scripts/route-test.mjs` and a steps JSON at 390 and 1440. Check the view, `dir`, no horizontal overflow and no broken images.
- **Don't publish it as a public page** (client branding, looks real). Hand over the local file.

## P5 proposal outline that works

24 fixed A4 pages, Arabic RTL, using the agency's palette:

1. Cover
2. Contents
3. Executive summary
4. Current-site audit: where we stand today
5. What we found and why it may matter
6. Search & keyword opportunity
7. Keyword universe by product family
8. Platform decision
9. Architecture & ERP integration
10. Proposed sitemap
11. Page templates & navigation
12. Prototype: home
13. Prototype: product
14. Mobile-first, equally good in Arabic
15. Technical SEO foundation built in
16. Migration that protects current visibility
17. Content, knowledge hub & local SEO
18. Measurement & reporting
19. Implementation phases
20. Monthly SEO plan ("illustrative, not a commitment")
21. Risks & what we need from the client
22. Discovery questions & next step
23. Glossary (English term → Arabic explanation)
24. Method & sources

Run `scripts/pagecheck.mjs` after every content change: every page must fit above the footer.

## P6

Follow evidence-and-qa.md. These items are usually still open at the end:
- a source site that blocks automation (the user opens it manually)
- facts only the client can confirm
- Search Console / Analytics access, usually unavailable, which is why the proposal deliberately carries no traffic numbers
