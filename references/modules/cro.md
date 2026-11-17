# Module: CRO (conversion rate optimization) and conversion tracking

**Call it when** the user asks to improve conversions, forms, checkout, landing pages or tracking, or for P4/P5 of a redesign.

**Inputs**
- **U1** (the one action that matters).
- **U5/U6** (analytics, heatmaps).
- **U7** (objections).
- **U8** (how leads and orders are handled).

**Output**
- `research/cro.md`: page reviews, the form spec, the tracking audit and plan, the test backlog.

**Honesty.** No uplift percentages, no benchmark conversion rates, no "each extra field costs X%". Those figures are unsourced or don't transfer between markets. Every change gets a reason and a measurement, never a forecast.

## 1. Page review order (highest leverage first)

| # | Check | Pass when |
|---|---|---|
| 1 | **Value clarity (5-second test)** | A stranger can say what is sold, for whom and where, after 5 seconds on the first screen |
| 2 | **Headline** | Names the category and the buyer. No slogan, no question |
| 3 | **Primary action** | One primary CTA per page (verb + object: «اطلب عرض سعر», "Add to cart"). The same wording everywhere it appears. Visible on the first mobile screen. A fast alternative (WhatsApp/call) is secondary |
| 4 | **Hierarchy** | The eye goes headline → proof → action. Nothing competes with the primary CTA |
| 5 | **Trust near the action** | Delivery time and cost, payment methods (COD/InstaPay/cards), returns, warranty, real reviews: **next to** the button, not only on a policy page |
| 6 | **Objections** | The top 5 objections from U7 / the VOC bank are answered on the page |
| 7 | **Friction** | Unneeded steps, surprise costs, forced sign-up, slow load, pop-ups |

**Continuity across a funnel.** Each step should follow from the last:
- an ad's promise → the landing headline;
- the product page price → the cart price;
- delivery cost shown before the final step.

For each step, write: the primary action, the next step, the exit points, the friction, the trust elements.

**Page-type notes**
- **Home:** serves visitors who are ready (fast path to products and CTA) and visitors who are researching (why trust us, how it works).
- **Landing pages for ads:** message match with the ad, a single CTA, navigation minimized.
- **Product (e-commerce):** price, variants, stock, delivery and payment above the fold on mobile. Sticky add-to-cart. No fake timers or "only 2 left" unless true.
- **Product (B2B):** "Add to quote" + WhatsApp. Say how the quote arrives and how fast.

## 2. Forms (quote, contact, checkout)

- **Every field must be justified:** needed before we can help? obtainable another way? askable later? If not, remove it.
- **Order:** easy fields first, sensitive ones last. Single column. Labels always visible (a placeholder is an example, not a label).
- **The right input types:**
  - `type=tel` + `inputmode=numeric` for phones;
  - the country code preset (+20 / +966 / +971);
  - `autocomplete` attributes.
- **Long forms:** more than ~6 fields → steps with "step X of Y", back navigation and saved progress.
- **Validation:**
  - inline, on blur (not on every keystroke);
  - errors next to the field, specific, never clearing the input;
  - on submit, focus the first error (with `aria-invalid` + `aria-describedby`).
- **Button:** action + outcome («ابعت طلب عرض السعر»).
- **Near the form:** a privacy line, the expected reply time, who will contact them and on which channel.
- **After submit:** loading → success with the next steps (and a WhatsApp shortcut) → a recoverable error state.
- **Checkout (B2C):**
  - guest checkout;
  - shipping cost before the last step;
  - payment fees explained (e.g. COD collection fee);
  - an order summary on every step;
  - address fields in the local format (governorate → city/area → street → landmark);
  - "billing same as shipping" (WCAG 3.3.7 Redundant Entry).

## 3. Pop-ups and interruptions

- **Default: none on mobile entry.** Google's intrusive-interstitial guidance applies.
- **If used:**
  - click-triggered or exit-intent (desktop) / scroll ≥ 50%;
  - **at most once per session**;
  - remember the dismissal for 7–30 days;
  - never shown to people who already converted, or during checkout;
  - a visible close button and a neutral "no thanks" (no confirmshaming);
  - Esc closes it, focus is trapped, then returned;
  - on mobile, a bottom sheet, not a full-screen takeover.
- **Several pop-ups:** write explicit rules so they never stack.

## 4. Conversion tracking audit

**A conversion = a confirmed success** (the order is stored, the lead is received), never a button click.

| Check | How |
|---|---|
| Tags present, and no duplicates | Search the page source for `GTM-`, `G-`, `AW-`, `fbq('init'`, the TikTok pixel. Two GA4 configs or two pixels = double counting |
| **Presence ≠ coverage** | A pixel that only fires PageView measures nothing. List which events actually fire (Tag Assistant/DebugView by the user, or network requests in a headless run) |
| Server-side sending exists? | Ask (CAPI, sGTM, the platform's native integration). It is invisible in the page, so "no tag seen" ≠ "no tracking" |
| Fires on confirmed success | The thank-you page needs a guard against reloads and direct visits (fire once per order ID). Better: fire from the confirmed-order state |
| **WhatsApp/phone clicks** | Track them as `whatsapp_click` / `phone_click`, but report them as **intent**, not leads. Confirmed leads come from the CRM/WhatsApp inbox count |
| Consent | The consent banner works, defaults are set, and the update is actually wired. No PII sent to analytics |
| Click IDs survive redirects | Open the site with `?gclid=TEST&utm_source=test`. Follow the http→https, www and trailing-slash hops; check that the parameters survive |
| UTM hygiene | Lowercase, hyphens, one spelling per source, no PII. A custom GA4 channel group, e.g. "AI assistants", WhatsApp, newsletter |

**Scoring.** Each check is pass / fail / **unknown** / n.a.
- **Health** = pass ÷ (pass + fail).
- **Coverage** = (pass + fail) ÷ applicable checks.
- An unknown lowers coverage, **never health**.
- With coverage under ~70%, label the result "provisional".

Always include a "**what I could not check**" list.

**GA4 events (recommended names where they exist)**

| Site type | Events |
|---|---|
| E-commerce | `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase` (with `transaction_id`; fire once), `refund` |
| Lead-gen | `generate_lead` (on confirmed receipt), `form_start`, `form_submit`, `whatsapp_click`, `phone_click`, `search` |

Measure form abandonment as `form_start` minus confirmed `generate_lead`.

## 5. Test backlog (when traffic allows)

- **Hypothesis format:** "If we [change], then [metric] should [direction], because [evidence: finding / VOC / data]."
- **Prioritize** by evidence strength × reach × effort. Effort is a class, not hours.
- **Low traffic** (most new sites): don't A/B test. Make the best evidence-based version, then compare against the post-launch baseline. Report that comparison as an **observation, not a causal result**.
- **How strong is the evidence**, from strongest to weakest:
  1. a holdout or A/B test
  2. a matched comparison
  3. an interrupted time series
  4. before/after

  Say which one you used.
