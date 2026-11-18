const sharp = require('sharp');
const SRC = 'public/assets/welcome/logo.png';
const ICONS = 'public/icons';

(async () => {
  // Any-purpose icons
  await Promise.all([192, 512].map((s) =>
    sharp(SRC).resize(s, s, { fit: 'cover' }).png().toFile(ICONS + '/icon-' + s + '.png')
  ));

  // Maskable icons — content inside central 80% safe zone; fill with brand orange
  const bg = { r: 249, g: 115, b: 22, alpha: 1 };
  await Promise.all([192, 512].map((s) => {
    const pad = Math.round(s * 0.16);
    return sharp(SRC)
      .resize(s - 2 * pad, s - 2 * pad, { fit: 'contain', background: bg })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: bg })
      .png()
      .toFile(ICONS + '/icon-maskable-' + s + '.png');
  }));

  // Apple touch icon — opaque square, no transparency
  await sharp(SRC)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: '#ffffff' })
    .png()
    .toFile(ICONS + '/apple-touch-icon.png');

  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
