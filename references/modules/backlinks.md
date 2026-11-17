# Module: Backlinks and off-page

**Call it when** the user asks about backlinks, authority, link building or digital PR, or for the off-page part of the SEO plan.

**Inputs**
- D4 (Ahrefs/Semrush or similar).
- D2 (Search Console Links).
- D9 (real relationships and assets).
- D13 (past link work, disavow file, manual actions).

**Output**
- `research/backlinks.md`: profile, gaps, risks, the earned-link plan, data limitations.

## Data sources and confidence

| Source | Access | Confidence | Gives |
|---|---|---|---|
| Ahrefs / Semrush / Majestic / Moz (paid) | D4 | High (but each tool sees a different sample) | Referring domains, anchors, new/lost, competitor gap |
| Ahrefs Webmaster Tools (free for verified sites) | The client verifies the site | High for their own site | Same, for the client's own site only |
| Search Console → Links | D2 | High, but a sample (top linking sites and pages) | Top linking sites, top linked pages, anchor text |
| Bing Webmaster Tools → Backlinks | Client access, or import from GSC | Medium | Linking domains, competitor comparison |
| Moz free API / Common Crawl web graph | Free | Low–medium (partial, delayed) | Rough domain-level presence |
| Manual: search operators, mentions | Free | Low | Unlinked mentions, obvious sources |

**Data-sufficiency gate.** Score the profile only with a paid tool or GSC data. With only free partial sources:
- write "**Backlink profile: not assessed (insufficient data)**";
- list what was seen;
- give no score and no DR/DA/authority figure.

## What to analyze (when data allows)

1. **Profile:** referring domains (not raw link count), the follow/nofollow mix, the trend over time.
2. **Quality and relevance:**
   - Do links come from the same industry, country and language?
   - Are they real sites with traffic, or link farms?
3. **Anchors:**
   - The mix of branded / URL / generic / partial-match / exact-match.
   - Flag patterns that look manipulated, e.g. many exact-match commercial anchors from unrelated sites.
   - There is no "healthy percentage" from Google. Don't quote a target ratio.
4. **Top linked pages:** linked pages that return **404 or redirect chains** → reclaim them with a 301 to the closest live page. Often the quickest win, and critical during a migration (see the redirect map).
5. **Competitor gap** (paid data only): domains that link to 2+ competitors but not to the client, filtered for relevance.
6. **Risk:**
   - paid-link footprints
   - PBN patterns
   - sitewide footer links from unrelated sites
   - a sudden spike in links
   - any manual action in GSC (D13)

   A disavow file is a last resort for manual actions or clear link schemes, not a routine clean-up.

**Link status taxonomy when you verify links**

| Status | Means |
|---|---|
| Live | Found, and the page is indexable |
| JS-only | Can't verify without rendering. **Not "removed"** |
| Blocked (403/429/WAF) | Could not check. **Not "lost"** |
| Server error | Could not check. **Not "lost"** |
| Removed | Page live, link gone |
| Nofollow | The link has `rel` nofollow/ugc/sponsored, **or** the page's meta robots is nofollow |

## Earned-link plan (what we propose)

Google's spam policies forbid link schemes:
- buying or selling links
- excessive exchanges
- large-scale guest posting with keyword-rich anchors
- automated links

Plan only what the client could show publicly.

| Tactic | Needs | Notes |
|---|---|---|
| **Supplier / brand / partner pages** ("where to buy", "our distributors") | D9 | Usually the most relevant links a reseller or importer can get |
| **Associations, chambers of commerce, industry bodies, events** | D9 | Membership and sponsorship listings, speaker pages |
| **Unlinked brand mentions** → ask for a link | Search | Polite, one contact per site. The client or agency sends it; never the agent |
| **Broken-link reclamation** (the client's own 404s that have links) | Link data | 301 map |
| **Linkable assets**: buying guides, spec comparisons, original data, calculators, Arabic resources that don't exist yet | D10 | Arabic content gaps are a real opportunity in many niches. Validate with a SERP sample first |
| **Digital PR around real news** (openings, new brand lines, data) | Client facts + proof | No invented "studies" |
| **Guest articles** | D10 (a real expert) | A few, relevant, branded or natural anchors; `rel="sponsored"` if paid |
| **Forums and communities** | D10 | Helpful answers by a named person. The value is mentions and brand searches, not the link |
| **Local listings** | See [local-seo.md](local-seo.md) | Citations are mostly nofollow, so their value is local relevance and consistency |

**Measurement.** Referring domains from relevant sites over time, branded search impressions (GSC), referral traffic (GA4). **No DR or traffic targets.**
