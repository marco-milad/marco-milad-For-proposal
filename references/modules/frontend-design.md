# Module: Distinctive frontend / UI

The goal: a new site that looks like **this client**, not like a template or generic AI output.

**Call it when** you are designing the prototype or the final frontend (Track W P4, or any "make it look professional / not generic" request).

**Inputs**
- U3 (brand), U4 (real photos), U10 (sites they like/dislike).
- The client's industry materials (products, packaging, shopfront, signage).
- The audience (U2).

**Output**
- `p4/design-direction.md`, written **before** any HTML, and reviewed.
- Then the prototype, built from tokens.

## 1. Two-pass process (mandatory)

**Pass 1: the direction plan** (`design-direction.md`)
- **Subject.** What is characteristic of this client's world? Materials, tools, colors of the product, the place, the customer's daily work. The hero opens with **that**, e.g. the product in use or the real shopfront. Never a generic stat block.
- **Palette.** 4–6 named hex values with roles: ink, muted text, 2–3 surfaces, a hairline, **one** accent. Take the accent from the client's own material (logo, product, packaging), never from a trend.
- **Type.**
  - A Latin face and an Arabic face, with each one's role and **the reason it fits this client**.
  - At most 2 families per script.
- **Layout concept.**
  - One sentence plus an ASCII wireframe of the home's first two screens.
  - State the grid and alignment (RTL first).
- **One signature element.** The single memorable thing, e.g. a product-color swatch rail, a material texture taken from the real product, a distinctive photo treatment of the client's own images, or a bespoke category icon set. **Spend boldness in one place.**
- **Surface modes.** Decide which pages persuade (home, landing: may be expressive), which **operate** (checkout, quote form, account: predictable and calm), which are read (guides, FAQ: typography first), and which showcase (product gallery).
- **The voice card.**
  - 3 adjectives, plus 3 words we never use.
  - **The "nine trades" test:** if the voice would fit nine other industries, it isn't a voice.

**Pass 2: the generic check.** Before coding, review the plan against the brief:
- *"Would I produce this for any similar client?"*
- *"Could a competitor ship this unchanged?"*

Revise every generic part and record what changed and why. Then build.

## 2. Generic patterns to avoid (unless the brief demands them; record the exception)

**Layout and components**
- A hero made of a big number + small label + stats + a gradient accent.
- Rows of identical icon cards. Cards inside cards. One radius and one soft shadow on everything.
- Gradient text. Decorative glassmorphism. Grain/noise/grid-paper backgrounds. A colored stripe on the side of a card.
- Emoji used as icons. Monospace used as a "tech" costume.
- Eyebrow labels above every heading (small tracked caps). "01 / 02 / 03" markers on content that isn't a sequence.
- Logo marquees and stat strips with **unsourced** numbers. Three polished testimonials with stock faces.

**Reflex palettes**
- Violet→blue gradients.
- Cyan or acid green on near-black.
- Cream background + serif + terracotta.

Choosing dark or light because "that's what tech/luxury uses" is also a reflex. Choose by where and how the site is used.

**Motion**
- Fade-and-slide-up on every section.
- Hover lift on every card.
- Parallax, auto-rotating carousels and tabs.

**Copy**
- Hype words; "In today's fast-paced world"; slogans as H1s; question headlines.
- "Not X but Y" framing.
- Vague CTAs ("Learn more" everywhere).
- Invented proof and default names ("Ahmed M., CEO").

**Arabic-specific**
- **No letter-spacing on Arabic.** It breaks the joined script; there is no "all caps" in Arabic.
- **No faux italic/oblique on Arabic.** Emphasize with weight or color.
- **Default-font warning.** Very common faces (Cairo, Tajawal; Inter/Poppins/Montserrat for Latin) are fine only with a stated reason, e.g. the brand already uses them, or legibility tests favored them.
- **Proper bilingual typesetting.**
  - Matching x-height/weight between the Arabic and Latin faces.
  - Arabic line-height ≈ 1.7–1.9.
  - Numerals consistent (Western or Arabic-Indic, chosen per market).
  - Mixed tokens wrapped in `<bdi>`.

Generic-pattern lists date quickly. A pattern becomes a "tell" once everyone uses it. Re-check this list against current sites in the client's market before each project.

## 3. The design system (tokens before components)

- **Spacing:** a 4 px base; 8–10 steps.
- **Radius:** 2–4 values.
- **Type scale:** 7–9 steps.
- **Shadows:** at most 2 (cards rest flat; elevation only for overlays).
- **Tokens named by role**, not value: `--space-section`, `--ink`, `--surface-2`, `--accent`.
- **Components only use tokens.** No raw hex or px inside components.
- **Brand color.**
  - Don't use the logo hex unchanged for text and buttons. Derive a contrast-safe shade for text and controls, and keep the original for large decorative use.
  - Contrast is computed (`ux_check.mjs`), never judged by eye.
  - Check light and dark modes separately if both exist.
- **Buttons:**
  - one primary style and one secondary style, plus a text link;
  - every control has default / hover / pressed / focus / disabled states;
  - the pressed state doesn't shift the layout.
- **Focus ring:**
  - ≥ 2 px, a two-tone ring that works on any background;
  - never removed;
  - never hidden under sticky bars: use `scroll-padding` (WCAG 2.4.11).

## 4. Rhythm and budgets (guidelines, not laws; adapt them to the content)

- **Sections:**
  - one section ≈ one or two screens on desktop;
  - the hero alone on the first screen;
  - a calm section after at most two busy ones;
  - a layout pattern repeats at most twice per page.
  - **Merge short blocks** (a single quote, a logo row, a two-question FAQ) into the neighboring section instead of giving each its own band.
- **Hero:**
  - an H1 naming the category + the buyer in a few words;
  - one supporting line;
  - at most 2 actions.
- **Words:** product and service pages stay scannable (short paragraphs, specs in tables). The length follows the buyer's questions.
- **Imagery:**
  - the client's own photos first (give them a **shot list**: product angles, in use, team, place);
  - clearly labelled stand-ins in prototypes (internal note);
  - stock only in "detail" slots;
  - never tint/duotone product photos;
  - never repeat an image on one page;
  - consistent crop ratios per component.
- **Motion:**
  - three layers only: the hero entrance (once), one or two memorable moments, hover/press feedback;
  - one easing, a few durations, exits faster than entries;
  - everything respects `prefers-reduced-motion`;
  - hover effects only under `@media (hover:hover) and (pointer:fine)`.

**Reconciling with the 16-section B2B home** (web-seo-track.md P4). Users have said a 9-section home "feels thin", so the 16-section outline stays. But apply the rhythm rules:
- merge micro-sections, e.g. the brand strip into the hero foot, "In numbers" into About;
- vary the layouts;
- keep every number sourced.

The floating WhatsApp button stays where the market expects it; record it as a deliberate exception to "nothing else floats". Check that it never hides focused elements or the sticky CTA.

## 5. Distinctiveness grade (in the UI review)

A separate grade, next to the usability and accessibility grades:
- **A:** clearly this client: the signature element, own imagery, a specific voice.
- **B:** branded but uses a few generic patterns.
- **C:** template-like.

The release target is **B or better**, and the patterns list must be confirmed absent (or the exceptions recorded).
