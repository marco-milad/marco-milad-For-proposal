# client-proposal: a Claude Code skill for agency proposals

A reusable, **gated and evidence-first** workflow for agencies that pitch clients in Arabic-first or bilingual markets. It turns the same proposal process you would otherwise repeat by hand for every client into a skill that Claude Code follows step by step, stopping for your approval at every gate.

> مهارة (Skill) لـ Claude Code بتمشي معاك خطوة بخطوة في تجهيز عرض لعميل جديد. فيها مساران: عرض تسويقي متكامل، وعرض فني للموقع والـ SEO. وفي كل مرحلة بتقف وتستنى موافقتك قبل ما تكمّل. القاعدة الأساسية: كل رقم وراه دليل، ومفيش أسعار ولا وعود بنتائج.

## Two tracks

| Track | What you get |
|---|---|
| **M: Integrated Marketing & Digital Growth Strategy** | The team's marketing strategy becomes the backbone of the proposal. Around it: anonymous competitor patterns, the agency's services as an execution model, campaigns, a 90-day plan and KPIs. Delivered as Arabic-first HTML, PDF and editable PPTX |
| **W: Web + SEO technical proposal** | Works whether the client already has a site or not:<br>- **Existing site:** audit (crawl, Lighthouse, pa11y), keyword map, weighted platform decision, URL and redirect policy.<br>- **Greenfield:** market and search baseline, keyword map, platform choice, launch plan.<br><br>Both paths include a sitemap mind-map and a bilingual home + product prototype in one HTML file, and are delivered as a roughly 24-page Arabic-led PDF |

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
- `extract.py`: on-page SEO extraction into `pages.json`.
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
