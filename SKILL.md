---
name: client-proposal
description: Gated, evidence-first workflow for an agency preparing a proposal for a new client. Track M is an Integrated Marketing & Digital Growth Strategy, where the team's own strategy leads and is followed by the agency's services, anonymous competitor patterns, campaigns, a 90-day plan and KPIs. Track W is a technical Web + SEO proposal, for clients with an existing site or with none yet (greenfield): site audit or market baseline, keyword map, platform decision, sitemap, a bilingual home and product prototype, and an Arabic-led PDF. Use this skill whenever the user is pitching, preparing an offer for, or researching a prospect or client. That includes "عرض"/"بروبوزال"/"proposal"/"خطة" for a company, auditing a prospect's website or competitors for a pitch, turning a team strategy (.docx) into a client proposal, planning a website or SEO offer, writing a full SEO optimization plan (technical, on-page, local, off-page, AEO/GEO) even without a redesign, auditing or redesigning a site's UI/UX or information architecture, a single focused audit (technical SEO, schema, GEO/AI SEO, E-E-A-T, local SEO, backlinks, CRO/tracking) or a scored audit PDF, or producing the proposal HTML/PDF/PPTX or a clickable prototype. Use it even if the user doesn't say "workflow" or name the skill.
---

# Client proposal workflow

Two proposal types, built for Arabic-first, bilingual B2B markets such as Egypt and the Gulf. A client may get one or both. When both, Track M usually comes first and Track W is the second, deeper deliverable.

| Track | Use when | Leads the story | Deliverables |
|---|---|---|---|
| **M: Integrated Marketing & Digital Growth** | The team wrote a marketing strategy (often an Arabic .docx) and the agency pitches its services around it | The **team's strategy**. The website is one service among several, about 10% of the words, and comes last | HTML (Arabic-first RTL), PDF, editable PPTX, plus an internal research pack |
| **W: Web + SEO technical/strategic** | The client wants a new or better website and search visibility. This covers both an **existing site** and a **greenfield** site that hasn't been built yet | The **audit evidence** → keywords → platform → IA → prototype | One Arabic-led bilingual PDF, a single-file clickable prototype, and a separate sitemap image |

**First, send the user the intake checklist** in [references/client-intake.md](references/client-intake.md). It lists what to collect, what each item unlocks, and what happens if it is missing. Start with what exists; missing items become limitations or discovery questions, never blockers.

Read the track file before starting:
- Track M: [references/marketing-track.md](references/marketing-track.md)
- Track W: [references/web-seo-track.md](references/web-seo-track.md)
- Any SEO work (inside Track W, or a standalone SEO plan for an existing site): [references/seo-optimization-plan.md](references/seo-optimization-plan.md). It covers every SEO topic and lists the data each one needs from the user. Send its data request (D1–D13) in one batch at the start.
- Any UI/UX work (redesign, prototype, UX review of an existing site): [references/ui-ux-plan.md](references/ui-ux-plan.md). Audit → IA → templates → design system → mobile/RTL → accessibility → prototype validation, with its own data request (U1–U12); send it together with D1–D13.

## Modules (sub-skills you can run on their own)

When the user asks for one area only, e.g. «اعمل فحص Schema», "check E-E-A-T", «فحص تقني», "local SEO for this shop", "design the IA", "make the UI not look generic", "audit report PDF":
- Load just that module.
- Still send only the data-request items the module lists.
- Still follow the ground rules below.

Inside a full Track W, the modules are used at the phases shown.

| Module | File | Used in Track W |
|---|---|---|
| Technical SEO audit | [references/modules/technical-seo.md](references/modules/technical-seo.md) | P1 |
| Schema | [references/modules/schema.md](references/modules/schema.md) | P1, P4 |
| GEO / AEO / AI SEO | [references/modules/geo-ai-seo.md](references/modules/geo-ai-seo.md) | P1, P2, P5 |
| E-E-A-T and content | [references/modules/eeat-content.md](references/modules/eeat-content.md) | P1, P2 |
| Local SEO (GBP, NAP, listings) | [references/modules/local-seo.md](references/modules/local-seo.md) | P1, P2 |
| Backlinks and off-page | [references/modules/backlinks.md](references/modules/backlinks.md) | P1, P2 |
| CRO and conversion tracking | [references/modules/cro.md](references/modules/cro.md) | P1, P4 |
| Information architecture | [references/modules/information-architecture.md](references/modules/information-architecture.md) | P3, P4 |
| Distinctive frontend / UI | [references/modules/frontend-design.md](references/modules/frontend-design.md) | P4 |
| Scoring and the audit PDF | [references/modules/report.md](references/modules/report.md) | P1 report, P5, P6 |

**Facts that expire.** Google features, AI crawler tokens and schema support change several times a year. The modules record what was verified and when. Before quoting any of them in client copy, re-check the official source and write the check date in the internal file.

