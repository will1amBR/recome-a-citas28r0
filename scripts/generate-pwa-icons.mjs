/**
 * Gera os ícones PWA do Recomeça (PNG 192/512 e maskable 512), sem dependências
 * externas. Pode ser executado direto (node scripts/generate-pwa-icons.mjs) e
 * também é chamado no build pelo plugin em vite.config.ts — assim os PNGs
 * existem mesmo sem shell disponível.
 *
 * Estratégia: se `sharp` estiver instalado, rasteriza o SVG real (public/icon.svg).
 * Sem sharp, desenha um motivo equivalente (quadrado verde arredondado, círculo
 * claro central e anel escuro — sol de recomeço) pixel a pixel em PNG RGBA válido.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const svgPath = resolve(root, 'public/icon.svg')
const outDir = resolve(root, 'public')

const GREEN = [127, 191, 168] // #7FBFA8
const LIGHT = [232, 243, 236] // #E8F3EC
const DARK = [47, 74, 62] // #2F4A3E

function crc32(buf) {
  let crc = 0xffffffff
  for (let n = 0; n < buf.length; n++) {
    let c = (crc ^ buf[n]) & 0xff
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    crc = (crc >>> 8) ^ c
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function drawIconBytes(size, { maskable = false } = {}) {
  const px = Buffer.alloc(size * size * 4)
  const radius = maskable ? 0 : size * 0.18
  const cx = size / 2
  const cy = size / 2
  const innerR = size * (maskable ? 0.28 : 0.34)
  const ringR = size * (maskable ? 0.4 : 0.48)
  const ringW = size * 0.055

  const insideRounded = (x, y) => {
    if (maskable) return true
    const dx = Math.max(Math.abs(x - cx) - (size / 2 - radius), 0)
    const dy = Math.max(Math.abs(y - cy) - (size / 2 - radius), 0)
    return dx * dx + dy * dy <= radius * radius
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      if (!insideRounded(x, y)) {
        px[i + 3] = 0
        continue
      }
      const d = Math.hypot(x - cx, y - cy)
      let cr = GREEN[0]
      let cg = GREEN[1]
      let cb = GREEN[2]
      if (d <= innerR) {
        cr = LIGHT[0]
        cg = LIGHT[1]
        cb = LIGHT[2]
      } else if (Math.abs(d - ringR) <= ringW / 2) {
        cr = DARK[0]
        cg = DARK[1]
        cb = DARK[2]
      }
      px[i] = cr
      px[i + 1] = cg
      px[i + 2] = cb
      px[i + 3] = 255
    }
  }
  return px
}

function buildPng(size, opts) {
  const px = drawIconBytes(size, opts)
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // filter: none
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

export const PWA_ICON_FILES = [
  { file: 'icon-192.png', size: 192, opts: {} },
  { file: 'icon-512.png', size: 512, opts: {} },
  { file: 'icon-maskable-512.png', size: 512, opts: { maskable: true } },
]

/** Gera os três PNGs em /public. Tenta sharp (SVG real); senão, PNG desenhado. */
export async function generatePwaIcons() {
  try {
    const { default: sharp } = await import('sharp')
    const svg = readFileSync(svgPath)
    for (const { file, size } of PWA_ICON_FILES) {
      await sharp(svg, { density: 300 })
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(resolve(outDir, file))
    }
    return 'sharp'
  } catch {
    for (const { file, size, opts } of PWA_ICON_FILES) {
      writeFileSync(resolve(outDir, file), buildPng(size, opts))
    }
    return 'fallback'
  }
}

// Execução direta: node scripts/generate-pwa-icons.mjs
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  generatePwaIcons().then((mode) => console.log(`Ícones PWA gerados (${mode})`))
}
