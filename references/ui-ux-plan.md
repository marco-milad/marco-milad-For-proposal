# UI/UX plan: from audit to a validated prototype

A topic-by-topic checklist for the user-experience and interface side of a redesign. Each topic gives:
- **Check:** how to audit the current site (or competitors, for greenfield), and which tool.
- **Plan:** what goes into the IA, prototype and proposal.
- **Needs from user:** data only the user or the client can provide. **"None"** means you can do it from public data alone.
- **If missing:** how to proceed honestly without it.

Use it inside Track W: P1 audits, P4 designs and checks, P5 explains the decisions. It also works on its own as a UX review of an existing site.

Deeper modules:
- [modules/information-architecture.md](modules/information-architecture.md): IA, content inventory, labels, URL map, tree tests.
- [modules/frontend-design.md](modules/frontend-design.md): a distinctive UI, the direction plan, generic patterns to avoid, tokens.
- [modules/cro.md](modules/cro.md): conversion, forms, tracking.
- [modules/report.md](modules/report.md): scoring and the audit PDF.

It pairs with [seo-optimization-plan.md](seo-optimization-plan.md). Structure, speed and accessibility serve both, so run the audits once and cite the same evidence.

## Ground rules for UX claims

- **An expert review is inference, not user research.**
  - Heuristic findings are **I** ("may add friction…").
  - Only real data (analytics, recordings, user tests, sales-team feedback) makes a finding **V** or **O**.
  - Never write "users are confused" without that data.
- **No conversion promises.** Don't write "this layout will raise leads by X%". Write what each design decision is for and how it will be measured after launch.
- **Every design decision has a reason.** Each one traces to:
  - an audit finding
  - the client's goal
  - the team strategy (audience segments)
  - a standard (WCAG, platform conventions)

  "It looks modern" is not a reason.
- **Real content beats placeholders.** Use the client's real products, real photos and real copy where they exist. Mark anything illustrative in the internal IA doc (not on the prototype itself).

## Collect the data first: one batch request

Send it in one message with the SEO data request (seo-optimization-plan.md D1–D13). Some items overlap with it; ask for each item once.

| # | Data / access | Feeds topics | Type | If missing |
|---|---|---|---|---|
| U1 | **The site's main goal and the one action that matters** (quote request, purchase, call/WhatsApp, booking) | Conversion paths, CTA hierarchy, measurement | Blocking | Ask in Phase 0; a redesign without it optimizes nothing |
| U2 | **Who the visitors are**: segments, B2B/B2C, what they come to do. The team strategy's audience section counts | IA entry paths, home sections, copy tone | Strengthens | Derived from the strategy + keyword map, labelled I |
| U3 | **Brand assets**: logo (vector), colors, fonts, any brand guidelines | Design system (UI) | Blocking for the final look | Prototype uses a neutral palette derived from the logo; final look waits |
| U4 | **Real product/project photos** (originals) + the product list with specs | Product templates, gallery, trust | Strengthens | Existing site images; list the photography still needed |
| U5 | **GA4 / analytics access**: top landing pages, devices split, exit pages, funnel steps | Prioritizing templates, mobile-vs-desktop weight, the drop-off points | Strengthens | No behaviour claims; "mobile first" justified by the market, not their data |
| U6 | **Heatmaps or session recordings** (Microsoft Clarity, Hotjar), if installed | Real friction evidence (rage clicks, dead clicks, scroll depth) | Strengthens | Recommend installing Clarity (free) at launch for a baseline |
| U7 | **Sales/support team's top customer questions and complaints** (WhatsApp, calls, email) | FAQ, product page content, microcopy, objections | Strengthens (high value) | Questions from the keyword map's question tier |
| U8 | **How leads/orders are handled today** (who answers, which channel, response time, CRM/ERP) | Form fields, WhatsApp vs form, thank-you page, integration | Strengthens | Simple form + WhatsApp; integration becomes a discovery item |
| U9 | **Trust facts with proof**: certifications, authorized-dealer letters, client logos with permission, reviews, years in business | Trust sections, "in numbers" strip | Strengthens | Excluded until sourced (SKILL.md rule) |
| U10 | **Sites the client likes or dislikes**, and why | Visual direction, avoiding a rejected style | Strengthens | Direction from the brand + market conventions |
| U11 | **Who edits the content after launch** and their skill level | CMS design: blocks, fields, what is fixed vs editable | Strengthens | Discovery question |
| U12 | **Access to 3–5 real customers or the sales team for a 15-minute test** of the prototype | Validation | Strengthens | Validation = the user's own walkthrough + automated checks, labelled as such |

## 1. UX audit of the current site

