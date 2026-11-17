# client-proposal: a Claude Code skill for agency proposals

A reusable, **gated and evidence-first** workflow for agencies that pitch clients in Arabic-first or bilingual markets. It turns the same proposal process you would otherwise repeat by hand for every client into a skill that Claude Code follows step by step, stopping for your approval at every gate.

> مهارة (Skill) لـ Claude Code بتمشي معاك خطوة بخطوة في تجهيز عرض لعميل جديد. فيها مساران: عرض تسويقي متكامل، وعرض فني للموقع والـ SEO. وفي كل مرحلة بتقف وتستنى موافقتك قبل ما تكمّل. القاعدة الأساسية: كل رقم وراه دليل، ومفيش أسعار ولا وعود بنتائج.

## Two tracks

| Track | What you get |
|---|---|
| **M: Integrated Marketing & Digital Growth Strategy** | The team's marketing strategy becomes the backbone of the proposal. Around it: anonymous competitor patterns, the agency's services as an execution model, campaigns, a 90-day plan and KPIs. Delivered as Arabic-first HTML, PDF and editable PPTX |
| **W: Web + SEO technical proposal** | Works whether the client already has a site or not:<br>- **Existing site:** audit (crawl, Lighthouse, pa11y), keyword map, weighted platform decision, URL and redirect policy.<br>- **Greenfield:** market and search baseline, keyword map, platform choice, launch plan.<br><br>Both paths include a sitemap mind-map and a bilingual home + product prototype in one HTML file, and are delivered as a roughly 24-page Arabic-led PDF |

## Comprehensive SEO plan

`references/seo-optimization-plan.md` covers every SEO area: technical, on-page, local, content/AEO/GEO, off-page and tools. For each topic it gives how to check it, what to plan, and which data only the client can provide, gathered into one batch data request. Use it inside Track W, or on its own as an SEO plan for an existing site.

> خطة SEO شاملة: كل بند ومعاه إزاي نفحصه، وإيه اللي هنعمله، وإيه الداتا اللي محتاجينها من العميل عشان ننفذه.

## UI/UX plan

`references/ui-ux-plan.md` covers the full path from a UX audit of the current site to a validated prototype: information architecture, page templates and conversion, design system, mobile-first and RTL, accessibility, microcopy, and measurement. Each topic lists the data the client must provide (U1–U12). Every design decision is tied to a reason, and no conversion numbers are promised.

> خطة UI/UX: من فحص الموقع الحالي لحد Prototype متجرب، وكل قرار في التصميم ليه سبب واضح.

## Modules (sub-skills)

Each module runs inside the full workflow, or on its own when you ask for just that area:

| Module | What it does |
|---|---|
| Technical SEO | Crawl/index, raw vs rendered HTML, sitemaps, canonicals, CWV, mobile parity, security hygiene |
| Schema | Template markup, Google's retired features (FAQ, HowTo, sitelinks search box), merchant-listing rules |
| GEO / AEO / AI SEO | AI crawler access by purpose, readiness, a repeatable prompt-sample method, the claim ledger |
| E-E-A-T and content | Who/How/Why, trust signals, the swap test for location pages, a voice-of-customer quote bank |
| Local SEO | GBP scorecard, review policy, NAP matrix, listings, local pages |
| Backlinks | Data-sufficiency gate, link status taxonomy, an earned-link plan within Google's spam policies |
| CRO and tracking | Page review order, form rules, pop-up policy, a conversion-tracking audit with health vs coverage |
| Information architecture | Four systems, content inventory, bilingual labels, URL map, tree tests, migration |
| Distinctive frontend / UI | A design direction plan, a "would I make this for anyone?" check, generic patterns to avoid (incl. Arabic typography), tokens, budgets |
| Report | Health vs coverage scoring, the report structure, and a pipeline from data JSON to Arabic PDF |

> وحدات فرعية: كل وحدة تقدر تطلبها لوحدها، زي فحص تقني أو Schema أو GEO أو E-E-A-T أو Local أو Backlinks أو CRO أو هيكل الموقع أو التصميم أو تقرير PDF.

## What it enforces

- Phase gates with mobile and desktop screenshots at each checkpoint.
- Evidence labels on every finding (Verified, Observed, Inconclusive, Inference, Recommendation, Unknown).
- No prices, no guarantees, no impact or ranking claims without the client's own data.
- Competitors appear in client copy only as anonymous patterns.
- Original files are hash-locked and approved versions are never overwritten.
- Polite crawling only: no header spoofing, no bypassing a WAF or a 403.
- No installs without approval, and no uploads to third-party converters.
- Nothing is ever sent to the client by the agent.

## Bundled scripts

All scripts are Node 22 or Python stdlib, with no dependencies. They drive your installed Edge or Chrome over CDP.

- `crawl.mjs`: polite sitemap crawl that saves the raw HTML.
- `extract.py`: on-page SEO extraction into `pages.json`, including the internal link graph (inlinks, orphans).
- `keyword_check.py`: checks where each page's primary keyword appears, and flags cannibalization. Matches Arabic after normalizing spelling variants.
- `ux_check.mjs`: rendered-page UX and accessibility checks (contrast, tap targets, small text, unnamed controls, unlabelled fields), on local files or live URLs.
- `schema_check.py`: JSON-LD checks, including Google's retired rich-result types and merchant-listing formats.
- `ai_access.py`: what each AI crawler may fetch according to robots.txt, by purpose (search, user-triggered, training).
- `shot.mjs`: full-page screenshots that render RTL pages correctly.
- `route-test.mjs`: click-through tests for a single-file prototype, driven by a JSON steps file.
- `pagecheck.mjs`: checks that each fixed A4 page fits its content.
- `export-pdf.mjs`: exports a tagged PDF using the local browser.
- `scan_language.py`: flags impact claims, promises, commercial terms, competitor names and leaks, with a per-client config.

## Install

Clone into your Claude Code skills folder:

```bash
# macOS / Linux
git clone <this-repo-url> ~/.claude/skills/client-proposal
# Windows (PowerShell)
git clone <this-repo-url> "$env:USERPROFILE\.claude\skills\client-proposal"
```

Claude Code picks it up automatically. Start with something like *"I'm preparing a website + SEO proposal for a new client"*, or run `/client-proposal`.

The scripts default to Edge on Windows. On other systems, set `BROWSER_PATH` to your Chrome or Chromium binary.

## Layout

```
SKILL.md                       workflow, ground rules, workspace layout, script usage
references/client-intake.md    what data to collect from the client, what each item unlocks, what happens if it's missing
references/marketing-track.md  Track M phases, research streams, competitor criteria, proposal outline
references/web-seo-track.md    Track W phases, audit, keywords, platform matrix, IA, prototype, PDF outline
references/evidence-and-qa.md  evidence labels, finding template, banned claims, QA checklist
references/rtl-bidi-gotchas.md Arabic/RTL pitfalls in HTML, screenshots, PDF and PPTX
scripts/                       the tools above
```

Keep client material in each client's own workspace. This repo is meant to stay free of client data.

## License

MIT
