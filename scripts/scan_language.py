# Impact-language, commercial-commitment, excluded-claim, competitor and leak scan of a client-facing proposal.
# Every hit is printed with context; each must be removed or justified in qa-report.md.
# Usage: python -I scan_language.py <proposal.html> [scan-config.json] > language-scan.txt
# scan-config.json (all keys optional):
#   {"competitors": [...names/domains...], "excluded_claims": [...], "extra_leaks": [...]}
import html, json, re, sys

sys.stdout.reconfigure(encoding='utf-8')
src = open(sys.argv[1], encoding='utf-8').read()
cfg = json.load(open(sys.argv[2], encoding='utf-8')) if len(sys.argv) > 2 else {}
src = re.sub(r'<(style|script)\b.*?</\1>', '', src, flags=re.S | re.I)
comments = re.findall(r'<!--(.*?)-->', src, flags=re.S)
src = re.sub(r'<!--.*?-->', '', src, flags=re.S)
text = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', src)))

GROUPS = {
    'impact / outcome claims': ['خسار', 'نخسر', 'يخسر', 'تخسر', 'إيراد', 'أرباح', 'مبيعات أكثر', 'زيادة', 'يزيد', 'مضاعف',
                                'ROI', 'revenue', 'lost', 'losing', 'increase', 'boost', 'double', 'invisible'],
    'guarantees / promises': ['نضمن', 'ضمان', 'مضمون', 'نَعِد', 'نعد ', 'وعد', 'guarantee', 'promise',
                              'الصفحة الأولى', 'المركز الأول', 'first page', '#1'],
    'ranking language': ['ترتيب', 'rank', 'تتصدر', 'يتصدر'],
    'commercial / time commitments': ['سعر', 'أسعار', 'تكلفة', 'جنيه', 'EGP', 'USD', 'دولار', '$', 'أسبوع', 'أسابيع',
                                      'Week', 'week', 'شهر', 'يوم ', 'deposit', 'دفعة', 'باقة', 'package'],
    'excluded claims': cfg.get('excluded_claims', ['وكيل', 'حصري', 'exclusive', 'authorized', 'sole distributor',
                                                   'الأفضل', 'الأول في', 'رائد', 'leading', 'best']),
    'competitors (must be absent)': cfg.get('competitors', []),
    'leaks / placeholders': ['TODO', 'TBD', 'lorem', 'Lorem', 'XX', 'FILE_ID', 'O-inc', 'Gate ', 'candidate',
                             'Your number', 'Your email', '[', ']', 'placeholder'] + cfg.get('extra_leaks', []),
    'percentages': ['%'],
}
for g, terms in GROUPS.items():
    print(f'\n## {g}')
    hits = 0
    for t in terms:
        for m in re.finditer(re.escape(t), text):
            hits += 1
            print(f'- [{t}] …{text[max(0, m.start() - 70):m.end() + 50]}…')
    if not hits:
        print('- none')
print('\n## HTML comments (must hold no internal notes)')
print('\n'.join(f'- {c.strip()[:120]}' for c in comments if c.strip()) or '- none')
