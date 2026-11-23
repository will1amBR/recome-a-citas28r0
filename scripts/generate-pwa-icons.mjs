/**
 * Gera os ícones PWA do Recomeça (PNG 192/512 e maskable 512) — sem dependências
 * externas (apenas zlib do Node para o deflate do PNG). Pode ser executado
 * direto: node scripts/generate-pwa-icons.mjs
 *
 * As formas abaixo reproduzem exatamente o desenho de public/icon.svg
 * (quadrado verde com gradiente, letra "R" escura, círculo claro e duas
 * "asas" claras), rasterizadas pixel a pixel com superamostragem 2×2 para
 * bordas suaves. No maskable, o canto arredondado vira quadrado cheio e o
 * motivo é reduzido para caber na zona segura (80%).
 */
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public')

// Paleta de public/icon.svg
const GRAD_A = [143, 204, 174] // #8FCCAE
const GRAD_B = [127, 191, 168] // #7FBFA8
const DARK = [47, 74, 62] // #2F4A3E
const LIGHT = [143, 204, 174] // #8FCCAE (círculo)
const CREAM = [253, 250, 245] // #FDFAF5 (asas)

const BASE = 512 // viewBox do icon.svg

// Mesmo "d" do path da letra R em public/icon.svg
const R_PATH =
  'M170 390V160c0-10 8-18 18-18h96c52 0 90 36 90 84 0 38-22 68-56 79l64 94c5 8-1 19-10 19h-36c-6 0-11-3-14-8l-59-88h-49v68c0 9-7 16-16 16h-12c-9 0-16-7-16-16z'
// Círculo central
const CIRCLE = { cx: 272, cy: 224, r: 38 }
// Asas (segunda com 85% de opacidade)
const WING_RIGHT = 'M272 138c0-8 6-14 14-14 34 0 62 26 62 60 0 8-6 14-14 14-34 0-62-26-62-60z'
const WING_LEFT = 'M272 138c0-8-6-14-14-14-34 0-62 26-62 60 0 8 6 14 14 14 34 0 62-26 62-60z'

// ---------- PNG encoding (sem dependências) ----------

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

/** Codifica um framebuffer RGBA (Buffer de length size*size*4) em PNG. */
function encodePng(size, px) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // filtro: none
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------- Mini parser de path SVG (M/L/H/V/C/Z + relativos) ----------

function pathToPolygons(d) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:[eE][+-]?\d+)?/g) || []
  const polygons = []
  let poly = []
  let cur = [0, 0]
  let start = [0, 0]
  let i = 0
  let prevCmd = ''
  const num = () => Number(tokens[i++])

  const push = (p) => poly.push(p)
  const line = (p) => push(p)
  const cubic = (c1, c2, to) => {
    const N = 24
    for (let s = 1; s <= N; s++) {
      const t = s / N
      const mt = 1 - t
      push([
        mt * mt * mt * cur[0] +
          3 * mt * mt * t * c1[0] +
          3 * mt * t * t * c2[0] +
          t * t * t * to[0],
        mt * mt * mt * cur[1] +
          3 * mt * mt * t * c1[1] +
          3 * mt * t * t * c2[1] +
          t * t * t * to[1],
      ])
    }
  }
  const close = () => {
    if (poly.length > 2) polygons.push(poly)
    poly = []
  }

  while (i < tokens.length) {
    let cmd = tokens[i]
    if (/[a-zA-Z]/.test(cmd)) i++
    else cmd = prevCmd || 'L'
    const rel = cmd === cmd.toLowerCase()
    const C = cmd.toUpperCase()
    if (C === 'M') {
      close()
      cur = [num() + (rel ? cur[0] : 0), num() + (rel ? cur[1] : 0)]
      start = [...cur]
      push([...cur])
      prevCmd = rel ? 'l' : 'L'
      continue
    }
    if (C === 'L') {
      cur = [num() + (rel ? cur[0] : 0), num() + (rel ? cur[1] : 0)]
      line([...cur])
    } else if (C === 'H') {
      cur = [num() + (rel ? cur[0] : 0), cur[1]]
      line([...cur])
    } else if (C === 'V') {
      cur = [cur[0], num() + (rel ? cur[1] : 0)]
      line([...cur])
    } else if (C === 'C') {
      const c1 = [num() + (rel ? cur[0] : 0), num() + (rel ? cur[1] : 0)]
      const c2 = [num() + (rel ? cur[0] : 0), num() + (rel ? cur[1] : 0)]
      const to = [num() + (rel ? cur[0] : 0), num() + (rel ? cur[1] : 0)]
      cubic(c1, c2, to)
      cur = to
    } else if (C === 'Z') {
      cur = [...start]
      close()
      prevCmd = ''
      continue
    }
    prevCmd = C
  }
  close()
  return polygons
}

// ---------- Rasterização ----------

const R_POLY = pathToPolygons(R_PATH)
const WING_RIGHT_POLY = pathToPolygons(WING_RIGHT)
const WING_LEFT_POLY = pathToPolygons(WING_LEFT)

