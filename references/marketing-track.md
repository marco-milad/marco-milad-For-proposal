# Track M: Integrated Marketing & Digital Growth Strategy

**Goal.** The agency team has written a marketing strategy for a client, often an Arabic .docx. Turn it into a client-ready proposal that:
- keeps the team's ideas intact,
- adds an evidence layer,
- shows how the agency's services execute the strategy.

**Core lesson.** When the person building the proposal is the web lead, the first draft tends to read as a *website* proposal, because website defects are the most "provable" evidence. Clients and account teams reject that.
- The team strategy is the narrative spine.
- Web is one supporting service and comes last.
- Keep web content to about 10% of the words.

## Phases and gates

| Phase | Output | Gate |
|---|---|---|
| **Plan** | Written plan (see SKILL.md "Plan first") plus one batch of decisions | User approves |
| **P0b Tool check** | Tests on neutral targets only (e.g. `example.com`): WebSearch, the PageSpeed API (the keyless quota is often exhausted, so the user runs pagespeed.web.dev manually), headless browser with mobile emulation, Python stdlib. Also take a SHA-256 baseline of the originals | Short report, with a fallback for each failed tool |
| **P1 Evidence** | Three parallel read-only research streams (below), each writing to `research/` | **Gate A:** user reviews the evidence summary and confirms the official social profiles |
| **P2 Strategy audit** | `strategy-change-log.md`, unit by unit (S1.1…S10.x). Each unit: original text quoted verbatim → disposition (Keep / Clarify / Source-needed / Extend / Flag) + reason → proposed rendering | **Gate B:** user and team approve |
| **P3 Storyline** | `proposal/outline.md`, listing every section with the evidence IDs behind it | **Gate C** |
| **P4 Build** | HTML in the agency's visual identity. Reuse the newest past proposal's tokens and components; fix their mobile/accessibility gaps | **Checkpoint D:** mobile + desktop screenshots |
| **Revisions** | Gap analysis when the direction is off (see "Diagnosing a website-led draft"). Then v2, v3…; archive the old versions | Each version approved |
| **Arabic-first build** | RTL HTML with the team's Arabic text **verbatim**. Verify it by script against paragraphs extracted from the docx. Use authentic images: the client's real product photos and the agency's genuine portfolio, never stand-in projects | Approval |
| **Exports** | PDF via local print. Editable PPTX via pptxgenjs, only after an approved isolated install (see rtl-bidi-gotchas.md) | **Gate E:** final sign-off; the user sends |

## P1 research streams

Run up to three subagents in parallel, if the user approves. Each writes its own file. Every entry carries a label, URL, access date and tool.

**Stream A: client website audit → `research/website-audit.md`.**
- Page inventory, then W-records (W-01…) using the template in evidence-and-qa.md.
- Typical findings:
  - default CMS pages left live
  - placeholder blocks
  - swapped or wrong page content
  - broken or malformed links
  - missing meta descriptions or JSON-LD
  - mobile overflow
  - English only, with no hreflang
  - no per-product inquiry path
  - empty modules indexed
  - company facts that disagree across pages
- Also include a sample of product-page depth and a downloads inventory.
- Platform signals: generator meta, CMS info pages, asset paths.

**Stream B: competitors → `research/competitor-matrix.md`.**
- Only the competitors named by the team. Add none without evidence and approval.
- The client appears as a reference column.
- Check robots.txt first and respect crawl-delay. Make requests one at a time, at least 3 s apart.
- Score every site on the same 14 criteria:
  1. reachability
  2. platform/CMS
  3. languages (full Arabic? RTL? switcher?)
  4. stated business scope (quote it)
  5. brands/partners listed
  6. catalog depth
  7. technical/educational content
  8. lead capture (presence only; never submit)
  9. downloads
  10. eCommerce
  11. trust signals (as they state them)
  12. social links
  13. homepage title / meta description / JSON-LD / hreflang
  14. viewport
- Add one row for the client's signature brand or topic ("does the competitor mention X?").
- End with **neutral patterns** ("2 of 4 have a Get-a-Quote path") and **I-labelled opportunities**.
- No traffic, ranking or market-share claims.

