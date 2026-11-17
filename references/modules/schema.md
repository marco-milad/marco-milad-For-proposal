# Module: Schema (structured data)

**Call it when** the user asks for schema, or for any Track W template inventory or SEO plan.

**Script**
- `schema_check.py` reads the raw HTML from `crawl.mjs`.
- It lists the JSON-LD per page, flags deprecated types, missing required properties, relative URLs, placeholders and invalid JSON.

**Output**
- `research/schema-plan.md`: the current state per template, the target markup per template, and the fixes.

## Principles

1. **Check that Google still supports the type before you recommend it.** Use Google's Search Gallery (developers.google.com/search/docs/appearance/structured-data/search-gallery) and its Search updates log.
   - Valid on schema.org ≠ eligible for a Google feature.
   - Write the date you checked in the internal file.
2. **Markup describes visible content only.**
   - Never mark up anything that isn't on the page: reviews, ratings, FAQs, prices.
   - Never invent reviews or ratings.
   - Never include incentivized reviews without disclosure.
3. **Schema is not an AI-visibility lever for Google.** Google's AI optimization guide says structured data isn't required for AI Overviews/AI Mode and that there is no special AI markup.
   - Present schema as **rich-result eligibility + entity clarity** (who the business is, what it sells, where).
   - Never present it as "helps you get cited by AI".
4. **JSON-LD, in the server HTML.** Product/Offer markup injected by JavaScript makes Shopping crawls less reliable (Google's JavaScript structured-data guidance).
5. **One `@graph` per page** for Organization + WebSite + BreadcrumbList + the page entity, linked by `@id`. A `@graph` container needs no `@type`, and its nodes inherit `@context`. Don't flag either as an error.
6. **Detection caveat.** If the raw HTML shows no JSON-LD, confirm in a rendered browser before reporting "no schema". It may be injected client-side, which is itself a finding.

## Retired or restricted (verify again before each proposal)

| Type / feature | Status | What to do |
|---|---|---|
| **FAQPage** rich result | No longer shown in Google Search since **7 May 2026**, after the Aug 2023 restriction to government/health sites | Keep visible FAQ content: it helps users and AI answers as **text**. Don't recommend new FAQPage markup for a search benefit. Existing markup: leave it, flag it as info only |
| **Sitelinks search box** (WebSite + SearchAction) | Retired Nov 2024 | Don't recommend SearchAction. WebSite markup is still used for the site name |
| **HowTo** rich result | Retired Sept 2023 | Steps as visible content |
| CourseInfo, EstimatedSalary, LearningVideo, ClaimReview (except Fact Check Explorer), VehicleListing | Retired June 2025 (Google "simplifying search results") | EstimatedSalary → JobPosting.baseSalary; LearningVideo → VideoObject; VehicleListing → Product |
| SpecialAnnouncement | Retired July 2025 | Event or Article |

Still live and useful for our clients: Organization, LocalBusiness (and subtypes), Product + Offer (merchant listings), BreadcrumbList, Article, VideoObject, Event, JobPosting, Review snippets (genuine reviews only), QAPage (genuine user Q&A only), ProfilePage, Dataset.

## Markup per template

| Template | Markup | Required / key properties | Notes |
|---|---|---|---|
| All pages | Organization (once, `@id` = `/#org`) | name, url, logo, `sameAs` (official profiles only, from D8), contactPoint | Same NAP as GBP and footer |
| Home | + WebSite | name, url, `inLanguage`, publisher → `/#org` | No SearchAction |
| Category / listing | BreadcrumbList (+ ItemList optional) | `itemListElement` with position, name, item | Breadcrumb mirrors the visible breadcrumb |
| **Product (e-commerce)** | Product + Offer | name, image (≥ 50,000 pixels, e.g. 250×200), description, sku/gtin if real, brand, offers: `price` (> 0, number only), `priceCurrency` (ISO 4217, e.g. EGP), `availability` (full schema.org URL), `url`, `itemCondition` | One `Offer` per purchasable variant, or `ProductGroup` with `hasVariant`. Sale price: `priceValidUntil` / `validFrom`. Add `shippingDetails` and `hasMerchantReturnPolicy` (these can also be set in Search Console without Merchant Center). `aggregateRating` only from real on-site reviews |
| Product (B2B, no price) | Product without Offer | name, image, description, brand, category | A product without an offer cannot be a merchant listing. That's fine; say so |
| Article / guide | Article (or BlogPosting) | headline, image, datePublished, dateModified, author → Person with name + url | Feeds E-E-A-T (see [eeat-content.md](eeat-content.md)) |
| Contact / location | LocalBusiness subtype | name, address (PostalAddress), telephone, openingHoursSpecification, `geo` (≥ 5 decimals), url, `areaServed` for service areas | Pick the most specific subtype. Multiple branches: one node per branch with its own `@id`, linked by `branchOf` / `parentOrganization` |
| Video page | VideoObject | name, description, thumbnailUrl, uploadDate, contentUrl or embedUrl | — |

**AI-generated product images** need the IPTC `DigitalSourceType` = `TrainedAlgorithmicMedia` metadata for Merchant Center. Ask the client whether any images are AI-generated.

## Validation

- **Run `schema_check.py`** on the crawl. Every page type must have 0 parse errors and 0 missing required properties.
- **Manual checks by the user, not the agent.** The user runs Google's Rich Results Test and the Schema.org validator on 1 URL per template. We never upload client files to third-party validators (SKILL.md isolation rule). The Rich Results Test takes a public URL, so for a prototype, validate after staging is public, or use `schema_check.py` only.
- After launch, check the Search Console Enhancements reports: Products, Merchant listings, Breadcrumbs.
