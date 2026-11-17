// Automated UI/UX checks on one rendered page (local file or URL) with the system Edge/Chrome over CDP. No installs.
// Usage: node ux_check.mjs <input.html[#hash] | https://url> <width> <mobile:0|1> <tempProfileDir> [port] [out.json]
// Checks (rendered DOM, not source):
//   contrast    every visible text element vs its effective background, WCAG 2 AA (4.5:1 normal, 3:1 large text).
//               Text over a background image/gradient cannot be measured -> reported as "unmeasured", never as a pass or fail.
//   tap         interactive targets smaller than 24x24 CSS px (WCAG 2.2 AA 2.5.8) = fail; smaller than 44x44 = advisory.
//   font        visible text below 12px (mobile runs only).
//   names       links/buttons with no accessible name; form fields with no label (placeholder-only is flagged too).
//   page        html lang/dir, viewport meta, horizontal overflow, broken images, h1 count.
// One page load, default user agent. For a live client site, run it only on the handful of representative URLs.
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const [input, width, mobile, profile, port = '9351', outJson] = process.argv.slice(2);
if (!input || !width || !profile) { console.log('usage: node ux_check.mjs <input|url> <width> <mobile 0|1> <profileDir> [port] [out.json]'); process.exit(1); }
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
const evalJs = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result?.value;

// Runs inside the page. Kept as a plain function and stringified.
function audit(mobileRun) {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const over = (top, bot) => { const a = top[3]; return [0, 1, 2].map((i) => top[i] * a + bot[i] * (1 - a)).concat(1); };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const hex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const visible = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0; };
  const label = (e) => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''));
  const sample = (e) => (e.innerText || e.value || e.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40);

  // Effective background: stack translucent layers up the tree; stop at an image/gradient (unmeasurable).
  const background = (e) => {
    const layers = [];
    for (let n = e; n && n.nodeType === 1; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.backgroundImage && s.backgroundImage !== 'none') return null;
      const c = parse(s.backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
    }
    let bg = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
    return bg;
  };

  const contrastFails = new Map(); let measured = 0, unmeasured = 0;
  for (const e of document.querySelectorAll('body *')) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'TEMPLATE'].includes(e.tagName.toUpperCase())) continue;
    const ownText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!ownText || !visible(e) || e.closest('[aria-hidden="true"]')) continue;
    const s = getComputedStyle(e);
    const bg = background(e);
    if (!bg) { unmeasured++; continue; }
    const fg = parse(s.color); if (!fg) continue;
    const fgFlat = over(fg, bg);
    const size = parseFloat(s.fontSize), bold = +s.fontWeight >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const r = ratio(fgFlat, bg); measured++;
    const need = large ? 3 : 4.5;
    if (r < need) {
      const k = `${hex(fgFlat)} on ${hex(bg)}`;
      const cur = contrastFails.get(k) || { pair: k, ratio: +r.toFixed(2), need, count: 0, examples: [] };
      cur.count++; if (cur.examples.length < 3) cur.examples.push(`${label(e)} "${sample(e)}"`);
      contrastFails.set(k, cur);
    }
  }

  const interactive = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [tabindex]:not([tabindex="-1"])')].filter(visible);
  const tapFail = [], tapSmall = [], tapSpaced = [];
  const rects = interactive.map((e) => e.getBoundingClientRect());
  for (const [i, e] of interactive.entries()) {
    const r = rects[i];
    // Inline links inside a sentence are exempt from target size (WCAG 2.5.8 exception).
    if (e.tagName === 'A' && getComputedStyle(e).display === 'inline' && e.parentElement && /P|LI|SPAN|TD/.test(e.parentElement.tagName)) continue;
    const item = `${label(e)} ${Math.round(r.width)}x${Math.round(r.height)} "${sample(e)}"`;
    if (r.width < 24 || r.height < 24) {
      // Spacing exception: an undersized target passes if a 24x24 box centred on it touches no other target.
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const box = { l: Math.min(r.left, cx - 12), r: Math.max(r.right, cx + 12), t: Math.min(r.top, cy - 12), b: Math.max(r.bottom, cy + 12) };
      const hit = rects.some((o, j) => j !== i && o.width && o.left < box.r && o.right > box.l && o.top < box.b && o.bottom > box.t
        && !(interactive[j].contains(e) || e.contains(interactive[j])));
      (hit ? tapFail : tapSpaced).push(item);
    } else if (r.width < 44 || r.height < 44) tapSmall.push(item);
  }

  const small = mobileRun ? [...document.querySelectorAll('body *')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && visible(e) && parseFloat(getComputedStyle(e).fontSize) < 12) : [];

  const accName = (e) => (e.getAttribute('aria-label') || '').trim() || (e.getAttribute('aria-labelledby') && document.getElementById(e.getAttribute('aria-labelledby'))?.innerText.trim()) || (e.innerText || '').trim() || e.getAttribute('title') || [...e.querySelectorAll('img[alt]')].map((i) => i.alt).join('').trim() || (e.tagName === 'INPUT' ? e.value : '');
  const unnamed = [...document.querySelectorAll('a[href], button, [role=button]')].filter(visible).filter((e) => !accName(e)).map((e) => label(e) + ' ' + (e.getAttribute('href') || ''));
  const fields = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea')].filter(visible);
  const hasLabel = (f) => (f.id && document.querySelector(`label[for="${CSS.escape(f.id)}"]`)) || f.closest('label') || f.getAttribute('aria-label') || f.getAttribute('aria-labelledby');
  const unlabelled = fields.filter((f) => !hasLabel(f)).map((f) => `${label(f)}${f.placeholder ? ' (placeholder only: "' + f.placeholder + '")' : ''}`);

  const de = document.documentElement;
  return {
    page: {
      title: document.title, lang: de.lang || null, dir: de.dir || getComputedStyle(de).direction,
      viewportMeta: document.querySelector('meta[name=viewport]')?.content || null,
      overflowX: de.scrollWidth > innerWidth, scrollWidth: de.scrollWidth, width: innerWidth,
      h1: [...document.querySelectorAll('h1')].filter(visible).length,
      brokenImages: [...document.images].filter((i) => i.complete && !i.naturalWidth).map((i) => i.src.split('/').pop()).slice(0, 10),
      interactiveCount: interactive.length, formFields: fields.length,
    },
    contrast: { measured, unmeasuredOverImage: unmeasured, failingPairs: [...contrastFails.values()].sort((a, b) => b.count - a.count) },
    tapTargets: { fail_under_24: tapFail.slice(0, 15), failCount: tapFail.length, under24ButSpaced: tapSpaced.length, advisory_under_44: tapSmall.slice(0, 10), advisoryCount: tapSmall.length },
    smallText: { under12px: small.length, examples: small.slice(0, 5).map((e) => `${label(e)} ${getComputedStyle(e).fontSize} "${sample(e)}"`) },
    names: { unnamedLinksButtons: unnamed.slice(0, 15), unnamedCount: unnamed.length, unlabelledFields: unlabelled.slice(0, 15), unlabelledCount: unlabelled.length },
  };
}

