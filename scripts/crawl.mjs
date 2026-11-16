// Polite sitemap crawl: plain fetch (Node default UA, no header spoofing), sequential, delayMs apart.
// Saves raw HTML + status per URL so parsing can be redone offline (see extract.py).
// Usage: node crawl.mjs <sitemap.xml> <outDir> [excludeRegex] [keepExcluded=3] [delayMs=2000]
//   excludeRegex  e.g. "/customers|/blog/tag" - large repetitive sections; only keepExcluded samples are fetched.
// Check robots.txt yourself first and honour any Crawl-delay (raise delayMs). Never bypass a 403/WAF: record it.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const [sitemap, out, excludeArg = '', keepArg = '3', delayArg = '2000'] = process.argv.slice(2);
if (!sitemap || !out) { console.log('usage: node crawl.mjs <sitemap.xml> <outDir> [excludeRegex] [keepExcluded=3] [delayMs=2000]'); process.exit(1); }
mkdirSync(`${out}/raw`, { recursive: true });
const locs = [...readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const ex = excludeArg ? new RegExp(excludeArg) : null;
const urls = ex ? [...locs.filter((u) => !ex.test(u)), ...locs.filter((u) => ex.test(u)).slice(0, +keepArg)] : locs;
console.log(`sitemap URLs: ${locs.length}; crawling: ${urls.length}`);
const log = [];
for (const [i, u] of urls.entries()) {
  const t0 = Date.now();
  try {
    const r = await fetch(u, { redirect: 'manual' });
    const body = await r.text();
    const file = `raw/${String(i).padStart(3, '0')}.html`;
    writeFileSync(`${out}/${file}`, body);
    log.push({ url: u, status: r.status, location: r.headers.get('location'), ms: Date.now() - t0, bytes: body.length, file });
  } catch (e) { log.push({ url: u, error: e.message }); }
  if (i % 20 === 0) console.log(`${i + 1}/${urls.length}`);
  await new Promise((r) => setTimeout(r, +delayArg));
}
writeFileSync(`${out}/crawl-log.json`, JSON.stringify(log, null, 1));
console.log('done', log.length, 'non-200:', log.filter((l) => l.status !== 200).map((l) => `${l.status ?? l.error} ${l.url}`));
