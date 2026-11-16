// Page-fit checker for fixed-size A4 .page layouts (system Edge via CDP, temp profile, no installs).
// Usage: node pagecheck.mjs <input.html> <tempProfileDir> [footerReservePx=62] [port]
// Reports, per .page (794x1123 A4 blocks), the lowest in-flow content edge vs the footer limit (1123 - reserve).
// Elements inside .ph/.pf (page header/footer) and absolutely positioned decorations are ignored.
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const [input, profile, reserveArg = '62', port = '9343'] = process.argv.slice(2);
const RESERVE = +reserveArg;
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
const evalJs = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;

const CHECK = `JSON.stringify([...document.querySelectorAll('.page')].map((p, i) => {
  const top = p.getBoundingClientRect().top; let max = 0, who = '';
  p.querySelectorAll('*').forEach((e) => {
    if (e.closest('.ph, .pf') || getComputedStyle(e).position === 'absolute') return;
    const r = e.getBoundingClientRect();
    if (r.height && r.bottom - top > max) { max = r.bottom - top; who = e.tagName + '.' + (typeof e.className === 'string' ? e.className : ''); }
  });
  return { page: i + 1, bottom: Math.round(max), over: Math.round(max - (1123 - ${RESERVE})), who };
}))`;

try {
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 860, height: 1200, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: pathToFileURL(input).href });
  for (let i = 0; i < 80 && !events.includes('Page.loadEventFired'); i++) await sleep(250);
  await evalJs(`(async () => { const t = (p) => Promise.race([p, new Promise((r) => setTimeout(r, 8000))]);
    await t(document.fonts.ready); await t(Promise.all([...document.images].map((i) => i.decode().catch(() => {})))); })()`);
  await sleep(500);
  for (const r of JSON.parse(await evalJs(CHECK))) {
    console.log(`p${String(r.page).padStart(2)} bottom ${r.bottom} ${r.over > 0 ? `OVER by ${r.over} (${r.who})` : `ok, free ${-r.over}`}`);
  }
  console.log('broken images:', await evalJs(`JSON.stringify([...document.images].filter((i) => !i.naturalWidth).map((i) => i.src))`));
  console.log('fonts:', await evalJs(`JSON.stringify([...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family))])`));
} finally {
  try { await send('Browser.close'); } catch {}
  ws.close(); setTimeout(() => { browser.kill(); process.exit(0); }, 400);
}
