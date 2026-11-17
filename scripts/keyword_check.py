# Keyword placement check: where each page's primary keyword appears. stdlib only.
# Usage: python -I keyword_check.py <pages.json from extract.py> <keyword-map.csv> [out.csv]
#   keyword-map.csv (UTF-8, header row): url,keyword   (one primary keyword per URL; extra columns are ignored)
# Arabic is normalized before matching (tashkeel, tatweel, alef/yaa/taa-marbuta variants), English is case-folded.
# Prints a summary and writes out.csv (default: keyword-placement.csv next to pages.json).
# Presence is a placement check only. It says nothing about rankings; never present it as a ranking factor score.
import csv, json, os, re, sys, collections
from urllib.parse import unquote, urlparse

sys.stdout.reconfigure(encoding='utf-8')
pages_path, map_path = sys.argv[1], sys.argv[2]
out_path = sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.path.dirname(pages_path), 'keyword-placement.csv')


def norm(s):
    s = (s or '').casefold()
    s = re.sub(r'[ً-ْٰـ]', '', s)          # tashkeel + tatweel
    s = re.sub(r'[آأإٱ]', 'ا', s)       # آ أ إ ٱ -> ا
    s = s.replace('ى', 'ي').replace('ة', 'ه')  # ى -> ي, ة -> ه
    s = re.sub(r'[-_/|،,.:;!?()\[\]«»"\']+', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def has(hay, kw):
    return bool(kw) and f' {kw} ' in f' {norm(hay)} '


key = lambda u: u.rstrip('/')
pages = {key(p['url']): p for p in json.load(open(pages_path, encoding='utf-8')) if p.get('status') == 200}
rows = list(csv.DictReader(open(map_path, encoding='utf-8-sig')))
if not rows or not {'url', 'keyword'} <= set(rows[0]):
    sys.exit('keyword-map.csv needs a header row with at least: url,keyword')

COLS = ['title', 'h1', 'desc', 'first_100_words', 'url_slug', 'h2', 'img_alt']
out, missing_pages = [], []
for r in rows:
    url, kw = r['url'].strip(), norm(r['keyword'])
    p = pages.get(key(url))
    if not p:
        missing_pages.append(url); continue
    res = {
        'title': has(p.get('title'), kw),
        'h1': any(has(h, kw) for h in p.get('h1', [])),
        'desc': has(p.get('desc'), kw),
        'first_100_words': has(p.get('first_words'), kw),
        'url_slug': has(unquote(urlparse(url).path), kw),
        'h2': any(has(h, kw) for h in p.get('h2', [])),
        'img_alt': any(has(a, kw) for a in p.get('alts', [])),
    }
    out.append({'url': url, 'keyword': r['keyword'].strip(), **{c: 'yes' if res[c] else 'no' for c in COLS},
                'title_len': len(p.get('title') or ''), 'h1_count': len(p.get('h1', []))})

with open(out_path, 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['url', 'keyword', *COLS, 'title_len', 'h1_count'])
    w.writeheader(); w.writerows(out)

n = len(out)
print(f"pages checked: {n}; in keyword map but not in pages.json (not crawled / not 200): {missing_pages[:10]}")
if n:
    for c in COLS:
        print(f"keyword in {c}: {sum(o[c] == 'yes' for o in out)}/{n}")
    print(f"keyword missing from BOTH title and H1: {[o['url'] for o in out if o['title'] == 'no' and o['h1'] == 'no'][:10]}")
dup = [(k, v) for k, v in collections.Counter(norm(r['keyword']) for r in rows).items() if v > 1]
print(f"same primary keyword on more than one URL (cannibalization risk): {dup}")
print(f"wrote {out_path}")
