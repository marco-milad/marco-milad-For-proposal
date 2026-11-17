# Module: E-E-A-T and content quality

E-E-A-T stands for Experience, Expertise, Authoritativeness, Trust.

**Call it when** the user asks about content quality, E-E-A-T or "helpful content", or for the content section of the SEO plan.

**Inputs**
- Crawl / pages.json.
- D9 (proof assets).
- D10 (who writes and who is the expert).
- U7 (the customers' real questions).

**Output**
- `research/eeat-content.md`: findings, the trust-signal inventory, content briefs.

## Ground truth

- E-E-A-T is the framework Google's raters use (the Search Quality Rater Guidelines). It is **not a single ranking score**.
- Google says **Trust** matters most.
- Our sub-scores are an internal model, and the report must say so.
- Start every page review with Google's **Who / How / Why** test:
  - **Who** made this? Is it clear and credible?
  - **How** was it made? First-hand testing, real photos, data?
  - **Why** does it exist? To help visitors, or only to attract search traffic?

## Checks

| Signal | What to look for | Evidence |
|---|---|---|
| **Experience** | Real product photos (not stock), "how we use/test it", case studies, before/after, the team in the photos, original data | Images (D12), page text |
| **Expertise** | A named author or expert with a role and a bio page for guides and technical content; correct terminology; specs complete and accurate | Article bylines, `author` Person schema |
| **Authority** | Brands carried with authorization proof, certifications, associations, press, mentions on recognized sites | D9; off-page audit |
| **Trust** | Full NAP + map; real contact channels; returns, warranty, shipping and payment policies that are visible and consistent; HTTPS; privacy policy; genuine reviews (no gating); prices and stock that match checkout | Policy pages, footer, checkout |
| **Freshness** | Fast-changing pages (prices, stock, policies, "best X" guides) updated within 12 months, with a visible updated date | `dateModified`, visible dates |
| **Thin / duplicate content** | Manufacturer copy reused across products, near-identical location pages, boilerplate, placeholder text | pages.json (words, boilerplate) + spot reads |
| **Hidden text** | Text hidden by CSS/attributes that isn't collapsible UI (collapsed FAQs and tabs are fine) | Rendered DOM |
| **YMYL** | Health, finance, legal, safety, and since Sept 2025 civic topics: stricter expertise and sourcing are required | Topic review |

## Programmatic and location pages (quality gate)

- **The swap test.** If you can swap the city or industry name and the page still reads fine, it is a **doorway page**. Don't build it.
- **What a real page needs:** local or segment data that only exists for that page, such as delivery time and price for that area, local stock or branch, local testimonials, local regulations, and photos from there.
- **Many near-template pages need the user's explicit justification and a sample review before you build them.** The trigger is roughly a few dozen, but this is a judgment call, not a Google threshold.

## Content plan outputs

1. **Question bank.** Built from:
   - U7 (the sales team's real questions)
   - People Also Ask
   - the keyword map's question tier
   - review mining

   Each question gets its one owning page.
2. **Brief per template.** Each brief sets out:
   - the purpose
   - the primary keyword
   - the questions the page answers
   - the required facts and proof (photos, specs, policies)
   - the internal links
   - the CTA
3. **Voice-of-customer quote bank.**
   - **Sources:** reviews of the client and of competitors on Google Maps, Facebook, marketplaces; comments; support chats.
   - **Per quote:** source + date, the verbatim text, the theme, the sentiment.
   - **Ranking:** frequency × intensity.
   - **Confidence:**
     - High = 3+ independent sources
     - Medium = 2
     - Low = 1
   - **Where to look:**
     - 3-star reviews are usually the most honest.
     - 1-star reviews show failure modes.
     - 5-star reviews supply proof language.
     - Competitors' 4-star reviews ("I only wish…") show the gaps to own.
4. **Excluded claims name what would unlock them.** E.g. "'authorized agent' is excluded until we have the dealer letter." The client then knows exactly what to send.

## Don'ts

- No word-count targets. Google says not to write to a word count. Length follows the question.
- Readability scores (e.g. Flesch) are a writing aid, not a ranking factor.
- Never fabricate an author, credentials, reviews or "as seen in" logos.
