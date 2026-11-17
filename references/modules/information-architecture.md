# Module: Information architecture (IA) for a redesign or new site

**Call it when** you are planning the structure of a new or rebuilt site (Track W P3–P4), or when the user asks about the sitemap, navigation, taxonomy or menus.

**Inputs**
- The crawl (existing site).
- The keyword map (P2).
- U1 (the goal), U2 (the audiences), U4 (the product list).
- The team strategy's audience segments.

**Outputs**
- `p4/ia-sitemap.md`
- `p4/content-inventory.csv`
- `p4/label-inventory.csv`
- `p4/url-map.csv`
- the sitemap mind-map PNG

Every structural choice is written down with its reason.

## The four systems

Score each system 1–5, with evidence, for the current site. Then design each one for the new site.

| System | Questions |
|---|---|
| **Organization**: how content is grouped | One dominant scheme per level: by product type, task/use case, audience, brand or place. Never mixed in one menu. Any "Other/Misc" buckets? Where would **twice** the content go? |
| **Labeling**: what things are called | Does every label predict its destination? Synonym conflicts (one thing, two names) and homonym conflicts (one name, two things)? Vague labels ("Solutions", "Resources", "More", «خدماتنا» for everything)? Checked in **Arabic and English separately** |
| **Navigation**: how people move | Global, local, contextual (in-content), utility (language, account, cart), mobile, footer, breadcrumbs |
| **Search**: how people find | Is search needed (catalogs > ~50 items: yes)? Arabic normalization (أ/ا, ة/ه, ى/ي, no diacritics) and transliteration (e.g. "laptop" / «لابتوب»), synonyms, typo tolerance, filters/facets, the zero-results page |

**IA health weights** (our rubric): Organization 30, Navigation 30, Labeling 20, Search 20. Show the evidence per score.

## Step 1: Content inventory (existing site)

One row per URL, from the crawl:

| Column | Content |
|---|---|
| url | — |
| title | — |
| type (template) | — |
| words | — |
| inlinks | — |
| last updated | — |
| traffic | If GA4/GSC is available |
| backlinks | If D4 is available |
| **verdict** | One of the verdicts below |
| target URL | For merges and redirects |

The verdicts:
- **Keep**
- **Update**
- **Merge** (into …)
- **Remove** (410 or 301)
- **Gap** (a new page needed)

Report the share of redundant, outdated or trivial content ("ROT"). This file feeds the redirect map. **Never remove a page with traffic or backlinks without a 301.**

## Step 2: Top tasks and entry paths

- **List the top 5–10 visitor tasks.** Sources:
  - U2 and U7
  - the keyword map's intents
  - the sales team
  - site search logs if available

  Examples: "find a product by type", "find the right product for my job", "get a price", "check delivery to my city", "contact on WhatsApp".
- **Design at least two entry paths** to the catalog when the buyers differ:
  - **by product type**, for those who know what they want;
  - **by use case / industry / problem**, for those who need guidance.

  Tie the second path to the strategy's audience segments.
- **Use multiple classification on purpose:** a product can appear under one type and several uses. **But it has one canonical URL**: flat `/products/{slug}` plus breadcrumbs, never nested under every category path.

## Step 3: Structure rules

- **Depth:**
  - any product ≤ 3 clicks from home (home → family → product), or 1 search;
  - small business sites 1–2 levels;
  - catalogs 3 at most.
- **Flat beats empty hierarchy:** don't create a `/folder/` level unless it is a real, useful page.
- **Front doors.** Every deep page is someone's landing page from search. It needs context: what this is, where it sits (breadcrumb), what's next (related items, CTA).
- **Hub pages carry content.** Category hubs have an intro, buying guidance and FAQs, not just a grid of links.
- **Navigation budgets:**
  - primary nav 4–7 items, with the CTA at the end (left in RTL);
  - a mega menu for large catalogs (2–4 columns, a "see all" link per column, no nested fly-outs);
  - footer columns by theme (products, company, help, legal) with the NAP identical to GBP;
  - **utility** items: the language switch (to the same page in the other language), search, cart/quote list.
- **Mobile nav:**
  - logo, search, CTA/cart icon, menu;
  - a bottom sticky action bar on product pages;
  - the menu opens with the top tasks first, not the company pages.
- **Consistent help (WCAG 3.2.6):** contact, WhatsApp and FAQ links in the same relative place on every page.

## Step 4: URL map and policy

`url-map.csv` columns:

| page | url_en | url_ar | parent | template | nav location | primary keyword | priority | status |
|---|---|---|---|---|---|---|---|---|
| … | … | … | … | … | global / footer / contextual / none | … | … | keep / new / 301 from … |

**URL rules**
- lowercase, hyphens, no dates/IDs/session parameters, a consistent trailing-slash policy;
- the language folder (`/ar/`);
- existing English URLs kept where possible (web-seo-track.md URL policy);
- **Arabic slugs:** choose either transliterated/English slugs (stable, easy to share) or Arabic slugs (readable in Arabic SERPs, but percent-encoded when shared). Decide once and record why.

## Step 5: Labels

`label-inventory.csv` columns: concept | AR label | EN label | alternatives considered | why chosen | where used.

- One concept = one label everywhere: nav, breadcrumbs, H1, buttons, footer.
- Labels use the customers' words (the VOC bank, search terms), not internal jargon.

## Step 6: Internal linking model

- **Hub ↔ spoke:** category ↔ products ↔ guides. Cross-links between related spokes. Guides link to the products they discuss; products link to their guide.
- **New-page checklist.** Before any page goes live:
  - ≥ 3 internal links in
  - unique title/description
  - self-canonical
  - in the sitemap
  - schema
  - content in the server HTML
  - indexable
  - linked into the conversion path
- **Orphans:** `extract.py` inlinks = 0 → fix before launch.

## Step 7: Validate before building

| Method | When | Target |
|---|---|---|
| **Tree test** (text-only menu: "where would you find X?") | After the sitemap draft, before visual design | ≥ 80% success per task; record directness |
| **First-click test** on the prototype | Checkpoint D | Most first clicks land on the right path |
| **Open/closed card sort** | When grouping is uncertain (large catalogs) | Groupings that agree with the sort |
| Expert walk-through + `route-test.mjs` | Always | All tasks reachable in ≤ 3 clicks |

- **Sample sizes.** Tree tests and card sorts need dozens of participants for numbers. With 5–8 people, report the findings qualitatively.
- **Without real participants (U12):** say "validated by expert walkthrough". Never imply user testing.

## Step 8: Migration and launch (existing sites)

- **Before:**
  - save every old URL with its title, meta, canonical and H1;
  - pull the top pages by clicks and links;
  - build one-to-one 301s (never all to home);
  - test the redirect map on staging.
- **Launch:**
  - redirects live at the moment of the switch;
  - submit the new sitemaps and keep the old ones briefly;
  - spot-check the top pages, forms and tracking.
- **After:**
  - Search Console daily for 2 weeks, then weekly for 2 months;
  - update internal links to the final URLs instead of relying on redirects.
- **Adding a blog/shop on another system:** prefer a subfolder via reverse proxy over a subdomain. Then the canonicals and sitemap are on the main domain, the origin host is noindexed, and consent and analytics run on both.

## Governance (hand-over)

Name:
- who owns each section;
- the naming rules (the label inventory);
- how new categories get added (the growth test);
- the review cadence for stale content.