**Stream C: social, search and fact verification → `research/social-search-footprint.md`.**
- Inventory the social links in the site's DOM. Theme defaults (e.g. GitHub or TikTok icons on a B2B supplier) are not profiles.
- Check public profiles only. Mark coverage "partial" where a login wall blocks it.
- **Officialness rule:** a profile counts as official only if it links back to the site, or matches name, logo and contacts, *and* the team confirms it.
- Search footprint: branded queries and `site:` queries. WebSearch is not geo-local, so make no local ranking claims.
- Verify the team's claims: exclusivity, founding year, size, branches, exhibitions. Give each a status. Each stays out of client copy until it is sourced.

## Strategy-to-proposal rules

- **Preserve.** Keep these from the team strategy:
  - positioning
  - audiences
  - competitive advantages
  - content mix
  - campaigns (original names and meaning)
  - the 90-day arc, presented as proposed phasing, not a commitment
  - KPIs, each marked "baseline set in discovery"
- **Trace.** Every team section must appear in the proposal or be marked "merged" in the change log. The gap analysis includes a source-to-HTML traceability matrix.
- **Attribute.** Anything that is not in the team strategy (e.g. a product line seen only on the website) is shown separately, as "also listed on the client's website".
- **Label recommendations.** The campaign-to-service mapping is "Our recommendation", with a reason for each link. Never force a link.

## A proposal outline that works (16 sections)

1. **Cover.** "Integrated Marketing & Digital Growth Strategy", agency branding.
2. **Objectives & executive summary.** Stat tiles count the strategy itself (e.g. 5 pillars · 5 campaigns · 3-month plan · N services), not client results. **No website mention.**
3. **Brand & product portfolio.** The team's groups, verbatim.
4. **Competitive advantages.**
5. **Target audiences & needs.**
6. **Competitive opportunities.** The team's points, supported by the anonymous competitor patterns.
7. **Strategic positioning & messaging.** "From X → to Y", goal, core message, directions.
8. **Content pillars & mix.** A native bar chart in the PPTX.
9. **The campaigns.** The team's concepts only. No service or website-dependency lines.
10. **How the agency's services support the strategy.** Central and major. A model that works for a full-service agency:
    - **(a) Execution model.**
      1. Foundation: Branding
      2. Create: Media Production, Photography
      3. Publish & engage: Social Media Management
      4. Amplify: Media Buying, *conditional* on landing pages + measurement
      5. Convert & measure: Web Development
      - Physical touchpoints "to explore together": Print & Manufacture, Events
    - **(b) Objectives → services map.**
    - **(c) A profile per service:** role, contribution, works-with, supports, status (Recommended / Conditional / To explore).
    - **(d) Campaign support map,** with a reason for each link.

    Adapt the service list to what the agency actually offers.
11. **90-day plan.** The team's items plus a supporting-services track.
12. **KPIs & measurement.** The team's KPIs plus secondary digital measures, with baselines from discovery.
13. **Strategic summary.**
14. **Digital experience & website recommendations.** Last and concise:
    - campaign-readiness dependencies, phrased as "unresolved" unless re-verified as fixed
    - other opportunities
    - Phase 0 / A / B / C
15. **Next steps: discovery questions.** About 15–19 questions across 7+ areas: business objectives, audience, differentiation, marketing priorities & campaigns, content & channels, service scope, measurement, budget & decision-making, digital. Website questions are a minority.
16. **How we prepared this.** Method, plus sources with access dates.

## Diagnosing a website-led draft

Symptoms:
- website lines inside campaign cards
- an executive summary that names the site as the destination of everything
- services shown as parallel cards with no execution logic
- the digital section placed before the plan and KPIs

Fix:
- move all web content to the end
- make the services section the center
- keep the campaigns as pure team concepts

## Decisions log pattern

Record each user decision as D1…Dn in the gap analysis, together with its exact copy consequence. For example:
- "Branding = Recommended, but the copy must not imply a full rebrand is approved"
- "Partnerships in general terms; no brand named as a partner, no exclusivity"
