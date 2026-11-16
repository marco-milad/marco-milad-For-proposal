# Arabic, RTL and export gotchas (each one cost real time)

## HTML / CSS
- Set `<html dir="rtl" lang="ar">` and use logical properties (`margin-inline-start`, `inset-inline-end`) so one stylesheet serves both languages.
- **Latin with numbers inside Arabic text** gets scrambled: "LCP 12.2s", "Week 1–4", "W3C AA". Wrap each such token in `<bdi>…</bdi>`. Footers that mix a URL, © and Arabic text need the same treatment.
- Code and URL tokens: give `.mono` the rule `white-space: nowrap`. Mirrored parentheses on mixed runs: split them into separately directed spans.
- Grids inside RTL heroes overflow on mobile unless the grid children have `min-width: 0`.
- Fixed mobile bars, like a WhatsApp button, cover the footer. Add footer bottom padding (~96px) on mobile.

## Screenshots (CDP)
- `captureBeyondViewport: true` **shifts RTL pages about 290px**. Instead, resize the viewport to the full page height with `Emulation.setDeviceMetricsOverride`, scroll to 0,0, and capture without that flag. `shot.mjs` already does this.
- Lazy images never decode in headless mode. Before capturing, set them to `loading=eager`, then wait on `img.decode()` and `document.fonts.ready` with a timeout race (8 s).

## PDF (`Page.printToPDF`)
- Chromium's print `scale` < 1 misplaces RTL content. Use scale 1 and, if needed, shrink with CSS `zoom` in an injected print stylesheet.
- Use `generateTaggedPDF: true` and `preferCSSPageSize: true`. Fixed A4 `.page` blocks of 794×1123 px need a forced page break between them. A heading stranded at the bottom of a page gets a forced break before it.
- Glyphs missing from the main fonts (← ≤) fall back to Tahoma or Arial. They still render; mention it in the export notes.

## PPTX (pptxgenjs, editable)
- `rtlMode` / `align` on the text options only reach plain strings. For run arrays, set `rtlMode: true, align: 'right'` on **every run**.
- Digits inside `lang: 'ar-EG'` runs display as Arabic-Indic digits (٠١٢) in PowerPoint. Split digit sequences into their own runs with `lang: 'en-US'`. Wrap `slide.addText` once with a normalizer so every slide gets it:

```js
const DIGITS = /([0-9][0-9%.,:\/–-]*)/;
function normalize(content, opts = {}) {
  if (!opts.rtlMode) return content;
  const runs = typeof content === 'string' ? [{ text: content, options: {} }] : content.map((r) => ({ text: r.text, options: { ...(r.options || {}) } }));
  const out = [];
  for (const r of runs) {
    const o = { rtlMode: true, align: opts.align || 'right', ...r.options };
    const lang = o.lang || opts.lang || 'ar-EG';
    if (lang === 'en-US' || !/[0-9]/.test(r.text)) { out.push({ text: r.text, options: o }); continue; }
    const parts = r.text.split(DIGITS).filter((p) => p !== '');
    parts.forEach((p, i) => { const po = { ...o };
      if (i > 0) { delete po.bullet; delete po.paraSpaceAfter; delete po.indentLevel; }
      if (i < parts.length - 1) delete po.breakLine;
      if (DIGITS.test(p) && /^[0-9]/.test(p)) po.lang = 'en-US';
      out.push({ text: p, options: po }); });
  }
  return out;
}
const wrap = (s) => { const orig = s.addText.bind(s); s.addText = (c, o) => orig(normalize(c, o), o); return s; };
```

- Spaces at an Arabic/Latin run boundary collapse. Use an em space ` `. Put URLs and © lines in their own LTR text boxes.
- Older PowerPoint (2010) cannot show WebP. Convert images to PNG/JPEG first.
- Safe fonts that cover Arabic: Times New Roman (headings) and Arial (body).
- If the skill validator needs packages that aren't approved (lxml), validate by opening the file in the installed PowerPoint via COM (PowerShell `PowerPoint.Application`) and exporting each slide to PNG at 1600×900 for visual QA.

## Windows console / tooling
- Arabic printed by Python to the console comes out as cp1256 mojibake. Call `sys.stdout.reconfigure(encoding='utf-8')` and read result files rather than the console.
- Long or complex Bash heredocs can truncate. Write files with the file-writing tool instead.
- A regex that deletes "lines containing X" from built CSS/JS can also cut neighbouring JS lines and closing braces. After any scripted removal, re-run the route tests.
