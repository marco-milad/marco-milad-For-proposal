// Full-page screenshot of a local HTML file with the system Edge (CDP, temp profile, no installs).
// Usage: node shot.mjs <input.html[#hash]> <output.png> <width> <dpr> <mobile:0|1> <tempProfileDir> [port]
// Prints: page size + horizontal-overflow check (scrollWidth > width).
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const [input, output, width, dpr, mobile, profile, port = '9341'] = process.argv.slice(2);
const EDGE = process.env.BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = spawn(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--hide-scrollbars', `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`, 'about:blank'], { stdio: 'ignore' });
let target;
for (let i = 0; i < 40 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch {} }
if (!target) { console.log('ERROR: no CDP target'); browser.kill(); process.exit(1); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const events = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else if (m.method) events.push(m.method); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;

try {
  const w = +width, d = +dpr, mob = mobile === '1';
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: mob ? 844 : 900, deviceScaleFactor: d, mobile: mob });
  if (mob) await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  const [file, hash] = input.split('#');
  await send('Page.navigate', { url: pathToFileURL(file).href + (hash ? '#' + hash : '') });
  for (let i = 0; i < 80 && !events.includes('Page.loadEventFired'); i++) await sleep(250);
  await evalJs(`(async () => { document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager');
    const t = (p) => Promise.race([p, new Promise(r => setTimeout(r, 8000))]);
    await t(document.fonts.ready); await t(Promise.all([...document.images].map(i => i.decode().catch(() => {})))); })()`);
  await sleep(600);
  const info = JSON.parse(await evalJs(`JSON.stringify({ sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight,
    broken: [...document.images].filter(i => !i.naturalWidth).map(i => i.src.split('/').pop()),
    out: [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); }).slice(0, 6).map(e => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().left) + '..' + Math.round(e.getBoundingClientRect().right)),
    fonts: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))] })`));
  const fullW = Math.max(w, info.sw);
  await send('Emulation.setDeviceMetricsOverride', { width: fullW, height: info.sh, deviceScaleFactor: d, mobile: mob });
  await sleep(500);
  await evalJs('window.scrollTo(0, 0)');
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(output, Buffer.from(shot.result.data, 'base64'));
  console.log(JSON.stringify({ output: output.split(/[\\/]/).pop(), width: w, scrollWidth: info.sw, height: info.sh, overflowX: info.sw > w, broken: info.broken, out: info.out, fonts: info.fonts }));
} finally {
  try { await send('Browser.close'); } catch {}
  ws.close(); setTimeout(() => { browser.kill(); process.exit(0); }, 400);
}