| Topic | Check | Plan | Needs | If missing |
|---|---|---|---|---|
| **Heuristic review** | Walk the key journeys (home → category → product → conversion; search; language switch; contact) on a 390 px phone and on desktop. Score them against the 10 usability heuristics:<br>1. Visibility of system status<br>2. Match with the real world<br>3. User control and freedom<br>4. Consistency and standards<br>5. Error prevention<br>6. Recognition rather than recall<br>7. Flexibility and efficiency<br>8. Aesthetic and minimalist design<br>9. Help users recover from errors<br>10. Help and documentation<br><br>Screenshot every issue | Findings as W-records (evidence-and-qa.md), each with the heuristic, severity and screenshot.<br>- **Score each heuristic 0–4**, with evidence; n/a is allowed.<br>- **Severity:** P0 blocks the task · P1 major (any WCAG AA failure) · P2 minor · P3 polish.<br>- **Blind first, tools second.** Do the expert review before reading the `ux_check`/pa11y output, then merge the two. Tool output anchors judgment | None | — |
| **Cognitive walkthrough** (the conversion flows: quote, checkout, WhatsApp, language switch) | For every step, ask four questions:<br>1. Will the visitor try to do the right thing?<br>2. Will they notice the control?<br>3. Will they connect the control to their goal?<br>4. After acting, will they see progress?<br><br>Rate each answer Likely / Possible / Unlikely | Every "Unlikely" becomes a finding with a fix | None | — |
| **Stress personas** | Walk the flows as each of these:<br>- a first-time visitor<br>- a one-handed phone user on a slow network<br>- a screen-reader user<br>- a "stress tester" (very long names and addresses, double-clicks, back button mid-flow, empty search) | Robustness findings | None | — |
| **SERP-first check (SXO)** | For each key template's primary keyword, classify the page types ranking in the top 10. One type above 60% = strong consensus. A template whose type doesn't match the consensus (e.g. an article where Google shows product listings) is a high-severity mismatch. Personas come only from SERP evidence (People Also Ask, ads, related searches) or U2, never invented | The page type and sections chosen per template | None (SERP sample is an indicator) | — |
| **Journey friction** | Count clicks from home to a product and to the conversion. Note dead ends, links that leave the site, empty or placeholder pages, broken or `#` links (`extract.py`) | Target: any product reachable in ≤ 3 clicks or one search; no exits mid-journey | U5 for real paths | Paths walked by us, labelled I |
| **Automated UX/a11y scan** | `scripts/ux_check.mjs` on 4–6 representative pages at 390 (mobile) and 1440:<br>- contrast pairs<br>- tap targets<br>- small text<br>- unnamed buttons/links<br>- unlabelled fields<br>- viewport, lang/dir<br>- overflow<br><br>Add pa11y for WCAG 2 AA | Fix list; the same script re-run on the prototype proves the fixes | None | — |
| **Behaviour data** | GA4: device split, top landing pages, exit pages. Clarity/Hotjar: rage clicks, dead clicks, scroll depth | Prioritize the templates and sections people actually use | U5, U6 | No behaviour claims; recommend measurement at launch |
| **Competitor UX patterns** | Same journeys on the team's competitors. Note patterns only (search, quote flow, Arabic, WhatsApp, trust) | Anonymous patterns in client copy ("2 of 4 offer a quote basket") | Competitor list | — |

## 2. Information architecture and navigation

| Topic | Plan | Needs |
|---|---|---|
| **Entry paths** | At least two ways in, matching how people think:<br>- by **product family**, for buyers who know what they want<br>- by **use case / industry / problem**, for buyers who need guidance<br><br>Tie the second path to the strategy's audience segments | U2 |
| **Depth** | Any product ≤ 3 clicks from home (home → family → product), plus site search with suggestions | Product list (U4) |
| **Header** | Desktop:<br>- logo<br>- a mega menu for large catalogs<br>- 4–6 top items<br>- search<br>- the primary CTA as the only filled button<br>- a top bar with contact details and the language switch<br><br>Mobile:<br>- logo, search, CTA icon, menu<br>- a floating WhatsApp button where the market uses it | U1 |
| **Footer** | Families, company, NAP identical to Google Business Profile, language switch, legal | NAP (SEO D7) |
| **Remove** | CMS leftovers (sign-in, empty blog/forum), links that send visitors to other sites mid-journey, duplicate menus | None |
| **Language switch** | Opens **the same page** in the other language, not the home page. Mirrors hreflang | None |
| **Breadcrumbs** | On every page below home; also BreadcrumbList schema | None |

Output: the sitemap mind map + `ia-sitemap.md` (web-seo-track.md P4).

## 3. Page templates and conversion design

