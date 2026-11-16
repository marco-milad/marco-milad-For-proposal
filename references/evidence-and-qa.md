# Evidence discipline and QA

## Evidence labels

Put one label on every finding in the internal files. The labels never appear in client copy.

| Label | Meaning | Allowed in client copy? |
|---|---|---|
| **V** Verified | Stated on an official source of the company, or a fact the client/team supplied with a named source | Yes, except claims that are excluded until sourced |
| **O** Observed | Directly reproduced and re-checked (raw DOM, crawl, Lighthouse JSON) | Yes, phrased neutrally |
| **O-inc** Inconclusive | Blocked or ambiguous (WAF, 403, login wall, a tool artifact such as animated counters showing 0) | **No.** Also never report it as a defect |
| **I** Inference | Our reasoning from V or O | Only when framed as analysis ("this suggests…", "opportunity") |
| **R** Recommendation | What we propose | Yes, labelled as ours |
| **U** Unknown | Needs the client | Only as a discovery question |

**WebFetch-style tools return a model summary, not raw HTML.** Anything that reaches client copy must be re-checked directly, either with a raw crawl or a headless DOM dump.

## Finding record (W-record)

```
W-NN: <one-line title>
Observed: what exactly, where (URL), how many
Source: URL + access date + tool
Why it may matter: conditional wording only ("may add friction to…", "may confuse…")
Confidence: High / Medium / Low, and why
Validation: how to confirm (browser re-check, client analytics, user test)
Next step: the fix + a rough effort class (small / medium / large; no price, no date)
```

## Banned without the client's own data

The following stay out of client copy unless the client's own data supports them:
- "losing revenue / leads / customers"
- "hurts rankings"
- "reduces conversions"
- numeric forecasts or ROI
- "first page" or "#1" promises
- search-volume numbers (unless a real keyword tool was used and cited)

When a word from this list appears in the copy, it must be a negation ("we don't promise a specific ranking") or the name of a measurement ("average position in Search Console").

## QA pass before the final export

Write the results to `qa-report.md`. Its structure:
1. summary table of checks
2. corrections made
3. claim register
4. language-scan justifications
5. export notes
6. what remains for the user

| Check | How |
|---|---|
| **Numbers vs raw data** | Write a small `verify_numbers.py` that recomputes every number in the proposal from the raw files (`pages.json`, Lighthouse CSV/JSON, pa11y JSON, redirect CSV, sitemap) and prints MATCH or CHECK per claim. Watch for matching bugs, e.g. homepage URL equality or RSS feeds counted as pages. Target: all MATCH |
| **Calculated figures** | Recompute the decision-matrix weights (= 100%) and the totals. Recount the redirect-map categories |
| **Source links** | Check status with plain `curl` and no header spoofing. A 403 to automation goes in the report as "open manually" |
| **Source content** | Read the page behind every claim (WebFetch or WebSearch snippet) and quote the exact wording in the claim register |
| **Claim register** | Table: claim (short) → evidence file or URL → status. Every factual sentence in the proposal appears here |
| **Language scan** | `scripts/scan_language.py` with a per-client config (competitor names, excluded claims). Justify or remove every hit |
| **Leaks** | Internal labels, the agency staff's names, TODO, `[ ]`, placeholders, notes in comments: all must be absent |
| **Page fit** | `scripts/pagecheck.mjs`: every A4 page fits |
| **Images & fonts** | 0 broken images; all fonts loaded and embedded in the PDF |
| **Contrast** | Compute WCAG AA by script: ≥ 4.5:1 for small text. Small grey header and footer text are the usual failures |
| **RTL/bidi** | Visual review of every page (see rtl-bidi-gotchas.md) |
| **Responsive** | `shot.mjs` at 390 / 768 / 1440 for both languages: overflowX false, 0 broken images |
| **Originals intact** | SHA-256 of the input files matches the baseline |
| **Approved deliverables untouched** | Earlier approved versions keep their modified date and hash |
| **PDF** | Tagged (StructTreeRoot), correct lang and title, file size noted, SHA-256 noted. The hash changes on every re-export |

## Scan config example (`scan-config.json`)

```json
{
  "competitors": ["Competitor One", "Competitor Two", "directory-site.com"],
  "excluded_claims": ["وكيل", "حصري", "exclusive", "authorized", "الأفضل", "leading", "since 19"],
  "extra_leaks": ["Gate ", "W-0", "candidate"]
}
```