try {
  const w = +width, mob = mobile === '1';
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: mob ? 844 : 900, deviceScaleFactor: 1, mobile: mob });
  if (mob) await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  let url = input;
  if (!/^https?:\/\//.test(input)) { const [file, hash] = input.split('#'); url = pathToFileURL(file).href + (hash ? '#' + hash : ''); }
  await send('Page.navigate', { url });
  for (let i = 0; i < 120 && !events.includes('Page.loadEventFired'); i++) await sleep(250);
  await evalJs(`(async () => { const t = (p) => Promise.race([p, new Promise(r => setTimeout(r, 8000))]); await t(document.fonts.ready); })()`);
  await sleep(1200);
  const result = await evalJs(`(${audit.toString()})(${mob})`);
  const report = { input, width: w, mobile: mob, checkedAt: new Date().toISOString(), ...result };
  if (outJson) writeFileSync(outJson, JSON.stringify(report, null, 1));
  const p = report.page, c = report.contrast, t = report.tapTargets, n = report.names;
  console.log(`page: lang=${p.lang} dir=${p.dir} viewport=${p.viewportMeta ? 'yes' : 'MISSING'} h1=${p.h1} overflowX=${p.overflowX} (${p.scrollWidth}/${p.width}) broken images=${p.brokenImages.length}`);
  if (mob && !p.viewportMeta) console.log('  no viewport meta: mobile browsers render this page at ~980px and shrink it; the overflow check above is not meaningful');
  console.log(`contrast: ${c.measured} text elements measured, ${c.unmeasuredOverImage} over images/gradients (check by eye); failing color pairs: ${c.failingPairs.length}`);
  for (const f of c.failingPairs.slice(0, 8)) console.log(`  ${f.pair} = ${f.ratio}:1 (needs ${f.need}) x${f.count}  e.g. ${f.examples[0]}`);
  console.log(`tap targets (${p.interactiveCount}): under 24px and crowded (fail) = ${t.failCount}; under 24px but spaced (passes 2.5.8) = ${t.under24ButSpaced}; under 44px (advisory) = ${t.advisoryCount}`);
  for (const x of t.fail_under_24.slice(0, 5)) console.log(`  ${x}`);
  if (mob) console.log(`text under 12px: ${report.smallText.under12px}`);
  console.log(`links/buttons with no accessible name: ${n.unnamedCount}; form fields without a label: ${n.unlabelledCount} of ${p.formFields}`);
  for (const x of [...n.unnamedLinksButtons.slice(0, 3), ...n.unlabelledFields.slice(0, 3)]) console.log(`  ${x}`);
  if (outJson) console.log(`wrote ${outJson}`);
} finally {
  try { await send('Browser.close'); } catch {}
  ws.close(); setTimeout(() => { browser.kill(); process.exit(0); }, 400);
}