Read these as you reach the stage that needs them:
- Before writing any finding or the QA pass: [references/evidence-and-qa.md](references/evidence-and-qa.md)
- Before building any Arabic HTML, PDF, PPTX or screenshot: [references/rtl-bidi-gotchas.md](references/rtl-bidi-gotchas.md)

## How we work

**One phase at a time; stop at each gate.** Every phase ends with a short report to the user, written in the user's language and dialect. For anything visual, include mobile and desktop screenshots. Then wait for approval or feedback before the next phase.

Users often review on a phone and give feedback like "the home page feels thin, add sections". Absorb that and continue. This rhythm prevents expensive rework. A common failure it catches early: a marketing proposal that drifts into a website pitch, because website defects are the easiest thing to prove.

**Plan first, in writing.** Before any research, write a plan:
- Inventory of inputs.
- Mission: must / must not.
- Research questions → sources.
- Tool status: Tested / Present-untested / Unavailable.
- Deliverables.
- QA.
- Risks.
- Gates.
- The decisions you need from the user. Ask them in **one batch**, not one at a time.

**Phase-0 decisions to collect** (defaults in brackets):
1. Which track(s)? For Track W: existing site or greenfield?
2. Client-facing language and format? [Arabic-led, English terms kept verbatim and explained in Arabic, PDF]
3. Which intake items are available? (see client-intake.md) Note which are missing and say how each gap will be handled.
4. Competitors? [Only the ones the team strategy names; anonymous in client copy.]
5. The agency's service list and naming? [Ask. Don't assume a fixed set.]
6. Pricing or commercial content? [None: no prices, packages, deposit terms or delivery dates.]
7. Which social profiles are official? [Propose candidates; they stay "candidate" until confirmed.]
8. Unsourced client self-claims ("since 19xx", "exclusive agent", counts)? [Excluded until a source is supplied.]
9. Tool approvals: headless system browser, subagents for parallel research, any npm/pip install.
10. Who signs off and who sends? [The user sends; you never do.]

## Ground rules

These exist because a proposal is read by a client who will hold the agency to every sentence.

- **Every factual sentence traces to evidence.**
  - Label every finding V / O / O-inc / I / R / U (see evidence-and-qa.md).
  - Numbers come from raw data files and are re-verified by script before the final export.
  - Read the source itself, not its title or a secondary summary. Official support pages often say something more nuanced, e.g. "12–18 months" where a blog says "every year".
- **No impact claims without the client's own data.** No "you are losing revenue", no ranking promises, no forecasts. No search-volume figures unless a real keyword tool was used and cited. Phrase issues as risk or opportunity ("may add friction…").
- **No commercial commitments.** No prices, packages, budgets, guarantees, or timelines presented as promises. A monthly SEO cycle can be shown if it is labelled "illustrative, not a commitment".
- **Competitors.** Compare them on identical criteria internally. In client copy they appear only as anonymous patterns ("0 of 4 sites offer a full Arabic version").
- **Client self-claims** such as "exclusive/authorized agent", founding year or counts stay out unless sourced. A founding year shown on the client's own logo may be used, attributed to the brand.
- **Originals are read-only.**
  - SHA-256 the inputs (team docx, templates) at the start and re-check after every phase.
  - Never overwrite an approved deliverable or an existing change log. Write new versions next to them and archive the old ones.
- **Polite, honest access.**
  - Use the default user agent, request pages one at a time with a delay, and respect robots.txt.
  - Never spoof headers or bypass a WAF, login or 403. Record it as **O-inc** (inconclusive), never as a defect, and ask the user to open it manually.
  - Never submit forms or contact anyone.
- **Isolation.**
  - Use the system Edge/Chrome headless with a temp profile in the scratchpad.
  - Install nothing without explicit approval. Approved installs go in an isolated scratchpad folder, never inside another project or repo.
  - Never upload proposal files to third-party converters or validators.
- **Never send or publish to the client.** That is the user's call. Do not publish a client-branded prototype as a public page: once the "prototype" label is gone, it is indistinguishable from the client's real site. Hand over the local file instead.
- **Client confidentiality.** Keep client material inside the client's workspace folder. Never copy client facts, names or files into this skill, into shared templates, or into another client's work.

## Workspace layout

Create everything under `<workspace>/<client>-proposal/`, next to the untouched originals:

```
<client>-proposal/
  research/          evidence-log.md, website-audit.md, competitor-matrix.md, social-search-footprint.md   (Track M)
  strategy-review/   strategy-change-log.md (bilingual), integrated-strategy-gap-analysis.md              (Track M)
  proposal/          outline.md, <client>-proposal-vN.html/.pdf/.pptx, qa-report-vN.md, archive/, vN/ (source, build, assets)
  web-seo/                                                                                                (Track W)
    inputs/  audit/ (data/: crawl, pages.json, lighthouse, pa11y; gate-a-audit-report.md)
    research/ (keyword-map.md, platform-decision.md, redirect-map-draft.csv)
    p4/ (sitemap/, prototype/ with build.py, ia-sitemap.md, tools/)
    proposal/ (<client>-web-seo-proposal.html/.pdf, <client>-prototype.html, <client>-sitemap.png, qa/)
```