| Topic | Plan | Needs |
|---|---|---|
| **One goal per page** | Each template has one primary action (e.g. Request a Quote / Add to Cart) and one fast alternative (WhatsApp / call). Every other button is visually secondary | U1 |
| **Home** | Start from the 16-section outline in web-seo-track.md. A 9-section home tends to feel thin. Order sections by the visitor's questions: what is this → do they have my thing → why trust them → how do I start | U2, U9 |
| **Product (B2B)** | Component list in web-seo-track.md: summary, quick facts, specs, applications, FAQ, related, help card. Add a sticky mobile bar with the primary action + WhatsApp | U4, U7 |
| **Product (B2C / e-commerce)** | Above the fold on mobile:<br>- gallery<br>- price<br>- variant pickers (color/size)<br>- stock state<br>- delivery time and cost<br>- payment options<br>- add to cart<br><br>Below: details, size/fit guide, reviews, returns in one line with a link. Sticky add-to-cart on mobile | U4, U8 |
| **Category / listing** | Filters that match how buyers choose, sorting, product cards with the key fact, an empty-state message, pagination or load more | Product data |
| **Cart and checkout (B2C)** | Show the shipping cost before the last step, guest checkout, the fewest fields possible, payment methods with any fees explained, an order summary on every step, and clear errors at the field | U8 |
| **Quote / lead form (B2B)** | The fewest fields that the sales team actually needs. A quote basket for multi-product requests. A thank-you page that says who will reply, on which channel, and when | U8 |
| **Trust** | Real facts only: years, certifications, brands carried, client logos with permission, reviews, address + map, real team photos | U9 |
| **Empty, error and loading states** | 404 with search + popular links, form errors in plain language, loading skeletons, an "out of stock" with an alternative or "notify me" | None |

## 4. Visual design system (UI)

| Topic | Plan | Needs | If missing |
|---|---|---|---|
| **Tokens** | Define colors, type scale, spacing, radius and shadow as CSS variables once. Build every component from them | U3 | Neutral palette from the logo |
| **Color** | One brand color for the primary action only; neutrals for text and backgrounds; semantic success/error colors. Every text pair ≥ 4.5:1 (≥ 3:1 for large text), checked by `ux_check.mjs`, not by eye | U3 | — |
| **Typography** | A Latin font + a purpose-built Arabic font with matching weight (e.g. IBM Plex Sans Arabic, Cairo, Tajawal, Noto Kufi/Naskh). Body ≥ 16 px on mobile; Arabic line-height ≈ 1.7–1.9; at most 2 families per script | U3 | — |
| **Hierarchy** | One H1 per page; a visible size and weight step between levels; the primary CTA is the most prominent element above the fold | None | — |
| **Imagery** | Real photos first. A consistent crop ratio per component. Stock images only for abstract sections, marked internally | U4 | List the photography needed |
| **Icons** | One icon set, one stroke weight, always with a text label for navigation actions | None | — |
| **Components** | Buttons (primary/secondary/text), inputs, cards, badges, tabs, accordion, breadcrumb, carousel (swipeable, never auto-advancing for key content), sticky bars | None | — |

## 5. Mobile-first, RTL and bilingual

- **Design order.**
  - Design at 390 px first, then 768 and 1440.
  - Thumb zone: primary actions within reach at the bottom.
  - Carousels swipe; grids collapse to 2 columns for stats and 1 column for content.
- **Tap targets.** ≥ 24×24 px is the WCAG minimum, and the spacing exception is handled by `ux_check.mjs`. Aim for 44×44 on primary actions.
- **Forms.** No horizontal scroll and no text under 12 px. Inputs ≥ 16 px, so iOS doesn't zoom. The right keyboard per field (`type=tel`, `inputmode=numeric`).
- **RTL and bilingual.**
  - Arabic is a full version, not a translation layer.
  - Use logical CSS properties.
  - Mirror directional icons (arrows, chevrons), but not logos, media controls or numbers.
  - Wrap mixed Latin + number tokens in `<bdi>`.
  - See [rtl-bidi-gotchas.md](rtl-bidi-gotchas.md).
- **Numerals.** Pick Western or Arabic-Indic digits per market and use them consistently, especially in prices and phone numbers.

## 6. Accessibility

- **Target:** WCAG 2.2 AA. It overlaps heavily with good UX and SEO.
- **Automated:** `ux_check.mjs` + pa11y. They catch contrast, names, labels, target size and lang/dir.
- **Manual:**
  - keyboard-only walk: focus visible, logical order, no traps
  - zoom to 200%
  - alt text that describes, not decorates
  - motion: respect `prefers-reduced-motion`
  - no information carried by color alone
