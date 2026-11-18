import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import path from 'path';

const SRC = path.join(process.cwd(), 'public/assets/welcome/logo.png');
const ICONS = path.join(process.cwd(), 'public/icons');

await mkdir(ICONS, { recursive: true });

const outputs = [
  { name: 'icon-192.png', size: 192, fit: 'cover' },
  { name: 'icon-512.png', size: 512, fit: 'cover' },
  { name: 'icon-maskable-192.png', size: 192, fit: 'contain', bg: { r: 249, g: 115, b: 22, alpha: 1 }, pad: 0.16 },
  { name: 'icon-maskable-512.png', size: 512, fit: 'contain', bg: { r: 249, g: 115, b: 22, alpha: 1 }, pad: 0.16 },
];

for (const out of outputs) {
  const s = out.size;
  if (!out.pad) {
    await sharp(SRC).resize(s, s, { fit: 'cover' }).png().toFile(path.join(ICONS, out.name));
    continue;
  }
  const pad = Math.round(s * out.pad);
  await sharp(SRC)
    .resize(s - 2 * pad, s - 2 * pad, { fit: 'contain', background: out.bg })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: out.bg })
    .png()
    .toFile(path.join(ICONS, out.name));
}

await sharp(SRC)
  .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile(path.join(ICONS, 'apple-touch-icon.png'));

console.log('icons generated');