/** Ponto dentro de polígono (even-odd — suficiente para estas formas simples). */
function insidePolygons(x, y, polys) {
  let inside = false
  for (const poly of polys) {
    for (let a = 0, b = poly.length - 1; a < poly.length; b = a++) {
      const [xa, ya] = poly[a]
      const [xb, yb] = poly[b]
      if (ya > y !== yb > y && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) inside = !inside
    }
  }
  return inside
}

/** BBox em coordenadas de 512 para pular pixels longe da forma. */
function bbox(polys) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const poly of polys)
    for (const [x, y] of poly) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  return [minX, minY, maxX, maxY]
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

function drawIcon(size, { maskable = false } = {}) {
  const px = Buffer.alloc(size * size * 4)
  const scale = size / BASE
  // No maskable o motivo é desenhado em 80% e centralizado (zona segura).
  const motifScale = maskable ? 0.8 * scale : scale
  const offset = maskable ? (size - BASE * motifScale) / 2 : 0
  const SS = 2 // superamostragem 2×2
  const radius = maskable ? 0 : 96 * scale
  const corner = size / 2 - radius

  const toBase = (x, y) => [(x - offset) / motifScale, (y - offset) / motifScale]

  const rBbox = bbox(R_POLY).map((v, idx) =>
    idx < 2 ? v * motifScale + offset : v * motifScale + offset,
  )
  const wrBbox = bbox(WING_RIGHT_POLY).map((v) => v * motifScale + offset)
  const wlBbox = bbox(WING_LEFT_POLY).map((v) => v * motifScale + offset)
  const circleBbox = [
    CIRCLE.cx * motifScale + offset - CIRCLE.r * motifScale,
    CIRCLE.cy * motifScale + offset - CIRCLE.r * motifScale,
    CIRCLE.cx * motifScale + offset + CIRCLE.r * motifScale,
    CIRCLE.cy * motifScale + offset + CIRCLE.r * motifScale,
  ]

  const inBbox = (bb, x, y) => x >= bb[0] - 1 && x <= bb[2] + 1 && y >= bb[1] - 1 && y <= bb[3] + 1

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Antialiasing por média de subamostras
      let aSum = 0
      let rSum = 0
      let gSum = 0
      let bSum = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const sxp = x + (sx + 0.5) / SS
          const syp = y + (sy + 0.5) / SS
          // Máscara do fundo (canto arredondado ou quadrado cheio)
          let alpha = 1
          if (!maskable && radius > 0) {
            const dx = Math.max(Math.abs(sxp - size / 2) - corner, 0)
            const dy = Math.max(Math.abs(syp - size / 2) - corner, 0)
            if (dx * dx + dy * dy > radius * radius) alpha = 0
          }
          if (alpha === 0) continue
          const [bx, by] = toBase(sxp, syp)
          // Gradiente diagonal do fundo
          let col = mix(GRAD_A, GRAD_B, Math.min(1, Math.max(0, (bx + by) / (2 * BASE))))
          const circleHit =
            inBbox(circleBbox, sxp, syp) && Math.hypot(bx - CIRCLE.cx, by - CIRCLE.cy) <= CIRCLE.r
          if (circleHit) {
            col = LIGHT
          } else if (inBbox(rBbox, sxp, syp) && insidePolygons(bx, by, R_POLY)) {
            col = DARK
          }
          // Asas: direita opaca, esquerda 85% (blend sobre o que está abaixo)
          if (inBbox(wrBbox, sxp, syp) && insidePolygons(bx, by, WING_RIGHT_POLY)) {
            col = CREAM
          } else if (inBbox(wlBbox, sxp, syp) && insidePolygons(bx, by, WING_LEFT_POLY)) {
            col = mix(col, CREAM, 0.85)
          }
          rSum += col[0]
          gSum += col[1]
          bSum += col[2]
          aSum += alpha * 255
        }
      }
      const n = SS * SS
      const idx = (y * size + x) * 4
      px[idx] = Math.round(rSum / n)
      px[idx + 1] = Math.round(gSum / n)
      px[idx + 2] = Math.round(bSum / n)
      px[idx + 3] = Math.round(aSum / n)
    }
  }
  return px
}

export const PWA_ICON_FILES = [
  { file: 'icon-192.png', size: 192, opts: {} },
  { file: 'icon-512.png', size: 512, opts: {} },
  { file: 'icon-maskable-512.png', size: 512, opts: { maskable: true } },
]

/** Gera os três PNGs em /public. */
export async function generatePwaIcons() {
  for (const { file, size, opts } of PWA_ICON_FILES) {
    writeFileSync(resolve(outDir, file), encodePng(size, drawIcon(size, opts)))
  }
  return 'procedural'
}

// Execução direta: node scripts/generate-pwa-icons.mjs
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  generatePwaIcons().then((mode) => console.log(`Ícones PWA gerados (${mode})`))
}
