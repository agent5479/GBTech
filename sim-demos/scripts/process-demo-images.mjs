/**
 * Process primary demo heroes into responsive sizes + cutouts.
 * Sources: img/demos/demo-{id}.jpg (or public/images/demos/)
 * Outputs mirrored to:
 *   - img/demos/{id}/
 *   - sim-demos/public/images/demos/{id}/
 *
 * Run: node scripts/process-demo-images.mjs  (from sim-demos/)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const SIM_PUBLIC = path.resolve(__dirname, '../public/images/demos')
const IMG_DEMOS = path.resolve(ROOT, 'img/demos')

const DEMOS = [
  'coastal',
  'adventure',
  'mohua',
  'bayhop',
  'bayfix',
  'tradeboard',
  'canopy',
  'orchard',
]

const CARD_WIDTHS = [480, 800, 1200]
const HERO_WIDTHS = [800, 1200, 1600]
const JPEG_Q = 78
const WEBP_Q = 72

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

async function writeJpegWebp(pipeline, outDir, basename) {
  const jpgPath = path.join(outDir, `${basename}.jpg`)
  const webpPath = path.join(outDir, `${basename}.webp`)
  await pipeline.clone().jpeg({ quality: JPEG_Q, mozjpeg: true }).toFile(jpgPath)
  await pipeline.clone().webp({ quality: WEBP_Q }).toFile(webpPath)
  return { jpg: `${basename}.jpg`, webp: `${basename}.webp` }
}

async function processDemo(id) {
  const primaryCandidates = [
    path.join(IMG_DEMOS, id, 'primary.jpg'),
    path.join(SIM_PUBLIC, id, 'primary.jpg'),
    path.join(IMG_DEMOS, `demo-${id}.jpg`),
    path.join(SIM_PUBLIC, `demo-${id}.jpg`),
  ]
  const primary = primaryCandidates.find((p) => fs.existsSync(p))
  if (!primary) {
    console.warn(`skip ${id}: no primary`)
    return null
  }

  const meta = await sharp(primary).metadata()
  const w = meta.width || 1200
  const h = meta.height || 675

  const outDirs = [path.join(IMG_DEMOS, id), path.join(SIM_PUBLIC, id)]
  outDirs.forEach(ensureDir)

  // Copy primary into each folder
  for (const dir of outDirs) {
    fs.copyFileSync(primary, path.join(dir, 'primary.jpg'))
  }

  const manifest = {
    id,
    primary: 'primary.jpg',
    card: { widths: CARD_WIDTHS, jpg: {}, webp: {} },
    hero: { widths: HERO_WIDTHS, jpg: {}, webp: {} },
    cutouts: {},
  }

  // Card: full 16:9 cover at multiple widths
  for (const width of CARD_WIDTHS) {
    const pipe = sharp(primary).resize({ width, height: Math.round((width * 9) / 16), fit: 'cover', position: 'centre' })
    for (const dir of outDirs) {
      const files = await writeJpegWebp(pipe, dir, `card-${width}`)
      manifest.card.jpg[width] = files.jpg
      manifest.card.webp[width] = files.webp
    }
  }

  // Hero banner: wider shorter crop (≈ 2.75:1) from upper-middle of image
  for (const width of HERO_WIDTHS) {
    const height = Math.round(width / 2.75)
    const top = Math.round(h * 0.12)
    const cropH = Math.min(Math.round(h * 0.55), h - top)
    const pipe = sharp(primary)
      .extract({ left: 0, top, width: w, height: cropH })
      .resize({ width, height, fit: 'cover', position: 'centre' })
    for (const dir of outDirs) {
      const files = await writeJpegWebp(pipe, dir, `hero-${width}`)
      manifest.hero.jpg[width] = files.jpg
      manifest.hero.webp[width] = files.webp
    }
  }

  // Cutout: background — centre third, soft-blur + slight desat for CSS backgrounds
  {
    const left = Math.round(w * 0.2)
    const top = Math.round(h * 0.2)
    const cw = Math.round(w * 0.6)
    const ch = Math.round(h * 0.6)
    const pipe = sharp(primary)
      .extract({ left, top, width: cw, height: ch })
      .resize({ width: 900 })
      .modulate({ saturation: 0.75, brightness: 1.05 })
      .blur(18)
    for (const dir of outDirs) {
      const files = await writeJpegWebp(pipe, dir, 'cutout-bg')
      manifest.cutouts.bg = files
    }
  }

  // Cutout: detail — lower-right interest crop (tools/trees/boat detail)
  {
    const cw = Math.round(w * 0.42)
    const ch = Math.round(h * 0.5)
    const left = Math.max(0, w - cw - Math.round(w * 0.05))
    const top = Math.max(0, h - ch - Math.round(h * 0.08))
    const pipe = sharp(primary)
      .extract({ left, top, width: cw, height: ch })
      .resize({ width: 640, height: 480, fit: 'cover' })
    for (const dir of outDirs) {
      const files = await writeJpegWebp(pipe, dir, 'cutout-detail')
      manifest.cutouts.detail = files
    }
  }

  // Cutout: band — thin horizontal strip (for chrome / palette bar texture)
  {
    const top = Math.round(h * 0.42)
    const ch = Math.max(48, Math.round(h * 0.14))
    const pipe = sharp(primary)
      .extract({ left: 0, top, width: w, height: Math.min(ch, h - top) })
      .resize({ width: 1400, height: 120, fit: 'cover' })
    for (const dir of outDirs) {
      const files = await writeJpegWebp(pipe, dir, 'cutout-band')
      manifest.cutouts.band = files
    }
  }

  // Cutout: accent overlay PNG — left vignette section with alpha fade (for transparency overlays)
  {
    const cw = Math.round(w * 0.45)
    const ch = Math.round(h * 0.7)
    const top = Math.round(h * 0.15)
    const raw = await sharp(primary)
      .extract({ left: 0, top, width: cw, height: ch })
      .resize({ width: 360, height: 450, fit: 'cover' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const { data, info } = raw
    // Fade right edge to transparent + soft top/bottom
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * 4
        const fx = x / (info.width - 1)
        const fy = y / (info.height - 1)
        const edgeX = Math.min(1, Math.max(0, (0.72 - fx) / 0.72))
        const edgeY = Math.min(fy / 0.12, (1 - fy) / 0.12, 1)
        const a = Math.round(200 * edgeX * edgeY)
        data[i + 3] = a
      }
    }

    for (const dir of outDirs) {
      const out = path.join(dir, 'cutout-overlay.png')
      await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
        .png({ compressionLevel: 9, palette: true, quality: 70 })
        .toFile(out)
      manifest.cutouts.overlay = 'cutout-overlay.png'
    }
  }

  // Write manifest into both output dirs
  for (const dir of outDirs) {
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2))
  }

  console.log(`ok ${id}`)
  return manifest
}

async function main() {
  ensureDir(IMG_DEMOS)
  ensureDir(SIM_PUBLIC)
  const index = {}
  for (const id of DEMOS) {
    const m = await processDemo(id)
    if (m) index[id] = m
  }
  const indexBody = JSON.stringify({ generated: new Date().toISOString(), demos: index }, null, 2)
  fs.writeFileSync(path.join(IMG_DEMOS, 'index.json'), indexBody)
  fs.writeFileSync(path.join(SIM_PUBLIC, 'index.json'), indexBody)
  console.log('done', Object.keys(index).length, 'demos')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
