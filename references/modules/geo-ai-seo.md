# Module: GEO / AEO / AI SEO

**Terms**
- **AEO:** being the direct answer (snippets, People Also Ask, voice).
- **GEO:** being understood, cited and recommended by AI search (Google AI Overviews and AI Mode, ChatGPT search, Perplexity, Copilot, Claude).

**Call it when** the user asks about AI visibility, or as part of the SEO plan §4.

**Script**
- `ai_access.py <site>` reads robots.txt and reports, per AI crawler, whether its purpose is allowed. It follows the RFC 9309 group rules.

**Output**
- `research/ai-visibility.md` (internal): access, readiness, the measured sample and the claim ledger.

## What Google says (anchor every claim here first)

Google's AI optimization guide (developers.google.com/search/docs/fundamentals/ai-optimization-guide) says:
- Optimizing for AI features **is still SEO**.
- No llms.txt, AI text files, special markup, Markdown copies or chunking are needed for Google. Google Search does not use llms.txt.
- **Eligibility for AI Overviews/AI Mode:**
  - the page is indexed and eligible for a snippet;
  - **and** the site is included under Search Console → **"Search generative AI" control** (Include by default; Exclude; Inherit). The control has no effect on ranking or training. It was rolled out to all sites on 31 Aug 2026.
- **Measurement:** the Search Console **Generative AI performance report**. It is the first first-party AI-visibility data. Ask for it in D2.

Other engines (ChatGPT, Perplexity, Claude, Copilot) do reward extractable, well-structured, well-sourced pages. "Write for people, structure for clarity" serves both camps. Never create separate "AI versions" of pages: that risks Google's scaled-content-abuse policy.

## 1. Access: the right bot for the claim

Report training, search and user-triggered access on **separate lines**. Blocking a training bot does not remove a site from AI search.

| Vendor | Search / citation | User-triggered fetch | Training | Official doc |
|---|---|---|---|---|
| Google | `Googlebot` (AI Overviews/AI Mode follow Search; opt out via the Search Console control, `nosnippet` or `noindex`) | `Google-Agent` and others: generally ignore robots.txt | `Google-Extended` (a control token, not a crawler: Gemini Apps/Vertex training + grounding; no effect on Search) | developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers |
| OpenAI | `OAI-SearchBot` (ChatGPT search answers) | `ChatGPT-User` (robots.txt "may not apply") | `GPTBot` | developers.openai.com/api/docs/bots |
| Anthropic | `Claude-SearchBot` | `Claude-User` | `ClaudeBot` | support.claude.com, article 8896518 |
| Perplexity | `PerplexityBot` | `Perplexity-User` (generally ignores robots.txt) | — (PerplexityBot is not used for foundation training) | docs.perplexity.ai/guides/bots |
| Apple | `Applebot` (Siri/Spotlight/Safari) | — | `Applebot-Extended` (opt-out token only) | support.apple.com/en-us/119829 |
| Common Crawl | — | — | `CCBot` (an open dataset widely used for training; our classification) | commoncrawl.org/ccbot |

**Rules**
- **RFC 9309.** A crawler obeys only the most specific group that names it. If a `GPTBot` group exists, the `User-agent: *` rules no longer apply to GPTBot. Use bare tokens.
- **robots.txt ≠ WAF.** A CDN/WAF bot block or a challenge page is a separate gate. Allow *verified* bots (published IP lists, Web Bot Auth), not user-agent strings. Keep CAPTCHAs off content pages.
- **Private content needs authentication, not robots.txt.** User-triggered agents may ignore robots.txt.
- **The policy is the client's decision.** Show the options:
  - allow search, block training
  - allow all
  - block all

  Default suggestion for a business that wants visibility: **allow search and user-triggered access**, and let the client decide on training.
- These tokens change. Re-check the official pages before each proposal and write the check date in the internal file.

## 2. Readiness (on the site)

