const path = require('path')
const fs = require('fs')
const ffmpegPath = require('ffmpeg-static')
const ffmpeg = require('fluent-ffmpeg')

ffmpeg.setFfmpegPath(ffmpegPath)

const input = path.resolve(__dirname, '../public/video/social-money_intro_30s_1080x1920.mp4')
const output = path.resolve(__dirname, '../public/video/social-money_intro_30s_1080x1920.webm')

if (!fs.existsSync(input)) {
  console.error('Input file not found:', input)
  process.exit(1)
}

console.log('Converting', input, '->', output)

ffmpeg(input)
  .outputOptions([
    '-c:v libvpx-vp9',
    '-b:v 0',
    '-crf 30',
    '-c:a libopus',
    '-b:a 64k',
    '-threads 2',
  ])
  .on('progress', (p) => {
    if (p.percent) process.stdout.write(`\r${Math.round(p.percent)}% `)
  })
  .on('end', () => {
    console.log('\nConversion finished')
  })
  .on('error', (err) => {
    console.error('\nConversion error:', err)
    process.exit(1)
  })
  .save(output)
