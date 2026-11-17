# AI-crawler access from robots.txt, per purpose (search / user-triggered / training). stdlib only.
# Usage: python -I ai_access.py <https://site.example | path/to/robots.txt> [path-to-test=/]
# Follows RFC 9309: a crawler obeys only the most specific group naming it (else '*'); longest matching rule wins,
# Allow wins ties; '*' and '$' wildcards. Fetches robots.txt once with the default urllib user agent (no spoofing).
# robots.txt is only one gate: a CDN/WAF block is separate and is NOT detected here. Tokens change: re-check vendor docs.
import re, sys, urllib.request, urllib.error

sys.stdout.reconfigure(encoding='utf-8')
# token, vendor, purpose, honors robots.txt (per vendor docs, checked 2026-11-18)
BOTS = [
    ('Googlebot', 'Google', 'search (incl. AI Overviews / AI Mode)', 'yes'),
    ('Google-Extended', 'Google', 'training + Gemini/Vertex grounding (control token, no effect on Search)', 'yes'),
    ('OAI-SearchBot', 'OpenAI', 'search (ChatGPT search answers)', 'yes'),
    ('ChatGPT-User', 'OpenAI', 'user-triggered fetch', 'may not apply'),
    ('GPTBot', 'OpenAI', 'training', 'yes'),
    ('Claude-SearchBot', 'Anthropic', 'search', 'yes'),
    ('Claude-User', 'Anthropic', 'user-triggered fetch', 'yes'),
    ('ClaudeBot', 'Anthropic', 'training', 'yes'),
    ('PerplexityBot', 'Perplexity', 'search', 'yes'),
    ('Perplexity-User', 'Perplexity', 'user-triggered fetch', 'generally ignores'),
    ('Applebot', 'Apple', 'search (Siri / Spotlight / Safari)', 'yes'),
    ('Applebot-Extended', 'Apple', 'training opt-out token', 'yes'),
    ('Bingbot', 'Microsoft', 'search (Bing, Copilot)', 'yes'),
    ('CCBot', 'Common Crawl', 'open dataset (widely used for training)', 'yes'),
]

src = sys.argv[1]
test_path = sys.argv[2] if len(sys.argv) > 2 else '/'
status = None
if re.match(r'https?://', src):
    url = src.rstrip('/') + '/robots.txt' if not src.endswith('robots.txt') else src
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            status, text = r.status, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        status, text = e.code, ''
    except Exception as e:
        print(f'could not fetch {url}: {e} -> report as "not checked"'); sys.exit(1)
else:
    status, text = 200, open(src, encoding='utf-8', errors='replace').read()

print(f'robots.txt status: {status}')
if status == 429:
    print('429: Google treats this like a server error -> report "not tested"'); sys.exit()
if status and status >= 500:
    print('5xx: compliant crawlers treat the whole site as disallowed -> critical'); sys.exit()
if status and 400 <= status < 500:
    print('4xx (no robots.txt): crawlers assume no restrictions; every bot below = allowed')
    text = ''

# Parse groups: consecutive user-agent lines share the rules that follow.
groups, cur, last_was_ua = [], None, False
for raw in text.splitlines():
    line = raw.split('#', 1)[0].strip()
    if ':' not in line: continue
    k, v = [x.strip() for x in line.split(':', 1)]
    k = k.lower()
    if k == 'user-agent':
        if not last_was_ua:
            cur = {'agents': [], 'rules': []}; groups.append(cur)
        cur['agents'].append(v.lower()); last_was_ua = True
    elif k in ('allow', 'disallow') and cur is not None:
        cur['rules'].append((k, v)); last_was_ua = False
    else:
        last_was_ua = False


def rules_for(token):
    t = token.lower()
    named = [g for g in groups if t in g['agents']]
    if named: return [r for g in named for r in g['rules']], 'own group'
    star = [g for g in groups if '*' in g['agents']]
    return [r for g in star for r in g['rules']], ("'*' group" if star else 'no group')


def match(pattern, path):
    if pattern == '': return None
    rx = re.escape(pattern).replace(r'\*', '.*')
    if rx.endswith(r'\$'): rx = rx[:-2] + '$'
    return re.match(rx, path)


def allowed(rules, path):
    best = None  # (length, is_allow)
    for k, v in rules:
        if match(v, path):
            cand = (len(v), k == 'allow')
            if best is None or cand[0] > best[0] or (cand[0] == best[0] and cand[1]): best = cand
    return True if best is None else best[1]


print(f'path tested: {test_path}\n')
print(f"{'token':18} {'vendor':12} {'from':10} {'allowed':8} purpose  [honors robots.txt]")
for token, vendor, purpose, honors in BOTS:
    rules, origin = rules_for(token)
    ok = allowed(rules, test_path)
    print(f"{token:18} {vendor:12} {origin:10} {'yes' if ok else 'NO':8} {purpose}  [{honors}]")
named = sorted({a for g in groups for a in g['agents']} - {'*'})
if named: print(f'\nuser-agent groups in file: {named}')
print('\nReminder: a group naming a bot replaces the * rules for it. A WAF/CDN block is a separate gate (check by hand).')
