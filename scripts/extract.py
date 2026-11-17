# Offline on-page SEO extraction from crawl.mjs output. stdlib only; ignores inert <template> content.
# Usage: python -I extract.py <crawlDir> [boilerplateRegex]
#   boilerplateRegex: text that marks unedited CMS/theme defaults on a page. The default covers common Odoo/WordPress
#   leftovers; extend it per client (e.g. "Lorem ipsum|Sample Page|Feature One").
# Writes <crawlDir>/pages.json and prints a summary. Every number you quote in a proposal should come from pages.json.
import json, re, sys, html.parser, collections
from urllib.parse import urlparse, urljoin, urldefrag

sys.stdout.reconfigure(encoding='utf-8')
d = sys.argv[1]
BOILER = re.compile(sys.argv[2] if len(sys.argv) > 2 else
                    r'Bootstrap-based templates|Feature One|Great stories have a personality|'
                    r'You should update this document|Add a caption|Lorem ipsum|Hello world!|Sample Page|Just another WordPress site')
log = json.load(open(f'{d}/crawl-log.json', encoding='utf-8'))


class P(html.parser.HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True)
        s.tpl = 0; s.skip = 0; s.in_title = False; s.title = ''; s.metas = {}; s.links = []; s.h = collections.defaultdict(list)
        s.cur_h = None; s.imgs = []; s.jsonld = []; s.in_ld = False; s.ld = ''; s.text = []; s.html_attrs = {}; s.a = []
        s.main = 0; s.main_text = []

    def handle_starttag(s, t, a):
        a = dict(a)
        if t == 'template': s.tpl += 1; return
        if s.tpl: return
        if t == 'html': s.html_attrs = a
        if t in ('script', 'style', 'noscript'):
            s.skip += 1
            if t == 'script' and a.get('type') == 'application/ld+json': s.in_ld = True; s.ld = ''
        if t == 'title': s.in_title = True
        if t == 'meta' and (a.get('name') or a.get('property')): s.metas.setdefault((a.get('name') or a.get('property')).lower(), a.get('content', ''))
        if t == 'link': s.links.append(a)
        if t in ('h1', 'h2', 'h3'): s.cur_h = t; s.h[t].append('')
        if t == 'main': s.main += 1
        if t == 'img': s.imgs.append(a)
        if t == 'a': s.a.append(a.get('href'))

    def handle_endtag(s, t):
        if t == 'template': s.tpl = max(0, s.tpl - 1); return
        if s.tpl: return
        if t in ('script', 'style', 'noscript'):
            s.skip = max(0, s.skip - 1)
            if s.in_ld: s.jsonld.append(s.ld); s.in_ld = False
        if t == 'title': s.in_title = False
        if t in ('h1', 'h2', 'h3'): s.cur_h = None
        if t == 'main': s.main = max(0, s.main - 1)

    def handle_data(s, x):
        if s.tpl: return
        if s.in_ld: s.ld += x; return
        if s.skip: return
        if s.in_title: s.title += x
        if s.cur_h: s.h[s.cur_h][-1] += x
        s.text.append(x)
        if s.main: s.main_text.append(x)


pages = []
for l in log:
    if l.get('status') != 200:
        pages.append({'url': l['url'], 'status': l.get('status'), 'error': l.get('error'), 'location': l.get('location')}); continue
    p = P(); p.feed(open(f"{d}/{l['file']}", encoding='utf-8', errors='replace').read())
    txt = re.sub(r'\s+', ' ', ' '.join(p.text))
    types = []
    for j in p.jsonld:
        types += re.findall(r'"@type"\s*:\s*"([^"]+)"', j)
    # Same-host links, fragment stripped -> internal link graph (inlinks / orphans below).
    host = urlparse(l['url']).netloc
    out = set()
    for h in p.a:
        if not h or h.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'whatsapp:')): continue
        u = urldefrag(urljoin(l['url'], h))[0]
        if urlparse(u).netloc == host and u != l['url']: out.add(u)
    # Opening words of the main content (falls back to the whole page when there is no <main>): keyword placement.
    body = re.sub(r'\s+', ' ', ' '.join(p.main_text or p.text)).strip()
    pages.append({
        'url': l['url'], 'status': 200, 'ms': l['ms'], 'kb': round(l['bytes'] / 1024),
        'lang': p.html_attrs.get('lang'), 'dir': p.html_attrs.get('dir'),
        'title': p.title.strip(), 'desc': p.metas.get('description', None),
        'robots': p.metas.get('robots'), 'og_image': p.metas.get('og:image'),
        'canonical': [x.get('href') for x in p.links if x.get('rel') == 'canonical'],
        'hreflang': [x.get('hreflang') for x in p.links if x.get('hreflang')],
        'h1': [h.strip() for h in p.h['h1']], 'h2n': len(p.h['h2']), 'h3n': len(p.h['h3']),
        'h2': [re.sub(r'\s+', ' ', h).strip() for h in p.h['h2']][:30], 'desc_len': len(p.metas.get('description') or ''),
        'first_words': ' '.join(body.split()[:100]), 'has_main': bool(p.main_text),
        'alts': [i.get('alt') for i in p.imgs if i.get('alt')][:40], 'internal_out': sorted(out),
        'imgs': len(p.imgs), 'alt_missing': sum('alt' not in i for i in p.imgs), 'alt_empty': sum(i.get('alt') == '' for i in p.imgs),
        'jsonld_types': types, 'words': len(txt.split()), 'arabic_chars': len(re.findall(r'[؀-ۿ]', txt)),
        'hash_links': sum(1 for h in p.a if h in ('#', '')), 'boilerplate': bool(BOILER.search(txt)),
    })
