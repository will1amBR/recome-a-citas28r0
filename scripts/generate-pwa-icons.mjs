/* Gera os ícones PNG do PWA Recomeça a partir de um desenho vetorial simples.
   Rodar: node scripts/generate-pwa-icons.mjs
   Resultado: public/pwa-icon-192.png, public/pwa-icon-512.png,
              public/apple-touch-icon.png (180x180)
   Sem imagens de substâncias: apenas a marca (R + broto de recomeço). */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

function crc32(buf) {
  let c
  const table = []
  for (let n = 0; n < 256; n++) {
    c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  let crc = 0 ^ -1
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff]
  return (crc ^ -1) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crc])
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filtro none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// Paleta Recomeça (docs/design-system.md)
const PRIMARY = [0x7f, 0xbf, 0xa8] // verde-água
const PRIMARY_DARK = [0x6d, 0xa9, 0x8f]
const TEXT = [0x2f, 0x4a, 0x3e] // verde-musgo
const OFFWHITE = [0xfd, 0xfa, 0xf5] // off-white de fundo

function drawIcon(size) {
  const rgba = Buffer.alloc(size * size * 4)
  const center = size / 2
  const radius = size / 2
  const S = size / 512 // escala a partir de um canvas 512x512

  // Retângulo arredondado de fundo (mask Apple precisa opaco)
  const cornerR = 96 * S
  function inRoundedRect(x, y) {
    const r = cornerR
    if (x < r && y < r) return dist(x, y, r, r) <= r
    if (x > size - r && y < r) return dist(x, y, size - r, r) <= r
    if (x < r && y > size - r) return dist(x, y, r, size - r) <= r
    if (x > size - r && y > size - r) return dist(x, y, size - r, size - r) <= r
    return true
  }
  function dist(x, y, cx, cy) {
    return Math.hypot(x - cx, y - cy)
  }

  // Coordenadas locais do glifo "R" (contorno grosseiro) + broto
  function inGlyph(x, y) {
    const lx = x / S
    const ly = y / S
    // haste vertical do R: x 175..230, y 140..380
    if (lx >= 175 && lx <= 230 && ly >= 140 && ly <= 380) return true
    // perna diagonal: do meio (230, 265) descendo até (330, 380)
    if (ly >= 265 && ly <= 380) {
      const t = (ly - 265) / (380 - 265)
      const cx = 230 + t * 95
      if (Math.abs(lx - cx) <= 30) return true
    }
    // pança do R: círculo em (270, 210) raio 75
    if (dist(lx, ly, 270, 210) <= 75 && ly <= 265) return true
    // furo da pança (contra-forma off-white)
    if (dist(lx, ly, 272, 212) <= 36 && ly <= 240) return 'hole'
    return false
  }

  // Broto de recomeço (folhinha acima do R)
  function inSprout(x, y) {
    const lx = x / S
    const ly = y / S
    // talinho
    if (lx >= 262 && lx <= 274 && ly >= 92 && ly <= 140) return true
    // folha esquerda
    if (dist(lx, ly, 240, 108) <= 24 && lx < 262) return true
    // folha direita
    if (dist(lx, ly, 296, 108) <= 24 && lx > 274) return true
    return false
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      let r, g, b, a
      if (!inRoundedRect(x + 0.5, y + 0.5)) {
        a = 0
        r = g = b = 0
      } else {
        a = 255
        // leve gradiente diagonal de verde-água
        const t = (x / size + y / size) / 2
        const base = [
          Math.round(PRIMARY[0] + (PRIMARY_DARK[0] - PRIMARY[0]) * t),
          Math.round(PRIMARY[1] + (PRIMARY_DARK[1] - PRIMARY[1]) * t),
          Math.round(PRIMARY[2] + (PRIMARY_DARK[2] - PRIMARY[2]) * t),
        ]
        // círculo de fundo sutil (marca circular dentro do quadrado)
        const glyph = inGlyph(x + 0.5, y + 0.5)
        const sprout = inSprout(x + 0.5, y + 0.5)
        if (glyph === 'hole') {
          ;[r, g, b] = base // furo: mantém fundo
        } else if (glyph) {
          ;[r, g, b] = TEXT
        } else if (sprout) {
          ;[r, g, b] = OFFWHITE
        } else {
          ;[r, g, b] = base
        }
      }
      rgba[idx] = r
      rgba[idx + 1] = g
      rgba[idx + 2] = b
      rgba[idx + 3] = a
    }
  }
  return encodePng(size, size, rgba)
}

mkdirSync('public', { recursive: true })
for (const size of [192, 512]) {
  writeFileSync(`public/pwa-icon-${size}.png`, drawIcon(size))
}
writeFileSync('public/apple-touch-icon.png', drawIcon(180))
console.log('Ícones PWA gerados: 192, 512 e apple-touch-icon (180).')
