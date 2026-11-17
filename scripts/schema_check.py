# JSON-LD check on raw HTML (crawl.mjs output or saved pages). stdlib only.
# Usage: python -I schema_check.py <crawlDir with crawl-log.json | file.html ...> [out.json]
# Reports per page: JSON-LD blocks, parse errors, @types (incl. inside @graph), retired/restricted Google features,
# missing key properties for the types we use, relative URLs, placeholder text, bad dates, Offer price/currency issues.
# Raw HTML only: JSON-LD injected by JavaScript is invisible here -> confirm "no schema" in a rendered browser.
# Google support changes: re-check the Search Gallery + Search updates log before quoting (list below checked 2026-11-18).
import json, os, re, sys, collections

sys.stdout.reconfigure(encoding='utf-8')
args = sys.argv[1:]
out_path = args.pop() if len(args) > 1 and args[-1].endswith('.json') else None

RETIRED = {
    'FAQPage': 'FAQ rich results no longer shown in Google (since 2026-05-07); keep visible FAQ text, markup gives no Search feature',
    'HowTo': 'HowTo rich results retired (2023-09)',
    'SpecialAnnouncement': 'retired (2025-07)',
    'CourseInfo': 'retired (2025-06)', 'EstimatedSalary': 'retired (2025-06) -> JobPosting.baseSalary',
    'LearningVideo': 'retired (2025-06) -> VideoObject', 'VehicleListing': 'retired (2025-06) -> Product',
    'ClaimReview': 'Search rich result retired (2025-06); Fact Check Explorer only',
    'SearchAction': 'sitelinks search box retired (2024-11); harmless, no Search feature',
    'AggregateOffer': 'fine for product snippets; merchant listings expect Offer per purchasable variant (check Google Product docs)',
}
TOP_ONLY = {'Organization', 'WebSite'}  # nested ones (seller, brand, publisher) only need a name
REQUIRED = {  # key properties we expect (Google required + strongly recommended for our templates)
    'Organization': ['name', 'url', 'logo'],
    'WebSite': ['name', 'url'],
    'BreadcrumbList': ['itemListElement'],
    'Product': ['name', 'image'],
    'Offer': ['price', 'priceCurrency', 'availability'],
    'Article': ['headline', 'image', 'datePublished', 'author'],
    'BlogPosting': ['headline', 'image', 'datePublished', 'author'],
    'LocalBusiness': ['name', 'address', 'telephone'],
    'PostalAddress': ['streetAddress', 'addressLocality', 'addressCountry'],
    'VideoObject': ['name', 'thumbnailUrl', 'uploadDate'],
    'Event': ['name', 'startDate', 'location'],
    'Review': ['author', 'reviewRating'],
    'AggregateRating': ['ratingValue', 'reviewCount|ratingCount'],
}
LOCAL_SUBTYPES = re.compile(r'(Store|Restaurant|Clinic|Dentist|Service|Business|Shop|Agency|Office|Hotel|Physician|Pharmacy)$')
URL_KEYS = {'url', 'image', 'logo', 'item', 'contentUrl', 'embedUrl', 'thumbnailUrl', 'sameAs', '@id'}
PLACEHOLDER = re.compile(r'lorem ipsum|example\.com|your (company|business)|xxx|TODO|\{\{|\[insert', re.I)
DATE_KEYS = {'datePublished', 'dateModified', 'uploadDate', 'startDate', 'endDate', 'priceValidUntil', 'validFrom', 'validThrough'}
LD_RE = re.compile(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', re.S | re.I)


def types_of(node):
    t = node.get('@type')
    return t if isinstance(t, list) else [t] if t else []


def walk(node, path, issues, found):
    if isinstance(node, list):
        for i, n in enumerate(node): walk(n, f'{path}[{i}]', issues, found)
        return
    if not isinstance(node, dict): return
    for t in types_of(node):
        found.append(t)
        if t in RETIRED: issues.append(('info', f'{t}: {RETIRED[t]}'))
        top = re.fullmatch(r'block\d+(\[\d+\])?', path) is not None
        if t in TOP_ONLY and not top: continue
        req = REQUIRED.get(t) or (REQUIRED['LocalBusiness'] if LOCAL_SUBTYPES.search(t or '') and t not in REQUIRED else None)
        for k in req or []:
            if not any(alt in node for alt in k.split('|')):
                issues.append(('warn', f'{t} at {path}: missing {k}'))
        if t == 'Offer' and 'price' in node:
            p = str(node['price'])
            if re.search(r'[^\d.]', p): issues.append(('error', f'Offer price "{p}" must be a plain number (no currency symbol or comma)'))
            elif float(p or 0) <= 0: issues.append(('warn', f'Offer price {p} <= 0'))
            if 'availability' in node and not str(node['availability']).startswith(('https://schema.org/', 'http://schema.org/')):
                issues.append(('warn', f'Offer availability "{node["availability"]}" should be a full schema.org URL'))
            cur = node.get('priceCurrency')
            if cur and not re.fullmatch(r'[A-Z]{3}', str(cur)): issues.append(('error', f'priceCurrency "{cur}" is not ISO 4217'))
        if t == 'BreadcrumbList':
            for i, el in enumerate(node.get('itemListElement') or []):
                if isinstance(el, dict) and el.get('position') != i + 1:
                    issues.append(('warn', f'BreadcrumbList position {el.get("position")} at index {i} (expected {i + 1})'))
    for k, v in node.items():
        if k in URL_KEYS:
            for u in (v if isinstance(v, list) else [v]):
                if isinstance(u, str) and u and not re.match(r'https?://', u) and not (k == '@id' and u.startswith('#')):
                    issues.append(('warn', f'{k} "{u[:60]}" is not an absolute URL'))
        if k in DATE_KEYS and isinstance(v, str) and not re.match(r'\d{4}-\d{2}-\d{2}', v):
            issues.append(('warn', f'{k} "{v}" is not ISO 8601'))
        if isinstance(v, str) and PLACEHOLDER.search(v):
            issues.append(('warn', f'placeholder text in {k}: "{v[:60]}"'))
        if isinstance(v, (dict, list)): walk(v, f'{path}.{k}', issues, found)


def check(html):
    blocks = LD_RE.findall(html)
    issues, found = [], []
    for i, b in enumerate(blocks):
        try:
            data = json.loads(b.strip())
        except json.JSONDecodeError as e:
            issues.append(('error', f'block {i}: invalid JSON ({e.msg} at char {e.pos})')); continue
        walk(data.get('@graph', data) if isinstance(data, dict) else data, f'block{i}', issues, found)
    if not blocks: issues.append(('info', 'no JSON-LD in raw HTML (confirm in a rendered browser before reporting)'))
    if re.search(r'itemtype=["\']https?://schema\.org', html, re.I): issues.append(('info', 'Microdata present (JSON-LD recommended)'))
    return {'blocks': len(blocks), 'types': found, 'issues': issues}


pages = []
if len(args) == 1 and os.path.isdir(args[0]):
    d = args[0]
    for l in json.load(open(os.path.join(d, 'crawl-log.json'), encoding='utf-8')):
        if l.get('status') == 200:
            pages.append((l['url'], open(os.path.join(d, l['file']), encoding='utf-8', errors='replace').read()))
else:
    pages = [(f, open(f, encoding='utf-8', errors='replace').read()) for f in args]

results = []
for url, html in pages:
    r = check(html); r['url'] = url; results.append(r)

sev = collections.Counter(s for r in results for s, _ in r['issues'])
print(f'pages: {len(results)}; with JSON-LD: {sum(1 for r in results if r["blocks"])}; issues: {dict(sev)}')
print(f'types: {dict(collections.Counter(t for r in results for t in r["types"]))}')
by_msg = collections.Counter((s, re.sub(r'block\d+(\.[\w@\[\]\d.]+)?', 'block', m)) for r in results for s, m in r['issues'])
for (s, m), n in by_msg.most_common(25):
    print(f'  [{s}] x{n} {m}')
if out_path:
    json.dump(results, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(f'wrote {out_path}')
