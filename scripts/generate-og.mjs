// Rasterise public/og-source.svg -> public/og-default.png (1200x630)
// Run automatically before each build via the "prebuild" npm script.
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'public/og-source.svg');
const out = resolve(root, 'public/og-default.png');

if (!existsSync(src)) {
  console.error(`[og] Source SVG not found: ${src}`);
  process.exit(1);
}

const svg = readFileSync(src, 'utf-8');
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  background: '#0a0a0a',
  font: {
    // System fallback is fine; we don't ship custom fonts here.
    loadSystemFonts: true,
    defaultFontFamily: 'Inter',
  },
});
const png = resvg.render().asPng();
writeFileSync(out, png);
console.log(`[og] Generated ${out} (${(png.length / 1024).toFixed(1)} KB)`);
