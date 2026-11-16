// Click-through test for a single-file prototype (system browser via CDP, temp profile, no installs).
// Clicks real, visible elements like a user and checks the visible view, <html dir>, horizontal overflow and broken images.
// Usage: node route-test.mjs <prototype.html> <steps.json> <tempProfileDir> <width> <mobile:0|1> [port]
//
// Prototype convention: each view is <div class="view" data-lang="en|ar" data-page="home|product" hidden?>.
// steps.json example:
// [
//   { "label": "default route",              "expect": { "view": "en/home",    "dir": "ltr" } },
//   { "click": ".lang-btn",                  "expect": { "view": "ar/home",    "dir": "rtl" } },
//   { "click": ".pcard h3 a",                "expect": { "view": "ar/product", "dir": "rtl" } },
//   { "click": ".logo",                      "expect": { "view": "ar/home",    "dir": "rtl" } },
//   { "click": ".tabs a", "label": "placeholder link stays", "expect": { "view": "ar/home", "dir": "rtl" } }
// ]
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const [input, stepsFile, profile, width = '390', mobile = '1', port = '9351'] = process.argv.slice(2);
if (!input || !stepsFile || !profile) { console.log('usage: node route-test.mjs <prototype.html> <steps.json> <profileDir> <width> <mobile 0|1> [port]'); process.exit(1); }
const steps = JSON.parse(readFileSync(stepsFile, 'utf8'));
const EDGE = process.env.BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = spawn(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`, 'about:blank'], { stdio: 'ignore' });
let target;
for (let i = 0; i < 40 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch {} }
if (!target) { console.log('ERROR: no CDP target'); browser.kill(); process.exit(1); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const events = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else if (m.method) events.push(m.method); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;

const state = () => js(`JSON.stringify({ hash: location.hash,
  view: [...document.querySelectorAll('.view')].filter(x => !x.hidden).map(x => x.dataset.lang + '/' + x.dataset.page).join(','),
  dir: document.documentElement.dir, lang: document.documentElement.lang, title: document.title,
  overflowX: document.documentElement.scrollWidth > innerWidth,
  broken: [...document.querySelectorAll('.view:not([hidden]) img')].filter(i => i.complete && !i.naturalWidth).length })`);
// click the first VISIBLE match, preferring the visible view (like a user would)
const click = (sel) => js(`(() => { const s = ${JSON.stringify(sel)};
  const el = [...document.querySelectorAll('.view:not([hidden]) ' + s + ', ' + s)].find(e => e.offsetParent !== null || getComputedStyle(e).position === 'fixed');
  if (!el) return 'NOT FOUND: ' + s; el.scrollIntoView({ block: 'center' }); el.click(); return 'clicked ' + s; })()`);

let pass = 0, fail = 0;
try {
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: +width, height: mobile === '1' ? 844 : 900, deviceScaleFactor: 1, mobile: mobile === '1' });
  await send('Page.navigate', { url: pathToFileURL(input).href });
  for (let i = 0; i < 80 && !events.includes('Page.loadEventFired'); i++) await sleep(250);
  await js(`document.fonts.ready.then(() => 1)`);
  for (const st of steps) {
    let missing = false;
    if (st.click) { const r = await click(st.click); missing = r.startsWith('NOT FOUND'); console.log('  ', r); }
    await sleep(350);
    const s = JSON.parse(await state());
    const ok = !missing && (!st.expect?.view || s.view === st.expect.view) && (!st.expect?.dir || s.dir === st.expect.dir) && !s.overflowX && s.broken === 0;
    ok ? pass++ : fail++;
    const label = st.label || (st.click ? `click ${st.click}` : 'state');
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(40)} view=${s.view} dir=${s.dir} lang=${s.lang} overflowX=${s.overflowX} broken=${s.broken} title="${s.title}"`);
  }
  console.log(`\n${pass} PASS / ${fail} FAIL  (width ${width}, mobile=${mobile})`);
} finally {
  try { await send('Browser.close'); } catch {}
  ws.close(); setTimeout(() => { browser.kill(); process.exit(0); }, 400);
}
