# Module: Local SEO

**Call it when** the business has a physical location or serves defined areas, or when the user asks about Google Business Profile, maps, local listings or NAP.

**Inputs**
- **D6:** GBP link and manager access.
- **D7:** the official NAP and hours.
- **D8:** known listings.

Without D6 we audit the **public view only** (label it **O**) and never edit anything.

**Output**
- `research/local-seo.md`: business type, GBP scorecard, NAP matrix, listings plan, local pages plan, limitations.

## 1. Classify first

| Type | Means | Skip |
|---|---|---|
| **Storefront** | Customers visit an address | — |
| **Service-area business (SAB)** | The business goes to the customer, or delivers; the address is hidden on GBP | Map-embed and address-visibility checks |
| **Hybrid** | Both | — |

Then pick the **vertical** and use its schema subtype, e.g. Store, ClothingStore, Restaurant, MedicalClinic, Dentist, LegalService, HomeAndConstructionBusiness, AutomotiveBusiness. The vertical decides which GBP fields matter most, e.g. a menu for restaurants, products for retail, services for trades.

## 2. Google Business Profile scorecard (our rubric)

Score each field:
- **2** = present and optimized
- **1** = present but weak
- **0** = missing

Normalize the total to 100. Show the fields, not just the number.

| Area | Fields |
|---|---|
| Identity | Business name exactly as on signage (no keyword stuffing), primary category (the most specific), secondary categories, description (what, where, for whom; no URLs or promotions) |
| Contact | Phone, website link with UTM (`utm_source=google&utm_medium=organic&utm_campaign=gbp`), WhatsApp/chat if offered, appointment/booking link |
| Location | Address or service areas, map pin accuracy, opening hours, special and holiday hours |
| Offer | Products (with photos and prices where public), services, attributes (payment methods, delivery, accessibility) |
| Media | Logo, cover, interior/exterior, team, product photos (real, recent), video |
| Engagement | Review count and recency, **reply rate and quality**, posts/updates in the last 30 days |
| Q&A | Google discontinued the GBP Q&A API in Nov 2025, and the feature itself is being phased out (check its current status before advising). Answer those questions on the website and in the description |

**Industry weighting.** Multiply the fields that matter most for the vertical, then re-normalize. Write down which fields you weighted.

## 3. Reviews

- **Measure:**
  - count, average, recency (the last 90 days)
  - share of reviews with owner replies
  - common praise and complaints (feeds the VOC bank in [eeat-content.md](eeat-content.md))
- **Allowed:**
  - asking every customer for a review
  - a QR code or link
  - replying to all reviews, including negative ones
- **Never:**
  - **review gating**: asking only happy customers, or filtering by sentiment first (against Google policy)
  - paid or incentivized reviews
  - writing reviews for the client
- **Suspicious-review flags** (for competitors or the client's own profile). Any two or more of these:
  - uniform timing
  - single-review accounts
  - geography mismatch
  - 5-star spikes
  - near-identical text

  Report them as an observation, never as an accusation.

## 4. NAP consistency matrix

Rows are the sources:
- website header
- website footer
- contact page
- LocalBusiness schema
- GBP
- Apple Business Connect
- Bing Places
- Facebook
- Instagram
- key directories

Columns: Name, Address, Phone, Hours, Website URL. Mark each cell ✓ or ✗ with the exact differing value.

Without D7 there is no "correct" NAP. Report the inconsistencies and ask the client.

## 5. Listings / citations

- **Core:**
  - Google
  - Apple Business Connect
  - Bing Places
  - Facebook
  - the market's main directories (Egypt example: yellowpages.com.eg; Gulf: the local Yellow Pages and industry directories)
  - industry and association directories
  - marketplaces the client sells on
- **Discovery.** Search "brand name" + phone, "brand name" + city, and the phone number alone. List every listing found as "candidate" until the client confirms it (D8).
- **Prioritize** by relevance and visibility, not by volume. A few accurate listings beat many inconsistent ones.

## 6. Local pages on the website

- One location page per **real** branch: NAP, map, hours, directions, photos of that branch, local team, local reviews, and LocalBusiness schema with its own `@id` + `branchOf`.
- Service-area pages only with genuinely local content, and they must pass the **swap test** in [eeat-content.md](eeat-content.md). Delivery price and time per governorate, or local stock, count as genuinely local.
- Footer NAP identical to GBP on every page.

## 7. Competitive local view (optional)

- **Free:** check the local map pack manually for 5–10 core queries from the client's area, with screenshots, date and location noted. Use OpenStreetMap / Overpass to list the competitors within a radius.
- **Paid:** a geo-grid rank tracker (e.g. a 7×7 grid over the service radius; the share of points in the top 3).
  - It needs a paid tool and the user's approval of the cost before any scan.
  - Name the tool and its date in the report.

## Limitations section (mandatory)

State what was not assessed and why, e.g.:
- "no GBP access → Insights not reviewed"
- "map-pack checks are a sample from one location"
