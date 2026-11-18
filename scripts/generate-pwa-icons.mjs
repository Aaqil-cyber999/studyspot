import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import path from 'path';

const SRC = path.join(process.cwd(), 'public/assets/welcome/logo.png');
const ICONS = path.join(process.cwd(), 'public/icons');

await mkdir(ICONS, { recursive: true });

const outputs = [
  { name: 'icon-192.png', size: 192, mode: 'white-cover' },
  { name: 'icon-512.png', size: 512, mode: 'white-cover' },
  { name: 'icon-maskable-192.png', size: 192, mode: 'white-pad', pad: 0.16 },
  { name: 'icon-maskable-512.png', size: 512, mode: 'white-pad', pad: 0.16 },
];

const white = { r: 255, g: 255, b: 255, alpha: 1 };

for (const out of outputs) {
  const s = out.size;
  if (out.mode === 'white-cover') {
    await sharp(SRC)
      .flatten({ background: '#ffffff' })
      .resize(s, s, { fit: 'cover', background: white })
      .png()
      .toFile(path.join(ICONS, out.name));
    continue;
  }
  const pad = Math.round(s * out.pad);
  await sharp(SRC)
    .resize(s - 2 * pad, s - 2 * pad, { fit: 'contain', background: white })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: white })
    .flatten({ background: '#ffffff' })
    .png()
    .toFile(path.join(ICONS, out.name));
}

await sharp(SRC)
  .resize(180, 180, { fit: 'contain', background: white })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile(path.join(ICONS, 'apple-touch-icon.png'));

console.log('icons generated');