- **WCAG 2.2 items that hit our layouts:**
  - **2.4.11 Focus Not Obscured.** Sticky headers, sticky mobile CTA bars and the floating WhatsApp button must not cover the focused element. Use `scroll-padding`.
  - **3.2.6 Consistent Help.** Contact, WhatsApp and FAQ links sit in the same relative place on every page.
  - **3.3.7 Redundant Entry.** E.g. "billing same as shipping" at checkout.
  - **2.5.7 Dragging Movements.** Carousels and sliders need buttons too.
  - **3.3.8 Accessible Authentication.** Allow paste in password and OTP fields.
  - 4.1.1 Parsing is obsolete. Don't report it.
- **Non-text contrast ≥ 3:1** for input borders, focus rings, icons that carry meaning, and chart lines.
- **Built-in patterns:**
  - a skip link to `<main>`
  - `aria-expanded` on the menu button
  - native `<dialog>.showModal()` for modals (focus trap and Esc for free)
  - `role="status"` for form-sent messages
  - hover effects only under `@media (hover:hover)`
- **Screen-reader spot check:** NVDA + Chrome, then VoiceOver + Safari (iPhone), then TalkBack.
- **Accessibility overlay widgets are not a fix.** They are a legal and usability liability. Advise against them if a client asks.
- **Honesty.** Automated tools find only part of the issues, so report the result as "automated checks pass", never "fully accessible".

## 7. Speed as UX

A slow first screen is a UX problem before it is an SEO one. Use the Lighthouse findings from seo-optimization-plan.md §1:
- hero image priority
- no layout shift (reserve image and banner space)
- fonts with `font-display: swap`
- no blocking pop-ups on mobile

## 8. Content and microcopy

| Topic | Plan | Needs |
|---|---|---|
| **Answer the real questions** | Turn the sales team's frequent questions (U7) into product content, FAQ and microcopy near the action (delivery, payment, warranty, minimum order) | U7 |
| **Button labels** | A verb + an object ("Request a quote", «اطلب عرض سعر»), never "Submit" or "Click here" | None |
| **Tone** | Arabic in the register the market uses (e.g. clear Modern Standard Arabic with a local touch for Egypt), consistent across pages; English kept simple | U2 |
| **Scannability** | Short paragraphs, bullets for specs, bold for the key fact, one idea per section | None |

## 9. Prototype and validation

- **Build.** Follow web-seo-track.md P4: one generator, EN/AR, home + product. Add a third template only if the client's goal depends on it, e.g. a checkout for e-commerce.
- **Checks on every iteration:**
  - `shot.mjs` screenshots at 390/768/1440 in both languages
  - `ux_check.mjs` at 390 and 1440: 0 contrast failures, 0 crowded targets under 24 px, 0 unnamed controls, 0 unlabelled fields, no overflow
  - `route-test.mjs` for navigation
  - **Extra viewports:** 320 px, phone landscape, the OS largest text size, and reduced motion
  - **Long-string test:** labels and names 30–40% longer (Arabic often runs longer than English) don't break the layout
  - **No console errors or 404s** in the browser console during the route test
  - **Every link lands somewhere real:** no `#` and no `action="#"` in client-facing builds, except the prototype's deliberate placeholders, which are listed in the IA doc
  - **Interaction states:** every control has hover, focus, pressed and disabled states; sheets and dialogs close with Back/Esc and return focus
- **Finish review.** Before the user sees a checkpoint, run a fresh review pass, ideally by a separate agent with no build context. It ends in one verdict:
  - ship
  - fix (small items)
  - rework (structural)
  - re-evidence (claims not backed)

  The verdict is derived from the checks, not from a feeling.
- **Review rhythm.** The user reviews the screenshots on a phone, then gives feedback, then you revise. Expect "feels thin / add sections" on home.
- **Validation with real people (U12).** A 15-minute task test with 3–5 people: "find X and request a quote". Record the success, time and where they hesitated. Without U12, write "validated by expert walkthrough and automated checks". Never imply user testing that did not happen.

## 10. Measurement after launch

- **GA4 events:** the primary conversion (`generate_lead` / `purchase`), `whatsapp_click`, `phone_click`, `search`, `select_item`, `form_start` vs `form_submit` (abandonment).
- **Microsoft Clarity** (free) for heatmaps and recordings, behind consent where required.
- **Baseline first.** Report changes against the post-launch baseline. Give no target numbers without the client's own historic data.

## Deliverables

1. **UX findings** (internal, W-records): heuristic, severity, screenshot, evidence label.
2. **Design decisions table** (client-facing, P5). This is what makes the redesign defensible:

| Decision | Why (finding / goal / standard) | How we'll measure it |
|---|---|---|
| e.g. Two product entry paths | The audience has buyers who know the product and buyers who know only their job (strategy) | Use of each path in GA4 |

3. **Prototype QA numbers** for the handover line, e.g. "contrast 0 failures, 0 crowded tap targets, 11/11 click tests at 390/1440".
4. **Open items:** data not received (U-numbers), tests not run, and the photography needed.
