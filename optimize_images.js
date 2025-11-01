/*
Node script to optimize images in assets/:
- Creates thumbnails in assets/thumbs/ (max width 1000px, JPEG)
- Creates WebP copies in assets/webp/ (quality 75)

Usage:
  npm install
  npm run optimize

Notes:
- Uses sharp; installing sharp will compile native binaries. If that fails on your machine, see the README below for a Python fallback.
*/

const fg = require('fast-glob');
const path = require('path');
const fs = require('fs/promises');
const sharp = require('sharp');

const BASE = path.resolve(__dirname);
const ASSETS = path.join(BASE, 'assets');
const THUMBS = path.join(ASSETS, 'thumbs');
const WEBP = path.join(ASSETS, 'webp');

const MAX_WIDTH = 1000;
const JPEG_QUALITY = 75;
const WEBP_QUALITY = 75;

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimize(file) {
  try {
    const rel = path.relative(ASSETS, file);
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, ext);

    // Create thumbnail (jpeg)
    const thumbOut = path.join(THUMBS, name + '.jpg');
    await sharp(file)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY })
      .toFile(thumbOut);

    // Create webp
    const webpOut = path.join(WEBP, name + '.webp');
    await sharp(file)
      .rotate()
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpOut);

    console.log(`Processed: ${rel}`);
  } catch (err) {
    console.error(`Failed: ${file}`, err.message);
  }
}

async function main() {
  await ensureDir(THUMBS);
  await ensureDir(WEBP);

  // match jpg, jpeg, png (skip thumbs and webp folders)
  const entries = await fg(['assets/**/*.jpg', 'assets/**/*.jpeg', 'assets/**/*.png'], { ignore: ['assets/thumbs/**', 'assets/webp/**'] });
  console.log(`Found ${entries.length} images`);
  for (const e of entries) {
    await optimize(e);
  }
  console.log('Done');
}

main().catch(err => console.error(err));
