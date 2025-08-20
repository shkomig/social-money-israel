const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const INPUT = path.join(__dirname, '..', 'public', 'images', 'social-money-logo-official.png')
const OUT_DIR = path.join(__dirname, '..', 'public', 'images')

if (!fs.existsSync(INPUT)) {
  console.error('Input logo not found:', INPUT)
  process.exit(1)
}

const sizes = [64, 128, 256, 512]

async function generate() {
  for (const size of sizes) {
    const baseName = `social-money-logo-official-${size}`
    const outAvif = path.join(OUT_DIR, `${baseName}.avif`)
    const outWebp = path.join(OUT_DIR, `${baseName}.webp`)
    const outPng = path.join(OUT_DIR, `${baseName}.png`)

    await sharp(INPUT).resize(size).avif({ quality: 65 }).toFile(outAvif)

    await sharp(INPUT).resize(size).webp({ quality: 75 }).toFile(outWebp)

    await sharp(INPUT).resize(size).png({ compressionLevel: 9 }).toFile(outPng)

    console.log('Generated', outAvif, outWebp, outPng)
  }

  // Also generate a small favicon-sized PNG
  await sharp(INPUT)
    .resize(48, 48)
    .png()
    .toFile(path.join(OUT_DIR, `social-money-logo-official-48.png`))
  console.log('Generated favicon-sized PNG')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