| Check | Why |
|---|---|
| Main content and links in the raw HTML (no JS-only content) | Many AI fetchers don't render JS |
| Every critical fact (what the business sells, where, prices/delivery/payment for e-commerce, contact details) is **visible text**, not only JSON-LD or images | Agents often don't read JSON-LD; proof inside images isn't extractable |
| Answer-first sections: the question as an H2, then a direct answer in the first 40–60 words, then the details | Extractable passages. This is a heuristic for non-Google engines; Google says no chunking is needed |
| Volatile facts are dated ("prices as of Nov 2026") and sources are cited | Freshness and trust |
| **Entity consistency.** The same name, description, NAP and category on the site, GBP, social profiles, directories and Wikipedia/Wikidata (if notable) | AI answers lean on consensus across sources |
| Real 404s; a 429 with `Retry-After` instead of a challenge page | Agents can tell "doesn't exist" from "try later" |
| `llms.txt` | **Optional, zero weight.** Google ignores it, and there is no evidence of real use by other engines. Mention it only as a low-cost extra |

## 3. Presence beyond the site

Recommendation in AI answers is driven by **third-party consensus**, not by the site itself.

- **Audit the brand's footprint:**
  - Google Business Profile and reviews
  - marketplaces and directories
  - YouTube, LinkedIn, Facebook and Instagram
  - Reddit and Quora where relevant
  - Arabic forums and Facebook groups
  - press
  - Wikipedia/Wikidata, only if the business is genuinely notable; never create self-promotional entries
- **Classify each cited source:**
  - owned
  - competitor
  - earned editorial
  - institutional
  - social
  - marketplace/directory

## 4. Measuring AI visibility (an indicator, not a rate)

- **The prompt portfolio.** 10–20 revenue-relevant prompts, written in **each language separately** from native demand (Arabic prompts are not translations of the English ones). Spread them across the buying stages: problem → solution → shortlist → compare → choose. It has three cohorts:
  - **Core:** the prompts you report on. Change them only by versioning.
  - **Exploratory:** these rotate.
  - **Controls:**
    - the brand-name prompt, which should always cite the brand;
    - an unrelated-category prompt, which should never cite it.

    If the controls move, the tool or engine changed, not the client's visibility.
- **Engines.** Google AI Overviews/AI Mode, ChatGPT search, Perplexity, plus Copilot/Claude if relevant.
- **Repeat runs.** Answers are non-deterministic, so run each prompt **3–5 times**. Report "cited 2/5 (n = 5, 18 Nov 2026, ChatGPT search, Arabic)", never a single screenshot as a rule.
- **The visibility ladder.** Record the highest rung reached, and the framing (favorable / neutral / hedged / negative):
  1. retrieved
  2. cited
  3. mentioned
  4. recommended

  "Recommended against" is also possible.
- **The claim ledger.** One row per claim an AI makes about the client. The verdicts:
  - accurate
  - incomplete
  - ambiguous
  - stale
  - false
  - subjective
  - unverifiable

  Fix order:
  1. the client's own page that owns the fact
  2. the client's profiles
  3. third-party corrections
  4. retest after 4–8 weeks

  Never promise that a fix changes the AI's answer.
- **A versioned portfolio.** Never compare periods measured with different prompt sets.
- **First-party data, when D2 exists.** The Search Console Generative AI performance report, and in GA4 a custom "AI assistants" channel group (referrals from chatgpt.com, perplexity.ai and others). Treat the GA4 channel as a **floor**: AI influence also shows up later as branded search and direct visits.

## Honesty rules

- The Princeton GEO study's percentage uplifts were measured in a lab setup. Don't quote them as expected client results.
- Vendor statistics (Ahrefs, Semrush, BrightEdge, Profound and others) are internal context only, with the source and date. Never put them in client copy as facts about the client.
- Our readiness scores are our own heuristic, and the report must say so. They are not a citation rate.
