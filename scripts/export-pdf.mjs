// Exports an HTML proposal to a tagged A4 PDF with the local browser print engine (no third-party service).
// The approved HTML is loaded unchanged; an optional print.css is injected at runtime (pass - for none).
// Keep scale at 1 for RTL pages (Chromium misplaces RTL content at scale < 1); shrink with CSS zoom in print.css instead.
// Usage: node export-pdf.mjs <input.html> <output.pdf> <print.css|-> <tempProfileDir> [scale=1] [port=9337]
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const [input, output, cssFile, profile, scale = '1', portArg = '9337'] = process.argv.slice(2);
const EDGE = process.env.BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = +portArg;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = spawn(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  `--user-data-dir=${profile}`, `--remote-debugging-port=${PORT}`, 'about:blank'], { stdio: 'ignore' });
let target;
for (let i = 0; i < 40 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page'); } catch {} }
if (!target) { console.log('ERROR: no CDP target'); browser.kill(); process.exit(1); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const events = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else if (m.method) events.push(m.method); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

try {
  await send('Page.enable');
  await send('Page.navigate', { url: pathToFileURL(input).href });
  for (let i = 0; i < 80 && !events.includes('Page.loadEventFired'); i++) await sleep(250);
  const css = cssFile && cssFile !== '-' ? readFileSync(cssFile, 'utf8') : '';
  const ready = await send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async () => {
    const s = document.createElement('style'); s.media = 'print'; s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s);
    await document.fonts.ready;
    const imgs = [...document.images]; await Promise.all(imgs.map(i => i.decode().catch(() => {})));
    const fonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight);
    return JSON.stringify({ images: imgs.length, broken: imgs.filter(i => !i.naturalWidth).length, fontsLoaded: [...new Set(fonts)] });
  })()` });
  console.log('ready:', ready.result.result.value);
  await sleep(800);
  const pdf = await send('Page.printToPDF', {
    paperWidth: 8.27, paperHeight: 11.69, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
    printBackground: true, scale: +scale, preferCSSPageSize: true, displayHeaderFooter: false, generateTaggedPDF: true,
  });
  if (!pdf.result) { console.log('ERROR:', JSON.stringify(pdf.error)); }
  else { const buf = Buffer.from(pdf.result.data, 'base64'); writeFileSync(output, buf); console.log(`PDF written: ${output} (${buf.length} bytes)`); }
} finally {
  try { await send('Browser.close'); } catch {}
  ws.close(); setTimeout(() => { browser.kill(); process.exit(0); }, 500);
}