- Internal documents may be in Arabic or English, but say "(internal)" in the title.
- Client files must contain none of these: internal labels (V/O/W-01, "Gate", "candidate"), TODOs, or notes in HTML comments.

**Reuse the last client's files for format.** If the user has done a proposal with this skill before, ask where that workspace is and open its matching file before writing a new one: the competitor matrix, change log, Gate A report, keyword map, platform decision, IA doc, prototype `build.py`, proposal HTML or QA folder. Copy the *structure*, never the content.

## Bundled scripts

- They use only Node 22 and Python stdlib, and drive the system browser through CDP.
- In Git Bash on Windows, set `MSYS_NO_PATHCONV=1` before passing URL paths like `/` as arguments, or the shell rewrites them into Windows paths.
- The browser path defaults to Edge on Windows. Override it with the env var `BROWSER_PATH` (Chrome/Chromium on macOS or Linux).
- Pass a fresh temp profile dir, and give each concurrent run its own port.

| Script | Purpose | Usage |
|---|---|---|
| `scripts/crawl.mjs` | Polite sitemap crawl. Saves raw HTML + status per URL | `node crawl.mjs <sitemap.xml> <outDir> [excludeRegex] [keepExcluded=3] [delayMs=2000]` |
| `scripts/extract.py` | Offline on-page SEO extraction → `pages.json` + summary. Covers titles, meta (incl. length), H1/H2/H3, canonical, hreflang, JSON-LD, alt, Arabic presence, CMS boilerplate, and the internal link graph (links out, inlinks, orphans) | `python -I extract.py <crawlDir> [boilerplateRegex]` |
| `scripts/keyword_check.py` | Where each page's primary keyword appears (title, H1, description, first 100 words, slug, H2, alt) + cannibalization. Arabic-normalized. Needs the keyword map as `url,keyword` CSV | `python -I keyword_check.py <pages.json> <keyword-map.csv> [out.csv]` |
| `scripts/ux_check.mjs` | Rendered-page UX/a11y checks: WCAG contrast per text element (text over images reported as unmeasured), tap targets (24 px with the spacing exception, 44 px advisory), small text, unnamed links/buttons, unlabelled fields, viewport, lang/dir, overflow. Works on local files and live URLs | `node ux_check.mjs <file.html[#hash] or url> <width> <mobile 0/1> <profileDir> [port] [out.json]` |
| `scripts/schema_check.py` | JSON-LD in raw HTML: types (incl. `@graph`), retired Google features (FAQPage, HowTo, SearchAction…), missing key properties, Offer price/currency/availability format, relative URLs, placeholders, invalid JSON | `python -I schema_check.py <crawlDir or file.html …> [out.json]` |
| `scripts/ai_access.py` | robots.txt access per AI crawler, split by purpose (search / user-triggered / training), using RFC 9309 group and longest-match rules. Does not see WAF blocks | `python -I ai_access.py <https://site or robots.txt> [path=/]` |
| `scripts/shot.mjs` | Full-page screenshot (RTL-safe) + overflow and broken-image report. Supports `file.html#hash` | `node shot.mjs <in.html[#hash]> <out.png> <width> <dpr> <mobile 0/1> <profileDir> [port]` |
| `scripts/route-test.mjs` | Click-through test for a single-file prototype, driven by a JSON steps file | `node route-test.mjs <prototype.html> <steps.json> <profileDir> <width> <mobile 0/1> [port]` |
| `scripts/pagecheck.mjs` | Per-page fit check for fixed A4 `.page` layouts | `node pagecheck.mjs <in.html> <profileDir> [footerReservePx=62] [port]` |
| `scripts/export-pdf.mjs` | Local print to tagged PDF, with optional print CSS injected at runtime | `node export-pdf.mjs <in.html> <out.pdf> <print.css or -> <profileDir> [scale=1] [port]` |
| `scripts/scan_language.py` | Scans client text for impact language, promises, commercial terms, excluded claims, competitor names and leaks | `python -I scan_language.py <proposal.html> [config.json] > language-scan.txt` |

`scan_language.py` takes a per-client config listing `competitors` and `excluded_claims`. Keep that config in the client's workspace, not here. Every hit must be removed or justified in the QA report.

## Before you hand over

Run the full checklist in evidence-and-qa.md. Then hand over:
- The file paths.
- What was checked, with results (e.g. "26/26 numbers match raw data", "11/11 click tests at 390/1440").
- The items the user must still close: links blocked to automation, facts only the client can confirm, and the decision to send.