# Inlinks counted only from crawled pages: a page "orphaned" here may still be linked from sections the crawl excluded.
norm = lambda u: u.rstrip('/')
inl = collections.Counter(norm(u) for pg in pages if pg.get('status') == 200 for u in pg['internal_out'])
for pg in pages:
    if pg.get('status') == 200: pg['inlinks'] = inl[norm(pg['url'])]
json.dump(pages, open(f'{d}/pages.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

ok = [p for p in pages if p['status'] == 200]
if not ok:
    print('no 200 pages'); sys.exit()
C = lambda f: sum(1 for p in ok if f(p))
titles = collections.Counter(p['title'] for p in ok)
suffixes = collections.Counter(p['title'].rsplit('|', 1)[-1].strip() for p in ok if '|' in p['title'])
print(f"pages fetched 200: {len(ok)} / {len(pages)}; non-200: {[(p['url'], p['status']) for p in pages if p['status'] != 200]}")
print(f"median response ms: {sorted(p['ms'] for p in ok)[len(ok)//2]}; median HTML KB: {sorted(p['kb'] for p in ok)[len(ok)//2]}")
print(f"lang/dir: {collections.Counter((p['lang'], p['dir']) for p in ok)}")
print(f"meta description missing: {C(lambda p: not p['desc'])}; desc mentioning the CMS (odoo/wordpress): {C(lambda p: p['desc'] and re.search('(?i)odoo|wordpress', p['desc']))}")
print(f"duplicate titles: {[(t, n) for t, n in titles.items() if n > 1]}")
print(f"title > 60 chars: {C(lambda p: len(p['title']) > 60)}; title suffixes: {suffixes.most_common(3)}")
print(f"h1 = 0: {C(lambda p: len(p['h1']) == 0)}; h1 > 1: {C(lambda p: len(p['h1']) > 1)}; empty h1 text: {C(lambda p: any(not h for h in p['h1']))}")
print(f"canonical self: {C(lambda p: p['canonical'][:1] == [p['url']])}; canonical elsewhere: {[(p['url'], p['canonical'][:1]) for p in ok if p['canonical'][:1] != [p['url']]][:8]}")
print(f"noindex pages: {[p['url'] for p in ok if p['robots'] and 'noindex' in p['robots']]}")
print(f"hreflang present: {C(lambda p: p['hreflang'])}; JSON-LD present: {C(lambda p: p['jsonld_types'])} types={collections.Counter(t for p in ok for t in p['jsonld_types'])}")
print(f"images: {sum(p['imgs'] for p in ok)}; alt missing: {sum(p['alt_missing'] for p in ok)}; alt empty: {sum(p['alt_empty'] for p in ok)}")
print(f"thin (<150 words incl. header/footer): {C(lambda p: p['words'] < 150)}; pages with Arabic text (>50 chars): {C(lambda p: p['arabic_chars'] > 50)}")
print(f"pages with '#'/empty links: {C(lambda p: p['hash_links'])}; boilerplate text on: {[urlparse(p['url']).path for p in ok if p['boilerplate']]}")
print(f"meta description length: <70 chars {C(lambda p: p['desc'] and p['desc_len'] < 70)}; >160 chars {C(lambda p: p['desc_len'] > 160)}")
print(f"h3 without any h2: {C(lambda p: p['h3n'] and not p['h2n'])}; pages without <main>: {C(lambda p: not p['has_main'])}")
print(f"internal links out (median): {sorted(len(p['internal_out']) for p in ok)[len(ok)//2]}; "
      f"orphans among crawled pages (0 inlinks): {[urlparse(p['url']).path for p in ok if p['inlinks'] == 0][:10]}; "
      f"1-2 inlinks: {C(lambda p: 0 < p['inlinks'] < 3)}")
